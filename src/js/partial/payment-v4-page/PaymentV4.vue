<template>
  <div class="payment-v4-page">
    <G2JConfirmInformation
      v-if="numberActiveStep"
      :numberActiveStep="numberActiveStep"
      @onBack="onClickBack()"
    />
    <div class="container">
      <step1
        :info="paymentInfo"
        @nextStep="nextStep"
        :step-payment="numberActiveStep"
        v-if="numberActiveStep == 1"
      ></step1>
      <step2
        :info="paymentInfo"
        @nextStep="nextStep"
        :step-payment="numberActiveStep"
        v-if="numberActiveStep == 2"
        @setInfoPayoo="val => getInfoPayoo(val)"
      ></step2>
      <step3
        :info="paymentInfo"
        @nextStep="nextStep"
        :step-payment="numberActiveStep"
        :infoPayoo="infoPayoo"
        v-if="numberActiveStep == 3"
      ></step3>
    </div>
  </div>
</template>

<script>
  import G2JConfirmInformation from "~jsPartialPath/global/component/g2j-confirm-information/G2JConfirmInformation.vue";
  import { getHotelDetailPagePath } from "~jsHelperPath/util/HandleUrl";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsPath/base/vuex/modules/page-info-module";
  import { mapState } from "~jsPath/lib/lib-manager";

  export default {
    name: "ThePaymentV4Page",
    components: {
      G2JConfirmInformation,
      step1: () => import("./component/Step1Payment.vue"),
      step2: () => import("./component/Step2Payment.vue"),
      step3: () => import("./component/Step3Payment.vue"),
    },
    beforeRouteEnter(to, from, next) {
      if (from.name == "booking-detail-page" && to.params.step == 3) {
        next("/");
      }
      next((vm) => {});
    },
    data() {
      return {
        valueTime: "",
        numberActiveStep: 1,
        textNext: this.$t("payment.next"),
        paymentInfo: {},
        infoPayoo: {},
      };
    },
    created() {
      EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
      this.paymentInfo = JSON.parse(sessionStorage.getItem("paymentInfo"));
      if (this.isEmpty(this.paymentInfo)) return this.$router.push("/");
      this.initRoute();
    },
    methods: {
      isEmpty: _.isEmpty,

      nextStep() {
        this.numberActiveStep =
          Number(this.numberActiveStep) + 1 > 3
            ? 3
            : Number(this.numberActiveStep) + 1;
      },
      onClickBack() {
        if (this.numberActiveStep == 1) {
          // this.$router.go(-1);
          // this.$router.push({
          //   name: "hotel-detail-page",
          //   query: { hotelSn: this.paymentInfo.hotelSn },
          // });

          this.$router.push(
            getHotelDetailPagePath(
              { hotelName: GetSlug(this.paymentInfo.hotelName) },
              { hotelSn: this.paymentInfo.hotelSn }
            )[this.language]
          );

          return;
        }
        // chỗ này thành công mà back về hotel detail
        if (this.numberActiveStep == 3) {
          this.$router.push("/");
        }
        this.numberActiveStep =
          this.numberActiveStep - 1 == 0 ? 1 : Number(this.numberActiveStep) - 1;
      },
      initRoute() {
        // let query = { ...this.$route.query };
        let params = { ...this.$route.params };
        this.numberActiveStep = params && params.step ? params.step : 1;
      },
      async getInfoPayoo(data) {
        this.infoPayoo = data;
        await this.nextStep();
        this.$router.replace({
          name: this.$route.name,
          params: this.$route.params,
          query: {
            billingCode: data.billingCode,
            paymentExpireDate: data.paymentExpireDate,
            bookingNo: data.bookingNo,
          },
        });
      },
    },
    watch: {
      // $route(val) {
      //   this.numberActiveStep = val.params.step;
      //   this.initRoute();
      // },
      $route: {
        handler(val) {
          this.numberActiveStep = val.params.step ?? 1;
          this.initRoute();
        },
        deep: true,
      },
      numberActiveStep() {
        let query = { ...this.$route.query };
        let params = { ...this.$route.params };
        params.step = this.numberActiveStep;
        this.$router.replace({
          name: this.$route.name,
          params,
          query,
        });
      },
    },
    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),
    },
  };
</script>
<style src="./payment-v4-page-style.css"></style>
