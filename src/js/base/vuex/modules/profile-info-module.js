import {
  getToken,
} from '~jsDefinePath/general';
import { AJAX_URL } from '~jsDefinePath/ajax-url';
import { apiCaller } from '~jsHelperPath/service/ApiHandler';

const MODULE_NAME = 'profileInfoModule';

const MUTATIONS_KEY = {
  setPointUser: 'setPointUser',
  updateMobileSignUp:'updateMobileSignUp'
};

const COMMIT_KEY = {
  setPointUser: MODULE_NAME + '/' + MUTATIONS_KEY.setPointUser,
  setMobileSignUp: MODULE_NAME + '/' + MUTATIONS_KEY.setMobileSignUp,
};

const profileInfoModule = {
  namespaced: true,

  state: {
    pointUser: null,
    mobileSignUp: null
  },

  getters: {

    pointUser(state){
      return state.pointUser
    },
    mobileSignUp(state){
      return state.mobileSignUp
    }

  },

  mutations: {
    [MUTATIONS_KEY.setPointUser](state, pointUser) {
      state.pointUser = pointUser;
    },
    [MUTATIONS_KEY.updateMobileSignUp](state, mobileSignUp) {
      state.mobileSignUp = mobileSignUp;
    },

  },
  actions: {
    setMobileSignUp({commit}, mobile) {
      commit(MUTATIONS_KEY.updateMobileSignUp, mobile);
    },
    async getPointUser({ commit }) {
      // EventBus.emit('IS_SHOW_ROUTER_LOADING', true);
      try {
      let res = await apiCaller({
            metaUrl: AJAX_URL.myPoint.total,
            method: 'GET',
            data: {
              limit: 10,
              page: 1,
            },
            headers: {
                'Authorization': getToken()
            },
            dataType: 'json',
          })
          commit(MUTATIONS_KEY.setPointUser, res.data);
          // EventBus.emit('IS_SHOW_ROUTER_LOADING', false);
      } catch (error) {
        console.log('error :>> ', error);
        setTimeout(()=>{
          EventBus.emit('IS_SHOW_ROUTER_LOADING', false);
          // EventBus.emit('REDIRECT-404-PAGE');
        },3500)
      }
    },
  }
};

export {
  MODULE_NAME,
  MUTATIONS_KEY,
  COMMIT_KEY,
  profileInfoModule,
};
