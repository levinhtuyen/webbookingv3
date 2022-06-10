import { DefineGlobalManager } from '~jsDefinePath/define-global-manager';
import { GlobalService } from '~jsLandingPath/article/helper/service/service-manager';
import { GlobalUtil } from '~jsLandingPath/article/helper/util/util-manager';

const Vendor = (() => {
  const _initEscapeString = () => {
    String.prototype.escape = function() {
      const tagsToReplace = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;'
      };
      return this.replace(/[&<>]/g, function(tag) {
          return tagsToReplace[tag] || tag;
      });
    };
  }; // _initEscapeString();

  return {
    init() {
      GlobalService.init();
      GlobalUtil.init();
      DefineGlobalManager.init();

      _initEscapeString();
    },
  };
})();

Vendor.init();
