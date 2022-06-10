<template>
  <div
    ref="test"
    class="forget-password-page"
  >
    <section class="forget-password-section">
      <div class="container">
        <div class="forget-password">
          <forget-password />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ForgetPassword from './component/ForgetPassword.vue'

export default {
  components: { ForgetPassword },
  data() {
    return {}
  },
  created () {
    EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
  }
};
</script>
<style src="./forget-password-page-style.css"></style>
