<template>
  <div
    v-if="$route.name === 'login-page'"
    ref="test"
    class="login-page"
  >
    <section class="login-section">
      <div class="container">
        <div class="sign-in">
          <the-sign-in v-if="renderComponent" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import TheSignIn from './component/TheSignIn.vue'
export default {
  components: { TheSignIn },
  data() {
      return {
        renderComponent: true,
      }
  },
  created () {
    EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
  },
  mounted() {
    this.forceRerender()
  },
   methods: {
      forceRerender() {
        // Remove my-component from the DOM
        this.renderComponent = false;
        this.$nextTick(() => {
          // Add the component back in
          this.renderComponent = true;
        });
      }
    }
};
</script>
<style src="./login-page-style.css"></style>
