<template>
  <div class="category-page container">
      <!-- category-page__head, TODO:  back - label - filter -->
      <div class="category-page__head">
        <!-- <div class="category-page__head--button">
          <back-button />
        </div> -->
        <div class="category-page__head--label">
          <div class="head-label-container">
            <span v-if="additionalData" class="head-label-container__label"
              >{{ nameCategory }}
            </span>
          </div>
          <div class="show-filter">
            <marquee scrollamount="6">
              <div class="show-filter__container">
                <div
                  v-for="(v, k) in dataFilter"
                  :key="k"
                  class="show-filter__container--item"
                >
                  {{ v }}
                </div>
              </div>
            </marquee>
          </div>
        </div>
        <div class="category-page__head--filter">
          <button v-if="hasFilter" @click="clickFilter()">
            <i class="fas fa-sliders-h" />
          </button>
        </div>
      </div>
      <!--end category-page__head -->

      <!-- category-page__container, TODO: show list data -->
      <div v-if="dataList" class="category-page__container">
        <empty-category v-if="!dataList.length" />
        <list-room-category
          v-show="dataList && dataList.length"
          :data="dataList"
        />
      </div>
      <!-- end category-page__container -->

      <!-- category-page__footer,TODO:  pagination -->
      <div class="category-page__footer">
        <Pagination
          v-if="dataList && dataList.length"
          position="center"
          :page-sizes="pageSizes"
          :current-page="currentPage"
          @changeCurrentPage="changeCurrentPage"
        />
      </div>
      <!-- end category-page__footer -->

      <filter-modal
        ref="filter-modal"
        :filter.sync="filter"
        @apply="applyFilter"
      />

  </div>
</template>

<script>
import { AJAX_URL } from "~jsDefinePath/ajax-url";
import { LOCAL_STORAGE_KEY } from "~jsDefinePath/local-storage";
import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsPath/base/vuex/modules/page-info-module";
import { _, mapState, mapGetters } from "~jsLibPath/lib-manager";

import { apiCaller } from "~jsHelperPath/service/ApiHandler";
export default {
  components: {
    TheGo2JoyLoading: () =>
      import(
        "~jsPath/partial/global/component/go2joy-loading/TheG2jLoading.vue"
      ),
    Pagination: () =>
      import("~jsPartialPath/global/component/pagination/Pagination.vue"),
    ListRoomCategory: () =>
      import("~jsPath/partial/category-page/component/ListRoomCategory.vue"),
    "back-button": () =>
      import(
        "~jsPartialPath/global/component/back-button/BackButtonComponent.vue"
      ),
    "filter-modal": () => import("./component/FilterModal.vue"),
    "empty-category": () => import("./component/EmptyCategory.vue"),
  },
  data() {
    return {
      dataList: null,
      additionalData: null,
      currentPage: 1,
      pageSizes: 1,
      hasFilter: true,
      filter: {
        sort: 0,
        directDiscount: false,
        loveHotel: false,
        travelHotel: false,
        hasPromotion: false,
        newHotel: false,
        hotHotel: false,
        stamp: false,
        exifImage: false,
        amenityPackHotel: false,
        minPrice: 0,
        maxPrice: 30000000,
      },
      // NOTE - Define list of title language for hardcode category type
      clientTitleList: {
        0: 'Gần bạn|Near you',
        1: 'Theo giờ|Hourly',
        2: 'Qua đêm|Overnight',
        3: 'Theo ngày|Daily',
      },
      // nameCategory: null
    };
  },
  watch: {
    '$route.query': function(newVal, oldVal) {
      if(JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
        this.initRoute();
      }
    },
  },
  created() {
    EventBus.emit("IS_SHOW_ROUTER_LOADING", false);

    this.initRoute();

  },
  methods: {
    isEmpty: _.isEmpty,
    applyFilter(data) {
      let query = { ...this.$route.query, ...data };
      // this.getFilter(query)
      if (query.citySn) {
        this.getFilter(query);
      } else if(query.hotelCollectionSn) {
        this.getHotelNearYou(query);
      }
      this.$refs["filter-modal"].closeModal();
    },
    clickFilter() {
      let query = this.$route.query ?? {};
      this.$refs["filter-modal"].showModal();
    },
    changeCurrentPage(page) {
      let query = { ...this.$route.query };
      query.page = page;
      this.$router.push({ name: "category-page", query: query });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    async getFilter(obj) {
      EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
      let query = { ...obj };
      query.provinceSn = obj.provinceSn || obj.citySn || parseInt(
          localStorage[LOCAL_STORAGE_KEY.G2J_PERSONAL_PROVINCE_SN] ||
          localStorage[LOCAL_STORAGE_KEY.G2J_SELECTED_PROVINCE_SN] ||
          localStorage[LOCAL_STORAGE_KEY.G2J_DEFAULT_PROVINCE_SN] ||
          1
      );
      query.minPrice = obj.minPrice || 0;
      query.maxPrice = obj.maxPrice || 30000000;
      try {
        let res = await apiCaller({
          metaUrl: AJAX_URL.category.hotelListFilter,
          dataType: "json",
          type: "GET",
          data: query,
          contentType: "application/json; charset=utf-8",
        });

        this.dataList = res.data?.hotelList;

        if (this.dataList && this.dataList.length > 3) {
          localStorage.setItem(
            LOCAL_STORAGE_KEY.G2J_SELECTED_PROVINCE_SN,
            query.provinceSn
          );
        }

        this.additionalData = res.data?.additionalData;
        // amulet => magic
        if (this.dataList.length) {
          this.additionalData = this.additionalData || {
            title: `${this.dataList[0].districtName}|${this.dataList[0].districtName}`,
          };
        }
        this.pageSizes = res.data?.meta.lastPage;
        this.currentPage = res.data?.meta.currentPage;
        EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
      } catch (error) {
        console.log("error :>> ", error);
      }
    },
    async getHotelNearYou(obj) {
      EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
      let query = { ...obj };
      query.minPrice = query.minPrice || 0;
      query.maxPrice = query.maxPrice || 30000000;

      try {
        let res = await apiCaller({
          metaUrl: (
            obj.bookingType ?
              AJAX_URL.category.hotelListByBookingType :
            AJAX_URL.category.hotelNearBy
          ),
          dataType: "json",
          type: "GET",
          data: query,
          contentType: "application/json; charset=utf-8",
        });
        this.dataList = res.data?.hotelList;
        // Test
        // this.dataList[0].displayRule.typeDisplay = [4]

        this.additionalData = res.data?.additionalData;
        // amulet => magic
        this.additionalData = this.additionalData || {
          title: this.clientTitleList[(obj.bookingType || 0)],
        };
        this.pageSizes = res.data?.meta.lastPage;
        this.currentPage = res.data?.meta.currentPage;
        EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
      } catch (error) {
        console.log("error :>> ", error);
      }
    },

    async getData({ provinceSn , page = 1, hotelCollectionSn }) {
      EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
      provinceSn = provinceSn || parseInt(
          localStorage[LOCAL_STORAGE_KEY.G2J_CUR_PROVINCE_SN] ||
          1
      );
      let query = {
        provinceSn,
        hotelCollectionSn,
        page,
      };

      try {
        let res = await apiCaller({
          metaUrl: AJAX_URL.category.hotelCollectionDetail,
          dataType: "json",
          type: "GET",
          data: query,
          contentType: "application/json; charset=utf-8",
        });
        // console.log(res);
        this.dataList = res.data?.hotelList;
        // Test
        // this.dataList[0].displayRule.typeDisplay = [4]

        this.additionalData = res.data?.additionalData;
        this.pageSizes = res.data?.meta.lastPage;
        this.currentPage = res.data?.meta.currentPage;
        EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
      } catch (error) {
        console.log("error :>> ", error);
      }
    },
    urlImg(url) {
      return `https://go2joy.s3-ap-southeast-1.amazonaws.com/` + url;
    },

    initRoute() {
      let query = this.$route.query ?? {};
      if (
        (
          this.isEmpty(query) ||
          query.nearBy
        ) ||
        query.bookingType ||
        (query.page && Object.keys(query).length == 1)
      ) {
        let queryNearBy = { ...this.personalLocationInfo };
        queryNearBy.page = query.page;

        // NOTE - If query string include bookingType param -> call API
        if(query.bookingType) {
          queryNearBy.bookingType = query.bookingType;
        }

        this.getHotelNearYou(queryNearBy);

        return;
      }
      if (query.citySn) {
        this.getFilter(query);
        return;
      } else if(query.hotelCollectionSn) {
        this.getData(query);
      }
      this.hasFilter = false;
    },
  },
  computed: {
    ...mapState(PAGE_INFO_MODULE_NAME, {
      personalLocationInfo: "personalLocationInfo",
      language: "language",
    }),
    ...mapGetters(PAGE_INFO_MODULE_NAME, {
      provinceSnDefault: "provinceSn",
    }),
    dataFilter() {
      let arr = [];
      let tmp = {
        loveHotel: this.$t("category.couple_hotel"),
        travelHotel: this.$t("category.travel_hotel"),
        directDiscount: this.$t("category.special_offer"),
        hasPromotion: this.$t("category.promotion"),
        newHotel: this.$t("category.new_hotel"),
        hotHotel: this.$t("category.hot_hotel"),
        stamp: this.$t("category.stamp"),
        exifImage: this.$t("category.360_photo"),
        amenityPackHotel: this.$t("category.amenity_pack"),
      };

      Object.keys(this.filter).map((el) => {
        if (this.filter[el] && Object.keys(tmp).includes(el)) {
          arr.push(tmp[el]);
        }
      });
      return arr;
    },
    nameCategory() {
      if (!this.additionalData) return "";

      if (this.language == "vi") {
        return this.additionalData.title.split("|")[0] || this.additionalData.title;
      }
      if (this.language == "en") {
        return this.additionalData.title.split("|")[1] || this.additionalData.title;
      }
      return;
    },
  },
};
</script>

<style src="./category-page-style.css"></style>
