<template>
  <section class="location-selection-section">
    <div class="container">
      <div class="location-selection-block">
        <div class="block-head">
          <div class="block-head-title-col">
            <span class="block-head-title">
              {{ $t('home.choose_collection') }}
            </span>
          </div> <!-- .block-head-title-col -->

          <div class="block-head-selection-col">
            <div
              class="block-head-selection-field"
              @click="onOpenModal"
            >
              <span class="field-icon-shape">
                <i class="fas fa-map-marker-alt" />
              </span>

              <span class="field-title">
                {{ locationSelectedTitle }}
              </span>

              <span class="field-arrow-icon-shape">
                <i class="fas fa-sort-down" />
              </span>
            </div>
          </div>
        </div> <!-- .block-head -->

        <div class="block-body">
          <div
            id="location-selection-default__wrap-outer"
            ref="LocationSelectionDefaultWrapOuter"
            class="location-selection-default-wrap-outer swiper-container"
            :class="locationDefaultWrapReadmoreClass"
          >
            <div
              id="location-selection-default__wrap"
              class="location-selection-default-wrap swiper-wrapper"
              :class="locationDefaultWrapExtendClass"
            >
              <div
                class="default-item swiper-slide"
                @click.prevent="onClickLocationNearYou(
                  locationNearYou.path[language],
                  locationNearYou.i18n_locale_key
                )"
              >
                <div class="item-head">
                  <i class="fas fa-map-marker-alt" />
                </div> <!-- .item-head -->

                <div class="item-body">
                  <div class="title-label-field">
                    <span class="title-label">
                      {{ locationNearYou.title }}
                    </span> <!-- .title-label -->
                  </div> <!-- .title-label-field -->
                </div> <!-- .item-body -->
              </div> <!-- .default-item -->

              <template v-if="hasLocationDefaultClient">
                <template v-for="(locationDefaultClientItem, idx) in locationDefaultClient">
                  <router-link
                    :key="idx"
                    v-slot="{ href, navigate }"
                    :to="locationDefaultClientItem.path[language]"
                  >
                    <a
                      v-if="locationDefaultClientItem.has_onclick"
                      class="default-item swiper-slide"
                      :href="href"
                      @click.prevent="onClickDefaultClientLocation(
                        href,
                        locationDefaultClientItem.has_tracking,
                        locationDefaultClientItem.i18n_locale_key
                      )"
                    >
                      <div class="item-head">
                        <i class="fas fa-map-marker-alt" />
                      </div> <!-- .item-head -->

                      <div class="item-body">
                        <div class="title-label-field">
                          <span class="title-label">
                            {{ locationDefaultClientItem.title }}
                          </span> <!-- .title-label -->
                        </div> <!-- .title-label-field -->
                      </div> <!-- .item-body -->
                    </a> <!-- .default-item -->

                    <a
                      v-else
                      class="default-item swiper-slide"
                      :href="href"
                      @click="navigate"
                    >
                      <div class="item-head">
                        <i class="fas fa-map-marker-alt" />
                      </div> <!-- .item-head -->

                      <div class="item-body">
                        <div class="title-label-field">
                          <span class="title-label">
                            {{ locationDefaultClientItem.title }}
                          </span> <!-- .title-label -->
                        </div> <!-- .title-label-field -->
                      </div> <!-- .item-body -->
                    </a> <!-- .default-item -->
                  </router-link>
                </template>
              </template>

              <template v-if="hasLocationDefaultFormattedData">
                <template v-for="(locationDefaultItem, idx) in locationDefaultList">
                  <router-link
                    :key="locationDefaultItem.sn"
                    v-slot="{ href }"
                    :to="locationDefaultItem.path[language]"
                    :set="isLocationDefaultListUpdateFinish = (idx + 1 === locationDefaultList.length)"
                  >
                    <a
                      class="default-item swiper-slide"
                      :href="href"
                      @click.prevent="onClickLocationDefault(href, locationDefaultTitleLacaleList[idx])"
                    >
                      <div class="item-head">
                        <img
                          :src="IMAGE_URL + '/g2j-lazy-loading--sm.png?v=' + CACHE_VERSION"
                          :data-src="assetsServiceUrl + '/' + locationDefaultItem.imagePath"
                          :alt="locationDefaultItem.title"
                          class="item-img"
                          :class="{
                            'swiper-lazy': minLocationSelection < idx + totalLocationDefaultClient,
                            'lazyload': minLocationSelection >= idx + totalLocationDefaultClient,
                          }"
                          width="100%"
                          height="100%"
                          loading="lazy"
                          data-sizes="auto"
                        >
                      </div> <!-- .item-head -->

                      <div class="item-body">
                        <div class="title-label-field">
                          <span class="title-label">
                            {{ htmlDecode(locationDefaultTitleLacaleList[idx][language] || locationDefaultItem.title) }}
                          </span>
                        </div> <!-- .title-label-field -->
                      </div> <!-- .item-body -->
                    </a> <!-- .default-item -->
                  </router-link>
                </template>
              </template>
            </div> <!-- .location-selection-default-wrap -->
          </div> <!-- .location-selection-default-wrap-outer -->
        </div> <!-- .block-body -->

        <!-- G2jBasicModal - LocationSectionModal -->
        <transition name="fade">
          <G2jBasicModal
            v-if="
              isShowModal &&
              hasLocationModalInfo
            "
            :custom-modal-class="'location-selection-modal'"
            @close="closeModal"
            @mounted="onBasicModalMounted"
          >
            <template #head-title>
              {{ $t('home.search') }}
            </template> <!-- slot: #head-title -->

            <template #body-content>
              <div class="modal-content-segment">
                <div
                  id="city-selection__swiper-container"
                  :key="countReRenderCitySelection"
                  class="city-selection-swiper-container swiper-container"
                  :class="cityListReadmoreClass"
                >
                  <div class="city-selection-swiper-wrapper swiper-wrapper">
                    <div
                      id="city-selection__swiper-slide"
                      class="city-selection-swiper-slide swiper-slide"
                    >
                      <template v-for="cityItemInfo, idx in cityList">
                        <div
                          v-if="!isEmpty(cityItemInfo)"
                          :key="cityItemInfo.areaCode"
                          class="city-selection-item"
                          :class="{
                            'is-active': cityItemInfo.sn === citySn,
                            'enable-hover': (
                              !IS_MOBILE &&
                              cityItemInfo.sn !== requestFindAllDistrictInProvince.provinceSn
                            )
                          }"
                          :set="isCitySlideFinish = (idx + 1 === cityList.length)"
                          @click="onChangeCityItem(
                            cityItemInfo.sn,
                            cityItemInfo.name,
                          )"
                        >
                          {{ cityItemInfo.name }}
                        </div>
                      </template>
                    </div> <!-- .city-selection-swiper-slide -->
                  </div> <!-- .city-selection-swiper-wrapper -->
                </div> <!-- .city-selection-swiper-container -->

                <div
                  id="district-selection__swiper-container"
                  :key="countReRenderDistrictSelection"
                  class="district-selection-swiper-container swiper-container"
                  :class="districtListReadmoreClass"
                >
                  <div class="district-selection-swiper-wrapper swiper-wrapper">
                    <div
                      id="district-selection__swiper-slide"
                      class="district-selection-swiper-slide swiper-slide"
                    >
                      <div
                        v-if="hasTabAllDistrict"
                        class="district-item"
                        :class="{
                          'is-active': districtSn === null,
                          'enable-hover': (!IS_MOBILE && districtSn !== null)
                        }"
                        @click="changeDistrictItem(
                          null,
                          null,
                        )"
                      >
                        <span class="heart-icon-shape">
                          <i class="fas fa-heart" />
                        </span>

                        <div class="district-name-label-col">
                          <span class="district-name-label">
                            {{ $t('home.all_location') }}
                          </span>
                        </div>

                        <span class="status-icon-shape">
                          <i class="status-icon" />
                        </span>
                      </div>
                      <template v-for="districtInfoItem, idx in curDistrictList">
                        <div
                          v-if="!isEmpty(districtInfoItem)"
                          :key="districtInfoItem.sn"
                          class="district-item"
                          :class="{
                            'is-active': districtInfoItem.sn === districtSn,
                            'enable-hover': (!IS_MOBILE && idx !== 5)
                          }"
                          :set="isDistrictSlideFinish = (idx + 1 === curDistrictList.length)"
                          @click="changeDistrictItem(
                            districtInfoItem.sn,
                            districtInfoItem.name,
                          )"
                        >
                          <span class="heart-icon-shape">
                            <i class="fas fa-heart" />
                          </span>

                          <div class="district-name-label-col">
                            <span class="district-name-label">
                              {{ districtInfoItem.name }}
                            </span>
                          </div>

                          <span class="status-icon-shape">
                            <i class="status-icon" />
                          </span>
                        </div>
                      </template>
                    </div> <!-- .district-selection-swiper-slide -->
                  </div> <!-- .district-selection-swiper-wrapper -->
                </div> <!-- .district-selection-swiper-container -->
              </div> <!-- .modal-content-row -->
            </template> <!-- slot: #body-content -->

            <template #body-control>
              <div class="modal-control-group">
                <template v-if="districtSn || hasTabAllDistrict">
                  <botton
                    class="apply-location-btn enable-click"
                    @click="updateLocationSelectedInfo"
                  >
                    {{ $t('home.apply') }}
                  </botton> <!-- .apply-location-btn -->
                </template>

                <template v-else>
                  <div class="apply-location-btn">
                    {{ $t('home.apply') }}
                  </div> <!-- .apply-location-btn -->
                </template>
              </div> <!-- .modal-control-group -->
            </template> <!-- slot: #body-control -->
          </G2jBasicModal>
        </transition>
        <!-- endRegion: G2jBasicModal - LocationSectionModal -->
      </div> <!-- .location-selection-block -->
    </div> <!-- .container -->
  </section> <!-- .location-section-section -->
</template>

<script>
import {
  _,
  he,
  mapState,
  mapGetters,
} from '~jsLibPath/lib-manager';
import { apiCaller } from '~jsHelperPath/service/ApiHandler';
import {
  IMAGE_URL,
  CACHE_VERSION,
  IS_MOBILE,
  IS_SAFARI_BROWSER,
  LANGUAGE_VALID,
} from '~jsDefinePath/general';
import {
  EVENT_BUS_KEY
} from '~jsDefinePath/event-bus';
import {
  AJAX_URL
} from '~jsDefinePath/ajax-url';
import{
  FIREBASE_TRACKING,
  DABLE_TRACKING,
} from '~jsDefinePath/tracking-define';
import {
  getLocationPagePath,
  getHotelListPath,
} from '~jsHelperPath/util/HandleUrl';
import {
  G2JFirebase,
  G2JDablenaTracking,
} from '~jsHelperPath/util/HandleTracking';
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
  COMMIT_KEY as PAGE_INFO_COMMIT_KEY,
} from '~jsBasePath/vuex/modules/page-info-module';
import {
  MODULE_NAME as HOME_PAGE_MODULE_NAME,
  COMMIT_KEY as HOME_PAGE_COMMIT_KEY,
} from '../page-module';
import {
  onResizeEvent,
  removeOnResizeEvent,
}  from '~jsHelperPath/util/PrivateEventCustom';
import G2jBasicModal from '~jsPartialPath/global/component/g2j-basic-modal/G2jBasicModal.vue';
import { LOCAL_STORAGE_KEY } from '~jsPath/define/local-storage';

export default {
  components: {
    G2jBasicModal,
  },

  props: {
    locationDefaultList: {
      default: () => [],
      type: Array,
    },

    assetsServiceUrl: {
      default: '',
      type: String,
    },
  },

  data() {
    const provinceSnInitial = parseInt(
      localStorage[LOCAL_STORAGE_KEY.G2J_PERSONAL_PROVINCE_SN] ||
      localStorage[LOCAL_STORAGE_KEY.G2J_SELECTED_PROVINCE_SN] ||
      localStorage[LOCAL_STORAGE_KEY.G2J_DEFAULT_PROVINCE_SN] ||
      1
    );

    return {
      IMAGE_URL,
      CACHE_VERSION,
      IS_MOBILE,
      TimeoutHandler: new TimeoutHandler(),

      onResizeFunc: null,

      isSetPersonalLocationInfo: false,

      isCitySlideFinish: false,
      isDistrictSlideFinish: false,

      // NOTE - Nếu có từ props vào thì sẽ rơi vào trường hợp bất đồng bộ với mounted event của component => sử dụng isLocationDefaultListUpdateFinish để đánh dấu sau khi props được update và for in thành công => recheck lại init swiper
      isLocationDefaultListUpdateFinish: false,

      // NOTE - include title with locale [{ vi: ..., en: ...}]
      locationDefaultTitleLacaleList: [],

      LocationDefaultDataFormatted: [],

      locationSelectionSwiper: null,
      updateLocationSelectionSwiperTimeout: null,
      citySelectionSwiper: null,
      distrcitSelectionSwiper: null,
      updateLocationSelectionModalSwiperTimeout: null,

      elCitySelectionSwiperContainer: null,
      elCitySelectionSwiperSlide: null,
      elDistrictSelectionSwiperContainer: null,
      elDistrictSelectionSwiperSlide: null,

      countReRenderCitySelection: 0,
      countReRenderDistrictSelection: 0,

      minLocationSelectionToScrollEachBreakPoint: {
        '768px': 6,
        '640px': 5,
        '500px': 4,
        '480px': 4,
        '425px': 3,
        '375px': 3,
        '320px': 2,
      },

      curBreakPoint: null,

      locationDefaultWrapExtendClass: null,
      locationDefaultWrapReadmoreClass: 'disable-readmore',

      cityListReadmoreClass: 'disable-readmore',
      districtListReadmoreClass: 'disable-readmore',

      citySn: provinceSnInitial,
      provinceSnInitial,

      cityName: null,

      requestFindAllDistrictInProvince: {
        initProvinceSn: null,
      },

      districtList: {},
      districtSn: null,
      districtName: null,

      isShowModal: false,
    };
  },

  computed: {
    ...mapGetters(HOME_PAGE_MODULE_NAME, {
      hasCityList: 'hasCityList',
    }),

    ...mapState(PAGE_INFO_MODULE_NAME, {
      language: 'language',
      personalLocationInfo: 'personalLocationInfo',
    }),

    ...mapState(HOME_PAGE_MODULE_NAME, {
      locationSelectedInfo: 'locationSelectedInfo',
      cityList: 'cityList',
      districtList: 'districtList',
    }),

    locationSelectedTitle() {
      if(
        this.provinceSnInitial === 1 ||
        !this.hasCityList
      ) {
        return 'Hồ Chí Minh';
      }

      return this.cityList[this.provinceSnInitial].name;
    }, // locationSelectedTitle

    locationNearYou() {
      return {
        title: this.$t('home.near_you'),
        path: getHotelListPath({
          categoryName: 'nearyou',
        }),
        icon: '<i class="fas fa-map-marker-alt" />',
        has_onclick: true,
        has_tracking: true,
        i18n_locale_key: 'near_you',
      }
    }, // locationNearYou

    locationDefaultClient() {
      if(_.isEmpty(this.locationSelectedInfo)) {
        return [];
      }

      return [
        {
          title: this.locationSelectedInfo.district_name || this.locationSelectedInfo.city_name,
          path: getLocationPagePath(
            {
              provinceName: GetSlugWithoutDash(this.locationSelectedInfo.city_name),
              districtName: GetSlugWithoutDash(this.locationSelectedInfo.district_name),
            },
            {
              citySn: this.locationSelectedInfo.city_sn,
              districtSn: this.locationSelectedInfo.district_sn,
            }
          ),
          icon: '<i class="fas fa-map-marker-alt" />',
        },
      ];
    }, // locationDefaultClient

    hasLocationDefaultClient() {
      return !_.isEmpty(this.locationDefaultClient)
    }, // hasLocationDefaultClient()

    totalLocationDefaultClient() {
      if(_.isEmpty(this.locationDefaultClient)) {
        return 1;
      }

      return this.locationDefaultClient.length + 1;
    }, // totalLocationDefaultClient

    minLocationSelection () {
      if (!this.curBreakPoint) {
        return null;
      }

      return this.minLocationSelectionToScrollEachBreakPoint[this.curBreakPoint];
    }, // minLocationSelection

    totalLocationSelectionItem () {
      return this.locationDefaultList.length + this.totalLocationDefaultClient;
    }, // totalLocationSelectionItem

    hasLocationModalInfo () {
      return !_.isEmpty(this.cityList);
    }, // hasLocationModalInfo

    curDistrictList () {
      if (_.isEmpty(this.districtList)) {
        return null;
      }

      return this.districtList[this.citySn];
    }, // curDistrictList()

    hasLocationDefaultData () {
      return !_.isEmpty(this.locationDefaultList)
    }, // hasLocationDefaultData

    hasLocationDefaultFormattedData () {
      return !_.isEmpty(this.LocationDefaultDataFormatted);
    }, // hasLocationDefaultFormattedData()

    isProvinceDefault() {
      return (
        this.citySn === parseInt(
          localStorage[LOCAL_STORAGE_KEY.G2J_PERSONAL_PROVINCE_SN] ||
          localStorage[LOCAL_STORAGE_KEY.G2J_SELECTED_PROVINCE_SN] ||
          localStorage[LOCAL_STORAGE_KEY.G2J_DEFAULT_PROVINCE_SN] ||
          1
        )
      )
    }, // isProvinceDefault()

    hasTabAllDistrict() {
      return !this.isProvinceDefault;
    }, // hasTabAllDistrict()
  },

  watch: {
    isLocationDefaultListUpdateFinish: function () {
      EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, false);

      this.updateLocationSelectionSwiperTimeout?.handle();
    }, // isLocationDefaultListUpdateFinish()

    totalLocationSelectionItem: function () {
      this.formatLocationDefaultTitleLocale();
    }, // totalLocationSelectionItem()

    isCitySlideFinish: function () {
      const self = this;

      const locationModalSwiperInterval = setInterval(function () {
        if (self.isDistrictSlideFinish) {
          this.updateLocationSelectionModalSwiperTimeout?.handle();
          clearInterval(locationModalSwiperInterval);
        }
      });
    }, // citySlideFinish()

    hasLocationDefaultData: function () {
      this.formatLocationDefaultData();
    }, // hasLocationDefaultData()
  },

  created () {
    const self = this;

    self.initRegisterHomePageModule();

    self.initRequestLocationData();

    self.updateLocationSelectionSwiperTimeout = self.TimeoutHandler.init(
      'updateLocationSelectionSwiper',
      150,
      self.reInitLocationSelectionDefaultSwiper
    );

    self.updateLocationSelectionModalSwiperTimeout = self.TimeoutHandler.init(
      'updateLocationSelectionModalSwiper',
      150,
      self.reInitSelectionModalSwiper
    );

    if (self.hasLocationDefaultData) {
      self.formatLocationDefaultData();
    }
  },

  mounted () {
    const self = this;

    // NOTE - Swiper for location selection default
    self.onMounted();

    // NOTE - Check to keep / destroy swiper of location selection default on resize event
    self.onResizeFunc = function() {
      self.updateLocationSelectionSwiperTimeout.handle();
      self.updateLocationSelectionModalSwiperTimeout.handle();
    };

    onResizeEvent(window, self.onResizeFunc);
  },

  beforeDestroy() {
    this.updateLocationSelectionSwiperTimeout.destroy();
    this.updateLocationSelectionModalSwiperTimeout.destroy();

    this.locationSelectionSwiper?.destroy(true, true);
    this.citySelectionSwiper?.destroy(true, true);
    this.distrcitSelectionSwiper?.destroy(true, true);

    removeOnResizeEvent(window, this.onResizeFunc);
  },

  methods: {
    isEmpty: _.isEmpty,

    htmlDecode (content) {
      if (!content) {
        return '';
      }

      return he.decode(content);
    }, // htmlDecode()

    initRegisterHomePageModule() {
      if(
        localStorage.getItem(LOCAL_STORAGE_KEY.G2J_LOCATION_SELECTED_INFO) &&
        _.isEmpty(this.locationSelectedInfo)
      ) {
        this.$store.commit(HOME_PAGE_COMMIT_KEY.setLocationSelectedInfo, JSON.parse(localStorage[LOCAL_STORAGE_KEY.G2J_LOCATION_SELECTED_INFO]));
      }
    }, // registerHomePageModule()

    initRequestLocationData () {
      // NOTE - first get list of city for get correct current city name
      if(!this.hasCityList) {
        this.getAjaxFindAllProvinceCity(true);
      } else if(!this.cityName) {
        this.cityName = this.cityList[this.citySn].name;
      }

      this.requestFindAllDistrictInProvince.provinceSn = this.provinceSnInitial;
    }, // initRequestLocationData()

    formatLocationDefaultData () {
      if (this.hasLocationDefaultData) {
        const self = this;
        const tmpLocationDefaultDataFormatted = [];

        self.locationDefaultList.forEach(function (locationDefaultItem, idx) {
          locationDefaultItem.path = getHotelListPath(
            {
              categoryName: GetSlugWithoutDash(self.locationDefaultTitleLacaleList[idx][LANGUAGE_VALID.en]),
            },
            {
              hotelCollectionSn: locationDefaultItem.sn
            }
          );

          tmpLocationDefaultDataFormatted.push(locationDefaultItem);
        });

        self.LocationDefaultDataFormatted = [...tmpLocationDefaultDataFormatted];
      }
    }, // formatLocationDefaultData()

    formatLocationDefaultTitleLocale () {
      if (this.totalLocationSelectionItem > 1) {
        const self = this;

        self.locationDefaultTitleLacaleList = [];

        self.locationDefaultList.forEach(function (locationDefaultItem) {
          const locationDefaultItemTitleSplitted = locationDefaultItem.title.split('|');

          self.locationDefaultTitleLacaleList.push({
            vi: locationDefaultItemTitleSplitted[0],
            en: locationDefaultItemTitleSplitted[1]
          });
        });
      }
    }, // formatLocationDefaultTitleLocale()

    isValidToInitLocationSelectionDefaultSwiper () {
      this.curBreakPoint = this.getbBreakPointCurrent();

      if (this.totalLocationSelectionItem <= this.minLocationSelection) {
        this.locationDefaultWrapExtendClass = 'is-center';
        this.locationDefaultWrapReadmoreClass = 'disable-readmore';

        return false;
      }

      return true;
    }, // isValidToInitLocationSelectionDefaultSwiper()

    initLocationSelectionDefaultSwiper () {
      const self = this;

      self.locationDefaultWrapExtendClass = null;
      self.locationDefaultWrapReadmoreClass = 'is-beginning';

      if (
        Swiper &&
        self.totalLocationSelectionItem &&
        self.$refs.LocationSelectionDefaultWrapOuter
      ) {
        self.locationSelectionSwiper = new Swiper('#location-selection-default__wrap-outer', {
          slidesPerView: 'auto',
          spaceBetween: 0,

          freeMode: true,
          grabCursor: true,
          freeModeMinimumVelocity: 0.07,
          freeModeMomentumBounceRatio: 3,
          freeModeMomentumVelocityRatio: 1.5,

          // Disable preloading of all images
          preloadImages: false,

          // Enable lazy loading
          lazy: {
            checkInView: true,
            loadPrevNext: true,
          },

          breakpoints: {
            320: {
              lazy: {
                checkInView: true,
                loadPrevNext: true,
                loadPrevNextAmount: 3
              },
            },

            480: {
              lazy: {
                checkInView: true,
                loadPrevNext: true,
                loadPrevNextAmount: 5
              },
            },

            640: {
              lazy: {
                checkInView: true,
                loadPrevNext: true,
                loadPrevNextAmount: 6
              },
            },
          },

          on: {
            reachEnd: function () {
              self.locationDefaultWrapReadmoreClass = 'is-end';
            },
            reachBeginning: function () {
              self.locationDefaultWrapReadmoreClass = 'is-beginning';
            },
            sliderMove: function () {
              if (
                !self.locationSelectionSwiper.isEnd &&
                !self.locationSelectionSwiper.isBeginning
              ) {
                self.locationDefaultWrapReadmoreClass = null;
              }
            },
          }
        });
      }
    }, // initLocationSelectionDefaultSwiper()

    onMounted () {
      this.formatLocationDefaultTitleLocale();

      if (this.isValidToInitLocationSelectionDefaultSwiper()) {
        this.initLocationSelectionDefaultSwiper();
      }
    }, // onMounted()

    reInitLocationSelectionDefaultSwiper () {
      if (!this.isValidToInitLocationSelectionDefaultSwiper()) {
        if (this.locationSelectionSwiper) {
          this.locationSelectionSwiper.destroy(true, true);
          this.locationSelectionSwiper = null;
        }

        this.locationDefaultWrapExtendClass = 'is-center';
        this.locationDefaultWrapReadmoreClass = 'disable-readmore';
      } else {
        if (this.locationSelectionSwiper) {
          this.locationSelectionSwiper.update();
        } else {
          this.initLocationSelectionDefaultSwiper();
        }
      }
    }, // reInitLocationSelectionDefaultSwiper()

    getbBreakPointCurrent () {
      if (window.matchMedia('(min-width: 768px)').matches) {
        return '768px';
      } else if (window.matchMedia('(min-width: 640px)').matches) {
        if (
          IS_MOBILE &&
          IS_SAFARI_BROWSER &&
          window.matchMedia('(orientation : landscape)').matches
        ) {
          return '768px';
        }

        return '640px';
      } else if (window.matchMedia('(min-width: 500px)').matches) {
        return '500px';
      } else if (window.matchMedia('(min-width: 480px)').matches) {
        return '480px';
      } else if (window.matchMedia('(min-width: 425px)').matches) {
        return '425px';
      } else if (window.matchMedia('(min-width: 375px)').matches) {
        return '375px';
      }

      return '320px';
    }, // getbBreakPointCurrent()

    onOpenModal () {
      if (!this.hasCityList) {
        EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, true);

        this.getAjaxFindAllProvinceCity();
      } else {
        if(
          _.isEmpty(this.districtList) ||
          _.isEmpty(this.districtList[this.requestFindAllDistrictInProvince.provinceSn])
        ) {
          EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, true);
          this.getAjaxFindAllDistrictInProvince();
        }
      }

      G2JDablenaTracking(DABLE_TRACKING.TRACKING_VIEW_CHOOSE_LOCATION);

      this.isShowModal = true;
    }, // onOpenModal()

    closeModal () {
      this.isShowModal = false;
    }, // closeModal()

    reInitSelectionModalSwiper () {
      if (
        !this.citySelectionSwiper &&
        this.isValidToInitCitySelectionSwiper()
      ) {
        this.initCitySelectionSwiper();
      } else if (this.citySelectionSwiper) {
        if (this.isValidToInitCitySelectionSwiper()) {
          this.citySelectionSwiper.update();
        } else {
          this.citySelectionSwiper.destroy(true, true);
          this.cityListReadmoreClass = 'disable-readmore';
        }
      }

      if (
        !this.districtSelectionSwiper &&
        this.isValidToInitDistrictSelectionSwiper()
      ) {
        this.initDistrictSelectionSwiper();
      } else if (this.districtSelectionSwiper) {
        if (this.isValidToInitDistrictSelectionSwiper()) {
          this.districtSelectionSwiper.update();
        } else {
          this.districtSelectionSwiper.destroy(true, true);
          this.districtListReadmoreClass = 'disable-readmore';
        }
      }
    }, // reInitSelectionModalSwiper()

    isValidToInitCitySelectionSwiper () {
      const elCitySelectionSwiperContainer = document.getElementById('city-selection__swiper-container');
      const elCitySelectionSwiperSlide = document.getElementById('city-selection__swiper-slide');

      if (
        elCitySelectionSwiperContainer &&
        elCitySelectionSwiperSlide &&
        elCitySelectionSwiperSlide.clientHeight > elCitySelectionSwiperContainer.clientHeight + 5
      ) {
        return true;
      }

      return false;
    }, // isValidToInitCitySelectionSwiper()

    isValidToInitDistrictSelectionSwiper () {
      const elDistrictSelectionSwiperContainer = document.getElementById('district-selection__swiper-container');
      const elDistrictSelectionSwiperSlide = document.getElementById('district-selection__swiper-slide');

      if (
        elDistrictSelectionSwiperContainer &&
        elDistrictSelectionSwiperSlide &&
        elDistrictSelectionSwiperSlide.clientHeight > elDistrictSelectionSwiperContainer.clientHeight + 5
      ) {
        return true;
      }

      return false;
    }, // isValidToInitDistrictSelectionSwiper()

    onBasicModalMounted () {
      if (this.isValidToInitCitySelectionSwiper()) {
        this.initCitySelectionSwiper();
      }

      if (this.isValidToInitDistrictSelectionSwiper()) {
        this.initDistrictSelectionSwiper();
      }
    }, // onBasicModalMounted()

    getAjaxFindAllProvinceCity (isGetCityListOnly = false) {
      const self = this;

      apiCaller({
        metaUrl: AJAX_URL.location.city_list,
        type: 'GET',
        dataType: 'json',
        data: {
          latitude: self.personalLocationInfo.latitude,
          longitude: self.personalLocationInfo.longitude,
        },

        error (err) { },

        success (objResponse) {
          if (
            _.isEmpty(objResponse) ||
            objResponse.error ||
            _.isEmpty(objResponse.data)
          ) {
            return;
          }

          const tmpCityListFormatted = {};

          objResponse.data.forEach(function(cityItemInfo) {
            tmpCityListFormatted[cityItemInfo.sn] = cityItemInfo;
          });

          self.$store.commit(HOME_PAGE_COMMIT_KEY.setCityList, tmpCityListFormatted);

          if(
            !self.cityName &&
            !_.isEmpty(tmpCityListFormatted)
          ) {
            self.cityName = tmpCityListFormatted[self.citySn].name;
          }

          if(!isGetCityListOnly) {
            self.getAjaxFindAllDistrictInProvince();
          }
        },

        complete () {
          if (!_.isEmpty(self.districtList)) {
            EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, false)
          }
        }
      });
    }, // getAjaxFindAllProvinceCity()

    getAjaxFindAllDistrictInProvince () {
      const self = this;

      apiCaller({
        metaUrl: AJAX_URL.location.district_list,
        type: 'GET',
        dataType: 'json',
        data: self.requestFindAllDistrictInProvince,

        error (err) { },

        success (objResponse) {
          if (
            _.isEmpty(objResponse) ||
            objResponse.error ||
            _.isEmpty(objResponse.data)
          ) {
            return;
          }

          if (_.isEmpty(self.districtList)) {
            const tmpDistrictList = {};

            for(const provinceSn in self.cityList) {
              tmpDistrictList[provinceSn] = null;

              if(provinceSn === self.citySn) {
                self.cityName = self.cityList[provinceSn].name;
              }
            }

            self.districtList = { ...tmpDistrictList };
          }

          self.districtList[self.citySn] = objResponse.data;

          setTimeout(function () {
            self.reInitSelectionModalSwiper();
          });
        },

        complete () {
          if (!_.isEmpty(self.cityList)) {
            EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, false);
          }
        },
      });
    }, // getAjaxFindAllDistrictInProvince()

    initCitySelectionSwiper () {
      const self = this;

      self.cityListReadmoreClass = 'is-beginning';

      self.citySelectionSwiper = new Swiper('#city-selection__swiper-container', {
        direction: 'vertical',
        slidesPerView: 'auto',
        freeMode: true,
        grabCursor: true,
        mousewheel: true,

        on: {
          reachEnd: function () {
            self.cityListReadmoreClass = 'is-end';
          },
          reachBeginning: function () {
            self.cityListReadmoreClass = 'is-beginning';
          },
          sliderMove: function () {
            if (
              !self.citySelectionSwiper.isEnd &&
              !self.citySelectionSwiper.isBeginning
            ) {
              self.cityListReadmoreClass = null;
            }
          },

          destroy: function () {
            self.citySelectionSwiper.update();
            self.countReRenderCitySelection += 1;
            self.citySelectionSwiper = null;
          },
        }
      });
    }, // initCitySelectionSwiper()

    initDistrictSelectionSwiper () {
      const self = this;

      self.districtListReadmoreClass = 'is-beginning';

      self.districtSelectionSwiper = new Swiper('#district-selection__swiper-container', {
        direction: 'vertical',
        slidesPerView: 'auto',
        freeMode: true,
        grabCursor: true,
        mousewheel: true,

        on: {
          reachEnd: function () {
            self.districtListReadmoreClass = 'is-end';
          },
          reachBeginning: function () {
            self.districtListReadmoreClass = 'is-beginning';
          },
          sliderMove: function () {
            if (
              !self.districtSelectionSwiper.isEnd &&
              !self.districtSelectionSwiper.isBeginning
            ) {
              self.districtListReadmoreClass = null;
            }
          },

          destroy: function () {
            self.districtSelectionSwiper.update();
            self.countReRenderDistrictSelection += 1;
            self.districtSelectionSwiper = null;
          },
        }
      });
    }, // initDistrictSelectionSwiper()

    onChangeCityItem (
      provinceSn,
      cityName,
    ) {
      if (provinceSn) {
        this.citySn = provinceSn;
        this.cityName = cityName;
        this.districtSn = null;
        this.requestFindAllDistrictInProvince.provinceSn = provinceSn;

        if (!this.curDistrictList) {
          EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, true);
          this.getAjaxFindAllDistrictInProvince();
        } else {
          const self = this;

          setTimeout(function () {
            self.reInitSelectionModalSwiper();
          });
        }
      }

      G2JDablenaTracking(DABLE_TRACKING.TRACKING_VIEW_CHOOSE_PROVINCE);
    }, // onChangeCityItem

    changeDistrictItem (
      provinceSn,
      districtName,
    ) {
      this.districtSn = provinceSn;
      this.districtName = districtName;
    }, // changeDistrictItem

    updateLocationSelectedInfo() {
      const locationSelectedPathWithLanguage = getLocationPagePath(
        {
          provinceName: GetSlugWithoutDash(this.cityName),
          districtName: GetSlugWithoutDash(this.districtName),
        },
        {
          citySn: this.citySn,
          districtSn: this.districtSn,
        }
      )?.[this.language];

      if(locationSelectedPathWithLanguage) {
        const tmpLocationSelectedInfo = {
          city_sn: this.citySn,
          district_sn: this.districtSn,
          city_name: this.cityName,
          district_name: this.districtName,
        };

        this.$store.commit(HOME_PAGE_COMMIT_KEY.setLocationSelectedInfo, tmpLocationSelectedInfo);

        localStorage.setItem(LOCAL_STORAGE_KEY.G2J_LOCATION_SELECTED_INFO, JSON.stringify(tmpLocationSelectedInfo));

        this.$router.push(locationSelectedPathWithLanguage);
      }
    }, // updateLocationSelectedInfo()

    onClickDefaultClientLocation(href, hasTracking, i18nLocaleKey) {
      if(
        hasTracking &&
        i18nLocaleKey
      ) {
        G2JFirebase.analytics().logEvent(FIREBASE_TRACKING.TRACKING_NEAR_YOU, { name: '' });
        G2JDablenaTracking(DABLE_TRACKING.TRACKING_CLICK_ICON_CHOOSE_LOCATION + (GetCustomSlug('', 500, false))(this.$i18n.messages?.[LANGUAGE_VALID.en]?.home?.[i18nLocaleKey]));
      }

      if(href) {
        this.$router.push(href);
      }
    }, // onClickDefaultLocation()

    onClickLocationDefault(href, objTitle) {
      if(
        objTitle &&
        typeof objTitle === 'object'
      ) {
        const titleWithLocacle = objTitle[LANGUAGE_VALID.en];
        G2JFirebase.analytics().logEvent(FIREBASE_TRACKING.TRACKING_ADDRESS + (GetCustomSlug('', 500, false))(titleWithLocacle), { name: '' });
        G2JDablenaTracking(DABLE_TRACKING.TRACKING_CLICK_ICON_CHOOSE_LOCATION + (GetCustomSlug('', 500, false))(titleWithLocacle));
      }

      if(href) {
        this.$router.push(href);
      }
    }, // onClickLocationDefault()

    onClickLocationNearYou(href, i18nLocaleKey) {
      if(i18nLocaleKey) {
        G2JFirebase.analytics().logEvent(FIREBASE_TRACKING.TRACKING_NEAR_YOU, { name: '' });
        G2JDablenaTracking(DABLE_TRACKING.TRACKING_CLICK_ICON_CHOOSE_LOCATION + (GetCustomSlug('', 500, false))(this.$i18n.messages?.[LANGUAGE_VALID.en]?.home?.[i18nLocaleKey]));
      }

      if(this.locationNearYou.path) {
        this.getCurrentCustomerLocation();
      }
    }, // onClickLocationNearYou()

    getCurrentCustomerLocation () {
      const self = this;

      if (navigator.geolocation) {
        EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, true);

        navigator.geolocation.getCurrentPosition(self.setCurrentCustomerLocation, self.onErrorLocation);
      } else {
        this.$router.push(this.locationNearYou.path[this.language]);
      }
    }, // getCurrentCustomerLocation()

    setCurrentCustomerLocation (position) {
      if (!this.isSetPersonalLocationInfo) {
        const self = this;

        const curPersonLocationInfo = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          provinceSn: null,
        };

        apiCaller({
          url: AJAX_URL.user.find_user_location,
          data: {
            latitude: curPersonLocationInfo.latitude,
            longitude: curPersonLocationInfo.longitude,
          },
          type: 'GET',
          dataType: 'json',

          error () {
            self.$router.push(self.locationNearYou.path[self.language]);
          },

          success (objResponse) {
            if (
              _.isEmpty(objResponse) ||
              objResponse.error ||
              _.isEmpty(objResponse.data)
            ) {
              return;
            }

            curPersonLocationInfo.provinceSn = objResponse.data.provinceSn;

            localStorage.setItem(LOCAL_STORAGE_KEY.G2J_PERSONAL_PROVINCE_SN, curPersonLocationInfo.provinceSn);

            self.$store.commit(PAGE_INFO_COMMIT_KEY.setPersonalLocationInfo, curPersonLocationInfo);

            setTimeout(function() {
              self.$router.push(self.locationNearYou.path[self.language]);
            })
          },
        });

        this.isSetPersonalLocationInfo = true;
      }
    }, // setCurrentCustomerLocation()

    onErrorLocation (error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          this.$router.push(this.locationNearYou.path[this.language]);
          // x.innerHTML = "User denied the request for Geolocation."
          break;
        case error.POSITION_UNAVAILABLE:
          // x.innerHTML = "Location information is unavailable."
          break;
        case error.TIMEOUT:
          // x.innerHTML = "The request to get user location timed out."
          break;
        case error.UNKNOWN_ERROR:
          // x.innerHTML = "An unknown error occurred."
          break;
      }
    }, // onErrorLocation()
  },
};
</script>
