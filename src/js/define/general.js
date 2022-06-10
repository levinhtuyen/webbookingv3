const G2JDefineGeneral = window.Go2JoyDefineGeneral || {};

const BASE_URL = G2JDefineGeneral.BASE_URL;

const LANGUAGE_VALID = G2JDefineGeneral.LANGUAGE_VALID || {};

const LANGUAGE_CODE_LIST = G2JDefineGeneral.LANGUAGE_CODE_LIST || [];

const COUNTRY_CODE_LIST = G2JDefineGeneral.COUNTRY_CODE_LIST || [];

const LANGUAGE_DEFAULT = LANGUAGE_VALID.vi;

const ARR_ENV = {
  development: "development",
  staging: "staging",
  production: "production",
};

const ARR_TYPE = {
  normal: "normal",
  uat: "uat",
};

const PAGE_INFO = window.PAGE_INFO || {};

const IMAGE_URL = PAGE_INFO.image_url || '';
const JS_URL = PAGE_INFO.js_url || '';
const LANGUAGE_URL = PAGE_INFO.language_url || '';
const ENV = G2JDefineGeneral.ENV || ARR_ENV.development;
const ENV_API = G2JDefineGeneral.ENV_API || ARR_ENV.development;
const TYPE = PAGE_INFO.type || ARR_TYPE.normal;
const IS_UAT = (TYPE === ARR_TYPE.uat);
const CACHE_JS_VERSION = Date.now();
const CACHE_VERSION = PAGE_INFO.cache_version || CACHE_JS_VERSION;

const ASSETS_SERVICE_URL_LIST_WITH_ENV = G2JDefineGeneral.ASSETS_SERVICE_URL_LIST_WITH_ENV || {};

const ASSETS_SERVICE_URL = ASSETS_SERVICE_URL_LIST_WITH_ENV[ENV];

const getApiUrl = G2JDefineGeneral.getApiUrl || null;

const getToken = G2JDefineGeneral.getToken || null;

// NOTE - Detect if has MINISTRY OF INTERNATIONAL TRADE AND INDUSTRY (Bộ công thương) or else
// const HAS_MOITAI = true;
const HAS_MOITAI = false;

const HEADER_CONFIG = {
  "Device-Encode": "device_for_web",
  "Secret-Code": "7bc79fa5139b8266e12993014bb68911",
  Localization: localStorage["g2j-translate-language"],
};

const IS_MOBILE = G2JDefineGeneral.IS_MOBILE || false;

const IS_CHROME_BROWSER = G2JDefineGeneral.IS_CHROME_BROWSER || false;

const IS_SAFARI_BROWSER = G2JDefineGeneral.IS_SAFARI_BROWSER || false;

const IS_ANDROID = G2JDefineGeneral.IS_ANDROID || false;

const IS_IOS = G2JDefineGeneral.IS_IOS || false;

// NOTE - Swiper freemode configuation
const SWIPER_FREEMODE_CONFIG = G2JDefineGeneral.SWIPER_FREEMODE_CONFIG || {};

// NOTE - Encrypt code
const G2J_KEY_CODE = String("Go2Joy_" + Date.now()).slice(0, -7);

const isEncryptParamValid = G2JDefineGeneral.isEncryptParamValid || null;

const ARR_UUID_INFO = G2JDefineGeneral.ARR_UUID_INFO || null;

// NOTE - detect if need update device encode for api
const MUST_UPDATE_DEVICE_ENCODE = G2JDefineGeneral.MUST_UPDATE_DEVICE_ENCODE;

// NOTE - get bot infomation
const BOT_INFO = G2JDefineGeneral.BOT_INFO;

// NOTE - get bot infomation
const IP_INFO = G2JDefineGeneral.IP_INFO;

export {
  BASE_URL,
  LANGUAGE_VALID,
  LANGUAGE_DEFAULT,
  LANGUAGE_CODE_LIST,
  COUNTRY_CODE_LIST,
  ARR_ENV,
  ARR_TYPE,
  IS_MOBILE,
  IS_CHROME_BROWSER,
  IS_SAFARI_BROWSER,
  IS_IOS,
  IS_ANDROID,
  //================
  PAGE_INFO,
  IMAGE_URL,
  JS_URL,
  LANGUAGE_URL,
  ENV,
  ENV_API,
  TYPE,
  IS_UAT,
  CACHE_JS_VERSION,
  CACHE_VERSION,
  getApiUrl,
  getToken,
  HAS_MOITAI,
  ASSETS_SERVICE_URL_LIST_WITH_ENV,
  ASSETS_SERVICE_URL,
  //================
  HEADER_CONFIG,
  SWIPER_FREEMODE_CONFIG,
  G2J_KEY_CODE,
  isEncryptParamValid,
  ARR_UUID_INFO,
  MUST_UPDATE_DEVICE_ENCODE,
  BOT_INFO,
  IP_INFO,
};
