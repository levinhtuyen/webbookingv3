<template>
  <section class="hotel-list-section">
    <div class="container">
      <div
        v-if="hasHotelList"
        class="hotel-list-block"
      >
        <div class="hotel-list-wrap">
          <LightSquareHotelCard
            v-for="itemInfo, idx in itemList"
            :key="itemInfo.sn"
            :is-disable-invalid="false"
            :info="{
              ...itemInfo,
              order: (idx + 1),
              total: itemList.length,
            }"
            :info-update="hotelListAfterGetDisplayRule[itemInfo.sn]"
            :filter-times="filterTimes"
            @mounted="onCardMounted"
          />
        </div> <!-- .hotel-list-wrap -->
      </div> <!-- .hotel-list-block -->

      <div
        v-else
        class="hotel-list-empty-block"
      >
        <div class="empty-content">
          <img
            :src="IMAGE_URL + '/svg/no-result.svg'"
            :alt="noResultWithLocale.main[language]"
            class="hotel-list-empty-img"
            width="100%"
            height="100%"
          >
          <div class="main-empty-label">
            {{ noResultWithLocale.main[language] }}
          </div> <!-- .main-empty-label -->

          <div class="sub-empty-label">
            {{ noResultWithLocale.sub[language] }}
          </div> <!-- .sub-empty-label -->
        </div> <!-- .empty-content -->
      </div> <!-- .hotel-list-empty-block -->

      <slot name="infinite-loading" />
    </div> <!-- .container -->
  </section> <!-- .hotel-list-section -->
</template>

<script>
import {
  _,
  mapState,
} from '~jsLibPath/lib-manager';
import {
  LANGUAGE_VALID,
  IMAGE_URL,
} from '~jsDefinePath/general';
import {
  AJAX_URL,
} from '~jsDefinePath/ajax-url';
import { ROUTER_NAME } from '~jsBasePath/vue-router/router-define';
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
} from '~jsBasePath/vuex/modules/page-info-module';
import {
  MODULE_NAME as HOTEL_LIST_PAGE_MODULE_NAME,
} from '../page-module';
import LightSquareHotelCard from './LightSquareHotelCard.vue';
import {
  apiCaller,
} from '~jsHelperPath/service/ApiHandler';

export default {
  components: {
    LightSquareHotelCard,
  },

  props: {
    // isReset: {
    //   default: false,
    //   type: Boolean,
    // },
    // isReset

    itemList: {
      default: new Array,
      type: Array,
    }, // itemList

    isFirstSetupData: {
      default: false,
      type: Boolean,
    }, // isFirstSetupData

    dayCheckIn: {
      default: null,
      type: new Object,
    }, // dayCheckIn

    dayCheckOut: {
      default: null,
      type: new Object,
    }, // dayCheckOut
  },

  data() {
    return {
      IMAGE_URL,

      invalidItemList: [],
      filterTimes: 0,

      // NOTE - Array<number>
      snListToGetFinalPrice: [],

      // NOTE - new Object {[key]: new Object}
      hotelListAfterGetDisplayRule: {},

      // NOTE - objRequestGetDisplayRule
      objRequestGetDisplayRule: {
        hotelSnList: '',
        checkIn: '',
        checkOut: '',
      },

      noResultWithLocale: {
        main: {
          [LANGUAGE_VALID.vi]: 'Chúng tôi không tìm thấy khách sạn ở khu vực này',
          [LANGUAGE_VALID.en]: 'There are no hotels near you',
        },
        sub: {
          [LANGUAGE_VALID.vi]: 'Vui lòng tìm khách sạn ở khu vực khác',
          [LANGUAGE_VALID.en]: 'Please try other location',
        },
      }, // noResultWithLocale
    }
  },

  computed: {
    ...mapState(PAGE_INFO_MODULE_NAME, [
      'language',
    ]),

    ...mapState(HOTEL_LIST_PAGE_MODULE_NAME, [
      'objQueryString'
    ]),

    hasHotelList() {
      return (
        !this.isFirstSetupData &&
        !_.isEmpty(this.itemList)
      );
    }, // hasHotelList
  },

  watch: {
    // isReset: function(newVal, oldVal) {
    //   if(
    //     newVal !== oldVal &&
    //     newVal
    //   ) {
    //     this.filterTimes = 0;
    //     this.invalidItemList = [];
    //     this.finalPriceList = {};
    //   }
    // }, // isReset()

    objQueryString: function(newVal, oldVal) {
      if(
        this.$route.name === ROUTER_NAME['hotel-list-v4-page'] &&
        JSON.stringify(newVal) !== JSON.stringify(oldVal)
      ) {
        this.filterTimes++;
      }
    },
  },

  created() {
    const self = this;

    self.formatDayRequestInfo();
  },

  methods: {
    formatDayRequestInfo() {
      // NOTE - format request object date info for agoda
      this.objRequestGetDisplayRule.checkIn = (this.dayCheckIn ? this.dayCheckIn : dayjs());
      this.objRequestGetDisplayRule.checkOut = (this.dayCheckOut ? this.dayCheckOut : this.objRequestGetDisplayRule.checkIn);

      if(this.objRequestGetDisplayRule.checkOut.diff(this.objRequestGetDisplayRule.checkIn, 'day') < 1) {
        this.objRequestGetDisplayRule.checkOut = this.objRequestGetDisplayRule.checkIn.add(1, 'day');
      }

      this.objRequestGetDisplayRule.checkIn=this.objRequestGetDisplayRule.checkIn.format('YYYY-MM-DD');
      this.objRequestGetDisplayRule.checkOut=this.objRequestGetDisplayRule.checkOut.format('YYYY-MM-DD');
    }, // formatDayRequestInfo()

    onCardMounted(objRes) {
      if(!objRes.is_valid) {
        this.invalidItemList.push(objRes.info);
      } else if(
        objRes.info.origin === 2 &&
        !objRes.info.roomAvailable
      ) {
        this.snListToGetFinalPrice.push(Number(objRes.info.sn));
      }

      if(objRes.is_finish_render_list) {
        if(this.snListToGetFinalPrice.length) {
          const _objRquest = {...this.objRequestGetDisplayRule};

          _objRquest.hotelSnList = this.snListToGetFinalPrice.join(',');

          this.getAjaxDisplayRule(_objRquest);

          this.snListToGetFinalPrice = [];
        }
      }
    }, // onCardMounted()

    getAjaxDisplayRule(objRequest) {
      if(!_.isEmpty(objRequest)) {
        const self = this;

        apiCaller({
          metaUrl: AJAX_URL.hotel_v4.getDisplayRule,
          data: objRequest,
          method: 'GET',
          dataType: 'json',
          error () {},

          success (objResponse) {
            if(
              _.isEmpty(objResponse) ||
              objResponse.error ||
              _.isEmpty(objResponse.data)
            ) {
              return;
            }

            const _tmpHotelListAfterGetDisplayRule = {...self.hotelListAfterGetDisplayRule};

            objResponse.data.forEach(function(hotelInfoUpdate) {
              _tmpHotelListAfterGetDisplayRule[hotelInfoUpdate.sn] = hotelInfoUpdate;
            });

            self.hotelListAfterGetDisplayRule = _tmpHotelListAfterGetDisplayRule;
          },
        });
      }
    }, // getAjaxDisplayRule()
  }
}
</script>
