<template>
  <div class="sign-up-page">
    <div class="container">
      <sign-up />
    </div>
  </div>
</template>

<script>
  import SignUp from "./component/SignUp.vue";

  export default {
    components: { SignUp },
    data() {
      return {};
    },
    created() {
      EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
    },
  };
</script>
<style src="./sign-up-page-style.css"></style>
