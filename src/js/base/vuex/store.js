import {
  Vue,
} from '~jsLibPath/lib-manager';
import {
  ENV,
  ARR_ENV,
  IS_MOBILE,
  IS_CHROME_BROWSER
} from '~jsDefinePath/general';
import {
  pageInfoModule,
} from './modules/page-info-module';
import {
  hotelInfoModule
} from './modules/hotel-info-module';
import {
  paymentInfoModule
} from './modules/payment-info-module';
import {
  profileInfoModule
} from './modules/profile-info-module';

Vue.use(window.Vuex);

Vue.config.devtools = (
  ENV !== ARR_ENV.production &&
  IS_CHROME_BROWSER
);

const store = new window.Vuex.Store({
  strict: true,
  modules: {
    pageInfoModule,
    hotelInfoModule,
    paymentInfoModule,
    profileInfoModule
  },
});

export {
  store,
};
