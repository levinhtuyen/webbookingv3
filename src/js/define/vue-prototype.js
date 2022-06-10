
import {
  ENV,
  ASSETS_SERVICE_URL_LIST_WITH_ENV,
} from '~jsDefinePath/general';
import { Vue } from "~jsLibPath/lib-manager";

Vue.prototype.$formatPrice = (value) => {
  if (value || value == 0) {
    // return parseInt(value).toLocaleString("en-US", {
    //   style: "currency",
    //   currency: "VND",
    // });

    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  }
};
Vue.prototype.$formatlowestPrice = (value) => {
  return parseInt(value).toLocaleString();
};
Vue.prototype.$formatLinkImage = (value) => {
  return ASSETS_SERVICE_URL_LIST_WITH_ENV[ENV] + '/' + value;
};
