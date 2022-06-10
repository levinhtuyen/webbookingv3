import { lodash as _ } from '~jsPath/lib/lib-manager';

const MODULE_NAME = 'pageSignUpModule';

const MUTATIONS_KEY = {
  setResManagementData: 'setResManagementData',
};

const COMMIT_KEY = {
  setResManagementData: MODULE_NAME + '/' + MUTATIONS_KEY.setResManagementData,
};

const pageSignUpModule = {
  namespaced: true,

  state: {
    // imageUrl: null,
    resManagementData : [],

    // basic info
    basicInfo: {
      mobile      : '',
      password    : '',
      email       : '',
      verifyCode  : '',
      countryCode : '',
      isoCode     : '',
      viaApp      : '',
      token       : ''
    }
  },

  getters: {
    tokenInfo     : state => state.tokenInfo,
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

    setBasicInfo(state, basicInfo) {
      state.basicInfo.mobile      = basicInfo.mobile;
      state.basicInfo.password    = basicInfo.password;
      state.basicInfo.email       = basicInfo.email;
      state.basicInfo.verifyCode  = basicInfo.verifyCode;
      state.basicInfo.countryCode = basicInfo.countryCode;
      state.basicInfo.isoCode     = basicInfo.isoCode;
      state.basicInfo.viaApp      = basicInfo.viaApp;
      state.basicInfo.token       = basicInfo.token;
    }
  },

  actions: {
    setBasicInfo({ commit }, basicInfo) {
        commit("setBasicInfo", basicInfo);
    }
  }
};

export {
  MODULE_NAME,
  MUTATIONS_KEY,
  COMMIT_KEY,
  pageSignUpModule,
};
