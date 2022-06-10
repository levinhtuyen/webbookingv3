<template>
  <div>
    <div class="payment-v4-step3__content">
      <PaymentSuccessPayoo
        v-if="paymentMethod && paymentMethod.id ==1 && responseMyBookingDetail"
        :paymentCodeApi="responseMyBookingDetail.paymentCode"
      />
      <BookingSuccessful
        v-else
        :dataBooking="paymentInfo"
        :donateCoupon="donateCoupon"
      />
    </div>
    <!-- <div class="payment-v4-step1__next">
      <ButtonNext :title="textNext" @bookNow="nextStep"></ButtonNext>
    </div> -->
  </div>
</template>

<script>
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import PaymentSuccessPayoo from "./PaymentSuccessPayoo.vue";
  import BookingSuccessful from "./BookingSuccessful.vue";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import { getToken, BASE_URL } from "~jsDefinePath/general";
  export default {
    props: {
      stepPayment: [String, Number],
      info: [Array, Object],
    },
    components: {
      ButtonNext: () =>
        import("~jsPartialPath/global/component/book-now/BookNow.vue"),
      PaymentSuccessPayoo,
      BookingSuccessful,
    },
    data() {
      return {
        BASE_URL,
        textNext: this.$t("payment.next"),
        paymentMethod: null,
        paymentInfo: { ...this.info },
        userBookingSn: 0,
        donateCoupon: null,
        responseMyBookingDetail: [],
      };
    },
    created() {
      // NOTE - Setup meta tag
      this.$metaTag.setup({
        title: "Đặt phòng thành công",
        description: "Đặt phòng thành công tại Go2Joy",
        "og:type": "website",
        "og:title": "Đặt phòng thành công",
        "og:description": "Đặt phòng thành công tại Go2Joy",
        "og:url": BASE_URL + window.location.pathname,
        "og:site_name": "Go2Joy",
        "og:image": "",
        "og:image:width": "1200",
        "og:image:height": "628",
      });

      this.paymentMethod = JSON.parse(sessionStorage.getItem("paymentMethod"));
      this.userBookingSn = sessionStorage.getItem("userBookingSn");
      this.getAjaxBookingDetailDataResponse(this.userBookingSn);
    },
    methods: {
      nextStep() {
        this.$emit("nextStep");
      },
      getAjaxBookingDetailDataResponse(userBookingSn) {
        const self = this;
        apiCaller({
          metaUrl: AJAX_URL.myBooking.detailV4,
          // metaUrl: AJAX_URL.paymentSuccess.info,

          data: {
            userBookingSn: userBookingSn,
            // bookingNo: self.id,
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

            self.responseMyBookingDetail = objResponse?.data ?? [];
            self.donateCoupon = self.responseMyBookingDetail.donateCoupon;
            self.isNoData = false;
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          },

          complete() {},
        });
      }, // getAjaxBookingDetailDataResponse()
    },
  };
</script>

<style>
</style>
