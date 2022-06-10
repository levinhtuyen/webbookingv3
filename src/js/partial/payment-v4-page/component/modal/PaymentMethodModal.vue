
<template>
  <modal
    ref="payment-method-modal"
    :visible.sync="visible"
    class="payment-method-modal"
  >
    <template slot="header">
      <div class="payment-method-modal__header">
        <h3 class="payment-method-modal__header--title">{{ $t("payment_v4.step_2.select_payment") }} </h3>
      </div>
    </template>
    <template slot="body">
      <div
        v-if="!isEmpty(bookingInfo)"
        class="payment-method-modal__body"
      >
        <template v-for="(item, index) in listPaymentType">
          <div
            v-if=" item.id == 1"
            class="payment-method-modal__body--group-content"
          >
            <div class="content-key">
              <p class="pay-at-store">{{$t('payment_v4.step_2.pay_at_store')}}</p>
            </div>
          </div>
          <div
            v-if=" index ==1"
            class="payment-method-modal__body--group-content"
          >
            <div class="content-key">
              <p class="pay-at-store">{{$t('payment_v4.step_2.pay_in_advance')}}
              </p>
            </div>
          </div>
          <div
            :key="item.id+index"
            class="payment-method-modal__body--group-content payment"
            @click="changePaymentMethod(item, index)"
            :class="[{ active:paymentMethodComponent && paymentMethodComponent.id == item.id },{ disable: onCheckDisable(item.id) || onCheckAgoda(item.id) || onCHeckFlashSale(item.id)}]"
          >
            <div class="content-key">
              <img
                class="logo-payment"
                :src="item.imgUrl"
              >
              <div class="container-content">
                <p class="container-content__title"> {{ item.name }} </p>
                <p class="container-content__discount">
                  <span>{{item.discount}}</span>
                </p>
                <p class="container-content__discount">
                  <span>{{item.discount2}}</span>
                </p>
              </div>
            </div>

            <div class="content-value " />
            <img
              v-if="paymentMethodComponent &&paymentMethodComponent.id == item.id "
              class="logo-payment"
              :src="IMAGE_URL+'/icon/payment/check_select.svg'"
              alt="logo-payment"
            />
          </div>

          <div
            class="payment-method-modal__body--group-content"
            v-if=" item.id == 4"
          >
            <div class="content-key attention">
              <div>
                <span>{{ $t("payment_v4.attention") }} {{ $t("payment_v4.note_attention") }} </span>
                <!-- <br> -->
                <!-- <span></span> -->
              </div>
            </div>
          </div>
        </template>

        <!-- </template> -->
      </div>
    </template>
    <template slot="footer">
      <div class="payment-method-modal__footer">
        <button
          @click="onConfirm()"
          class="g2j-button-book-now"
          :disabled="isEmpty(paymentMethodComponent)"
        >
          {{$t('common.confirm')}}
        </button>
      </div>
    </template>
  </modal>
</template>

<script>
  import {
    IMAGE_URL,
    CACHE_VERSION,
    ASSETS_SERVICE_URL,
    HAS_MOITAI,
  } from "~jsDefinePath/general";
  import {
    getFormattedCurrency,
    formatPriceVND,
  } from "~jsPath/helper/util/formatNumber";
  export default {
    props: {
      paymentMethod: [Object, Array],
      mode: [String, Number],
      couponReward: [Object, Array],
      method: [String, Number],
      promotionPayment: [Array, Object],
      bookingInfo: [Array, Object],
      isAgoda: {
        type: Boolean,
        default: false,
      },
    },
    components: {
      modal: () =>
        import("~jsPartialPath/global/component/modal/ModalComponent.vue"),
    },
    data() {
      return {
        IMAGE_URL,
        visible: false, //check show modal
        dataBooking: {},
        paymentMethodComponent: null,
      };
    },

    methods: {
      isEmpty: _.isEmpty,
      formatPriceVND,
      onCheckDisable(id) {
        //chay cho nay hoi nhieu => khi nao ranh nho fix
        //id => id phương thức thanh toán

        // this.mode => 1 la ks thuong, 2 la ks flashsale chi cho thanh toan onl

        //this.method => phương thức thanh toán của khánh sạn
        //1 all
        //2 pay at hotel
        //3 online
        if (!this.method || !this.mode) return;

        let payOnl = [0, 1, 2, 3, 5]; //lam cai nay cho no chac chu check khac 4 la dc
        let payAtHotel = 4;
        // ks flashsale va ks thanh toan onl
        if (this.method == 3) {
          return !payOnl.includes(id);
        }
        if (this.method == 2 && id != payAtHotel && this.mode != 2) {
          return true;
        }

        if (
          this.bookingInfo.amountFromUser <
          this.bookingInfo.minMoneyPayment.payInAdvance
        ) {
          return payOnl.includes(id);
        }

        return false;
      },
      onCheckAgoda(id) {
        //KS Agoda chỉ cho thanh toán onl
        //id: 4 at hotel
        //id: 1 at payoo
        if (this.isAgoda && (id == 4 || id == 1)) {
          return true;
        }
        return false;
      },
      onCHeckFlashSale(id) {
        //KS flash sale chỉ cho thanh toán onl
        let arr = [0, 2, 3, 5]; // tra tai ks va payoo
        if (this.mode == 2) {
          return !arr.includes(id);
        }
        return false;
      },
      onConfirm() {
        // check them lan nua cho may thang thich cheat
        let id = this.paymentMethodComponent.id;
        let check =
          this.onCheckDisable(id) ||
          this.onCheckAgoda(id) ||
          this.onCHeckFlashSale(id);
        if (check) return;

        this.$emit("update:paymentMethod", this.paymentMethodComponent);
        this.$emit("doneSelectPayment");
        this.closeModal();
      },
      openModal() {
        if (!this.bookingInfo) return;
        this.paymentMethodComponent = this.paymentMethod;
        this.visible = true; //key => hiện modal
      },
      closeModal() {
        this.visible = false; //key => ẩn modal
      },
      changePaymentMethod(item, index) {
        // Note: id & index
        this.paymentMethodComponent = item;
      },
    },
    computed: {
      listPaymentType() {
        //Đừng hỏi cái data này từ đâu ra
        let arr = [
          {
            id: 4,
            name: this.$t("payment_v4.step_2.pay_at_hotel"),
            imgUrl: IMAGE_URL + `/icon/payment/hotelpay.svg`,
            discount: "",
            typePayment: 0,
            paymentProvider: 0,
          },
          {
            id: 3,
            name: "ATM Card",
            imgUrl: IMAGE_URL + `/icon/payment/epay.svg`,
            discount: "",
            typePayment: 42,
            paymentProvider: 42,
          },
          {
            id: 2,
            name: "Credit/Debit Card",
            imgUrl: IMAGE_URL + `/icon/payment/epay.svg`,
            discount: "",
            typePayment: 41,
            paymentProvider: 41,
          },

          {
            id: 0,
            name: this.$t("payment_v4.step_2.momo"),
            imgUrl: IMAGE_URL + `/icon/payment/momo.svg`,
            discount: "",
            typePayment: 3,
            paymentProvider: 3,
          },

          {
            id: 5,
            name: this.$t("payment_v4.step_2.zalo"),
            imgUrl: IMAGE_URL + `/icon/payment/zalopay.svg`,
            discount: "",
            typePayment: 60,
            paymentProvider: 6,
          },
          {
            id: 1,
            name: "Payoo",
            imgUrl: IMAGE_URL + `/icon/payment/payoo.svg`,
            discount: "",
            typePayment: 20,
            paymentProvider: 20,
          },
        ];

        // type payment cua ca phuong thuc thanh toan
        let typePayment = arr.map((el) => el.typePayment);
        // khi nao bao loi ma k co Phu thi dong cai tren, mo cai duoi ra
        // let typePayment = ["0", "3", "42", "41", "60", "20"];

        //xu ly discount dong 2 cho tung loai payment
        if (this.promotionPayment && !this.isAgoda) {
          let arrPayment = this.promotionPayment.useCondition.paymentMethod;
          arr.map((el, index) => {
            if (arrPayment.split(",").includes(el.typePayment.toString())) {
              if (this.promotionPayment.discountType == 1) {
                el.discount2 = `${this.$t(
                  "payment_v4.step_2.discount_coupon"
                )} ${this.formatPriceVND(this.promotionPayment.discount)}`;
              }
              if (this.promotionPayment.discountType == 2) {
                el.discount2 = `${this.$t("payment_v4.step_2.discount_coupon")} ${
                  this.promotionPayment.discount
                } % . ${this.$t("payment_v4.step_2.max")}  ${this.formatPriceVND(
                  this.promotionPayment.maxDiscount
                )}`;
              }
            }
          });
        }

        if (!this.isEmpty(this.couponReward) && !this.isAgoda) {
          let arrPayment = this.couponReward.useCondition.paymentMethod;
          let checkHasFull = typePayment.every((elem) =>
            arrPayment.split(",").includes(elem)
          );

          if (checkHasFull) return arr; // neu co tat ca cac loai thi k can sn nhieu

          //xu ly discount dong 1 cho loai payment
          arr.map((el, index) => {
            if (arrPayment.split(",").includes(el.typePayment.toString())) {
              if (this.couponReward.discountType == 1) {
                el.discount = `${this.$t(
                  "payment_v4.step_2.discount_coupon"
                )} ${this.formatPriceVND(this.couponReward.discount)}`;
              }
              if (this.couponReward.discountType == 2) {
                el.discount = `${this.$t("payment_v4.step_2.discount_coupon")} ${
                  this.couponReward.discount
                } % . ${this.$t("payment_v4.step_2.max")}  ${this.formatPriceVND(
                  this.couponReward.maxDiscount
                )}`;
              }
            }
          });
        }

        return arr;
      },
    },
  };
</script>

