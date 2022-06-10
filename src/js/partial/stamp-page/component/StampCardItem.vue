<template>
    <div class="custom-card">
        <div class="custom-row">
           <div class="title">
                <div class="margin-title uppercase">{{ myStampList.hotelName }}</div>
                <the-go-2-joy-tool-tip :icon="icon" >
                    <template v-slot:description>
                        <div class="text-bold-red">{{ $t('my_stamp_page.stamp_policy') }}</div>
                        <div class="text-normal">{{ $t('my_stamp_page.in_case_the_hotel_stops_stamp_program_users_will_be_notified_30_days_in_advance') }}</div>
                        <div>
                            <ul class="inside">
                                <li>{{ $t('my_stamp_page.for_users_having_no_stamp_yet') }} 
                                    <ul class="inside-child">
                                        <li>{{ $t('my_stamp_page.new_stamp_will_not_be_issued') }}</li>
                                    </ul>
                                </li>
                                <li>{{ $t('my_stamp_page.for_users_having_at_least_1_stamp') }}
                                    <ul class="inside-child">
                                        <li>{{ $t('my_stamp_page.30_days_to_collect_enought_stamps_and_redeem_after_30_days_all_stamps_will_no_longer_be_valid') }}</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </template>
                </the-go-2-joy-tool-tip>
            </div>
            <div class="flex-container">
                <div class="time">
                    <span :class="{ black: myStampList.redeemHourly == false }">{{ $t('my_stamp_page.hourly') }}</span>
                    <span :class="{ black: myStampList.redeemOvernight == false }">{{ $t('my_stamp_page.overnight') }}</span>
                    <span :class="{ black: myStampList.redeemDaily == false }">{{ $t('my_stamp_page.daily') }}</span>
                </div>
                <div class="money-point-outer">
                    <div class="money">
                    <span v-if="myStampList.redeemValue">{{ $formatlowestPrice(myStampList.redeemValue) }}{{ myStampList.redeemType == 2  ? '%' : ''}}
                        <u v-if="myStampList.redeemType == 1">đ</u>
                        <u v-else></u>
                    </span>
                    <span v-else></span>
                    </div>
                    <div class="point">
                        <span class="tomato">{{ myStampList.numStampActive }}</span>/{{ myStampList.numToRedeem }}
                    </div>
                </div>
            </div>
            <div class="progress">
                <the-go-2-joy-slider
                    :disable="true"
                    :minValue="0"
                    :maxValue="myStampList.numToRedeem"
                    :percentValue="myStampList.numStampActive"
                    @getSliderValue="getSliderValue"
                    >
                </the-go-2-joy-slider>
            </div>
        </div>
    </div>
</template>

<script>
import TheGo2JoyToolTip from '~jsPartialPath/global/component/go2joy-tooltip/TheGo2JoyToolTip.vue';
import TheGo2JoySlider from "~jsPartialPath/global/component/go2joy-slider/TheGo2JoySlider.vue";

export default {
    components: { TheGo2JoyToolTip, TheGo2JoySlider },
    props: {
        myStampList: {
            default : [],
            type    : Array,
        }
    },
    data() {
        return {
            icon          : 'icon/exclamation-logo.png',
            logo          : 'icon/no-data/stamp.png'
        }
    },
    computed: {
        list: function() {
            return this.myStampList;
        }
    },
    methods: {
        getSliderValue(value) {}, // get value by slider global
    },
}
</script>