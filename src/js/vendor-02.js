import {
  isEncryptParamValid,
} from '~jsDefinePath/general';
import VueTemplate from './app.vue';

const Vendor02 = (() => {
  return {
    init() {
      window.Go2JoyVueTemplate = function() {
        if(isEncryptParamValid(this?.key, this?.no_encrypt)) {
          return VueTemplate;
        }
      };
    }
  }
})();

Vendor02.init();
