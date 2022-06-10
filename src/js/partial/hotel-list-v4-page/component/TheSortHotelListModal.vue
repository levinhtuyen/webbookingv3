<template>
  <transition name="fade">
    <G2jBasicModal
      v-if="isShow"
      :custom-modal-class="'filter-and-sort-modal hotel-list-sort-modal'"
      :disable-window-scroll="true"
      @close="closeModal"
    >
      <template #head-title>
        {{ $t('common.sort_by') }}
      </template> <!-- slot: #head-title -->

      <template #body-content>
        <div class="modal-content-segment sort-content-segment">
          <div
            ref="ModalSwiperContainer"
            class="modal-swiper-container swiper-container"
          >
            <div class="modal-swiper-wrapper swiper-wrapper">
              <div class="modal-swiper-slide option-group swiper-slide">
                <div
                  v-for="optionItem in sortOptionsList"
                  :key="optionItem.value"
                  class="option-item"
                  :class="{
                    'is-active': optionItem.value === curSort
                  }"
                  @click="selectOption(optionItem.value)"
                >
                  <div class="label-col">
                    {{ optionItem.title[language] }}
                  </div>

                  <div class="icon-col">
                    <span class="icon-shape">
                      <i class="far fa-check"></i>
                    </span>
                  </div>
                </div> <!-- .option-item -->
              </div> <!-- .modal-swiper-slide.option-group -->
            </div> <!-- .modal-swiper-wrapper -->
          </div> <!-- .modal-swiper-container -->
        </div> <!-- .modal-content-segment -->
      </template> <!-- slot: #body-content -->
    </G2jBasicModal>
  </transition>
</template>

<script>
import {
  mapState,
} from '~jsLibPath/lib-manager';
import {
  LANGUAGE_VALID,
} from '~jsDefinePath/general';
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
} from '~jsBasePath/vuex/modules/page-info-module';
import G2jBasicModal from '~jsPartialPath/global/component/g2j-basic-modal/G2jBasicModal.vue';

export default {
  components: {
    G2jBasicModal,
  },

  props: {
    curSort: {
      default: 0,
      type: Number,
    }, // curPaymentMethod

    isShow: {
      default: false,
      type: Boolean,
    }, // isShow
  },

  data() {
    return {
      sortOptionsList: [
        {
          title: {
            [LANGUAGE_VALID.vi]: 'Khoảng cách',
            [LANGUAGE_VALID.en]: 'Distance',
          },
          value: 1,
        },
        {
          title: {
            [LANGUAGE_VALID.vi]: 'Giá tăng dần',
            [LANGUAGE_VALID.en]: 'Price increasing',
          },
          value: 2,
        },
        {
          title: {
            [LANGUAGE_VALID.vi]: 'Giá giảm dần',
            [LANGUAGE_VALID.en]: 'Price descreasing',
          },
          value: 3,
        },
        {
          title: {
            [LANGUAGE_VALID.vi]: 'Đánh giá và bình luận về khách sạn',
            [LANGUAGE_VALID.en]: 'Rating & Review of hotel',
          },
          value: 4,
        },
      ], // sortOptionsList
    }
  },

  computed: {
    ...mapState(PAGE_INFO_MODULE_NAME, [
      'language',
    ]),
  },

  created() {

  },

  mounted() {
    const self = this;

    new Swiper(self.$refs.ModalSwiperContainer , {
      direction: 'vertical',
      slidesPerView: 'auto',
      freeMode: true,
      grabCursor: true,
      mousewheel: true,
    });
  },

  methods: {
    selectOption(sortOption) {
      if(sortOption !== this.curSort) {
        this.$emit('changeOption', {
          sort: sortOption
        });

        this.$emit('update:isShow', false);
      }
    }, // selectOption()

    closeModal() {
      this.$emit('update:isShow', false);
    }, // closeModal()
  },
}
</script>
