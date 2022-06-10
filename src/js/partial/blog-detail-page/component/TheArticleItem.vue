<template>
  <div
    v-if="!isEmpty(hotelItemInfo)"
    :key="hotelItemInfo.sn"
    class="g2j-hotel-product-card-horizontal"
    :class="{
      'swiper-slide': isSlide,
    }"
  >
    <div class="g2j-hotel-product-card-horizontal-inner">
      <div class="g2j-hotel-product-card-horizontal__img-col">
        <img
          :src="IMAGE_URL + '/g2j-lazy-loading--sm.png?v=' + CACHE_VERSION"
          :data-src="ASSETS_SERVICE_URL + '/' + hotelItemInfo.imagePath"
          :alt="hotelItemInfo.name"
          width="100%"
          height="100%"
          class="g2j-hotel-product-card-horizontal__img"
          :class="lazyloadClass"
        >
      </div>
    </div> <!-- .hot-deal-swiper-slide-inner -->
  </div> <!-- .g2j-hotel-product-card-horizontal -->
</template>

<script>
import {
  _,
  he
} from '~jsLibPath/lib-manager';
import {
  IMAGE_URL,
  CACHE_VERSION,
  ASSETS_SERVICE_URL,
} from '~jsDefinePath/general';
import {
  formatToThounsands
} from '~jsHelperPath/util/General';

export default {
  props: {
    hotelItemInfo: {
      default: {},
      type: Object,
    },

    isSlide: {
      default: false,
      type: Boolean,
    },

    lazyloadClass: {
      default: 'lazyload',
      type: String,
    },
  },

  data() {
    return {
      IMAGE_URL,
      CACHE_VERSION,
      ASSETS_SERVICE_URL,
    };
  },

  methods: {
    isEmpty: _.isEmpty,

    htmlDecode(content) {
      if(!content) {
        return '';
      }

      return he.decode(content);
    }, // htmlDecode()

    formatToThounsands,
  },
}
</script>
