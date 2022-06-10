<template>
  <section
    v-if="isShowItemListSection"
    class="hotel-collection-section"
  >
    <div class="container">
      <div class="hotel-collection-block">
        <div class="block-head">
          <div class="block-head-title-col">
            <span class="block-head-title">
              {{ $t('home.hotel_collection') }}
            </span>
          </div> <!-- .block-head-title-col -->
        </div> <!-- .block-head -->

        <div class="block-body">
          <template v-if="!hasItemsFormatted">
            <div class="hotel-product-card-horizontal__swiper-container disable-readmore">
              <div class="hotel-collection-wrap">
                <template v-for="idx in fitItemsInView">
                  <div
                    :key="idx"
                    class="default-item default-item--loading"
                  >
                    <div class="item-head" /> <!-- .item-head -->
                  </div> <!-- .default-item -->
                </template>
              </div> <!-- .hotel-collection-wrap -->
            </div> <!-- .hotel-product-card-horizontal__swiper-container -->
          </template>

          <template v-else>
            <div
              id="hotel-collection__wrap-outer"
              ref="HotelCollectionDefaultWrapOuter"
              class="hotel-product-card-horizontal__swiper-container swiper-container"
              :class="{
                'has-readmore': isValidToMakeScroll,
                [swiperContainerReadmoreClass]: isValidToMakeScroll
              }"
            >
              <div
                id="hotel-collection__wrap"
                class="hotel-collection-wrap swiper-wrapper"
                :class="{
                  'is-fit': !isValidToMakeScroll,
                }"
              >
                <template v-for="(hotelCollectiontItem, idx) in itemListFormatted">
                  <router-link
                    :key="hotelCollectiontItem.sn"
                    v-slot="{ href }"
                    :to="hotelCollectiontItem.path[language]"
                    :set="isUpdateItemListFinish = (idx + 1 === totalItemsFormatted)"
                  >
                    <a
                      v-if="!isEmpty(hotelCollectiontItem)"
                      :key="hotelCollectiontItem.sn"
                      class="default-item swiper-slide"
                      :href="href"
                      @click.prevent="onClickHotelCollectionItem(
                        href,
                        hotelCollectiontItem.title
                      )"
                    >
                      <div class="item-head">
                        <img
                          :data-src="assetsServiceUrl + '/' + hotelCollectiontItem.imagePath"
                          alt=""
                          class="item-img"
                          :class="itemLazyloadClassList[idx] || ''"
                          width="100%"
                          height="100%"
                          loading="lazy"
                          data-sizes="auto"
                          data-expand="-20"
                        >

                        <div class="item-head-bg" />
                      </div> <!-- .item-head -->
                      <div class="item-title">
                        {{ hotelCollectiontItem.title[language] }}
                      </div>
                    </a> <!-- .default-item -->
                  </router-link>
                </template>
              </div> <!-- .hotel-collection-wrap -->
            </div> <!-- .hotel-product-card-horizontal__swiper-container -->
          </template>
        </div> <!-- .block-body -->
      </div> <!-- .hotel-collection-block -->
    </div> <!-- .container -->
  </section> <!-- .hotel-collection-section-section -->
</template>

<script>
import {
  _,
  mapState,
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
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
} from '~jsBasePath/vuex/modules/page-info-module';
import {
  onResizeEvent,
  removeOnResizeEvent,
} from '~jsHelperPath/util/PrivateEventCustom';
import {
  getHotelListPath,
} from '~jsHelperPath/util/HandleUrl';
import {
  G2JFirebase,
  G2JDablenaTracking,
} from '~jsHelperPath/util/HandleTracking';
import {
  MIXIN_CONFIG as HOTEL_COLLECTION_MIXIN_CONFIG
} from '../mixin/gallery-wrap';

export default {
  mixins: [
    HOTEL_COLLECTION_MIXIN_CONFIG,
  ],

  data() {
    return {
      IMAGE_URL,
      CACHE_VERSION,
      IS_MOBILE,
      TimeoutHandler: new TimeoutHandler(),

      onResizeFunc: null,

      updateSwiperTimeout: null,

      isUpdateItemListFinish: false,

      itemListSwiper: null,

      swiperContainerReadmoreClass: '',

      slugList: [
        'hotreview',
        'top',
      ],
    }
  },

  computed: {
    ...mapState(PAGE_INFO_MODULE_NAME, {
      language: 'language',
    })
  },

  watch: {
    isUpdateItemListFinish: function() {
      this.updateSwiperTimeout.handle();
    }, // isUpdateItemListFinish()

    itemList() {
      this.formatItemListData();
    }, // hasHotelCollectionListData
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
      'updateHotelCollection',
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

  beforeDestroy () {
    this.updateSwiperTimeout.destroy();
    this.itemListSwiper?.destroy(true, true);

    removeOnResizeEvent(window, this.onResizeFunc);
  },

  methods: {
    isEmpty: _.isEmpty,

    formatItemListData() {
      if(this.hasItems) {
        const self = this;
        const tmpHotelCollectionListFormatted = [];

        self.itemList.forEach(function(item, idx) {
          item.path = getHotelListPath(
            {
              categoryName: self.slugList[idx],
            },
            {
              hotelCollectionSn: item.sn
            }
          );

          const titleSplitted = item.title.split('|');

          item.title = {
            [LANGUAGE_VALID.vi]: titleSplitted[0] || item.title,
            [LANGUAGE_VALID.en]: titleSplitted[1] || titleSplitted[0] || item.title,
          };

          tmpHotelCollectionListFormatted.push(item);
        });

        self.itemListFormatted = [...tmpHotelCollectionListFormatted];
      }

      this.isFormatting = false;
    },

    initSwiper () {
      const self = this;

      if (
        Swiper &&
        this.hasItemsFormatted
      ) {
        self.itemListSwiper = new Swiper('#hotel-collection__wrap-outer', {
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

          on: {
            reachEnd: function () {
              self.swiperContainerReadmoreClass = 'is-readmore-left';
            },
            reachBeginning: function () {
              self.swiperContainerReadmoreClass = 'is-readmore-right';
            },
            sliderMove: function () {
              if (
                !self.itemListSwiper.isEnd &&
                !self.itemListSwiper.isBeginning
              ) {
                self.swiperContainerReadmoreClass = 'is-readmore-both';
              }
            },
          }
        });
      }
    }, // initSwiper()

    checkValidSwiper () {
      const self = this;

      self.curBreakPoint = self.getBreakPointCurrent();

      if (!self.isValidToMakeScroll) {
        if (self.itemListSwiper) {
          self.itemListSwiper.destroy(true, true);
          self.itemListSwiper = null;
        }

        self.swiperContainerReadmoreClass = '';
      } else {
        self.swiperContainerReadmoreClass = 'is-readmore-right';

        if (!self.itemListSwiper) {
          setTimeout(function () {
            self.initSwiper();
          });
        }
      }
    }, // checkValidSwiper()

    getBreakPointCurrent () {
      if (window.matchMedia('(min-width: 748px)').matches) {
        return '748px';
      }

      if (window.matchMedia('(min-width: 640px)').matches) {
        if (
          IS_MOBILE &&
          IS_SAFARI_BROWSER &&
          window.matchMedia('(orientation : landscape)').matches
        ) {
          return '768px';
        }

        return '640px';
      }

      return '320px';
    }, // getbBreakPointCurrent()

    onClickHotelCollectionItem(
      href,
      objTitle
    ) {
      const titleCaseSlug = GenerateTitleCase((GetCustomSlug('', 500))(objTitle[LANGUAGE_VALID.en]));

      G2JFirebase.analytics().logEvent(FIREBASE_TRACKING.TRACKING_PREFIX + titleCaseSlug, {name: ''});
      G2JDablenaTracking(DABLE_TRACKING.TRACKING_SEE_ALL_PREFIX + titleCaseSlug);

      if(href) {
        this.$router.push(href);
      }
    }, // onClickHotelCollectionItem()
  },
};
</script>
