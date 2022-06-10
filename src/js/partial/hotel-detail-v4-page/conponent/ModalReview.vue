<template>
  <modal
    ref="filter-modal-reviews"
    :visible.sync="visible"
    class="filter-modal-reviews"
    :isClose="ui.isHidenButtonClose"
    @beforeClose="beforeClose"
  >
    <!-- :disableClickBackground="ui.disableClickBackground" -->
    <template slot="header">
      <div class="modal-header">
        <i
          v-if="!ui.isHidenButtonClose && !ui.isListReview"
          class="fas fa-chevron-left"
          @click="onBackReview"
        ></i>
        <i
          v-if="ui.isHidenButtonClose && !ui.isListReview"
          class="fas fa-chevron-left"
          @click="onBackReview"
        ></i>
        <i
          v-if="!ui.isHidenButtonClose && ui.isListReview"
          class="fas fa-chevron-left"
          @click="onBack"
        ></i>

        <h2 v-if="ui.isListReview">{{ $t("hotel_detail.detail_v4.review") }}</h2>
        <h2 v-else>{{ $t('hotel_detail.detail_v4.edit_review') }}</h2>
      </div>
    </template>
    <template slot="body">
      <div class="filter-modal-reviews__body">
        <div class="filter-modal-reviews__body--sort">
          <reviews
            v-if="ui.isListReview"
            :startReview="startReview"
            :sn="sn"
            :hotelSn="hotelSn"
            @onEdit="onEdit"
          />
          <edit-review
            @reviewList="getReviewList"
            :basicInfo="dataReviewBySn"
            v-else
          />
        </div>
      </div>
    </template>
    <template slot="footer"></template>
  </modal>
</template>

<script>
  import { IMAGE_URL } from "~jsDefinePath/general";
  import { _ } from "~jsLibPath/lib-manager";

  import Reviews from "./Reviews.vue";
  import EditReview from "./EditReview.vue";
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import { getToken } from "~jsDefinePath/general";

  export default {
    props: {
      filter: [Object, Array],
      errorList: [Object, Array],
      sn: [String, Number],
      hotelSn: [String, Number],
    },
    components: {
      modal: () =>
        import("~jsPartialPath/global/component/modal/ModalComponent.vue"),
      Reviews,
      EditReview,
    },
    data() {
      return {
        visible: false,
        IMAGE_URL,
        ui: {
          disableClickBackground: true,
          isListReview: true,
          isHidenButtonClose: false,
        },
        startReview: [],
        commentReview: [],
        dataReviewBySn: [],
      };
    },

    created() {
      if (window.outerWidth > 640) {
        this.ui.isHidenButtonClose = true;
      } else {
        this.ui.isHidenButtonClose = false;
      }
    },

    methods: {
      isEmpty: _.isEmpty,
      showModal() {
        this.ui.isListReview = true;
        this.visible = true;
      }, // showModal
      closeModal() {
        this.visible = false;
        this.$emit("resetModal");
      }, // closeModal

      async getReviewList() {
        const self = this;
        this.ui.isListReview = true;
        apiCaller({
          metaUrl: AJAX_URL.hotel_v4.getReviewList,
          data: {
            hotelSn: self.$route.query.hotelSn,
            limit: 10,
            page: 1,
          },
          method: "GET",
          headers: {
            Authorization: getToken(),
          },
          dataType: "json",
          error(err) {
            self.errorList = err.response?.data.error || [];
          },
          success(objResponse) {
            if (_.isEmpty(objResponse) || objResponse.error) {
              self.errorList = objResponse.error;
              return;
            }

            let data = objResponse?.data ?? [];
            self.startReview = data[0];

            // xóa data đầu tiên của mảng
            data.shift();
            self.commentReview = data;
          },
          complete() {
            self.ui.isListReview = true;
          },
        });
      }, // getReviewList

      onEdit(data) {
        this.dataReviewBySn = data;
        this.ui.isListReview = false;
      }, // onEdit

      onBack() {
        this.closeModal();
      }, // onBack

      onBackReview() {
        this.ui.isListReview = true;
      }, // onBackReview

      beforeClose() {
        this.$emit("reloadReviews");
        this.closeModal();
      }, // beforeClose
    },
    watch: {
      visible(val) {
        this.$emit("update:visible", val);
      },
    },
  };
</script>
