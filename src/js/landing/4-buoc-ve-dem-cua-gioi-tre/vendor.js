import {
  Sha1,
} from '~jsHelperPath/util/EncryptionHandler';

const Vendor = (() => {
  const _globalUtil = () => {
    window.Go2JoyEncrypt = Sha1.hash;
  }; // _globalUtil()

  return {
    init() {
      _globalUtil();
    },
  }
})();

Vendor.init();
