import { apiCaller } from '~jsHelperPath/service/ApiHandler';
import { lodash as _ } from '~jsPath/lib/lib-manager';
import { AJAX_URL } from '~jsDefinePath/ajax-url';
import {
  EVENT_BUS_KEY
} from '~jsDefinePath/event-bus';

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
      username        : 1,
      password        : '',
    }
  },

  getters: {
    tokenInfo     : state => state.tokenInfo,
    basicInfo     : state => state.basicInfo
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
          mobile    : state.basicInfo.username,
          password  : state.basicInfo.password,
          remember  : 1,
          token     : "",
          type      : 1,
        },
        method: 'POST',
        dataType: 'json',
        error() {
          commit("isLoadingDataFailure");
        },
        success(objResponse) {
          if(
            !objResponse ||
            objResponse.error ||
            !objResponse.data
          ) {
            return;
          }
          let data = objResponse?.data ?? [];
          localStorage.setItem('token', data.accessToken);
          localStorage.setItem('expiresAt', JSON.stringify(data.expiresAt));
          // localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
          // localStorage.setItem(
          //     "userInfo",
          //     btoa(JSON.stringify(data.userInfo))
          //   );
          localStorage.setItem(
            "userInfo",
            btoa(unescape(encodeURIComponent(JSON.stringify(data.userInfo))))
          );
          EventBus.emit(EVENT_BUS_KEY.REDIRECT_AFTER_LOGIN_SUCCESS);

          commit("onProcessingIsLoading");
        },
        complete() {},
      });
    }, // submitManual()

    getTokenSocial({ commit }, data) {
      let form = {};
      let token = data.token;
      if(data.domain == 'facebook') {
          form = {
            token       : token.accessToken                  ? token.accessToken                  : '',
            expiresAt   : token.data_access_expiration_time  ? token.data_access_expiration_time  : '',
            type        : 2
          }
      } else {
          form = {
            token       : token.access_token  ? token.access_token    : '',
            expiresAt   : token.expires_at    ? token.expires_at      : '',
            type        : 3
          }
      }
      commit("isLoading");
      console.log("form :", form);
      apiCaller({
        metaUrl: AJAX_URL.login.signIn,
        data: {
          mobile  : "",
          password: "",
          remember: 1,
          token   : form.token,
          type    : form.type,
        },
        method: 'POST',
        dataType: 'json',
        error() {
          commit("isLoadingDataFailure");
        },
        success(objResponse) {
          if(
            !objResponse ||
            objResponse.error ||
            !objResponse.data
          ) {
            return;
          }
          let data = objResponse?.data ?? [];
          localStorage.setItem('token', data.accessToken);
          localStorage.setItem('expiresAt', JSON.stringify(data.expiresAt));
          localStorage.setItem('userInfo', JSON.stringify(data.userInfo));

          EventBus.emit(EVENT_BUS_KEY.REDIRECT_AFTER_LOGIN_SUCCESS, data.userInfo);

          commit("onProcessingIsLoading");
        },
        complete() {},
      });

      //     commit("setToken", form);
    },

    logoutUser({ commit }) {
      commit("clearLoginData");
      localStorage.clear();
      router.push("/login");
    }
  }
};

export {
  MODULE_NAME,
  MUTATIONS_KEY,
  COMMIT_KEY,
  pageLoginSocialModule,
};
