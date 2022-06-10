<template>
  <section class="flash-sale-section">
    <div class="flash-sale-block">
      <!-- .block-head -->
      <div class="block-body">
        <div
          ref="FlashSaleSwiperContainer"
          id="flash-sale__swiper-container"
          class="flash-sale-swiper-container swiper-container"
          :class="flashSaleReadmoreClass"
        >
          <div class="flash-sale-swiper-wrapper swiper-wrapper">
            <template v-for="(flashSaleItem, idx) in dataFlashSaleList">
              <BlockRoom
                :key="flashSaleItem.sn"
                :hotel-item-info="flashSaleItem"
                :is-slide="true"
                :lazyloadClass="(minFalseSale <= idx + 1 ? 'swiper-lazy' : 'lazyload')"
                @activeRoom="val => $emit('activeRoom',val)"
                @activeRoomFlashSale="val => $emit('activeRoomFlashSale',val)"
                @soldOutRoom="val => $emit('soldOutRoom',val)"
              />
            </template>
          </div> <!-- .flash-sale-swiper-wrapper -->
        </div> <!-- .flash-sale-swiper-container -->
      </div> <!-- .block-body -->
    </div>
  </section> <!-- .flash-sale-section -->
</template>

<script>
  import {
    IS_MOBILE,
    IS_SAFARI_BROWSER,
  } from '~jsDefinePath/general';
  import {
    _,
  } from '~jsLibPath/lib-manager';
  import { onResizeEvent } from '~jsHelperPath/util/PrivateEventCustom';
  import BlockRoom from './BlockRoom.vue';
  export default {
    name: "FlashSaleList",
    components: {
      BlockRoom,
    },
    props: {
      roomFlashSale: [Array, Object]
    },
    data () {
      return {
        IS_MOBILE,
        value: true,
        flashSaleSwiper: null,

        curBreakPoint: null,

        flashSaleReadmoreClass: 'disable-readmore',

        minFlashSaleToScrollEachBreakPoint: {
          '768px': 2,
          '320px': 1,
        },
      }
    },
    computed: {
      minFalseSale () {
        if (!this.curBreakPoint) {
          return null;
        }

        return this.minFlashSaleToScrollEachBreakPoint[this.curBreakPoint];
      }, // minFalseSale
      dataFlashSaleList () {
        return this.roomFlashSale
      },
    },
    created () { },

    mounted () {
      const self = this;

      // NOTE - Init Swiper for Hot Deal
      const totalFlashSale = (!_.isEmpty(self.dataFlashSaleList) ? self.dataFlashSaleList.length : 0);

      self.curBreakPoint = self.getbBreakPointCurrent();

      if (
        totalFlashSale > self.minFlashSaleToScrollEachBreakPoint[self.curBreakPoint]
      ) {
        self.flashSaleReadmoreClass = 'is-beginning';

        setTimeout(function () {
          self.initSwiper();
        }, 1000);
      }

      // NOTE - Check to keep / destroy swiper of hot deal on resize event

      onResizeEvent(window, function () {
        self.checkValidSwiperOnResize(totalFlashSale);
      });
    },
    methods: {
      isEmpty: _.isEmpty,

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

      checkValidSwiperOnResize (total) {
        this.curBreakPoint = this.getbBreakPointCurrent();

        if (
          total < this.minFlashSaleToScrollEachBreakPoint[this.curBreakPoint]
        ) {
          if (this.flashSaleSwiper) {
            this.flashSaleSwiper.destroy(true, true);
            this.flashSaleSwiper = null;
          }

          this.flashSaleReadmoreClass = 'disable-readmore';
        } else {
          this.flashSaleReadmoreClass = 'is-beginning';

          if (!this.flashSaleSwiper) {
            this.initSwiper();
          }
        }
      }, // checkValidSwiperOnResize()

      initSwiper () {
        const self = this;

        if (
          Swiper &&
          !self.flashSaleSwiper &&
          self.$refs.FlashSaleSwiperContainer
        ) {
          self.flashSaleSwiper = new Swiper('#flash-sale__swiper-container', {
            slidesPerView: 'auto',
            spaceBetween: 15,

            // freeMode: true,
            grabCursor: true,

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
              reachEnd: function () {
                self.flashSaleReadmoreClass = 'is-end';
              },
              reachBeginning: function () {
                self.flashSaleReadmoreClass = 'is-beginning';
              },
              sliderMove: function () {
                if (
                  !self.flashSaleSwiper.isEnd &&
                  !self.flashSaleSwiper.isBeginning
                ) {
                  self.flashSaleReadmoreClass = null;
                }
              },
            }
          });
        }
      }, // initSwiper()
    },
  }
</script>
