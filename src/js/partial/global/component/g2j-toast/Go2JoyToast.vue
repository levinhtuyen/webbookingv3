<template>
  <div class="g2j-toast">
    <transition name="fade-y">
      <div
        v-if="isActive"
        class="g2j-toast__item"
        :style="`top: ${k*70 + 40}px`"
      >
        <div
          class="g2j-toast__item--icon"
          :class="{'is-success': type=='success'}"
        >
          <g2j-image
            v-if="type == 'error'"
            :urlImg="IMAGE_URL+'/icon/warning.svg'"
            :altImg="'fb-image'"
          ></g2j-image>
          <g2j-image
            v-else
            :urlImg="IMAGE_URL+'/icon/payment/check_select.svg'"
            :altImg="'fb-image'"
          ></g2j-image>
        </div>
        <div class="g2j-toast__item--message">
          {{message}}
        </div>
      </div>
    </transition>

  </div>

</template>

<script>
  //từ sẽ cập nhật thêm cho nó pro
  import {
    IMAGE_URL,
    CACHE_VERSION,
    ASSETS_SERVICE_URL,
  } from "~jsDefinePath/general";
  export default {
    props: {
      isActive: Boolean,
      message: [String],
      type: {
        default: "error",
        type: String,
      },
    },
    data() {
      return {
        IMAGE_URL,
      };
    },
    watch: {
      isActive(val) {
        if (val == true) {
          setTimeout(() => {
            this.$emit("update:isActive", false);
          }, 2000);
        }
      },
    },
  };
</script>

<style>
</style>
