<template>
  <section
    v-if="isShowItemListSection"
    class="gallery-section"
  >
    <div class="container">
      <div class="gallery-block">
        <div class="block-head">
          <div class="head-title-field">
            <span class="title-label">
              {{ $t('home.go2joy_gallery') }}
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
                @click.prevent="trackingReadmoreG2JGallery(href)"
              >
                {{ $t('common.read_more') }}
              </a>
            </router-link>
          </div> <!-- .head-title-field -->
        </div> <!-- .block-head -->

        <div class="block-body">
          <template v-if="!hasItemsFormatted">
            <div class="gallery-wrap-outer disable-readmore">
              <div class="gallery-wrap">
                <template v-for="idx in fitItemsInView">
                  <div
                    :key="idx"
                    class="default-item default-item--loading"
                  >
                    <div class="item-head" />
                  </div> <!-- .default-item -->
                </template>
              </div> <!-- .gallery-wrap -->
            </div> <!-- .gallery-wrap-outer -->
          </template>

          <template v-else>
            <div
              id="gallery__wrap-outer"
              ref="GallerySelectionDefaultWrapOuter"
              class="gallery-wrap-outer swiper-container"
              :class="{
                'has-readmore': isValidToMakeScroll,
                [swiperContainerReadmoreClass]: isValidToMakeScroll
              }"
            >
              <div
                id="gallery__wrap"
                class="gallery-wrap swiper-wrapper"
                :class="{
                  'is-fit': !isValidToMakeScroll,
                }"
              >
                <template v-for="(galleryDefaultItem, idx) in itemListFormatted">
                  <router-link
                    :key="galleryDefaultItem.sn"
                    v-slot="{ href, navigate }"
                    :to="galleryDefaultItem.path[language]"
                    :set="isUpdateItemListFinish = (idx + 1 === totalItemsFormatted)"
                  >
                    <a
                      v-if="!isEmpty(galleryDefaultItem)"
                      :key="galleryDefaultItem.sn"
                      class="default-item swiper-slide"
                      :href="href"
                      @click="navigate"
                    >
                      <div class="item-head">
                        <img
                          :data-src="assetsServiceUrl + '/' + galleryDefaultItem.imagePath"
                          alt=""
                          class="item-img"
                          :class="itemLazyloadClassList[idx] || ''"
                          width="100%"
                          height="100%"
                          loading="lazy"
                          data-sizes="auto"
                          data-expand="-20"
                        >
                      </div> <!-- .item-head -->
                      <div class="item-title">
                        {{ galleryDefaultItem.title }}
                      </div>
                    </a> <!-- .default-item -->
                  </router-link>
                </template>
              </div> <!-- .gallery-wrap -->
            </div> <!-- .gallery-wrap-outer -->
          </template>
        </div> <!-- .block-body -->
      </div> <!-- .gallery-block -->
    </div> <!-- .container -->
  </section> <!-- .gallery-section-section -->
</template>

<script>
import {
  mapState,
  _
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
  getBlogListPagePath,
  getBlogDetailPagePath,
} from '~jsHelperPath/util/HandleUrl';
import {
  G2JFirebase,
  G2JDablenaTracking,
} from '~jsHelperPath/util/HandleTracking';
import {
  onResizeEvent,
  removeOnResizeEvent
}  from '~jsHelperPath/util/PrivateEventCustom';

import {
  MIXIN_CONFIG as GALLERY_MIXIN_CONFIG
} from '../mixin/gallery-wrap';

export default {
  mixins: [
    GALLERY_MIXIN_CONFIG
  ],

  data() {
    return {
      IMAGE_URL,
      CACHE_VERSION,
      IS_MOBILE,
      TimeoutHandler: new TimeoutHandler(),

      onResizeFunc: null,

      isUpdateItemListFinish: false,

      itemListSwiper: null,

      readmorePath: getBlogListPagePath({
        query: null,
      }),

      updateSwiperTimeout: null,

      swiperContainerReadmoreClass: '',
    }
  },

  computed: {
    ...mapState(PAGE_INFO_MODULE_NAME, {
      language: 'language',
    }),
  },

  watch: {
    isUpdateItemListFinish: function() {
      this.updateSwiperTimeout.handle();
    }, // isUpdateItemListFinish()

    itemList: function() {
      this.formatItemListData();
    }, // itemList()
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
      'updateGallerySwiper',
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
        const tmpGalleryListFormatted = [];

        this.itemList.forEach(function(item) {
          item.path = getBlogDetailPagePath(
            {
              blogName: GetSlug(item.title)
            },
            {
              blogSn: item.sn,
            }
          );

          tmpGalleryListFormatted.push(item);
        });

        this.itemListFormatted = [...tmpGalleryListFormatted];
      }

      this.isFormatting = false;
    }, // formatItemListData()

    initSwiper() {
      const self = this;

      if(
        Swiper &&
        self.hasItemsFormatted
      ) {
        self.itemListSwiper = new Swiper('#gallery__wrap-outer', {
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
            reachEnd: function() {
              self.swiperContainerReadmoreClass = 'is-readmore-left';
            },
            reachBeginning: function() {
              self.swiperContainerReadmoreClass = 'is-readmore-right';
            },
            sliderMove: function(ev) {
              ev.lazy.load();

              if(
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

    checkValidSwiper() {
      const self = this;

      self.curBreakPoint = self.getBreakPointCurrent();

      if(!self.isValidToMakeScroll) {
        if(self.itemListSwiper) {
          self.itemListSwiper.destroy(true, true);
          self.itemListSwiper = null;
        }

        self.swiperContainerReadmoreClass = '';
      } else {
        self.galleryDefaultWrapExtendClass = null;
        self.swiperContainerReadmoreClass = 'is-readmore-right';

        if(!self.itemListSwiper) {
          setTimeout(function() {
            self.initSwiper();
          })
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

    trackingReadmoreG2JGallery(href) {
      const titleCase = GenerateTitleCase(this.$i18n.messages?.[LANGUAGE_VALID.en]?.home?.go2joy_gallery);

      G2JFirebase.analytics().logEvent(FIREBASE_TRACKING.TRACKING_PREFIX + (GetCustomSlug('', 500, false))(titleCase));
      G2JDablenaTracking(DABLE_TRACKING.TRACKING_SEE_ALL_PREFIX + (GetCustomSlug('', 500, false))(titleCase));

      if(href) {
        this.$router.push(href);
      }
    }, // trackingReadmoreG2JGallery()
  },
};
</script>
