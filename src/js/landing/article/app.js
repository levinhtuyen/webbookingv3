import {
  ARR_ENV,
  ENV,
  IS_CHROME_BROWSER,
  ASSETS_SERVICE_URL_LIST_WITH_ENV,
  isEncryptParamValid,
  ARR_UUID_INFO,
  MUST_UPDATE_DEVICE_ENCODE,
  BOT_INFO,
  ENV_API,
} from '~jsDefinePath/general';
import {
  API_VERSION,
} from '~jsDefinePath/api-define';
import {
  LOCAL_STORAGE_KEY,
} from '~jsDefinePath/local-storage';
import {
  Vue,
  _,
  uuidv1,
} from '~jsLibPath/lib-manager';
import {
  apiCaller,
  apiSetup,
} from '~jsHelperPath/service/ApiHandler';
import {
  HandleSeoTag,
} from '~jsHelperPath/util/HandleSeoTag';
import { store } from '~jsLandingPath/article/base/vuex/store';
import { router } from '~jsLandingPath/article/base/vue-router/router';
import { i18n } from '~jsBasePath/vue-i18n/translate';
import VueTemplate from './app.vue';

const App = (() => {
  let _app = null;
  const _startTimeStamp = Date.now();

  let G2J_UUID = null;

  // NOTE - define tmp uuid key for bot crawler
  const _tmpBotUUID = {
    // NOTE - dev company uuid
    '550b35c3faca316f2dfafc4a56d74f2d758732d0': '0052d8e0-678a-11ec-ac4d-13b34154a43b',
    // NOTE - dev out of company uuid
    '7f00087497811ba15628c1939d9ed32d263cdc94': 'f53c56e0-67fa-11ec-883a-ef055ea26659"',
    // NOTE - staging uuid
    '394399a5795f319594de14cde0800ff1a27dcc4d': 'cecc9880-678c-11ec-8c9e-e551bafd7606',
    // NOTE - uat uuid
    '1f5606df0cae57ae669c948efea368d1af66618a': 'e0a09350-5eee-11ec-96ce-49e9023a7d28',
    // NOTE - production uuid
    '0a4fdae4b3c84bc256bc8d0184bd3d74947588ea': 'cc12bb20-67f9-11ec-92b9-bff710ed8f34',
  };

  if(
    !BOT_INFO.isBot &&
    (
      MUST_UPDATE_DEVICE_ENCODE ||
      (
        ENV === ARR_ENV.production &&
        !localStorage[LOCAL_STORAGE_KEY.G2J_HAS_SEND_ADID_SUCCESS]
      )
    )
  ) {
    G2J_UUID = uuidv1();

    localStorage.setItem(LOCAL_STORAGE_KEY.G2J_ADJUST_UUID, G2J_UUID);

    _.forIn(ARR_UUID_INFO, function(envUUIDInfo, env) {
      if(
        envUUIDInfo &&
        envUUIDInfo.key &&
        localStorage.getItem(envUUIDInfo.key)
      ) {
        localStorage.removeItem(envUUIDInfo.key);
      }
    });
  }

  const __initVueApp = () => {
    let elApp = document.getElementById('app');

    if(!elApp) {
      elApp = document.createElement('div');
      elApp.id = 'app';

      document.body.appendChild(elApp);
    }

    return {
      success: true,
      target: elApp,
    };
  }; // __initVueApp()

  const _renderApp = () => {
    const vueApp = __initVueApp();

    if(vueApp.success) {
      Vue.use(window.VueRouter);

      Vue.config.productionTip = false;

      // NOTE - Setup handle seo tag for Vue prototype
      Vue.prototype.$metaTag = HandleSeoTag;

      _app = new Vue({
        store,
        render: (h) => h(VueTemplate),
        i18n,
        router,
      }).$mount(vueApp.target);

      if(
        IS_CHROME_BROWSER &&
        window.__VUE_DEVTOOLS_GLOBAL_HOOK__
      ) {
        window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = (ENV === ARR_ENV.development ? _app.constructor : null);
      }
    }
  }; // _renderApp()

  const _initAjaxRequest = () => {
    // NOTE - setup header of ajax request
    apiSetup({
      beforeSend: function(
        objCaller,
        configFormatted
      ) {
        configFormatted.headers = {
          ...configFormatted.headers,
          Localization: localStorage["g2j-translate-language"],
        };
        if(
          objCaller.metaUrl &&
          typeof objCaller.metaUrl === 'object'
        ) {
          const metaUrl = objCaller.metaUrl;

          // NOTE - detect and auto adjust env define for api
          metaUrl.env = (ENV === ARR_ENV.development ? metaUrl.env : ENV);

          // NOTE - 04/08/2021 - 13:30 change all api to use device-encode = uuid instead of device_for_web
          if(
            (
              metaUrl.version === API_VERSION.v3 ||
              metaUrl.version === API_VERSION.v4
            ) && (
              BOT_INFO.isBot ||
              localStorage.getItem(ARR_UUID_INFO[ENV_API].key)
            )
          ) {
            configFormatted.headers = {
              ...configFormatted.headers,
              'Device-Encode': (
                BOT_INFO.isBot ?
                  _tmpBotUUID[ARR_UUID_INFO[ENV_API].key] :
                JSON.parse(localStorage.getItem(ARR_UUID_INFO[ENV_API].key)).device_encode
              ),
            };
          }

          configFormatted.url = metaUrl.base_url + metaUrl.path;
        }

        if(
          objCaller.success &&
          typeof objCaller.success === 'function'
        ) {
          const envDetectUrl = ENV_API;

          // NOTE - setup assetService with api env
          const assetsServiceUrlWithApiEnv = ASSETS_SERVICE_URL_LIST_WITH_ENV[envDetectUrl];

          const oldSuccessCallback = objCaller.success;

          objCaller.success = function(objResponse) {
            if(
              !_.isEmpty(objResponse) &&
              !objResponse.error &&
              !_.isEmpty(objResponse.data)
            ) {
              objResponse.client_format_data = {
                assets_service_url: '',
              };

              objResponse.client_format_data.assets_service_url = assetsServiceUrlWithApiEnv;
            }

            oldSuccessCallback(objResponse);
          }
        }

        // NOTE - setup device-encode with api env
        // jqXHR.setRequestHeader(
        //   'Device-Encode',
        //   JSON.parse(localStorage.getItem(ARR_UUID_INFO[envDetectUrl].key)).device_encode
        // );
      },
    });
  }; // _initAjaxRequest()

  const __awaitInitApp = () => {
    _initAjaxRequest();
    _renderApp();
  }; // _awaitInitApp()

  const _asyncUpdateWebDevice = () => {
    if(!G2J_UUID) {
      __awaitInitApp();
    } else {
      // call API update device
      const _ajaxUpdateWebDeviceAPIList = [];

      _ajaxUpdateWebDeviceAPIList.push(__ajaxUpdateWebDeviceAPI(ARR_UUID_INFO[ENV_API], G2J_UUID));

      if(_ajaxUpdateWebDeviceAPIList.length) {
        Promise.all(_ajaxUpdateWebDeviceAPIList)
        .then(function() {
          setTimeout(function() {
            __awaitInitApp();
          }, 15);
        });
      }
    }
  }; // _asyncUpdateWebDevice()

  const __ajaxUpdateWebDeviceAPI = (
    uuidInfo,
    g2jUUID
  ) => {
    return apiCaller({
      url: uuidInfo.base_url + '/web-booking/device/updateWebDevice',
      data: {
        // notDisplaySn: '',
        // limit: 5,
        uuid: g2jUUID,
        provinceSn: 1,
        districtSn: 15,
        latitude: null,
        longitude: null,
      },
      method: 'POST',
      dataType: 'json',

      error() {},

      success(objResponse) {
        if(
          _.isEmpty(objResponse) ||
          objResponse.error ||
          _.isEmpty(objResponse.data)
        ) {
          __awaitInitApp();
          return;
        }

        localStorage.setItem(uuidInfo.key, JSON.stringify({
          uuid: g2jUUID,
          created_time: objResponse.timestamp,
          device_encode: objResponse.data,
        }));
      },
    });
  }; // __ajaxUpdateWebDeviceAPI()

  const __calcSpaceOfSecond = () => {
    return parseInt(Math.abs(Date.now() - _startTimeStamp) / (1000) % 60);
  }; // _calcSpaceOfSecond()

  const _lockGlobalService = () => {
    // NOTE - Go2Joyencrypt
    const tmpSha1 = window.Go2JoyEncrypt();
    window.Go2JoyEncrypt = function() {
      if(isEncryptParamValid(this?.key, this?.no_encrypt)) {
        return tmpSha1;
      }
    };

    // NOTE - ApiHandler
    const tmpApiHandler = window.ApiHandler;
    window.ApiHandler = function() {
      if(isEncryptParamValid(this?.key)) {
        return tmpApiHandler;
      }
    };

    // NOTE - firebase
    let asyncLockFirebaseInterval = setInterval(function() {
      if(__calcSpaceOfSecond() >= 3) {
        clearInterval(asyncLockFirebaseInterval);
        asyncLockFirebaseInterval = null;
      }

      if(
        window.firebase &&
        window.firebase.isInit
      ) {
        const tmpFirebase = window.firebase;
        window.firebase = function() {
          if(isEncryptParamValid(this?.key)) {
            return tmpFirebase;
          }
        };

        clearInterval(asyncLockFirebaseInterval);
        asyncLockFirebaseInterval = null;
      }
    }, 30);

    // NOTE - dable
    let asyncLockDablenaInterval = setInterval(function() {
      if(__calcSpaceOfSecond() >= 3) {
        clearInterval(asyncLockDablenaInterval);
        asyncLockDablenaInterval = null;
      }

      if(
        typeof window.dablena === 'object' &&
        typeof window.dablena.isInit
      ) {
        const tmpDablena = window.dablena.handle;
        window.dablena = function() {
          if(isEncryptParamValid(this?.key)) {
            return tmpDablena;
          }
        };

        clearInterval(asyncLockDablenaInterval);
        asyncLockDablenaInterval = null;
      }
    }, 30);

    // NOTE - Seo tag handler
    let asyncLockSeoTagHandlerInterval = setInterval(function() {
      if(__calcSpaceOfSecond() >= 3) {
        clearInterval(asyncLockSeoTagHandlerInterval);
        asyncLockSeoTagHandlerInterval = null;
      }

      if(typeof window.SeoTagHandler === 'object') {
        const tmpSeoTagHandler = window.SeoTagHandler;
        window.SeoTagHandler = function() {
          if(isEncryptParamValid(this?.key)) {
            return tmpSeoTagHandler;
          }
        };

        clearInterval(asyncLockSeoTagHandlerInterval);
        asyncLockSeoTagHandlerInterval = null;
      }
    }, 30);
  }; // lockGlobalService()

  return {
    init() {
      if(!BOT_INFO.isBot) {
        _lockGlobalService();
        _asyncUpdateWebDevice();
      } else {
        __awaitInitApp();
      }
    },
  }
})();

App.init();
