import { lodash as _ } from '~jsPath/lib/lib-manager';

const MODULE_NAME = 'pageInfoModule';

const MUTATIONS_KEY = {
  setImageUrl: 'setImageUrl',
};

const COMMIT_KEY = {
  setImageUrl: MODULE_NAME + '/' + MUTATIONS_KEY.setImageUrl,
};

const pageInfoModule = {
  namespaced: true,

  state: {
    imageUrl: null,
  },

  getters: {
  },

  mutations: {
    [MUTATIONS_KEY.setImageUrl](state, imageUrl) {
      state.imageUrl = imageUrl;
    },
  },
};

export {
  MODULE_NAME,
  MUTATIONS_KEY,
  COMMIT_KEY,
  pageInfoModule,
};
