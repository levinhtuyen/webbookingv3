<template>
    <div class="custome-no-stamp">
        <div class="img-container-block">
            <img :src="IMAGE_URL + '/' + logoNoData">
        </div> 
        <div v-if="type == 1" class="text-title">
            <p>{{ $t('my_stamp_page.you_have_no_stamp_yet') }}</p>
            <p>{{ $t('my_stamp_page.note_empty') }}</p>
        </div>
        <div v-else-if="type == 2" class="text-title">
            <p>{{ $t('my_point_page.you_have_no_point_yet') }}</p>
            <p>{{ $t('my_point_page.note_empty') }}</p>
        </div>
        <div v-else-if="type == 3" class="text-title">
            <p>{{ $t('my_booking_detail_page.you_have_no_boooking_yet') }}</p>
            <p>{{ $t('my_booking_detail_page.note_empty') }}</p>
        </div>
        <div v-else-if="type == 4" class="text-title">
            <p>{{ $t('my_coupon_page.you_have_no_coupon_yet') }}</p>
            <p>{{ $t('my_coupon_page.note_empty') }}</p>
        </div>
    </div>
</template>

<script>
import { IMAGE_URL } from '~jsDefinePath/general';
export default {
    props: {
        logo     : String,
        type     : Number // 1: stamp, 2: point, 3: booking, 4: coupon
    },
    data() {
        return {
            IMAGE_URL,
        }
    },
    computed: {
        logoNoData() {
            return this.logo 
        }
    },
}
</script>