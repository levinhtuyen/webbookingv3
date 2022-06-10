import {
  ARR_ENV,
  ENV,
  IS_CHROME_BROWSER,
  BOT_INFO,
  ASSETS_SERVICE_URL_LIST_WITH_ENV,
  isEncryptParamValid,
  ARR_UUID_INFO,
  MUST_UPDATE_DEVICE_ENCODE,
  ENV_API,
  LANGUAGE_VALID,
  IP_INFO,
} from '~jsDefinePath/general';
import {
  API_VERSION,
} from '~jsDefinePath/api-define';
import {
  AJAX_URL,
} from '~jsDefinePath/ajax-url';
import {
  LOCAL_STORAGE_KEY,
} from '~jsDefinePath/local-storage';
import {
  SESSION_STORAGE_KEY,
} from '~jsDefinePath/session-storage';
import {
  EVENT_BUS_KEY
} from '~jsDefinePath/event-bus';
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
import { store } from '~jsBasePath/vuex/store';
import {
  G2JRouter,
} from '~jsHelperPath/util/HandleRouterGlobal';
import {
  G2JVueTemplate,
} from '~jsHelperPath/util/HandleVueTemplateGlobal';
import { i18n } from '~jsBasePath/vue-i18n/translate';
// import VueTemplate from './app.vue';
import * as prototype from '~jsDefinePath/vue-prototype';
import * as directive from '~jsDefinePath/vue-directive';
import * as component from '~jsDefinePath/vue-component-global';

const App = (() => {
  let _app = null;
  const _startTimeStamp = Date.now();

  let G2J_UUID = null;

  // NOTE - define tmp uuid key for bot crawler
  const _tmpBotUUID = {
    // NOTE - dev company uuid
    '550b35c3faca316f2dfafc4a56d74f2d758732d0': '0052d8e0-678a-11ec-ac4d-13b34154a43b',
    // NOTE - dev out of company uuid
    '7f00087497811ba15628c1939d9ed32d263cdc94': 'e423c7c0-6990-11ec-b322-392212168a4c',
    // NOTE - staging uuid
    '394399a5795f319594de14cde0800ff1a27dcc4d': 'cecc9880-678c-11ec-8c9e-e551bafd7606',
    // NOTE - uat uuid
    '1f5606df0cae57ae669c948efea368d1af66618a': 'e0a09350-5eee-11ec-96ce-49e9023a7d28',
    // NOTE - production uuid
    '0a4fdae4b3c84bc256bc8d0184bd3d74947588ea': 'cc12bb20-67f9-11ec-92b9-bff710ed8f34',
  };

  // NOTE - keep lat and longtitde current and update if it changed (for API update device)
  let _latitude = null;
  let _longitude = null;

  // NOTE - Production version will call updateDeviceEncode each time user enter go2joy (to init adjust)
  if(
    !BOT_INFO.isBot &&
    (
      MUST_UPDATE_DEVICE_ENCODE ||
      (
        ENV === ARR_ENV.production &&
        !localStorage[LOCAL_STORAGE_KEY.G2J_HAS_SEND_ADID_SUCCESS]
      ) ||
      localStorage[LOCAL_STORAGE_KEY.G2J_MUST_UPDATE_DEVICE_ENCODE]
    )
  ) {
    G2J_UUID = uuidv1();

    localStorage.setItem(LOCAL_STORAGE_KEY.G2J_ADJUST_UUID, G2J_UUID);

    localStorage.removeItem(ARR_UUID_INFO[ENV]);
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
      // NOTE - Integrate VueRouter
      Vue.use(window.VueRouter);

      // NOTE - Init productionTip
      Vue.config.productionTip = false;

      // NOTE - Setup assets aws service url
      Vue.prototype.$assetsServiceUrl = ASSETS_SERVICE_URL_LIST_WITH_ENV[ENV_API];

      // NOTE - Setup handle seo tag for Vue prototype
      for(const lang in LANGUAGE_VALID) {
        HandleSeoTag.initAlternate(lang, IP_INFO.country);
      }

      Vue.prototype.$metaTag = HandleSeoTag;

      // NOTE - Render Vue app
      if(G2JVueTemplate) {
        _app = new Vue({
          store,
          render: (h) => h(G2JVueTemplate),
          i18n,
          router: G2JRouter,

          mounted() {
            if(
              ENV === ARR_ENV.production &&
              !BOT_INFO.isBot
            ) {
              setTimeout(function() {
                window.initFirebaseConfigScriptTag?.();
                window.initFirebaseConfigScriptTag = undefined;
              }, 1500);

              setTimeout(function() {
                window.initGtmScriptTag?.();
                window.initGtmScriptTag = undefined;
                window.initGtagScriptTag?.();
                window.initGtagScriptTag = undefined;
                window.initDablePixelScriptTag?.();
                window.initDablePixelScriptTag = undefined;
                window.initFacebookPixelScriptTag?.();
                window.initFacebookPixelScriptTag = undefined;
                window.initHotjarTrackingScriptTag?.();
                window.initHotjarTrackingScriptTag = undefined;
                window.initTiktokPixelScriptTag?.();
                window.initTiktokPixelScriptTag = undefined;
              }, 3000);

              setTimeout(function() {
                __lockGlobalServiceAfterMounted();
              }, 3000);
            }
          }
        }).$mount(vueApp.target);

        if(
          IS_CHROME_BROWSER &&
          window.__VUE_DEVTOOLS_GLOBAL_HOOK__
        ) {
          window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = (ENV === ARR_ENV.development ? _app.constructor : null);
        }
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
            )
            && (
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

  const __asyncUpdateWebDevice = () => {
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
  }; // __asyncUpdateWebDevice()

  const _awaitAjaxUpdateAdjustID = () => {
    // NOTE - API to check if adjust is initial
    apiCaller({
      url: 'https://adjust-api.go2joy.vn/api/v1/updateAdjustId',
      data: {
        uuid: (G2J_UUID ||
          localStorage[LOCAL_STORAGE_KEY.G2J_ADJUST_UUID]),
        adid: localStorage[LOCAL_STORAGE_KEY.G2J_ADJUST_ID],
      },
      type: 'GET',
      dataType: 'json',

      error() {},

      success() {
        localStorage.setItem(LOCAL_STORAGE_KEY.G2J_HAS_SEND_ADID_SUCCESS, 1);
      },
    });
  }; // _awaitAjaxUpdateAdjustID()

  const __ajaxUpdateWebDeviceAPI = (
    uuidInfo,
    g2jUUID
  ) => {
    return apiCaller({
      url: uuidInfo.base_url + '/web-booking/device/updateWebDevice',
      data: {
        uuid: g2jUUID,
        provinceSn: 1,
        latitude: _latitude,
        longitude: _longitude,
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

        // NOTE - remove update device encode flag
        if(localStorage[LOCAL_STORAGE_KEY.G2J_MUST_UPDATE_DEVICE_ENCODE]) {
          localStorage.removeItem(LOCAL_STORAGE_KEY.G2J_MUST_UPDATE_DEVICE_ENCODE);
        }

        // NOTE - Adjust
        let asyncLockAdjustInterval = setInterval(function() {
          if(__calcSpaceOfSecond() >= 7) {
            clearInterval(asyncLockAdjustInterval);
            asyncLockAdjustInterval = null;
          }

          if(window.Adjust) {
            // NOTE - execute indexedDB of Adjust
            if(uuidInfo.base_url.includes('production')) {
              Adjust.addGlobalCallbackParameters([
                {
                  key: 'uuid',
                  value: (G2J_UUID || (localStorage[LOCAL_STORAGE_KEY.G2J_ADJUST_UUID] || "123456789")),
                }
              ]);

              Adjust.initSdk({
                appToken: 'dpy3g1xhdkao',
                environment: 'production',

                attributionCallback: function (e, attribution) {
                  localStorage.removeItem(LOCAL_STORAGE_KEY.G2J_HAS_SEND_ADID_SUCCESS);

                  if(
                    !localStorage[LOCAL_STORAGE_KEY.G2J_ADJUST_ID] &&
                    G2J_UUID &&
                    attribution.adid
                  ) {
                    localStorage.setItem(LOCAL_STORAGE_KEY.G2J_ADJUST_ID, attribution.adid);
                    _awaitAjaxUpdateAdjustID();
                  }
                }
              });

              setTimeout(function() {
                const tmpAdjust = window.Adjust;

                window.Adjust = function() {
                  if(isEncryptParamValid(this?.key)) {
                    return tmpAdjust;
                  }
                };
              }, 300);
            }

            clearInterval(asyncLockAdjustInterval);
            asyncLockAdjustInterval = null;
          }
        }, 30);
      },
    });
  }; // __ajaxUpdateWebDeviceAPI()

  const __calcSpaceOfSecond = () => {
    return parseInt(Math.abs(Date.now() - _startTimeStamp) / (1000) % 60);
  }; // _calcSpaceOfSecond()

  const __lockGlobalService = () => {
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
  }; // __lockGlobalService()

  const __lockGlobalServiceAfterMounted = () => {
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

        // NOTE - Re-tracking firebase tracking waiting list
        if(!_.isEmpty(window.G2JFirebaseTrackingWaitingList)) {
          for(const trackingName in window.G2JFirebaseTrackingWaitingList) {
            tmpFirebase.analytics().logEvent(
              trackingName,
              window.G2JFirebaseTrackingWaitingList[trackingName]
            );
          }

          window.G2JFirebaseTrackingWaitingList = {};
        }
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
        window.dablena = {
          is_locked: true,
          handler: function() {
            if(isEncryptParamValid(this?.key)) {
              return tmpDablena;
            }
          }
        };

        clearInterval(asyncLockDablenaInterval);
        asyncLockDablenaInterval = null;

        // NOTE - Re-tracking dable tracking waiting list
        if(window.G2JDablenaTrackingWaitingList.length) {
          window.G2JDablenaTrackingWaitingList.forEach(function(trackingName) {
            tmpDablena('track', trackingName);
          });

          window.G2JDablenaTrackingWaitingList = [];
        }
      }
    }, 30);

    //NOTE - fbq
    let asyncLockFbqInterval = setInterval(function() {
      if(__calcSpaceOfSecond() >= 3) {
        clearInterval(asyncLockFbqInterval);
        asyncLockFbqInterval = null;
      }

      if(typeof window.fbq === 'function') {
        const tmpFbq = window.fbq;
        setTimeout(function() {
          // NOTE - Handle fb use window.fbq to check after done
          window.fbq = {
            is_locked: true,
            handler: function() {
              if(isEncryptParamValid(this?.key)) {
                return tmpFbq;
              }
            }
          };

          // NOTE - Re-tracking Fbq tracking waiting list
          if(!_.isEmpty(window.G2JFbqTrackingWaitingList)) {
            for(const trackingName in window.G2JFbqTrackingWaitingList) {
              tmpFbq(
                'track',
                trackingName,
                window.G2JFbqTrackingWaitingList[trackingName]
              );
            }

            window.G2JFbqTrackingWaitingList = {};
          }
        }, 1000);

        clearInterval(asyncLockFbqInterval);
        asyncLockFbqInterval = null;
      }
    }, 30);
  }; // __lockGlobalServiceAfterMounted()

  const _setupCurrentCustomerLocation = (option = {
    is_reload: false,
  }) => {
    apiCaller({
      url: AJAX_URL.user.find_user_location,
      data: {
        latitude: _latitude,
        longitude: _longitude,
      },
      type: 'GET',
      dataType: 'json',

      error() {
        __lockGlobalService();
        __asyncUpdateWebDevice();
      },

      success(objResponse) {
        if (
          _.isEmpty(objResponse) ||
          objResponse.error ||
          _.isEmpty(objResponse.data)
        ) {
          __lockGlobalService();
          __asyncUpdateWebDevice();
          return;
        }

        // NOTE - Update provinceSn for personalLocationInfo
        localStorage.setItem(LOCAL_STORAGE_KEY.G2J_PERSONAL_LOCATION_INFO, JSON.stringify({
          latitude: _latitude,
          longitude: _longitude,
          provinceSn: objResponse.data.provinceSn,
        }));

        localStorage.setItem(LOCAL_STORAGE_KEY.G2J_CUR_PROVINCE_SN, objResponse.data.provinceSn);
        localStorage.setItem(LOCAL_STORAGE_KEY.G2J_CUR_PROVINCE_NAME, objResponse.data.provinceName);

        // NOTE - remove location permission blocked setuped before
        localStorage.removeItem(LOCAL_STORAGE_KEY.G2J_LOCATION_PERMISSION_BLOCKED);
        localStorage.removeItem(LOCAL_STORAGE_KEY.G2J_IS_LOCATION_SELECTED_BY_USER);

        if(option.is_reload) {
          localStorage.setItem(LOCAL_STORAGE_KEY.G2J_MUST_UPDATE_DEVICE_ENCODE, 1);
          window.location.reload();
        } else {
          __lockGlobalService();
          __asyncUpdateWebDevice();
        }
      },
    });
  }; // _setupCurrentCustomerLocation()

  // NOTE - detect location at first time
  const _detectLocationFirstTime = () => {
    if(!IS_CHROME_BROWSER) {
      localStorage.removeItem(LOCAL_STORAGE_KEY.G2J_LOCATION_PERMISSION_BLOCKED);
    }

    if(
      localStorage[LOCAL_STORAGE_KEY.G2J_IS_LOCATION_SELECTED_BY_USER] &&
      (
        IS_CHROME_BROWSER ? !localStorage[LOCAL_STORAGE_KEY.G2J_LOCATION_PERMISSION_BLOCKED] : true
      )
    ) {
      __lockGlobalService();
      __asyncUpdateWebDevice();
    } else if(localStorage[LOCAL_STORAGE_KEY.G2J_LOCATION_PERMISSION_BLOCKED]) {
      // NOTE - Detect if location permission blocked by user before, the system will listen onchange status of permission if the browser support and normal client render layout

      if(navigator.geolocation) {
        const _tmpPersonalInfo = (
          localStorage[LOCAL_STORAGE_KEY.G2J_PERSONAL_LOCATION_INFO] ?
            JSON.parse(localStorage[LOCAL_STORAGE_KEY.G2J_PERSONAL_LOCATION_INFO]) :
          {}
        );

        _latitude = _tmpPersonalInfo.latitude || null;
        _longitude = _tmpPersonalInfo.longitude || null;

        navigator.geolocation.getCurrentPosition(
          function(position) {
            localStorage.removeItem(LOCAL_STORAGE_KEY.G2J_LOCATION_PERMISSION_BLOCKED);

            // NOTE - get current position success
            if(
              (_latitude !== position.coords.latitude ||
              _longitude !== position.coords.longitude) &&
              !localStorage[LOCAL_STORAGE_KEY.G2J_IS_LOCATION_SELECTED_BY_USER]
            ) {
              _latitude = position.coords.latitude;
              _longitude = position.coords.longitude;

              G2J_UUID = uuidv1();

              localStorage.setItem(LOCAL_STORAGE_KEY.G2J_ADJUST_UUID, G2J_UUID);

              localStorage.removeItem(ARR_UUID_INFO[ENV]);

              _setupCurrentCustomerLocation();
            } else {
              if(localStorage[LOCAL_STORAGE_KEY.G2J_IS_LOCATION_SELECTED_BY_USER]) {
                // NOTE - show selection location modal again
                localStorage.removeItem(LOCAL_STORAGE_KEY.G2J_DISABLE_SHOW_LOCATION_SELECTION_MODAL);
                sessionStorage.removeItem(SESSION_STORAGE_KEY.G2J_HAS_SELECTED_LOCATION);
              }

              __lockGlobalService();
              __asyncUpdateWebDevice();
            }
          },
          function() {
            if(navigator.permissions) {
              navigator.permissions.query({name: 'geolocation'}).then(function(permissionStatus) {
                permissionStatus.onchange = function() {
                  EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
                    'is_show': true,
                  });

                  // NOTE - remove location permission blocked setuped before
                  localStorage.removeItem(LOCAL_STORAGE_KEY.G2J_LOCATION_PERMISSION_BLOCKED);

                  navigator.geolocation.getCurrentPosition(
                    function(position) {
                      // NOTE - get current position success
                      if(
                        _latitude !== position.coords.latitude ||
                        _longitude !== position.coords.longitude
                      ) {
                        _latitude = position.coords.latitude;
                        _longitude = position.coords.longitude;

                        localStorage.setItem(LOCAL_STORAGE_KEY.G2J_LOCATION_EXPIRED_TIME, Date.now());

                        _setupCurrentCustomerLocation({is_reload: true});
                      }
                    }
                  );
                };
              }) // navigator.permissions.querynavigator.permissions.query()
            } // if(navigator.permissions) {...}

            __lockGlobalService();
            __asyncUpdateWebDevice();
          }
        );
        // navigator.geolocation.getCurrentPosition()
      } else {
        __lockGlobalService();
        __asyncUpdateWebDevice();
      }
    } else {
      __lockGlobalService();
      __asyncUpdateWebDevice();
    }
  }; // _detectLocationFirstTime()

  return {
    init() {
      if(!BOT_INFO.isBot) {
        _detectLocationFirstTime();
      } else {
        __awaitInitApp();
      }
    },
  }
})();

Vue.use(prototype,directive,component)

App.init();
