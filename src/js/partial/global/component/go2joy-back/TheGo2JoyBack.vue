<template>
  <div>
    <div class="go2joy-back">
        <div class="go2joy-back__button">
            <BackBottom></BackBottom>
        </div>
        <div v-if="titleText && titleText != ''" class="go2joy-back__title">
          <div class="go2joy-back__title--text">
            <p>{{ titleText }}</p>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import BackBottom from '../back-button/BackButtonComponent.vue'
  export default {
    props: {
      title: {
        type: String,
      },
    },
    components: {
      BackBottom,
    },
    data() {
      return {

      }
    },
    computed: {
      titleText() {
        return this.title
      }
    },
  }
</script>
