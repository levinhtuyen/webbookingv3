<template>
  <section
    ref="CategoryFilterSection"
    class="category-filter-section"
  >
    <div class="container">
      <div class="category-filter-block">
        <div
          ref="CategoryFilterSwiperContainer"
          class="category-filter-swiper-container swiper-container"
          :class="{
            'is-hide': !hasProgramBar,
            [swiperInitialDisableClickClass]: swiperInitialDisableClickClass,
            [swiperInitialReadmoreClass]: swiperInitialReadmoreClass,
          }"
        >
          <div class="category-filter-wrap swiper-wrapper">
            <template v-for="categoryItem in categoryList">
              <div
                :key="categoryItem.id"
                v-if="
                  categoryIdOfCollection === 1 ?
                    (
                      categoryItem.id !== 1 &&
                      categoryItem.id !== 2 &&
                      categoryItem.id !== 3
                    ) :
                  categoryIdOfCollection === 10 ?
                    categoryItem.id !== 10 :
                  (
                    categoryIdOfCollection === 0 ||
                    categoryIdOfCollection !== categoryItem.id
                  )
                "
                class="category-filter-item swiper-slide"
                :class="{
                  'is-active': (categoryItem.id === curCategoryId)
                }"
                @click="selectCategory(categoryItem.id)"
              >
                {{ categoryItem.name[language] }}
              </div> <!-- .category-filter-item -->
            </template>
          </div> <!-- .category-filter-wrap -->
        </div> <!-- .category-filter-swiper-container -->

        <div class="filter-and-sort-segment">
          <div
            class="segment-col filter-col"
            :class="{
              'is-active': hasFilter
            }"
            @click="$emit('showFilterModal')"
          >
            <img
              :src="IMAGE_URL + '/icon/filter.svg'"
              alt="category filter"
              class="col-icon"
              width="24"
              height="24"
            > <!-- .col-icon -->

            <span class="col-label">
              {{ $t('common.filter') }}
            </span> <!-- .col-label -->
          </div> <!-- .segment-col -->

          <div
            class="segment-col sort-col"
            :class="{
              'is-active': hasSort
            }"
            @click="$emit('showSortModal')"
          >
            <img
              :src="IMAGE_URL + '/icon/sort.svg'"
              alt="category sort"
              class="col-icon"
              width="24"
              height="24"
            > <!-- .col-icon -->

            <span class="col-label">
              {{ $t('common.sort') }}
            </span> <!-- .col-label -->
          </div> <!--  .segment-col -->
        </div> <!-- .fitler-and-sort-segment -->
      </div> <!-- .category-filter-block -->
    </div> <!-- .container -->
  </section> <!-- .category-filter-section -->
</template>

<script>
import {
  mapState,
} from '~jsLibPath/lib-manager';
import {
  LANGUAGE_VALID,
  SWIPER_FREEMODE_CONFIG,
  IMAGE_URL,
} from '~jsDefinePath/general';
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
} from '~jsBasePath/vuex/modules/page-info-module';
import { ROUTER_NAME } from '~jsBasePath/vue-router/router-define';
import {
  onResizeEvent,
  removeOnResizeEvent,
} from '~jsHelperPath/util/PrivateEventCustom';

export default {
  props: {
    curCategoryId: {
      default: 0,
      type: Number,
    }, // categoryId

    categoryIdOfCollection: {
      default: 0,
      type: Number,
    }, // categoryIdOfCollection

    hasProgramBar: {
      default: false,
      type: Boolean,
    }, // hasProgramBar

    hasSort: {
      default: false,
      type: Boolean,
    }, // hasSort

    hasFilter: {
      default: false,
      type: Boolean,
    }, // hasFilter
  },

  data() {
    return {
      IMAGE_URL,

      categoryList: [
        {
          id: 0,
          name: {
            [LANGUAGE_VALID.vi]: 'Tất cả',
            [LANGUAGE_VALID.en]: 'All',
          },
        },
        {
          id: 9,
          name: {
            [LANGUAGE_VALID.vi]: 'Go2Choice',
            [LANGUAGE_VALID.en]: 'Go2Choice',
          },
        },
        {
          id: 10,
          name: {
            [LANGUAGE_VALID.vi]: 'Chơi TẾT',
            [LANGUAGE_VALID.en]: 'Joy TẾT',
          },
        },
        {
          id: 1,
          name: {
            [LANGUAGE_VALID.vi]: 'Giảm sốc',
            [LANGUAGE_VALID.en]: 'Flash Sale',
          },
        },
        {
          id: 2,
          name: {
            [LANGUAGE_VALID.vi]: 'Ưu đãi đặc biệt',
            [LANGUAGE_VALID.en]: 'Special offer',
          },
        },
        {
          id: 3,
          name: {
            [LANGUAGE_VALID.vi]: 'Ưu đãi',
            [LANGUAGE_VALID.en]: 'Promotion',
          },
        },
        {
          id: 4,
          name: {
            [LANGUAGE_VALID.vi]: 'Nổi bật',
            [LANGUAGE_VALID.en]: 'Hot',
          },
        },
        {
          id: 5,
          name: {
            [LANGUAGE_VALID.vi]: 'Mới',
            [LANGUAGE_VALID.en]: 'New',
          },
        },
        {
          id: 6,
          name: {
            [LANGUAGE_VALID.vi]: 'Tem',
            [LANGUAGE_VALID.en]: 'Stamp',
          },
        },
      ],

      swiperInitial: null,

      isWaitingReInitSwiper: false,

      TimeoutHandler: new TimeoutHandler(),

      resetSwiperTimeout: null,

      swiperInitialDisableClickClass: 'disable-click',
      swiperInitialReadmoreClass: 'is-beginning',
    }
  },

  computed: {
    ...mapState(PAGE_INFO_MODULE_NAME, [
      'language',
    ]),
  },

  watch: {
    '$route.name': function(val) {
      if(val !== ROUTER_NAME['hotel-list-v4-page']) {
        this.swiperInitial?.destroy(true, true);
        this.removeEvent();
        this.isWaitingReInitSwiper = true;
      } else if(this.isWaitingReInitSwiper) {
        this.initSwiper();
        this.setupEvent();
        this.isWaitingReInitSwiper = false;
      }
    },
  },

  created() {
    this.setupEvent();
  },

  mounted() {
    const self = this;

    self.initSwiper();
  },

  methods: {
    setupEvent() {
      const self = this;

      self.resetSwiperTimeout = self.TimeoutHandler.init(
        'resetSwiper_category_filter_section',
        150,
        self.initSwiper
      );

      onResizeEvent(window, self.resetSwiperTimeout.handle);
    }, // setupEvent()

    removeEvent() {
      const self = this;
      self.resetSwiperTimeout?.clear();
      removeOnResizeEvent(window, self.resetSwiperTimeout.handle);
    }, // removeEvent()

    initSwiper() {
      if(
        Swiper &&
        this.$refs.CategoryFilterSwiperContainer
      ) {
        const self = this;

        self.swiperInitial = new Swiper(self.$refs.CategoryFilterSwiperContainer, {
          ...SWIPER_FREEMODE_CONFIG,
          slidesPerView: 'auto',
          spaceBetween: 0,
          // observer: true,

          grabCursor: true,

          // Enable lazy loading
          // lazy: {
          //   checkInView: true,
          //   loadPrevNext: true,
          // },

          on: {
            slideChangeTransitionStart: function() {
              self.swiperInitialDisableClickClass = 'disable-click';
            },

            sliderFirstMove: function() {
              setTimeout(function() {
                self.swiperInitialDisableClickClass = 'disable-click';
              }, 20)
            },

            slideChangeTransitionEnd: function() {
              self.swiperInitialDisableClickClass = null;
            },

            touchEnd: function(ev) {
              self.swiperInitialDisableClickClass = null;
            },

            // reachEnd: function (ev) {
            //   self.swiperInitialReadmoreClass = null;
            // },
            // reachBeginning: function (ev) {
            //   self.swiperInitialReadmoreClass = 'is-beginning';
            // },
            // sliderMove: function (ev) {
            //   if (
            //     !self.swiperInitial.isEnd &&
            //     !self.swiperInitial.isBeginning
            //   ) {
            //     self.swiperInitialReadmoreClass = null;
            //   }
            // },
          }
        });
      }
    }, // initSwiper()

    selectCategory(categoryId) {
      if(categoryId !== this.curCategoryId) {
        this.$emit('changeOption', {
          promotion: categoryId,
        });
      }
    }, // selectCategory()
  },
}
</script>
