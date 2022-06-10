import { apiCaller } from '~jsHelperPath/service/ApiHandler';
import { AJAX_URL } from '~jsDefinePath/ajax-url';
import {
  ROUTER_NAME,
} from '~jsBasePath/vue-router/router-define';
import {
  EVENT_BUS_KEY,
} from '~jsDefinePath/event-bus';
import {
  G2JRouter,
  getG2JRoute,
} from '~jsHelperPath/util/HandleRouterGlobal';

const MODULE_NAME = 'pageLoginSocialModule';

const MUTATIONS_KEY = {
  setResManagementData: 'setResManagementData',
};

const COMMIT_KEY = {
  setResManagementData: MODULE_NAME + '/' + MUTATIONS_KEY.setResManagementData,
};

const pageLoginSocialModule = {
  namespaced: true,

  state: {
    // imageUrl: null,
    resManagementData : [],

    // Login social
    tokenInfo         : [],
    // Login basic
    basicInfo: {
      username        : '',
      password        : '',
    },
    // Login error
    errorInfo         : '',
    errorInfoSocial   : '',
  },

  getters: {
    tokenInfo     : state => state.tokenInfo,
    basicInfo     : state => state.basicInfo,
    errorInfo     : state => state.errorInfo,
    errorInfoSocial     : state => state.errorInfoSocial
  },

  mutations: {
    [MUTATIONS_KEY.setResManagementData](state, resManagementData) {
      state.resManagementData = resManagementData;
    },

    // Trạng thái load dữ liệu
    isLoading() {
      EventBus.emit('IS_SHOW_ROUTER_LOADING', true);
    },
    onProcessingIsLoading() {
      EventBus.emit('IS_SHOW_ROUTER_LOADING', false);
    },
    isLoadingDataFailure() {
      EventBus.emit('IS_SHOW_ROUTER_LOADING', false);
    },

    setToken(state, tokenInfo) {
      state.tokenInfo       = tokenInfo;
      localStorage.setItem('token', tokenInfo);
    },

    setBasicInfo(state, basicInfo) {
      state.errorInfo                = [];
      state.basicInfo.username       = basicInfo.username;
      state.basicInfo.password       = basicInfo.password;
    },

    clearLoginData(state) {
      state.userDetails = null;
      state.err         = null;
      state.loading     = false;
      state.isLoggedIn  = false;
    },

    setReset(state) {
      state.basicInfo.username = '';
      state.basicInfo.password = '';
    }
  },

  actions: {
    setBasicInfo({ commit }, basicInfo) {
      commit("setBasicInfo", basicInfo);
    },

    setReset({ commit }) {
      commit("setReset");
    },

    submitManual({ commit, state }) {
      commit("isLoading");
      apiCaller({
        metaUrl: AJAX_URL.login.signIn,
        data: {
          email     : state.basicInfo.username,
          password  : md5(state.basicInfo.password),
          remember  : 1,
          token     : "",
          viaApp    : 1,
        },
        method: 'POST',
        dataType: 'json',
        error(err) {
          state.errorInfo = []
          commit("isLoadingDataFailure");
          // state.errorInfo = err.responseJSON.error[0].code; // 7 : sai mật khẩu; 6: tài khoản không tồn tại
          // state.errorInfo.push({
          //   code: 99 // Email & password sai
          // });
          state.errorInfo = err.response?.data.error || []

        },
        success(objResponse) {
          if(
            !objResponse ||
            objResponse.error ||
            !objResponse.data
          ) {
            commit("isLoadingDataFailure");
            state.errorList = objResponse.error;
            return;
          }
          let data = objResponse?.data ?? [];
          localStorage.setItem('token', data.accessToken);
          localStorage.setItem('expiresAt', JSON.stringify(data.expiresAt));
          // localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
          // localStorage.setItem(
          //     "userInfo",
          //     btoa(JSON.stringify(data.userInfo))
          // );
            localStorage.setItem(
            "userInfo",
            btoa(unescape(encodeURIComponent(JSON.stringify(data.userInfo))))
          );
          const g2jRoute = getG2JRoute();

          if(g2jRoute.params.redirect) {
            G2JRouter.replace(g2jRoute.params.redirect);
          } else {
            G2JRouter.replace({ name: ROUTER_NAME['home-page'] });
          }

          EventBus.emit(EVENT_BUS_KEY.UPDATE_USER_PROFILE);

          commit("onProcessingIsLoading");
        },
        complete() {},
      });
    }, // submitManual()

    getTokenSocial({ commit, state, dispatch }, data) {
      let form = {};
      let token = data.token;

      if(data.domain == 'facebook') {
          form = {
            token       : token.accessToken                  ? token.accessToken                : '',
            expiresAt   : token.data_access_expiration_time  ? token.data_access_expiration_time  : '',
            viaApp      : 2
          }
      } else {
          form = {
            token       : token.id_token  ? token.id_token    : '',
            expiresAt   : token.expires_at    ? token.expires_at      : '',
            viaApp      : 3
          }
      }
      localStorage.setItem('viaApp', form.viaApp);
      commit("isLoading");
      apiCaller({
        metaUrl: AJAX_URL.login.signIn,
        data: {
          email   : "",
          password: "",
          remember: 1,
          token   : form.token,
          viaApp  : Number(form.viaApp),
        },
        method: 'POST',
        dataType: 'json',
        error(err) {
          commit("isLoadingDataFailure");
          // if(err.responseJSON.error[0].code == 6) {
            // state.errorInfoSocial = err.responseJSON.error[0].code; // 6: Tài khoản không tồn tại trên hệ thống
            state.errorInfoSocial = 6; // 6: Tài khoản không tồn tại trên hệ thống
            localStorage.setItem('tokenSocial', form.token);
            G2JRouter.replace({
              name: ROUTER_NAME['sign-up-page'],
            });
          // }
        },
        success(objResponse) {
          if(
            !objResponse ||
            objResponse.error ||
            !objResponse.data
          ) {
            commit("isLoadingDataFailure");
            return;
          }

          let data = objResponse?.data ?? [];
          localStorage.setItem('token', data.accessToken);
          localStorage.setItem('expiresAt', JSON.stringify(data.expiresAt));
          // localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
          localStorage.setItem(
            "userInfo",
            btoa(JSON.stringify(data.userInfo))
          );
          const g2jRoute = getG2JRoute();

          if(g2jRoute.params.redirect) {
            G2JRouter.replace(g2jRoute.params.redirect);
          } else {
            G2JRouter.replace({ name: ROUTER_NAME['home-page'] });
          }

          EventBus.emit(EVENT_BUS_KEY.UPDATE_USER_PROFILE);

          commit("onProcessingIsLoading");
        },
        complete() {},
      });


      //     commit("setToken", form);
    },
  }
};

export {
  MODULE_NAME,
  MUTATIONS_KEY,
  COMMIT_KEY,
  pageLoginSocialModule,
};
