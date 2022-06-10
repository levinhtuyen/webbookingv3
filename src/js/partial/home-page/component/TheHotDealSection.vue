<template>
  <section
    v-if="isShowItemListSection"
    class="hot-deal-section"
  >
    <div class="container">
      <div class="hot-deal-block">
        <div class="block-head">
          <div class="head-main-title">
            {{ $t('home.what_do_you_need') }}
          </div> <!-- .head-main-title -->

          <div class="head-title-field">
            <span class="title-label">
              {{ htmlDecode(detailCollectionInfo.title[language]) }}
            </span>

            <template
              v-if="HAS_MOITAI"
            >
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
                  @click.prevent="trackingReadmoreHotDeal(href)"
                >
                  {{ $t('common.read_more') }}
                </a>
              </router-link>
            </template>

            <template v-else>
              <span
                class="readmore-link"
                :class="{
                  'enable-hover': !IS_MOBILE
                }"
                @click="
                  trackingReadmoreHotDeal(),
                  openDirectAppNoticeModal()
                "
              >
                {{ $t('common.read_more') }}
              </span>
            </template>
          </div> <!-- .head-title-field -->
        </div> <!-- .block-head -->

        <div class="block-body">
          <template v-if="!hasItemsFormatted">
            <div class="hotel-product-card-horizontal__swiper-container">
              <div class="hot-deal-swiper-wrapper">
                <template v-for="idx in fitItemsInView">
                  <G2jHotelProductCardHorizontalLoading
                    :key="idx"
                  />
                </template>
              </div> <!-- .hot-deal-swiper-wrapper -->
            </div> <!-- .hotel-product-card-horizontal__swiper-container -->
          </template>

          <template v-else>
            <div
              id="hot-deal__swiper-container"
              class="hotel-product-card-horizontal__swiper-container swiper-container"
              :class="{
                'has-readmore': isValidToMakeScroll,
                [swiperContainerReadmoreClass]: isValidToMakeScroll
              }"
            >
              <div class="hot-deal-swiper-wrapper swiper-wrapper">
                <template v-for="(hotDealItem, idx) in itemListFormatted">
                  <G2jHotelProductCardHorizontal
                    :key="hotDealItem.sn"
                    :hotel-item-info="hotDealItem"
                    :is-slide="isValidToMakeScroll"
                    :lazy-load-class="itemLazyloadClassList[idx] || ''"
                    :assets-service-url="assetsServiceUrl"
                    :set="isItemListUpdateFinish = (idx + 1 === totalItemsFormatted)"
                    @onRemoveCard="onRemoveCard"
                    @onClickFlashSaleCard="openDirectAppNoticeModal"
                  />
                </template>
              </div> <!-- .hot-deal-swiper-wrapper -->
            </div> <!-- .hotel-product-card-horizontal__swiper-container -->
          </template>
        </div> <!-- .block-body -->
      </div>
    </div> <!-- .container -->

    <TheG2JDirectAppNoticeModal
      :is-show="isShowDirectAppNoticeModal"
      @onCloseModal="closeDirectAppNoticeModal"
    />
  </section> <!-- .hot-deal-section -->
</template>

<script>
import {
  IS_MOBILE,
  LANGUAGE_VALID,
  SWIPER_FREEMODE_CONFIG,
  HAS_MOITAI,
} from '~jsDefinePath/general';
import {
  _,
  he,
  mapState,
} from '~jsLibPath/lib-manager';
import {
  FIREBASE_TRACKING,
  DABLE_TRACKING,
} from '~jsDefinePath/tracking-define';
import {
  getHotelListPath,
} from '~jsHelperPath/util/HandleUrl';
import {
  G2JFirebase,
  G2JDablenaTracking,
} from '~jsHelperPath/util/HandleTracking';
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
} from '~jsBasePath/vuex/modules/page-info-module';
import {
  onResizeEvent,
  removeOnResizeEvent,
} from '~jsHelperPath/util/PrivateEventCustom';
import {
  MIXIN_CONFIG as HOT_DEAL_MIXIN_CONFIG
} from '../mixin/gallery-wrap';
import G2jHotelProductCardHorizontal from '~jsPartialPath/global/component/g2j-hotel-product-card-horizontal/G2jHotelProductCardHorizontal.vue';
import G2jHotelProductCardHorizontalLoading from '~jsPartialPath/global/component/g2j-hotel-product-card-horizontal/G2jHotelProductCardHorizontalLoading.vue';
import TheG2JDirectAppNoticeModal from '~jsPartialPath/global/component/g2j-direct-app-notice-modal/TheG2JDirectAppNoticeModal.vue';

export default {
  components: {
    G2jHotelProductCardHorizontal,
    G2jHotelProductCardHorizontalLoading,
    TheG2JDirectAppNoticeModal,
  },

  mixins: [
    HOT_DEAL_MIXIN_CONFIG
  ],

  props: {
    detailCollectionInfo: {
      default: () => {},
      type: Object,
    },
  },

  data () {
    return {
      IS_MOBILE,
      HAS_MOITAI,
      TimeoutHandler: new TimeoutHandler(),

      readmorePath: getHotelListPath(
        {
          categoryName: GetSlugWithoutDash(this.detailCollectionInfo.title[LANGUAGE_VALID.en]),
        },
        {
          hotelCollectionSn: this.detailCollectionInfo.sn,
        }
      ),

      itemListSwiper: null,
      itemRemovedCount: 0,
      updateSwiperTimeout: null,

      swiperContainerReadmoreClass: '',

      // NOTE - Nếu có từ props vào thì sẽ rơi vào trường hợp bất đồng bộ với mounted event của component => sử dụng isItemListUpdateFinish để đánh dấu sau khi props được update và for in thành công => recheck lại init swiper
      isItemListUpdateFinish: false,

      onResizeFunc: null,

      isShowDirectAppNoticeModal: false,
    }
  },

  computed: {
    ...mapState(PAGE_INFO_MODULE_NAME, {
      language: 'language',
    }),
  },

  watch: {
    isItemListUpdateFinish: function() {
      this.updateSwiperTimeout.handle();
    },

    itemList: function() {
      this.formatItemListData();
    },
  },

  created () {
    const self = this;

    // NOTE - Config minimum items to make scroll each breakpoint of screen
    self.minItemsToScrollEachBreakPoint = {
      '624px': 3,
      '375px': 2,
      '320px': 1,
    };

    self.updateSwiperTimeout = self.TimeoutHandler.init(
      'updateitemListSwiper',
      150,
      self.reInitSwiper
    );

    // NOTE - Format item list if item list is exist
    self.formatItemListData();
  },

  mounted () {
    const self = this;

    self.curBreakPoint = self.getBreakPointCurrent();

    // NOTE - Check to keep / destroy swiper of hot deal on resize event
    self.onResizeFunc = function () {
      self.updateSwiperTimeout.handle();
    };

    self.onResizeFunc = onResizeEvent(window, self.onResizeFunc);
  },

  beforeDestroy() {
    this.updateSwiperTimeout.destroy();
    this.itemListSwiper?.destroy(true, true);

    removeOnResizeEvent(window, this.onResizeFunc);
  },

  methods: {
    isEmpty: _.isEmpty,

    formatItemListData() {
      if(this.hasItems) {
        const tmpHotDealListFormatted = [];

        this.itemList.forEach(function(item) {
          if(item.numOfRoom > 0) {
            tmpHotDealListFormatted.push(item);
          }
        });

        this.itemListFormatted = [...tmpHotDealListFormatted];
      }

      this.isFormatting = false;
    }, // formatItemListData()

    htmlDecode(content) {
      if(!content) {
        return '';
      }

      return he.decode(content);
    }, // htmlDecode()

    getBreakPointCurrent () {
      if (window.matchMedia('(min-width: 624px)').matches) {
        return '624px';
      } else if (window.matchMedia('(min-width: 375px)').matches) {
        return '375px';
      }

      return '320px';
    }, // getBreakPointCurrent()

    reInitSwiper () {
      const self = this;

      self.curBreakPoint = self.getBreakPointCurrent();

      if(!self.isValidToMakeScroll) {
        if(self.itemListSwiper) {
          self.itemListSwiper.destroy(true, true);
          self.itemListSwiper = null;
        }

        self.swiperContainerReadmoreClass = '';
      } else {
        if(!self.itemListSwiper) {
          setTimeout(function() {
            self.initSwiper();
          })
        }
      }
    }, // checkValidSwiperOnResize()

    initSwiper () {
      const self = this;

      self.swiperContainerReadmoreClass = 'is-readmore-right';

      if (
        Swiper &&
        self.hasItemsFormatted
      ) {
        self.itemListSwiper = new Swiper('#hot-deal__swiper-container', {
          ...SWIPER_FREEMODE_CONFIG,
          slidesPerView: 'auto',
          spaceBetween: 0,

          grabCursor: true,

          // Disable preloading of all images
          // preloadImages: true,

          // Enable lazy loading
          lazy: {
            checkInView: true,
            // loadOnTransitionStart: true,
            loadPrevNext: true,
          },

          on: {
            reachEnd: function () {
              self.swiperContainerReadmoreClass = 'is-readmore-left';
            },
            reachBeginning: function () {
              self.swiperContainerReadmoreClass = 'is-readmore-right';
            },
            sliderMove: function (ev) {
              ev.lazy.load();

              if (
                !self.itemListSwiper.isEnd &&
                !self.itemListSwiper.isBeginning
              ) {
                self.swiperContainerReadmoreClass = 'is-readmore-both';
              }
            },

            slideChangeTransitionStart: function(ev) {
              ev.el?.classList.add('disable-click');
            },

            sliderFirstMove: function(ev) {
              setTimeout(function() {
                ev.el?.classList.add('disable-click');
              }, 20)
            },

            slideChangeTransitionEnd: function(ev) {
              ev.el?.classList.remove('disable-click');
            },

            touchEnd: function(ev) {
              ev.el?.classList.remove('disable-click');
            },
          }
        });
      }
    }, // initSwiper()

    onRemoveCard() {
      this.itemRemovedCount++;
    }, // onRemoveCard()

    openDirectAppNoticeModal() {
      this.isShowDirectAppNoticeModal = true;
    }, // openDirectAppNoticeModal()

    closeDirectAppNoticeModal() {
      this.isShowDirectAppNoticeModal = false;
    }, // closeDirectAppNoticeModal()

    trackingReadmoreHotDeal(href) {
      const titleCase = GenerateTitleCase(this.detailCollectionInfo.title[LANGUAGE_VALID.en]);

      G2JFirebase.analytics().logEvent(FIREBASE_TRACKING.TRACKING_PREFIX + (GetCustomSlug('', 500, false))(titleCase));
      G2JDablenaTracking(DABLE_TRACKING.TRACKING_SEE_ALL_PREFIX + (GetCustomSlug('', 500, false))(titleCase));

      if(href) {
        this.$router.push(href);
      }
    }, // trackingReadmoreHotDeal()
  },
};
</script>
