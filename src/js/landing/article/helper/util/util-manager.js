import {
  handleTimeout,
} from './AsyncHandler';
import {
  getSlug,
  getSlugWithoutDash,
  getUnsignedLetters,
  getCustomSlug,
  generateTitleCase,
  generateSentenceCase,
} from './SlugHandler';
import {
  Sha1,
} from './EncryptionHandler';
import {
  DynamicInsertExternalResouceHandler,
} from './DynamicInsertExternalResouceHandler';
import {
  SeoTagHandler,
} from '~jsHelperPath/util/SeoTagHandler';

const GlobalUtil = (() => {
  return {
    init() {
      window.TimeoutHandler = handleTimeout;
      window.GetSlug = getSlug;
      window.GetSlugWithoutDash = getSlugWithoutDash;
      window.GetUnsignedLetters = getUnsignedLetters;
      window.GetCustomSlug = getCustomSlug;
      window.GenerateTitleCase = generateTitleCase;
      window.GenerateSentenceCase = generateSentenceCase;
      window.Go2JoyEncrypt = function() {
        return Sha1.hash;
      };
      window.DynamicInsertExternalResouceHandler = DynamicInsertExternalResouceHandler;
      window.SeoTagHandler = SeoTagHandler;
    }
  };
})();

export {
  GlobalUtil,
};
