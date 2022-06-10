<template>
  <div
    class="g2j-loading-section"
    :class="extendClass"
  >
    <!-- <div class="g2j-loading-section__icon">
      <img
        class="g2j-loading-section__icon__img"
        width="100px"
        height="100px"
        :src="IMAGE_URL + '/go2joy-loading-v2.gif?v=' + CACHE_VERSION"
        alt="go2joy loading"
      >
    </div> -->
    <!-- .g2j-loading-section__icon -->

    <div class="g2j-loading-wrap">
      <div class="g2j-loading-wrap__loading-spinner-outer">
        <div class="g2j-loading-wrap__loading-spinner-line">
          <span class="g2j-loading-wrap__loading-spinner-item"></span>
        </div>
        <div class="g2j-loading-wrap__loading-spinner-line">
          <span class="g2j-loading-wrap__loading-spinner-item"></span>
        </div>
        <div class="g2j-loading-wrap__loading-spinner-line">
          <span class="g2j-loading-wrap__loading-spinner-item"></span>
        </div>
        <div class="g2j-loading-wrap__loading-spinner-line">
          <span class="g2j-loading-wrap__loading-spinner-item"></span>
        </div>
        <div class="g2j-loading-wrap__loading-spinner-line">
          <span class="g2j-loading-wrap__loading-spinner-item"></span>
        </div>
        <div class="g2j-loading-wrap__loading-spinner-line">
          <span class="g2j-loading-wrap__loading-spinner-item"></span>
        </div>
        <div class="g2j-loading-wrap__loading-spinner-line">
          <span class="g2j-loading-wrap__loading-spinner-item"></span>
        </div>
        <div class="g2j-loading-wrap__loading-spinner-line">
          <span class="g2j-loading-wrap__loading-spinner-item"></span>
        </div>
        <div class="g2j-loading-wrap__loading-spinner-line">
          <span class="g2j-loading-wrap__loading-spinner-item"></span>
        </div>
        <div class="g2j-loading-wrap__loading-spinner-line">
          <span class="g2j-loading-wrap__loading-spinner-item"></span>
        </div>
      </div> <!-- .g2j-loading-wrap__loading-snipper-outer -->

      <div class="g2j-loading-wrap__img-outer">
        <template v-for="loadingImgItemInfo, key in loadingImgInfoList">
          <img
            :key="key"
            class="g2j-loading-wrap__img"
            width="100%"
            height="100%"
            :src="loadingImgItemInfo.src"
            :alt="loadingImgItemInfo.alt"
          >
        </template>
      </div> <!-- .g2j-loading-wrap__img-outer -->
    </div> <!-- .g2j-loadig-wrap -->
  </div> <!-- .go2jpy-loading-section -->
</template>

<script>
import {
  IMAGE_URL,
  CACHE_VERSION
} from '~jsDefinePath/general';

export default {
  name: 'Go2JoyLoading',

  props: {
    extendClass: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      IMAGE_URL,
      CACHE_VERSION,

      loadingImgInfoList: [
        {
          src: IMAGE_URL + '/svg/go2joy-logo.svg',
          alt: 'go2joy logo',
        },
        {
          src: IMAGE_URL + '/svg/coupon-logo.svg',
          alt: 'coupon logo',
        },
        {
          src: IMAGE_URL + '/svg/promotion-logo.svg',
          alt: 'promotion logo',
        },
        {
          src: IMAGE_URL + '/svg/hotel-logo.svg',
          alt: 'hotel logo',
        },
        {
          src: IMAGE_URL + '/svg/point-logo.svg',
          alt: 'point logo',
        },
        {
          src: IMAGE_URL + '/svg/tem-logo.svg',
          alt: 'tem logo',
        },
        {
          src: IMAGE_URL + '/svg/notification-logo.svg',
          alt: 'notification logo',
        },
      ], // loadingImgInfoList
    }
  },
}
</script>
