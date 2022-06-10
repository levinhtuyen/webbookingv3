<template>
    <div class="custom-card">
        <div class="custom-row">
            <div class="flex-container">
                <div class="money">
                    <span :class="checkHiden() ? '' : 'text-orange'">{{ $formatlowestPrice(myPointTotal.totalPoint) }} <b>P</b></span>
                </div>
                <the-go-2-joy-tool-tip :icon="icon">
                    <template v-slot:description>
                        <div class="text-bold-red">{{ $t('my_point_page.point_policy') }}</div>
                        <div class="text-bold">{{ $t('my_point_page.1_how_to_accumulate_points') }}</div>
                        <div>
                            <ul class="inside">
                                <li>{{ $t('my_point_page.pay_at_go2Joy_1_000_d_30_pts_equivalent_to_3_of_the_payment_value') }}</li>
                                <li>{{ $t('my_point_page.pay_at_hotel_1_000_d_10_pts_equivalent_to_1_of_the_payment_value') }}</li>
                                <li>{{ $t('my_point_page.amount_1_1_000_d_rounded_to_0') }}</li>
                                <li>{{ $t('my_point_page.payment_amount_after_deducting_cash_discounts_such_as_coupons_flashsales_stamp_redemption_point_redemption_and_direct_discount_etc') }}</li>
                                <li>{{ $t('my_point_page.accumulated_points_are_valid_for_12_months_to_redeem') }}</li>
                            </ul>
                        </div>
                        <div class="text-bold">{{ $t('my_point_page.2_how_can_i_redeem_points') }}</div>
                        <div>
                            <ul class="inside">
                                <li>{{ $t('my_point_page.redeem_points_for_room_10_000_pts_10_000_d') }}</li>
                                <li>{{ $t('my_point_page.redeem_points_for_other_products_services_of_hotels_and_affiliated_partners_according_to_separated_regulations') }}</li>
                                <li>{{ $t('my_point_page.minimum_accumulated_points_for_redemption_50_000_pts') }}</li>
                            </ul>
                        </div>
                    </template>
                </the-go-2-joy-tool-tip>
            </div>
            <div class="info-outer">
                <div>
                    <p class="price">{{ $formatlowestPrice(myPointTotal.totalEarned) }}</p>
                    <p class="title-total">{{ $t('my_point_page.total_earned') }}</p>
                </div>
                <div>
                    <p class="price">{{ $formatlowestPrice(myPointTotal.totalSpent) }}</p>
                    <p class="title-total">{{ $t('my_point_page.total_spent') }}</p>
                </div>
                <div>
                    <p class="price">{{ $formatlowestPrice(myPointTotal.totalExpired) }}</p>
                    <p class="title-total">{{ $t('my_point_page.total_expired') }}</p>
                </div>
            </div>
            <div class="text-redeem">
                <span>{{ $t('my_point_page.minimum_points_to_redeem') }} </span><span>50,000</span> <u>đ</u>
            </div>
            <div class="progress" v-if="checkHiden()">
                <div class="input">
                    <the-go-2-joy-slider
                    :disable="true"
                    :minValue="0"
                    :maxValue="50000"
                    :percentValue="total"
                    @getSliderValue="getSliderValue"
                    >
                    </the-go-2-joy-slider>
                </div>
                <div>
                    <img :src="IMAGE_URL + '/icon/point-logo.png'">
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { IMAGE_URL } from '~jsDefinePath/general';
import TheGo2JoyToolTip from '~jsPartialPath/global/component/go2joy-tooltip/TheGo2JoyToolTip.vue'
import TheGo2JoySlider from "~jsPartialPath/global/component/go2joy-slider/TheGo2JoySlider.vue";

export default {
    props: {
        myPointTotal: {
            default : [],
            type    : Array,
        }
    },
    components: {
        TheGo2JoyToolTip,
        TheGo2JoySlider
    },
    data() {
        return {
            total: 0,
            IMAGE_URL,
            icon       : 'icon/exclamation-logo.png'
        }
    },

    created() {
        this.total = this.myPointTotal.totalPoint;
    },

    methods: {
        getSliderValue(value) {}, // get value by slider global
        checkHiden() {
            if(this.myPointTotal.totalPoint > 50000) {
                return false;
            } else {
                return true;
            }
        }
    },
}
</script>
