<template>
  <div
    v-if="$route.name === 'stamp-detail-page'"
    ref="test"
    class="stamp-detail-page"
  >
    <section class="stamp-detail-section">
      <div class="container">
        <div class="stamp-detail-block">
          <h2>{{ $t('my_stamp_page.my_stamp') }}</h2>
        </div>
        <div v-if="isShowMyDetailStamp && !isNoData">
          <book-stamp :bookStamp="responseBookStamp" />
        </div>
        <div v-else-if="isNoData">
          <TheGo2joyNoData
            :logo="logo"
            :type="type"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import BookStamp from "./component/BookStamp.vue";
  import TheGo2joyNoData from "~jsPartialPath/global/component/go2joy-no-data/TheGo2joyNoData.vue";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import { getToken, BASE_URL } from "~jsDefinePath/general";
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";

  export default {
    components: { BookStamp, TheGo2joyNoData },
    data() {
      return {
        BASE_URL,
        type: 1,
        responseBookStamp: [],
        hotelSn: this.$route.params.id,
        isNoData: false,
      };
    },

    computed: {
      isShowMyDetailStamp() {
        return !_.isEmpty(this.responseBookStamp);
      }, //isShowMyDetailStamp
    },

    created() {
      // NOTE - Setup meta tag
      this.$metaTag.setup({
        title: "Chi tiết tem thưởng " + this.hotelSn + " - Go2Joy",
        description: "Xem chi tiết tem thưởng " + this.hotelSn,
        "og:type": "website",
        "og:title": "Chi tiết tem thưởng " + this.hotelSn + " - Go2Joy",
        "og:description": "Xem chi tiết tem thưởng " + this.hotelSn,
        "og:type": "website",
        "og:url": BASE_URL + window.location.pathname,
        "og:site_name": "Go2Joy",
        "og:image": "",
        "og:image:width": "1200",
        "og:image:height": "628",
      });

      EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
      this.getAjaxBookStampDataResponse();
    },

    methods: {
      getAjaxBookStampDataResponse() {
        const self = this;

        apiCaller({
          metaUrl: AJAX_URL.myStamp.detail,
          data: {
            withStampList: true,
            hotelSn: self.hotelSn,
          },
          method: "GET",
          headers: {
            Authorization: getToken(),
          },
          dataType: "json",

          error() {
            self.isNoData = true;
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          },

          success(objResponse) {
            if (
              _.isEmpty(objResponse) ||
              objResponse.error ||
              _.isEmpty(objResponse.data)
            ) {
              self.isNoData = true;
              EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
              return;
            }

            self.responseBookStamp = objResponse?.data ?? [];
            self.isNoData = false;
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          },

          complete() {},
        });
      }, // getAjaxBookStampDataResponse()
    },
  };
</script>

<style src="./stamp-detail-page-style.css"></style>
