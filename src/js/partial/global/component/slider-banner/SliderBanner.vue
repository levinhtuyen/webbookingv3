<template>
  <div
    ref="SliderBanner"
    id="slider-banner"
    class="slider-banner swiper-container"
  >
    <div class="slider-banner__wrapper swiper-wrapper">
      <template v-for="bannerItem, idx in dataBanner">
        <div
          :key="idx"
          class="slider-banner__wrapper--item swiper-slide"
        >
          <div class="slider-banner-img-outer">
            <!-- <img
              width="100%"
              height="100%"
              class="slider-banner-img"
              :class="{
                      'lazyload': idx === 0,
                      'swiper-lazy': idx !== 0,
                    }"
              :src="IMAGE_URL + '/g2j-lazy-loading.png?v=' + CACHE_VERSION"
              :data-srcset="bannerItem"
              data-sizes="auto"
              alt=""
              :onerror="`this.src='${IMAGE_URL}/g2j-lazy-loading--sm.png?v=${CACHE_VERSION}'`"
              loading="lazy"
            > -->
            <g2j-image
              :url-img="`${ASSETS_SERVICE_URL}/${bannerItem.imagePath}`"
              itemprop="photo"
              alt-img="banner"
            ></g2j-image>
          </div>
        </div> <!-- .banner-wrapper-item -->
      </template>
    </div> <!-- .banner-wrapper -->

    <div
      v-show="showButton"
      class="slider-banner__banner-button-prev"
    >
      <i class="far fa-chevron-left"></i>
    </div>
    <div
      v-if="showButton"
      class="slider-banner__banner-button-next"
    >
      <i class="far fa-chevron-right"></i>
    </div>
  </div>
</template>

<script>
  import {
    IMAGE_URL,
    CACHE_VERSION,
    ASSETS_SERVICE_URL,
  } from "~jsDefinePath/general";
  export default {
    props: {
      dataBanner: {
        type: [Array, Object],
      },
      showButton: {
        type: Boolean,
        default: true,
      },
      height: {
        type: String,
      },
    },
    data() {
      return {
        IMAGE_URL,
        CACHE_VERSION,
        data: this.dataBanner,
        styleCustom: null,
        ASSETS_SERVICE_URL,
      };
    },
    mounted() {
      if (Swiper && this.$refs.SliderBanner) {
        if (this.height) {
          let elContainer = document.getElementsByClassName(
            "slider-banner-img-outer"
          );
          this.styleCustom = document.createElement("style");
          this.styleCustom.type = "text/css";
          this.styleCustom.innerHTML = `.height-banner { height: ${this.height} }`;
          document.getElementsByTagName("head")[0].appendChild(this.styleCustom);
          Object.keys(elContainer).map((el) => {
            elContainer[el].classList.add("height-banner");
          });
        }
        new Swiper("#slider-banner", {
          spaceBetween: 16,
          loop: true,
          // Disable preloading of all images
          preloadImages: false,
          // Enable lazy loading
          autoplay: {
            delay: 5000,
          },
          lazy: {
            checkInView: true,
            // loadPrevNext: true,
          },

          navigation: {
            nextEl: ".slider-banner__banner-button-next",
            prevEl: ".slider-banner__banner-button-prev",
          },
        });
      }
    },
    created() {},
    beforeDestroy() {
      this.styleCustom.remove();
    },
  };
</script>
