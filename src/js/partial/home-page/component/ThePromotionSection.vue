<template>
  <section
    v-if="isShowItemListSection"
    class="hot-promotion-section"
  >
    <div class="container">
      <div class="hot-promotion-block">
        <div class="block-head">
          <div class="head-title-field">
            <span class="title-label">
              {{ htmlDecode(detailCollectionInfo.title[language]) }}
            </span>

            <router-link
              v-slot="{ href }"
              :to="readmorePath[language]"
            >
              <a
                :href="href"
                class="readmore-link"
                :class="{
                  'enable-hover': !IS_MOBILE
                }"
                @click.prevent="trackingReadmorePromotion(href)"
              >
                {{ $t('common.read_more') }}
              </a>
            </router-link>
          </div>
          <!-- .head-title-field -->
        </div>
        <!-- .block-head -->

        <div class="block-body">
          <template v-if="!hasItemsFormatted">
            <div class="hotel-product-card-horizontal__swiper-container disable-readmore">
              <div class="hot-promotion-wrap">
                <template v-for="idx in fitItemsInView">
                  <div
                    :key="idx"
                    class="default-item default-item--loading"
                  >
                    <div class="item-head" />
                    <!-- .item-head -->
                  </div>
                  <!-- .default-item -->
                </template>
              </div>
              <!-- .hot-promotion-wrap -->
            </div>
            <!-- .hotel-product-card-horizontal__swiper-container -->
          </template>

          <template v-else>
            <div
              id="hot-promotion__wrap-outer"
              ref="HotPromotionSelectionDefaultWrapOuter"
              class="hotel-product-card-horizontal__swiper-container swiper-container"
              :class="{
                'has-readmore': isValidToMakeScroll,
                [hotelCollectionDefaultWrapReadmoreClass]: isValidToMakeScroll
              }"
            >
              <div
                id="hot-promotion__wrap"
                class="hot-promotion-wrap swiper-wrapper"
                :class="{
                  'is-fit': !isValidToMakeScroll,
                }"
              >
                <template v-for="(promotionItem, idx) in itemListFormatted">
                  <router-link
                    :key="promotionItem.sn"
                    v-slot="{ href, navigate }"
                    :to="promotionItem.path[language]"
                    :set="
                      (isItemListUpdateFinish = idx + 1 === totalItemsFormatted)
                    "
                  >
                    <a
                      v-if="!isEmpty(promotionItem)"
                      :key="promotionItem.sn"
                      class="default-item swiper-slide"
                      :href="href"
                      @click="navigate"
                    >
                      <div class="item-head">
                        <img
                          :data-src="
                            assetsServiceUrl + '/' + promotionItem.imagePath
                          "
                          alt=""
                          class="item-img"
                          :class="itemLazyloadClassList[idx] || ''"
                          width="100%"
                          height="100%"
                          loading="lazy"
                          data-sizes="auto"
                          data-expand="-20"
                        >
                      </div>
                      <!-- .item-head -->
                    </a>
                    <!-- .default-item -->
                  </router-link>
                </template>
              </div>
              <!-- .hot-promotion-wrap -->
            </div>
            <!-- .hotel-product-card-horizontal__swiper-container -->
          </template>
        </div>
        <!-- .block-body -->
      </div>
      <!-- .hot-promotion-block -->
    </div>
    <!-- .container -->
  </section>
  <!-- .hot-promotion-section-section -->
</template>

<script>
import {
  _,
  he,
  mapState,
} from "~jsLibPath/lib-manager";
import {
  IMAGE_URL,
  CACHE_VERSION,
  IS_MOBILE,
  IS_SAFARI_BROWSER,
  LANGUAGE_VALID,
} from "~jsDefinePath/general";
import {
  FIREBASE_TRACKING,
  DABLE_TRACKING,
} from '~jsDefinePath/tracking-define';
import {
  getPromotionPath,
  getPromotionDetailPath,
} from '~jsHelperPath/util/HandleUrl';
import {
  onResizeEvent,
  removeOnResizeEvent,
} from "~jsHelperPath/util/PrivateEventCustom";
import {
  G2JFirebase,
  G2JDablenaTracking,
} from '~jsHelperPath/util/HandleTracking';
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
} from '~jsBasePath/vuex/modules/page-info-module';
import {
  MIXIN_CONFIG as HOT_PROMOTION_MIXIN_CONFIG
} from '../mixin/gallery-wrap';

export default {
  mixins: [
    HOT_PROMOTION_MIXIN_CONFIG
  ],

  props: {
    detailCollectionInfo: {
      default: () => {},
      type: Object
    },
  },

  data() {
    return {
      IMAGE_URL,
      CACHE_VERSION,
      IS_MOBILE,
      TimeoutHandler: new TimeoutHandler(),

      updateSwiperTimeout: null,
      onResizeFunc: null,

      readmorePath: getPromotionPath({
        type: 2,
      }),

      isItemListUpdateFinish: false,

      itemListSwiper: null,

      swiperContainerReadmoreClass: '',
    };
  },

  computed: {
    ...mapState(PAGE_INFO_MODULE_NAME, {
      language: 'language',
    }),
  },

  watch: {
    isItemListUpdateFinish: function() {
      // NOTE - After promotion list loop and show all promotion into promotion view the initSwiper will fire
      this.updateSwiperTimeout?.handle();
    }, // isItemListUpdateFinish

    itemList() {
      this.formatItemListData();
    }, // itemList
  },

  created() {
    const self = this;

    // NOTE - Config minimum items to make scroll each breakpoint of screen
    self.minItemsToScrollEachBreakPoint = {
      '748px': 3,
      '640px': 2,
      '320px': 2,
    };

    // NOTE - Init timeout handler
    self.updateSwiperTimeout = self.TimeoutHandler.init(
      'updatePromotionList',
      150,
      self.checkValidSwiper
    );

    // NOTE - Format item list if item list is exist
    self.formatItemListData();
  },

  mounted() {
    const self = this;

    self.curBreakPoint = self.getBreakPointCurrent();

    // NOTE - Define variable contain resize event function to add / remove
    self.onResizeFunc = function() {
      self.updateSwiperTimeout.handle();
    };

    onResizeEvent(window, self.onResizeFunc);
  },

  beforeDestroy() {
    this.updateSwiperTimeout.destroy();
    this.itemListSwiper?.destroy(true, true);

    removeOnResizeEvent(window, this.onResizeFunc);
  },

  methods: {
    isEmpty: _.isEmpty,

    htmlDecode(content) {
      if(!content) {
        return '';
      }

      return he.decode(content);
    }, // htmlDecode()

    formatItemListData() {
      if(this.hasItems) {
        const tmpPromotionListFormatted = [];

        this.itemList.forEach(function(item) {
          item.path = getPromotionDetailPath(
            {
              promotionName: item.sn,
            },
            {
              sn: item.sn,
            }
          );

          tmpPromotionListFormatted.push(item);
        });

        this.itemListFormatted = [...tmpPromotionListFormatted];
      }

      this.isFormatting = false;
    }, // formatItemListData()

    initSwiper() {
      const self = this;

      if (
        Swiper &&
        this.hasItemsFormatted
      ) {
        self.itemListSwiper = new Swiper(
          "#hot-promotion__wrap-outer",
          {
            slidesPerView: "auto",
            spaceBetween: 0,

            freeMode: true,
            grabCursor: true,
            freeModeMinimumVelocity: 0.07,
            freeModeMomentumBounceRatio: 3,
            freeModeMomentumVelocityRatio: 1.5,

            // Disable preloading of all images
            preloadImages: false,

            // Enable lazy loading
            lazy: {
              checkInView: true,
              loadPrevNext: true
            },

            on: {
              reachEnd: function() {
                self.swiperContainerReadmoreClass = "is-readmore-left";
              },
              reachBeginning: function() {
                self.swiperContainerReadmoreClass = "is-readmore-right";
              },
              sliderMove: function(ev) {
                ev.lazy.load();

                if (
                  !self.itemListSwiper.isEnd &&
                  !self.itemListSwiper.isBeginning
                ) {
                  self.swiperContainerReadmoreClass = 'is-readmore-both';
                }
              }
            }
          }
        );
      }
    }, // initSwiper()

    checkValidSwiper() {
      const self = this;

      self.curBreakPoint = self.getBreakPointCurrent();

      if (!self.isValidToMakeScroll) {
        if (self.itemListSwiper) {
          self.itemListSwiper.destroy(true, true);
          self.itemListSwiper = null;
        }

        self.swiperContainerReadmoreClass = '';
      } else {
        self.hotPromotionDefaultWrapExtendClass = null;
        self.swiperContainerReadmoreClass = "is-readmore-right";

        if (!self.itemListSwiper) {
          setTimeout(function() {
            self.initSwiper();
          });
        }
      }
    }, // checkValidSwiper()

    getBreakPointCurrent() {
      if(window.matchMedia('(min-width: 748px)').matches) {
        return '748px';
      }

      if(window.matchMedia('(min-width: 640px)').matches) {
        if(
          IS_MOBILE &&
          IS_SAFARI_BROWSER &&
          window.matchMedia('(orientation : landscape)').matches
        ) {
          return '748px';
        }

        return '640px';
      }

      return '320px';
    }, // getbBreakPointCurrent()

    trackingReadmorePromotion(href) {
      const titleCase = GenerateTitleCase(this.detailCollectionInfo.title[LANGUAGE_VALID.en]);

      G2JFirebase.analytics().logEvent(FIREBASE_TRACKING.TRACKING_PREFIX + (GetCustomSlug('', 500, false))(titleCase));
      G2JDablenaTracking(DABLE_TRACKING.TRACKING_SEE_ALL_PREFIX + (GetCustomSlug('', 500, false))(titleCase));

      if(href) {
        this.$router.push(href);
      }
    }, // trackingReadmorePromotion()
  },
};
</script>
