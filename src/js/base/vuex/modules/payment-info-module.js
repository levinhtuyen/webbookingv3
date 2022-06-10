import { _ } from '~jsPath/lib/lib-manager';

import {
  LOCAL_STORAGE_KEY
} from '~jsPath/define/local-storage';
import { AJAX_URL } from '~jsDefinePath/ajax-url';

const MODULE_NAME = 'paymentInfoModule';

const MUTATIONS_KEY = {
  setPaymentInfo: 'setPaymentInfo',
};

const COMMIT_KEY = {
  setPaymentInfo: MODULE_NAME + '/' + MUTATIONS_KEY.setPaymentInfo,
  // setRoomActive: MODULE_NAME + '/' + MUTATIONS_KEY.setRoomActive
};

const paymentInfoModule = {
  namespaced: true,

  state: {
    paymentInfo: null,

  },

  getters: {
    paymentInfo(state) {
      return state.paymentInfo;
    },

  },

  mutations: {
    [MUTATIONS_KEY.setPaymentInfo](state, paymentInfo) {
      state.paymentInfo = paymentInfo;
    },

  },
  actions: {
    setPayment({commit}, info) {
       commit(MUTATIONS_KEY.setPaymentInfo, info);
    },

  }
};

export {
  MODULE_NAME,
  MUTATIONS_KEY,
  COMMIT_KEY,
  paymentInfoModule,
};
