<template>
  <section
    v-if="$route.name === 'booking-detail-page'"
    ref="test"
    class="booking-detail-page"
  >
    <div class="booking-detail-page__heading">
      <i
        class="fas fa-angle-left"
        @click="onBack"
      ></i>
      <h2>{{ $t('my_booking_detail_page.booking') }}</h2>
    </div>
    <div v-if="isShowMyBookingDetail && !isNoData">
      <div v-if="responseMyBookingDetail.origin == 1">
        <booking-infomation :myBookingDetail="responseMyBookingDetail" />
      </div>
      <div v-else>
        <booking-infomation-agoda :myBookingDetail="responseMyBookingDetail" />
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
  import BookingInfomation from "./component/BookingInfomation.vue";
  import BookingInfomationAgoda from "./component/BookingInfomationAgoda.vue";
  import TheGo2joyNoData from "~jsPartialPath/global/component/go2joy-no-data/TheGo2joyNoData.vue";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import { ENV, ARR_ENV, getToken, BASE_URL } from "~jsDefinePath/general";
  import { G2JRouter } from "~jsHelperPath/util/HandleRouterGlobal";
  import { ROUTER_NAME } from "~jsBasePath/vue-router/router-define";
  export default {
    name: "booking-detail-page",
    components: { TheGo2joyNoData, BookingInfomation, BookingInfomationAgoda },
    data() {
      return {
        BASE_URL,
        logo: "icon/no-data/booking.png",
        type: 3,
        responseMyBookingDetail: [],
        isNoData: false,
        id: this.$route.params.id,
      };
    },
    computed: {
      isShowMyBookingDetail() {
        return !_.isEmpty(this.responseMyBookingDetail);
      }, //isShowMyBookingDetail
    },
    created() {
      // NOTE - Setup meta tag

      this.$metaTag.setup({
        title: "Chi tiết đặt phòng " + this.id + " - Go2Joy",
        description: "Xem chi tiết đặt phòng " + this.id,
        "og:type": "website",
        "og:title": "Chi tiết đặt phòng " + this.id + " - Go2Joy",
        "og:description": "Xem chi tiết đặt phòng " + this.id,
        "og:url": BASE_URL + window.location.pathname,
        "og:site_name": "Go2Joy",
        "og:image": "",
        "og:image:width": "1200",
        "og:image:height": "628",
      });

      EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
      this.getAjaxBookingDetailDataResponse();
    },
    methods: {
      isEmpty: _.isEmpty,
      getAjaxBookingDetailDataResponse() {
        const self = this;
        apiCaller({
          metaUrl: AJAX_URL.myBooking.detailV4,
          // ENV === ARR_ENV.production
          //   ? AJAX_URL.myBooking.detail
          //   :
          // AJAX_URL.myBooking.detailV4,
          // metaUrl: AJAX_URL.paymentSuccess.info,

          data: {
            // userBookingSn: self.id,
            userBookingSn: self.id,
          },
          // ENV === ARR_ENV.production
          //   ? {
          //       userBookingSn: self.id,
          //       // bookingNo: self.id,
          //     }
          //   : {
          //       // userBookingSn: self.id,
          //       userBookingSn: self.id,
          //     },
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

            self.responseMyBookingDetail = objResponse?.data ?? [];
            self.isNoData = false;
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          },

          complete() {},
        });
      }, // getAjaxBookingDetailDataResponse()

      onBack() {
        G2JRouter.replace({ name: ROUTER_NAME["home-page"] });
      }, // onBack
    },
  };
</script>
<style src="./booking-detail-page-style.css"></style>
