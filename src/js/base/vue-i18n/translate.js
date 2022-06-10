import {
  LOCAL_STORAGE_KEY
} from '~jsDefinePath/local-storage';
import {
  EVENT_BUS_KEY
} from '~jsDefinePath/event-bus';
import {
  VueI18n,
  _
} from '~jsLibPath/lib-manager';
import { KEYPATH_CONFIG } from '~jsDefinePath/language';

const messages = KEYPATH_CONFIG;

const curTranslateLanguage = localStorage.getItem(LOCAL_STORAGE_KEY.G2J_TRANSLATE_LANGUAGE);

const i18n = new VueI18n({
  locale: curTranslateLanguage || 'vi',
  messages
});

EventBus.on(EVENT_BUS_KEY.UPDATE_LANGUAGE_KEYPATH, function(objUpdateInfo) {
  objUpdateInfo.locale = objUpdateInfo.locale || 'vi';

  if(
    _.isEmpty(objUpdateInfo) ||
    !objUpdateInfo.key ||
    _.isEmpty(objUpdateInfo.keypath) ||
    _.isEmpty(messages[objUpdateInfo.locale])
    // !_.isEmpty(messages[objUpdateInfo.locale][objUpdateInfo.key])
  ) {
    return;
  }



  messages[objUpdateInfo.locale][objUpdateInfo.key] = {
    ...messages[objUpdateInfo.locale][objUpdateInfo.key],
    ...objUpdateInfo.keypath
  };

  EventBus.emit('IS_GET_LANGUAGE_FINISH--' + objUpdateInfo.key);
});

export {
  i18n
};
