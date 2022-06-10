<template>
<div class="go2joy">
    <div class="go2joy__user">
      <p class="go2joy__user--border">
        <span class="confirmed" v-if="myBookingDetail.bookingStatus == 1">{{ $t('status.booked') }}</span>
        <span class="checked-in" v-else-if="myBookingDetail.bookingStatus == 2">{{ $t('status.checked_in') }}</span>
        <span class="cancelled" v-else-if="myBookingDetail.bookingStatus == 3">{{ $t('status.cancelled') }}</span>
        <span class="noshow" v-else-if="myBookingDetail.bookingStatus == 4">{{ $t('status.no_show') }}</span>
        <span class="spending" v-else-if="myBookingDetail.bookingStatus == 6">{{ $t('status.waiting_for_payment') }}</span>
        
        <span class="spending" v-if="myBookingDetail.bookingStatus == 0 && myBookingDetail.paymentProvider == 20">{{ $t('status.waiting_for_payment') }}</span>
        <span class="status-error" v-else-if="myBookingDetail.bookingStatus == 0 && myBookingDetail.paymentProvider != 20">{{ $t('status.error') }}</span>
      </p>
      <h2>{{ myBookingDetail.hotelName }}</h2>
      <p class="go2joy__user--address">
        <i class="fas fa-map-marker-alt"></i>
        <span>{{ myBookingDetail.hotelAddress }}</span>
      </p>

      <p class="line"></p>

      <div class="go2joy__user--flex">
        <p>{{ $t('my_booking_detail_page.booking_id') }}</p>
        <p class="bold">{{ myBookingDetail.bookingNo }}</p>
      </div>
      <div class="go2joy__user--flex">
        <p>{{ $t('my_booking_detail_page.booking_time') }}</p>
        <p class="bold">{{ getHHmmDDMMYYYY(myBookingDetail.createTime) }}</p>
      </div>

      <div class="go2joy__user--table">
        <table>
          <tr>
            <td>
              <p>{{ $t('my_booking_detail_page.check_in') }}</p>
              <p class="bold datetime">
                <span class="f-1-25em">{{ myBookingDetail.startTime }}</span>
                <span>{{ getDDMMYYYY(myBookingDetail.checkInDatePlan) }}</span>
              </p>
            </td>
            <td>
              <p>{{ $t('my_booking_detail_page.check_out') }}</p>
              <p class="bold datetime">
                <span class="f-1-25em">{{ myBookingDetail.endTime }}</span>
                <span>{{ getDDMMYYYY(myBookingDetail.endDate) }}</span>
              </p>
            </td>
          </tr>
        </table>
      </div>

      <div class="go2joy__user--flex">
        <p>{{ $t('my_booking_detail_page.booking_type') }}</p>
        <p class="bold" v-if="myBookingDetail.type == 1">{{ $t('status.hourly') }}</p>
        <p class="bold" v-else-if="myBookingDetail.type == 2">{{ $t('status.overnight') }}</p>
        <p class="bold" v-else>{{ $t('status.daily') }}</p>
      </div>
      <div class="go2joy__user--flex">
        <p>{{ $t('my_booking_detail_page.hotel_name') }}</p>
        <p class="bold">{{ myBookingDetail.hotelName }}</p>
      </div>
      <div class="go2joy__user--flex">
        <p>{{ $t('my_booking_detail_page.room_type') }}</p>
        <p class="bold">{{ myBookingDetail.roomTypeName }}</p>
      </div>

      <p class="line"></p>

      <div class="go2joy__user--flex">
        <p>{{ $t('my_booking_detail_page.nickname') }}</p>
        <p class="bold">{{ myBookingDetail.appUserNickName }}</p>
      </div>
      <div class="go2joy__user--flex">
        <p>{{ $t('my_booking_detail_page.mobile') }}</p>
        <p class="bold">{{ myBookingDetail.mobile }}</p>
      </div>
    </div>

    <p class="line-3x"></p>

    <div class="go2joy__payment">
      <h2>{{ $t('my_booking_detail_page.payment') }}</h2>
      <p class="line"></p>

      <div class="go2joy__user--flex">
        <p>{{ $t('my_booking_detail_page.hotel_fee') }}</p>
        <p class="bold">{{ $formatlowestPrice(myBookingDetail.hotelFee) }} đ</p>
      </div>
      <div class="go2joy__user--flex">
        <p>{{ $t('my_booking_detail_page.high_demand') }}</p>
        <p class="bold">{{ myBookingDetail.highDemand ? `+${$formatlowestPrice(myBookingDetail.highDemand)}` : 0 }}đ</p>
      </div>
      <div class="go2joy__user--flex">
        <p>{{ $t('my_booking_detail_page.discount') }}</p>
        <p class="bold">{{ myBookingDetail.totalDiscount ? `-${$formatlowestPrice(myBookingDetail.totalDiscount)}` : 0 }}đ</p>
      </div>

      <div class="go2joy__user--flex">
        <p>{{ $t('my_booking_detail_page.stamp_redeem') }}</p>
        <p class="bold">{{ myBookingDetail.stamp ? `-${$formatlowestPrice(myBookingDetail.stamp)}` : 0 }}đ</p>
      </div>

      <div class="go2joy__user--flex">
        <p>{{ $t('my_booking_detail_page.point_redeem') }}</p>
        <p class="bold">{{ myBookingDetail.point ? `-${$formatlowestPrice(myBookingDetail.point)}` : 0 }}đ</p>
      </div>

      <p class="line"></p>
      <div class="go2joy__user--flex">
        <h2>{{ $t('my_booking_detail_page.total') }}</h2>
        <p class="text-g2j ft-4x">{{ $formatlowestPrice(myBookingDetail.totalPrice) }}đ</p>
      </div>
      <p class="line"></p>

      <div class="go2joy__user--flex">
        <p>{{ $t('my_booking_detail_page.payment_status') }}</p>
        <p class="bold" v-if="myBookingDetail.paymentStatus === 0">{{ $t('my_booking_detail_page.waiting_for_payment') }}</p>
        <p class="bold" v-else-if="myBookingDetail.paymentStatus === 1">{{ $t('my_booking_detail_page.payment_finished') }}</p>
        <p class="bold" v-else>{{ $t('my_booking_detail_page.payment_error') }}</p>
      </div>

      <div class="go2joy__user--flex">
        <p>{{ $t('my_booking_detail_page.payment_method') }}</p>
        <p class="bold" v-if="myBookingDetail.paymentProvider == -1">N/A</p>
        <p class="bold" v-else-if="myBookingDetail.paymentProvider == 0">{{ $t('my_booking_detail_page.pay_at_hotel') }}</p>
        <p class="bold" v-else-if="myBookingDetail.paymentProvider == 3">{{ $t('my_booking_detail_page.momo_e_Wallet') }}</p>
        <p class="bold" v-else-if="myBookingDetail.paymentProvider == 10">{{ $t('my_booking_detail_page.onePay_credit') }}</p>
        <p class="bold" v-else-if="myBookingDetail.paymentProvider == 11">{{ $t('my_booking_detail_page.onpay_debit') }}</p>
        <p class="bold" v-else-if="myBookingDetail.paymentProvider == 20">
          {{ $t('my_booking_detail_page.payoo') }}
          <span v-if="myBookingDetail.paymentCode" class="block-payment">{{ myBookingDetail.paymentCode }}</span>
        </p>
        <p class="bold" v-else-if="myBookingDetail.paymentProvider == 41">{{ $t('my_booking_detail_page.credit_card') }}</p>
        <p class="bold" v-else-if="myBookingDetail.paymentProvider == 42">{{ $t('my_booking_detail_page.atm_card') }}</p>
        <p class="bold" v-else-if="myBookingDetail.paymentProvider == 50">{{ $t('my_booking_detail_page.shopee_pay') }}</p>
        <p class="bold" v-else-if="myBookingDetail.paymentProvider == 60">{{ $t('my_booking_detail_page.zalo_pay') }}</p>
      </div>
    </div>

    <p class="line-3x" v-if="myBookingDetail.donateCoupon || myBookingDetail.bonusHour || myBookingDetail.giftDescription"></p>

    <div class="go2joy__policy" v-if="myBookingDetail.donateCoupon || myBookingDetail.bonusHour || myBookingDetail.giftDescription">
      <h2>{{ $t('my_booking_detail_page.enjoy_benefits') }}</h2>
      
      <div class="go2joy__policy--group" v-if="myBookingDetail.donateCoupon">
        <h2>{{ $t('my_booking_detail_page.coupon') }}</h2>

          <div class="go2joy__policy--logo">
            <img :src="IMAGE_URL + '/logo/coupons.png?v=' + CACHE_VERSION" width="100%" height="100%">
            <p v-show="language === 'en'">
              You will receive {{ myBookingDetail.donateCoupon.afterDiscount }} 
              coupon discount {{ myBookingDetail.donateCoupon.discountType === 1 ? `${$formatlowestPrice(myBookingDetail.donateCoupon.discount)}đ` : `${myBookingDetail.donateCoupon.discount}%` }} when check-in 
              {{ myBookingDetail.donateCoupon.numCheckin }} times at hotels in the list. Don’t forget to check-in, buddy!
            </p>
            <p v-show="language !== 'en'">
              <span v-if="myBookingDetail.donateCoupon.numCheckin > 1">
                Nhớ check-in phòng này đủ {{ myBookingDetail.donateCoupon.numCheckin }} lần để nhận ngay {{ myBookingDetail.donateCoupon.afterDiscount }} 
                coupon giảm giá {{ myBookingDetail.donateCoupon.discountType === 1 ? `${$formatlowestPrice(myBookingDetail.donateCoupon.discount)}đ` : `${myBookingDetail.donateCoupon.discount}%` }} nha bạn ơi!
              </span>
              <span v-else>
                Nhớ check-in phòng này để nhận ngay coupon giảm giá {{ myBookingDetail.donateCoupon.discountType === 1 ? `${$formatlowestPrice(myBookingDetail.donateCoupon.discount)}đ` : `${myBookingDetail.donateCoupon.discount}%` }} cho lần tiếp theo nha bạn ơi!
              </span>
            </p>
          </div>
      </div>

       <div class="go2joy__policy--group" v-if="myBookingDetail.bonusHour">
        <h2>{{ $t('my_booking_detail_page.addition_hours') }}</h2>
        <div class="go2joy__policy--logo">
          <img :src="IMAGE_URL + '/logo/additionhours.png?v=' + CACHE_VERSION" width="100%" height="100%">
          <p v-show="language === 'en'">
            You have {{ myBookingDetail.bonusHour }} free hour(s) for this booking. Your booking will start from {{ myBookingDetail.startTime }} ~ {{ Number(myBookingDetail.endTime.split(':')[0]) + Number(myBookingDetail.bonusHour) +':'+myBookingDetail.endTime.split(':')[1] }}
          </p>
          <p v-show="language !== 'en'">
            Bạn được tặng thêm {{ myBookingDetail.bonusHour }} giờ miễn phí cho phòng này. Lưu ý đặt phòng của bạn sẽ bắt đầu từ {{ myBookingDetail.startTime }} ~ {{ Number(myBookingDetail.endTime.split(':')[0]) + Number(myBookingDetail.bonusHour) +':'+myBookingDetail.endTime.split(':')[1] }}
          </p>
        </div>
      </div>

      <div class="go2joy__policy--group" v-if="myBookingDetail.giftDescription">
        <h2>{{ $t('my_booking_detail_page.special_gift') }}</h2>
        <div class="go2joy__policy--logo">
          <g2j-image
            :url-img="`${ASSETS_SERVICE_URL}/${myBookingDetail.giftImagePath}`"
          >
          </g2j-image>
          <div>
            <p>{{ $t('my_booking_detail_page.sub_special_gift') }}</p>
                {{ $t('my_booking_detail_page.click_to_see_detail') }}
          </div>
        </div>
      </div>

    </div>

    <div class="go2joy__button" v-if="showButtonCancel(myBookingDetail)">
      <button type="submit" @click="cancelButton">{{ $t('my_booking_detail_page.cancel_booking') }}</button>
    </div>

    <model
        ref="filter-modal"
        :filter.sync="filter"
        @apply="applyFilter"
      >
    </model>
    <modal-cancel-success ref="filter-modal-cancel-success"></modal-cancel-success>
    <modal-cancel-error
      ref="filter-modal-cancel-error"
      :messageErrors="messageErrors"
    ></modal-cancel-error>
  </div>
</template>

<script>
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import { IMAGE_URL, getToken, CACHE_VERSION } from "~jsDefinePath/general";
  import { getDDMMYYYY, getHHmmDDMMYYYY } from "~jsPath/helper/util/formatDate";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import Model from "./Modal.vue";
  import ModalCancelSuccess from "./ModalCancelSuccess.vue";
  import ModalCancelError from "./ModalCancelError.vue";
  import { _, mapState, mapGetters } from "~jsLibPath/lib-manager";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from '~jsBasePath/vuex/modules/page-info-module';
  import { ASSETS_SERVICE_URL } from "~jsDefinePath/general";

  export default {
    props: {
      myBookingDetail: {
        type: Array,
        default: []
      },
    },
    components: { 
      Model, 
      ModalCancelSuccess, 
      ModalCancelError,
      "g2j-image": () =>
      import("~jsPartialPath/global/component/g2j-img/Go2JoyImages.vue"),
    },
    data() {
      return {
        ASSETS_SERVICE_URL,
        CACHE_VERSION,
        IMAGE_URL,
        hasFilter: true,
        messageErrors: [],
      };
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: 'language',
      }),
      ...mapGetters(PAGE_INFO_MODULE_NAME, {
        hasUserInfo: 'hasUserInfo',
      }),
      total: function () {
        return this.myBookingDetail;
      },
    },

    methods: {
      getDDMMYYYY,
      getHHmmDDMMYYYY,
      getTimeHHmm(time) {
        return time ? time.slice(0, 5) : "";
      }, // getTimeHHmm

      getLogo() {
        switch (this.myBookingDetail.paymentProvider) {
          case 0: {
            return "icon/payment/hotelpay.svg";
          }
          case 3: {
            return "icon/payment/momo.svg";
          }
          case 10: {
            return "icon/payment/onepay.svg";
          }
          case 11: {
            return "icon/payment/onepay.svg";
          }
          case 20: {
            return "icon/payment/payoo.svg";
          }
          case 41: {
            return "icon/payment/epay.svg";
          }
          case 42: {
            return "icon/payment/epay.svg";
          }
          case 60: {
            return "icon/payment/zalopay.svg";
          }
        }
      }, // getLogo

      showButtonCancel(myBookingDetail) {
        if (
          myBookingDetail.bookingStatus === 4 ||
          myBookingDetail.bookingStatus === 3 ||
          myBookingDetail.bookingStatus === 2 ||
          myBookingDetail.mode === 2
        ) {
          return false;
        } else if (
          this.hasUserInfo
          && myBookingDetail.bookingStatus === 1 ||
          myBookingDetail.bookingStatus === 0
        ) {
          return true;
          // Phòng flashsale không thể cancel
          // myBookingDetail.mode === 1 => Có thể cancel
          // err BE responsive =>  ko hủy 1 tiếng trước h nhận phòng
        }
      }, // showButtonCancel

      cancelButton() {
        this.$refs["filter-modal"].showModal();
      }, // cancelButton

      applyFilter() {
        this.getAjaxCancelBookingDataResponse();
        this.$refs["filter-modal"].closeModal();
      }, // applyFilter
      
      getAjaxCancelBookingDataResponse() {
        const self = this;
        // EventBus.emit('IS_SHOW_ROUTER_LOADING', true);
        apiCaller({
          metaUrl: AJAX_URL.myBooking.cancelBooking,
          data: {
            userBookingSn: self.myBookingDetail.sn,
          },
          type: "GET",
          headers: {
            Authorization: getToken(),
          },
          dataType: "json",
          error(err) {
            // code = 9 - Không thể bị hủy 1 tiếng trước giờ nhận phòng
            // code = 7 - Can not cancel a booking in the past
            self.messageErrors = err.response?.data?.error || [];
            self.$refs["filter-modal-cancel-error"].showModal();
            return;
          },
          success(objResponse) {
            if (_.isEmpty(objResponse) || objResponse.error) {
              return;
            }
            let data = objResponse?.data ?? [];
            if (data == true) {
              self.$refs["filter-modal-cancel-success"].showModal();
              EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
            }
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          },
          complete() {},
        });
      }, // getAjaxBookingDetailDataResponse()
    },
  };
</script>
