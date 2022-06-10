<template>
  <section class="top-pick-selection-section">
    <div class="container">
      <div
        v-if="!isEmpty(topPickList)"
        class="top-pick-selection-block"
      >
        <div class="block-head">
          <div class="head-title-field">
            <span class="title-label">
              {{ detailCollectionInfo.title[language] }}
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
                @click.prevent="trackingReadmoreTopPick(href)"
              >
                {{ $t('common.read_more') }}
              </a>
            </router-link>
          </div> <!-- .head-title-field -->
        </div> <!-- .block-head -->

        <div class="block-body">
          <template v-if="!hasTopPickSelectionFormattedData">
            <div
              class="top-pick-selection-default-wrap-outer disable-readmore"
            >
              <div
                :key="minTopPickSelection"
                class="top-pick-selection-default-wrap"
              >
                <template v-for="idx in minTopPickSelection">
                  <div
                    :key="idx"
                    class="default-item default-item--loading"
                  >
                    <div class="item-head" />

                    <div class="item-body">
                      <span class="title-label" />
                    </div> <!-- .item-body -->
                  </div> <!-- .default-item -->
                </template>
              </div> <!-- .top-pick-selection-default-wrap -->
            </div> <!-- .top-pick-selection-default-wrap-outer -->
          </template>

          <template v-else>
            <div
              id="top-pick-selection-default__wrap-outer"
              ref="TopPickSelectionDefaultWrapOuter"
              class="top-pick-selection-default-wrap-outer swiper-container"
              :class="topPickDefaultWrapReadmoreClass"
            >
              <div
                id="top-pick-selection-default__wrap"
                class="top-pick-selection-default-wrap swiper-wrapper"
                :class="topPickDefaultWrapExtendClass"
              >
                <template v-for="(topPickDefaultItem, idx) in topPickList">
                  <router-link
                    v-slot="{href, navigate}"
                    :key="topPickDefaultItem.sn"
                    :to="topPickDefaultItem.path[language]"
                    :set="isShowTopPickFinish = (idx + 1 === topPickList.length)"
                  >
                    <a
                      v-if="!isEmpty(topPickDefaultItem)"
                      :key="topPickDefaultItem.sn"
                      class="default-item swiper-slide"
                      :href="href"
                      @click="navigate"
                    >
                      <div class="item-head">
                        <img
                          :src="IMAGE_URL + '/g2j-lazy-loading--sm.png?v=' + CACHE_VERSION"
                          :data-src="assetsServiceUrl + '/' +topPickDefaultItem.imagePath"
                          alt=""
                          class="item-img"
                          :class="{
                            'swiper-lazy': minTopPickSelection <= idx + 2,
                            'lazyload': minTopPickSelection > idx + 2,
                          }"
                          width="100%"
                          height="100%"
                          loading="lazy"
                          data-sizes="auto"
                          data-expand="-20"
                          :onerror="`this.src='${ IMAGE_URL }/g2j-lazy-loading--sm.png?v=${ CACHE_VERSION }'`"
                        >
                      </div> <!-- .item-head -->

                      <div class="item-body">
                        <span class="title-label">
                          {{ topPickDefaultItem.name }}
                        </span>
                        <span class="review-label">
                          <i class="fas fa-star" />
                          {{ topPickDefaultItem.totalReview }} Review(s)
                        </span>
                      </div> <!-- .item-body -->
                    </a> <!-- .default-item -->
                  </router-link>
                </template>
              </div> <!-- .top-pick-selection-default-wrap -->
            </div> <!-- .top-pick-selection-default-wrap-outer -->
          </template>
        </div> <!-- .block-body -->
      </div> <!-- .top-pick-selection-block -->
    </div> <!-- .container -->
  </section> <!-- .top-pick-section-section -->
</template>

<script>
import {
  _,
  mapState
} from '~jsLibPath/lib-manager';
import {
  IMAGE_URL,
  CACHE_VERSION,
  IS_MOBILE,
  IS_SAFARI_BROWSER,
  LANGUAGE_VALID,
} from '~jsDefinePath/general';
import {
  FIREBASE_TRACKING,
  DABLE_TRACKING,
} from '~jsDefinePath/tracking-define';
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME
} from '~jsBasePath/vuex/modules/page-info-module';
import {
  getHotelDetailPagePath,
  getHotelListPath,
} from '~jsHelperPath/util/HandleUrl';
import {
  onResizeEvent,
  removeOnResizeEvent,
}  from '~jsHelperPath/util/PrivateEventCustom';
import {
  G2JFirebase,
  G2JDablenaTracking,
} from '~jsHelperPath/util/HandleTracking';

export default {
  props: {
    detailCollectionInfo: {
      default: () => {},
      type: Object,
    },

    topPickList: {
      default: () => [],
      type: Array,
    },

    assetsServiceUrl: {
      default: '',
      type: String,
    },
  },
  data() {
    return {
      IMAGE_URL,
      CACHE_VERSION,
      IS_MOBILE,
      TimeoutHandler: new TimeoutHandler(),

      onResizeFunc: null,

      readmorePath: getHotelListPath(
        {
          categoryName: 'toppick'
        },
        {
          hotelCollectionSn: this.detailCollectionInfo.sn,
        }
      ),

      list: [],
      topPickListFormatted: [],
      isFormatting: true,

      isShowTopPickFinish: false,

      topPickSelectionSwiper: null,
      updateTopPickSelectionSwiperTimeout: null,

      minTopPickSelectionToScrollEachBreakPoint: {
        '768px': 6,
        '640px': 5,
        '500px': 4,
        '480px': 4,
        '425px': 3,
        '375px': 3,
        '320px': 2,
      },

      curBreakPoint: null,

      topPickDefaultWrapExtendClass: null,
      topPickDefaultWrapReadmoreClass: 'disable-readmore',
    }
  },

  computed: {
    ...mapState(PAGE_INFO_MODULE_NAME, {
      language: 'language',
    }),

    minTopPickSelection() {
      if(!this.curBreakPoint) {
        return null;
      }

      return this.minTopPickSelectionToScrollEachBreakPoint[this.curBreakPoint];
    }, // minTopPickSelection

    hasTopPickSelectionData() {
      return !_.isEmpty(this.topPickList);
    }, // hasTopPickSelectionData

    hasTopPickSelectionFormattedData() {
      return !_.isEmpty(this.topPickListFormatted);
    }, // hasTopPickSelectionFormattedData

    isShowItemsSection() {
      return (
        this.isFormatting ||
        this.hasTopPickSelectionFormattedData
      )
    }, // isShowItemsSection
  },

  watch: {
    isShowTopPickFinish: function() {
      this.updateTopPickSelectionSwiperTimeout.handle();
    },

    hasTopPickSelectionData: function() {
      this.formatTopPickSelectionData();
    },
  },

  created() {
    const self = this;

    self.updateTopPickSelectionSwiperTimeout = self.TimeoutHandler.init(
      'updateTopPickSelectionSwiper',
      150,
      self.checkValidSwiper
    );

    self.formatTopPickSelectionData();
  },

  mounted() {
    const self = this;

    self.curBreakPoint = self.getbBreakPointCurrent();

    // NOTE - Define variable contain resize event function to add / remove
    self.onResizeFunc = function() {
      self.updateTopPickSelectionSwiperTimeout.handle();
    };

    onResizeEvent(window, self.onResizeFunc);
  },

  beforeDestroy () {
    this.updateTopPickSelectionSwiperTimeout.destroy();

    removeOnResizeEvent(window, this.onResizeFunc);
  },

  methods: {
    isEmpty: _.isEmpty,

    formatTopPickSelectionData() {
      if(this.hasTopPickSelectionData) {
        const tmpTopPickListFormatted = [];

        this.topPickList.forEach(function(topPickItem) {
          topPickItem.path = getHotelDetailPagePath(
            {
              hotelName: GetSlug(topPickItem.name),
            },
            {
              hotelSn: topPickItem.sn,
            }
          );

          tmpTopPickListFormatted.push(topPickItem);
        });

        this.topPickListFormatted = [...tmpTopPickListFormatted];
      }

      this.isFormatting = false;
    }, // formatTopPickSelectionData()

    checkResizeScrollImage() {
        const self = this;
        const totalTopPickSelectionItem = self.topPickList.length + 1;

        self.curBreakPoint = self.getbBreakPointCurrent();

        if(
          totalTopPickSelectionItem < self.minTopPickSelectionToScrollEachBreakPoint[self.curBreakPoint]
        ) {
          self.topPickDefaultWrapExtendClass = 'is-center';
          self.topPickDefaultWrapReadmoreClass = 'disable-readmore';
        } else {
          self.topPickDefaultWrapReadmoreClass = 'is-beginning';

          setTimeout(function() {
            self.initSwiper();
          });
        }
    }, // checkResizeScrollImage()

    initSwiper() {
      const self = this;
      if(
        Swiper &&
        this.topPickList.length &&
        this.topPickList.length > 1
      ) {
        self.topPickSelectionSwiper = new Swiper('#top-pick-selection-default__wrap-outer', {
          slidesPerView: 'auto',
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
            loadPrevNext: true,
          },

          breakpoints: {
            320: {
              lazy: {
                checkInView: true,
                loadPrevNext: true,
                loadPrevNextAmount: 3
              },
            },

            480: {
              lazy: {
                checkInView: true,
                loadPrevNext: true,
                loadPrevNextAmount: 5
              },
            },

            640: {
              lazy: {
                checkInView: true,
                loadPrevNext: true,
                loadPrevNextAmount: 6
              },
            },
          },

          on: {
            reachEnd: function() {
              self.topPickDefaultWrapReadmoreClass = 'is-end';
            },
            reachBeginning: function() {
              self.topPickDefaultWrapReadmoreClass = 'is-beginning';
            },
            sliderMove: function() {
              if(
                !self.topPickSelectionSwiper.isEnd &&
                !self.topPickSelectionSwiper.isBeginning
              ) {
                self.topPickDefaultWrapReadmoreClass = null;
              }
            },
          }
        });
      }
    }, // initSwiper()

    checkValidSwiper(total) {
      this.curBreakPoint = this.getbBreakPointCurrent();

      if(
        total < this.minTopPickSelectionToScrollEachBreakPoint[this.curBreakPoint]
      ) {
        if(this.topPickSelectionSwiper) {
          this.topPickSelectionSwiper.destroy(true, true);
          this.topPickSelectionSwiper = null;
        }

        this.topPickDefaultWrapExtendClass = 'is-center';
        this.topPickDefaultWrapReadmoreClass = 'disable-readmore';
      } else {
        this.topPickDefaultWrapExtendClass = null;
        this.topPickDefaultWrapReadmoreClass = 'is-beginning';

        if(!this.topPickSelectionSwiper) {
          this.initSwiper();
        }
      }
    }, // checkValidSwiper()

    getbBreakPointCurrent() {
    if(window.matchMedia('(min-width: 640px)').matches) {
        if(
          IS_MOBILE &&
          IS_SAFARI_BROWSER &&
          window.matchMedia('(orientation : landscape)').matches
        ) {
          return '768px';
        }

        return '640px';
      } else if(window.matchMedia('(min-width: 500px)').matches) {
        return '500px';
      } else if(window.matchMedia('(min-width: 480px)').matches) {
        return '480px';
      } else if(window.matchMedia('(min-width: 425px)').matches) {
        return '425px';
      } else if(window.matchMedia('(min-width: 375px)').matches) {
        return '375px';
      }

      return '320px';
    }, // getbBreakPointCurrent()

    trackingReadmoreTopPick(href) {
      const titleCase = GenerateTitleCase(this.detailCollectionInfo.title[LANGUAGE_VALID.en]);

      G2JFirebase.analytics().logEvent(FIREBASE_TRACKING.TRACKING_PREFIX + (GetCustomSlug('', 500, false))(titleCase));
      G2JDablenaTracking(DABLE_TRACKING.TRACKING_SEE_ALL_PREFIX + (GetCustomSlug('', 500, false))(titleCase));

      if(href) {
        this.$router.push(href);
      }
    }, // trackingReadmoreTopPick()
  },
};
</script>
