<template>
  <div class="home-page">
    <h1 class="g2j-heading-label">
      Đặt phòng khách sạn linh hoạt - Giá tốt nhất
    </h1> <!-- .g2j-heading-label -->

    <template v-if="!BOT_INFO.isBot">
      <TheLocationSelectionModal
        v-show="isShowLocationSelectionModal"
        :enable-auto-show="enableAutoShowLocationSelectionModal"
        :enable-to-show="isShowLocationSelectionModal"
        :disable-user-close-modal="disableUserCloseModal"
        :from-component-name="componentNameToOpenLocationSelectionModal"
        @select="onSelectFavouriteLocation"
        @close="onCloseLocationSelectionModal"
      />
    </template>

    <TheLocationSelectionSection @open="onOpenLocationSelectionModal" />

    <TheIconicCollectionSection
      :iconic-dynamic-list="responseIconCollectionList"
      @openLocationSelectionModal="onOpenLocationSelectionModal"
    />

    <TheHomeBannerSection
      :key="curProvinceSn"
      v-if="hasResponseBannerList"
      :banner-list="responseBannerList"
      @mounted="onFinishBannerSection"
    />
    <template v-if="hasResponseDisplayCollectionList && !hasResponseDisplayCollectionListDetail">
      <TheCollectionLoading
        v-if="responseDisplayCollectionList.length"
        :collections="responseDisplayCollectionList"
      ></TheCollectionLoading>
    </template>

    <template v-else-if="hasResponseDisplayCollectionListDetail">
      <template v-for="collectionItemInfo, idx in responseDisplayCollectionListDetail">
        <G2jHorizontalSwiperSection
          :key="idx"
          :info="collectionItemInfo"
          @mounted="onFinishHorizontalSwiperSection"
        />
      </template>
    </template>

    <!-- <div
      v-if="!hasResponseArticleList"
      class="g2j-container-loading"
    >
      <div
        v-for="(v,k) in 2"
        class="g2j-container-loading__item"
      >
        <VueContentLoading
          :key="index"
          :width="350"
          :height="250"
        >
          <rect
            x="0"
            y="10"
            rx="4"
            ry="4"
            width="100%"
            height="100"
          />

          <rect
            x="10"
            y="130"
            rx="4"
            ry="4"
            width="80%"
            height="20"
          />
          <rect
            x="10"
            y="170"
            rx="4"
            ry="4"
            width="50%"
            height="10"
          />
          <rect
            x="10"
            y="190"
            rx="4"
            ry="4"
            width="30%"
            height="10"
          />
        </VueContentLoading>
      </div>
    </div> -->
    <!-- cai duoi bi sao sao y => can coi lai -->
    <G2jHorizontalSwiperSection
      v-if="hasResponseArticleList"
      :info="responseArticleList"
      @mounted="onFinishHorizontalSwiperSection"
    />
    <!-- </template> -->
    <TheFooterSectionv4 />
    <img>
  </div>
</template>

<script>
  import { _, mapState, mapGetters } from "~jsLibPath/lib-manager";
  import { BOT_INFO, IMAGE_URL, BASE_URL } from "~jsDefinePath/general";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import { EVENT_BUS_KEY } from "~jsDefinePath/event-bus";
  import { SESSION_STORAGE_KEY } from "~jsDefinePath/session-storage";
  import {
    FIREBASE_TRACKING,
    DABLE_TRACKING,
  } from "~jsDefinePath/tracking-define";
  import { LOCAL_STORAGE_KEY } from "~jsDefinePath/local-storage";
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import {
    G2JFirebase,
    G2JDablenaTracking,
  } from "~jsHelperPath/util/HandleTracking";
  import { getArticlePath } from "~jsHelperPath/util/HandleUrl";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/page-info-module";
  import {
    MODULE_NAME as HOME_PAGE_MODULE_NAME,
    pageModule as homePageModule,
  } from "./page-module";

  export default {
    name: "TheHomePage",

    components: {
      TheLocationSelectionModal: () =>
        import("./component/TheLocationSelectionModal.vue"),
      TheLocationSelectionSection: () =>
        import("./component/TheLocationSelectionSection.vue"),
      TheIconicCollectionSection: () =>
        import("./component/TheIconicCollectionSection.vue"),
      TheHomeBannerSection: () => import("./component/TheHomeBannerSection.vue"),
      G2jHorizontalSwiperSection: () =>
        import(
          "~jsPartialPath/global/component/g2j-horizontal-swiper-section/G2jHorizontalSwiperSection.vue"
        ),
      TheFooterSectionv4: () =>
        import("~jsPartialPath/global/TheFooterSectionv4.vue"),
      TheCollectionLoading: () => import("./component/TheCollectionLoading.vue"),
      VueContentLoading: window.VueContentLoading.VueContentLoading,
    },

    data() {
      return {
        BOT_INFO,
        IMAGE_URL,
        BASE_URL,
        ajaxHomeDataResponse: null,

        ajaxArticleGalleryResponse: null,

        // NOTE - data of TheHomeBannerSection component
        responseBannerList: [],
        hasResponseBannerList: false,

        // NOTE - data of TheGo2joyCollectionSection component
        responseDisplayCollectionList: [],
        hasResponseDisplayCollectionList: false,
        curDisplayCollectionCounter: 0,

        // NOTE - data of TheGo2joyCollectionSection component
        responseDisplayCollectionListDetail: [],
        hasResponseDisplayCollectionListDetail: false,

        // NOTE - data of TheGo2joyGallerySection component
        responseArticleList: [],
        hasResponseArticleList: false,

        // NOTE - data of TheLocationSelectionSection component
        responseIconCollectionList: [],

        // NOTE - data of format to order component render
        detailCollectionListFormatted: [],
        hotelFormListFormatted: {},

        // NOTE - data of TheHotDealSection component
        responseHotDealList: [],

        homeAssetsServiceUrl: null,
        articleGallertAssetsServiceUrl: null,

        isShowLocationSelectionModal: sessionStorage[
          SESSION_STORAGE_KEY.G2J_HAS_SELECTED_LOCATION
        ]
          ? false
          : localStorage[
              LOCAL_STORAGE_KEY.G2J_DISABLE_SHOW_LOCATION_SELECTION_MODAL
            ]
          ? !(
              localStorage[
                LOCAL_STORAGE_KEY.G2J_DISABLE_SHOW_LOCATION_SELECTION_MODAL
              ] == 1
            )
          : true,

        componentNameToOpenLocationSelectionModal: "",

        disableUserCloseModal: true,

        enableAutoShowLocationSelectionModal:
          !localStorage[LOCAL_STORAGE_KEY.G2J_CUR_PROVINCE_SN],
      };
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, ["personalLocationInfo"]),

      ...mapGetters(PAGE_INFO_MODULE_NAME, ["curProvinceSn"]),

      hasResponseDisplayCollectionList() {
        return !_.isEmpty(this.responseDisplayCollectionList);
      }, // hasResponseDisplayCollectionList
    },

    created() {
      // NOTE - setup meta tag for SEO

      this.$metaTag.setup({
        title: "Go2Joy - Đặt phòng khách sạn theo giờ",
        description:
          "Đặt phòng ngay với ứng dụng đặt phòng khách sạn Go2Joy linh hoạt, đơn giản. Hơn 10.000 khách sạn giá tốt đang chờ bạn khám phá.",
        "og:type": "website", //phudnd add
        "og:title": "Go2Joy - Đặt phòng khách sạn theo giờ",
        "og:description":
          "Đặt phòng ngay với ứng dụng đặt phòng khách sạn Go2Joy linh hoạt, đơn giản. Hơn 10.000 khách sạn giá tốt đang chờ bạn khám phá.",
        "og:url": BASE_URL + window.location.pathname,
        "og:site_name": "Go2Joy",
        "og:image": `${IMAGE_URL}/logo/logo-go2joy.png`,
        "og:image:width": "1200",
        "og:image:height": "628",
      });

      EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
        extend_class: "is-fill",
        is_show: true,
        namespace: this.$route.name,
      });
      // EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, false);

      this.$store.registerModule(HOME_PAGE_MODULE_NAME, homePageModule);

      // NOTE - tracking view page
      G2JFirebase.analytics().logEvent(
        FIREBASE_TRACKING.TRACKING_VISIT_HOME_PAGE,
        { name: "" }
      );
      G2JDablenaTracking(DABLE_TRACKING.TRACKING_VISIT_HOME_PAGE);

      // NOTE - get ajax
      this.getAjaxDisplayCollectionList();
      this.getAjaxIconCollectionList();
      this.getAjaxBannerList();
      this.getAjaxArticleCollectionList();
    },

    methods: {
      goCategory() {
        let query = {
          hotelCollectionSn: 1,
          provinceSn: 2,
          districtSn: 3,
        };
        this.$router.push({ name: "category-page", query: query });
      }, // goCategory()

      getAjaxIconCollectionList() {
        const self = this;

        apiCaller({
          metaUrl: AJAX_URL.home.icon_collection_list,
          data: {
            provinceSn: self.curProvinceSn,
          },
          method: "GET",
          dataType: "json",
          error() {},
          success(objResponse) {
            if (
              _.isEmpty(objResponse) ||
              objResponse.error ||
              _.isEmpty(objResponse.data)
            ) {
              return;
            }

            self.responseIconCollectionList = objResponse.data;
          },
        });
      }, // getAjaxIconCollectionList()

      getAjaxBannerList() {
        const self = this;

        apiCaller({
          metaUrl: AJAX_URL.home.banner_list,
          data: {
            provinceSn: self.curProvinceSn,
          },
          method: "GET",
          dataType: "json",
          error() {
            self.onFinishBannerSection();
          },
          success(objResponse) {
            if (
              _.isEmpty(objResponse) ||
              objResponse.error ||
              _.isEmpty(objResponse.data)
            ) {
              self.onFinishBannerSection();
              return;
            }

            self.responseBannerList = objResponse.data;
            self.hasResponseBannerList = true;
          },
        });
      }, // getAjaxBannerList()

      getAjaxDisplayCollectionList() {
        const self = this;

        apiCaller({
          metaUrl: AJAX_URL.home.display_collection_list,
          data: {
            provinceSn: self.curProvinceSn,
          },
          method: "GET",
          dataType: "json",
          error() {},
          success(objResponse) {
            if (
              _.isEmpty(objResponse) ||
              objResponse.error ||
              _.isEmpty(objResponse.data)
            ) {
              return;
            }

            self.responseDisplayCollectionList = objResponse.data;
            self.hasResponseDisplayCollectionList = true;

            let tmpStrCollectionSnList = "";

            objResponse.data.forEach(function (item, idx) {
              tmpStrCollectionSnList += (idx ? "," : "") + item.sn;
            });

            self.getAjaxDisplayCollectionDetail({
              provinceSn: self.curProvinceSn,
              collectionSnList: tmpStrCollectionSnList,
            });
          },
        });
      }, // getAjaxDisplayCollectionList()

      getAjaxDisplayCollectionDetail(objRequest) {
        const self = this;

        if (_.isEmpty(objRequest)) {
          return;
        }

        apiCaller({
          metaUrl: AJAX_URL.home.display_collection_detail,
          data: objRequest,
          dataType: "json",
          error() {},

          success(objResponse) {
            if (
              _.isEmpty(objResponse) ||
              objResponse.error ||
              _.isEmpty(objResponse.data)
            ) {
              return;
            }

            self.responseDisplayCollectionListDetail = objResponse.data;

            self.hasResponseDisplayCollectionListDetail = true;
          },
        });
      }, // getAjaxDisplayCollectionDetail()

      getAjaxArticleCollectionList() {
        const self = this;

        apiCaller({
          metaUrl: AJAX_URL.home.article_list,
          method: "GET",
          dataType: "json",
          error() {},
          success(objResponse) {
            if (
              _.isEmpty(objResponse) ||
              objResponse.error ||
              _.isEmpty(objResponse.data)
            ) {
              return;
            }

            self.responseArticleList = {
              ...objResponse.data,
              displayType: 9,
              path: getArticlePath(),
            };
            self.hasResponseArticleList = true;
          },
        });
      }, // getAjaxArticleCollectionList()

      onOpenLocationSelectionModal(fromComponentName) {
        this.componentNameToOpenLocationSelectionModal = fromComponentName || "";
        this.disableUserCloseModal = false;
        this.isShowLocationSelectionModal = true;
      }, // onOpenLocationSelectionModal()

      onCloseLocationSelectionModal() {
        this.componentNameToOpenLocationSelectionModal = "";
        this.disableUserCloseModal = true;
        this.isShowLocationSelectionModal = false;
      }, // onCloseLocationSelectionModal()

      onFinishBannerSection() {
        EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
          is_show: false,
          namespace: this.$route.name,
        });
      }, // onFinishBannerSection()

      // onFinishHorizontalSwiperSection() {
      //   if (!this.hasResponseDisplayCollectionList) {
      //     EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
      //       is_show: false,
      //       namespace: this.$route.name,
      //     });
      //   } else {
      //     this.curDisplayCollectionCounter++;

      //     if (
      //       this.responseDisplayCollectionList.length -
      //         this.curDisplayCollectionCounter <=
      //       2
      //     ) {
      //       EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
      //         is_show: false,
      //         namespace: this.$route.name,
      //       });
      //     }
      //   }
      // },
      // onFinishHorizontalSwiperSection()
    },
  };
</script>

<style src="./home-page-style.css"></style>
