<template>
  <div class="main-promotion-page container">
    <div class="promotion-page">
      <div class="promotion-content">
        <!-- <div class="promotion-content-header">
                <TheGo2JoyBackComponent></TheGo2JoyBackComponent>
            </div> -->
        <PromotionTab v-if="type && type == 1" />
        <PromotionList v-if="type && type == 2" />
        <PromotionGroup v-if="type && type == 3" />
      </div>
    </div>
  </div>
</template>

<script>
  // import TheGo2JoyBackComponent from './../global/component/go2joy-back/TheGo2JoyBack.vue'
  import PromotionTab from "./component/PromotionTab.vue";
  import PromotionList from "./component/PromotionList.vue";
  import PromotionGroup from "./component/PromotionGroup.vue";
  import { BASE_URL } from "~jsDefinePath/general";

  export default {
    name: "ThePromotionPage",
    components: {
      // TheGo2JoyBackComponent ,
      PromotionTab,
      PromotionList,
      PromotionGroup,
    },
    data() {
      return {
        BASE_URL,
        type: this.$route?.query.type || 1,
      };
    },
    created() {
      // NOTE - setup meta tag for SEO
      this.$metaTag.setup({
        title: "Các chương trình khuyến mãi khi đặt phòng tại Go2Joy",
        description:
          "Cập nhật các chương trình khuyến mãi và ưu đãi mới nhất dành riêng cho bạn khi đặt phòng tại Go2Joy",
        "og:type": "website",
        "og:title": "Các chương trình khuyến mãi khi đặt phòng tại Go2Joy",
        "og:description":
          "Cập nhật các chương trình khuyến mãi và ưu đãi mới nhất dành riêng cho bạn khi đặt phòng tại Go2Joy",
        "og:url": BASE_URL + window.location.pathname,
        "og:site_name": "Go2Joy",
        "og:image": "",
        "og:image:width": "1200",
        "og:image:height": "628",
      });
    },
  };
</script>

<style src="./promotion-page-style.css"></style>
