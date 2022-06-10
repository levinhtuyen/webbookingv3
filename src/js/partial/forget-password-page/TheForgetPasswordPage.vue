<template>
  <div
    v-if="$route.name === 'forget-password-page'"
    ref="test"
    class="login-page"
  >
    <section class="login-section">
      <div class="container">
        <div class="sign-in">
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