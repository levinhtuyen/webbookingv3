import {
  LANGUAGE_DEFAULT,
  getToken,
} from '~jsDefinePath/general';
import {
  AJAX_URL,
} from '~jsDefinePath/ajax-url';
import {
  _,
} from '~jsPath/lib/lib-manager';
import {
  EVENT_BUS_KEY
} from '~jsDefinePath/event-bus';
import {
  LOCAL_STORAGE_KEY
} from '~jsPath/define/local-storage';
import {
  i18n,
} from '~jsBasePath/vue-i18n/translate';
import { apiCaller } from '~jsHelperPath/service/ApiHandler';
const MODULE_NAME = 'pageInfoModule';

const MUTATIONS_KEY = {
  setImageUrl: 'setImageUrl',
  setResManagementData: 'setResManagementData',
  setPersonalLocationInfo: 'setPersonalLocationInfo',
  setCurProvineSnSelected: 'setCurProvineSnSelected',
  setLanguage: 'setLanguage',
  setUserProfile: 'setUserProfile',
  setUserInfo: 'setUserInfo',
  setCurLocationSelected: 'setCurLocationSelected',
};

const COMMIT_KEY = {
  setImageUrl: MODULE_NAME + '/' + MUTATIONS_KEY.setImageUrl,
  setResManagementData: MODULE_NAME + '/' + MUTATIONS_KEY.setResManagementData,
  setPersonalLocationInfo: MODULE_NAME + '/' + MUTATIONS_KEY.setPersonalLocationInfo,
  setCurProvineSnSelected: MODULE_NAME + '/' + MUTATIONS_KEY.setCurProvineSnSelected,
  setLanguage: MODULE_NAME + '/' + MUTATIONS_KEY.setLanguage,
  setUserProfile: MODULE_NAME + '/' + MUTATIONS_KEY.setUserProfile,
  setUserInfo: MODULE_NAME + '/' + MUTATIONS_KEY.setUserInfo,
  setCurLocationSelected: MODULE_NAME + '/' + MUTATIONS_KEY.setCurLocationSelected,
};

const ACTIONS_KEY = {
  getAjaxUserProfile: 'getAjaxUserProfile',
  clearUserInfo: 'clearUserInfo',
};

const DISPATH_KEY = {
  getAjaxUserProfile: MODULE_NAME + '/' + ACTIONS_KEY.getAjaxUserProfile,
  clearUserInfo: MODULE_NAME + '/' + ACTIONS_KEY.clearUserInfo,
};

// NOTE - setup initial state
const _personalLocationInfoInitial = (() => {
  if(localStorage[LOCAL_STORAGE_KEY.G2J_PERSONAL_LOCATION_INFO]) {
    return JSON.parse(localStorage[LOCAL_STORAGE_KEY.G2J_PERSONAL_LOCATION_INFO]);
  }

  return {
    latitude: 10.767674,
    longitude: 106.6651843,
    provinceSn: 1,
  };
})();

const pageInfoModule = {
  namespaced: true,

  state: {
    imageUrl: null,
    resManagementData: [],
    // NOTE - store of personal location infomation, to use at all pages.
    personalLocationInfo: _personalLocationInfoInitial,

    // NOTE - store of current location selected by user at current time
    /**
     * {
     *    provinceSn: default 1
     *    provinceName: default Hồ Chí Minh
     * }
     */
    curLocationSelected: {
      provinceSn: (parseInt(localStorage[LOCAL_STORAGE_KEY.G2J_CUR_PROVINCE_SN]) || 1),
      provinceName: (localStorage[LOCAL_STORAGE_KEY.G2J_CUR_PROVINCE_NAME] || 'Hồ Chí Minh'),
    },

    // NOTE - provinceSn for current hightly slection (default: 1)
    curProvinceSnSelected: parseInt(
      localStorage[LOCAL_STORAGE_KEY.G2J_PERSONAL_PROVINCE_SN] ||
      localStorage[LOCAL_STORAGE_KEY.G2J_SELECTED_PROVINCE_SN] ||
      localStorage[LOCAL_STORAGE_KEY.G2J_DEFAULT_PROVINCE_SN] ||
      1
    ),

    // NOTE - store language for all page
    language: localStorage.getItem(LOCAL_STORAGE_KEY.G2J_TRANSLATE_LANGUAGE) || LANGUAGE_DEFAULT,

    // NOTE - store user profile information
    userProfile: {},

    // NOTE - store user info information
    userInfo: {},
  },

  getters: {
    managementList(state) {
      if(_.isEmpty(state.resManagementData)) {
        return [];
      }

      return state.resManagementData.management_list;
    }, // managementList

    provinceSn(state) {
      return state.personalLocationInfo.provinceSn;
    }, // provinceSn

    curProvinceSn(state) {
      return state.curLocationSelected.provinceSn;
    }, // curProvinceSn

    curProvinceName(state) {
      return state.curLocationSelected.provinceName;
    }, // curProviceName

    hasCurProvinceInfo(state) {
      return !_.isEmpty(state.curLocationSelected);
    }, // hasCurProvinceInfo

    hasUserInfo(state) {
       const profileInfo = localStorage.getItem("userInfo")
        ? JSON.parse(
            decodeURIComponent(
              escape(window.atob(localStorage.getItem("userInfo")))
            )
          )
        : "";
      return (
        !_.isEmpty(state.userInfo) ||
        !_.isEmpty(state.userProfile) ||
         !_.isEmpty(profileInfo)
      );
    }, // hasUserInfo

    viaApp(state) {
      return (
        state.userInfo?.viaApp ||
        state.userProfile?.viaApp
      );
    }, // viaApp

    nickName(state) {
      return (
        state.userInfo?.nickName ||
        state.userProfile?.nickName
      );
    }, // nickName
    phoneUser(state) {
      return (
        state.userInfo?.mobile ||
        state.userProfile?.mobile
      );
    }, // nickName

    userInformation(state,getters){
      const profileInfo = localStorage.getItem("userInfo")
        ?  JSON.parse(
            decodeURIComponent(
              escape(window.atob(localStorage.getItem("userInfo")))
            )
          )
        : "";
      if ( getters.hasUserInfo && _.isEmpty(state.userInfo) && !_.isEmpty(profileInfo)){
        return profileInfo
      }

      return state.userInfo
    }
  },

  mutations: {
    // NOTE - setImageUrl
    [MUTATIONS_KEY.setImageUrl](state, imageUrl) {
      state.imageUrl = imageUrl;
    },

    // NOTE - setResManagementData
    [MUTATIONS_KEY.setResManagementData](state, resManagementData) {
      state.resManagementData = resManagementData;
    },

    // NOTE - setPersonalLocationInfo
    [MUTATIONS_KEY.setPersonalLocationInfo](state, personalLocationInfo) {
      state.personalLocationInfo = personalLocationInfo;

      // NOTE - Update personal location info into localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY.G2J_PERSONAL_LOCATION_INFO, JSON.stringify(personalLocationInfo));

      // NOTE - Broadcast update province sn event
      EventBus.emit(EVENT_BUS_KEY.UPDATE_PROVINCE_SN);
    },

    // NOTE - setCurProvineSnSelected
    [MUTATIONS_KEY.setCurProvineSnSelected](state, curProvinceSnSelected) {
      state.curProvinceSnSelected = curProvinceSnSelected;
    },

    // NOTE - setLanguage
    [MUTATIONS_KEY.setLanguage](state, language) {
      state.language = language;

      if(language !== localStorage.getItem(LOCAL_STORAGE_KEY.G2J_TRANSLATE_LANGUAGE)) {
        localStorage.setItem(LOCAL_STORAGE_KEY.G2J_TRANSLATE_LANGUAGE, language);

        i18n.locale = language;
      }
    },

    // NOTE - setUserProfile
    [MUTATIONS_KEY.setUserProfile](state, userProfile) {
      state.userProfile = userProfile || {};
    },

    // NOTE - setUserProfile
    [MUTATIONS_KEY.setUserInfo](state, userInfo) {
      state.userInfo = userInfo || {};
    },

    // NOTE - setCurLocationSelected
    [MUTATIONS_KEY.setCurLocationSelected](state, curLocationSelected) {
      state.curLocationSelected = curLocationSelected;

      // NOTE - Setup current location info into localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY.G2J_CUR_PROVINCE_SN, curLocationSelected.provinceSn);
      localStorage.setItem(LOCAL_STORAGE_KEY.G2J_CUR_PROVINCE_NAME, curLocationSelected.provinceName);
    },
  },

  actions: {
    [ACTIONS_KEY.getAjaxUserProfile]({commit}) {
      if(getToken()) {
        apiCaller({
          headers: {
            'Authorization': getToken(),
          },

          method: 'GET',
          metaUrl: AJAX_URL.user.getUserProfile,
          dataType: 'json',

          error(err) {
            localStorage.removeItem(LOCAL_STORAGE_KEY.G2J_TOKEN);
            localStorage.removeItem('expiresAt');
            // localStorage.removeItem('viaApp');
            localStorage.removeItem('userInfo');
          },

          success(objResponse) {
            if(
              _.isEmpty(objResponse) ||
              objResponse.error ||
              _.isEmpty(objResponse.data)
            ) {
              localStorage.removeItem(LOCAL_STORAGE_KEY.G2J_TOKEN);
              localStorage.removeItem('expiresAt');
              // localStorage.removeItem('viaApp');
              localStorage.removeItem('userInfo');
              return;
            }
            // localStorage.setItem('userInfo', btoa(JSON.stringify(objResponse.data)));
               localStorage.setItem(
                "userInfo",
                btoa(unescape(encodeURIComponent(JSON.stringify(objResponse.data))))
              );
            commit(MUTATIONS_KEY.setUserProfile, objResponse.data);


          },
        });
      } else {
        localStorage.removeItem('expiresAt');
        // localStorage.removeItem('viaApp');
        localStorage.removeItem('userInfo');
      }
    },

    [ACTIONS_KEY.clearUserInfo]({commit}) {
      commit(MUTATIONS_KEY.setUserProfile, {});
      commit(MUTATIONS_KEY.setUserInfo, {});
    },
  },
};

export {
  MODULE_NAME,
  MUTATIONS_KEY,
  COMMIT_KEY,
  ACTIONS_KEY,
  DISPATH_KEY,
  pageInfoModule,
};
