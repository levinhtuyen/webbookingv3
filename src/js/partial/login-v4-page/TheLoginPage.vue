<template>
  <div
    ref="test"
    class="login-page"
  >
    <section class="login-section">
      <div class="container">
        <div class="sign-in">
          <the-sign-in />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import TheSignIn from "./component/TheSignIn.vue";
  import { BASE_URL } from "~jsDefinePath/general";

  export default {
    components: { TheSignIn },
    data() {
      return {
        BASE_URL,
      };
    },
    created() {
      EventBus.emit("IS_SHOW_ROUTER_LOADING", false);

      // NOTE - Setup meta tag
      this.$metaTag.setup({
        title: "Đăng nhập tài khoản Go2Joy!",
        description:
          "Đăng nhập ngay để xem những chương trình ưu đãi mới nhất từ Go2Joy nhé.",
        "og:type": "website",
        "og:title": "Đăng nhập tài khoản Go2Joy!",
        "og:description":
          "Đăng nhập ngay để xem những chương trình ưu đãi mới nhất từ Go2Joy nhé.",
        "og:url": BASE_URL + window.location.pathname,
        "og:site_name": "Go2Joy",
        "og:image": "",
        "og:image:width": "1200",
        "og:image:height": "628",
      });
    },
  };
</script>
<style src="./login-page-style.css"></style>
