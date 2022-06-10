<template>
  <div>
    <div class="promotion-content-tab">
      <div
        class="promotion-content-tab__btn"
        @click="chooseActiveTab('promotion')"
      >
        <div
          class="promotion-content-tab__btn--title"
          :class="checkActivePromotion == true ? 'active' : ''"
        >
          <div :class="checkActivePromotion == true ? 'active' : ''">
            <h1>
              {{ $t("promotion.promotions") }}
            </h1>
          </div>
        </div>
      </div>
      <div />
      <!-- <div class="promotion-content-tab__btn" @click="chooseActiveTab('event')">
                <div class="promotion-content-tab__btn--title" :class="checkActiveEvent == true ? 'active' : ''">
                    <p>
                        {{ $t('promotion.events')}}
                    </p>
                </div>
            </div> -->
    </div>

    <div
      v-if="checkActivePromotion == true && checkData == 1"
      class="promotion-content-list"
    >
      <div
        v-for="promotion in dataPromotion"
        :key="promotion.sn"
        class="promotion-content-list__item"
      >
        <PromotionItem
          v-if="promotion"
          :promotion="promotion"
          :type-promotion="1"
        />
      </div>
      <div class="promotion-content-list__footer">
        <Pagination
          v-if="dataPromotion && dataPromotion.length"
          position="center"
          :page-sizes="pageCount"
          :current-page="currentPage"
          @changeCurrentPage="changeCurrentPage"
        />
      </div>
    </div>
    <NoData v-if="checkData == 0" />
    <div
      v-if="checkActiveEvent == true && checkData == 1"
      class="promotion-content-list"
    >
      <div
        v-for="promotion in dataEvent"
        :key="promotion.sn"
        class="promotion-content-list__item"
      >
        <PromotionItem
          v-if="promotion"
          :promotion="promotion"
          :type-promotion="0"
        />
      </div>
      <div class="promotion-content-list__footer">
        <Pagination
          v-if="dataEvent && dataEvent.length"
          position="center"
          :page-sizes="pageCountEvent"
          :current-page="currentPageEvent"
          @changeCurrentPage="changeCurrentPageEvent"
        />
      </div>
    </div>
    <modal v-if="showModal" @close="showModal = false" />
  </div>
</template>

<script>
import {
  getToken,
  BOT_INFO,
} from "~jsDefinePath/general";
import { AJAX_URL } from "~jsDefinePath/ajax-url";
import { apiCaller } from '~jsHelperPath/service/ApiHandler';
import NoData from "./noDataSection.vue";
import PromotionItem from "./PromotionItem.vue";
import modal from "../../global/component/popup-show/PopUpShowPromotion.vue";
import Pagination from "../../global/component/pagination/Pagination.vue";
export default {
  components: {
    modal,
    PromotionItem,
    Pagination,
    NoData,
  },
  data() {
    return {
      pageSize: 10,
      dataPromotion: null,
      checkActivePromotion: true,
      checkActiveEvent: false,
      showModal: false,
      currentPage: 1,
      pageSizes: 10,
      currentPageEvent: 1,
      pageSizesEvent: 10,
      dataEvent: [],
      checkData: 1,
    };
  },
  async created() {
    await this.getDataListPromotion();
    EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
  },
  mounted() {},
  methods: {
    changeCurrentPage(page) {
      this.reloadTableDataPromotion(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, //changeCurrentPage

    changeCurrentPageEvent(page) {
      this.reloadTableDataEvent(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, //changeCurrentPageEvent

    async getDataListPromotion() {
      let self = this;
      EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
      await apiCaller({
        metaUrl: AJAX_URL.promotion.promotionTab,
        dataType: "json",
        method: "GET",
        headers: {
          Authorization: getToken(),
        },
        data: {
          limit: (BOT_INFO.isBot ? 100 : 10),
          type: 1,
          page: self.currentPage,
        },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
          let data = result.data;

          if (data.promotionFormList && data.promotionFormList.length > 0) {
            self.dataPromotion = data.promotionFormList;
            self.checkData = 1;
          } else {
            self.checkData = 0;
          }
          self.pageCount = data.meta.lastPage;
          EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
        },
        error: function (error) {
          console.log("error :>> ", error);
          this.checkData = 0;
          EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
        },
      });
    }, //getDataListPromotion

    getDataListEvent() {
      let self = this;
      EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
      apiCaller({
        metaUrl: AJAX_URL.promotion.promotionTab,
        dataType: "json",
        method: "GET",
        headers: {
          Authorization: getToken(),
        },
        data: {
          limit: (BOT_INFO.isBot ? 100 : 10),
          type: 2,
          page: self.currentPageEvent,
        },
        // headers: {
        //   "Device-Encode": "device_for_web",
        //   Authorization: "",
        // },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
          let data = result.data;
          if (data.promotionFormList && data.promotionFormList.length > 0) {
            self.dataEvent = data.promotionFormList;
            self.checkData = 1;
          } else {
            self.checkData = 0;
          }
          self.pageCountEvent = data.meta.lastPage;
          EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
        },
        error: function (error) {
          console.log("error :>> ", error);
          this.checkData = 0;
          EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
        },
      });
    }, //getDataListEvent

    reloadTableDataEvent(currentPage) {
      let self = this;
      EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
      apiCaller({
        metaUrl: AJAX_URL.promotion.promotionTab,
        dataType: "json",
        method: "GET",
        headers: {
          Authorization: getToken(),
        },
        data: {
          limit: (BOT_INFO.isBot ? 100 : 10),
          type: 2,
          page: currentPage,
        },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
          let data = result.data;
          self.dataEvent = data.promotionFormList;
          self.pageCountEvent = data.meta.lastPage;
          EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
        },
        error: function (error) {
          console.log("error :>> ", error);
        },
      });
    }, //reloadTableDataEvent

    reloadTableDataPromotion(currentPage) {
      let self = this;
      EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
      apiCaller({
        metaUrl: AJAX_URL.promotion.promotionTab,
        dataType: "json",
        method: "GET",
        headers: {
          Authorization: getToken(),
        },
        data: {
          limit: (BOT_INFO.isBot ? 100 : 10),
          type: 1,
          page: currentPage,
        },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
          let data = result.data;
          self.dataPromotion = data.promotionFormList;
          self.pageCount = data.meta.lastPage;
          EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
        },
        error: function (error) {
          console.log("error :>> ", error);
        },
      });
    }, //reloadTableDataPromotion

    chooseActiveTab(string) {
      if (string == "promotion") {
        this.checkActivePromotion = true;
        this.checkActiveEvent = false;
      } else {
        this.getDataListEvent();
        this.checkActivePromotion = false;
        this.checkActiveEvent = true;
      }
    }, //chooseActiveTab

    checkAction(promotion) {
      if (promotion.action == 11) {
        return `{name: 'promotion-page', params: {id: ` + promotion.sn + `}}`;
      } else {
        return (
          `{name: 'detail-promotion-page', params: {id: ` + promotion.sn + `}}`
        );
      }
    }, //checkAction
  },
};
</script>
