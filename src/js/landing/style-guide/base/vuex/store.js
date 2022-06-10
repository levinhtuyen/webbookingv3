import {
  vue,
  vuex
} from '~jsLibPath/lib-manager';
import {
  ENV,
  ARR_ENV,
} from '~jsDefinePath/general';
import {
  pageInfoModule,
} from './modules/page-info-module';

vue.use(vuex);

vue.config.devtools = (ENV === ARR_ENV.development);

const store = new vuex.Store({
  strict: true,
  modules: {
    pageInfoModule,
  },
});

export {
  store,
};
console.log('test');
