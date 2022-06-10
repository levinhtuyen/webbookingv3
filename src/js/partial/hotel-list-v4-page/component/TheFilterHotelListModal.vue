<template>
  <transition name="fade">
    <G2jBasicModal
      v-if="isShow"
      :custom-modal-class="'filter-and-sort-modal'"
      :disable-window-scroll="true"
      @close="closeModal"
      @mounted="onModalMounted"
    >
      <template #body-content>
        <div class="modal-content-segment">
          <div
            ref="ModalSwiperContainer"
            class="modal-swiper-container swiper-container"
          >
            <div
              ref="ModalSwiperSwiper"
              class="modal-swiper-wrapper swiper-wrapper"
            >
              <div class="modal-swiper-slide option-group swiper-slide">
                <div class="title-field">
                  {{ paymentMethodFilterList.title[language] }}
                </div> <!-- .title-field -->

                <div
                  v-for="optionItem in paymentMethodFilterList.options"
                  :key="optionItem.value"
                  class="option-item"
                  :class="{
                    'is-active': (
                      (
                        typeof optionSelectedList[paymentMethodFilterList.key] === 'number' &&
                        optionSelectedList[paymentMethodFilterList.key] === optionItem.value
                      ) ||
                      (
                        typeof optionSelectedList[paymentMethodFilterList.key] !== 'number' &&
                        optionItem.value === curPaymentMethod
                      )
                    )
                  }"
                  @click="selectOption(
                    paymentMethodFilterList.key,
                    optionItem.value
                  )"
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

              <div
                v-if="VueSlider"
                class="modal-swiper-slide option-group swiper-slide"
              >
                <div class="title-field">
                  {{ $t('common.price_range') }}
                </div> <!-- .title-field -->

                <!-- NOTE - disable swiper event by using 'swiper-no-swiping' class (https://stackoverflow.com/questions/24030704/swiper-js-with-rangeslider-js-disabling-swiper-js-touch-event-on-rangeslider-j) -->

                <div class="price-range-label-field">
                  <span
                    v-if="minPriceLabel"
                    class="price-label min-price-label"
                    v-html="minPriceLabel"
                  ></span>
                  <span
                    v-if="maxPriceLabel"
                    class="price-label"
                    v-html="maxPriceLabel"
                  ></span>
                  <span class="unit-price-label">
                    vnd
                  </span>
                </div> <!-- .price-range-label-field -->

                <div class="price-range-option-field">
                  <component
                    :is="VueSlider"
                    :class="'swiper-no-swiping'"

                    :min="originMinPrice"
                    :max="originMaxPrice"
                    :drag-on-click="true"
                    :tooltip="'none'"

                    :dot-size="24"

                    :dot-options="{
                      focusStyle: {
                        'box-shadow': 'inset 0px 0px 0px 2px #FD6500',
                      },

                      style: {
                        'box-shadow': 'inset 0px 0px 0px 2px #FD6500',
                      }
                    }"

                    :focus-style="{
                      background: 'red',
                    }"

                    :rail-style="{
                      background: '#E4E4E4',
                      height: '2px',
                    }"

                    :process-style="{
                      background: '#FF6400',
                      height: '2px',
                    }"

                    v-model="priceRangeFilterList"

                    @change="onPriceRangeChange"
                  />
                </div> <!-- .price-range-option-field -->

                <div class="price-range-option-label-row">
                  <span class="label-col">
                    {{ $t('common.min') }}
                  </span> <!-- .label-col -->

                  <span class="label-col">
                    {{ $t('common.max') }}
                  </span> <!-- .label-col -->
                </div> <!-- .price-range-option-label-row -->
              </div>
              <!-- .modal-swiper-slide.option-group -->

              <div class="modal-swiper-slide option-group swiper-slide">
                <div class="title-field">
                  {{ bedSizeFilterList.title[language] }}
                </div> <!-- .title-field -->

                <div
                  v-for="optionItem in bedSizeFilterList.options"
                  :key="optionItem.value"
                  class="option-item"
                  :class="{
                    'is-active': (
                      (
                        typeof optionSelectedList[bedSizeFilterList.key] === 'number' &&
                        optionSelectedList[bedSizeFilterList.key] === optionItem.value
                      ) ||
                      (
                        typeof optionSelectedList[bedSizeFilterList.key] !== 'number' &&
                        optionItem.value === curBedSize
                      )
                    )
                  }"
                  @click="selectOption(
                    bedSizeFilterList.key,
                    optionItem.value
                  )"
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

              <div class="modal-swiper-slide option-group swiper-slide">
                <div class="title-field">
                  {{ viewFilterList.title[language] }}
                </div> <!-- .title-field -->

                <div
                  v-for="optionItem in viewFilterList.options"
                  :key="optionItem.value"
                  class="option-item"
                  :class="{
                    'is-active': (
                      (
                        typeof optionSelectedList[viewFilterList.key] === 'number' &&
                        optionSelectedList[viewFilterList.key] === optionItem.value
                      ) ||
                      (
                        typeof optionSelectedList[viewFilterList.key] !== 'number' &&
                        optionItem.value === curRoomView
                      )
                    )
                  }"
                  @click="selectOption(
                    viewFilterList.key,
                    optionItem.value
                  )"
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

              <div
                v-if="hasFacilitiesFilterOptions"
                class="modal-swiper-slide option-group swiper-slide"
              >
                <div class="title-field">
                  {{ facilitiesFilterList.title[language] }}
                </div> <!-- .title-field -->

                <div
                  v-for="optionItem in facilitiesFilterList.options"
                  :key="optionItem.sn"
                  class="option-item enable-unselect"
                  :class="{
                    'is-active': (
                      typeof optionSelectedList[facilitiesFilterList.key] === 'object' &&
                      optionSelectedList[facilitiesFilterList.key].includes(optionItem.sn)
                    )
                  }"
                  @click="selectFacilityOption(
                    facilitiesFilterList.key,
                    optionItem.sn
                  )"
                >
                  <div class="label-col">
                    {{ optionItem[(language === LANGUAGE_VALID.vi ? 'name' : 'nameEn')] }}
                  </div>

                  <div class="icon-col">
                    <span class="icon-shape">
                      <i class="far fa-check"></i>
                    </span>
                  </div>
                </div> <!-- .option-item -->
              </div> <!-- .modal-swiper-slide.option-group -->
            </div> <!-- .modal-swiper-wrapper -->

            <div
              ref="ModalSwiperScrollbar"
              class="modal-swiper-scrollbar swiper-scrollbar"
            ></div>
          </div> <!-- .modal-swiper-container -->
        </div> <!-- .modal-content-segment -->
      </template> <!-- slot: #body-content -->

      <template #body-control>
        <div class="modal-control-group">
          <button
            class="clear-all-btn"
            @click="resetFilter"
          >
            {{ $t('common.clear_all') }}
          </button>

          <button
            class="apply-btn"
            @click="changeOption"
          >
            {{ $t('common.apply') }}
          </button>
        </div> <!-- .modal-control-group -->
      </template> <!-- slot: #body-control -->
    </G2jBasicModal>
  </transition>
</template>

<script>
import {
  _,
  mapState,
} from '~jsLibPath/lib-manager';
import {
  LANGUAGE_VALID,
  SWIPER_FREEMODE_CONFIG,
} from '~jsDefinePath/general';
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
} from '~jsBasePath/vuex/modules/page-info-module';
import { formatToThounsands } from "~jsHelperPath/util/General";
import {
  MODULE_NAME as HOTEL_LIST_PAGE_MODULE_NAME,
} from '../page-module';
import G2jBasicModal from '~jsPartialPath/global/component/g2j-basic-modal/G2jBasicModal.vue';

export default {
  components: {
    G2jBasicModal,
  },

  props: {
    curPaymentMethod: {
      default: 1,
      type: Number,
    }, // curPaymentMethod

    curBedSize: {
      default: 0,
      type: Number,
    }, // curBedSize

    curRoomView: {
      default: 0,
      type: Number,
    }, // curRoomView

    curFacility: {
      default: [],
      type: new Array,
    }, // curFacility

    curMinPrice: {
      default: 0,
      type: Number,
    }, // curMinPrice

    curMaxPrice: {
      default: 3000000,
      type: Number,
    }, // curMaxPrice

    isShow: {
      default: false,
      type: Boolean,
    }, // isShow
  },

  data() {
    return {
      LANGUAGE_VALID,

      optionSelectedList: {},

      paymentMethodFilterList: {
        title: {
          [LANGUAGE_VALID.vi]: 'Phương thức thanh toán',
          [LANGUAGE_VALID.en]: 'Payment method',
        },

        key: 'paymentMethod',

        options: [
          {
            title: {
              [LANGUAGE_VALID.vi]: 'Mặc định',
              [LANGUAGE_VALID.en]: 'Default',
            },
            value: 1,
          },
          {
            title: {
              [LANGUAGE_VALID.vi]: 'Thanh toán tại khách sạn',
              [LANGUAGE_VALID.en]: 'Pay at hotel',
            },
            value: 2,
          },
          {
            title: {
              [LANGUAGE_VALID.vi]: 'Thanh toán trước',
              [LANGUAGE_VALID.en]: 'Pay in advance',
            },
            value: 3,
          },
        ],
      }, // paymentMethodFilterList

      bedSizeFilterList: {
        title: {
          [LANGUAGE_VALID.vi]: 'Loại giường',
          [LANGUAGE_VALID.en]: 'Bed size',
        },

        key: 'bedType',

        options: [
          {
            title: {
              [LANGUAGE_VALID.vi]: 'Mặc định',
              [LANGUAGE_VALID.en]: 'Default',
            },
            value: 0,
          },
          {
            title: {
              [LANGUAGE_VALID.vi]: 'Giường đơn',
              [LANGUAGE_VALID.en]: 'Single',
            },
            value: 1,
          },
          {
            title: {
              [LANGUAGE_VALID.vi]: 'Giường đôi',
              [LANGUAGE_VALID.en]: 'Double',
            },
            value: 2,
          },
          {
            title: {
              [LANGUAGE_VALID.vi]: '2 giường đơn',
              [LANGUAGE_VALID.en]: 'Twin',
            },
            value: 3,
          },
          {
            title: {
              [LANGUAGE_VALID.vi]: 'Giường ba',
              [LANGUAGE_VALID.en]: 'Triple',
            },
            value: 4,
          },
          {
            title: {
              [LANGUAGE_VALID.vi]: '2 giường đôi',
              [LANGUAGE_VALID.en]: '2 double',
            },
            value: 5,
          },
        ],
      }, // bedSizeFilterList

      viewFilterList: {
        title: {
          [LANGUAGE_VALID.vi]: 'Quang cảnh',
          [LANGUAGE_VALID.en]: 'View',
        },

        key: 'roomView',

        options: [
          {
            title: {
              [LANGUAGE_VALID.vi]: 'Mặc định',
              [LANGUAGE_VALID.en]: 'Default',
            },
            value: 0,
          },
          {
            title: {
              [LANGUAGE_VALID.vi]: 'Cửa sổ',
              [LANGUAGE_VALID.en]: 'Windows',
            },
            value: 1,
          },
          {
            title: {
              [LANGUAGE_VALID.vi]: 'Ban công',
              [LANGUAGE_VALID.en]: 'Balcony',
            },
            value: 2,
          },
          {
            title: {
              [LANGUAGE_VALID.vi]: 'Thành phố',
              [LANGUAGE_VALID.en]: 'City',
            },
            value: 3,
          },
          {
            title: {
              [LANGUAGE_VALID.vi]: 'Vườn',
              [LANGUAGE_VALID.en]: 'Garden',
            },
            value: 4,
          },
          {
            title: {
              [LANGUAGE_VALID.vi]: 'Hồ bơi',
              [LANGUAGE_VALID.en]: 'Pool',
            },
            value: 5,
          },
        ],
      }, // viewFilterList

      facilitiesFilterList: {
        title: {
          [LANGUAGE_VALID.vi]: 'Tiện ích',
          [LANGUAGE_VALID.en]: 'Facilities',
        },

        key: 'facility',

        options: [],
      }, // facilitiesFilterList

      hasFacilitiesFilterOptions: false,

      // NOTE - Price range filter
      VueSlider: (window['vue-slider-component'] || null),

      originMinPrice: 0,
      originMaxPrice: 3000000,

      // NOTE - Format price number to string
      minPriceLabel: ((self) => formatToThounsands(self.curMinPrice))(this),
      maxPriceLabel: ((self) => formatToThounsands(self.curMaxPrice))(this),

      priceRangeFilterList: ((self) => [self.curMinPrice, self.curMaxPrice])(this),
    }
  },

  computed: {
    ...mapState(PAGE_INFO_MODULE_NAME, [
      'language',
    ]),

    ...mapState(HOTEL_LIST_PAGE_MODULE_NAME, [
      'facilityList',
    ]),
  },

  watch: {
    'facilityList.length': function(val) {
      if(val > 0) {
        this.facilitiesFilterList.options = this.facilityList;
        this.hasFacilitiesFilterOptions = true;
      }
    },

    isShow: function(val) {
      if(val) {
        this.optionSelectedList[this.facilitiesFilterList.key] = this.curFacility;

        // NOTE - Format price number to string
        this.minPriceLabel = (this.curMinPrice === this.curMaxPrice ? '' : formatToThounsands(this.curMinPrice));
        this.maxPriceLabel = formatToThounsands(this.curMaxPrice);

        this.priceRangeFilterList = [this.curMinPrice, this.curMaxPrice];
      }
    }, // isShow
  },

  created() {},

  methods: {
    selectOption(key, value) {
      if(
        (
          key === this.paymentMethodFilterList.key &&
          value !== this.curPaymentMethod
        ) ||
        (
          key === this.bedSizeFilterList.key &&
          value !== this.curBedSize
        ) ||
        (
          key === this.viewFilterList.key &&
          value !== this.curRoomView
        )
      ) {
        const _tmpOptionSelectedList = {...this.optionSelectedList};
        _tmpOptionSelectedList[key] = value;

        this.optionSelectedList = _tmpOptionSelectedList;
      } else {
        this.optionSelectedList[key] = undefined;
        delete this.optionSelectedList[key];
      }
    }, // selectOption()

    selectFacilityOption(key, value) {
      const _tmpOptionSelectedList = {...this.optionSelectedList};

      if(typeof _tmpOptionSelectedList[key] !== 'object') {
        _tmpOptionSelectedList[key] = [];
      }

      if(_tmpOptionSelectedList[key].includes(value)) {
        _tmpOptionSelectedList[key].splice(_tmpOptionSelectedList[key].indexOf(value), 1);
      } else {
        _tmpOptionSelectedList[key].push(value);
      }

      this.optionSelectedList = _tmpOptionSelectedList;
    }, // selectFacilityOption()

    resetFilter() {
      // NOTE - Reset filter option select
      this.optionSelectedList = {
        [this.paymentMethodFilterList.key]: 1,
        [this.bedSizeFilterList.key]: 0,
        [this.viewFilterList.key]: 0,
        [this.facilitiesFilterList.key]: [],
      };

      // NOTE - Reset filter price range
      this.priceRangeFilterList = [this.originMinPrice, this.originMaxPrice];
    }, // resetFilter()

    onPriceRangeChange(val) {
      this.minPriceLabel = (val[0] === val[1] ? '' : formatToThounsands(val[0]));
      this.maxPriceLabel = formatToThounsands(val[1]);
    }, // onPriceRangeChagne(val, idx)

    changeOption() {
      if(!_.isEmpty(this.optionSelectedList)) {
        const _tmpOptionSelectedList = {...this.optionSelectedList};

        if(typeof _tmpOptionSelectedList[this.facilitiesFilterList.key] === 'object') {
          _tmpOptionSelectedList[this.facilitiesFilterList.key] = _tmpOptionSelectedList[this.facilitiesFilterList.key].join(',');
        }

        _tmpOptionSelectedList.minPrice = this.priceRangeFilterList[0];
        _tmpOptionSelectedList.maxPrice = this.priceRangeFilterList[1];

        this.$emit('changeOption', _tmpOptionSelectedList);
      }

      this.$emit('update:isShow', false);
      this.optionSelectedList = {};
    }, // changeOption()

    closeModal() {
      this.$emit('update:isShow', false);
      this.optionSelectedList = {};
    }, // closeModal()

    onModalMounted() {
      const self = this;

      new Swiper(self.$refs.ModalSwiperContainer , {
        ...SWIPER_FREEMODE_CONFIG,
        direction: 'vertical',
        slidesPerView: 'auto',
        freeMode: true,
        mousewheel: true,
        observer: true,
        scrollbar: {
          el: self.$refs.ModalSwiperScrollbar,
          draggable: true,
        },
      });
    }, // onModalMounted()
  },
}
</script>
