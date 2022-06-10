<template>
  <section class="iconic-collection-section">
    <div class="container">
      <div class="iconic-collection-block">
        <div class="iconic-collection-title">
          {{ $t('home.iconic_title') }}
        </div> <!-- .iconic-collection-title -->
        <div
          id="iconic-collection__wrap-outer"
          ref="IconicCollectionWrapOuter"
          class="iconic-collection-wrap-outer swiper-container"
        >
          <div
            id="iconic-collection__wrap"
            class="iconic-collection-wrap swiper-wrapper"
          >
            <router-link
              :to="nearYouInfo.path[language]"
              class="iconic-collection-item swiper-slide"
              @click.native="clickNearYou(nearYouInfo.tracking_name)"
            >
              <div class="item-head">
                <img
                  class="item-img"
                  :src="nearYouInfo.icon_url"
                  :alt="nearYouInfo.title_with_locale[language]"
                >
              </div>
              <div class="item-body">
                <span
                  :key="language"
                  class="item-title"
                >
                  {{ nearYouInfo.title_with_locale[language] }}
                </span>
              </div>
            </router-link>

            <template v-if="hasIconicStatic">
              <router-link
                v-for="iconicStaticItem, idx in iconicStaticList"
                :key="idx"
                v-slot="{ href }"
                :to="iconicStaticItem.path[language]"
              >
                <a
                  class="iconic-collection-item swiper-slide"
                  :href="href"
                  @click.prevent="clickIconicStaticItem(
                    href,
                    iconicStaticItem.tracking_name,
                  )"
                >
                  <div class="item-head">
                    <img
                      class="item-img"
                      :src="iconicStaticItem.icon_url"
                      :alt="iconicStaticItem.title_with_locale[language]"
                    >
                  </div>
                  <div class="item-body">
                    <span
                      :key="language"
                      class="item-title"
                    >
                      {{ iconicStaticItem.title_with_locale[language] }}
                    </span>
                  </div>
                </a> <!-- .iconic-collection-item -->
              </router-link>
            </template>

            <template v-if="isFormatIconicDynamicFinish">
              <router-link
                v-for="iconicDynamicItem, idx in iconicDynamicListFormatted"
                :key="iconicDynamicItem.sn"
                v-slot="{ href, navigate }"
                :to="iconicDynamicItem.path[language]"
                :set="isIconicDynamicRederFinish = (idx + 1 === totalIconicDynamicItem)"
              >
                <a
                  class="iconic-collection-item swiper-slide"
                  :href="href"
                  @click="navigate"
                >
                  <div class="item-head">
                    <img
                      :src="IMAGE_URL + '/g2j-lazy-loading--sm.png?v=' + CACHE_VERSION"
                      :data-src="$assetsServiceUrl + '/' + iconicDynamicItem.imagePath"
                      :alt="iconicDynamicItem.title[language]"
                      class="item-img swiper-lazy lazyload"
                      width="100%"
                      height="100%"
                      loading="lazy"
                      data-sizes="auto"
                    >
                  </div>

                  <div class="item-body">
                    <span class="item-title">
                      {{ iconicDynamicItem.title[language] }}
                    </span>
                  </div>
                </a> <!-- .iconic-collection-item -->
              </router-link>
            </template>
          </div> <!-- .iconic-collection-wrap -->

          <template v-if="enableInitSwiper">
            <div class="iconic-collection-btn iconic-collection-btn--prev">
              <div class="iconic-collection-btn--circle">
                <span class="arrow-icon"></span>
              </div>
            </div> <!-- .iconic-collection-btn--prev -->

            <div class="iconic-collection-btn iconic-collection-btn--next">
              <div class="iconic-collection-btn--circle">
                <span class="arrow-icon"></span>
              </div>
            </div> <!-- .iconic-collection-btn--next -->
          </template>
        </div> <!-- .iconic-collection-wrap-outer -->
      </div> <!-- .iconic-collection-block -->
    </div> <!-- .container -->
  </section> <!-- .iconic-collection-section -->
</template>

<script>
import {
  _,
  he,
  mapState,
} from '~jsLibPath/lib-manager';
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
} from '~jsBasePath/vuex/modules/page-info-module';
import {
  CACHE_VERSION,
  IMAGE_URL,
  LANGUAGE_VALID,
  IS_MOBILE,
  IS_SAFARI_BROWSER,
} from '~jsDefinePath/general';
import {
  DISPATCHER_PARAMS_ID,
} from '~jsPath/define/dispatcher-params-id';
import{
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

export default {
  name: 'TheIconicCollectionSection',

  props: {
    iconicDynamicList: {
      default: new Array,
      type: Array,
    },
  },

  data() {
    return {
      IMAGE_URL,
      nearYouInfo: {
        path: getHotelListPath(
          {
            categoryName: 'nearyou',
          },
          {
            nearBy: 1,
          }
        ),
        icon_url: IMAGE_URL + '/svg/near-you.svg?v=' + CACHE_VERSION,
        title_with_locale: {
          [LANGUAGE_VALID.vi]: 'Gần bạn',
          [LANGUAGE_VALID.en]: 'Near you',
        },
        tracking_name: 'NearYou',
      },

      iconicStaticList: [
        {
          path: getHotelListPath(
            {
              categoryName: 'hourly',
            },
            {
              bookingType: 1,
            },
          ),
          icon_url: IMAGE_URL + '/svg/hourly.svg?v=' + CACHE_VERSION,
          has_onclick: true,
          has_tracking: true,
          title_with_locale: {
            [LANGUAGE_VALID.vi]: 'Theo giờ',
            [LANGUAGE_VALID.en]: 'Hourly',
          },
          tracking_name: 'Hourly',
        },
        {
          path: getHotelListPath(
            {
              categoryName: 'overnight',
            },
            {
              bookingType: 2,
            },
          ),
          icon_url: IMAGE_URL + '/svg/overnight.svg?v=' + CACHE_VERSION,
          has_onclick: true,
          has_tracking: true,
          title_with_locale: {
            [LANGUAGE_VALID.vi]: 'Qua đêm',
            [LANGUAGE_VALID.en]: 'Overnight',
          },
          tracking_name: 'Overnight',
        },
        {
          path: getHotelListPath(
            {
              categoryName: 'daily',
            },
            {
              bookingType: 3,
            },
          ),
          icon_url: IMAGE_URL + '/svg/daily.svg?v=' + CACHE_VERSION,
          has_onclick: true,
          has_tracking: true,
          title_with_locale: {
            [LANGUAGE_VALID.vi]: 'Theo ngày',
            [LANGUAGE_VALID.en]: 'Daily',
          },
          tracking_name: 'Daily',
        },
      ],

      iconicDynamicListFormatted: [],

      isFormatIconicDynamicFinish: false,

      // NOTE - Define maximum of iconic item will be shown in swiper slide view
      maxIconicItemPerView: {
        '768px': 6,
        '640px': 5,
        '500px': 4,
        '480px': 4,
        '425px': 3,
        '375px': 3,
        '320px': 2,
      },

      curMaxIconicItemPerView: 0,

      isSetPersonalLocationInfo: false,

      iconicCollectionSwiper: null,

      isIconicDynamicRederFinish: false,
    };
  },

  computed: {
    ...mapState(PAGE_INFO_MODULE_NAME, {
      language: 'language',
      personalLocationInfo: 'personalLocationInfo',
    }),

    hasIconicStatic() {
      return !_.isEmpty(this.iconicStaticList);
    }, // hasIconicStatic

    hasIconicDynamic() {
      return !_.isEmpty(this.iconicDynamicList);
    }, // hasIconicDynamic

    hasIconicDynamicFormatted() {
      return !_.isEmpty(this.iconicDynamicListFormatted);
    }, // hasIconicDynamicFormatted

    totalIconicStaticItem() {
      if(!this.hasIconicStatic) {
        return 1;
      }

      return this.iconicStaticList.length + 1;
    }, // totalIconicStaticItem

    totalIconicDynamicItem() {
      if(!this.hasIconicDynamicFormatted) {
        return 0;
      }

      return this.iconicDynamicListFormatted.length;
    }, // totalIconicDynmicItem

    totalIconicItem() {
      return this.totalIconicStaticItem + this.totalIconicDynamicItem;
    }, // totalIconicItem

    enableInitSwiper() {
      return (this.totalIconicItem > this.curMaxIconicItemPerView);
    }, // enableInitSwiper
  },

  watch: {
    hasIconicDynamic: function(exist) {
      if(exist) {
        this.formatIconicDynamicList();
      }
    }, // hasIconicDynamic

    isIconicDynamicRederFinish: function(isFinish) {
      if(isFinish) {
        this.iconicCollectionSwiper?.destroy(true, true);
        this.initIconicCollectionSwiper();
      }
    }, // isIconicDynamicRederFinish
  },

  created() {
    const self = this;

    if(self.hasIconicDynamic) {
      self.formatIconicDynamicList();
    }

    // NOTE - setup current maximum swiper slides item per view at current breakpoint
    self.curMaxIconicItemPerView = self.maxIconicItemPerView[self.getBreakPointCurrent()];
  },

  mounted() {
    const self = this;

    if(self.enableInitSwiper) {
      self.initIconicCollectionSwiper();
    }
  },

  methods: {
    formatIconicDynamicList() {
      const self = this;

      self.iconicDynamicList.forEach(function(iconicDynamicItem, idx) {
        self.iconicDynamicListFormatted.push(iconicDynamicItem);

        if(_.isEmpty(self.iconicDynamicListFormatted[idx].title)) {
          self.iconicDynamicListFormatted[idx].title = {
            vi: '',
            en: '',
          };
        } else if(self.iconicDynamicListFormatted[idx].title.includes('|')) {
          const tmpTitleSplitted = self.iconicDynamicListFormatted[idx].title.split('|');

          self.iconicDynamicListFormatted[idx].title = {
            vi: he.decode(tmpTitleSplitted[0].trim()),
            en: he.decode(tmpTitleSplitted[1].trim()),
          };
        } else {
          const tmpTitle = self.iconicDynamicListFormatted[idx].title;

          self.iconicDynamicListFormatted[idx].title = {
            vi: he.decode(tmpTitle.trim()),
            en: he.decode(tmpTitle.trim()),
          };
        }

        const categoryName = GetSlugWithoutDash(self.iconicDynamicListFormatted[idx].title[LANGUAGE_VALID.en]) + '-' + DISPATCHER_PARAMS_ID.G2J_COLLECTION_SN_ID + self.iconicDynamicListFormatted[idx].sn;

        self.iconicDynamicListFormatted[idx].path = getHotelListPath(
          {
            typeName: categoryName,
            categoryName,
          },
        );
      });

      self.isFormatIconicDynamicFinish = true;
    }, // formatIconicDynamicList()

    getBreakPointCurrent () {
      if (window.matchMedia('(min-width: 768px)').matches) {
        return '768px';
      } else if (window.matchMedia('(min-width: 640px)').matches) {
        if (
          IS_MOBILE &&
          IS_SAFARI_BROWSER &&
          window.matchMedia('(orientation : landscape)').matches
        ) {
          return '768px';
        }

        return '640px';
      } else if (window.matchMedia('(min-width: 500px)').matches) {
        return '500px';
      } else if (window.matchMedia('(min-width: 480px)').matches) {
        return '480px';
      } else if (window.matchMedia('(min-width: 425px)').matches) {
        return '425px';
      } else if (window.matchMedia('(min-width: 375px)').matches) {
        return '375px';
      }

      return '320px';
    }, // getBreakPointCurrent()

    clickNearYou(trackingName) {
      if(trackingName) {
        this.trackingIconicEvent(trackingName);
      }

      this.$router.push(this.nearYouInfo.path[this.language]);
    }, // clickNearYou()

    clickIconicStaticItem(
      href,
      trackingName
    ) {
      if(trackingName) {
        this.trackingIconicEvent(trackingName);
      }

      if(href) {
        this.$router.push(href);
      }
    }, // clickIconicStaticItem()

    trackingIconicEvent(trackingName) {
      G2JFirebase.analytics().logEvent(FIREBASE_TRACKING.TRACKING_PREFIX + trackingName, { name: '' });

      G2JDablenaTracking(DABLE_TRACKING.TRACKING_CLICK_ICON_CHOOSE_LOCATION + trackingName);
    }, // trackingIconicEvent()

    initIconicCollectionSwiper() {
      if(
        this.enableInitSwiper &&
        window.Swiper
      ) {
        const self = this;

        self.iconicCollectionSwiper = new Swiper('#iconic-collection__wrap-outer', {
          slidesPerView: 2,
          slidesPerGroup: 2,
          spaceBetween: 0,

          // Disable preloading of all images
          preloadImages: false,

          // Enable lazy loading
          lazy: {
            checkInView: true,
            loadPrevNext: true,
          },

          navigation: {
            prevEl: '.iconic-collection-btn--prev',
            nextEl: '.iconic-collection-btn--next',
          },

          breakpoints: {
            375: {
              slidesPerView: 3,
              slidesPerGroup: 3,
            },

            480: {
              slidesPerView: 4,
              slidesPerGroup: 3,
            },

            640: {
              slidesPerView: 5,
              slidesPerGroup: 3,
            },

            768: {
              slidesPerView: 6,
              slidesPerGroup: 3,
            },
          },
        });
      }
    }, // initIconicCollectionSwiper()
  },
}
</script>
