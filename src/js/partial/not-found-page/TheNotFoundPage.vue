<template>
  <div class="not-found-page">
    <section class="not-found-section">
      <div class="not-found-section__bg-outer">
        <div class="not-found-section__bg-inner">
          <img
            class="not-found-section__bg-img"
            :src="IMAGE_URL + '/bg/404-not-found.jpg'"
            alt="404 not found"
            height="100%"
            width="100%"
          >
        </div> <!-- .not-found-section__bg-inner -->
      </div> <!-- .not-found-section__bg-outer -->

      <div class="container">
        <div class="not-found-block">
          <div class="not-found-block__content">
            <div class="not-found-block__oops-label">
              Ooops!
            </div>
            <div class="not-found-block__notice-content">
              <div class="not-found-block__notice-label">
                {{ $t('common.not_found') }}
              </div> <!-- .not-found-block__notice-label -->

              <router-link
                v-slot="{ href, navigate }"
                :to="homePagePath[language]"
              >
                <a
                  :href="href"
                  class="not-found-block__back-home-link"
                  @click="navigate"
                >
                  {{ $t('common.back_home') }}
                </a> <!-- .not-found-block__notice-label -->
              </router-link>
            </div> <!-- .not-found-block__notice-content -->
          </div> <!-- .not-found-block__content -->
        </div> <!-- .not-found-block -->
      </div> <!-- .container -->
    </section> <!-- .not-found-section -->
  </div>
</template>

<script>
  import { mapState } from "~jsLibPath/lib-manager";
  import { IMAGE_URL, BASE_URL } from "~jsDefinePath/general";
  import { EVENT_BUS_KEY } from "~jsDefinePath/event-bus";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/page-info-module";
  import { getHomePath } from "~jsHelperPath/util/HandleUrl";

  export default {
    name: "404NotFoundPage",

    data() {
      return {
        BASE_URL,
        IMAGE_URL,
        homePagePath: getHomePath(),
      };
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),
    },

    created() {
      // NOTE - Setup meta tag
      this.$metaTag.setup({
        title: "Trang 404",
        description: "Trang không tồn tại",
        "og:type": "website",
        "og:title": "Trang 404",
        "og:description": "Trang không tồn tại",
        "og:url": BASE_URL + window.location.pathname,
        "og:site_name": "Go2Joy",
        "og:image": "",
        "og:image:width": "1200",
        "og:image:height": "628",
      });

      EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, false);
    },
  };
</script>

<style src="./not-found-page-style.css"></style>
