<template>
    <div class="g2j-tooltip-outline">
        <div class="g2j-tooltip-outline-content">
            <img :src="IMAGE_URL + '/' + getIcon" width="25" height="25">
            <div class="tooltip">
                <div class="tooltip-content">
                    <span class="close" style="display: none">&times;</span>
                    <slot name="description"></slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { IMAGE_URL } from '~jsDefinePath/general';

export default {
    props: {
        icon: {
            type: String,
            default: 'icon/exclamation-logo.png',
        },
    },
    data() {
        return {
            IMAGE_URL,
        }
    },

    computed: {
        getIcon() {
            return this.icon ? this.icon : 'icon/exclamation-logo.png';
        }
    }
}
</script>