import {
  LANGUAGE_DEFAULT,
} from '~jsDefinePath/general';
import {
  _,
} from '~jsPath/lib/lib-manager';
import {
  LOCAL_STORAGE_KEY
} from '~jsPath/define/local-storage';
import {
  i18n,
} from '~jsBasePath/vue-i18n/translate';

const MODULE_NAME = 'pageInfoModule';

const MUTATIONS_KEY = {
  setLanguage: 'setLanguage',
};

const COMMIT_KEY = {
  setLanguage: MODULE_NAME + '/' + MUTATIONS_KEY.setLanguage,
};

const ACTIONS_KEY = {
};

const DISPATH_KEY = {
};

const pageInfoModule = {
  namespaced: true,

  state: {
    // NOTE - store language for all page
    language: localStorage.getItem(LOCAL_STORAGE_KEY.G2J_TRANSLATE_LANGUAGE) || LANGUAGE_DEFAULT,
  },

  getters: {
  },

  mutations: {
    // NOTE - setLanguage
    [MUTATIONS_KEY.setLanguage](state, language) {
      state.language = language;

      if(language !== localStorage.getItem(LOCAL_STORAGE_KEY.G2J_TRANSLATE_LANGUAGE)) {
        localStorage.setItem(LOCAL_STORAGE_KEY.G2J_TRANSLATE_LANGUAGE, language);

        i18n.locale = language;
      }
    },
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
  pageInfoModule,
};
