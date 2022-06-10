<template>
  <div class="payment-detail">
    <div class="container">
      <div class="payment-detail__head">
        <div class="payment-detail__head--back-button">
          <!-- <back-button /> -->
        </div>
        <div class="payment-detail__head--title">
          {{ $t("payment-detail.title") }}
        </div>
      </div>
      <div
        v-if="dataBooking"
        class="payment-detail__body"
      >
        <div>
          <p class="payment-detail-title">
            {{ dataBooking.hotelName }}
          </p>
        </div>
        <div class="payment-detail__body--group-content">
          <p class="content-key">
            {{ $t("payment-detail.mobile") }}
          </p>
          <p class="content-value">
            {{ dataBooking.mobile || phoneUser }}
          </p>
        </div>
        <div class="line" />
        <div class="payment-detail__body--group-content">
          <p class="content-key">
            {{ $t("payment-detail.hotel_fee") }}
          </p>
          <p class="content-value">
            {{ $formatPrice(dataBooking.hotelFee) }}
          </p>
        </div>
        <div class="payment-detail__body--group-content">
          <p class="content-key">
            {{ $t("payment-detail.special_product_fee") }}
          </p>
          <p class="content-value">
            {{ $formatPrice(dataBooking.specialProductFee) }}
          </p>
        </div>
        <div class="payment-detail__body--group-content">
          <p class="content-key">
            {{ $t("payment-detail.high_demand") }}
          </p>
          <p class="content-value">
            {{ $formatPrice(dataBooking.highDemand) }}
          </p>
        </div>
        <!-- <div class="payment-detail__body--group-content">
          <p class="content-key">
            {{ $t('payment-detail.coupon_redeem') }}
          </p>
          <p class="content-value">
           Null
          </p>
        </div> -->

        <div class="payment-detail__body--group-content">
          <p class="content-key">
            {{ $t("payment-detail.stamp_redeem") }}
          </p>
          <p class="content-value">
            {{ $formatPrice(dataBooking.stamp) }}
          </p>
        </div>
        <div class="payment-detail__body--group-content">
          <p class="content-key">
            {{ $t("payment-detail.point_redeem") }}
          </p>
          <p class="content-value">
            {{ $formatPrice(dataBooking.point) }}
          </p>
        </div>
        <!-- <div class="line" /> -->

        <div class="payment-detail__body--group-content">
          <p class="content-key">
            {{ $t("payment-detail.discount") }}
          </p>
          <p class="content-value">
            {{ $formatPrice(dataBooking.totalDiscount) }}
          </p>
        </div>
        <div class="line" />
        <div class="payment-detail__body--group-content total">
          <p class="content-key">
            {{ $t("payment-detail.total") }}
          </p>
          <p class="content-value">
            {{ $formatPrice(dataBooking.amountFromUser) }}
            <!-- <span>₫</span> -->
          </p>
        </div>
        <div class="line" />
        <div class="payment-detail__body--group-content">
          <p class="content-key">
            {{ $t("payment-detail.payment_way") }}
          </p>
          <p class="content-value">
            <!-- {{ listPaymentType[activeType].name }} -->
            {{ namePaymentMethod }}
          </p>
        </div>
        <!-- payment method -->
        <div>
          <template v-for="(item, index) in listPaymentType">
            <!-- v-if="checkRolePayment(item)" -->
            <div
              :key="index"
              class="payment-detail__body--group-content payment"
              @click="changePaymentMethod(item, index)"
            >
              <p class="content-key">
                <img
                  class="logo-payment"
                  :src="item.imgUrl"
                >{{ item.name }}
              </p>
              <!-- <p
                v-show="activeType==index"
                class="content-value success"
              >
                <i class="fas fa-check" />
              </p> -->
              <div
                class="content-value check-box"
                :class="{ active: activeType == item.id }"
              />
            </div>
            <div
              v-if="activeType == 4 && item.id == 4"
              class="payment-detail__body--group-content"
            >
              <div class="content-key attention">
                <div class="content-key-attention__img">
                  <img
                    :src="IMAGE_URL + `/icon/payment/attention.png`"
                    alt=""
                  >
                </div>
                <div>
                  <span>{{ $t("payment-detail.attention") }} </span>
                  <br>
                  <span>{{ $t("payment-detail.note_attention") }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>
        <!-- end payment method -->

        <!-- <div
          class="payment-detail__body--group-content"
          v-if="activeType == 4"
        >
          <div class="content-key attention">
            <div class="content-key-attention__img">
              <img
                :src="IMAGE_URL + `/icon/payment/attention.png`"
                alt=""
              >
            </div>
            <div>
              <span>{{ $t('payment-detail.attention') }} </span>
              <br>
              <span>{{ $t('payment-detail.note_attention') }}</span>
            </div>
          </div>
        </div> -->

        <div class="line" />
        <div class="payment-detail__body--group-content">
          <div class="content-key title-content">
            <p>{{ $t("payment-detail.cancellation_policy") }}</p>
          </div>
        </div>
        <div class="payment-detail__body--group-content">
          <div class="content-key title-sub-content">
            <p>{{ $t("payment-detail.hotel") }}</p>
            <p class="content-sub">
              {{ $t("payment-detail.note_hotel") }}
            </p>
          </div>
        </div>
        <div class="payment-detail__body--group-content">
          <div class="content-key title-sub-content">
            <p>{{ $t("payment-detail.special_products") }}</p>
            <p class="content-sub">
              {{ $t("payment-detail.note_special") }}
            </p>
            <p class="content-sub">
              {{ $t("payment-detail.comment1") }}
              <router-link
                tag="u"
                :to="{ name: 'term-condition-page' }"
              >
                {{ $t("payment-detail.terms_of_use") }}
              </router-link>
              {{ $t("payment-detail.comment2") }}
            </p>
          </div>
        </div>
        <button
          class="payment-detail__body--button-confirm g2j-button-book-now"
          :disabled="isDisableBooking"
          @click="handlePayment()"
        >
          <p>
            {{ $t("payment-detail.pay_now") }}
          </p>
          <!-- · {{ $formatPrice(dataBooking.amountFromUser) }} -->
        </button>
      </div>
    </div>
    <div>
      <status-modal
        v-if="!isEmpty(dataBooking)"
        ref="status-modal"
        :is-success.sync="status"
        :message-error="messageError"
        :data-booking="dataBooking"
        @goDetail="goDetail"
        @bookOtherRoom="bookOtherRoom"
        @beforeClose="beforeCloseStatus()"
      />
    </div>
    <div id="paymentEpay" />
  </div>
</template>

<script>
  import { IMAGE_URL, getToken, HAS_MOITAI } from "~jsDefinePath/general";

  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import StatusModal from "./component/ModalStatus.vue";
  import { MODULE_NAME as PAYMENT_INFO_MODULE_NAME } from "~jsPath/base/vuex/modules/payment-info-module";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/page-info-module";
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import { mapGetters, _ } from "~jsPath/lib/lib-manager";

  export default {
    components: {
      // 'status-modal': () => import('./component/ModalStatus.vue'),
      "status-modal": StatusModal,
    },

    data() {
      return {
        IMAGE_URL,
        activeType: 4,
        dataBooking: null,
        paymentMethod: null,
        status: true,
        dataAfterPayment: null,
        htmlCard: null,
        showCard: false,
        messageError: null,
        bookingNo: null,
        isDisableBooking: false,
      };
    },
    computed: {
      listPaymentType() {
        let arr = [
          {
            id: 4,
            name: this.$t("payment-detail.pay_at_hotel"),
            imgUrl: IMAGE_URL + `/icon/payment/hotelpay.svg`,
            typePayment: 0,
            paymentProvider: 0,
          },
          {
            id: 3,
            name: "ATM Card",
            imgUrl: IMAGE_URL + `/icon/payment/epay.svg`,
            typePayment: 42,
            paymentProvider: 42,
          },
          {
            id: 2,
            name: "Credit/Debit Card",
            imgUrl: IMAGE_URL + `/icon/payment/epay.svg`,
            typePayment: 41,
            paymentProvider: 41,
          },
          {
            id: 1,
            name: "Pay@Store – Payoo",
            imgUrl: IMAGE_URL + `/icon/payment/payoo.svg`,
            typePayment: 20,
            paymentProvider: 20,
          },
          {
            id: 0,
            name: "MoMo",
            imgUrl: IMAGE_URL + `/icon/payment/momo.svg`,
            typePayment: 3,
            paymentProvider: 3,
          },

          {
            id: 5,
            name: "ZaloPay",
            imgUrl: IMAGE_URL + `/icon/payment/zalopay.svg`,
            typePayment: 60,
            paymentProvider: 6,
          },
        ];
        if (!HAS_MOITAI || this.dataBooking.amountFromUser < 10000) {
          //HAS_MOITAI là cờ check xem đã đăng kí bộ công thương
          // Nếu booking dưới 10,000 thì chỉ đc thanh toán  tại khách sạn
          this.activeType = 4;
          return arr.filter((el) => el.id == 4);
        }
        let check = this.dataBooking.paymentMethod;

        //pay at room flash-sale
        if (this.dataBooking.mode == 2) {
          this.activeType = 0;

          let idArr = [0, 2, 3, 5];
          return arr.filter((el) => idArr.includes(el.id));
        }
        if (check == 3) {
          //pay online
          this.activeType = 0;
          let idArr = [0, 1, 2, 3, 5];
          return arr.filter((el) => idArr.includes(el.id));
        }
        if (check == 2) {
          //pay at hotel
          this.activeType = 4;
          return arr.filter((el) => el.id == 4);
        }
        return arr;
      },
      curLanguage() {
        return localStorage["g2j-translate-language"];
      },
      namePaymentMethod() {
        //lấy name khi chọn cổng thanh toán

        let name = this.listPaymentType.find(
          (el) => el.id == this.activeType
        ).name;
        return name ? name : "";
      },
      ...mapGetters(PAYMENT_INFO_MODULE_NAME, {
        paymentInfo: "paymentInfo",
      }),

      ...mapGetters(PAGE_INFO_MODULE_NAME, {
        hasUserInfo: "hasUserInfo",
        nickName: "nickName",
        phoneUser: "phoneUser",
      }),
    },
    watch: {},
    updated() {},
    mounted() {},
    async created() {
      await EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
      await this.initData();
      await this.handleUrl();
    },
    methods: {
      isEmpty: _.isEmpty,
      initData() {
        this.dataBooking = JSON.parse(sessionStorage.getItem("payment-info"));
        if (this.isEmpty(this.dataBooking)) {
          //khi từ đâu tới mà k có data thì về 404
          return EventBus.emit("REDIRECT-404-PAGE");
        }

        // let payAtHotel = this.listPaymentType.find((el) => el.id == 4);
        // //Khi mà k cho thanh toán tại ks, thì mặc định là momo
        // // => 3 la type momo
        // this.paymentMethod = payAtHotel?.typePayment || 3;
        //=> di dang do day de di dau diem

        this.initTypePayment();
      },
      initTypePayment() {
        let check = this.dataBooking.paymentMethod;
        //pay at hotel and other
        this.paymentMethod = 0;

        if (this.dataBooking.mode == 2 || check == 3) {
          //  pay at room flash-sale
          let payOnline = this.listPaymentType.find((el) => el.id == 0); //default momo
          this.paymentMethod =
            payOnline?.typePayment || this.listPaymentType[0].typePayment;
          return;
        }
      },
      handleUrl() {
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
              this.getPaymentResult(userBookingSn);
              return;
            }
            this.status = true;
            this.showStatusModal();
          } else {
            //Cái này bên thứ 3 trả về query và fail
            this.status = false;
            // this.messageError = this.curLanguage == 'vi' ? localMessage : message
            // this.messageError = !this.messageError ? resultMsg : this.messageError
            this.showStatusModal();
          }
        }
      },
      handlePayment() {
        //Chọn cổng thanh toán rồi tiến hành thanh toán
        let obj = { ...this.dataBooking, paymentMethod: this.paymentMethod };
        // this.isDisableBooking = true;
        if (this.paymentMethod == 0) {
          //payment at hotel
          this.paymentAtHotel(obj);
          return;
        }
        if (this.paymentMethod == 3) {
          //payment MoMo
          this.paymentMoMo(obj);
          return;
        }
        if (this.paymentMethod == 41 || this.paymentMethod == 42) {
          //payment by card
          this.paymentByCard(obj);
          return;
        }
        if (this.paymentMethod == 20) {
          //payment payzoo
          this.paymentPayzoo(obj);
          return;
        }
        if (this.paymentMethod == 60) {
          //payment zalopay
          this.paymentZaloPay(obj);
          return;
        }
      },
      async getPaymentResult(sn) {
        // Func này để recheck sau khi thành công, hiện tịa chỉ zalo, momo
        //Lưu ý: paymentProvider khác với paymentMehtod
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
          this.bookingNo = this.bookingNo || res.data.bookingNo;
          this.status = true;
          this.showStatusModal();
        } catch (error) {
          console.log("error :>> ", error);
          this.status = false;
          this.showStatusModal();
        }
      },
      async paymentPayzoo(obj) {
        await EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        let url = `${AJAX_URL.paymentDetail.payment}`;
        await this.setApiCreateNewBooking(obj, url)
          .then((res) => {
            console.log("payzoo");
            this.dataAfterPayment = res.data;
            this.bookingNo = this.dataAfterPayment.paymentInfoForm?.bookingNo;

            this.$router.push({
              name: "payoo-page",
              query: {
                bookingNo: this.bookingNo,
                paymentExpireDate: res.data.paymentInfoForm.paymentExpireDate,
              },
            });

            // this.status = true
            // this.showStatusModal()
            // EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          })
          .catch((err) => {
            this.status = false;
            this.showStatusModal();
            // setTimeout(() => {
            //   EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
            // }, 3000)
          });
      },

      /**
       * NOTE - reference link:
       * https://stackoverflow.com/questions/9899372/pure-javascript-equivalent-of-jquerys-ready-how-to-call-a-function-when-t
       */
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

      async paymentByCard(obj) {
        await EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        let url = `${AJAX_URL.paymentDetail.payment}`;
        await this.setApiCreateNewBooking(obj, url)
          .then((res) => {
            console.log("atm");
            let html = res.data.paymentInfoForm.html;
            let domain = res.data.paymentInfoForm.domain;
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
          .catch((err) => {
            this.status = false;
            console.log("err :>> ", err);
            // this.messageError = err.responseJSON?.error || null;
            this.messageError = error.response.data?.error || "null";

            this.showStatusModal();
            // setTimeout(() => {
            //   EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
            // }, 3000);
          });
      },
      async paymentMoMo(obj) {
        await EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        let url = `${AJAX_URL.paymentDetail.payment}`;
        await this.setApiCreateNewBooking(obj, url)
          .then((res) => {
            console.log("momo");
            // window.open(res.data.payUrl)
            this.setUserBookingSn(res.data.sn);
            location.replace(res.data.paymentInfoForm.redirectUrl);
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          })
          .catch((err) => {
            this.status = false;
            // this.messageError = err.responseJSON?.error;
            this.messageError = error.response.data?.error || "null";

            this.showStatusModal();
            setTimeout(() => {
              EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
            }, 3000);
          });
      },
      async paymentZaloPay(obj) {
        await EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        let url = `${AJAX_URL.paymentDetail.payment}`;
        await this.setApiCreateNewBooking(obj, url)
          .then((res) => {
            console.log("zalo");
            this.setUserBookingSn(res.data.sn);
            location.replace(res.data.paymentInfoForm.redirectUrl);
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          })
          .catch((err) => {
            console.log("err :>> ", err);
            this.status = false;
            // this.messageError = err.responseJSON?.error;
            this.messageError = error.response.data?.error || "null";

            this.showStatusModal();
            setTimeout(() => {
              EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
            }, 3000);
          });
      },
      async paymentAtHotel(obj) {
        //payment at hotel
        await EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        let url = `${AJAX_URL.paymentDetail.payment}`;
        await this.setApiCreateNewBooking(obj, url)
          .then((res) => {
            console.log("at hotel");
            this.dataAfterPayment = res.data;
            this.bookingNo = this.dataAfterPayment.paymentInfoForm?.bookingNo;
            this.status = true;
            this.showStatusModal();
            // EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          })
          .catch((err) => {
            this.status = false;
            this.showStatusModal();
            // EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          });
      },
      setUserBookingSn(sn) {
        sessionStorage.setItem("userBookingSn", sn);
      },
      setApiCreateNewBooking(obj, url) {
        const result = apiCaller({
          metaUrl: AJAX_URL.paymentDetail.payment,
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
      beforeCloseStatus(done) {
        // call ở component luôn r
        // this.$router.push({ name: 'payment', params: { hotelSn: this.dataBooking.hotelSn } })
      },
      bookOtherRoom() {
        this.$router.push("/");
      },
      goDetail() {
        if (this.hasUserInfo) {
          this.$router.push({
            name: "booking-detail-page",
            params: { id: this.bookingNo },
          });
        } else {
          this.$router.push({
            name: "payment-success",
            params: { bookingNo: this.bookingNo },
          });
        }
        // this.$router.push({
        //   name: "payment-success",
        //   params: { bookingNo: this.bookingNo },
        // });
        //  this.$router.push({ name: 'booking-detail-page', params: { id: this.bookingNo } })
      },
      showStatusModal() {
        if (this.$refs["status-modal"]) {
          this.$refs["status-modal"].show();
        }
      },
      changePaymentMethod(item, index) {
        // Note: id & index
        this.activeType = item.id;
        this.paymentMethod = item.typePayment;

        sessionStorage.setItem("paymentProvider", item.paymentProvider);
      },
    },
  };
</script>

<style src="./payment-detail-page-style.css">
</style>
