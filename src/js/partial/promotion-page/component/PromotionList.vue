<template>
    <div>

        <div class="promotion-content-list" v-if="checkActivePromotion == true && checkData == 1">
            <div v-for="(promotion) in dataPromotion" :key="promotion.sn"  class="promotion-content-list__item">
                <PromotionItem v-if="promotion"  :promotion="promotion" :typePromotion="1"></PromotionItem>
            </div>
            <div class="promotion-content-list__footer">
            <Pagination
                v-if="dataPromotion && dataPromotion.length"
                position="center"
                :pageSizes="pageCount"
                :current-page="currentPage"
                @changeCurrentPage="changeCurrentPage"
            />
        </div>

        </div>
        <NoData v-else></NoData>
        <modal v-if="showModal" @close="showModal = false">
        </modal>
    </div>
</template>

<script>
  import {
  getToken,
  BOT_INFO,
} from "~jsDefinePath/general";
import {
    AJAX_URL
  } from '~jsDefinePath/ajax-url';
  import { apiCaller } from '~jsHelperPath/service/ApiHandler';
import PromotionItem from './PromotionItem.vue'
import modal from './../../global/component/popup-show/PopUpShowPromotion.vue'
import Pagination from './../../global/component/pagination/Pagination.vue'
import NoData from './noDataSection.vue'
    export default {
        components: {
          modal,PromotionItem,
          Pagination,
          NoData
        },
        data() {
            return {
                pageSize: 10,
                dataPromotion: null,
                checkActivePromotion: true,
                checkActiveEvent: false,
                showModal: false,
                currentPage: 1,
                pageSizes: 1,
                checkData: 1,
            }
        },
        created() {
            EventBus.emit('IS_SHOW_ROUTER_LOADING', false);
            this.getDataListPromotion()
        },
        methods: {
            changeCurrentPage (page) {
                this.reloadTableData(page)
                window.scrollTo({ top: 0, behavior: 'smooth' });

            },//changeCurrentPage

            getDataListPromotion() {
                let self = this
                EventBus.emit('IS_SHOW_ROUTER_LOADING', true);
                apiCaller({
                    metaUrl: AJAX_URL.promotion.promotionTab,
                    dataType: 'json',
                    method: "GET",
                    headers: {
                      Authorization: getToken(),
                    },
                    data: {
                      limit: (BOT_INFO.isBot ? 100 : 10),
                      type: 1,
                      page: self.currentPage,
                    },
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        let data = result.data
                        if(data.promotionFormList && data.promotionFormList.length > 0){
                          self.checkData = 1
                          self.dataPromotion = data.promotionFormList
                        }else{
                          self.checkData = 0
                        }

                        self.pageCount = data.meta.lastPage
                        EventBus.emit('IS_SHOW_ROUTER_LOADING', false);
                    },
                    error: function (error) {
                        console.log('error :>> ', error);
                        this.checkData = 0
                        EventBus.emit('IS_SHOW_ROUTER_LOADING', false);
                    }

                });

            },//getDataListPromotion

            reloadTableData(currentPage) {
                let self = this
                EventBus.emit('IS_SHOW_ROUTER_LOADING', true);
                apiCaller({
                    metaUrl: AJAX_URL.promotion.promotionTab,
                    dataType: 'json',
                    method: "GET",
                    headers: {
                      Authorization: getToken(),
                    },
                    data: {
                      limit: (BOT_INFO.isBot ? 100 : 10),
                      type: 1,
                      page: currentPage,
                    },
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        let data = result.data
                        if(data.promotionFormList && data.promotionFormList.length > 0){
                          self.checkData = 1
                          self.dataPromotion = data.promotionFormList
                        }else{
                          self.checkData = 0
                        }
                        self.pageCount = data.meta.lastPage
                        EventBus.emit('IS_SHOW_ROUTER_LOADING', false);
                    },
                    error: function (error) {
                        console.log('error :>> ', error);
                        this.checkData = 0
                        EventBus.emit('IS_SHOW_ROUTER_LOADING', false);
                    }

                });

            },//reloadTableData
        },
    }
</script>
