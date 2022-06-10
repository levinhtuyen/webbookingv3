<template>
  <section
    v-if="$route.name === 'coupon-page'"
    ref="test"
    class="coupon-page"
  >
    <div class="container">
      <h2 class="coupon-page__heading">{{ $t('my_coupon_page.my_coupon') }}</h2>
      <div v-if="isShowMyCoupon && !isNoData">
        <div
          v-for="(item, index) in responseMyCouponList"
          :key="index"
        >
          <coupon-card-item :myCouponItem="item"></coupon-card-item>
        </div>
        <div class="coupon-page__paginate">
          <Pagination
            v-if="responseMyCouponList && responseMyCouponList.length"
            position="center"
            :pageSizes="pageCount"
            :current-page="currentPage"
            @changeCurrentPage="changeCurrentPage"
          />
        </div>
      </div>
      <div v-else-if="isNoData">
        <TheGo2joyNoData
          :logo="logo"
          :type="type"
        />
      </div>
    </div>
  </section>
</template>
<script>
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import { _ } from "~jsLibPath/lib-manager";
  import CouponCardItem from "./component/CouponCardItem.vue";
  import TheGo2joyNoData from "~jsPartialPath/global/component/go2joy-no-data/TheGo2joyNoData.vue";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import { getToken, BASE_URL } from "~jsDefinePath/general";
  import Pagination from "~jsPartialPath/global/component/pagination/Pagination.vue";
  export default {
    components: { CouponCardItem, TheGo2joyNoData, Pagination },
    data() {
      return {
        logo: "icon/no-data/coupon.png",
        type: 4,
        responseMyCouponList: [],
        isNoData: false,
        pageCount: 1,
        currentPage: 1,
      };
    },
    computed: {
      isShowMyCoupon() {
        return !_.isEmpty(this.responseMyCouponList);
      }, //isShowMyCoupon
    },
    created() {
      // NOTE - Setup meta tag
      this.$metaTag.setup({
        title: "Mã giảm giá của tôi - Go2Joy",
        description: "Xem danh sách mã giảm giá",
        "og:type": "website",
        "og:title": "Mã giảm giá của tôi - Go2Joy",
        "og:description": "Xem danh sách mã giảm giá",
        "og:url": BASE_URL + window.location.pathname,
        "og:site_name": "Go2Joy",
        "og:image": "",
        "og:image:width": "1200",
        "og:image:height": "628",
      });

      this.getAjaxCouponDataResponse();
    },
    methods: {
      isEmpty: _.isEmpty,
      changeCurrentPage(page) {
        let query = { ...this.$route.query };
        query.page = page;
        this.$router.push({ name: "coupon-page", query: query });
        this.getAjaxCouponDataResponse();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, // changeCurrentPage

      getAjaxCouponDataResponse() {
        EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        let query = this.$route.query ?? {};
        this.currentPage = query?.page ?? 1;
        const self = this;
        apiCaller({
          metaUrl: AJAX_URL.myCoupon.all,
          data: {
            limit: 10,
            page: self.currentPage,
            calculateExpired: 1,
            isHistory: 0,
          },
          type: "GET",
          headers: {
            Authorization: getToken(),
          },
          dataType: "json",
          error() {
            self.isNoData = true;
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          },
          success(objResponse) {
            if (
              _.isEmpty(objResponse) ||
              objResponse.error ||
              _.isEmpty(objResponse.data) ||
              _.isEmpty(objResponse.data.couponList)
            ) {
              self.isNoData = true;
              EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
              return;
            }
            self.responseMyCouponList = objResponse.data?.couponList ?? [];
            self.pageCount = objResponse.data?.meta.lastPage ?? 1;
            if (objResponse.data?.meta.total > 0) {
              self.isNoData = false;
            } else {
              self.isNoData = true;
            }
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          },
          complete() {},
        });
      }, // getAjaxCouponDataResponse()
    },
  };
</script>
<style src="./coupon-page-style.css"></style>
