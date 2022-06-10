<template>
  <section class="booking-type-selection-section">
    <div class="container">
      <div class="booking-type-selection-block">
        <div class="booking-type-selection-wrap">
          <div
            v-for="value, key in bookingTypeOfTimeList"
            :key="key"
            class="booking-type-selection-item"
            :class="{
              'is-disable': value.is_disable,
              'is-active': value.is_active,
            }"
            @click="selectBookingType(value)"
          >
            <span class="icon-shape">
              <img
                class="icon-item"
                :src="value.icon"
                :alt="value.name[language]"
              >
            </span> <!-- .icon-shape -->

            <span class="title-label">
              {{ value.name[language] }}
            </span>
          </div> <!-- .booking-type-selection -->
        </div> <!-- .booking-type-selection-wrap -->
      </div> <!-- .booking-type-selection-block -->
    </div> <!-- .container -->
  </section> <!-- .booking-type-selection-section -->
</template>

<script>
import {
  _,
  mapState,
} from '~jsLibPath/lib-manager';
import {
  LANGUAGE_VALID,
  IMAGE_URL,
  CACHE_VERSION,
} from '~jsDefinePath/general';
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
} from '~jsBasePath/vuex/modules/page-info-module';

export default {
  components: {
    "G2JSelectDateTime": () => import("~jsPartialPath/global/component/g2j-select-date-time/G2JSelectDatetime.vue"),
  },

  props: {
    curBookingTypeId: {
      default: 1,
      type: Number,
    }, // curBookingType

    isFlashSale: {
      default: false,
      type: Boolean,
    }, // isFlashSale
  },

  data() {
    return {
      IMAGE_URL,
      CACHE_VERSION,

      // NOTE - System will hard code three type of time filter for hotel [Hourly, Overnight, Daily]
    }
  },

  computed: {
    ...mapState(PAGE_INFO_MODULE_NAME, [
      'language',
    ]),

    bookingTypeOfTimeList() {
      return [
        {
          is_disable: this.isFlashSale,
          is_active: (
            !this.isFlashSale &&
            this.curBookingTypeId === 1
          ),
          id: 1,
          name: {
            [LANGUAGE_VALID.vi]: 'Theo giờ',
            [LANGUAGE_VALID.en]: 'Hourly',
          },
          icon: (
            !this.isFlashSale ?
              IMAGE_URL + '/svg/hourly.svg' :
            IMAGE_URL + '/svg/hourly--gray.svg'
          )
        },
        {
          is_disable: false,
          is_active: (
            this.isFlashSale ||
            this.curBookingTypeId === 2
          ),
          id: 2,
          name: {
            [LANGUAGE_VALID.vi]: 'Qua đêm',
            [LANGUAGE_VALID.en]: 'Overnight',
          },
          icon: IMAGE_URL + '/svg/overnight.svg'
        },
        {
          is_disable: this.isFlashSale,
          is_active: (
            !this.isFlashSale &&
            this.curBookingTypeId === 3
          ),
          id: 3,
          name: {
            [LANGUAGE_VALID.vi]: 'Theo ngày',
            [LANGUAGE_VALID.en]: 'Daily',
          },
          icon: (
            !this.isFlashSale ?
              IMAGE_URL + '/svg/daily.svg' :
            IMAGE_URL + '/svg/daily--gray.svg'
          )
        },
      ];
    }, // bookingTypeOfTimeList
  },

  created() {},

  methods: {
    selectBookingType(bookingTypeInfo) {
      if(!bookingTypeInfo.is_disable) {
        this.$emit('changeOption', {
          bookingType: bookingTypeInfo.id,
        });
      }
    }, //selectBookingType()
  },
}
</script>
