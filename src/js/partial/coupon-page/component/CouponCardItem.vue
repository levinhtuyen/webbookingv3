<template>
  <div class="card">
    <div class="card__title">
      <h2 @click="openModalHotel(myCouponItem)">{{ myCouponItem.promotionName }} </h2>
      <div class="card__title--img">
        <!-- <img
          @click="onClick"
          :src="IMAGE_URL + '/' + icon"
          width="26px"
          height="26px"
        > -->
      </div>
      <modal-notice
        ref="notice-modal"
        :data="myCouponItem"
      />
    </div>
    <div class="card__body">
      <div class="card__body--flex-box">
        <p :class="myCouponItem.useCondition.hourly ? '' : 'black'">{{ $t('my_coupon_page.hourly') }}</p>
        <p :class="myCouponItem.useCondition.overnight ? '' : 'black'">{{ $t('my_coupon_page.overnight') }}</p>
        <p :class="myCouponItem.useCondition.daily ? '' : 'black'">{{ $t('my_coupon_page.daily') }}</p>
      </div>
      <div class="footer">
        <div class="footer__money">
          <span v-if="myCouponItem.discount">{{ $formatlowestPrice(myCouponItem.discount) }}{{ myCouponItem.discountType == 2  ? '%' : ''}}
            <u v-if="myCouponItem.discountType == 1">đ</u>
          </span>
        </div>
        <div class="footer__point">
          <span class="footer__point--text footer__point--font16">{{ $t('my_coupon_page.valid_until') }}</span>
          <span class="footer__point--text footer__point--font20">{{ getDDMMYYYY(myCouponItem.end) }}</span>
        </div>
      </div>
    </div>
    <ModalSelectHotel ref="modal-select-hotel"> </ModalSelectHotel>
  </div>
</template>

<script>
  import TheGo2JoyToolTip from "~jsPartialPath/global/component/go2joy-tooltip/TheGo2JoyToolTip.vue";
  import { getDDMMYYYY } from "~jsPath/helper/util/formatDate";
  import ModalNotice from "./ModalNotice.vue";
  import { IMAGE_URL } from "~jsDefinePath/general";
  import ModalSelectHotel from "~jsPartialPath/promotion-page/component/modalSelectHotel.vue";
  export default {
    props: {
      myCouponItem: {
        default: [],
        type: Array,
      },
    },
    components: {
      TheGo2JoyToolTip,
      ModalNotice,
      ModalSelectHotel,
    },
    data() {
      return {
        icon: "icon/exclamation-logo.png",
        IMAGE_URL,
      };
    },

    methods: {
      getDDMMYYYY,
      onClick() {
        this.$refs["notice-modal"].showModal();
      }, // onClick
      openModalHotel(data) {
        this.$refs["modal-select-hotel"].openModal(data.promotionSn);
      },
    },
  };
</script>
