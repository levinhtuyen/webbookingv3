<template>
  <div class="stamp-card">
    <div class="stamp-card__item">
      <div class="slide-stamp">
        <div class="slide-stamp__slide">
          <div class="core-active-slide"></div>
          <div class="dot-slide">
            <img :src="IMAGE_URL + '/svg/promo.svg'" />
          </div>
          <div class="core-slide"></div>
        </div>
        <div class="slide-stamp__total-stamp">
          <div class="is-total-stamp">
            <p>{{ dataStamp.activeStamp }}/{{ dataStamp.numToRedeem }}</p>
          </div>
          <div class="is-text-stamp">
            <p>{{ $t("hotel_detail.detail_v4.stamp") }}</p>
          </div>
        </div>
      </div>
      <div class="confirm-stamp" v-if="signIn">
        <p class="is-note" v-if="dataCheckHotelDetail">*{{ $t("hotel_detail.detail_v4.apply") }}
          <span v-if="dataCheckHotelDetail.stampHourly === true">{{ $t("hotel_detail.detail_v4.hourly") }}</span>
          <span v-if="dataCheckHotelDetail.stampHourly && (dataCheckHotelDetail.stampOvernight || dataCheckHotelDetail.stampDaily)">, </span>
          <span v-if="dataCheckHotelDetail.stampOvernight"> {{ $t("hotel_detail.detail_v4.overnight") }}</span>
          <span v-if=" dataCheckHotelDetail.stampOvernight && dataCheckHotelDetail.stampDaily">,</span>
          <span v-if="dataCheckHotelDetail.stampDaily"> {{ $t("hotel_detail.detail_v4.daily") }}</span>
        </p>
        <p class="is-number-stamp" v-if="dataStamp.stampDiscount">
          {{ $t("hotel_detail.detail_v4.discount") }}
          <span v-if="dataStamp.stampDiscount > 100">{{ $formatPrice(dataStamp.stampDiscount) }}</span>
          <span v-else>{{ dataStamp.stampDiscount }}%</span>
        </p>
      </div>
      <div class="sign-in" v-else>
        <div class="sign-in__button-sign-in">
          <p @click="onSignIn()">{{ $t("hotel_detail.detail_v4.sign_in") }}</p>
        </div>
        <div class="sign-in--is-text-sign-in">
          <p>{{ $t("hotel_detail.detail_v4.too_see") }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { IMAGE_URL } from "~jsDefinePath/general";
import { getToken } from "~jsDefinePath/general";
export default {
  props: {
    myPointTotal: {
      default: Object,
      type: [Object, Array],
    },
    dataHotelDetail: {
      default: Object,
      type: [Object, Array],
    },
  },
  data() {
    return {
      IMAGE_URL,
      signIn: false,
    };
  },
  created() {
    this.checkSignIn();
  },
  mounted() {
    // this.checkSignIn();
    this.handleStamp();
  },

  methods: {
    handleStamp() {
      let active = 0;
      let noActive = 100;
      if (this.signIn === false) {
        this.dataStamp.activeStamp = 0;
      } else {
        let stampNoActive =
          this.dataStamp.numToRedeem - this.dataStamp.activeStamp;
        active =
          (this.dataStamp.activeStamp / this.dataStamp.numToRedeem) * 100;
        noActive = (stampNoActive / this.dataStamp.numToRedeem) * 100;
        if(this.dataStamp.activeStamp === 0){
          active = 0,
          noActive = 100
        }
      }
      let x = document.getElementsByClassName("core-active-slide");
      let y = document.getElementsByClassName("core-slide");
      x[0].style.width = `${active}%`;
      y[0].style.width = `${noActive}%`;
    },
    checkSignIn() {
      if (_.isEmpty(getToken())) {
        this.signIn == false;
      } else {
        this.signIn = true;
      }
    }, //checkSignIn
    onSignIn() {
      this.$router.push({
        name: "login-page",
      });
    },
  },

  computed: {
    dataStamp() {
      return this.myPointTotal;
    },
    dataCheckHotelDetail() {
      return this.dataHotelDetail
    }
  },
};
</script>

<style>
</style>
