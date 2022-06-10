<template>
  <div class="payment-detail payment-success">
    <div v-if="bookingInfo" class="container">
      <div class="payment-detail__head">
        <div class="payment-detail__head--back-button">
          <!-- <back-button :to="goHotelDetail()"></back-button> -->
        </div>
        <div class="payment-detail__head--title">
          {{ bookingInfo.hotelName }}
        </div>
      </div>
      <div class="payment-detail__body">
        <div class="payment-detail__body--group-content">
          <p class="content-key">
            {{ $t("payment-success.mobile") }}
          </p>
          <p class="content-value">
            {{ bookingInfo.mobile }}
          </p>
        </div>
        <div class="line" />
        <div class="payment-detail__body--group-content">
          <p class="content-key">
            {{ $t("payment-success.booking_id") }}
          </p>
          <p class="content-value">
            {{ bookingInfo.bookingNo }}
          </p>
        </div>
        <div class="payment-detail__body--group-content">
          <p class="content-key">
            {{ $t("payment-success.room_type") }}
          </p>
          <p class="content-value">
            {{ bookingInfo.roomTypeName }}
          </p>
        </div>

        <div class="payment-detail__body--group-content">
          <p class="content-key">
            {{ $t("payment-success.booking_type") }}
          </p>
          <p class="content-value" v-if="language == 'en'">
            {{
              bookingInfo.type == 1
                ? "Hour"
                : bookingInfo.type == 2
                ? "Overnight"
                : "Daily"
            }}
          </p>
            <p class="content-value" v-if="language == 'vi'">
            {{
              bookingInfo.type == 1
                ? "Giờ"
                : bookingInfo.type == 2
                ? "Qua đêm"
                : "Ngày"
            }}
          </p>

        </div>
        <div class="payment-detail__body--group-content">
          <p class="content-key">
            {{ $t("payment-success.booking_time") }}
          </p>
          <p v-if="bookingInfo.type == 1" class="content-value">
            {{ bookingInfo.startTime }}~{{ bookingInfo.endTime }},
            {{ getDDMMYYYY(bookingInfo.checkInDatePlan) }}
          </p>
          <p v-if="bookingInfo.type == 2" class="content-value">
            {{ getDDMMYYYY(bookingInfo.checkInDatePlan) }}
          </p>
          <p v-if="bookingInfo.type == 3" class="content-value">
            {{ getDDMMYYYY(bookingInfo.checkInDatePlan) }}
            ~{{ getDDMMYYYY(bookingInfo.endDate) }}
          </p>
        </div>
        <div class="line" />

        <div class="payment-detail__body--group-content">
          <p class="content-key">
            {{ $t("payment-success.hotel_fee") }}
          </p>
          <p class="content-value">
            {{ $formatPrice(bookingInfo.hotelFee) }}
          </p>
        </div>
        <div class="payment-detail__body--group-content">
          <p class="content-key">
            {{ $t("payment-success.products_fee") }}
          </p>
          <p class="content-value">
            {{ $formatPrice(bookingInfo.specialProductFee) }}
          </p>
        </div>

        <div class="payment-detail__body--group-content">
          <p class="content-key">
            {{ $t("payment-success.high_demand") }}
          </p>
          <p class="content-value">
            {{ $formatPrice(bookingInfo.highDemand) }}
          </p>
        </div>
        <div class="payment-detail__body--group-content">
          <p class="content-key">
            {{ $t("payment-success.discount") }}
          </p>
          <p class="content-value">
            {{ $formatPrice(bookingInfo.totalDiscount) }}
          </p>
        </div>
        <div class="payment-detail__body--group-content">
          <p class="content-key">
            {{ $t("payment-success.stamp_redeem") }}
          </p>
          <p class="content-value">
            {{ $formatPrice(bookingInfo.stamp) }}
          </p>
        </div>
        <div class="payment-detail__body--group-content">
          <p class="content-key">
            {{ $t("payment-success.point_redeem") }}
          </p>
          <p class="content-value">
            {{ $formatPrice(bookingInfo.point) }}
          </p>
        </div>
        <div class="line" />
        <div class="payment-detail__body--group-content total">
          <p class="content-key">
            {{ $t("payment-success.total") }}
          </p>
          <p class="content-value">
            {{ $formatPrice(bookingInfo.amountFromUser) }}&nbsp;
          </p>
        </div>
        <div class="line" />

        <div class="payment-detail__body--group-content">
          <div class="content-key">
            {{ $t("payment-success.paid_amount") }}
          </div>
          <div class="content-value">
            <p v-if="bookingInfo.paymentProvider === 0">0 đ</p>
            <p v-else>{{ $formatPrice(bookingInfo.amountFromUser) }} đ</p>
          </div>
        </div>
        <div class="payment-detail__body--group-content">
          <div class="content-key">
            {{ $t("payment-success.payment_method") }}
          </div>
          <div class="content-value">
            <img
              :src="iconBooking"
              alt=""
              class="payment-success__body--icon"
            />
            <p v-if="bookingInfo.paymentProvider === 0">{{ $t("payment-success.pay_at_hotel") }}</p>
            <p v-if="bookingInfo.paymentProvider === 3">Momo</p>
            <p v-if="bookingInfo.paymentProvider === 10">Credit/Debit Card</p>
            <p v-if="bookingInfo.paymentProvider === 11">Credit/Debit Card</p>
            <p v-if="bookingInfo.paymentProvider === 20">Payoo</p>
            <p v-if="bookingInfo.paymentProvider === 41">Credit card (VNPT)</p>
            <p v-if="bookingInfo.paymentProvider === 42">ATM Card</p>
            <p v-if="bookingInfo.paymentProvider === 60">ZaloPay</p>
          </div>
        </div>

        <div class="payment-detail__body--group-content">
          <p class="content-key">
            {{ $t("payment-success.booking_status") }}
          </p>
          <p v-if="bookingInfo.bookingStatus == 0" class="content-value">
            {{ $t("payment-success.unpaid") }}
          </p>
          <p v-else-if="bookingInfo.bookingStatus == 1" class="content-value">
            {{ $t("payment-success.booked") }}
          </p>
          <p v-else-if="bookingInfo.bookingStatus == 2" class="content-value">
            {{ $t("payment-success.done") }}
          </p>
          <p v-else class="content-value">
            {{ $t("payment-success.cancel") }}
          </p>
        </div>
        <div class="payment-success__body--timeline">
          <g2j-timeline :data-timeline="dataTimeline" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { IMAGE_URL } from "~jsDefinePath/general";
  import { getDDMMYYYY, getDDMMYYYYHHmm } from "~jsPath/helper/util/formatDate";
  import { getFormattedCurrency } from "~jsPath/helper/util/formatNumber";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import { apiCaller } from '~jsHelperPath/service/ApiHandler';
  import { mapGetters, mapState,mapActions } from "~jsPath/lib/lib-manager";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsPath/base/vuex/modules/page-info-module";

  export default {
    components: {
      "g2j-timeline": () =>
        import(
          "~jsPartialPath/global/component/g2j-timeline/TheGo2JoyTimeLine.vue"
        ),
    },
    data() {
      return {
        bookingNo: null,
        bookingInfo: null,
        IMAGE_URL,
      };
    },
    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
       language: 'language',
      }),
      iconBooking() {
        let paymentProvider = this.bookingInfo.paymentProvider;
        switch (paymentProvider) {
          case 0:
            return IMAGE_URL + `/icon/payment/hotel.png`;
            break;
          case 20:
            return IMAGE_URL + `/icon/payment/payoo.svg`;
            break;
          case 42:
            return IMAGE_URL + `/icon/payment/epay.svg`;
            break;
          case 41:
            return IMAGE_URL + `/icon/payment/epay.svg`;
            break;
          case 3:
            return IMAGE_URL + `/icon/payment/momo.jpg`;
            break;
          case 60:
            return IMAGE_URL + `/icon/payment/zalopay.svg`;
            break;
          default:
            return IMAGE_URL + `/icon/payment/hotel.png`;
            break;
        }
      },
      dataTimeline() {
        let lastUpdate = getDDMMYYYYHHmm(this.bookingInfo.lastUpdate);
        let checkInDatePlan = getDDMMYYYY(this.bookingInfo.checkInDatePlan);
        let timeLine = [
          {
            id: 1,
            content: this.$t("payment-success.step1"),
            timestamp: "at 09:30 05/01/2021",
            isActive: true,
            isPayHotel: false,
            color: "#ff6400",
            size: "large",
          },
          {
            id: 2,
            content: this.$t("payment-success.step2"),
            timestamp: "8888248223",
            isActive: false,
            isPayHotel: true,
            color: "#d1d1d1",
            size: "large",
          },
          {
            id: 3,
            content: this.$t("payment-success.step3"),
            timestamp: "before 10:00 05/01/2021",
            isActive: false,
            isPayHotel: false,
            color: "#d1d1d1",
            size: "large",
          },
        ];
        if (this.bookingInfo.paymentProvider != 20) {
          timeLine = timeLine.filter((item) => item.id !== 2);
          timeLine[0].timestamp =
            this.$t("payment-success.at") + ` ${lastUpdate} `;
          timeLine[1].timestamp =
            this.$t("payment-success.at") + ` ${checkInDatePlan}`;
        } else {
          timeLine[0].timestamp =
            this.$t("payment-success.at") + ` ${lastUpdate}`;
          timeLine[1].timestamp = this.bookingInfo.paymentCode;
          timeLine[2].timestamp =
            this.$t("payment-success.at") + ` ${checkInDatePlan}`;
        }

        return timeLine;
      },
    },
    created() {
      EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
      this.getInfoBooking();
    },
    methods: {
      getDDMMYYYY,
      getFormattedCurrency,
      goHotelDetail() {
        return `/hotel/${this.bookingInfo.hotelSn}`;
      },
      async getInfoBooking() {
        EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        this.bookingNo = this.$route.params.bookingNo;
        // let url = `https://staging-api.go2joy.vn/api/v1/web-booking/user-bookings/getUserBookingByBookingNo?bookingNo=${this.bookingNo}`
        // let url = `${AJAX_URL.paymentSuccess.info}bookingNo=${this.bookingNo}`
        try {
          let res = await apiCaller({
            metaUrl: AJAX_URL.paymentSuccess.info,
            dataType: "json",
            data: {
              bookingNo: this.bookingNo,
            },
            method: "GET",
            contentType: "application/json; charset=utf-8",
          });
          this.bookingInfo = res.data;

          EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
        } catch (error) {
          console.log("error :>> ", error);
        }
      },
    },
  };
</script>
<style src="./payment-success-page-style.css">
</style>
