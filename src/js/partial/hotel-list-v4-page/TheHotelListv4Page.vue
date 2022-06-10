<template>
  <div class="hotel-list-page">
    <section class="hotel-list-head-section">
      <div class="container">
        <div class="hotel-list-navigate-block">
          <div class="hotel-list-navigate-col">
            <router-link
              :to="homePagePath[language]"
              class="back-navigate-field"
            >
              <span class="back-icon-shape">
                <i class="far fa-chevron-left"></i>
              </span>

              <h1
                v-if="hasTitleList"
                class="title-label"
              >
                {{ titleList[language] }}
              </h1> <!-- .title-label -->
            </router-link> <!-- .back-navigate-icon-col -->
          </div> <!-- .hotel-list-navigate-col -->
        </div> <!-- .hotel-list-navigate-block -->

        <div
          v-if="hasDescription"
          class="hotel-list-description-block"
        >
          <span class="description-label">
            {{ descriptionList[language] }}
          </span>
        </div> <!-- .hotel-list-description-block -->
      </div> <!-- .cotnainer -->
    </section> <!-- .hotel-list-head-section -->

    <TheBookingTypeSelectionSection
      :cur-booking-type-id="bookingTypeId"
      :is-flash-sale="isFlashSale"
      @changeOption="onChangeBookingType"
    />

    <TheDateSelectionSection
      :day-check-in="dayCheckIn"
      :day-check-out="dayCheckOut"
      @openModalSelect="onOpenModalSelect"
    />

    <TheCategoryFilterSection
      :cur-category-id="promotion"
      :category-id-of-collection="promotionIdOfCollectionSn"
      :has-program-bar="hasProgramBar"
      :has-sort="hasSort || sort === 1"
      :has-filter="hasFilter"
      @changeOption="onChangeOption"
      @showFilterModal="onShowFilterModal"
      @showSortModal="onShowSortModal"
    />

    <TheHotelListSection
      :key="reRenderCounter"
      :item-list="hotelList"
      :is-first-setup-data="isFirstSetupData"
      :day-check-in="dayCheckIn"
      :day-check-out="dayCheckOut"
    >
      <template #infinite-loading>
        <div
          v-if="isShowInfiniteLoading"
          class="infinite-loading-block"
        >
          <vue-infinite-loading
            :distance="500"
            :throttle-limit="100"
            spinner="circles"
            @infinite="infiniteHandler"
          >
            <div slot="no-more"></div>
            <div slot="no-results"></div>
          </vue-infinite-loading>
        </div> <!-- .infinite-loading-block -->
      </template>
    </TheHotelListSection>

    <G2JSelectDateTime
      ref="select-date-time"
      :typeTime.sync="bookingTypeId"
      :filterTime="filterTime"
      :dayCheckIn.sync="dayCheckIn"
      :dayCheckOut.sync="dayCheckOut"
      @onClickDisable30day="isShowToast30day = true"
      @onSubmit="onChangeDateTime"
    />

    <TheFilterHotelListModal
      :cur-payment-method="paymentMethod"
      :cur-bed-size="bedType"
      :cur-room-view="roomView"
      :cur-facility="arrFacility"
      :cur-min-price="minPrice"
      :cur-max-price="maxPrice"
      @changeOption="onChangeOption"
      :is-show.sync="isShowFilterModal"
    />

    <TheSortHotelListModal
      :curSort="sort"
      @changeOption="onChangeOption"
      :is-show.sync="isShowSortModal"
    />
    <g2j-toast
      :key="'toast-30-day'"
      :is-active.sync="isShowToast30day"
      :message="$t('common.disable_select_30_day')"
    ></g2j-toast>
  </div> <!-- .hotel-list-page -->
</template>

<script>
  import { _, he, mapState } from "~jsLibPath/lib-manager";
  import {
    IMAGE_URL,
    LANGUAGE_VALID,
    BOT_INFO,
    BASE_URL,
  } from "~jsDefinePath/general";
  import { LOCAL_STORAGE_KEY } from "~jsDefinePath/local-storage";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/page-info-module";
  import { ROUTER_NAME } from "~jsBasePath/vue-router/router-define";
  import { DISPATCHER_PARAMS_ID } from "~jsPath/define/dispatcher-params-id";
  import { getHomePath, getHotelListPath } from "~jsHelperPath/util/HandleUrl";
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import {
    pageModule as hotelListPageModule,
    MODULE_NAME as HOTEL_LIST_PAGE_MODULE_NAME,
    COMMIT_KEY as HOTEL_LIST_COMMIT_KEY,
  } from "./page-module";
  import { EventBus } from "~jsPath/helper/service/EventBus";
  import { EVENT_BUS_KEY } from "~jsPath/define/event-bus";

  export default {
    name: "HotelList",

    components: {
      G2JSelectDateTime: () =>
        import(
          "~jsPartialPath/global/component/g2j-select-date-time/G2JSelectDatetime.vue"
        ),
      TheBookingTypeSelectionSection: () =>
        import("./component/TheBookingTypeSelectionSectrion.vue"),
      TheDateSelectionSection: () =>
        import("./component/TheDateSelectionSection.vue"),
      TheCategoryFilterSection: () =>
        import("./component/TheCategoryFilterSection.vue"),
      TheHotelListSection: () => import("./component/TheHotelListSection.vue"),
      TheFilterHotelListModal: () =>
        import("./component/TheFilterHotelListModal.vue"),
      TheSortHotelListModal: () =>
        import("./component/TheSortHotelListModal.vue"),
      VueInfiniteLoading: window.VueInfiniteLoading.default,
    },

    data() {
      return {
        IMAGE_URL,
        BASE_URL,
        filterOption: [
          { id: 1, name: "All", is_active: false },
          { id: 2, name: "Flash Sale", is_active: false },
          { id: 3, name: "Go2Choice", is_active: false },
          { id: 4, name: "Flash Sale", is_active: false },
          { id: 5, name: "Special Offer", is_active: false },
        ],
        timeSelect: "Hourly", //type to call api

        ajaxHotelList: null,

        curQueryString: window.location.search,
        isFilter: false,

        // NOTE - is first setup data hotelList
        isFirstSetupData: true,

        // NOTE - for custom dispatcher params to optimize for SEO
        seoParamsID: null,
        seoParamsIDList: {},

        // NOTE - will be true when after apiCaller hotelList = []
        hotelList: [],
        titleList: {},
        descriptionList: {},
        homePagePath: getHomePath(),

        // curBookingTypeId: (this.$route.query.bookingType || 1),
        promotionIdOfCollectionSn: 0,

        // NOTE - Props definition
        // NOTE - for TheBookingTypeSelectionSection
        bookingTypeId: 0,
        isFlashSale: false,

        // NOTE - for TheDateSelectionSection
        dayCheckIn: null,
        dayCheckOut: null,

        // NOTE - for TheCategoryFilterSection
        promotion: 0,

        // NOTE - for TheExtensionFilterModal
        bedType: 0,
        arrFacility: [],
        maxPrice: 3000000,
        minPrice: 0,
        paymentMethod: 1,
        roomView: 0,

        // NOTE - for TheSortModal
        sort: 1,

        curPage: 0,
        totalPage: 0,

        isShowSortModal: false,
        isShowFilterModal: false,

        hasProgramBar: true,
        hasSort: false,
        hasFilter: false,

        reRenderCounter: 0,
        isReplaceSlugChecked: false,

        // NOTE - store current json of personalLocationInfo to refresh when personalLocationInfo changed
        curPersonalLocationInfo:
          localStorage[LOCAL_STORAGE_KEY.G2J_PERSONAL_LOCATION_INFO],

        isShowToast30day: false,

        // NOTE - define metaTagInfo
        metaTagInfo: {
          title: "",
          description: "",
        },
      };
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, ["language"]),

      ...mapState(HOTEL_LIST_PAGE_MODULE_NAME, ["objQueryString"]),

      hasTitleList() {
        return !_.isEmpty(this.titleList);
      }, // hasTitleList

      hasDescription() {
        return !_.isEmpty(this.descriptionList);
      }, // hasDescription

      hasHotelList() {
        return !_.isEmpty(this.hotelList);
      }, // hasHotelList()

      isShowInfiniteLoading() {
        return this.hasHotelList && this.curPage < this.totalPage;
      }, // isShowInfiniteLoading

      filterTime() {
        return [
          {
            id: 1,
            name: this.$t("common.hourly"),
            icon: "hourly.svg",
            is_active: !this.isFlashSale,
          },
          {
            id: 2,
            name: this.$t("common.overnight"),
            icon: "overnight.svg",
            is_active: true,
          },
          {
            id: 3,
            name: this.$t("common.daily"),
            icon: "daily.svg",
            is_active: !this.isFlashSale,
          },
        ];
      }, // filterTime
    },

    watch: {
      "$route.query": function () {
        if (this.$route.name === ROUTER_NAME["hotel-list-v4-page"]) {
          if (this.isFilter) {
            this.curQueryString = window.location.search;

            EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
              namespace: this.$route.name,
              is_show: true,
            });

            this.initData();
          } else if (
            this.curQueryString !== window.location.search ||
            this.curPersonalLocationInfo !==
              localStorage[LOCAL_STORAGE_KEY.G2J_PERSONAL_LOCATION_INFO]
          ) {
            EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
              namespace: this.$route.name,
              is_show: true,
              extend_class: "is-fill",
            });

            this.resetData();
            this.initData();

            this.curQueryString = window.location.search;
          }
        } else if (this.isFilter) {
          this.isFilter = false;
        }
      }, // $route.query

      "$route.params": function () {
        if (this.$route.name === ROUTER_NAME["hotel-list-v4-page"]) {
          const _tmpSeoParamsID = this.generateParamsIDFromDispathcherParams();
          // NOTE - make sure that only watching params is fired
          if (
            _tmpSeoParamsID !== this.seoParamsID &&
            this.curQueryString === window.location.search
          ) {
            EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
              namespace: this.$route.name,
              is_show: true,
              extend_class: "is-fill",
            });

            this.resetData();
            this.initData();

            this.curQueryString = window.location.search;
          } else if(!_.isEmpty(this.titleList)) {
            // NOTE - setup meta tag info
            this.$metaTag.setup({
              title:
                "Đặt phòng " +
                this.titleList[this.language].toLowerCase() +
                " nhanh chóng với giá tốt nhất",
              description:
                "Nhanh tay đặt phòng " +
                this.titleList[this.language].toLowerCase() +
                " tại Go2Joy ngay hôm nay để nhận liền tay những ưu đãi chỉ dành riêng cho bạn với mức giá vô cùng hấp dẫn.",
              "og:type": "hotel", //phudnd add
              "og:title":
                "Đặt phòng " +
                this.titleList[this.language].toLowerCase() +
                " nhanh chóng với giá tốt nhất",
              "og:description":
                "Nhanh tay đặt phòng " +
                this.titleList[this.language].toLowerCase() +
                " tại Go2Joy ngay hôm nay để nhận liền tay những ưu đãi chỉ dành riêng cho bạn với mức giá vô cùng hấp dẫn.",
              "og:url": BASE_URL + window.location.pathname,
              "og:site_name": "Go2Joy",
              "og:image": "",
              "og:image:width": "1200",
              "og:image:height": "628",
            });
          }
          //-- end setup meta tag info
        }
      }, // $route.params
    },

    created() {
      this.$store.registerModule(
        HOTEL_LIST_PAGE_MODULE_NAME,
        hotelListPageModule
      );

      EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
        namespace: this.$route.name,
        extend_class: "is-fill",
        is_show: true,
      });

      // NOTE - allow request if userAgent isn't Bot
      if (!BOT_INFO.isBot) {
        this.getAjaxFacilityList();
      }

      this.initData();
    },

    methods: {
      initData() {
        this.formatObjQuery();
        this.formatData();
        this.getAjaxHotelList();
      }, // initData()

      resetData() {
        // NOTE - for initial data
        this.isFirstSetupData = true;
        this.hotelList = [];
        this.titleList = {};
        this.descriptionList = {};

        // NOTE - for optimize SEO no query string
        this.seoParamsID = null;
        this.seoParamsIDList = {};

        // NOTE - each collectionSn has its promotionId corresponding
        this.promotionIdOfCollectionSn = 0;

        // NOTE - for TheBookingTypeSelectionSection
        this.bookingTypeId = 0;
        this.isFlashSale = false;

        // NOTE - for TheDateSelectionSection
        (this.dayCheckIn = null), (this.dayCheckOut = null);

        // NOTE - for TheCategoryFilterSection
        (this.promotion = 0),
          // NOTE - for TheExtensionFilterModal
          (this.bedType = 0);
        this.arrFacility = [];
        this.maxPrice = 3000000;
        this.minPrice = 0;
        (this.paymentMethod = 1),
          (this.roomView = 0),
          // NOTE - for TheSortModal
          (this.sort = 1);

        this.curPage = 0;
        this.totalPage = 0;

        this.isShowSortModal = false;
        this.isShowFilterModal = false;

        this.hasProgramBar = true;
        this.hasSort = true;
        this.hasFilter = false;

        this.reRenderCounter = 0;
        this.isReplaceSlugChecked = false;

        // NOTE - store current json of personalLocationInfo to refresh when personalLocationInfo changed
        this.curPersonalLocationInfo =
          localStorage[LOCAL_STORAGE_KEY.G2J_PERSONAL_LOCATION_INFO];
      }, // resetProps()

      formatObjQuery() {
        const _tmpObjQueryString = {};

        // NOTE - first generate info for seoParamsIDList
        /**
         * {
         *   [COLLECTON_SN_ID]: value | undefinded,
         *   [PROVINCE_SN_ID]: value | undefinded,
         *   [DISTRICT_SN_ID]: value | undefinded,
         * }
         */
        this.seoParamsID = this.generateParamsIDFromDispathcherParams();
        this.seoParamsIDList = this.generateParamsIDListFromDispathcherParams();

        // NOTE - bookingType (type: number [default: 1, if promotion is flashsale -> force 2])
        const _tmpBookingType = Number(this.$route.query.bookingType) || 0;
        _tmpObjQueryString.bookingType = [0, 1, 2, 3].includes(_tmpBookingType)
          ? _tmpBookingType
          : 0;

        // NOTE - hotelCollectionSn (type: number)
        _tmpObjQueryString.hotelCollectionSn =
          this.seoParamsIDList[DISPATCHER_PARAMS_ID.G2J_COLLECTION_SN_ID] ||
          Number(this.$route.query.hotelCollectionSn) ||
          null;

        // NOTE - checkInDatePlan (type: string)
        if (_tmpObjQueryString.bookingType === 0) {
          this.dayCheckIn = null;
        } else if (typeof this.$route.query.checkInDatePlan === "string") {
          const _dayCheckIn = dayjs(this.$route.query.checkInDatePlan);

          if (_dayCheckIn.isValid() && _dayCheckIn.diff(dayjs(), "day") >= 0) {
            this.dayCheckIn = _dayCheckIn;
          } else {
            this.dayCheckIn = dayjs();
          }
        } else {
          this.dayCheckIn = dayjs();
        }

        _tmpObjQueryString.checkInDatePlan = this.dayCheckIn
          ? this.dayCheckIn.format("YYYY-MM-DD")
          : this.dayCheckIn;

        // NOTE - endDate (type: string)
        if (_tmpObjQueryString.bookingType === 0) {
          this.dayCheckOut = null;
        } else if (typeof this.$route.query.endDate === "string") {
          let _dayCheckOut = dayjs(this.$route.query.endDate);

          if (
            _dayCheckOut.isValid() &&
            _dayCheckOut.diff(this.dayCheckIn, "day") >= 0
          ) {
            this.dayCheckOut = _dayCheckOut;
          } else {
            this.dayCheckOut = dayjs();
          }
        } else {
          this.dayCheckOut = this.dayCheckIn;
        }

        if (
          _tmpObjQueryString.bookingType === 1 &&
          this.dayCheckIn.diff(this.dayCheckOut, "day") > 0
        ) {
          this.dayCheckOut = this.dayCheckIn;
        } else if (
          _tmpObjQueryString.bookingType === 2 ||
          (_tmpObjQueryString.bookingType === 3 &&
            this.dayCheckOut.diff(this.dayCheckIn, "day") < 1)
        ) {
          this.dayCheckOut = this.dayCheckIn.add(1, "day");
        }

        _tmpObjQueryString.endDate = this.dayCheckOut
          ? this.dayCheckOut.format("YYYY-MM-DD")
          : this.dayCheckOut;

        // NOTE - provinceSn (type: number)
        _tmpObjQueryString.provinceSn =
          this.seoParamsIDList[DISPATCHER_PARAMS_ID.G2J_PROVINCE_SN_ID] ||
          Number(this.$route.query.provinceSn) ||
          Number(localStorage[LOCAL_STORAGE_KEY.G2J_CUR_PROVINCE_SN]);

        // NOTE - districtSn (type: number [accept null, ignore 0])
        _tmpObjQueryString.districtSn =
          this.seoParamsIDList[DISPATCHER_PARAMS_ID.G2J_DISTRICT_SN_ID] ||
          Number(this.$route.query.districtSn) ||
          null;

        // NOTE - hashtagSn (type: number [accept null])
        _tmpObjQueryString.hashtagSn = Number(this.$route.query.hashtagSn);

        if (!_tmpObjQueryString.hashtagSn && _tmpObjQueryString.hashtagSn !== 0) {
          _tmpObjQueryString.hashtagSn = null;
        }

        // NOTE - nearBy (type: boolean [ex: 1 | 0])
        _tmpObjQueryString.nearBy =
          this.$route.query.nearBy === true ||
          this.$route.query.nearBy === "true" ||
          this.$route.query.nearBy === 1 ||
          this.$route.query.nearBy === "1"
            ? 1
            : 0;

        // NOTE - bedType (type: number)
        const _tmpBedType = Number(this.$route.query.bedType) || 0;
        _tmpObjQueryString.bedType = [0, 1, 2, 3, 4, 5].includes(_tmpBedType)
          ? _tmpBedType
          : 0;

        // NOTE - facility (type: string)
        _tmpObjQueryString.facility = this.$route.query.facility || "";

        // NOTE - maxPrice (type: number [default 3000000])
        _tmpObjQueryString.maxPrice =
          Number(this.$route.query.maxPrice) || 3000000;

        // NOTE - minPrice (type: number [default 0, if min >= max -> min = 0])
        _tmpObjQueryString.minPrice = Number(this.$route.query.minPrice) || 0;

        if (_tmpObjQueryString.minPrice >= _tmpObjQueryString.maxPrice) {
          _tmpObjQueryString.minPrice = 0;
        }

        // NOTE - paymentMethod (type: number [default 1])
        const _tmpPaymentMethod = Number(this.$route.query.paymentMethod) || 1;
        _tmpObjQueryString.paymentMethod = [1, 2, 3].includes(_tmpPaymentMethod)
          ? _tmpPaymentMethod
          : 1;

        // NOTE - roomView (type: number)
        const _tmpRoomView = Number(this.$route.query.roomView) || 0;
        _tmpObjQueryString.roomView = [0, 1, 2, 3, 4, 5].includes(_tmpRoomView)
          ? _tmpRoomView
          : 0;

        // NOTE - promotion (type: number)
        _tmpObjQueryString.promotion = Number(this.$route.query.promotion) || 0;

        _tmpObjQueryString.hasProgramBar =
          this.$route.query.hasProgramBar === false ||
          this.$route.query.hasProgramBar === "false" ||
          this.$route.query.hasProgramBar === 0 ||
          this.$route.query.hasProgramBar === "0"
            ? false
            : true;

        // NOTE - hasFilter (type: boolean [ex: true | false])
        _tmpObjQueryString.hasFilter =
          (this.$route.query.hasFilter === true ||
          this.$route.query.hasFilter === "true" ||
          this.$route.query.hasFilter === 1 ||
          this.$route.query.hasFilter === "1"
            ? true
            : false) ||
          _tmpObjQueryString.paymentMethod !== 1 ||
          _tmpObjQueryString.bedType !== 0 ||
          _tmpObjQueryString.roomView !== 0 ||
          !_.isEmpty(_tmpObjQueryString.facility) ||
          _tmpObjQueryString.minPrice !== 0 ||
          _tmpObjQueryString.maxPrice !== 3000000;

        // NOTE - sort (type: number)
        const _tmpSort = Number(this.$route.query.sort) || 1;
        _tmpObjQueryString.sort = [1, 2, 3, 4].includes ? _tmpSort : 1;

        // NOTE - hasSort (type: boolean [ex: true | false])
        _tmpObjQueryString.hasSort = [2, 3, 4].includes(_tmpObjQueryString.sort);

        // NOTE - limit (type: number [default: 10])
        _tmpObjQueryString.limit = Number(this.$route.query.limit) || 10;

        this.$store.commit(
          HOTEL_LIST_COMMIT_KEY.setObjQueryString,
          _tmpObjQueryString
        );
      }, // formatObjQuery()

      formatData() {
        // NOTE - bookingTypeId (type: number [default: 1, if promotion is flashsale -> force 2])
        this.bookingTypeId = this.objQueryString.bookingType;

        // NOTE - promotion (type: number)
        this.promotion = this.objQueryString.promotion;

        // NOTE - bedType (type: number)
        this.bedType = this.objQueryString.bedType;

        // NOTE - facility (type: Array<number>)
        this.arrFacility = ((facility) => {
          if (_.isEmpty(facility)) {
            return [];
          }

          if (!facility.includes(",")) {
            return [Number(facility)];
          }

          const _facilitySplitted = facility.split(",");
          _facilitySplitted.forEach(function (facilityId, idx) {
            _facilitySplitted[idx] = Number(facilityId);
          });

          return _facilitySplitted;
        })(this.objQueryString.facility);

        // NOTE - maxPrice (type: number [default 3000000])
        this.maxPrice = this.objQueryString.maxPrice;
        this.minPrice = this.objQueryString.minPrice;
        this.paymentMethod = this.objQueryString.paymentMethod;
        this.roomView = this.objQueryString.roomView;

        // NOTE - sort (type: number)
        this.sort = this.objQueryString.sort;

        this.hasProgramBar = this.objQueryString.hasProgramBar;
        this.hasSort = this.objQueryString.hasSort;
        this.hasFilter = this.objQueryString.hasFilter;
      }, // formatData()

      filterHotelList(hotelList) {
        if (_.isEmpty(hotelList)) {
          this.hotelList = [];
        } else {
          const self = this;

          let _tmpHotelList = [];

          if (!self.isFilter) {
            _tmpHotelList = _.cloneDeep(self.hotelList);
          }

          _tmpHotelList = _tmpHotelList.concat(hotelList);

          self.hotelList = _tmpHotelList;

          self.$store.commit(HOTEL_LIST_COMMIT_KEY.setHotelList, self.hotelList);

          if (self.isFirstSetupData) {
            self.isFirstSetupData = false;
          }

          if (self.isFilter) {
            self.isFilter = false;
            window.scrollTo(0, 0);
          }
        }

        EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
          namespace: this.$route.name,
          is_show: false,
        });
      }, // filterHotelList()

      infiniteHandler($state) {
        this.getAjaxHotelList($state);
      }, // infiniteHandler()

      getAjaxHotelList(infiniteLoadingState = null) {
        if (this.ajaxHotelList) {
          return;
        }

        const self = this;
        let nextPage = 0;

        if (infiniteLoadingState) {
          nextPage = self.curPage + 1;
        } else {
          nextPage = 1;
        }

        const _objRequest = {
          search: {
            bookingType: this.bookingTypeId,
            hotelCollectionSn: this.objQueryString.hotelCollectionSn,
            checkInDatePlan: this.objQueryString.checkInDatePlan,
            endDate: this.objQueryString.endDate,
            provinceSn: this.objQueryString.provinceSn,
            districtSn: this.objQueryString.districtSn,
            hashtagSn: this.objQueryString.hashtagSn,
            nearBy: this.objQueryString.nearBy,
          },
          filter: {
            bedType: this.bedType,
            facility: this.arrFacility,
            maxPrice: this.maxPrice,
            minPrice: this.minPrice,
            paymentMethod: this.paymentMethod,
            roomView: this.roomView,
          },
          promotion: this.promotion,
          hasFilter: this.objQueryString.hasFilter,
          hasSort: this.objQueryString.hasSort,
          sort: this.sort,
          // "limit": this.objQueryString.limit,
          "limit": (BOT_INFO.isBot ? 100 : 10),
        };

        // console.log(_objRequest);

        self.ajaxHotelList = apiCaller({
          metaUrl: AJAX_URL.category.getHotelSearchList,
          queryString: {
            page: nextPage,
          },
          data: _objRequest,
          method: "POST",
          dataType: "json",
          error(err) {
            if (self.isFirstSetupData) {
              self.isFirstSetupData = false;
              EventBus.emit("REDIRECT-404-PAGE"); //khi nao Hien qua tim thi cmt dong nay
            }

            // self.titleList = self.generateTitleList();
            // self.descriptionList = self.generateTextWithLanguage();

            if (infiniteLoadingState) {
              self.curPage = nextPage;

              if (self.curPage < self.totalPage) {
                infiniteLoadingState.loaded();
              } else {
                infiniteLoadingState.complete();
              }
            } else {
              // NOTE - reset hotelList and isFilter flag when isFilter true
              self.hotelList = [];
              self.isFilter = false;
            }

            self.ajaxHotelList = null;

            EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
              namespace: self.$route.name,
              is_show: false,
            });

          },

          success(objResponse) {
            if (
              _.isEmpty(objResponse) ||
              objResponse.error ||
              _.isEmpty(objResponse.data)
            ) {
              if (self.isFirstSetupData) {
                self.isFirstSetupData = false;
                EventBus.emit("REDIRECT-404-PAGE"); //khi nao Hien qua tim thi cmt dong nay
              }

              // self.titleList = self.generateTitleList();
              // self.descriptionList = self.generateTextWithLanguage();

              // NOTE - reset hotelList and isFilter flag when isFilter true
              if (!infiniteLoadingState) {
                self.hotelList = [];
                self.isFilter = false;
              }

              // NOTE - Stop infinite loading handler
              if (infiniteLoadingState) {
                self.curPage = nextPage;

                if (self.curPage < self.totalPage) {
                  infiniteLoadingState.loaded();
                } else {
                  infiniteLoadingState.complete();
                }
              }

              self.ajaxHotelList = null;

              EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
                namespace: self.$route.name,
                is_show: false,
              });

              return;
            }

            if (objResponse.data.additionData?.slug) {
              self.checkReplaceSlug(objResponse.data.additionData?.slug);
            }

            self.filterHotelList(objResponse.data.hotelList);

            self.titleList = self.generateTitleList(
              objResponse.data.additionData?.title
            );
            // NOTE - setup meta tag info
            self.$metaTag.setup({
              title:
                "Đặt phòng " +
                self.titleList[self.language].toLowerCase() +
                " nhanh chóng với giá tốt nhất",
              description:
                "Nhanh tay đặt phòng " +
                self.titleList[self.language].toLowerCase() +
                " tại Go2Joy ngay hôm nay để nhận liền tay những ưu đãi chỉ dành riêng cho bạn với mức giá vô cùng hấp dẫn.",
              "og:type": "hotel", //phudnd add
              "og:title":
                "Đặt phòng " +
                self.titleList[self.language].toLowerCase() +
                " nhanh chóng với giá tốt nhất",
              "og:description":
                "Nhanh tay đặt phòng " +
                self.titleList[self.language].toLowerCase() +
                " tại Go2Joy ngay hôm nay để nhận liền tay những ưu đãi chỉ dành riêng cho bạn với mức giá vô cùng hấp dẫn.",
              "og:url": BASE_URL + window.location.pathname,
              "og:site_name": "Go2Joy",
              "og:image": "",
              "og:image:width": "1200",
              "og:image:height": "628",
            });
            //-- end setup meta tag info
            self.descriptionList = self.generateTextWithLanguage(
              objResponse.data.additionData?.description
            );

            // NOTE - update curBookingType and promotionIdOfCollectionSn
            self.promotionIdOfCollectionSn =
              objResponse.data.additionData?.promotion || 0;

            // NOTE - reformat dayCheckOut if bookingType for overnight
            if (self.promotionIdOfCollectionSn === 1) {
              self.bookingTypeId = 2;
              self.isFlashSale = true;

              if (!self.dayCheckOut) {
                self.dayCheckIn = dayjs();
                self.dayCheckOut = self.dayCheckIn.add(1, "day");
              } else if (self.dayCheckOut.diff(self.dayCheckIn, "day") < 1) {
                self.dayCheckOut = self.dayCheckIn.add(1, "day");
              }

              // NOTE - update format info for date check-in and date check-out
              self.objQueryString.checkInDatePlan =
                self.dayCheckIn.format("YYYY-MM-DD");
              self.objQueryString.endDate = self.dayCheckOut.format("YYYY-MM-DD");
            } else {
              self.isFlashSale = false;
            }

            // NOTE - update curPage and totalPage, handle infinite loading state

            self.totalPage = objResponse.data.meta.lastPage || 1;
            self.curPage = nextPage;

            if (self.curPage < self.totalPage) {
              infiniteLoadingState?.loaded();
            } else {
              infiniteLoadingState?.complete();
            }

            self.ajaxHotelList = null;

            if (!infiniteLoadingState) {
              self.reRenderCounter++;
            }
          },
        });
      }, // getAjaxHotelList()

      getAjaxFacilityList() {
        const self = this;

        apiCaller({
          metaUrl: AJAX_URL.hotel.facilityList,
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

            self.$store.commit(
              HOTEL_LIST_COMMIT_KEY.setFacilityList,
              objResponse.data
            );
          },
        });
      }, // getAjaxFacilityList()

      generateTitleList(text = "") {
        if (_.isEmpty(text)) {
          return {
            [LANGUAGE_VALID.vi]:
              "Khách sạn " +
              (this.objQueryString.bookingType === 1
                ? "theo giờ"
                : this.objQueryString.bookingType === 2
                ? "qua đêm"
                : this.objQueryString.bookingType === 3
                ? "theo ngày"
                : "gần bạn"),
            [LANGUAGE_VALID.en]:
              this.objQueryString.bookingType === 1
                ? "Hourly Hotels"
                : this.objQueryString.bookingType === 2
                ? "Overnight Hotels"
                : this.objQueryString.bookingType === 3
                ? "Daily Hotels"
                : "Hotels near you",
          };
        }

        return this.generateTextWithLanguage(text);
      }, // generateTitleList()

      generateTextWithLanguage(text = "") {
        // NOTE - Case 1
        // NOTE - If the title is not string of type or if it's string of type and trim() of it is empty -> return {} empty
        if (typeof text !== "string" || !text.trim()) {
          return {};
        }

        // NOTE - Case 2
        // NOTE - If pass case 1, we will split the title and check condition on it
        const titleSplitted = text.split("|");

        // NOTE - Cause the title is string of type, so the split native method worked and the a string split a letter or word does not exist in title -> the result will give an array with length always = 1
        // NOTE - If length = 1 we will check the trim() of [0] word of 0 index else we will check words of 0 index and 1 index (if one of 2 group condition is true -> return {})
        if (
          (titleSplitted.length === 1 && !titleSplitted[0].trim()) ||
          (!titleSplitted[0].trim() && !titleSplitted[1].trim())
        ) {
          return {};
        }

        if (titleSplitted.length === 1 && titleSplitted[0].trim()) {
          const finalTitle = he.decode(titleSplitted[0].trim());

          return {
            [LANGUAGE_VALID.vi]: finalTitle,
            [LANGUAGE_VALID.en]: finalTitle,
          };
        }

        const finalTitleVi = titleSplitted[0].trim();
        const finalTitleEn = titleSplitted[1].trim();

        return {
          [LANGUAGE_VALID.vi]: finalTitleVi
            ? he.decode(finalTitleVi)
            : he.decode(finalTitleEn),
          [LANGUAGE_VALID.en]: finalTitleEn
            ? he.decode(finalTitleEn)
            : he.decode(finalTitleVi),
        };
      }, // generateTextWithLanguage()

      onOpenModalSelect() {
        //open modal select check-in check-out
        this.$refs["select-date-time"].openModal();
      },

      onChangeDateTime() {
        let _dayCheckInFormatted = null;
        let _dayCheckOutFormatted = null;

        if (this.bookingTypeId !== 0) {
          _dayCheckInFormatted = this.dayCheckIn.format("YYYY-MM-DD");
          _dayCheckOutFormatted = this.dayCheckOut.format("YYYY-MM-DD");
        }

        this.onChangeOption({
          bookingType: this.bookingTypeId,
          checkInDatePlan: _dayCheckInFormatted,
          endDate: _dayCheckOutFormatted,
        });
      },

      onChangeBookingType(optionInfo) {
        let _bookingTypeId = this.bookingTypeId;

        for (const optionKey in optionInfo) {
          _bookingTypeId = optionInfo[optionKey];
        }

        if (this.dayCheckIn) {
          optionInfo.checkInDatePlan = this.dayCheckIn.format("YYYY-MM-DD");
        } else {
          this.dayCheckIn = dayjs();
          optionInfo.checkInDatePlan = dayjs();
        }

        let _dayCheckOut = this.dayCheckOut || this.dayCheckIn;

        if (_bookingTypeId === 1) {
          _dayCheckOut = this.dayCheckIn;
        } else if (
          _bookingTypeId === 2 ||
          (_bookingTypeId === 3 && _dayCheckOut.diff(this.dayCheckIn, "day") < 1)
        ) {
          _dayCheckOut = this.dayCheckIn.add(1, "day");
        }

        optionInfo.endDate = _dayCheckOut
          ? _dayCheckOut.format("YYYY-MM-DD")
          : _dayCheckOut;

        this.onChangeOption(optionInfo);
      }, // onChangeBookingType()

      onChangeOption(optionInfo) {
        this.isFilter = true;

        const _tmpObjQueryString = { ...this.objQueryString };

        // NOTE - Check if the filter option is actual changed -> will replace router, else will no change
        let _validToFilter = false;

        for (const optionKey in optionInfo) {
          if (_tmpObjQueryString[optionKey] !== optionInfo[optionKey]) {
            _tmpObjQueryString[optionKey] = optionInfo[optionKey];
            _validToFilter = true;
          }
        }

        if (_validToFilter) {
          _tmpObjQueryString.hasFilter =
            _tmpObjQueryString.paymentMethod !== 1 ||
            _tmpObjQueryString.bedType !== 0 ||
            _tmpObjQueryString.roomView !== 0 ||
            !_.isEmpty(_tmpObjQueryString.facility) ||
            _tmpObjQueryString.minPrice !== 0 ||
            _tmpObjQueryString.maxPrice !== 3000000;

          this.$router.replace(
            getHotelListPath(
              {
                categoryName: this.$route.params.categoryName,
              },
              _tmpObjQueryString
            )[this.language]
          );
        }
      }, // onChangeBookingType()

      onShowFilterModal() {
        this.isShowFilterModal = true;
      }, // onShowFilterModal

      onShowSortModal() {
        this.isShowSortModal = true;
      }, // onShowSortModal

      // NOTE - Generate params ID from DispathcherParams with type is Number
      generateParamsIDFromDispathcherParams() {
        const _paramsLastest =
          this.$route.params.subCategoryName || this.$route.params.categoryName;

        const _tmpParamsSplitted = _paramsLastest.split("-");
        const _tmpParamsSplittedLastest =
          _tmpParamsSplitted[_tmpParamsSplitted.length - 1];

        // NOTE - If this id param is not valid a number type -> return null
        return Number(_tmpParamsSplittedLastest)
          ? _tmpParamsSplittedLastest
          : null;
      }, // generateParamsIDStringFromDispathcherParams()

      // NOTE - Convert params ID as Number to Object
      generateParamsIDListFromDispathcherParams() {
        // NOTE - If this id param is not valid a number type -> return null
        if (!this.seoParamsID) {
          return {};
        }

        // NOTE - If the param has collection sn id, then push it with {[key : string = G2J_COLLECTION_SN_ID]: [value : string]}
        const _tmpSeoParamsID = String(this.seoParamsID);
        let _tmpJsonGenerator = _tmpSeoParamsID;

        if (
          _tmpJsonGenerator.includes(DISPATCHER_PARAMS_ID.G2J_COLLECTION_SN_ID)
        ) {
          _tmpJsonGenerator = _tmpJsonGenerator.replace(
            DISPATCHER_PARAMS_ID.G2J_COLLECTION_SN_ID,
            _tmpJsonGenerator.indexOf(
              DISPATCHER_PARAMS_ID.G2J_COLLECTION_SN_ID
            ) === 0
              ? '"' + DISPATCHER_PARAMS_ID.G2J_COLLECTION_SN_ID + '":'
              : ',"' + DISPATCHER_PARAMS_ID.G2J_COLLECTION_SN_ID + '":'
          );
        }

        // NOTE - If the param has collection sn id, then push it with {[key : string = G2J_PROVINCE_SN_ID]: [value : string]}
        if (_tmpJsonGenerator.includes(DISPATCHER_PARAMS_ID.G2J_PROVINCE_SN_ID)) {
          _tmpJsonGenerator = _tmpJsonGenerator.replace(
            DISPATCHER_PARAMS_ID.G2J_PROVINCE_SN_ID,
            _tmpJsonGenerator.indexOf(DISPATCHER_PARAMS_ID.G2J_PROVINCE_SN_ID) ===
              0
              ? '"' + DISPATCHER_PARAMS_ID.G2J_PROVINCE_SN_ID + '":'
              : ',"' + DISPATCHER_PARAMS_ID.G2J_PROVINCE_SN_ID + '":'
          );
        }

        // NOTE - If the param has collection sn id, then push it with {[key : string = G2J_DISTRICT_SN_ID]: [value : string]}
        if (_tmpJsonGenerator.includes(DISPATCHER_PARAMS_ID.G2J_DISTRICT_SN_ID)) {
          _tmpJsonGenerator = _tmpJsonGenerator.replace(
            DISPATCHER_PARAMS_ID.G2J_DISTRICT_SN_ID,
            _tmpJsonGenerator.indexOf(DISPATCHER_PARAMS_ID.G2J_DISTRICT_SN_ID) ===
              0
              ? '"' + DISPATCHER_PARAMS_ID.G2J_DISTRICT_SN_ID + '":'
              : ',"' + DISPATCHER_PARAMS_ID.G2J_DISTRICT_SN_ID + '":'
          );
        }

        const _tmpParamsIDList =
          _tmpJsonGenerator.length && _tmpJsonGenerator !== _tmpSeoParamsID
            ? JSON.parse("{" + _tmpJsonGenerator + "}")
            : {};

        return _tmpParamsIDList;
      }, // generateCollectionSnFromDispathcherParams()

      checkReplaceSlug(newSlugResponse) {
        if (
          !this.objQueryString.hotelCollectionSn ||
          !this.seoParamsID ||
          this.isReplaceSlugChecked
        ) {
          return;
        }

        const _paramsLastest =
          this.$route.params.subCategoryName || this.$route.params.categoryName;

        let _tmpSlug = _paramsLastest.replace("-" + this.seoParamsID);

        if (_tmpSlug !== newSlugResponse) {
          let _tmpNewSlug = newSlugResponse;

          if (this.seoParamsID) {
            _tmpNewSlug += "-" + this.seoParamsID;
          }

          const _tmpObjRoute = _.cloneDeep(this.$route);
          _tmpObjRoute.params.categoryName = _tmpNewSlug;

          this.$router.replace(_tmpObjRoute);
        }

        this.isReplaceSlugChecked = true;
      }, // checkReplaceslug()
    },
  };
</script>

<style src="./hotel-list-v4-page-style.css"></style>
