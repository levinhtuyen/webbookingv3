<template>
  <div
    v-if="$route.name === 'point-page'"
    ref="test"
    class="point-page"
  >
    <section class="point-section">
      <div class="container">
        <div class="point-block">
          <h2>{{ $t('my_point_page.my_point') }}</h2>
        </div>
        <div v-if="isShowMyPoint && !isNoData">
          <point-card-item :myPointTotal="responseMyPointTotal">
          </point-card-item>
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
  import { _ } from "~jsLibPath/lib-manager";
  import PointCardItem from "./component/PointCardItem.vue";
  import TheGo2joyNoData from "~jsPartialPath/global/component/go2joy-no-data/TheGo2joyNoData.vue";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import { getToken, BASE_URL } from "~jsDefinePath/general";
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";

  export default {
    components: { PointCardItem, TheGo2joyNoData },
    data() {
      return {
        BASE_URL,
        logo: "icon/no-data/point.png",
        type: 2,
        responseMyPointTotal: [],
        isNoData: false,
      };
    },
    computed: {
      isShowMyPoint() {
        return !_.isEmpty(this.responseMyPointTotal);
      }, //isShowMyPoint
    },
    created() {
      // NOTE - Setup meta tag
      this.$metaTag.setup({
        title: "Điểm tích lũy của tôi - Go2Joy",
        description: "Xem điểm tích lũy",
        "og:type": "website",
        "og:title": "Điểm tích lũy của tôi - Go2Joy",
        "og:description": "Xem điểm tích lũy",
        "og:url": BASE_URL + window.location.pathname,
        "og:site_name": "Go2Joy",
        "og:image": "",
        "og:image:width": "1200",
        "og:image:height": "628",
      });

      EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
      this.getAjaxPointDataResponse();
    },
    methods: {
      isEmpty: _.isEmpty,
      getAjaxPointDataResponse() {
        const self = this;
        apiCaller({
          metaUrl: AJAX_URL.myPoint.total,
          data: {
            limit: 10,
            page: 1,
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
            self.responseMyPointTotal = objResponse?.data ?? [];
            self.isNoData = false;
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          },
          complete() {},
        });
      }, // getAjaxPointDataResponse()
    },
  };
</script>
<style src="./point-page-style.css"></style>
