<template>
  <div class="agoda">
    <div class="agoda__user">
      <p class="agoda__user--border">
        <!-- <span class="spending" v-if="bookingDetails.bookingStatus == 0">{{ $t('status.waiting_for_payment') }}</span> -->
        <span class="confirmed" v-if="bookingDetails.bookingStatus == 1">{{ $t('status.booked') }}</span>
        <span class="checked-in" v-else-if="bookingDetails.bookingStatus == 2">{{ $t('status.checked_in') }}</span>
        <span class="cancelled" v-else-if="bookingDetails.bookingStatus == 3">{{ $t('status.cancelled') }}</span>
        <span class="noshow" v-else-if="bookingDetails.bookingStatus == 4">{{ $t('status.no_show') }}</span>
        <span class="spending" v-else-if="bookingDetails.bookingStatus == 6">{{ $t('status.spending') }}</span>
      
        <span class="spending" v-if="bookingDetails.bookingStatus == 0 && bookingDetails.paymentProvider == 20">{{ $t('status.waiting_for_payment') }}</span>
        <span class="status-error" v-else-if="bookingDetails.bookingStatus == 0 && bookingDetails.paymentProvider != 20">{{ $t('status.error') }}</span>
      </p>
      <h2>{{ bookingDetails.hotelName }}</h2>
      <p class="agoda__user--address">
        <i class="fas fa-map-marker-alt"></i>
        <span>{{ bookingDetails.hotelAddress }}</span>
      </p>

      <p class="line"></p>

      <div class="agoda__user--flex">
        <p>{{ $t('my_booking_detail_page.booking_id') }}</p>
        <p class="bold">{{ bookingDetails.partnerBookingId }}</p>
      </div>
      <div class="agoda__user--flex">
        <p>{{ $t('my_booking_detail_page.booking_time') }}</p>
        <p class="bold">{{ getHHmmDDMMYYYY(bookingDetails.createTime) }}</p>
      </div>

      <div class="agoda__user--table">
        <table>
          <tr>
            <td>
              <p>{{ $t('my_booking_detail_page.check_in') }}</p>
              <p class="bold datetime">
                <span class="f-1-25em">{{ bookingDetails.startTime }}</span>
                <span>{{ getDDMMYYYY(bookingDetails.checkInDatePlan) }}</span>
              </p>
            </td>
            <td>
              <p>{{ $t('my_booking_detail_page.check_out') }}</p>
              <p class="bold datetime">
                <span class="f-1-25em">{{ bookingDetails.endTime }}</span>
                <span>{{ getDDMMYYYY(bookingDetails.endDate) }}</span>
              </p>
            </td>
          </tr>
        </table>
      </div>

      <div class="agoda__user--flex">
        <p>{{ $t('my_booking_detail_page.booking_type') }}</p>
        <p class="bold">{{ $t('status.daily') }}</p>
      </div>
      <div class="agoda__user--flex">
        <p>{{ $t('my_booking_detail_page.hotel_name') }}</p>
        <p class="bold">{{ bookingDetails.hotelName }}</p>
      </div>
      <div class="agoda__user--flex">
        <p>{{ $t('my_booking_detail_page.room_type') }}</p>
        <p class="bold">{{ bookingDetails.roomTypeName }}</p>
      </div>
      <div class="agoda__user--flex">
        <p>{{ $t('my_booking_detail_page.number_of_rooms') }}</p>
        <p class="bold">x1</p>
      </div>

      <p class="line"></p>

      <div class="agoda__user--flex">
        <p>{{ $t('my_booking_detail_page.first_name') }}</p>
        <p class="bold">{{ bookingDetails.guestInformation && bookingDetails.guestInformation.firstName ? bookingDetails.guestInformation.firstName : '' }}</p>
      </div>
      <div class="agoda__user--flex">
        <p>{{ $t('my_booking_detail_page.last_name') }}</p>
        <p class="bold">{{ bookingDetails.guestInformation && bookingDetails.guestInformation.lastName ? bookingDetails.guestInformation.lastName : '' }}</p>
      </div>
      <div class="agoda__user--flex">
        <p>{{ $t('my_booking_detail_page.gender') }}</p>
        <p class="bold" v-if="bookingDetails.guestInformation && bookingDetails.guestInformation.gender == 2">{{ $t('my_booking_detail_page.female') }}</p>
        <p class="bold" v-else-if="bookingDetails.guestInformation && bookingDetails.guestInformation.gender == 1">{{ $t('my_booking_detail_page.male') }}</p>
        <p class="bold" v-else></p>
      </div>
      <div class="agoda__user--flex">
        <p>{{ $t('my_booking_detail_page.age') }}</p>
        <p class="bold">{{ bookingDetails.guestInformation && bookingDetails.guestInformation.age ? bookingDetails.guestInformation.age : '' }}</p>
      </div>
      <div class="agoda__user--flex">
        <p>{{ $t('my_booking_detail_page.mobile_number') }}</p>
        <p class="bold">{{ bookingDetails.guestInformation && bookingDetails.guestInformation.mobile ? bookingDetails.guestInformation.mobile : '' }}</p>
      </div>
      <div class="agoda__user--flex">
        <p>Email</p>
        <p class="bold">{{ bookingDetails.guestInformation && bookingDetails.guestInformation.email ? bookingDetails.guestInformation.email : '' }}</p>
      </div>
    </div>

    <p class="line-3x" v-if="bookingDetails.bookingStatus == 3"></p>

    <div class="agoda__refund" v-if="bookingDetails.bookingStatus == 3">
      <h2>{{ $t('my_booking_detail_page.refund') }}</h2>
      <p class="line"></p>

      <div class="agoda__user--flex">
        <p>{{ $t('my_booking_detail_page.cancel_time') }}</p>
        <p class="bold">{{ bookingDetails.checkInTime ? formatDate(bookingDetails.checkInTime) : '' }}</p>
      </div>
      <div class="agoda__user--flex">
        <p>{{ $t('my_booking_detail_page.refund_date') }}</p>
        <p class="bold">{{ bookingDetails.cancelDescription && bookingDetails.cancelDescription.refundDate ? bookingDetails.cancelDescription.refundDate : '' }}</p>
      </div>

      <p class="line"></p>

      <div class="agoda__user--flex">
        <h2>{{ $t('my_booking_detail_page.total_refund') }}</h2>
        <p class="text-g2j ft-4x">{{ bookingDetails.cancelDescription && bookingDetails.cancelDescription.refundingAmount ? $formatlowestPrice(bookingDetails.cancelDescription.refundingAmount) : 0 }}đ</p>
      </div>

      <p class="line"></p>

      <div class="agoda__user--flex">
        <p>{{ $t('my_booking_detail_page.refund_method') }}</p>
        <p class="bold" v-if="bookingDetails.cancelDescription && bookingDetails.cancelDescription.refundMethod == -1">N/A</p>
        <p class="bold" v-else-if="bookingDetails.cancelDescription && bookingDetails.cancelDescription.refundMethod == 0">Pay at hotel</p>
        <p class="bold" v-else-if="bookingDetails.cancelDescription && bookingDetails.cancelDescription.refundMethod == 3">Momo E-Wallet</p>
        <p class="bold" v-else-if="bookingDetails.cancelDescription && bookingDetails.cancelDescription.refundMethod == 10">OnePay Credit</p>
        <p class="bold" v-else-if="bookingDetails.cancelDescription && bookingDetails.cancelDescription.refundMethod == 11">Onpay Debit</p>
        <p class="bold" v-else-if="bookingDetails.cancelDescription && bookingDetails.cancelDescription.refundMethod == 20">Payoo</p>
        <p class="bold" v-else-if="bookingDetails.cancelDescription && bookingDetails.cancelDescription.refundMethod == 41">Credit Card</p>
        <p class="bold" v-else-if="bookingDetails.cancelDescription && bookingDetails.cancelDescription.refundMethod == 42">ATM Card</p>
        <p class="bold" v-else-if="bookingDetails.cancelDescription && bookingDetails.cancelDescription.refundMethod == 50">ShopeePay</p>
        <p class="bold" v-else-if="bookingDetails.cancelDescription && bookingDetails.cancelDescription.refundMethod == 60">ZaloPay</p>

      </div>
    </div>

    <p class="line-3x"></p>

    <div class="agoda__payment">
      <h2>{{ $t('my_booking_detail_page.payment') }}</h2>
      <p class="line"></p>

      <div class="agoda__user--flex">
        <p>{{ $t('my_booking_detail_page.hotel_fee') }}</p>
        <p class="bold">{{ $formatlowestPrice(bookingDetails.hotelFee) }}đ</p>
      </div>
      <div class="agoda__user--flex">
        <p>{{ $t('my_booking_detail_page.tax') }}</p>
        <p class="bold">{{ bookingDetails.tax ? `+${$formatlowestPrice(bookingDetails.tax)}` : 0 }}đ</p>
      </div>
      <div class="agoda__user--flex">
        <p>{{ $t('my_booking_detail_page.fee') }}</p>
        <p class="bold">{{ bookingDetails.fee ? `+${$formatlowestPrice(bookingDetails.fee)}` : 0 }}đ</p>
      </div>
      <div class="agoda__user--flex">
        <p>{{ $t('my_booking_detail_page.discount') }}</p>
        <p class="bold">{{ bookingDetails.totalDiscount ? `-${$formatlowestPrice(bookingDetails.totalDiscount)}` : 0 }}đ</p>
      </div>

      <p class="line"></p>
      <div class="agoda__user--flex">
        <h2>{{ $t('my_booking_detail_page.total') }}</h2>
        <p class="text-g2j ft-4x">{{ $formatlowestPrice(bookingDetails.totalPrice) }}đ</p>
      </div>
      <p class="line"></p>

      <div class="agoda__user--flex">
        <p>{{ $t('my_booking_detail_page.payment_status') }}</p>
        <p class="bold" v-if="bookingDetails.paymentStatus === 0">{{ $t('my_booking_detail_page.waiting_for_payment') }}</p>
        <p class="bold" v-else-if="bookingDetails.paymentStatus === 1">{{ $t('my_booking_detail_page.payment_finished') }}</p>
        <p class="bold" v-else>{{ $t('my_booking_detail_page.payment_error') }}</p>
      </div>

      <div class="agoda__user--flex">
        <p>{{ $t('my_booking_detail_page.payment_method') }}</p>
        <p class="bold" v-if="bookingDetails.paymentProvider == -1">N/A</p>
        <p class="bold" v-else-if="bookingDetails.paymentProvider == 0">{{ $t('my_booking_detail_page.pay_at_hotel') }}</p>
        <p class="bold" v-else-if="bookingDetails.paymentProvider == 3">{{ $t('my_booking_detail_page.momo_e_Wallet') }}</p>
        <p class="bold" v-else-if="bookingDetails.paymentProvider == 10">{{ $t('my_booking_detail_page.onePay_credit') }}</p>
        <p class="bold" v-else-if="bookingDetails.paymentProvider == 11">{{ $t('my_booking_detail_page.onpay_debit') }}</p>
        <p class="bold" v-else-if="bookingDetails.paymentProvider == 20">{{ $t('my_booking_detail_page.payoo') }}</p>
        <p class="bold" v-else-if="bookingDetails.paymentProvider == 41">{{ $t('my_booking_detail_page.credit_card') }}</p>
        <p class="bold" v-else-if="bookingDetails.paymentProvider == 42">{{ $t('my_booking_detail_page.atm_card') }}</p>
        <p class="bold" v-else-if="bookingDetails.paymentProvider == 50">{{ $t('my_booking_detail_page.shopee_pay') }}</p>
        <p class="bold" v-else-if="bookingDetails.paymentProvider == 60">{{ $t('my_booking_detail_page.zalo_pay') }}</p>
      </div>
      <p class="line"></p>

    </div>
    <div class="agoda__policy">
      <h2>{{ $t('my_booking_detail_page.cancellation_policy') }}</h2>
      <p>{{ $t('my_booking_detail_page.free_cancellation') }}: <b>{{ $t('my_booking_detail_page.until') }} 23:59 {{ bookingDetails.cancelDescription && bookingDetails.cancelDescription.freeCancellation ? getDDMMYYYY(bookingDetails.cancelDescription.freeCancellation) : '' }}</b></p>
      <p>{{ $t('my_booking_detail_page.cancel_with_fee') }}: <b>00:00 {{ bookingDetails.cancelDescription && bookingDetails.cancelDescription.cancelWithFeeFrom ? getDDMMYYYY(bookingDetails.cancelDescription.cancelWithFeeFrom) : '' }} {{ $t('my_booking_detail_page.to') }} 23:59 {{ bookingDetails.cancelDescription && bookingDetails.cancelDescription.cancelWithFeeTo ? getDDMMYYYY(bookingDetails.cancelDescription.cancelWithFeeTo) : '' }}</b></p>
      <p>{{ $t('my_booking_detail_page.non_refundable') }}: <b>{{ $t('my_booking_detail_page.after') }} 00:00 {{ bookingDetails.cancelDescription && bookingDetails.cancelDescription.nonRefundable ? getDDMMYYYY(bookingDetails.cancelDescription.nonRefundable) : '' }}</b></p>
      <p v-show="language !== 'en'">{{ bookingDetails.cancelDescription && bookingDetails.cancelDescription.cancellationPolicy ? bookingDetails.cancelDescription.cancellationPolicy : '' }}</p>
      <p v-show="language === 'en'">{{ bookingDetails.cancelDescription && bookingDetails.cancelDescription.cancellationPolicyEn ? bookingDetails.cancelDescription.cancellationPolicyEn : '' }}</p>
      <p>{{ $t('my_booking_detail_page.i_hereby_agree_to_the') }}
        <router-link :to="{name: 'term-condition-page'}">{{ $t('my_booking_detail_page.term_of_use') }}</router-link>
        {{ $t('my_booking_detail_page.for_make_a_reservation') }}
      </p>

      <div class="agoda__policy--logo">
        Powered by 
        <img :src="IMAGE_URL + '/svg/image-agoda.svg'" width="36px" height="36px">
      </div>
    </div>

    <div class="agoda__button">
      <button type="submit" :disabled="disableButton(bookingDetails)" v-if="isShowButton(bookingDetails) == true" @click="onCancelBooking">{{ $t('my_booking_detail_page.cancel_booking') }}</button>
    </div>

    <modal-cancel-booking-agoda
      ref="modal-cancel-booking-agoda"
      :filter.sync="filter"
      :isFee="isFee"
      :data="bookingDetails"
      @apply="applyFilter"
    />

    <modal-wrong 
      ref="modal-wrong"
    />

  </div>
</template>

<script>
  import { IMAGE_URL } from "~jsDefinePath/general";
  import ModalCancelBookingAgoda from "./ModalCancelBookingAgoda.vue";
  import ModalWrong from "./ModalWrong.vue";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from '~jsBasePath/vuex/modules/page-info-module';
  import { _, mapState } from "~jsLibPath/lib-manager";
  import { getDDMMYYYY, getHHmmDDMMYYYY } from "~jsPath/helper/util/formatDate";

  export default {
    props: {
      myBookingDetail: {
        type: [Array, Object],
        default: []
      },
    },
    components: { ModalCancelBookingAgoda, ModalWrong },
    data() {
      return {
        IMAGE_URL,
        hasFilter: true,
        messageErrors: [],
        isFee: false
      };
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: 'language',
      }),
      bookingDetails: function () {
        if(this.myBookingDetail.cancelDescription && this.myBookingDetail.cancelDescription.cancelStatus == 2) {
          this.isFee = true
        } else {
          this.isFee = false
        }
        return this.myBookingDetail;
      },
    },

    methods: {
      getDDMMYYYY,
      getHHmmDDMMYYYY,
      formatDate (date) {
        let CDate = dayjs(date).format('HH:mm DD/MM/YYYY')
        return CDate
      },// formatDate()

      applyFilter() {
        this.$refs["filter-modal"].closeModal();
      }, // applyFilter

      onCancelBooking() {
        this.$refs["modal-cancel-booking-agoda"].showModal();
      }, // onCancelBooking

      isShowButton(data) {
        // return data.cancelBooking == true && data.bookingStatus != 2 && data.bookingStatus != 3 
        return data.bookingStatus == 1 || data.bookingStatus == 0 || data.bookingStatus == 6
        // return data.bookingStatus == 2
      }, // isShowButton
      
      disableButton(data) {
        return data.cancelBooking == false
      } // disableButton
    },
  };
</script>
