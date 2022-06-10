<template>
  <div class="comment-page">
    <div class="comment-page-back">
      <BackButtonComponent></BackButtonComponent>
    </div>
    <div class="comment-page__big-comment">
      <div class="comment-page__big-comment--number-start">
        <p class="total-start">
          <i class="style-start fas fa-star">
            <span class="big-number">{{ statistics.averageMark }}</span>
          </i>
        </p>
      </div>
      <div class="comment-page__big-comment--number-review">
        <p><span class="number">{{ statistics.totalReview }}</span><span class="review"> {{ $t("comment.reviews") }}</span></p>
      </div>
    </div>
    <div class="comment-page__content-start">
      <Commentstart
        v-if="start1"
        :dataReview="start1"
        :start="statistics.averageMarkClean"
        :color="orange"
      ></Commentstart>
      <Commentstart
        v-if="start2"
        :dataReview="start2"
        :start="statistics.averageMarkFacility"
        :color="blue"
      ></Commentstart>
      <Commentstart
        v-if="start3"
        :dataReview="start3"
        :start="statistics.averageMarkService"
        :color="primary"
      ></Commentstart>
    </div>
    <div class="comment-page__content-start">
      <div
        v-for="(review,index) in hotelReviewList"
        :key="index"
      >
        <Commentreview
          v-if="review"
          :review="review"
        ></Commentreview>
      </div>
    </div>
    <div class="comment-page__pagination">
      <Pagination
        v-if="hotelReviewList && hotelReviewList.length"
        position="center"
        :pageSizes="pageCount"
        :current-page="currentPage"
        @changeCurrentPage="changeCurrentPage"
      />
    </div>
  </div>
</template>

<script>
  import { apiCaller } from '~jsHelperPath/service/ApiHandler';
  import BackButtonComponent from './../global/component/back-button/BackButtonComponent.vue';
  import Commentstart from './component/Commentstart.vue'
  import Commentreview from './component/Commentreview.vue'
  import Pagination from './../global/component/pagination/Pagination.vue'
  export default {
    name: 'TheCommentPage',
    components: {
      BackButtonComponent,
      Commentstart,
      Commentreview,
      Pagination
    },
    data () {
      return {
        orange: 'orange',
        blue: 'blue',
        primary: 'primary',
        hotelReviewList: [],
        start1: null,
        start2: null,
        start3: null,
        statistics: [],
        currentPage: 1,
        pageSizes: 10,
        pageSize: 10,
        id: this.$route.params.hotelSn,
        pageCount: 1
      }
    },

    created () {
      EventBus.emit('IS_SHOW_ROUTER_LOADING', false);
      this.getDataListPromotion()
    },
    methods: {
      changeCurrentPage (page) {
        this.reloadDataComment(page)
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      async getDataListPromotion () {
        EventBus.emit('IS_SHOW_ROUTER_LOADING', true);
        let self = this
        try {
          let res = await apiCaller({
            url: `https://webbooking-api.go2joy.vn/api/v1/web-booking/hotel/getReviewList?limit=${self.pageSize}&page=1&hotelSn=${self.id}`,
            dataType: 'json',
            type: "GET",
            headers: {
              'Device-Encode': 'device_for_web',
              'Authorization': ''
            },
            contentType: 'application/json; charset=utf-8',
          })
          self.hotelReviewList = res.data.hotelReviewList
          self.pageCount = res.data.meta.lastPage
          self.statistics = res.data.statistics
          self.start1 = res.data.statistics.numOfStarReview[0]
          self.start2 = res.data.statistics.numOfStarReview[1]
          self.start3 = res.data.statistics.numOfStarReview[2]
          EventBus.emit('IS_SHOW_ROUTER_LOADING', false);
        } catch (error) {

        }

      },
      reloadDataComment (currentPage) {
        let self = this
        EventBus.emit('IS_SHOW_ROUTER_LOADING', true);
        apiCaller({
          url: `https://webbooking-api.go2joy.vn/api/v1/web-booking/hotel/getReviewList?limit=${self.pageSize}&page=${currentPage}&hotelSn=${self.id}`,
          dataType: 'json',
          type: "GET",
          headers: {
            'Device-Encode': 'device_for_web',
            'Authorization': ''
          },
          contentType: 'application/json; charset=utf-8',
          success: function (result) {
            let data = result.data
            self.hotelReviewList = data.hotelReviewList
            self.pageCount = data.meta.lastPage
            EventBus.emit('IS_SHOW_ROUTER_LOADING', false);
          },
          error: function (error) {
            console.log('error :>> ', error);
          }

        });

      },
    },
  }
</script>

<style src="./comment-page-style.css"></style>
