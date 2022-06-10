<template>
  <section class="article-list-selection-section">
    <div class="container">
      <div class="article-list-selection-block">
        <div class="block-body">
          <div v-if="!isEmpty(dataListArticle)"
            ref="TopPickSelectionDefaultWrapOuter"
            id="article-list-selection-default__wrap-outer"
            class="article-list-selection-default-wrap-outer swiper-container"
            :class="articleDefaultWrapReadmoreClass"
          >
            <div
              id="article-list-selection-default__wrap"
              class="article-list-selection-default-wrap swiper-wrapper"
              :class="articleDefaultWrapExtendClass"
            >
              <template v-for="(articleDefaultItem, idx) in dataListArticle">
                <div
                  :key="idx"
                  class="default-item swiper-slide"
                >
                  <div class="item-head">
                    <router-link
                      :to="articleDefaultItem.path[language]"
                      v-slot="{ href, navigate }"
                    >
                      <a
                        :href="href"
                        @click="navigate"
                      >
                        <!-- <img
                          :src="IMAGE_URL + '/g2j-lazy-loading--sm.png?v=' + CACHE_VERSION"
                          :data-src="`${ASSETS_SERVICE_URL}/${articleDefaultItem.imagePath}`"
                          alt=""
                          class="item-img"
                          :class="(minArticle <= idx + 1 ? 'swiper-lazy' : 'lazyload')"
                          width="100%"
                          height="100%"
                          loading="lazy"
                          data-sizes="auto"
                        > -->
                        <g2j-image
                        :url-img="`${ASSETS_SERVICE_URL}/${articleDefaultItem.imagePath}`"
                        ></g2j-image>
                      </a>
                    </router-link>
                  </div> <!-- .item-head -->
                  <div class="item-body">
                    <span class="title-label">
                      {{ articleDefaultItem.title }}
                    </span>
                  </div> <!-- .item-body -->
                </div> <!-- .default-item -->
              </template>
            </div> <!-- .article-list-selection-default-wrap -->
          </div> <!-- .article-list-selection-default-wrap-outer -->
        </div> <!-- .block-body -->
      </div> <!-- .article-list-selection-block -->
    </div> <!-- .container -->
  </section> <!-- .article-list-section-section -->
</template>

<script>
import {
  _,
  mapState,
} from '~jsLibPath/lib-manager';
import { apiCaller } from '~jsHelperPath/service/ApiHandler';
import {
  IMAGE_URL,
  CACHE_VERSION,
  ASSETS_SERVICE_URL,
  IS_MOBILE,
  IS_SAFARI_BROWSER,
} from '~jsDefinePath/general';
import {
  getToken,
} from "~jsDefinePath/general";
import {
  AJAX_URL
} from '~jsDefinePath/ajax-url';
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
} from '~jsBasePath/vuex/modules/page-info-module';
import {
  getBlogDetailPagePath,
} from '~jsHelperPath/util/HandleUrl';
import { onResizeEvent }  from '~jsHelperPath/util/PrivateEventCustom';

export default {
  data() {
    return {
      IMAGE_URL,
      CACHE_VERSION,
      IS_MOBILE,
      ASSETS_SERVICE_URL,

      articleSelectionSwiper: null,

      minArticleSelectionToScrollEachBreakPoint: {
        '768px': 2,
        '320px': 1,
      },
      curBreakPoint: null,
      articleDefaultWrapExtendClass: null,
      articleDefaultWrapReadmoreClass: 'is-beginning',
      pageSize:10,
      dataListArticle: [
      ],
      totalTopPickSelectionItem: 0
    }
  },

  computed: {
    ...mapState(PAGE_INFO_MODULE_NAME, {
      language: 'language',
    }),

    minArticle() {
      if(!this.curBreakPoint) {
        return null;
      }

      return this.minArticleSelectionToScrollEachBreakPoint[this.curBreakPoint];
    }, // minArticle
  },

  created() {
    const self = this;
    self.id = self.$route.query.blogSn;
    self.getDataArticle()
  },
  methods: {
    isEmpty: _.isEmpty,
    getDataSlide(){
      const self = this;
      // NOTE - Swiper for top pick selection default
      self.curBreakPoint = self.getbBreakPointCurrent();
      if(
        self.totalTopPickSelectionItem < self.minArticleSelectionToScrollEachBreakPoint[self.curBreakPoint]
      ) {
        self.articleDefaultWrapExtendClass = 'is-center';
        self.articleDefaultWrapReadmoreClass = 'disable-readmore';
      } else {
        self.articleDefaultWrapReadmoreClass = 'is-beginning';

        setTimeout(function() {
          self.initSwiper();
        });
      }
      // NOTE - Check to keep / destroy swiper of top pick selection default on resize event
      onResizeEvent(window, function() {
        self.checkValidSwiperOnResize(self.totalTopPickSelectionItem);
      });
    },
    initSwiper() {
      const self = this;

      if(
        Swiper &&
        self.$refs.TopPickSelectionDefaultWrapOuter
      ) {
        self.articleSelectionSwiper = new Swiper('#article-list-selection-default__wrap-outer', {
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
                  loadPrevNextAmount: 1
                },
              },

              768: {
                lazy: {
                  checkInView: true,
                  loadPrevNext: true,
                  loadPrevNextAmount: 2
                },
              },
            },

          on: {
            reachEnd: function() {
              self.articleDefaultWrapReadmoreClass = 'is-end';
            },
            reachBeginning: function() {
              self.articleDefaultWrapReadmoreClass = 'is-beginning';
            },
            sliderMove: function() {
              if(
                !self.articleSelectionSwiper.isEnd &&
                !self.articleSelectionSwiper.isBeginning
              ) {
                self.articleDefaultWrapReadmoreClass = null;
              }
            },
          }
        });
      }
    }, // initSwiper()

    checkValidSwiperOnResize(total) {
      this.curBreakPoint = this.getbBreakPointCurrent();

      if(
        total < this.minArticleSelectionToScrollEachBreakPoint[this.curBreakPoint]
      ) {
        if(this.articleSelectionSwiper) {
          this.articleSelectionSwiper.destroy(true, true);
          this.articleSelectionSwiper = null;
        }

        this.articleDefaultWrapExtendClass = 'is-center';
        this.articleDefaultWrapReadmoreClass = 'disable-readmore';
      } else {
        this.articleDefaultWrapExtendClass = null;
        this.articleDefaultWrapReadmoreClass = 'is-beginning';

        if(!this.articleSelectionSwiper) {
          this.initSwiper();
        }
      }
    }, // checkValidSwiperOnResize()

    getbBreakPointCurrent () {
      if (window.matchMedia('(min-width: 768px)').matches) {
        return '768px';
      } else if (
        window.matchMedia('(min-width: 640px)').matches &&
        IS_MOBILE &&
        IS_SAFARI_BROWSER &&
        window.matchMedia('(orientation : landscape)').matches
      ) {
        return '320px';
      }

      return '320px';
    }, // getbBreakPointCurrent()

    getDataArticle() {
        let self = this
        self.scrollToTop()
        try {
        apiCaller({
            metaUrl: AJAX_URL.blogListLimit.blogList,
            dataType: "json",
            type: "GET",
            headers: {
              Authorization: getToken(),
            },
            data: {
              notDisplaySn:self.id,
              limit: 10
            },
            contentType: "application/json; charset=utf-8",
            success: function (result) {
              if(
                _.isEmpty(result) ||
                result.error ||
                _.isEmpty(result.data) ||
                _.isEmpty(result.data.arlicles)
              ) {
                return;
              }

              let data = result.data

              const tmpDataListArticle = [];

              data.arlicles.forEach(function(item) {
                item.path = getBlogDetailPagePath(
                  {
                    blogName: GetSlug(item.title)
                  },
                  {
                    blogSn: item.sn,
                  }
                );

                tmpDataListArticle.push(item);
              });

              self.dataListArticle = tmpDataListArticle;
              self.totalTopPickSelectionItem = self.dataListArticle.length + 1;

              self.getDataSlide();
            },
            error: function (error) {
                console.log('error :>> ', error);
            }

        });
        } catch(err) {
        console.log(err);
      }

    }, // getDataArticle()

    /**
     * NOTE - link reference
     * https://gist.github.com/andjosh/6764939
    */
    autoScrollTopAnimation(to, duration) {
      const
      element = document.scrollingElement || document.documentElement,
      start = element.scrollTop,
      change = to - start,
      startDate = +new Date(),
      // t = current time
      // b = start value
      // c = change in value
      // d = duration
      easeInOutQuad = function(t, b, c, d) {
          t /= d/2;
          if (t < 1) return c/2*t*t + b;
          t--;
          return -c/2 * (t*(t-2) - 1) + b;
      },
      animateScroll = function() {
          const currentDate = +new Date();
          const currentTime = currentDate - startDate;
          element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration));
          if(currentTime < duration) {
              requestAnimationFrame(animateScroll);
          }
          else {
              element.scrollTop = to;
          }
      };
      animateScroll();
    }, // autoScrollTopAnimation()

    scrollToTop () {
      const self = this;
      self.autoScrollTopAnimation(
        0,
        500
      );
    }, // scrollToTop()
  },
};
</script>
