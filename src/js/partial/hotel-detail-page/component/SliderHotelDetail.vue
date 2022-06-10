<template>
<section class="banner-section">
      <div class="banner-block">
        <div
            v-if="!isEmpty(bannerList)"
            id="banner-section__container"
            class="banner-wrapper-outer swiper-container"
        >
            <div
              class="banner-wrapper swiper-wrapper"
            >
              <div
                class="banner-wrapper-item swiper-slide" v-for="(slide,index) in bannerList" :key="index"
              >
                <div class="banner-img-outer">
                  <img :src="`https://go2joy.s3-ap-southeast-1.amazonaws.com/`+slide.imagePath" alt="">
                </div>
              </div> <!-- .banner-wrapper-item -->
            </div>
          </div> <!-- .banner-wrapper -->
      </div> <!-- .banner-block -->
  </section> <!-- .banner-section -->
</template>

<script>
import { _ } from '~jsLibPath/lib-manager';

export default {
    name: "SliderHotelDetail",
    props: {
        listImageSlide: [Array]
    },
    data() {
        return {}
    },
    computed: {
        bannerList() {
            return this.listImageSlide
        },
    },

    mounted() {
        const Swipes = new Swiper('#banner-section__container', {
        loop: true,
        spaceBetween: 10,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
    },

    methods: {
        isEmpty: _.isEmpty,
    }
}
</script>
