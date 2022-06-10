<template>
  <div
    v-if="$route.name === 'sign-up-page'"
    ref="test"
    class="sign-up-page"
  >
    <section class="sign-up-section">
      <div class="container">
        <div class="sign-up">
          <sign-up />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import SignUp from './component/SignUp.vue'

export default {
  components: { SignUp },
  data() {
      return {}
    },
    created () {
      EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
    }
};
</script>
<style src="./sign-up-page-style.css"></style>