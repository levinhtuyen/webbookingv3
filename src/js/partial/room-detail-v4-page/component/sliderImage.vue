<template>
  <!-- Slider main container -->
<div>
    <div class="swiper-container">
    <!-- Additional required wrapper -->
    <!-- If we need pagination -->
    <div class="icon-back" @click="$router.go(-1)">
      <i class="fas fa-chevron-left"></i>
    </div>

    <div :hidden="isHiddenHeart" class="icon-heart" @click="$router.go(-1)">
      <span>119</span>
      <i class="far fa-heart"></i>
    </div>

    <div class="swiper-pagination"></div>
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(item, index) in images" :key="index">
        <g2j-image
          :url-img="`${ASSETS_SERVICE_URL}/${item.imagePath}`"
        >
        </g2j-image>
      </div>
    </div>
</div>
    
</div>

</template>

<script>
import { ASSETS_SERVICE_URL } from "~jsDefinePath/general";

export default {
  props: {
    listImageSlide: [Array, Object],
    isHiddenHeart: {
      default: true,
      type: Boolean,
    }
  },
  data() {
    return {
      ASSETS_SERVICE_URL
    }
  },
  component: {
    "g2j-image": () =>
      import("~jsPartialPath/global/component/g2j-img/Go2JoyImages.vue"),
  },
  computed: {
    images() {
      return this.listImageSlide
    }
  },
  mounted() {
    setTimeout(() => {
      new Swiper ('.swiper-container', {
      // If we need pagination
      // observer: true,
      loop: true,
      slidesPerView: 1,

      pagination: {
        el: '.swiper-pagination',
        clickable: true,
          renderBullet: function (index, className) {
            return '<span class="' + className + '">' + '</span>';
          },
        },
      })
    },2000);
  },
}
</script>

<style>

</style>
