import {
  Vue,
} from '~jsLibPath/lib-manager';
import {
  ENV,
  ARR_ENV,
  IS_CHROME_BROWSER
} from '~jsDefinePath/general';
import {
  pageInfoModule,
} from './modules/page-info-module';

Vue.use(window.Vuex);

Vue.config.devtools = (
  ENV !== ARR_ENV.production &&
  IS_CHROME_BROWSER
);

const store = new window.Vuex.Store({
  strict: true,
  modules: {
    pageInfoModule,
  },
});

export {
  store,
};
