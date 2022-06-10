<template>
  <section class="banner-section">
    <div class="banner-block">
      <button class="circle-button-back">
        <i
          class="fa fa-long-arrow-left"
          aria-hidden="true"
        />
      </button>
      <div class="banner-wrapper-outer swiper-container">
        <div class="banner-wrapper swiper-wrapper">
          <template v-for="(bannerItem, idx) in bannerList">
            <div
              :key="idx"
              class="banner-wrapper-item swiper-slide"
            >
              <div
                class="banner-img-outer"
                :style="`background-image: url('${bannerItem}')`"
              />
            </div> <!-- .banner-wrapper-item -->
          </template>
        </div> <!-- .banner-wrapper -->
      </div>
    </div> <!-- .banner-block -->
  </section> <!-- .banner-section -->
</template>

<script>
export default {
  data() {
    return {
      bannerList: [
        'https://go2joy.s3-ap-southeast-1.amazonaws.com/hotel/1141_1564567323784/7730b1e490a21479365f825e52350d0f.jpg',
        'https://go2joy.s3-ap-southeast-1.amazonaws.com/hotel/1141_1564567323784/7730b1e490a21479365f825e52350d0f.jpg',
        'https://go2joy.s3-ap-southeast-1.amazonaws.com/hotel/1141_1564567323784/7730b1e490a21479365f825e52350d0f.jpg'
      ],
    }
  },

  created() {},

  mounted() {
    const Swipes = new Swiper('.swiper-container', {
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  },

  methods: {},
}
</script>
