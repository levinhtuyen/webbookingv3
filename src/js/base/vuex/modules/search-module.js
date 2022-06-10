import { lodash as _ } from '~jsPath/lib/lib-manager';

const MODULE_NAME = 'pageSearchModule';

const MUTATIONS_KEY = {
  setResManagementData: 'setResManagementData',
};

const COMMIT_KEY = {
  setResManagementData: MODULE_NAME + '/' + MUTATIONS_KEY.setResManagementData,
};

const pageSearchModule = {
  namespaced: true,

  state: {
    // imageUrl: null,
    resManagementData : [],

    listInfo          : [],
    totalInfo         : [],

    searchInfo        : [],

    checkboxInfo      : [],
    filter01Info      : '',
    filter02Info      : ''
  },

  getters: {
    listInfo          : state => state.filter02Info,
    totalInfo         : state => state.totalInfo,

    searchInfo        : state => state.searchInfo,
    checkboxInfo      : state => state.checkboxInfo,
    filter01Info      : state => state.filter01Info,
    filter02Info      : state => state.filter02Info
  },

  mutations: {
    [MUTATIONS_KEY.setResManagementData](state, resManagementData) {
      state.resManagementData = resManagementData;
    },

    setListInfo(state, listInfo) {
      state.listInfo    = listInfo;
    },

    setTotalInfo(state, totalInfo) {
      state.totalInfo        = totalInfo.meta;
    },

    setSearchInfo(state, searchInfo) {
      state.searchInfo       = searchInfo;
    },

    setCheckboxInfo(state, checkboxInfo) {
      state.checkboxInfo     = checkboxInfo;
    },

    setFilter01Info(state, filter01Info) {
      state.filter01Info     = filter01Info;
    },

    setFilter02Info(state, filter02Info) {
      state.filter02Info      = filter02Info;
    }
  },

  actions: {
    setSearchInfo({ commit }, searchInfo) {
      commit("setSearchInfo", searchInfo);
    },

    setCheckboxInfo({ commit }, checkboxInfo) {
      commit("setCheckboxInfo", checkboxInfo);
    },

    setFilter01Info({ commit }, filter01Info) {
      commit("setFilter01Info", filter01Info);
    },

    setFilter02Info({ commit }, filter02Info) {
      commit("setFilter02Info", filter02Info);
    }
  }
};

export {
  MODULE_NAME,
  MUTATIONS_KEY,
  COMMIT_KEY,
  pageSearchModule
};