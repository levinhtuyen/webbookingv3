<template>
  <div class="article-page">
    <section class="article-section">
        <div class="container">
          <div class="article-block">
            <!-- <BackButtonComponent></BackButtonComponent> -->
            <!-- <TheGo2JoyBackComponent :title="$t('bloglist.bloglist')" /> -->
            <div class="article-section-list">
                <div v-for="(dataArticle,index) in dataListArticle" :key="index">
                    <ArticleItem
                      :dataArticle="dataArticle"
                    />
                </div>
            </div>
            <Pagination
                v-if="
                  dataListArticle &&
                  dataListArticle.length &&
                  pageCount > 1
                "
                position="center"
                :pageSizes="pageCount"
                :current-page="currentPage"
                @changeCurrentPage="changeCurrentPage"
            />
          </div> <!-- article-block -->
        </div>
    </section> <!-- .article-section -->
  </div> <!-- .article-page -->
</template>

<script>
// import TheGo2JoyBackComponent from '../../global/component/go2joy-back/TheGo2JoyBack.vue';
import { apiCaller } from '~jsHelperPath/service/ApiHandler';
import ArticleItem from './ArticleItem.vue';
import Pagination from '../../global/component/pagination/Pagination.vue';

export default {
    name: "TheArticleSection",
    components: {
        ArticleItem,
        Pagination,
        // TheGo2JoyBackComponent,
    },
    data () {
        return {
            pageSize: 10,
            dataListArticle: [],
            pageCount: 1,
            currentPage: 1,
        }
    },
    created () {
        this.getDataArticle()
        EventBus.emit('IS_SHOW_ROUTER_LOADING', false);
    },
    methods: {
        getDataArticle() {
            let self = this
            EventBus.emit('IS_SHOW_ROUTER_LOADING', true);
            apiCaller({
                url: `https://webbooking-api.go2joy.vn/api/v1/web-booking/home/getLimitArticles?notDisplaySn=&limit=${self.pageSize}`,
                dataType: 'json',
                type: "GET",
                headers: {
                    'Device-Encode': 'device_for_web',
                    'Authorization': ''
                },
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    let data = result.data
                    self.dataListArticle = data.arlicles
                    EventBus.emit('IS_SHOW_ROUTER_LOADING', false);
                },
                error: function (error) {
                    console.log('error :>> ', error);
                }

            });

        },// getDataArticle()

        changeCurrentPage (page) {
            this.reloadTableData(page)
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },// changeCurrentPage()

        reloadTableData(currentPage) {
                let self = this
                EventBus.emit('IS_SHOW_ROUTER_LOADING', true);
                apiCaller({
                    url: `https://webbooking-api.go2joy.vn/api/v1/web-booking/home/getLimitArticles?notDisplaySn=&limit=${self.pageSize}&page=${currentPage}`,
                    dataType: 'json',
                    type: "GET",
                    headers: {
                        'Device-Encode': 'device_for_web',
                        'Authorization': ''
                    },
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        let data = result.data
                        self.dataListArticle = data.arlicles
                        self.pageCount = data.meta.lastPage
                        EventBus.emit('IS_SHOW_ROUTER_LOADING', false);
                    },
                    error: function (error) {
                        console.log('error :>> ', error);
                    }

                });

        },// reloadTableData()

    },
}
</script>
