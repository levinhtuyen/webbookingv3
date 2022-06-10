<template>
  <div>
    <div
    v-if="infoHotel.origin == 2"
    class="booking-successfull-agoda"
    >
      <h1 class="booking-successfull-agoda__title">{{$t('payment_v4.step_3.waiting_confirm')}}</h1>
      <div class="booking-successfull-agoda__description">
        <p>{{$t('payment_v4.step_3.your_booking_will')}} </p>
        <p>
          {{$t('payment_v4.step_3.within')}} <span class="hight-light">{{$t('payment_v4.step_3.2_minutes_and')}}</span>
        </p>
      </div>
      <div class="booking-successfull-agoda__footer">
        <router-link :to="{name: 'booking-detail-page', params: {id:idBooking }}">
          <button class="booking-successfull-section__button-booking--btn">
            {{ $t("payment_v4.step_3.booking_detail") }} ({{countDown}})s
          </button>
        </router-link>
      </div>
    </div>
    <div
      v-else
      class="booking-successfull-section"
    >
      <div class="booking-successfull-section__waiting-payment">
        <p>
          <i class="fas fa-check-circle"></i>
          <span>{{ $t("payment_v4.step_3.booking_successful") }}</span>
        </p>
      </div>
      <div class="booking-successfull-section__waiting-payment-info">
        <p>
          {{ $t("payment_v4.step_3.you_reservation_at") }}
          <span class="is-uppercase">{{ infoHotel.hotelName ? infoHotel.hotelName: ""}}</span> {{ $t("payment_v4.step_3.is_successful") }}
        </p>
      </div>
      <div
        class="booking-successfull-section__coupon"
        v-if="dataDonateCoupon"
      >
        <div class="is-title-coupon">
          <p>{{ $t("payment_v4.step_3.coupon") }}</p>
        </div>
        <div class="item-coupon">
          <div class="is-image">
            <img :src="IMAGE_URL + `/img_coupon.png`" />
          </div>
          <div class="is-content">
            <p v-if="language === 'en'">
              {{ $t("payment_v4.step_3.note_coupon1") }} {{ dataDonateCoupon.afterDiscount}} {{ $t("payment_v4.step_3.note_coupon2") }} <span v-if="dataDonateCoupon.discountType === 2">{{ dataDonateCoupon.discount}}%</span>
              <span v-else-if="dataDonateCoupon.discountType === 1">{{ $formatPrice(dataDonateCoupon.discount) }}</span> {{ $t("payment_v4.step_3.note_coupon3") }} {{ dataDonateCoupon.numCheckin}} {{ $t("payment_v4.step_3.note_coupon4") }}
            </p>
            <p v-else>
              {{ $t("payment_v4.step_3.note_coupon3") }}
              <span v-if="dataDonateCoupon.discountType === 2">{{ dataDonateCoupon.discount}}%</span>
              <span v-else-if="dataDonateCoupon.discountType === 1">{{ $formatPrice(dataDonateCoupon.discount) }}</span>
              {{ $t("payment_v4.step_3.note_coupon4") }}
            </p>
          </div>
        </div>
      </div>
      <div class="booking-successfull-section__button-booking">
        <router-link :to="{name: 'booking-detail-page', params: {id:idBooking }}">
          <button class="booking-successfull-section__button-booking--btn">
            {{ $t("payment_v4.step_3.booking_detail") }}
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import { IMAGE_URL } from "~jsDefinePath/general";
  import { _, mapState } from "~jsPath/lib/lib-manager";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsPath/base/vuex/modules/page-info-module";
  export default {
    props: {
      dataBooking: [Array, Object],
      donateCoupon: [Array, Object],
    },
    data() {
      return {
        IMAGE_URL,
        idBooking: sessionStorage.getItem("userBookingSn"),
        isShow: false,
        countDown: 5,
        paymentInfo: { ...this.info },
        isAgoda: false,
      };
    },

    computed: {
      infoHotel() {
        return this.dataBooking;
      },
      dataDonateCoupon() {
        return this.donateCoupon;
      },
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),
    },
    methods: {
      countDownTimer() {
        if (this.countDown > 0) {
          setTimeout(() => {
            this.countDown -= 1;
            this.countDownTimer();
          }, 1000);
        }
        if (this.countDown == 0)
          this.$router.push({
            name: "booking-detail-page",
            params: { id: this.idBooking },
          });
      },
    },
    created() {},
    mounted() {
      if(this.infoHotel.origin == 2){
        this.countDownTimer();
      }else {
        return
      }
    },
  };
</script>

<style>
</style>
