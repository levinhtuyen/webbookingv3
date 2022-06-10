<template>
  <div>
    <div
      class="payment-v4-step1__content"
      v-if="paymentInfo"
    >
      <div class="is-title">
        <p>{{ $t("payment_v4.step_1.check") }}</p>
      </div>

      <div class="date-time">
        <div class="date-time__check-in">
          <div class="date-time__check-in--is-text-check-in">
            <p>{{ $t("payment_v4.step_1.check_in") }}</p>
          </div>
          <div class="date-time__check-in--time-check-in">
            <span class="is-time-check-in">{{ paymentInfo.startTime }}</span>
            <span class="is-date-check-in">{{ formatMMM(paymentInfo.checkInDatePlan) }} </span>
          </div>
        </div>
        <div class="date-time__check-out">
          <div class="date-time__check-out--is-text-check-out">
            <p>{{ $t("payment_v4.step_1.check_out") }}</p>
          </div>
          <div class="date-time__check-out--time-check-out">
            <span class="is-time-check-out">{{ paymentInfo.endTime }}</span><span class="is-date-check-out">{{ formatMMM(paymentInfo.endDate) }}</span>
          </div>
        </div>
      </div>
      <div class="info-room">
        <div class="info-room__title">
          <div class="is-text-info">
            <p>{{ $t("payment_v4.step_1.booking_type") }}</p>
          </div>
          <div class="is-text-info">
            <p>{{ $t("payment_v4.step_1.hotel_name") }}</p>
          </div>
          <div class="is-text-info">
            <p>{{ $t("payment_v4.step_1.room_type") }}</p>
          </div>
          <!-- <div class="is-text-info" v-if="isAgoda">
            <p>{{ $t("payment_v4.step_1.number_of_room") }}</p>
          </div> -->
        </div>
        <div class="info-room__data">
          <div
            class="is-text-data"
            v-if="paymentInfo"
          >
            <p v-if="paymentInfo.type == 1">{{ $t("payment_v4.step_1.hourly") }}</p>
            <p v-else-if="paymentInfo.type == 2">{{ $t("payment_v4.step_1.overnight") }}</p>
            <p v-else-if="paymentInfo.type == 3">{{ $t("payment_v4.step_1.daily") }}</p>
          </div>
          <div class="is-text-data is-uppercase">
            <p>{{paymentInfo.hotelName?paymentInfo.hotelName:""}}</p>
          </div>
          <div class="is-text-data">
            <p>{{paymentInfo.roomName?paymentInfo.roomName:""}}</p>
          </div>
          <!-- <div class="is-text-data" v-if="isAgoda">
            <p>x1</p>
          </div> -->
        </div>
      </div>
      <div
        class="info-user-agoda"
        v-if="isAgoda && dataUserAgoda"
      >
        <div class="info-user-agoda__item">
          <div class="is-title">
            {{ $t("payment_v4.step_1.first_name") }}
          </div>
          <div class="is-data">
            {{ dataUserAgoda.firstName }}
          </div>
        </div>
        <div class="info-user-agoda__item">
          <div class="is-title">
            {{ $t("payment_v4.step_1.last_name") }}
          </div>
          <div class="is-data">
            {{ dataUserAgoda.lastName }}
          </div>
        </div>
        <div class="info-user-agoda__item">
          <div class="is-title">
            {{ $t("payment_v4.step_1.gender") }}
          </div>
          <div
            class="is-data"
            v-if="dataUserAgoda.gender == 1"
          >
            {{ $t("payment_v4.step_1.male") }}
          </div>
          <div
            class="is-data"
            v-else
          >
            {{ $t("payment_v4.step_1.female") }}
          </div>
        </div>
        <div class="info-user-agoda__item">
          <div class="is-title">
            {{ $t("payment_v4.step_1.age") }}
          </div>
          <div class="is-data">
            {{ dataUserAgoda.age }}
          </div>
        </div>
        <div class="info-user-agoda__item">
          <div class="is-title">
            {{ $t("payment_v4.step_1.mobile_number") }}
          </div>
          <div class="is-data">
            {{ dataUserAgoda.mobile }}
          </div>
        </div>
        <div class="info-user-agoda__item">
          <div class="is-title">
            {{ $t("payment_v4.step_1.email") }}
          </div>
          <div class="is-data">
            {{ dataUserAgoda.email }}
          </div>
        </div>
      </div>
      <div
        class="info-user"
        v-else
      >
        <div class="info-user__title">
          <div class="is-text-info">
            <p>{{ $t("payment_v4.step_1.nick_name") }}</p>
          </div>
          <div class="is-text-info">
            <p>{{ $t("payment_v4.step_1.mobile") }}</p>
          </div>
        </div>
        <div
          class="info-user__data"
          v-if="hasUserInfo"
        >
          <div class="is-text-data">
            <p>{{userInformation.nickName}}</p>
          </div>
          <div class="is-text-data">
            <p>{{userInformation.mobile}}</p>
          </div>
        </div>
        <div
          class="info-user__data"
          v-else
        >
          <div class="is-text-data">
            <p>{{paymentInfo.nickName}}</p>
          </div>
          <div class="is-text-data">
            <p>{{paymentInfo.mobile}}</p>
          </div>
        </div>
      </div>

    </div>
    <div class="payment-v4-step1__next">
      <ButtonNext
        :key="'payment-v4-step1-button-next'"
        :title="$t(`payment_v4.button_next`)"
        @bookNow="nextStep"
      ></ButtonNext>
    </div>

  </div>
</template>

<script>
  import { mapGetters, mapState, mapActions } from "~jsPath/lib/lib-manager";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsPath/base/vuex/modules/page-info-module";
  import { BASE_URL } from "~jsDefinePath/general";
  export default {
    props: {
      stepPayment: [String, Number],
      info: [Array, Object],
    },
    components: {
      ButtonNext: () =>
        import("~jsPartialPath/global/component/book-now/BookNow.vue"),
    },
    data() {
      return {
        BASE_URL,
        paymentInfo: { ...this.info },
        isAgoda: false,
        dataUserAgoda: { ...this.info.guestInformation },
      };
    },
    methods: {
      dayjs: window.dayjs,
      nextStep() {
        this.$emit("nextStep");
      },
      formatMMM(date) {
        if (!date) return;
        let CDate = dayjs(date).locale(this.language).format("DD/MM/YYYY");
        return CDate;
      }, // formatMMM()
    },
    created() {
      // NOTE - Setup meta tag
      this.$metaTag.setup({
        title: "Xác nhận thông tin",
        description: "Xác nhận thông tin đặt phòng",
        "og:type": "website",
        "og:title": "Xác nhận thông tin",
        "og:description": "Xác nhận thông tin đặt phòng",
        "og:url": BASE_URL + window.location.pathname,
        "og:site_name": "Go2Joy",
        "og:image": "",
        "og:image:width": "1200",
        "og:image:height": "628",
      });

      this.paymentInfo.origin == 2
        ? (this.isAgoda = true)
        : (this.isAgoda = false);
    },
    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),
      ...mapGetters(PAGE_INFO_MODULE_NAME, {
        hasUserInfo: "hasUserInfo",
        userInformation: "userInformation",
      }),
      ...mapState(PAGE_INFO_MODULE_NAME, {
        userInfo: "userProfile",
      }),
    },
  };
</script>

<style>
</style>
