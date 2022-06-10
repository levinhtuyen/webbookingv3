<template>
  <div class="payoo-page">
    <div class="container">
      <div class="payoo-page__head">
        <div class="payoo-page__head--back-button"></div>
        <p class="payoo-page__head--title">{{ $t("payoo.title") }}</p>
      </div>
      <div class="payoo-page__head-description">
        <p>{{ $t("payoo.sub_title") }}</p>
      </div>
      <div class="payoo-page__body">
        <div class="payoo-page__body--card-code card-payoo-code">
          <div class="card-payoo-code__title">
            {{ $t("payoo.payment_code") }}
          </div>
          <div class="card-payoo-code__code">
            {{ paymentCode }}
          </div>
          <div class="card-payoo-code__expire">
            {{ $t("payoo.note_expire") }} : {{ timeExpire }}
          </div>
        </div>
      </div>
      <div class="payoo-page__container-step content-payoo-step">
        <div class="content-payoo-step__item">
          <div class="content-payoo-step__item--title">
            {{ $t("payoo.step") }} 1
          </div>
          <div class="content-payoo-step__item--content">
            {{ $t("payoo.note_step_1") }}
            <span class="code-payoo">{{ paymentCode }}</span>
            <br />
            <p class="link-map-payoo">
              <a href="https://map.payoo.vn/map;verify=true">
                {{ $t("payoo.link_step_1") }}</a
              >
            </p>
            <div class="content-img-service">
              <div>
                <img :src="IMAGE_URL + `/icon/payment/img_circlek.svg`" />
              </div>
              <div>
                <img :src="IMAGE_URL + `/icon/payment/img_bsmart.svg`" />
              </div>
              <div>
                <img :src="IMAGE_URL + `/icon/payment/img_ministop.svg`" />
              </div>
              <div>
                <img :src="IMAGE_URL + `/icon/payment/img__cocomart.svg`" />
              </div>
              <div>
                <img :src="IMAGE_URL + `/icon/payment/img_familymart.svg`" />
              </div>
              <div>
                <img :src="IMAGE_URL + `/icon/payment/img_mediamart.svg`" />
              </div>
              <div>
                <img :src="IMAGE_URL + `/icon/payment/img_ecomart.svg`" />
              </div>
              <div>
                <img :src="IMAGE_URL + `/icon/payment/img_aeon.svg`" />
              </div>
            </div>
          </div>
        </div>
        <div class="content-payoo-step__item">
          <div class="content-payoo-step__item--title">
            {{ $t("payoo.step") }} 2
          </div>
          <div class="content-payoo-step__item--content">
            {{ $t("payoo.note_step_2") }}
          </div>
        </div>
        <div class="content-payoo-step__item">
          <div class="content-payoo-step__item--title">
            {{ $t("payoo.step") }} 3
          </div>
          <div class="content-payoo-step__item--content">
            {{ $t("payoo.note_step_3") }}
          </div>
        </div>
      </div>
      <div class="payoo-page__button-booking">
        <button
          class="payoo-page__button-booking--btn"
          @click="goBookingDetail()"
        >
          {{ $t("payoo.booking_detail") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { IMAGE_URL } from "~jsDefinePath/general";
import { AJAX_URL } from "~jsDefinePath/ajax-url";
import { apiCaller } from "~jsHelperPath/service/ApiHandler";

export default {
  data() {
    return {
      IMAGE_URL,
      bookingInfo: [],
      paymentCode: null,
      bookingNo: this.$route.query.bookingNo,
    };
  },
  methods: {
    goBookingDetail() {
      this.$router.push({
        name: "payment-success",
        params: { bookingNo: this.bookingNo },
      });
    },
    async getInfoBooking() {
      EventBus.emit("IS_SHOW_ROUTER_LOADING", true);

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
        this.paymentCode = res.data.paymentCode;

        EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
      } catch (error) {
        console.log("error :>> ", error);
      }
    },
  },
  computed: {
    timeExpire() {
      let time = new Date(this.bookingInfo.createTime);
      let time2 = new Date(time);
      time2.setMinutes(time.getMinutes() + 30);
      let result =
        this.$route.query?.paymentExpireDate ||
        dayjs(time2).format("DD-MM-YYYY HH:mm");
      return result;
    },
  },
  created() {
    EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
    this.getInfoBooking();
  },
};
</script>


<style src="./payoo-page-style.css"></style>
