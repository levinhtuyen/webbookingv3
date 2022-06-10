<template>
  <section
    v-if="isShowBannerSection"
    class="banner-section"
    :class="{
      'enable-slide': isValidToMakeSlide,
    }"
  >
    <div class="container">
      <div class="banner-block">
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
                        :data-src="$assetsServiceUrl + '/' + bannerItem.imagePath"
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
                          :data-src="$assetsServiceUrl + '/' + bannerItem.imagePath"
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
    DISPATCHER_PARAMS_ID,
  } from '~jsPath/define/dispatcher-params-id';
  import {
    getPromotionDetailPath,
    getPromotionPath,
    getHotelDetailPagePath,
    getLocationPagePath,
    getPointPagePath,
    getCouponPagePath,
    getHotelListPath,
  } from '~jsHelperPath/util/HandleUrl';

  export default {
    props: {
      bannerList: {
        default: () => [],
        type: Array,
      },
    },

    data () {
      return {
        IMAGE_URL,
        CACHE_VERSION,
        homeBannerSwiper: null,
        isBannerListUpdateFinish: false,

        bannerListFormatted: [],
        isFormatting: false,
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
        this.$emit("mounted");
      }, // isBannerListUpdateFinish()
    },

    created () {
      this.formatBannerList();
    },

    mounted() {
      if(!this.hasBannerListFormatted) {
        this.$emit("mounted");
      }
    },

    methods: {
      isEmpty: _.isEmpty,

      formatBannerList() {
        if(this.hasBannerList) {
          this.isFormatting = true;

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
                  promotionName: item.targetSn,
                },
                {
                  sn: item.targetSn,
                }
              );
            } else if(item.action == 2) {
              return;
            } else if(item.action == 3) {
              if(_.isNaN(item.targetSn)) {
                return;
              }

              // NOTE - action 1 là promotion-detail-page
              item.path = getPromotionDetailPath(
                {
                  promotionName: item.targetSn,
                },
                {
                  sn: item.targetSn,
                }
              );
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
                // !item.targetInfo.includes('http://')
                return;
              }

              // NOTE - action 6 là target blank external page
              item.url = item.targetInfo;
              item.target_blank = true;
            } else if(item.action == 7) {
              if(
                !item.targetInfo ||
                typeof item.targetInfo !== 'string'
              ) {
                return;
              }

              const _tmpObjTargetInfo = JSON.parse(item.targetInfo);

              const _provinceSn = Number(_tmpObjTargetInfo.provinceSn) || 1;

              const _districtSn = Number(_tmpObjTargetInfo.sn) || null;

              // NOTE - action 7 là get-location-page
              item.path = getLocationPagePath(
                {
                  provinceName: _provinceSn,
                  districtName: (_districtSn || _provinceSn) + '-' + DISPATCHER_PARAMS_ID.G2J_PROVINCE_SN_ID + _provinceSn + DISPATCHER_PARAMS_ID.G2J_DISTRICT_SN_ID + _districtSn,
                },
                {
                  citySn: Number(_tmpObjTargetInfo.provinceSn) || 1,
                  districtSn: _districtSn || null,
                  hasProgramBar: 0,
                }
              );
            } else if(item.action == 8) {
              // NOTE - action 8 là get-point-page
              item.path = getPointPagePath();
            } else if(item.action == 9) {
              // NOTE - action 9 là get-coupon-page
              item.path = getCouponPagePath();
            } else if(item.action == 10) {
              // NOTE - action 10 là get-hotel-category-path
              item.path = getHotelListPath(
                {
                  categoryName: 'specialoffer-' + DISPATCHER_PARAMS_ID.G2J_COLLECTION_SN_ID + 8,
                },
                {
                  hotelCollectionSn: 8,
                  hasProgramBar: 0,
                }
              );
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
            } else if(item.action == 13) {
              // NOTE - action 13 là get-
              item.path = getHotelListPath(
                {
                  categoryName: 'go2choice-' + DISPATCHER_PARAMS_ID.G2J_COLLECTION_SN_ID + item.targetSn,
                },
                {
                  hotelCollectionSn: item.targetSn,
                  hasProgramBar: 0,
                }
              );
            } else if(item.action == 105) {
              // NOTE - action 13 là get-
              item.path = getHotelListPath(
                {
                  categoryName: 'hoteltet'
                },
                {
                  promotion: 10,
                  hasProgramBar: 0,
                }
              );
            }

            if(item.path || item.target_blank) {
              tmpBannerListFormatted.push(item);
            }
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
            // spaceBetween: 16,
            // slidesPerView: 1.1,
            spaceBetween: 10,
            slidesPerView: 1.2,
            centeredSlides:true, //padding left-right,
            loop: true,
            // Disable preloading of all images
            // preloadImages: false,
            speed: 500,
            // Enable lazy loading
            autoplay: {
              delay: 5000,
            },
            lazy: {
              checkInView: true,
              loadPrevNext: true,
              loadPrevNextAmount: 3,
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
            breakpoints: {
              425: {
                spaceBetween: 12,
              },
              580: {
                spaceBetween: 16,
                slidesPerView: 1.1,
              },
            },
          });
        }
      }, // initSwiper()
    },
  }
</script>
