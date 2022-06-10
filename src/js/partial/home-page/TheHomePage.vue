<template>
  <div
    v-if="$route.name === routerName"
    class="home-page"
  >
    <TheSelectCityLocationModal
      v-if="enableShowCitySelectionModal"
      @select="onSelectFavouriteLocation"
    />

    <TheHomeBannerSection
      :key="provinceSn"
      :banner-list="responseBannerList"
      :assets-service-url="homeAssetsServiceUrl"
    />

    <TheLocationSelectionSection
      :location-default-list="responseLocationDefaultList"
      :assets-service-url="homeAssetsServiceUrl"
    />

    <template v-for="detailCollectionItemFormatted in detailCollectionListFormatted">
      <TheHotDealSection
        v-if="isAllowToShowComponent(
          'TheHotDealSection',
          detailCollectionItemFormatted
        )"
        :key="detailCollectionItemFormatted.sn"
        :detail-collection-info="detailCollectionItemFormatted"
        :item-list="hotelFormListFormatted[detailCollectionItemFormatted.sn]"
        :assets-service-url="homeAssetsServiceUrl"
      />

      <TheTopPickSection
        v-if="isAllowToShowComponent(
          'TheTopPickSection',
          detailCollectionItemFormatted
        )"
        :key="detailCollectionItemFormatted.sn"
        :detail-collection-info="detailCollectionItemFormatted"
        :top-pick-list="hotelFormListFormatted[detailCollectionItemFormatted.sn]"
        :assets-service-url="homeAssetsServiceUrl"
      />

      <TheSpecialOfferSection
        v-if="isAllowToShowComponent(
          'TheSpecialOfferSection',
          detailCollectionItemFormatted
        )"
        :key="detailCollectionItemFormatted.sn"
        :detail-collection-info="detailCollectionItemFormatted"
        :item-list="hotelFormListFormatted[detailCollectionItemFormatted.sn]"
        :assets-service-url="homeAssetsServiceUrl"
      />

      <TheNewHotelSection
        v-if="isAllowToShowComponent(
          'TheNewHotelSection',
          detailCollectionItemFormatted
        )"
        :key="detailCollectionItemFormatted.sn"
        :detail-collection-info="detailCollectionItemFormatted"
        :item-list="hotelFormListFormatted[detailCollectionItemFormatted.sn]"
        :assets-service-url="homeAssetsServiceUrl"
      />

      <ThePromotionSection
        v-if="isAllowToShowComponent(
          'ThePromotionSection',
          detailCollectionItemFormatted
        )"
        :key="detailCollectionItemFormatted.sn"
        :detail-collection-info="detailCollectionItemFormatted"
        :item-list="hotelFormListFormatted[detailCollectionItemFormatted.sn]"
        :assets-service-url="homeAssetsServiceUrl"
      />
    </template>

    <TheHotelCollectionSection
      :item-list="responseCollectionList"
      :assets-service-url="homeAssetsServiceUrl"
    />

    <TheGo2JoyGallery
      :item-list="responseGallery"
      :assets-service-url="articleGallertAssetsServiceUrl"
    />

    <TheFooterSection />
  </div>
</template>

<script>
  import {
    _,
    mapState,
  } from '~jsLibPath/lib-manager';
  import { apiCaller } from '~jsHelperPath/service/ApiHandler';
  import {
    AJAX_URL
  } from '~jsDefinePath/ajax-url';
  import {
    EVENT_BUS_KEY
  } from '~jsDefinePath/event-bus';
  import {
    ROUTER_NAME,
  } from '~jsBasePath/vue-router/router-define';
  import {
    FIREBASE_TRACKING,
    DABLE_TRACKING,
  } from '~jsDefinePath/tracking-define';
  import {
    LOCAL_STORAGE_KEY,
  } from '~jsDefinePath/local-storage';
  import {
    G2JFirebase,
    G2JDablenaTracking,
  } from '~jsHelperPath/util/HandleTracking';
  import {
    MODULE_NAME as PAGE_INFO_MODULE_NAME
  } from '~jsBasePath/vuex/modules/page-info-module';
  import {
    MODULE_NAME as HOME_PAGE_MODULE_NAME,
    pageModule as homePageModule,
  } from './page-module';

  export default {
    name: 'TheHomePage',

    components: {
      TheHomeBannerSection: () => import('./component/TheHomeBannerSection.vue'),
      TheLocationSelectionSection: () => import('./component/TheLocationSelectionSection.vue'),
      TheHotDealSection: () => import('./component/TheHotDealSection.vue'),
      TheTopPickSection: () => import('./component/TheTopPickSection.vue'),
      TheSpecialOfferSection: () => import('./component/TheSpecialOfferSection.vue'),
      TheNewHotelSection: () => import('./component/TheNewHotelSection.vue'),
      ThePromotionSection: () => import('./component/ThePromotionSection.vue'),
      TheHotelCollectionSection: () => import('./component/TheHotelCollectionSection.vue'),
      TheGo2JoyGallery: () => import('./component/TheGo2JoyGallery.vue'),
      TheFooterSection: () => import('~jsPartialPath/global/TheFooterSection.vue'),
      TheSelectCityLocationModal: () => import('./component/TheSelectCityLocationModal.vue'),
    },

    data () {
      return {
        enableToShowGmap: false,

        routerName: ROUTER_NAME['home-page'],

        ajaxHomeDataResponse: null,
        ajaxArticleGalleryResponse: null,

        // NOTE - data of TheHomeBannerSection component
        responseBannerList: [],
        // NOTE - data of TheTopPickSection component
        responseTopPickList: [],
        // NOTE - data of TheHotPromotionSection component
        responsePromotionList: [],
        // NOTE - data of TheGo2joyCollectionSection component
        responseCollectionList: [],
        // NOTE - data of TheGo2joyGallerySection component
        responseGallery: [],

        // NOTE - data of TheLocationSelectionSection component
        responseLocationDefaultList: [],

        // NOTE - data of format to order component render
        detailCollectionListFormatted: [],
        hotelFormListFormatted: {},

        // NOTE - Chứa thông tin của component muốn render
        componentRenderInfo: {
          TheHotDealSection: {
            is_show: true,
            sn: 1,
          },
          TheTopPickSection: {
            is_show: true,
            sn: 3,
          },
          TheSpecialOfferSection: {
            is_show: true,
            sn: 8,
          },
          TheNewHotelSection: {
            is_show: true,
            sn: 7,
          },
          ThePromotionSection: {
            is_show: true,
            sn: 6,
          },
        },

        // NOTE - data of TheHotDealSection component
        responseHotDealList: [],

        responseDetailCollectionList: [],

        homeAssetsServiceUrl: null,
        articleGallertAssetsServiceUrl: null,
        isShowSelectCityModal: true,

        enableShowCitySelectionModal: (
          !localStorage[LOCAL_STORAGE_KEY.G2J_DEFAULT_PROVINCE_SN] &&
          !localStorage[LOCAL_STORAGE_KEY.G2J_PERSONAL_PROVINCE_SN] &&
          !localStorage[LOCAL_STORAGE_KEY.G2J_SELECTED_PROVINCE_SN]
        ),

        provinceSn: parseInt(
          localStorage[LOCAL_STORAGE_KEY.G2J_PERSONAL_PROVINCE_SN] ||
          localStorage[LOCAL_STORAGE_KEY.G2J_SELECTED_PROVINCE_SN] ||
          localStorage[LOCAL_STORAGE_KEY.G2J_DEFAULT_PROVINCE_SN] ||
          1
        ),
      };
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        personalLocationInfo: 'personalLocationInfo',
      }),
    },

    created () {
      EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
        'extend_class': 'is-fill',
        'is_show': true,
      });

      this.$store.registerModule(HOME_PAGE_MODULE_NAME, homePageModule);

      // NOTE - tracking view page
      G2JFirebase.analytics().logEvent(FIREBASE_TRACKING.TRACKING_VISIT_HOME_PAGE, { name: '' });
      G2JDablenaTracking(DABLE_TRACKING.TRACKING_VISIT_HOME_PAGE);

      // NOTE - get ajax
      this.getAjaxHomeDataResponse();
      this.getAjaxArticleGalleryResponse();
    },

    methods: {
      goCategory () {
        let query = {
          hotelCollectionSn: 1,
          provinceSn: 2,
          districtSn: 3
        }
        this.$router.push({ name: 'category-page', query: query })
      }, // goCategory()

      listtenToHandleEventBus () {
        const self = this;

        // NOTE - listen and handle something after provinceSn is updated
        EventBus.on(EVENT_BUS_KEY.UPDATE_PROVINCE_SN, function () {
          self.getAjaxHomeDataResponse();
        });
      }, // listtenToHandleEventBus()

      isAllowToShowComponent (
        componentName,
        detailCollectionItemFormatted
      ) {
        const componentRenderItemInfo = this.componentRenderInfo[componentName];

        return (
          componentRenderItemInfo.is_show &&
          detailCollectionItemFormatted.display &&
          componentRenderItemInfo.sn === detailCollectionItemFormatted.sn
        );
      }, // isAllowToShowComponent()

      getAjaxHomeDataResponse() {
        const self = this;

        this.ajaxHomeDataResponse = apiCaller({
          metaUrl: AJAX_URL.home.all,
          data: {
            provinceSn: self.provinceSn,
          },
          type: 'GET',
          dataType: 'json',
          error () {},
          success (objResponse) {
            if (
              _.isEmpty(objResponse) ||
              objResponse.error ||
              _.isEmpty(objResponse.data)
            ) {
              return;
            }

            self.homeAssetsServiceUrl = objResponse.client_format_data.assets_service_url;

            self.responseBannerList = objResponse.data?.bannerFormList ?? [];
            // top pick pre-processing
            let topPickFilterList = objResponse.data?.detailCollectionList ?? [];
            let topPickList = _.filter(topPickFilterList, ['hotelSuggestion', true]);
            self.responseTopPickList = topPickList[0]?.hotelFormList ?? [];
            // promotion pre-processing
            let promotionFilterList = objResponse.data?.detailCollectionList ?? [];
            let promotionList = _.filter(promotionFilterList, ['promotionSuggestion', true]);
            self.responsePromotionList = promotionList[0]?.hotelFormList ?? [];
            self.responseCollectionList = objResponse.data?.collectionList ?? [];
            self.responseLocationDefaultList = objResponse.data?.circleCollectionList ?? [];
            self.responseDetailCollectionList = objResponse.data?.detailCollectionList ?? [];
            self.responseHotDealList = self.responseDetailCollectionList?.[0]?.hotelFormList ?? [];
            self.responseHotDealList = self.responseDetailCollectionList?.[0]?.hotelFormList ?? [];
            const tmpDetailCollectionListFormatted = [];
            const tmpHotelFormListFormatted = {};
            self.responseDetailCollectionList.forEach(function (detailCollectionItem) {
              const detailCollectionTitleSplitted = detailCollectionItem.title.split('|');
              tmpDetailCollectionListFormatted.push({
                display: detailCollectionItem.display,
                title: {
                  vi: detailCollectionTitleSplitted[0],
                  en: detailCollectionTitleSplitted[1],
                },
                sn: detailCollectionItem.sn,
              });
              tmpHotelFormListFormatted[detailCollectionItem.sn] = detailCollectionItem.hotelFormList;
            });
            self.detailCollectionListFormatted = _.cloneDeep(tmpDetailCollectionListFormatted);
            self.hotelFormListFormatted = _.cloneDeep(tmpHotelFormListFormatted);

            // NOTE - if location default list empty -> off loading
            if(_.isEmpty(self.responseLocationDefaultList)) {
              EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, false);
            }
          },
        });
      }, // getAjaxHomeResponse()

      getAjaxArticleGalleryResponse() {
        const self = this;

        this.ajaxArticleGalleryResponse = apiCaller({
          metaUrl: AJAX_URL.gallery.article,
          data: {
            notDisplaySn: '',
            limit: 5,
          },
          type: 'GET',
          dataType: 'json',
          error () { },
          success (objResponse) {
            if (
              _.isEmpty(objResponse) ||
              objResponse.error ||
              _.isEmpty(objResponse.data)
            ) {
              return;
            }
            self.articleGallertAssetsServiceUrl = objResponse.client_format_data.assets_service_url;
            self.responseGallery = objResponse.data?.arlicles ?? [];
          },
        });
      }, // getAjaxArticleGalleryResponse()

      onSelectFavouriteLocation(defaultProvinceSn) {
        if(defaultProvinceSn !== this.provinceSn) {
          window.location.reload();
        }
      }, // onSelectFavouriteLocation
    },
  };
</script>

<style src="./home-page-style.css"></style>
