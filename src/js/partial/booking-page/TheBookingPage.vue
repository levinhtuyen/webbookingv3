<template>
  <section
    v-if="$route.name === 'booking-page'"
    ref="test"
    class="booking-page"
  >
    <h2 class="booking-page__heading">{{ $t('my_booking_page.my_booking') }}</h2>
    <div v-if="isShowMyBooking && !isNoData">
      <div
        v-for="(item, index) in responseMyBookingList"
        :key="index"
      >
        <router-link :to="{name: 'booking-detail-page', params: {id: item.sn}}">
          <booking-card-item :myBookingList="item"></booking-card-item>
        </router-link>
      </div>
      <div class="booking-page__paginate">
        <Pagination
          v-if="responseMyBookingList && responseMyBookingList.length"
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
  </section>
</template>
<script>
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import BookingCardItem from "./component/BookingCardItem.vue";
  import TheGo2joyNoData from "~jsPartialPath/global/component/go2joy-no-data/TheGo2joyNoData.vue";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import Pagination from "~jsPartialPath/global/component/pagination/Pagination.vue";
  import { ENV, ARR_ENV, getToken, BASE_URL } from "~jsDefinePath/general";
  export default {
    components: { BookingCardItem, TheGo2joyNoData, Pagination },
    data() {
      return {
        ENV,
        ARR_ENV,
        BASE_URL,
        logo: "icon/no-data/booking.png",
        type: 3,
        responseMyBookingList: [],
        isNoData: false,
        pageCount: 1,
        currentPage: 1,
      };
    },
    computed: {
      isShowMyBooking() {
        return !_.isEmpty(this.responseMyBookingList);
      }, //isShowMyBooking
    },
    created() {
      // NOTE - Setup meta tag
      this.$metaTag.setup({
        title: "Lịch sử đặt phòng của tôi - Go2Joy",
        description: "Xem lịch sử đặt phòng",
        "og:type": "website",
        "og:title": "Lịch sử đặt phòng của tôi - Go2Joy",
        "og:description": "Xem lịch sử đặt phòng",
        "og:url": BASE_URL + window.location.pathname,
        "og:site_name": "Go2Joy",
        "og:image": "",
        "og:image:width": "1200",
        "og:image:height": "628",
      });

      this.getAjaxBookingDataResponse();
    },
    methods: {
      isEmpty: _.isEmpty,
      changeCurrentPage(page) {
        let query = { ...this.$route.query };
        query.page = page;
        this.$router.push({ name: "booking-page", query: query });
        this.getAjaxBookingDataResponse();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, // changeCurrentPage
      getAjaxBookingDataResponse() {
        EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        let query = this.$route.query ?? {};
        this.currentPage = query?.page ?? 1;
        const self = this;
        apiCaller({
          metaUrl: AJAX_URL.myBooking.getBookingListV4,
          data: {
            limit: 10,
            page: self.currentPage,
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
              _.isEmpty(objResponse.data)
            ) {
              self.isNoData = true;
              EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
              return;
            }
            self.responseMyBookingList = objResponse.data?.bookingList ?? [];
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
      }, // getAjaxHomeDataResponse()
    },
  };
</script>
<style src="./booking-page-style.css"></style>
