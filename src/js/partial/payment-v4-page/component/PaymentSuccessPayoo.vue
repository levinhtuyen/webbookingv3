<template>
  <div class="payoo-page">
    <div class="container">
      <div class="payoo-page__waiting-payment">
        <p>
          <i class="fas fa-check-circle"></i>
          <span>{{ $t("payment_v4.step_3.waiting_payment") }}</span>
        </p>
      </div>
      <div class="payoo-page__waiting-payment-info">
        <p>{{ $t("payment_v4.step_3.sub_title") }}</p>
      </div>
      <div class="payoo-page__container-step content-payoo-step">
        <div class="content-payoo-step__item">
          <div class="content-payoo-step__item--title">
            {{ $t("payment_v4.step_3.step") }} 1
          </div>
          <div class="content-payoo-step__item--content">
            <span class="code-note">{{
              $t("payment_v4.step_3.note_step_1")
            }}</span>
            <span class="code-payoo">{{ codePaymentBooking }}</span>
            <br />
            <p class="link-map-payoo">
              <a href="https://map.payoo.vn/map;verify=true">
                {{ $t("payment_v4.step_3.link_step_1") }}</a>
            </p>
            <div class="payoo-page__body">
              <div class="payoo-page__body--card-code card-payoo-code">
                <div class="card-payoo-code__title">
                  {{ $t("payment_v4.step_3.payment_code") }}
                </div>
                <div class="card-payoo-code__code">
                  {{ codePaymentBooking }}
                </div>
                <div class="card-payoo-code__expire">
                  {{ $t("payment_v4.step_3.note_expire") }} : {{ timeExpire }}
                </div>
              </div>
            </div>
            <div class="content-img-service">
              <div class="content-img-service__image">
                <img :src="IMAGE_URL + `/icon/payment/img_circlek.svg`" />
              </div>
              <div class="content-img-service__image">
                <img :src="IMAGE_URL + `/icon/payment/img_bsmart.svg`" />
              </div>
              <div class="content-img-service__image">
                <img :src="IMAGE_URL + `/icon/payment/img_ministop.svg`" />
              </div>
              <div class="content-img-service__image">
                <img :src="IMAGE_URL + `/icon/payment/img__cocomart.svg`" />
              </div>
              <div class="content-img-service__image">
                <img :src="IMAGE_URL + `/icon/payment/img_familymart.svg`" />
              </div>
              <div class="content-img-service__image">
                <img :src="IMAGE_URL + `/icon/payment/img_mediamart.svg`" />
              </div>
              <div class="content-img-service__image">
                <img :src="IMAGE_URL + `/icon/payment/img_ecomart.svg`" />
              </div>
              <div class="content-img-service__image">
                <img :src="IMAGE_URL + `/icon/payment/img_aeon.svg`" />
              </div>
            </div>
          </div>
        </div>
        <div class="content-payoo-step__item">
          <div class="content-payoo-step__item--title">
            {{ $t("payment_v4.step_3.step") }} 2
          </div>
          <div class="content-payoo-step__item--content">
            {{ $t("payment_v4.step_3.note_step_2") }}
          </div>
        </div>
        <div class="content-payoo-step__item">
          <div class="content-payoo-step__item--title">
            {{ $t("payment_v4.step_3.step") }} 3
          </div>
          <div class="content-payoo-step__item--content">
            {{ $t("payment_v4.step_3.note_step_3") }}
          </div>
        </div>
      </div>
      <div class="payoo-page__button-booking">
        <button
          class="payoo-page__button-booking--btn"
          @click="goBookingDetail()"
        >
          {{ $t("payment_v4.booking_detail") }}
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
    props: {
      paymentCodeApi: {
        type: Number,
        default: ""
      },
    },
    data() {
      return {
        IMAGE_URL,
        bookingInfo: [],
        paymentCode: this.$route.query.billingCode,
        bookingNo: this.$route.query.bookingNo,
        // timeExpire: this.$route.query.paymentExpireDate,
      };
    },
    methods: {
      goBookingDetail() {
        this.$router.push({
          // name: "payment-success",
          // params: { bookingNo: this.bookingNo },
          name: "booking-detail-page",
          params: { id: sessionStorage.getItem("userBookingSn") },
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
          dayjs(this.$route.query?.paymentExpireDate).format(
            "HH:mm DD/MM/YYYY"
          ) || dayjs(time2).format("HH:mm DD/MM/YYYY");
        return result;
      },
      codePaymentBooking(){
        return this.paymentCodeApi
      }
    },

    created() {
      EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
      // this.getInfoBooking();
    },
  };
</script>

