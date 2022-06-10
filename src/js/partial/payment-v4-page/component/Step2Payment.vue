
<template>
  <div class="payment-v4-step2">
    <div class="payment-v4-step2__title">
      <h2>
        {{$t('payment_v4.step_2.payment')}}
      </h2>
      <hr class="payment-v4-step2__title--hr">
    </div>
    <div class="payment-v4-step2__additional">
      <div
        v-if="!hasUserInfo "
        class="deal-additional"
      >
        <p class="deal-additional__title">
          {{$t('payment_v4.step_2.exclusive_deal')}}
        </p>
        <div class="deal-additional__content">
          <div class="deal-additional__content--description">
            {{$t('payment_v4.step_2.please')}}
            <router-link :to="{name: 'login-page'}">
              <span class="high-light">
                {{$t('payment_v4.step_2.sign_in')}}
              </span>
            </router-link> {{$t('payment_v4.step_2.to_receive')}}
          </div>
          <div class="deal-additional__content--img">
            <g2j-image :url-img="`${IMAGE_URL}/svg/gift_payment.svg`"></g2j-image>
          </div>
        </div>
      </div>

      <template v-else-if=" paymentInfo.origin == 1 && paymentInfo.mode == 1">
        <!-- coupon -->
        <div class="coupon-additional">
          <div class="coupon-additional__header">
            <h3 class="coupon-additional__header--label">
              {{$t('payment_v4.step_2.coupon')}}
            </h3>
            <div class="coupon-additional__header--description">
              {{couponReward?couponReward.promotionName: ""}}
            </div>
          </div>
          <div class="coupon-additional__body">
            <div class="coupon-additional__body--content">
              <template v-if=" !isEmpty(couponReward) ">
                <p
                  class="title-coupon"
                  v-html="getTitleCoupon(couponReward)"
                ></p>
                <p class="date-coupon">{{couponReward.start}} ~ {{couponReward.end}} </p>
              </template>
              <template v-else>
                <p class="no-coupon">{{$t('payment_v4.no_coupon')}}</p>
                <p
                  v-if="language =='en'"
                  class="no-coupon "
                >
                  <span class="hight-light">{{$t('payment_v4.step_2.select_coupon')}}</span> {{$t('payment_v4.to_find_out')}}
                </p>
              </template>
            </div>
            <div class="coupon-additional__body--select-button">
              <button
                @click="openModalCoupon()"
                class="select-coupon"
              > {{$t('payment_v4.step_2.select_coupon')}}
              </button>
            </div>
          </div>

        </div>
        <!-- end coupon -->

        <!-- stamp -->
        <div
          class="stamp-additional"
          v-if="stampReward &&stampReward.numToRedeem >0"
        >
          <div class="stamp-additional__header">
            <div class="stamp-additional__header--label">
              {{$t('payment_v4.step_2.stamp')}}
            </div>
            <div
              v-if="stampReward"
              class="stamp-additional__header--icon-total"
            >
              <g2j-image :url-img="`${IMAGE_URL}/icon/payment/promo.svg`"></g2j-image>
              <span class="number-total"> {{stampReward.numStampActive}}/ {{stampReward.numToRedeem}}</span>
            </div>
          </div>
          <div class="stamp-additional__body">
            <div class="stamp-additional__body--content">
              <template v-if="stampReward">
                <p
                  class="total-coupon"
                  v-html="getTitleStamp(stampReward)"
                >
                </p>
                <p class="description">{{$t('payment_v4.step_2.maximum')}} {{formatPriceVND(stampReward.maxRedeem) }}</p>
                <p
                  v-if="stampReward"
                  class="sub-description"
                >
                  *{{$t('payment_v4.step_2.apply_stamp')}}
                  <span v-if="stampReward.redeemHourly">{{$t('payment_v4.step_2.hourly')}}<span v-if="stampReward.redeemHourly && stampReward.redeemOvernight">&sbquo;</span></span>
                  <span v-if="stampReward.redeemOvernight">{{$t('payment_v4.step_2.overnight')}}<span v-if="stampReward.redeemOvernight && stampReward.redeemDaily">&sbquo;</span></span>
                  <span v-if="stampReward.redeemDaily">{{$t('payment_v4.step_2.daily')}}</span>
                </p>
              </template>
            </div>
            <div class="stamp-additional__body--redeem-button">
              <button
                v-if="isRedeem"
                class="redeem-button"
                @click=" onRedeemStamp()"
                :disabled="stampReward && stampReward.numStampActive >= stampReward.numToRedeem && stampReward.numStampActive > 0? false : true"
              >{{$t('payment_v4.step_2.redeem_stamp')}} </button>

              <button
                v-else
                @click="onRedeemStamp()"
                class="redeem-cancel"
              >{{$t('payment_v4.step_2.cancel')}} <i class="fa fa-times icon-error"></i></button>
            </div>
          </div>
        </div>
        <!-- end stamp -->

        <!-- point -->
        <div class="point-additional">
          <div class="point-additional__header">
            <div class="point-additional__header--label">
              {{$t('payment_v4.step_2.point')}}
            </div>
            <div class="point-additional__header--icon-total">
              <span class="number-total">
                <span class="high-light">{{pointReward && pointReward.totalPoint?getFormattedCurrency(pointReward.totalPoint):0}} </span> P
              </span>
            </div>
          </div>
          <div class="point-additional__body">
            <div class="point-additional__body--content">
              <p class="description">
                {{$t('payment_v4.step_2.available_from')}}
                <span class="high-light">50.000P</span>
                {{$t('payment_v4.step_2.equivalent')}}
              </p>
              <div class="container-input-point">
                <span class="container-input-point__title"> {{$t('payment_v4.step_2.use')}}
                </span>
                <div
                  v-if="pointReward"
                  class="container-input-point__input"
                >
                  <input
                    :disabled=" !isPoint || pointReward.totalPoint < 50000"
                    type="text"
                    class="input-point"
                    v-model="$v.pointUsed.$model"
                  >
                  <span class="icon">P</span>
                </div>

              </div>
              <div
                v-if="$v.pointUsed.$error "
                class="point-item point-error"
              >
                <p v-if="!$v.pointUsed.numeric ">
                  {{ $t('payment_v4.error_point.input_number') }}
                </p>
                <p v-else-if="!$v.pointUsed.minValue ">
                  {{ $t('payment_v4.error_point.minimum') }} 50.000 P
                </p>
                <p v-else-if="!$v.pointUsed.maxValue ">
                  {{ $t('payment_v4.error_point.maximum') }} {{ maxPointUser }} P
                </p>
              </div>
            </div>
            <div class="point-additional__body--redeem-button">
              <div class="point-checkbox ">
                <label class="container"> {{$t('payment_v4.step_2.use_all')}}
                  <input
                    :disabled="pointReward.totalPoint < 50000 "
                    v-model="checkPoint"
                    type="checkbox"
                    @click="onAllPoint()"
                  >
                  <span
                    :class="{disabled:pointReward.totalPoint < 50000} "
                    class="checkmark"
                  ></span>
                </label>
              </div>
              <template v-if="!checkPoint">
                <button
                  v-if="isPoint"
                  :disabled="pointUsed <50000 || $v.pointUsed.$error"
                  class="redeem-button"
                  @click=" onRedeemPoint()"
                >{{$t('payment_v4.step_2.redeem_point')}}</button>
                <button
                  v-else
                  @click=" onRedeemPoint()"
                  class="redeem-cancel"
                >{{$t('payment_v4.step_2.cancel')}} <i class="fa fa-times icon-error" /></button>
              </template>

            </div>
          </div>

        </div>
        <!-- end point -->
        <hr />
      </template>

    </div>
    <div class="payment-v4-step2__information">
      <div class="payment-v4-step2__information--group-content">
        <p class="content-key">
          {{ $t("payment_v4.step_1.booking_type") }}
        </p>
        <p
          class="content-value"
          v-if="language == 'en'"
        >
          {{
              paymentInfo.type == 1
                ? "Hourly"
                : paymentInfo.type == 2
                ? "Overnight"
                : "Daily"
            }}
        </p>
        <p
          class="content-value"
          v-if="language == 'vi'"
        >
          {{
              paymentInfo.type == 1
                ? "Theo Giờ"
                : paymentInfo.type == 2
                ? "Qua đêm"
                : "Theo Ngày"
            }}
        </p>

      </div>
      <div class="payment-v4-step2__information--group-content">
        <p class="content-key">
          {{ $t("payment_v4.step_1.hotel_name") }}
        </p>
        <p class="content-value">
          {{paymentInfo.hotelName}}
        </p>

      </div>
      <div class="payment-v4-step2__information--group-content">
        <p class="content-key">
          {{ $t("payment_v4.step_1.room_type") }}
        </p>
        <p class="content-value">
          {{paymentInfo.roomName}}
        </p>
      </div>
      <div
        v-if="paymentInfo && paymentInfo.origin == 2"
        class="payment-v4-step2__information--group-content"
      >
        <p class="content-key">
          {{ $t("payment_v4.step_2.num_of_room") }}
        </p>
        <p class="content-value">
          x1
        </p>
      </div>
      <hr>
      <div class="payment-v4-step2__information--group-content">
        <p class="content-key">
          {{ $t("payment_v4.step_1.hotel_fee") }}
        </p>
        <p class="content-value">
          {{formatPriceVND(bookingInfo.hotelFee) }}
        </p>
      </div>
      <template v-if="paymentInfo.origin == 1">
        <div class="payment-v4-step2__information--group-content">
          <p class="content-key">
            {{ $t("payment_v4.step_1.high_demand") }}
          </p>
          <p class="content-value">
            <span v-if="bookingInfo.highDemand !=0">+</span>
            {{formatPriceVND(bookingInfo.highDemand) }}
          </p>
        </div>
        <div class="payment-v4-step2__information--group-content">
          <p class="content-key">
            {{ $t("payment_v4.step_1.discount") }}
          </p>
          <p class="content-value">
            <span v-if="bookingInfo.discount !=0">-</span> {{formatPriceVND(bookingInfo.discount) }}

          </p>
        </div>
        <div class="payment-v4-step2__information--group-content">
          <p class="content-key">
            {{ $t("payment_v4.step_1.stamp_redeem") }}
          </p>
          <p class="content-value">
            <span v-if="bookingInfo.stampRedeem != 0">-</span> {{formatPriceVND(bookingInfo.stampRedeem) }}
          </p>
        </div>
        <div class="payment-v4-step2__information--group-content">
          <p class="content-key">
            {{ $t("payment_v4.step_1.point_redeem") }}
          </p>
          <p class="content-value">
            <span v-if="bookingInfo.pointRedeem !=0">-</span>
            {{formatPriceVND(bookingInfo.pointRedeem) }}
            <!-- <span v-if="pointUsed !=0">-</span> -->
            <!-- {{checkPoint?formatPriceVND(pointUsed):formatPriceVND(0)}} -->
          </p>
        </div>
      </template>

      <template v-if="paymentInfo.origin == 2">
        <div class="payment-v4-step2__information--group-content">
          <p class="content-key">
            {{ $t("payment_v4.step_2.tax") }}
          </p>
          <p class="content-value">
            <span v-if="bookingInfo.tax!=0">+</span>
            {{formatPriceVND(bookingInfo.tax) }}
          </p>
        </div>
        <div class="payment-v4-step2__information--group-content">
          <p class="content-key">
            {{ $t("payment_v4.step_2.fee") }}
          </p>
          <p class="content-value">
            <span v-if="bookingInfo.fee!=0">+</span>
            {{formatPriceVND(bookingInfo.fee) }}
          </p>
        </div>
        <div class="payment-v4-step2__information--group-content">
          <p class="content-key">
            {{ $t("payment_v4.step_1.discount") }}
          </p>
          <p class="content-value">
            <span v-if="bookingInfo.discount!=0">-</span>
            {{formatPriceVND(bookingInfo.discount) }}
          </p>
        </div>
      </template>
      <hr>
    </div> <!-- information -->

    <div class="payment-v4-step2__method">
      <div class="payment-method">
        <div class="payment-method__header">
          <h3 class="payment-method__header--label">{{$t('payment_v4.step_2.payment_method')}}</h3>
        </div>
        <div class="payment-method__body">
          <div
            class="payment-method__body--select-method"
            @click="openModalPaymentMethod()"
          >
            <span
              v-if="!paymentMethod"
              class="hight-light"
            >
              {{$t('payment_v4.step_2.tap_to_choose')}}
            </span>
            <div
              class="container-selected-method"
              v-else
            >
              <!-- :src="`${IMAGE_URL}/icon/payment/${paymentMethod.imgUrl}.svg`" -->
              <img
                :src="paymentMethod.imgUrl"
                alt='payment-method'
              ></img>
              <span class="container-selected-method__name">{{paymentMethod.name}}</span>
            </div>
            <span>
              <i class="fas fa-chevron-right"></i>
            </span>
          </div>
        </div>
      </div>
      <div class="payment-total">
        <p class="payment-total__label">
          {{ $t("payment_v4.step_2.total") }}
        </p>
        <p class="payment-total__value">
          <!-- {{formatPriceVND(bookingInfo.totalAmount)}} -->
          {{formatPriceVND(bookingInfo.amountFromUser)}}
        </p>
      </div>
      <hr>
    </div><!-- payment method -->

    <div class="payment-v4-step2__cancel-policy">
      <div
        class="cancel-policy"
        v-if="paymentInfo.origin == 1"
      >
        <div class="cancel-policy__label">
          {{ $t("payment_v4.cancellation_policy") }}
        </div>
        <div class="cancel-policy__content">
          <p class="cancel-policy__content--title">
            {{ $t("payment_v4.cancellation") }}
          </p>
          <div class="cancel-policy__content--description">
            <p>{{ $t("payment_v4.note_hotel") }}</p>
            <p>{{ $t("payment_v4.step_2.can_not_cancel_flash_sale") }}</p>
          </div>
        </div>
        <div class="cancel-policy__content">
          <p class="cancel-policy__content--title">
            {{ $t("payment_v4.special_products") }}
          </p>
          <div class="cancel-policy__content--description ">
            <p>{{ $t("payment_v4.note_special") }}</p>
            <p class="mt-line">
              {{ $t("payment_v4.comment1") }}
              <router-link
                tag="u"
                class="high-light"
                :to="{ name: 'term-condition-page' }"
              >
                {{ $t("payment_v4.cancellation_policy") }}
              </router-link>
              {{  $t("payment_v4.comment2") }}
            </p>
          </div>
        </div>

      </div>
      <div
        class="cancel-policy"
        v-if="paymentInfo.origin == 2"
      >
        <div class="cancel-policy__label">
          {{ $t("payment_v4.cancellation_policy") }}
        </div>
        <div
          v-if="bookingInfo.cancelDescription"
          class="cancel-policy__content mt-line"
        >
          <!-- <p class="cancel-policy__content--title">
            {{ $t("payment_v4.hotel") }}
          </p> -->
          <div class="cancel-policy__content--description">
            <p>{{ $t("payment_v4.step_2.free_cancellation_until") }} <span class="font-bold">{{ $t("payment_v4.step_2.util") }} 23:59 {{formatDDMMYYYY(bookingInfo.cancelDescription.freeCancellation)}} </span>
            </p>

            <p>{{ $t("payment_v4.step_2.cancel_with_fee") }} <span class="font-bold">00:00 {{formatDDMMYYYY(bookingInfo.cancelDescription.cancelWithFeeFrom)}} {{ $t("payment_v4.step_2.to") }} 23:59 {{formatDDMMYYYY(bookingInfo.cancelDescription.cancelWithFeeTo)}}</span>
            </p>

            <p>{{ $t("payment_v4.step_2.non_refundable") }} <span class="font-bold">{{ $t("payment_v4.step_2.after") }} 00:00 {{formatDDMMYYYY(bookingInfo.cancelDescription.nonRefundable)}} </span>
            </p>

            <p class="mt-line">
              {{language == 'vi'?bookingInfo.cancelDescription.cancellationPolicy :bookingInfo.cancelDescription.cancellationPolicyEn}}
            </p>

          </div>
          <div class="mt-line cancel-policy__content--description">
            <!-- <p>{{ $t("payment_v4.note_special") }}</p> -->
            <p>
              {{ $t("payment_v4.comment1") }}
              <router-link
                tag="u"
                class="high-light"
                :to="{ name: 'term-condition-page' }"
              >
                {{ $t("payment_v4.terms_of_use") }}
              </router-link>
              {{  $t("payment_v4.comment2") }}
            </p>
          </div>
        </div>

        <div v-if="paymentInfo.origin == 2">
          <g2j-image :url-img="`${IMAGE_URL}/svg/agoda.svg`"></g2j-image>
        </div>
      </div>
    </div><!-- policy -->

    <div class="payment-v4-step2__next">
      <ButtonNext
        :key="'payment-v4-step2-button-next'"
        :isDisable="!paymentMethod || isPaying || !checkPaymentMethod"
        :title="`${titleButton} `"
        @bookNow="onConfirmBooking() ,onFbqTracking() "
      ></ButtonNext>
    </div>

    <!-- modal -->
    <coupon-modal
      ref="coupon-modal"
      :couponReward.sync="couponReward"
      :paymentInfo="paymentInfo"
      @doneCoupon="onSelectCoupon()"
    ></coupon-modal>
    <payment-method-modal
      ref="payment-method-modal"
      :paymentMethod.sync="paymentMethod"
      :couponReward.sync="couponReward"
      :mode="paymentInfo.mode"
      :method="bookingInfo.paymentWay"
      :promotionPayment="bookingInfo.promotionPayment"
      :bookingInfo="bookingInfo"
      :isAgoda="isAgoda"
      @doneSelectPayment="onSelectPayment()"
    ></payment-method-modal>
    <error-payment-modal
      ref="error-payment-modal"
      :message="messageError"
      @bookOther="onBookOther()"
    ></error-payment-modal>
    <div id="paymentEpay" />

  </div>
</template>

<script>
  import {
    IMAGE_URL,
    CACHE_VERSION,
    ASSETS_SERVICE_URL,
    getToken,
    BASE_URL,
  } from "~jsDefinePath/general";
  import {
    mapGetters,
    mapState,
    mapActions,
    numeric,
    minValue,
    maxValue,
  } from "~jsPath/lib/lib-manager";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsPath/base/vuex/modules/page-info-module";
  import { getPaymentPagePath } from "~jsHelperPath/util/HandleUrl";
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import {
    getFormattedCurrency,
    getNumberWithCommas,
    formatPriceVND,
  } from "~jsPath/helper/util/formatNumber";
  import { G2JFbqTracking } from "~jsHelperPath/util/HandleTracking";
  import { EVENT_BUS_KEY } from "~jsDefinePath/event-bus";
  Vue.use(vuelidate.default);

  export default {
    props: {
      stepPayment: [String, Number],
      info: [Array, Object],
    },
    components: {
      ButtonNext: () =>
        import("~jsPartialPath/global/component/book-now/BookNow.vue"),
      "coupon-modal": () => import("./modal/CouponModal.vue"),
      "payment-method-modal": () => import("./modal/PaymentMethodModal.vue"),
      "error-payment-modal": () => import("./modal/ErrorModal.vue"),
    },
    data() {
      return {
        IMAGE_URL,
        BASE_URL,
        // titleButton: this.$t("payment_v4.step_2.confirm_booking"),
        isLogin: true,
        isRedeem: true,
        isPoint: true,
        pointUsed: 0,
        pointPayment: "",
        isHasMethod: false,
        checkPoint: false,
        paymentMethod: null,
        rewardForNewBooking: [],
        pointReward: {},
        stampReward: {},
        couponReward: {},
        paymentInfo: { ...this.info },
        bookingInfo: {},
        messageError: "",
        bookingNo: "",
        isPaying: false,
        isAgoda: false,
      };
    },
    validations() {
      return {
        pointUsed: {
          numeric,
          minValue: minValue(50000),
          maxValue: maxValue(this.maxPointUser),
        },
      };
    },
    async created() {
      // sessionStorage.setItem("payment-info", JSON.stringify(this.paymentInfo)); //test data
      // NOTE - Setup meta tag
      this.$metaTag.setup({
        title: "Tiến hành thanh toán",
        description: "Tiến hành thanh toán đặt phòng",
        "og:type": "website",
        "og:title": "Tiến hành thanh toán",
        "og:description": "Tiến hành thanh toán đặt phòng",
        "og:url": BASE_URL + window.location.pathname,
        "og:site_name": "Go2Joy",
        "og:image": "",
        "og:image:width": "1200",
        "og:image:height": "628",
      });

      await this.handleUrl();
      EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
    },
    methods: {
      isEmpty: _.isEmpty,
      formatPriceVND,
      getFormattedCurrency,
      getNumberWithCommas,
      onFbqTracking() {
        G2JFbqTracking("Purchase", {
          content_type: "hotel",
          content_ids: this.paymentInfo.hotelSn,
          checkin_date: this.paymentInfo.checkInDatePlan,
          checkout_date: this.paymentInfo.endDate,
          num_adults: 1,
          num_children: 0,
          value: this.bookingInfo.amountFromUser,
          currency: "VND",
        });
      },
      formatDDMMYYYY(day) {
        let CDate = dayjs(day).locale(this.language).format("DD/MM/YYYY");
        return CDate;
      }, // formatMMM()
      onConfirmBooking() {
        // //coupon
        // if (
        //   !this.isEmpty(this.couponReward) &&
        //   this.couponReward.canUseStatus == 1
        // ) {
        //   this.paymentInfo.couponIssuedSn = this.couponReward.sn;
        // }

        // //point
        // this.paymentInfo.mileagePoint = !this.isPoint ? this.pointUsed : 0;
        // //stamp
        // this.paymentInfo.redeemValue = !this.isRedeem
        //   ? this.stampReward.redeemValue
        //   : 0;
        this.isPaying = true;
        //call api
        this.handlePayment(this.paymentMethod.typePayment);
        sessionStorage.setItem(
          "paymentMethod",
          JSON.stringify(this.paymentMethod)
        );
      },
      nextStep() {
        this.$emit("nextStep");
      },
      onSelectCoupon() {
        if (this.couponReward && this.couponReward.canUseStatus == 1) {
          this.paymentInfo.couponIssuedSn = this.couponReward.sn;
        }
        if (this.isEmpty(this.couponReward)) {
          this.paymentInfo.couponIssuedSn = null;
        }
        this.onCalculate();
      },
      async onSelectPayment() {
        await this.onCalculate();
        let payOnl = [0, 1, 2, 3, 5];
        let checkPay = payOnl.includes(this.paymentMethod.id);

        if (
          this.bookingInfo.amountFromUser <
            this.bookingInfo.minMoneyPayment.payInAdvance &&
          checkPay
        ) {
          alert(this.$t("payment_v4.step_2.note_pay_advance"));
          this.paymentMethod = null;
          this.onCalculate();
        }
        sessionStorage.setItem(
          "paymentProvider",
          this.paymentMethod.paymentProvider
        );
      },
      handlePayment(typePayment) {
        //Chọn cổng thanh toán rồi tiến hành thanh toán
        // let obj = { ...this.dataBooking, paymentMethod: this.paymentMethod };

        let obj = { ...this.paymentInfo, paymentMethod: typePayment };

        // this.isDisableBooking = true;
        if (typePayment == 0) {
          //payment at hotel
          this.paymentAtHotel(obj);
          return;
        }
        if (typePayment == 3) {
          //payment MoMo
          this.paymentMoMo(obj);
          return;
        }
        if (typePayment == 41 || typePayment == 42) {
          //payment by card
          this.paymentByCard(obj);
          return;
        }
        if (typePayment == 20) {
          //payment payzoo
          this.paymentPayzoo(obj);
          return;
        }
        if (typePayment == 60) {
          //payment zalopay
          this.paymentZaloPay(obj);
          return;
        }
      },

      openModalPaymentMethod() {
        this.$refs["payment-method-modal"].openModal();
      },
      async getRewardForNewBooking() {
        // EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
          is_show: true,
          namespace: this.$route.name,
        });
        try {
          let res = await apiCaller({
            metaUrl: AJAX_URL.payment_v4.getRewardForNewBooking,
            dataType: "json",
            data: this.paymentInfo,
            method: "POST",
            headers: {
              Authorization: getToken(),
            },
          });
          this.rewardForNewBooking = res.data;
          this.couponReward = res.data?.coupon;
          this.stampReward = res.data?.stamp;
          this.pointReward = res.data?.point;

          this.paymentInfo.couponIssuedSn = this.couponReward
            ? this.couponReward.sn
            : null;

          // this.pointReward.totalPoint = 150000; //test data
        } catch (error) {
          console.log("error :>> ", error);
          // setTimeout(() => {
          //   EventBus.emit("REDIRECT-404-PAGE");
          // }, 3500);
        } finally {
          // EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
            is_show: true,
            namespace: this.$route.name,
          });
        }
      },
      getTitleCoupon(coupon) {
        if (this.isEmpty(coupon)) return;
        let type = coupon.discountType;
        let price = coupon.discount ? coupon.discount : 0;
        let hour = coupon.useCondition.numHours;
        let day = coupon.useCondition.numDays;
        let result;
        switch (type) {
          case 1:
            return (
              this.$t("payment_v4.step_2.discount_coupon") +
              " " +
              this.formatPriceVND(price)
            );
            break;
          case 2:
            return (
              this.$t("payment_v4.step_2.discount_coupon") + " " + price + " %"
            );
            break;
          case 3:
            return this.$t("payment_v4.step_2.hotel_gift");
            break;
          case 4:
            return (
              this.$t("payment_v4.step_2.free") +
              ` <span class="high-light">${coupon.bonusHour} ${this.$t(
                "payment_v4.step_2.hours"
              )}</span>`
            );
            break;
          case 5:
            if (coupon.useCondition.hourly) {
              result =
                this.$t("payment_v4.step_2.same_price") +
                `<span class="high-light"> ${this.formatPriceVND(price)}/ ${
                  coupon.useCondition.numHours
                } ${this.$t("payment_v4.step_2.hours")}</span>`;
              return result;
            } else if (coupon.useCondition.daily) {
              result =
                this.$t("payment_v4.step_2.same_price") +
                `<span class="high-light"> ${this.formatPriceVND(price)}/ ${
                  coupon.useCondition.numDays
                } ${this.$t("payment_v4.step_2.days")}</span>`;
              return result;
            } else {
              // return this.$t("payment_v4.step_2.overnights");
              return `${this.$t(
                "payment_v4.step_2.same_price"
              )} ${this.formatPriceVND(price)}/ ${this.$t(
                "payment_v4.step_2.overnights"
              )}`;
            }
            break;

          default:
            break;
        }
        return coupon.discount;
      },
      getTitleStamp(stamp) {
        if (this.isEmpty(stamp)) return;
        let type = stamp.redeemType;
        let value = stamp.redeemValue;
        switch (type) {
          case 1:
            return (
              this.$t("payment_v4.step_2.discount_coupon") +
              " " +
              ` <span class="high-light">${this.formatPriceVND(value)} </span>`
            );
            break;
          case 2:
            return (
              this.$t("payment_v4.step_2.discount_coupon") +
              ` <span class="high-light">${value}% </span>`
            );
            break;
          case 3:
            return this.$t("payment_v4.step_2.hotel_gift");
            break;

          default:
            return this.$t("payment_v4.step_2.discount_coupon");
            break;
        }
        return;
      },
      openModalCoupon() {
        this.$refs["coupon-modal"].openModal();
      },
      onRedeemStamp() {
        this.isRedeem = !this.isRedeem;
        //coi có cần check đăng nhập hay k?
        this.paymentInfo.redeemValue = !this.isRedeem
          ? this.stampReward.redeemValue
          : 0;
        this.onCalculate();
      },
      onRedeemPoint() {
        if (!this.pointUsed) return;
        this.isPoint = !this.isPoint;
        this.paymentInfo.mileagePoint = !this.isPoint ? this.pointUsed : 0;
        this.onCalculate();
      },
      onAllPoint() {
        this.isPoint = this.checkPoint;
        //đã đăng nhập và có điểm thưởng
        this.pointUsed =
          this.hasUserInfo && this.pointReward && this.pointReward.totalPoint
            ? this.pointReward.totalPoint
            : 0;
        this.paymentInfo.mileagePoint = !this.isPoint ? this.pointUsed : 0;

        this.onCalculate();
      },
      async onCalculate() {
        let obj = { ...this.paymentInfo };
        obj.paymentMethod = this.paymentMethod
          ? this.paymentMethod.typePayment
          : null;
        // EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        this.isPaying = true;
        EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
          is_show: true,
          namespace: this.$route.name,
        });
        try {
          let res = await apiCaller({
            metaUrl: AJAX_URL.payment_v4.calculateBookingAmount,
            dataType: "json",
            method: "POST",
            contentType: "application/json; charset=utf-8",
            data: obj,
            headers: {
              Authorization: getToken(),
            },
          });
          this.bookingInfo = res.data;
          this.isPaying = false;
        } catch (error) {
          console.log("error :>> ", error);
        } finally {
          // EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, {
            is_show: false,
            namespace: this.$route.name,
          });
        }
      },
      onDocumentReady(fn) {
        // see if DOM is already available
        if (
          document.readyState === "complete" ||
          document.readyState === "interactive"
        ) {
          // call on next available tick
          setTimeout(fn, 1);
        } else {
          document.addEventListener("DOMContentLoaded", fn);
        }
      }, // onDocumentReady()
      setApiCreateNewBooking(obj, url) {
        const result = apiCaller({
          // metaUrl: AJAX_URL.paymentDetail.payment,
          metaUrl: AJAX_URL.payment_v4.payment,
          dataType: "json",
          method: "POST",
          contentType: "application/json; charset=utf-8",
          headers: {
            Authorization: getToken(),
          },
          data: JSON.stringify(obj),
        });
        return result;
      },
      async paymentByCard(obj) {
        EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        await this.setApiCreateNewBooking(obj)
          .then((res) => {
            console.log("atm");
            this.setUserBookingSn(res.data.sn);
            let html = res.data.mapInfo.ePayInfoForm.html;
            let domain = res.data.mapInfo.ePayInfoForm.domain;
            document.getElementById("paymentEpay").innerHTML = html;
            // $(document).ready(function () {
            //   console.log('run');
            //   openPayment(1, domain);
            // });
            this.onDocumentReady(function () {
              openPayment(1, domain);
            });
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          })
          .then(() => {
            this.isPaying = false;
          })
          .catch((err) => {
            this.handleErrorPayment(err);

            // this.status = false;
            // console.log("err :>> ", err);
            // // this.messageError = err.responseJSON?.error || null;
            // this.messageError = error.response.data?.error || "null";

            // this.showStatusModal();
            setTimeout(() => {
              // EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
            }, 3000);
          });
      },
      async paymentMoMo(obj) {
        await EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        await this.setApiCreateNewBooking(obj)
          .then((res) => {
            console.log("momo");
            // window.open(res.data.payUrl)
            this.setUserBookingSn(res.data.sn);
            // location.replace(res.data.paymentInfoForm.redirectUrl);
            location.replace(res.data.mapInfo.momoInfoForm.redirectUrl);
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          })
          .catch((err) => {
            this.isPaying = false;
            this.handleErrorPayment(err);

            setTimeout(() => {
              EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
            }, 3000);
          });
      },
      async paymentZaloPay(obj) {
        await EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        await this.setApiCreateNewBooking(obj)
          .then((res) => {
            console.log("zalo");
            this.setUserBookingSn(res.data.sn);
            location.replace(res.data.mapInfo.zaloPayInfoForm.redirectUrl);
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          })
          .then(() => {})
          .catch((err) => {
            this.isPaying = false;
            this.handleErrorPayment(err);
            setTimeout(() => {
              EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
            }, 3000);
          });
      },
      async paymentAtHotel(obj) {
        //payment at hotel
        await EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        // let url = `${AJAX_URL.paymentDetail.payment}`;
        await this.setApiCreateNewBooking(obj)
          .then((res) => {
            console.log("at hotel");
            this.setUserBookingSn(res.data.sn);
            this.nextStep();
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          })
          .then(() => {
            this.isPaying = false;
          })
          .catch((err) => {
            this.handleErrorPayment(err);
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          });
      },
      async paymentPayzoo(obj) {
        await EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        await this.setApiCreateNewBooking(obj)
          .then((res) => {
            console.log("payzoo");
            this.setUserBookingSn(res.data.sn);
            // this.dataAfterPayment = res.data;
            // this.bookingNo = this.dataAfterPayment.paymentInfoForm?.bookingNo;
            let info = res.data.mapInfo.payooInfoForm;
            this.$emit("setInfoPayoo", info);
            // this.$router.push({
            //   name: "payoo-page",
            //   query: {
            //     bookingNo: this.bookingNo,
            //     paymentExpireDate: res.data.paymentInfoForm.paymentExpireDate,
            //   },
            // });

            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          })
          .then(() => {
            this.isPaying = false;
          })
          .catch((err) => {
            this.status = false;
            this.handleErrorPayment(err);
          });
      },
      setUserBookingSn(sn) {
        sessionStorage.setItem("userBookingSn", sn);
      },
      async handleUrl() {
        if (!this.isEmpty(this.$route.query)) {
          let {
            errorCode,
            orderId,
            resultCd,
            localMessage,
            message,
            invoiceNo,
            resultMsg,
            resultCode,
            status,
          } = this.$route.query;
          // status - zalopay
          //resultCode - momo

          this.bookingNo = orderId ? orderId : invoiceNo;
          // sessionStorage.setItem("userBookingSn", this.bookingNo);

          if (
            errorCode == 0 ||
            resultCd == "00_000" ||
            resultCode == 0 ||
            status == 1
          ) {
            //Cái này lấy từ query khi bên thứ 3 trả về và trạng thái là thành công
            // call api check 2
            let userBookingSn = sessionStorage.getItem("userBookingSn");
            let paymentProvider = sessionStorage.getItem("paymentProvider");
            if (paymentProvider == 6 || paymentProvider == 3) {
              await this.getPaymentResult(userBookingSn);
              this.nextStep();
              return;
            }
            // this.status = true;
            // this.showStatusModal();

            let paymentMethod = JSON.parse(
              sessionStorage.getItem("paymentMethod")
            );

            this.nextStep();
          } else {
            //Cái này bên thứ 3 trả về query và fail
            // this.status = false;
            // this.messageError = this.language == "vi" ? localMessage : message;
            // this.messageError = !this.messageError
            //   ? resultMsg
            //   : this.messageError;

            // this.$refs["error-payment-modal"].openModal();\
            let err = this.language == "vi" ? localMessage : message;
            err = !err ? resultMsg : err;
            // this.messageError = [{ message: err }];

            this.messageError = [];
            setTimeout(() => {
              this.$refs["error-payment-modal"].openModal();
            }, 300);

            // this.showStatusModal();
          }
        } else {
          //chỗ này check xem đi từ trang chủ hay từ promotion => lấy id vào cho đúng nữa
          // hiện tại chưa xử lý

          this.isAgoda = this.paymentInfo.origin == 2 ? true : false;
          if (!this.isAgoda) {
            await this.getRewardForNewBooking();
          }
          this.onCalculate();
        }
      },
      handleErrorPayment(err) {
        this.messageError = err.response.data?.error || [];
        // EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
        this.$refs["error-payment-modal"].openModal();
      },
      onBookOther() {
        this.$refs["error-payment-modal"].closeModal();
        // this.$router.push("/"); //push di dau thi sau nay biet
        this.$router.push({
          name: "hotel-detail-page",
          query: { hotelSn: this.paymentInfo.hotelSn },
        });
      },
      async getPaymentResult(sn) {
        // Func này để recheck sau khi thành công, hiện tịa chỉ zalo, momo
        //Lưu ý: paymentProvider khác với paymentMehtod
        // EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        try {
          let paymentProvider = sessionStorage.getItem("paymentProvider");
          let res = await apiCaller({
            metaUrl: AJAX_URL.paymentDetail.paymentResult,
            method: "POST",
            data: {
              platform: 2,
              paymentProvider: paymentProvider,
              userBookingSn: sn,
            },
            headers: {
              Authorization: getToken(),
            },
            dataType: "json",
          });
          // this.bookingNo = this.bookingNo || res.data.bookingNo;
          // this.status = true;
          // this.showStatusModal();
        } catch (error) {
          console.log("error :>> ", error);
          setTimeout(() => {
            this.$refs["error-payment-modal"].openModal();
          }, 300);
        } finally {
          // EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
        }
      },
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),
      ...mapGetters(PAGE_INFO_MODULE_NAME, {
        hasUserInfo: "hasUserInfo",
      }),
      maxPointUser() {
        return this.pointReward?.totalPoint || 100000;
      },
      titleButton() {
        let price =
          this.bookingInfo && this.bookingInfo.amountFromUser
            ? `<span> &#8226  ${this.formatPriceVND(
                this.bookingInfo.amountFromUser
              )}</span>`
            : "";
        return this.$t("payment_v4.step_2.confirm_booking") + price;
      },
      checkPaymentMethod() {
        if (this.isEmpty(this.paymentMethod)) return;

        if (this.paymentMethod.id == 4 && this.paymentMethod.typePayment == 0) {
          // thanh toán tại khách sạn
          if (
            this.bookingInfo.amountFromUser <
            this.bookingInfo.minMoneyPayment.payAtHotel
          ) {
            alert(this.$t("payment_v4.step_2.note_pay_advance"));
          }
          return (
            this.bookingInfo.amountFromUser >=
            this.bookingInfo.minMoneyPayment.payAtHotel
          );
        }
        if (this.paymentMethod.id != 4) {
          //thanh toán onl và payoo
          if (
            this.bookingInfo.amountFromUser <
            this.bookingInfo.minMoneyPayment.payInAdvance
          ) {
            alert(this.$t("payment_v4.step_2.note_pay_advance"));
            this.paymentMethod = null;
          }

          return (
            this.bookingInfo.amountFromUser >=
            this.bookingInfo.minMoneyPayment.payInAdvance
          );
        }
      },
    },
  };
</script>

<style>
</style>
