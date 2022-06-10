<template>
    <div class="custom-booking-stamp">
        <div class="custom-row-booking-stamp">
            <div class="title uppercase">
                 {{ bookStamp.hotelName }}
            </div>
            <div class="text-outer">
                {{ $t('my_stamp_page.You_will_earn_a_stamp_for_every_successful_booking') }}
            </div>
            <div class="flex-container-booking-stamp">
                <div class="time-price-outer">
                    <div class="time">
                        <span :class="{ black: bookStamp.redeemHourly == false }">{{ $t('my_stamp_page.hourly') }}</span>
                        <span :class="{ black: bookStamp.redeemOvernight == false }">{{ $t('my_stamp_page.overnight') }}</span>
                        <span :class="{ black: bookStamp.redeemDaily == false }">{{ $t('my_stamp_page.daily') }}</span>
                    </div>
                    <div class="price">
                        <span class="number-price">{{ $formatlowestPrice(bookStamp.redeemValue) }} {{ bookStamp.redeemType == 2  ? '%' : ''}}
                        <u v-if="bookStamp.redeemType == 1">đ</u></span>
                        <span>{{ $t('my_stamp_page.off') }}</span>
                    </div>
                </div>
            </div>
            <div class="shape-outer">
                <div class="shape-wrapper">
                    <div class="image-wraper" v-for="(item, index) in stampIssuedFormList" :key="index">
                        <img v-if="stampIssuedFormList.length - 1 == index" :class="stampIssuedFormList[index].status != 1 ? 'unActive' : ''" :src="IMAGE_URL + '/' + logoGiftRed" width="100%" height="100%">
                        <img v-else :class="changeColor(stampIssuedFormList[index])" :src="IMAGE_URL + '/' + logoActive" width="100%" height="100%">

                        <div class="text-image" v-if="stampIssuedFormList.length - 1 != index && item.status == 3">
                            <span class="text-bold">{{ index }}</span>
                            <span>{{ item.expireDate ? getDDMMYYYY(item.expireDate) : '' }}</span>
                        </div>

                        <div class="text-image" v-if="stampIssuedFormList.length - 1 != index && item.status == 0">
                            <span class="text-bold">{{ $t('my_stamp_page.expired') }}</span>
                            <span>{{ item.expireDate ? getDDMMYYYY(item.expireDate) : '' }}</span>
                        </div>
                        <div class="text-image" v-if="stampIssuedFormList.length - 1 != index && item.status == 1">
                            <span>{{ item.expireDate ? getDDMMYYYY(item.expireDate) : '' }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btn-redeem">
                <button v-if="snLastLengthArray.status != 1" type="submit" class="disable">{{ $t('my_stamp_page.redeem') }}</button>
                <button v-else @click="submitBtn()" type="submit">{{ $t('my_stamp_page.redeem') }}</button>
            </div>
        </div>
    </div>
</template>

<script>
import TheGo2JoyToolTip from '~jsPartialPath/global/component/go2joy-tooltip/TheGo2JoyToolTip.vue'
import { IMAGE_URL } from '~jsDefinePath/general';
import { getDDMMYYYY } from "~jsPath/helper/util/formatDate";

export default {
    components: { TheGo2JoyToolTip },
    props: {
        bookStamp: {
            default : [],
            type    : Array,
        }
    },
    data() {
        return {
            IMAGE_URL,
            logoExpired          : 'logo/stamp-grey-logo.png',
            logoActive           : 'logo/stamp-active-logo.png',
            logoGiftGrey         : 'logo/stamp-gift-grey-logo.png',
            logoGiftRed          : 'logo/stamp-gift-red-logo.png',
            description : '<p>Tool tip for coupon <ul><li style="color: red">Pay at Go2Joy : 1,000₫ = 30 pts (equivalent to 3% of the payment value equivalent to 3% of the payment value equivalent to 3% of the payment value equivalent to 3% of the payment value equivalent to 3% of the payment value)</li></ul> <ul><li style="color: red">Pay at Go2Joy : 1,000₫ = 30 pts (equivalent to 3% of the payment value)</li></ul> <ul><li style="color: red">Pay at Go2Joy : 1,000₫ = 30 pts (equivalent to 3% of the payment value)</li></ul></p>'
        }
    },

    computed: {
        total: function () {
            return this.bookStamp.numToRedeem;
        },
        snLastLengthArray: function() {
            return _.last(this.bookStamp.stampIssuedFormList)
        },
        stampIssuedFormList:function() {
            return this.bookStamp.stampIssuedFormList
        }
    },

    methods: {
        getDDMMYYYY,
        changeColor(list) {
            switch(list.status) {
                case 0: 
                    return 'background-grey';
                case 1: 
                    return '';
                default: 
                    return 'background-opacity-grey';
            }
        },
        submitBtn() {
            this.$router.push({ name: 'hotel-detail-page', query: { hotelSn: this.bookStamp.hotelSn } })
        }
    },
}
</script>