<template>
  <div
    v-if="$route.name === 'stamp-page'"
    ref="test"
    class="stamp-page"
  >
    <section class="stamp-section">
      <div class="container">
        <div class="stamp-block">
          <h2>{{ $t('my_stamp_page.my_stamp') }}</h2>
        </div>
        <div v-if="isShowMyStamp && !isNoData">
          <div
            v-for="(item, index) in responseMyStampList"
            :key="index"
          >
            <router-link :to="{name: 'stamp-detail-page', params: {id: item.hotelSn}}">
              <stamp-card-item :myStampList="item">
              </stamp-card-item>
            </router-link>
          </div>
          <div class="stamp-paginate">
            <Pagination
              v-if="responseMyStampList && responseMyStampList.length"
              position="center"
              :pageSizes="pageCount"
              :current-page="currentPage"
              @changeCurrentPage="changeCurrentPage"
            />
          </div>
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
  import StampCardItem from "./component/StampCardItem.vue";
  import TheGo2joyNoData from "~jsPartialPath/global/component/go2joy-no-data/TheGo2joyNoData.vue";
  import { getToken, BASE_URL } from "~jsDefinePath/general";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import Pagination from "~jsPartialPath/global/component/pagination/Pagination.vue";
  export default {
    components: { StampCardItem, TheGo2joyNoData, Pagination },
    data() {
      return {
        BASE_URL,
        logo: "icon/no-data/stamp.png",
        type: 1,
        responseMyStampList: [],
        isNoData: false,
        pageCount: 1,
        currentPage: 1,
      };
    },

    computed: {
      isShowMyStamp() {
        return !_.isEmpty(this.responseMyStampList);
      }, //isShowMyStamp
    },

    created() {
      // NOTE - Setup meta tag
      this.$metaTag.setup({
        title: "Tem thưởng của tôi - Go2Joy",
        description: "Xem danh sách tem thưởng",
        "og:type": "website",
        "og:title": "Tem thưởng của tôi - Go2Joy",
        "og:description": "Xem danh sách tem thưởng",
        "og:url": BASE_URL + window.location.pathname,
        "og:site_name": "Go2Joy",
        "og:image": "",
        "og:image:width": "1200",
        "og:image:height": "628",
      });

      this.getAjaxStampDataResponse();
    },

    methods: {
      isEmpty: _.isEmpty,
      changeCurrentPage(page) {
        let query = { ...this.$route.query };
        query.page = page;
        this.$router.push({ name: "stamp-page", query: query });
        this.getAjaxStampDataResponse();
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      getAjaxStampDataResponse() {
        EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        let query = this.$route.query ?? {};
        this.currentPage = query?.page ?? 1;
        const self = this;
        apiCaller({
          metaUrl: AJAX_URL.myStamp.all,
          data: {
            limit: 10,
            page: self.currentPage,
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
              _.isEmpty(objResponse.data) ||
              _.isEmpty(objResponse.data.data)
            ) {
              self.isNoData = true;
              EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
              return;
            }
            self.responseMyStampList = objResponse.data?.data ?? [];
            self.pageCount = objResponse.data?.last_page ?? 0;
            if (objResponse.data?.total > 0) {
              self.isNoData = false;
            } else {
              self.isNoData = true;
            }
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          },

          complete() {},
        });
      }, // getAjaxStampDataResponse()
    },
  };
</script>

<style src="./stamp-page-style.css"></style>
