import { router } from '~jsBasePath/vue-router/router';
import RouterUtil from '~jsBasePath/vue-router/router-util';

const Vendor01 = (() => {
  return {
    init() {
      RouterUtil.init(router);
    },
  };
})();

Vendor01.init();
