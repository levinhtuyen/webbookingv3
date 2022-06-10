<template>
  <G2jBasicModal
    v-if="
      enableToShow &&
      isShowModal
    "
    :custom-modal-class="'location-selection-modal'"
    :disable-window-scroll="true"
    :disable-user-close-modal="disableUserCloseModal"
    :is-zindex-top="true"
    @close="closeModal"
  >
    <template #head-title>
      {{ $t('home.select_your_favourite_location') }}
    </template> <!-- slot: #head-title -->

    <template #body-content>
      <button
        v-if="isShowFindLocationBtn"
        class="location-selection-modal__find-location-btn"
        @click="detectActualUserLocation"
      >
        <span class="icon-shape">
          <i class="far fa-location"></i>
        </span>

        <span class="label-col">
          {{ $t('home.find_my_location') }}
        </span>
      </button> <!-- .location-selection-modal__find-location-btn -->

      <component
        :is="vSelectComponent"
        :class="'location-selection-modal__select-item'"
        :options="cityList"
        :filter="fuseCitySearch"
        :reduce="(cityItem) => cityItem"
        :placeholder="$t('home.district_or_city')"
        @input="onSetupCurProvinceInfo"
        label="name"
      >
        <template #no-options>
          {{ $t('home.no_result') }}
        </template>
      </component>

      <label
        v-if="disableUserCloseModal"
        for="location-selection-modal__check-box-item" class="location-selection-modal__check-box-field"
      >
        <input
          v-model="disableToShowLocationSelectionModal"
          type="checkbox"
          id="location-selection-modal__check-box-item"
          class="location-selection-modal__check-box-item"
        >
        <span class="location-selection-modal__check-box-fake">
          <i
            v-if="disableToShowLocationSelectionModal"
            class="far fa-check"
          />
        </span>
        <span class="location-selection-modal__check-box-label">
          {{ $t('home.never_show_again') }}
        </span>
      </label>
    </template> <!-- slot: #body-content -->
  </G2jBasicModal>
</template>

<script>
import {
  ENV,
  ARR_UUID_INFO,
} from '~jsDefinePath/general';
import {
  _,
  mapGetters,
  mapState,
  uuidv1,
} from '~jsLibPath/lib-manager';
import {
  VueSelect,
} from '~jsLibPath/vue-select-lib';
import {
  Fuse,
} from '~jsLibPath/fuse-lib';
import {
  LOCAL_STORAGE_KEY,
} from '~jsDefinePath/local-storage';
import {
  SESSION_STORAGE_KEY,
} from '~jsDefinePath/session-storage';
import {
  AJAX_URL,
} from '~jsDefinePath/ajax-url';
import {
  EVENT_BUS_KEY,
} from '~jsDefinePath/event-bus';
import {
  EventBus,
} from '~jsHelperPath/service/EventBus';
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
  COMMIT_KEY as PAGE_INFO_COMMIT_KEY,
} from '~jsBasePath/vuex/modules/page-info-module';
import {
  apiCaller,
} from '~jsHelperPath/service/ApiHandler';

import {
  MODULE_NAME as HOME_PAGE_MODULE_NAME,
  COMMIT_KEY as HOME_PAGE_COMMIT_KEY,
} from '../page-module';
import G2jBasicModal from '~jsPartialPath/global/component/g2j-basic-modal/G2jBasicModal.vue';


export default {
  components: {
    G2jBasicModal,
  },

  props: {
    enableAutoShow: {
      type: Boolean,
      default: true,
    }, // enableAutoShow

    enableToShow: {
      type: Boolean,
      default: false,
    }, // enableAutoShow

    disableUserCloseModal: {
      type: Boolean,
      default: true,
    }, // disableUserCloseModal

    fromComponentName: {
      type: String,
      default: '',
    }, // fromComponentName
  },

  data() {
    return {
      fuseCityInit: null,

      // NOTE - check for reload to get new location
      isReload: false,

      set isShowFindLocationBtn(val) {
        if(val) {
          localStorage.removeItem(LOCAL_STORAGE_KEY.G2J_LOCATION_PERMISSION_BLOCKED);
        } else {
          localStorage.setItem(LOCAL_STORAGE_KEY.G2J_LOCATION_PERMISSION_BLOCKED, 1);
        }
      }, // set isShowFindLocationBtn

      get isShowFindLocationBtn() {
        return !localStorage[LOCAL_STORAGE_KEY.G2J_LOCATION_PERMISSION_BLOCKED];
      }, // get isShowFindLocationBtn

      // NOTE - define set and get value for data disableToShowLocationSelectionModal (to realtime keep value of disableToShowLocationSelectionModal in each browser's tab)
      disableToShowLocationSelectionModal: (
        localStorage[LOCAL_STORAGE_KEY.G2J_DISABLE_SHOW_LOCATION_SELECTION_MODAL] ?
          (localStorage[LOCAL_STORAGE_KEY.G2J_DISABLE_SHOW_LOCATION_SELECTION_MODAL] == 1) :
          true
      ),

      vSelectComponent: null,
    };
  },

  computed: {
    ...mapGetters(HOME_PAGE_MODULE_NAME, {
      hasCityList: 'hasCityList',
    }),

    ...mapState(HOME_PAGE_MODULE_NAME, [
      'cityList',
    ]),

    ...mapGetters(PAGE_INFO_MODULE_NAME, [
      'curProvinceSn',
      'curProvinceName'
    ]),

    ...mapState(PAGE_INFO_MODULE_NAME, [
      'language',
      'personalLocationInfo',
    ]),

    isFirstGetCityList() {
      return !this.hasCityList;
    }, // isFirstGetCityList

    isShowModal() {
      return !this.isFirstGetCityList;
    }, // isShowModal
  },

  created() {
    const self = this;

    // NOTE - If manual click to show and has had city list yet -> show loading full page
    if(
      // (
      //   self.enableAutoShow ||
      //   self.enableToShow
      // ) ||
      !self.hasCityList
    ) {
      self.ajaxFindAllProvinceCity();
    } else if(window.VueSelect?.VueSelect) {
      self.vSelectComponent = window.VueSelect.VueSelect;
    }
  },

  methods: {
    ajaxFindAllProvinceCity() {
      const self = this;

      if(self.fromComponentName) {
        EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING,{
          is_show: true,
          namespace: self.$route.name,
        });
      }

      apiCaller({
        metaUrl: AJAX_URL.location.city_list,
        type: 'GET',
        dataType: 'json',

        error (err) {
          self.isFirstGetCityList = false;

          EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING,{
            is_show: false,
            namespace: self.$route.name,
          });
        },

        success (objResponse) {
          if (
            _.isEmpty(objResponse) ||
            objResponse.error ||
            _.isEmpty(objResponse.data)
          ) {
            return;
          }

          const cityList = objResponse.data;

          const VueSelectPromise = VueSelect();
          const FusePromise = Fuse();

          // NOTE - If get city list success, system will run lib VueSelect and Fuse js

          Promise.all([
            VueSelectPromise.js,
            FusePromise.js
          ]).then(function() {
            if(
              window.Fuse &&
              window.VueSelect
            ) {
              self.fuseCityInit = new window.Fuse(
                cityList,
                {
                  keys: ['name'],
                  // includeScore: 1,
                  includeMatches: true,
                }
              );

              self.$store.commit(HOME_PAGE_COMMIT_KEY.setCityList, cityList);

              self.isFirstGetCityList = false;
              // EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, false);

              if(self.fromComponentName) {
                EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
                  is_show: false,
                  namespace: self.$route.name,
                });
              }

              self.vSelectComponent = window.VueSelect.VueSelect;
            }
          });
        },
      });
    }, // ajaxFindAllProvinceCity()

    ajaxUpdateSelectLocation(uuidInfo, locationInfo, isSelectedByUser = false) {
      const self = this;

      if(
        !_.isEmpty(locationInfo) &&
        locationInfo.latitude &&
        locationInfo.longitude
      ) {
        EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
          namespace: self.$route.name,
          is_show: true,
        });

        self.isReload = (locationInfo.sn && locationInfo.sn !== self.curProvinceSn);

        self.$store.commit(PAGE_INFO_COMMIT_KEY.setPersonalLocationInfo, {
          latitude: locationInfo.latitude,
          longitude: locationInfo.longitude,
          provinceSn: (locationInfo.sn ? locationInfo.sn : self.curProvinceSn),
        });

        const uuid = (
          localStorage[uuidInfo.key] ?
            (JSON.parse(localStorage[uuidInfo.key])?.uuid ?? uuidv1()) :
          uuidv1()
        );

        apiCaller({
          url: uuidInfo.base_url + '/web-booking/device/updateWebDevice',
          data: {
            uuid,
            latitude: locationInfo.latitude,
            longitude: locationInfo.longitude,
          },
          method: 'POST',
          dataType: 'json',

          error() {
            EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
              is_show: false,
              namespace: self.$route.name,
            });
          },

          success(objResponse) {
            if(
              _.isEmpty(objResponse) ||
              objResponse.error ||
              _.isEmpty(objResponse.data)
            ) {
              EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
                is_show: false,
                namespace: self.$route.name,
              });
              return;
            }
          },

          complete() {
            if(isSelectedByUser) {
              localStorage.setItem(LOCAL_STORAGE_KEY.G2J_IS_LOCATION_SELECTED_BY_USER, 1);
              localStorage.removeItem(LOCAL_STORAGE_KEY.G2J_LOCATION_EXPIRED_TIME);
            } else {
              localStorage.removeItem(LOCAL_STORAGE_KEY.G2J_IS_LOCATION_SELECTED_BY_USER);
              localStorage.setItem(LOCAL_STORAGE_KEY.G2J_LOCATION_EXPIRED_TIME, Date.now());
            }

            EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
              is_show: false,
              namespace: self.$route.name,
            });

            // NOTE - reload tab if cur location selected difference old of it
            if(self.isReload) {
              localStorage.setItem(LOCAL_STORAGE_KEY.G2J_DISABLE_SHOW_LOCATION_SELECTION_MODAL, self.disableToShowLocationSelectionModal ? 1 : 0);
              window.location.reload();
              return;
            }

            // NOTE - if cur location selected = old location selected, system just close modal and doesn't reload tab
            self.closeModal();
          },
        });
      } else {
        // NOTE - reload tab if cur location selected difference old of it
        if(self.isReload) {
          localStorage.setItem(LOCAL_STORAGE_KEY.G2J_DISABLE_SHOW_LOCATION_SELECTION_MODAL, self.disableToShowLocationSelectionModal ? 1 : 0);
          window.location.reload();
          return;
        }

        // NOTE - if cur location selected = old location selected, system just close modal and doesn't reload tab
        self.closeModal();
      }
    }, // ajaxUpdateSelectLocation()

    onSetupCurProvinceInfo(curLocationSelected, isSelectedByUser = true) {
      if(_.isEmpty(curLocationSelected)) {
        return;
      }

      if(!sessionStorage[SESSION_STORAGE_KEY.G2J_HAS_SELECTED_LOCATION]) {
        sessionStorage.setItem(SESSION_STORAGE_KEY.G2J_HAS_SELECTED_LOCATION, 1);
      }

      // NOTE - Update location selected info for analyst
      this.ajaxUpdateSelectLocation(
        ARR_UUID_INFO[ENV],
        {
          latitude: curLocationSelected.latitude,
          longitude: curLocationSelected.longitude,
          sn: curLocationSelected.sn,
        },
        isSelectedByUser,
      );

      // NOTE - setup current location info into localStorage
      this.$store.commit(PAGE_INFO_COMMIT_KEY.setCurLocationSelected, {
        provinceSn: curLocationSelected.sn,
        provinceName: curLocationSelected.name,
      });
    }, // onSetupCurProvinceInfo()

    detectActualUserLocation() {
      const self = this;

      EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
        namespace: self.$route.name,
        is_show: true,
      });

      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            // window.alert(
            //   'position.longitude: ' + position.longitude + 'position.latitude: ' + position.latitude
            // );
            // NOTE - get current position success
            self.isShowFindLocationBtn = true;

            self.setCurrentCustomerLocation(position);
          },
          function(error) {
            // window.alert(
            //   'error.code: ' + error.code + 'error.permission.denided: ' + error.PERMISSION_DENIED
            // );

            // NOTE - get current position fail
            switch (error.code) {
              case error.PERMISSION_DENIED:
                break;
              case error.POSITION_UNAVAILABLE:
                break;
              case error.TIMEOUT:
                break;
              case error.UNKNOWN_ERROR:
                break;
            }

            self.isShowFindLocationBtn = false;
            EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
              namespace: self.$route.name,
              is_show: false,
            });
          }
        );
      }
    }, // detectActualUserLocation()

    setCurrentCustomerLocation (position) {
      const self = this;

      // NOTE - set current customer location
      apiCaller({
        url: AJAX_URL.user.find_user_location,
        data: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        type: 'GET',
        dataType: 'json',

        error () {
          EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
            namespace: self.$route.name,
            is_show: false,
          });

          // NOTE - Update location selected info for analyst
          self.ajaxUpdateSelectLocation(ARR_UUID_INFO[ENV], {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          self.closeModal();
        },

        success (objResponse) {
          if (
            _.isEmpty(objResponse) ||
            objResponse.error ||
            _.isEmpty(objResponse.data)
          ) {
            EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
              namespace: self.$route.name,
              is_show: false,
            });

            // NOTE - Update location selected info for analyst
            self.ajaxUpdateSelectLocation(ARR_UUID_INFO[ENV], {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            self.closeModal();
            return;
          }

          self.isReload = (objResponse.data.provinceSn !== self.curProvinceSn);

          // NOTE - Update provinceSn for personalLocationInfo
          self.$store.commit(PAGE_INFO_COMMIT_KEY.setPersonalLocationInfo, {
            ...self.personalLocationInfo,
            provinceSn: objResponse.data.provinceSn,
          });

          // NOTE - Setup current location
          self.onSetupCurProvinceInfo(
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              sn: objResponse.data.provinceSn,
              name: objResponse.data.provinceName,
            },
            false
          );
        },
      });
    }, // setCurrentCustomerLocation()

    fuseCitySearch(options, search) {
      if(!this.fuseCityInit) {
        return {}; // NOTE - :filter props của vselect yêu cầu callback trả về object type
      }

      return search.length ? this.fuseCityInit.search(search).map((result) => result.item) : this.fuseCityInit.list;
    }, // fuseCitySearch()

    closeModal() {
      localStorage.setItem(LOCAL_STORAGE_KEY.G2J_DISABLE_SHOW_LOCATION_SELECTION_MODAL, this.disableToShowLocationSelectionModal ? 1 : 0);
      this.$emit('close');
    }, // closeModal()
  },
};
</script>
