<template>
  <section
    v-if="isShowBannerSection"
    class="banner-section"
  >
    <div class="container">
      <div class="banner-block">
        <template v-if="!hasBannerListFormatted">
          <div class="banner-wrapper-outer">
            <div class="banner-wrapper">
              <div class="banner-wrapper-item swiper-slide">
                <div class="banner-img-outer" />
              </div> <!-- .banner-wrapper-item -->
            </div> <!-- .banner-wrapper -->
          </div> <!-- .banner-wrapper-outer -->
        </template>

        <template v-else>
          <div
            id="banner-wrapper-outer"
            ref="BannerWrapperOuter"
            class="banner-wrapper-outer swiper-container"
          >
            <div class="banner-wrapper swiper-wrapper">
              <template v-for="bannerItem, idx in bannerListFormatted">
                <template
                  v-if="
                    !isEmpty(bannerItem) &&
                    !isEmpty(bannerItem.imagePath)
                  "
                >
                  <template v-if="bannerItem.target_blank">
                    <a
                      :href="bannerItem.url"
                      :key="bannerItem.sn"
                      class="banner-wrapper-item swiper-slide"
                      :set="isBannerListUpdateFinish = (idx + 1 === bannerListFormatted.length)"
                      target="_blank"
                    >
                      <div class="banner-img-outer">
                        <img
                          width="100%"
                          height="100%"
                          class="banner-img"
                          :class="{
                            'lazyload': idx === 0,
                            'swiper-lazy': idx !== 0,
                          }"
                          :data-src="assetsServiceUrl + '/' + bannerItem.imagePath"
                          data-sizes="auto"
                          alt=""
                          loading="lazy"
                        >
                      </div>
                    </a> <!-- .banner-wrapper-item -->
                  </template>
                  <template v-else>
                    <router-link
                      v-slot="{ href, navigate }"
                      :key="bannerItem.sn"
                      :to="bannerItem.path[language]"
                      :set="isBannerListUpdateFinish = (idx + 1 === bannerListFormatted.length)"
                    >
                      <a
                        :key="bannerItem.sn"
                        class="banner-wrapper-item swiper-slide"
                        :href="href"
                        @click="navigate"
                      >
                        <div class="banner-img-outer">
                          <img
                            width="100%"
                            height="100%"
                            class="banner-img"
                            :class="{
                              'lazyload': idx === 0,
                              'swiper-lazy': idx !== 0,
                            }"
                            :data-src="assetsServiceUrl + '/' + bannerItem.imagePath"
                            data-sizes="auto"
                            alt=""
                            loading="lazy"
                          >
                        </div>
                      </a> <!-- .banner-wrapper-item -->
                    </router-link>
                  </template>
                </template>
              </template>
            </div> <!-- .banner-wrapper -->

            <template v-if="isValidToMakeSlide">
              <div class="banner-button-prev">
                <i class="far fa-chevron-left" />
              </div>
              <div class="banner-button-next">
                <i class="far fa-chevron-right" />
              </div>
            </template>
          </div> <!-- .banner-wrapper-outer -->
        </template>
      </div> <!-- .banner-block -->
    </div> <!-- .container -->
  </section> <!-- .banner-section -->
</template>

<script>
  import {
    _,
    mapState,
  } from '~jsLibPath/lib-manager';
  import {
    IMAGE_URL,
    CACHE_VERSION,
  } from '~jsDefinePath/general';
  import {
    MODULE_NAME as PAGE_INFO_MODULE_NAME,
  } from '~jsBasePath/vuex/modules/page-info-module';
  import {
    getPromotionDetailPath,
    getPromotionPath,
    getHotelDetailPagePath,
    getLocationPagePath,
    getPointPagePath,
    getCouponPagePath,
  } from '~jsHelperPath/util/HandleUrl';

  export default {
    props: {
      bannerList: {
        default: () => [],
        type: Array,
      },

      assetsServiceUrl: {
        default: '',
        type: String,
      },
    },
    data () {
      return {
        IMAGE_URL,
        CACHE_VERSION,
        homeBannerSwiper: null,
        isBannerListUpdateFinish: false,

        bannerListFormatted: [],
        isFormatting: true,
      }
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: 'language',
      }),

      hasBannerList() {
        return !_.isEmpty(this.bannerList);
      }, // hasBannerList

      hasBannerListFormatted() {
        return !_.isEmpty(this.bannerListFormatted);
      }, // hasBannerListFormatted

      isShowBannerSection() {
        return (
          this.isFormatting ||
          this.hasBannerListFormatted
        );
      }, // isShowBannerSection

      isValidToMakeSlide() {
        return (
          this.hasBannerListFormatted &&
          this.bannerListFormatted.length > 1
        );
      }, // isValidToMakeSlide
    },

    watch: {
      hasBannerList: function() {
        this.formatBannerList();
      }, // hasBannerList()

      isBannerListUpdateFinish: function () {
        // NOTE - After banner list loop and show all banner into banner view the initSwiper will fire
        this.initSwiper();
      }, // isBannerListUpdateFinish()
    },

    created () {
      this.formatBannerList();
    },

    methods: {
      isEmpty: _.isEmpty,

      formatBannerList() {
        if(this.hasBannerList) {
          const tmpBannerListFormatted = [];

          this.bannerList.forEach(function(item) {
            item.targetSn = parseInt(item.targetSn);

            if(item.action == 1) {
              if(_.isNaN(item.targetSn)) {
                return;
              }

              // NOTE - action 1 là promotion-detail-page
              item.path = getPromotionDetailPath(
                {
                  promotionName: GetSlug(item.title || item.targetName)
                },
                {
                  sn: item.targetSn,
                }
              );
            } else if(item.action == 2) {
              return;
            } else if(item.action == 3) {
              return;
            } else if(item.action == 4) {
              if(_.isNaN(item.targetSn)) {
                return;
              }

              // NOTE - action 4 là get-hotel-detail
              item.path = getHotelDetailPagePath(
                {
                  hotelName: GetSlug(item.title || item.targetName)
                },
                {
                  hotelSn: item.targetSn,
                }
              );
            } else if(item.action == 5) {
              return;
            } else if(item.action == 6) {
              if(
                !item.targetInfo ||
                !item.targetInfo.includes('https://')
              ) {
                return;
              }

              // NOTE - action 6 là target blank external page
              item.url = item.targetInfo;
              item.target_blank = true;
            } else if(item.action == 7) {
              item.provinceSn = parseInt(item.targetSn);

              if(
                _.isNaN(item.provinceSn) ||
                _.isNaN(item.targetSn)
              ) {
                return;
              }

              // NOTE - action 7 là get-location-page
              item.path = getLocationPagePath(
                {
                  provinceName: item.provinceSn,
                  districtName: item.targetSn,
                },
                {
                  citySn: item.provinceSn,
                  districtSn: item.targetSn,
                }
              );
            } else if(item.action == 8) {
              // NOTE - action 8 là get-point-page
              item.path = getPointPagePath();
            } else if(item.action == 9) {
              // NOTE - action 9 là get-coupon-page
              item.path = getCouponPagePath();
            } else if(item.action == 10) {
              // NOTE - action 10 là get-
              return;
            } else if(item.action == 11) {
              // NOTE - action 11 là promotion-list-page
              item.path = getPromotionPath(
                {
                  type: 3,
                  groupSn: item.targetSn,
                }
              );
            } else if(item.action == 12) {
              // NOTE - action 12 là get-
              return;
            }

            tmpBannerListFormatted.push(item);
          });

          this.isFormatting = false;

          this.bannerListFormatted = tmpBannerListFormatted;
        }
      }, // formatBannerList()

      initSwiper () {
        if (
          Swiper &&
          this.isValidToMakeSlide
        ) {
          this.homeBannerSwiper = new Swiper('#banner-wrapper-outer', {
            spaceBetween: 16,
            loop: true,
            // Disable preloading of all images
            preloadImages: false,
            speed: 1000,
            // Enable lazy loading
            autoplay: {
              delay: 5000,
            },
            lazy: {
              checkInView: true,
              // loadPrevNext: true,
            },

            navigation: {
              nextEl: '.banner-button-next',
              prevEl: '.banner-button-prev',
            },

            on: {
              slideChange: function(ev) {
                ev.lazy.load();
              }
            },
          });
        }
      }, // initSwiper()
    },
  }
</script>
