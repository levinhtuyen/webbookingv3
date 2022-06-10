import {
  _,
} from '~jsPath/lib/lib-manager';

const MODULE_NAME = 'hotelListPageModule';

const MUTATIONS_KEY = {
  setObjQueryString: 'setObjQueryString',
  setFacilityList: 'setFacilityList',
};

const COMMIT_KEY = {
  setObjQueryString: MODULE_NAME + '/' + MUTATIONS_KEY.setObjQueryString,
  setFacilityList: MODULE_NAME + '/' + MUTATIONS_KEY.setFacilityList,
};

const ACTIONS_KEY = {};

const DISPATH_KEY = {};

const pageModule = {
  namespaced: true,

  state: {
    objQueryString: {},
    facilityList: [],
  },

  getters: {},

  mutations: {
    // NOTE - setCurLocationSelected
    [MUTATIONS_KEY.setObjQueryString](state, objQueryString) {
      state.objQueryString = objQueryString;
    },

    // NOTE - setCurLocationSelected
    [MUTATIONS_KEY.setFacilityList](state, facilityList) {
      state.facilityList = facilityList;
    },
  },

  actions: {},
};

export {
  MODULE_NAME,
  MUTATIONS_KEY,
  COMMIT_KEY,
  ACTIONS_KEY,
  DISPATH_KEY,
  pageModule,
};
