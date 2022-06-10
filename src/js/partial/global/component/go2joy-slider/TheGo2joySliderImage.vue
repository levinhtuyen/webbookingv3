<template>
  <!-- Slider main container -->
  <div class="g2joy-slider-image">
    <div
      v-if="hasListImageSlide"
      ref="SwiperContainer"
      class="swiper-container"
      :class="customClassName"
    >
      <!-- Additional required wrapper -->
      <!-- If we need pagination -->
      <div
        class="icon-back"
        @click="$router.go(-1)"
      >
        <i class="fas fa-chevron-left"></i>
      </div>

      <div
        :hidden="isHiddenHeart"
        class="icon-heart"
        :class="{
          'item-heart-active': data.favorite,
          '--disable-click': isUpdatingFavorite
        }"
        @click="onFavorite(data)"
      >
        <span v-if="hasTotalFavoriteThoundsandFormatted">
          {{ totalFavoriteWithThoundsandFormatted }}
        </span>

        <i
          v-if="data.favorite"
          class="fas fa-heart"
        ></i>

        <i
          v-else
          class="far fa-heart"
        ></i>
      </div>

      <div class="swiper-pagination"></div>
      <div class="swiper-wrapper">
        <div
          class="swiper-slide"
          v-for="(item,index) in listImageSlide"
          :key="index"
          :set="isSlidesRenderingFinish = (index + 1 === listImageSlide.length)"
        >
          <img
            :key="index"
            :data-src="`${ASSETS_SERVICE_URL}/${item.imagePath}`"
            class="lazyload"
            loading="lazy"
            data-expand="-5"
            width="100%"
            height="100%"
            onload="this.classList.add('is-image-available')"
            :alt="item.roomTypeName || 'go2joy'"
          >

          <p
            v-if="item.roomTypeName"
            class="swiper-text"
          >{{ item.roomTypeName }}</p>
        </div>
      </div>
      <div
        v-if="data && data.isTet"
        class="tet-label"
      >
        <g2j-image
          :urlImg="IMAGE_URL+'/svg/g2j_tet.svg'"
          :altImg="'tet-label'"
        >
        </g2j-image>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    IMAGE_URL,
    CACHE_VERSION,
    ASSETS_SERVICE_URL,
  } from "~jsDefinePath/general";

  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsPath/base/vuex/modules/page-info-module";
  import { ROUTER_NAME } from "~jsBasePath/vue-router/router-define";
  import { G2JRouter, getG2JRoute } from "~jsHelperPath/util/HandleRouterGlobal";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import { getToken } from "~jsDefinePath/general";
  import { mapGetters, mapState } from "~jsPath/lib/lib-manager";
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import { formatToThounsands } from "~jsHelperPath/util/General";

  export default {
    props: {
      listImageSlide: {
        default: [],
        type: new Array(),
      },
      isHiddenHeart: {
        default: true,
        type: Boolean,
      },
      data: {
        default: [],
        type: [Array, Object],
      },

      customClassName: {
        default: null,
        type: String,
      }, // customClassName
      hotelSn : [String,Number]
    },

    data() {
      return {
        IMAGE_URL,
        CACHE_VERSION,
        ASSETS_SERVICE_URL,

        isSlidesRenderingFinish: false,

        swiperInitial: null,

        isUpdatingFavorite: false,
      };
    },

    computed: {
      images() {
        return this.listImageSlide;
      },

      ...mapGetters(PAGE_INFO_MODULE_NAME, {
        hasUserInfo: "hasUserInfo",
      }),

      hasListImageSlide() {
        return !_.isEmpty(this.listImageSlide);
      }, // hasListImageSlide

      totalFavoriteWithThoundsandFormatted() {
        if (
          typeof this.data.totalFavorite !== "number" ||
          this.data.totalFavorite <= 0
        ) {
          return "0";
        }

        return formatToThounsands(this.data.totalFavorite);
      }, // totalFavoriteWithThoundsandFormatted

      hasTotalFavoriteThoundsandFormatted() {
        return this.totalFavoriteWithThoundsandFormatted !== "0";
      }, // hasTotalFavoriteThoundsandFormatted
    },

    watch: {
      isSlidesRenderingFinish(val) {
        if (val && !_.isEmpty(this.listImageSlide) && !this.swiperInitial) {
          this.initSwiper();
        }
      }, // isSlidesRenderingFinish()
    },

    methods: {
      initSwiper() {
        if (
          window.Swiper &&
          !_.isEmpty(this.listImageSlide) &&
          this.listImageSlide.length > 1 &&
          !this.swiperInitial
        ) {
          this.swiperInitial = new Swiper(this.$refs.SwiperContainer, {
            // If we need pagination
            // observer: true,
            loop: true,
            // Disable preloading of all images
            preloadImages: false,

            lazy: {
              checkInView: true,
              // loadPrevNext: true,
            },

            slidesPerView: 1,
            observer: true,

            pagination: {
              el: ".swiper-pagination",
              clickable: true,
              renderBullet: function (index, className) {
                return '<span class="' + className + '"></span>';
              },
            },
          });
        }
      }, // initSwiper()

      onFavorite(item) {
        if (!this.hasUserInfo) {
          G2JRouter.replace({ name: ROUTER_NAME["login-page"] });
        } else if (!this.isUpdatingFavorite) {
          const self = this;
          let status = !item.favorite;
          self.isUpdatingFavorite = true;

          apiCaller({
            metaUrl: AJAX_URL.hotel_v4.favorite,
            data: {
              hotelSn: this.hotelSn,
              favorite: status,
            },
            method: "POST",
            headers: {
              Authorization: getToken(),
            },
            dataType: "json",
            error(err) {
              self.errorList = err.response?.data.error || [];
              self.isUpdatingFavorite = false;
            },
            success(objResponse) {
              if (_.isEmpty(objResponse) || objResponse.error) {
                self.errorList = objResponse.error;
                self.isUpdatingFavorite = false;
                return;
              }
              item.favorite = status;
              if (item.favorite) {
                item.totalFavorite = item.totalFavorite + 1;
              } else {
                item.totalFavorite = item.totalFavorite - 1;
              }

              self.isUpdatingFavorite = false;
            },
            complete() {},
          });
        }
      }, // onFaviorite()
    },
  };
</script>
