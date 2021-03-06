import {
  BASE_URL,
  LANGUAGE_VALID,
  LANGUAGE_DEFAULT,
  LANGUAGE_CODE_LIST,
  COUNTRY_CODE_LIST,
  CACHE_VERSION,
  ENV,
  ARR_ENV,
  BOT_INFO,
  IP_INFO,
} from '~jsDefinePath/general';
import {
  EVENT_BUS_KEY,
} from '~jsDefinePath/event-bus';
import {
  LOCAL_STORAGE_KEY,
} from '~jsDefinePath/local-storage';
import {
  _,
} from '~jsLibPath/lib-manager';
import {
  EXTERNAL_LIB_MANAGER
} from '~jsLibPath/external-lib-manager';
import {
  store,
} from '~jsBasePath/vuex/store';
import {
  COMMIT_KEY as PAGE_INFO_MODULE_NAME,
} from '~jsBasePath/vuex/modules/page-info-module';
import {
  onPopStateEvent,
} from '~jsHelperPath/util/PrivateEventCustom';
import {
  HandleSeoTag,
} from '~jsHelperPath/util/HandleSeoTag';
import {
  ROUTER_INFO,
  ROUTER_NAME,
  ROUTER_PATH
} from '~jsBasePath/vue-router/router-enum';

export default (() => {
  // NOTE - Handle for beforeEach router
  let routerTarget = null;
  let arrCssStyle = {};
  if(ENV === ARR_ENV.development) {
    arrCssStyle = window.arrCssStyle = {};
  }

  let arrElStyleEachFirstRouterLoading = [];
  const arrLanguagePicked = {};
  let toMatchLastIndex = 0;
  const elHtmlDoc = document.documentElement;

  // NOTE - This flag help detect if browser is back history
  let popStateDetected = false;

  // let isPageLoadFinish = false;

  // NOTE - define History list storage
  let historyStepStorage = null;

  const _doAfterElScriptFinish = (
    to,
    from,
    next,
  ) => {
    const elScript = document.createElement('script');
    elScript.setAttribute('src', ROUTER_INFO[to.name].component_path.file_path);
    elScript.setAttribute('type', 'text/javascript');

    document.head.appendChild(elScript);

    elScript.onload = function() {
      to.matched[toMatchLastIndex].components.default = ROUTER_INFO[to.name].component();

      _handleStyleElement(
        to,
        from,
        true
      );

      EventBus.emit('UPDATE_ROUTER_VIEW', Date.now());
    };

    elScript.onerror = function() {
      next('/404-not-found');
      elScript.remove();

      EventBus.emit('UPDATE_ROUTER_VIEW', Date.now());
    };
  }; // _doAfterElScriptFinish()

  const _listenBeforeEach = () => {
    routerTarget.beforeEach((to,from,next) => {
      // NOTE - First check if router need custom match valid url
      if(
        ROUTER_INFO[to.name] &&
        ROUTER_INFO[to.name].valid &&
        typeof ROUTER_INFO[to.name].valid === 'function' &&
        !ROUTER_INFO[to.name].valid.call({to: to})
      ) {
        console.error('this router\'s path is not valid!');
        next('/404-not-found');
        return;
      }

      // NOTE - Generate current language valid
      const curValidLanguage = __getCurLanguageValid(from, to);

      // NOTE - Check valid locale code id format
      /**
       * ANCHOR - /^[a-z-0-9]{2}(|-[A-Za-z]{2})(?:$)/
       * ANCHOR - &  LANGUAGE_CODE_LIST.indexOf([A-Za-z]{2}.toLowerCase())
       * ANCHOR - || COUNTRY_CODE_LIST.indexOf([A-Za-z]{2}.toUpperCase())
       */
      const isLocaleCodeIdFormatValid = __checkLocaleCodeIdFormatValid(to.params.language);

      // NOTE - Check to apply current valid language into html document lang attribute
      _setupLangHtmlDoc(curValidLanguage);

      // NOTE - Get redirect url with locale code id
      const urlRedirectWithLocaleCodeId = __getUrlRedirectWithLocaleCodeId(
        to,
        curValidLanguage,
        isLocaleCodeIdFormatValid,
      );

      if(urlRedirectWithLocaleCodeId) {
        if(popStateDetected) {
          routerTarget.replace(urlRedirectWithLocaleCodeId);

          popStateDetected = false;
        } else {
          next(urlRedirectWithLocaleCodeId);
        }

        return;
      } else if(popStateDetected) {
        popStateDetected = false;
      }

      // NOTE - check and handle if route has history option
      __handleHistoryOption(to);

      // NOTE - check if this route has redirect include history step storage (set params redirect info)
      if(__checkRedirectIfHasHistoryInfo(to)) {
        return;
      }

      if(!to.matched.length) {
        console.error('this router is not defined before!');
        next('/404-not-found');

        return;
      } else if(
        to.name === 'not-found-page' &&
        to.matched[toMatchLastIndex].components.default
      ) {
        setTimeout(function() {
          EventBus.emit('IS_SHOW_ROUTER_LOADING', false);

          if(
            to.name &&
            from.name !== to.name &&
            arrCssStyle[to.name]
          ) {
            document.head.append(arrCssStyle[to.name]);
          }

          next();

          // NOTE - N???u style tag c???a router tr?????c c?? t???n t???i th?? xo?? ??i ch?? ?? l?? n??n xo?? sau khi next() router
          _handleStyleElement(
            from,
            to
          );
        });

        return;
      }

      toMatchLastIndex = to.matched.length - 1;

      if(
        ROUTER_INFO[to.name].permisson &&
        typeof ROUTER_INFO[to.name].permisson.valid === 'function'
      ) {
        const isPermisonValid = ROUTER_INFO[to.name].permisson.valid.call({
          to: to,
          from: from,
        });

        if(!isPermisonValid) {
          const redirect = (
            ROUTER_INFO[to.name].permisson.redirect ?
            ROUTER_INFO[to.name].permisson.redirect :
            ROUTER_PATH[ROUTER_NAME['home-page']]
          );

          if(
            from.name &&
            redirect[curValidLanguage] === from.fullPath
          ) {
            return;
          }

          next(redirect[curValidLanguage]);
          return;
        }
      }

      if(
        !to.matched[toMatchLastIndex].components.default &&
        ROUTER_INFO[to.name].path
      ) {
        next();
        EventBus.emit('IS_SHOW_ROUTER_LOADING', {
          'extend_class': 'is-fill',
          'is_show': true,
        });

        let isGetLanguageFinish = true;

        // NOTE - N???u c?? khai b??o language on page th?? th???c hi???n load n???i dung language
        if(
          ROUTER_INFO[to.name].language &&
          !arrLanguagePicked[to.name]
        ) {
          isGetLanguageFinish = false;

          EventBus.once('IS_GET_LANGUAGE_FINISH--' + ROUTER_INFO[to.name].language.key, function() {
            isGetLanguageFinish = true;
          });

          fetch(ROUTER_INFO[to.name].language.path + '?v=' + CACHE_VERSION)
          .then(res => res.json())
          .then(function(objResponse) {
            if(_.isEmpty(objResponse)) {
              // NOTE - do something after empty (same error)
              arrLanguagePicked[to.name] = false;
            }

            arrLanguagePicked[to.name] = true;

            EventBus.emit(EVENT_BUS_KEY.UPDATE_LANGUAGE_KEYPATH, {
              key: ROUTER_INFO[to.name].language.key,
              keypath: objResponse,
              locale: LANGUAGE_VALID.en,
            });
          })
          .catch(function(err) {
            // NOTE - do something after error
            arrLanguagePicked[to.name] = false;
          });
        }

        // NOTE - N???u c?? khai b??o js on page th?? th???c hi???n load js tu???n t???
        if(
          ROUTER_INFO[to.name].js &&
          ROUTER_INFO[to.name].js.length
        ) {
          let intTotalOnPageScript = 0;
          let intTotalOnPageScriptFinish = 0;

          ROUTER_INFO[to.name].js.forEach(function(routerJsName) {
            if(!routerJsName) {
              return;
            }

            intTotalOnPageScript++;

            const jsPicked = EXTERNAL_LIB_MANAGER.js[routerJsName];

            if(
              jsPicked &&
              jsPicked.src &&
              !jsPicked.is_loaded &&
              (
                !jsPicked.env ||
                jsPicked.includes(ENV)
              )
            ) {
              // NOTE - ?????nh ngh??a script tag cho js lib hi???n t???i
              const elOnPageScript = document.createElement('script');
              elOnPageScript.setAttribute('src', jsPicked.src);
              elOnPageScript.setAttribute('type', 'text/javascript');

              if(
                jsPicked.integrity &&
                !BOT_INFO.isBot
              ) {
                elOnPageScript.setAttribute('integrity', jsPicked.integrity);
              }

              if(
                jsPicked.crossorigin &&
                jsPicked.crossorigin.show &&
                !BOT_INFO.isBot
              ) {
                elOnPageScript.setAttribute('crossorigin', jsPicked.crossorigin.value);
              }

              // NOTE -  ?????nh ngh??a link style cho css lib hi???n t???i
              let elOnPageStyle = null;

              if(
                EXTERNAL_LIB_MANAGER.css[routerJsName] &&
                EXTERNAL_LIB_MANAGER.css[routerJsName].href
              ) {
                elOnPageStyle = document.createElement('link');
                elOnPageStyle.rel = "stylesheet";
                elOnPageStyle.href = EXTERNAL_LIB_MANAGER.css[routerJsName].href + '?v=' + CACHE_VERSION;

                document.head.appendChild(elOnPageStyle);
              }

              document.head.appendChild(elOnPageScript);

              elOnPageScript.onload = function() {
                intTotalOnPageScriptFinish++;

                EXTERNAL_LIB_MANAGER.js[routerJsName].is_loaded = true;
              };
            } else {
              intTotalOnPageScriptFinish++;
            }
          });

          const doAfterScriptFinishTimeout = setInterval(function() {
            if(
              intTotalOnPageScript === intTotalOnPageScriptFinish &&
              // isPageLoadFinish &&
              isGetLanguageFinish
            ) {
              _doAfterElScriptFinish(to, from, next);

              clearInterval(doAfterScriptFinishTimeout);
            }
          });
        } else {
          const doAfterScriptFinishTimeout = setInterval(function() {
            if(
              // isPageLoadFinish &&
              isGetLanguageFinish
            ) {
              _doAfterElScriptFinish(to, from, next);

              clearInterval(doAfterScriptFinishTimeout);
            }
          });
        }
      } else {
        if(
          to.name &&
          from.name !== to.name &&
          arrCssStyle[to.name]
        ) {
          document.head.append(arrCssStyle[to.name]);
        }

        next();

        // NOTE - N???u style tag c???a router tr?????c c?? t???n t???i th?? xo?? ??i ch?? ?? l?? n??n xo?? sau khi next() router
        _handleStyleElement(
          from,
          to
        )
      }

      _handleMetaTag(to.name);
      _handleRobotsMetaTag(to.name);
      _handleCanonicalLinkTag(to);
      _handleAlternateLinkTag(to);
    });
  }; // _listenBeforeEach()

  const _initLocalStorageLanguage = () => {
    if(!localStorage.getItem(LOCAL_STORAGE_KEY.G2J_TRANSLATE_LANGUAGE)) {
      localStorage.setItem(LOCAL_STORAGE_KEY.G2J_TRANSLATE_LANGUAGE, LANGUAGE_DEFAULT);
    }
  }; // _initLocalStorageLanguage()

  const __getCurLanguageValid = (from, to) => {
    let localeStorageLanguage = localStorage.getItem(LOCAL_STORAGE_KEY.G2J_TRANSLATE_LANGUAGE);

    // NOTE - If language has '-' then split valid language (case language is locale code ID)
    let tmpLanguage = to.params.language || localeStorageLanguage || LANGUAGE_DEFAULT;

    if(tmpLanguage.includes('-')) {
      tmpLanguage=tmpLanguage.split('-')[0];
    }

    // NOTE - Force to change language in url
    if(
      !popStateDetected &&
      !from.name &&
      tmpLanguage &&
      LANGUAGE_VALID[tmpLanguage] &&
      localeStorageLanguage !== tmpLanguage
    ) {
      localeStorageLanguage = tmpLanguage;

      store.commit(PAGE_INFO_MODULE_NAME.setLanguage, localeStorageLanguage);
    }

    if(!localeStorageLanguage) {
      localeStorageLanguage = LANGUAGE_DEFAULT;

      store.commit(PAGE_INFO_MODULE_NAME.setLanguage, localeStorageLanguage);
    }

    return localeStorageLanguage;
  }; // __getCurLanguageValid()

  const __getUrlRedirectWithLocaleCodeId = (
    to,
    language,
    isLocaleCodeIdFormatValid
  ) => {
    const curValidLocaleCodeId = language + '-' + IP_INFO.country.toLowerCase();

    if(
      !to.name ||
      curValidLocaleCodeId === to.params.language
    ) {
      return null;
    }

    return (
      isLocaleCodeIdFormatValid ?
        to.fullPath.replace(/^[|\/](|[A-Za-z])+(|-)+(|[A-Za-z])+/,'/' + curValidLocaleCodeId) :
      '/' + curValidLocaleCodeId + (to.fullPath !== '/' ? to.fullPath : '')
    );
  }; // __getUrlRedirectWithLocaleCodeId()

  // NOTE - Check locale code id format is valid or not valid
  const __checkLocaleCodeIdFormatValid = (localeCodeId) => {
    if(
      !localeCodeId
      || typeof localeCodeId !== 'string'
      || !/^[a-z-0-9]{2}(|-[A-Za-z]{2})(?:$)/.test(localeCodeId)
    ) {
      return false;
    }

    const localeCodeIdSplitted = localeCodeId.split('-');

    return (
      LANGUAGE_CODE_LIST.includes(localeCodeIdSplitted[0]?.toLowerCase()) ||
      COUNTRY_CODE_LIST.includes(localeCodeIdSplitted[0]?.toUpperCase()) ||
      LANGUAGE_CODE_LIST.includes(localeCodeIdSplitted[1]?.toLowerCase()) ||
      COUNTRY_CODE_LIST.includes(localeCodeIdSplitted[1]?.toUpperCase())
    );
  }; // __checkLocaleCodeIdFormatValid()

  const __handleHistoryOption = (to) => {
    if(
      ROUTER_INFO[to.name] &&
      ROUTER_INFO[to.name].history_step
    ) {
      historyStepStorage = {
        name: to.name,
        params: to.params,
        query: to.query,
      };
    } else if(
      historyStepStorage &&
      ROUTER_INFO[to.name] &&
      (
        !ROUTER_INFO[to.name].redirect_list ||
        !ROUTER_INFO[to.name].redirect_list.includes(historyStepStorage.name)
      )
    ) {
      historyStepStorage = null;
    }
  }; // __handleHistoryOption

  const __checkRedirectIfHasHistoryInfo = (to) => {
    const redirectInfo = (
      (
        to.params.redirect_path &&
        typeof to.params.redirect_path === 'string'
      ) ?
      to.params.redirect_path :
      historyStepStorage
    );

    if(
      redirectInfo &&
      !to.params.redirect &&
      ROUTER_INFO[to.name] &&
      ROUTER_INFO[to.name].redirect_list &&
      ROUTER_INFO[to.name].redirect_list.includes(historyStepStorage.name)
    ) {
      routerTarget.replace({
        name: to.name,
        params: {
          ...to.params,
          redirect: redirectInfo,
        },
        query: to.query,
      });

      return true;
    }

    return false;
  }; // __checkRedirectIfHasHistoryInfo()

  const _detectBackHistory = () => {
    onPopStateEvent(window, function(e) {
      const state = e.state;

      if (state !== null) {
        popStateDetected = true
      }
    });
  }; // _detectBackHistory()

  // NOTE - prevent error when use push to route B but navigate detect redirected to route A
  // NOTE - https://stackoverflow.com/questions/62223195/vue-router-uncaught-in-promise-error-redirected-from-login-to-via-a
  const _setupVueRouterPushPrototype = () => {
    const originalPush = window.VueRouter.prototype.push
    window.VueRouter.prototype.push = function push(location, onResolve, onReject) {
      if (onResolve || onReject)
        return originalPush.call(this, location, onResolve, onReject)
      return originalPush.call(this, location).catch((err) => {
        if (window.VueRouter.isNavigationFailure(err)) {
          // resolve err
          return err
        }
        // rethrow error
        return Promise.reject(err)
      })
    }
  }; // _setupVueRouterPushPrototype

  // NOTE - prevent error when use push to route B but navigate detect redirected to route A
  // NOTE - https://stackoverflow.com/questions/62223195/vue-router-uncaught-in-promise-error-redirected-from-login-to-via-a
  const _setupVueRouterReplacePrototype = () => {
    const originalReplace = window.VueRouter.prototype.replace
    window.VueRouter.prototype.replace = function push(location, onResolve, onReject) {
      if (onResolve || onReject)
        return originalReplace.call(this, location, onResolve, onReject)
      return originalReplace.call(this, location).catch((err) => {
        if (window.VueRouter.isNavigationFailure(err)) {
          // resolve err
          return err
        }
        // rethrow error
        return Promise.reject(err)
      })
    }
  }; // _setupVueRouterReplacePrototype

  const _handleStyleElement = (
    from,
    to,
    isNewest = false
  ) => {
    // console.log('============================');
    // console.log('from: '+from.name);
    // console.log('to: '+to.name);
    // console.log('no_style: '+!!ROUTER_INFO[from.name].no_style);
    // console.log('arrElStyleEachFirstRouterLoading:');
    // console.log(arrElStyleEachFirstRouterLoading);
    // console.log('arrCssStyle:');
    // console.log(arrCssStyle);

    if(
      from.name &&
      from.name !== to.name &&
      !ROUTER_INFO[from.name].no_style
    ) {
      // NOTE - Th??m style tag c???a router view ???? v??o danh s??ch style (router view n??o c??ng ph???i c?? style tag, kh??ng nhi???u th?? ??t)

      // while(arrElStyleEachFirstRouterLoading.length > 0) {
      //   arrElStyleEachFirstRouterLoading[0].remove();
      // }

      arrElStyleEachFirstRouterLoading.forEach(function(elStyle) {
        elStyle.remove()
      });

      arrElStyleEachFirstRouterLoading = [];

      const tmpOldStyleName = (isNewest ? to.name : from.name);

      if(arrCssStyle[tmpOldStyleName]) {
        arrCssStyle[tmpOldStyleName].remove();
        // console.log('============================');
      }

      const tmpNewStyleName = (isNewest ? from.name : to.name);

      if(!arrCssStyle[tmpNewStyleName]) {
        let awaitGetStyleTagInterval = setInterval(function() {
          // arrElStyleEachFirstRouterLoading = document.head.getElementsByClassName(from.name + '-style-tag');
          arrElStyleEachFirstRouterLoading = document.head.querySelectorAll('[class$="-style-tag"]');

          if(arrElStyleEachFirstRouterLoading.length) {
            clearInterval(awaitGetStyleTagInterval);
            awaitGetStyleTagInterval = null;

            const _tmpElStyle = _generateElStyle();

            if(_tmpElStyle) {
              arrCssStyle[tmpNewStyleName] = _tmpElStyle;

              if(ENV === ARR_ENV.development) {
                document.head.append(arrCssStyle[from.name]);

                arrElStyleEachFirstRouterLoading.forEach(function(elStyle) {
                  elStyle.remove()
                });

                arrElStyleEachFirstRouterLoading = [];
              }
            }

            // console.log('first create arrCssStyle:');
            // console.log(arrCssStyle);
            // console.log('============================');
          }
        });
      }
    }
  }; // _handleStyleElement()

  const _generateElStyle = (enableReMatch = true) => {
    if(!arrElStyleEachFirstRouterLoading.length) {
      return null;
    }

    let _tmpStyleCounter = 0;
    let _tmpStyleContent = '';

    do {
      if(arrElStyleEachFirstRouterLoading[_tmpStyleCounter].innerText.trim()) {
        _tmpStyleContent+=arrElStyleEachFirstRouterLoading[_tmpStyleCounter].innerText;
      }

      _tmpStyleCounter++;
    } while(_tmpStyleCounter < arrElStyleEachFirstRouterLoading.length)

    if(_tmpStyleContent) {
      const _tmpElStyle = document.createElement('style');
      _tmpElStyle.setAttribute('type', 'text/css');
      _tmpElStyle.innerHTML = _tmpStyleContent;

      return _tmpElStyle;
    }

    if(enableReMatch) {
      arrElStyleEachFirstRouterLoading = document.head.querySelectorAll('[class$="-style-tag"]');

      return _generateElStyle(false);
    }

    return null;
  }; // _generateElStyle()

  const _setupLangHtmlDoc = (lang) => {
    if(
      LANGUAGE_VALID[lang] &&
      elHtmlDoc.lang !== lang+'-'+IP_INFO.country
    ) {
      elHtmlDoc.setAttribute('lang', lang+'-'+IP_INFO.country);
    }
  }; // _setupLangHtmlDoc()

  // NOTE - Handle meta tag
  const _handleMetaTag = (curRouterName) => {
    if(!ROUTER_INFO[curRouterName].has_meta_tag) {
      HandleSeoTag.remove();
    }
  }; // _handleMetaTag()

  // NOTE - Handle robots meta tag
  const _handleRobotsMetaTag = (curRouterName) => {
    if(typeof ROUTER_INFO[curRouterName].robots_meta_tag === 'object') {
      HandleSeoTag.setupRobots(ROUTER_INFO[curRouterName].robots_meta_tag);
    } else {
      HandleSeoTag.removeRobots();
    }
  }; // _handleRobotsMetaTag()

  // NOTE - Handle canonical link tag
  const _handleCanonicalLinkTag = (to) => {
    let url = BASE_URL;
    if(to.name === ROUTER_NAME['hotel-detail-page']) {
      url+=to.path;
    } else {
      url+=to.fullPath;
    }

    HandleSeoTag.setupCanonical(url);
  }; // _handleCanonicalLinkTag()

  // NOTE - Handle alternate link tag
  const _handleAlternateLinkTag = (to) => {
    let url = BASE_URL;
    if(to.name === ROUTER_NAME['hotel-detail-page']) {
      url+=to.path;
    } else {
      url+=to.fullPath;
    }

    HandleSeoTag.setupAlternate(url);
  }; // _handleAlternateLinkTag()

  return {
    init(router) {
      if(
        routerTarget ||
        !router
      ) {
        return;
      }

      _setupVueRouterPushPrototype();
      _setupVueRouterReplacePrototype();

      routerTarget = router;

      _detectBackHistory();

      _initLocalStorageLanguage();

      _listenBeforeEach();
    }
  };
})(); // RouterUtil()
