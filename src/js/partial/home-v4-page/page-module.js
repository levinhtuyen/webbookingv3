import {
  _,
} from '~jsLibPath/lib-manager';

const MODULE_NAME = 'homePageModule';

const MUTATIONS_KEY = {
  setLocationSelectedInfo: 'setLocationSelectedInfo',
  setCityList: 'setCityList',
};

const COMMIT_KEY = {
  [MUTATIONS_KEY.setLocationSelectedInfo]: MODULE_NAME + '/' + MUTATIONS_KEY.setLocationSelectedInfo,
  [MUTATIONS_KEY.setCityList]: MODULE_NAME + '/' + MUTATIONS_KEY.setCityList,
};

const ACTIONS_KEY = {
};

const DISPATH_KEY = {
};

const pageModule = {
  namespaced: true,

  state: {
    locationSelectedInfo: {},
    cityList: [],
  },

  getters: {
    hasCityList(state) {
      return !_.isEmpty(state.cityList);
    }, // hasCityList
  },

  mutations: {
    [MUTATIONS_KEY.setLocationSelectedInfo](state, locationSelectedInfo) {
      state.locationSelectedInfo = locationSelectedInfo;
    }, // setLocationSelectedInfo

    [MUTATIONS_KEY.setCityList](state, cityList) {
      state.cityList = cityList;
    }, // setCityList
  },

  actions: {
  },
};

export {
  MODULE_NAME,
  MUTATIONS_KEY,
  COMMIT_KEY,
  ACTIONS_KEY,
  DISPATH_KEY,
  pageModule,
};
