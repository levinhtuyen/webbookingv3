<template>
  <div class="card">
    <div class="card__left">
      <div class="card__left--border">
          <p v-if="myBookingList.status == 1" class="wrap wrap-green">{{ $t('status.booked') }}</p>
          <p v-else-if="myBookingList.status == 4" class="wrap wrap-gray">{{ $t('status.no_show') }}</p>
          <p v-else-if="myBookingList.status == 3" class="wrap wrap-red">{{ $t('status.cancelled') }}</p>
          <p v-else-if="myBookingList.status == 2" class="wrap wrap-orange">{{ $t('status.checked_in') }}</p>
          <p v-else-if="myBookingList.status == 6" class="wrap wrap-spending">{{ $t('status.spending') }}</p>

          <p v-if="myBookingList.status == 0 && myBookingList.paymentProvider == 20" class="wrap wrap-blue">{{ $t('status.waiting_for_payment') }}</p>
          <p v-else-if="myBookingList.status == 0 && myBookingList.paymentProvider != 20" class="wrap wrap-error">{{ $t('status.error') }}</p>
      </div>
      <div class="card__left--date">{{ getDDMMYYYY(myBookingList.createTime) }}</div>
      <div class="card__left--time">{{ getHHmm(myBookingList.createTime) }}</div>
    </div>
    <div class="card__right">
      <div class="card__right--title">{{ myBookingList.hotelName }}</div>
      <div class="card__right--text">{{ myBookingList.roomTypeName }}</div>
      <div v-if="myBookingList.type == 1" class="card__right--text">{{ $t('status.hourly') }}</div>
      <div v-else-if="myBookingList.type == 2" class="card__right--text">{{ $t('status.overnight') }}</div>
      <div v-else class="card__right--text">{{ $t('status.daily') }}</div>
      <div class="card__right--img">
          <div class="image-wraper">
              <img :src="IMAGE_URL + '/' + getLogo()" width="100%" height="100%">
              <span v-if="myBookingList.paymentProvider == 20 && myBookingList.paymentCode">{{ myBookingList.paymentCode }}</span>
          </div>
      </div>
      <div class="card__right--price">{{$formatlowestPrice(myBookingList.amountFromUser)}} đ</div>
    </div>
  </div>
</template>

<script>
import { IMAGE_URL } from '~jsDefinePath/general';
import { getDDMMYYYY, getHHmm } from "~jsPath/helper/util/formatDate"

export default {
  props: {
    myBookingList: {
        type    : {
          type: Array,
          default: []
        },
    }
  },
  data() {
    return {
        IMAGE_URL
    }
  },

  created() {
    this.getLogo();
  },

  methods: {
    getDDMMYYYY,
    getHHmm,
    getLogo() {
        switch(this.myBookingList.paymentProvider) {
            case 0: {
                return 'icon/payment/hotelpay.svg';
            }
            case 3: {
                return 'icon/payment/momo.svg';
            }
            case 10: {
                return 'icon/payment/onepay.svg';
            }
            case 11: {
                return 'icon/payment/onepay.svg';
            }
            case 20: {
                return 'icon/payment/payoo.svg';
            }
            case 41: {
                return 'icon/payment/epay.svg';
            }
            case 42: {
                return 'icon/payment/epay.svg';
            }
            case 60: {
                return 'icon/payment/zalopay.svg';
            }
        }
    } // getLogo
  }
}
</script>