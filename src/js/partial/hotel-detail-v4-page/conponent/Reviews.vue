<template>
  <div class="reviews">
    <div class="reviews__rated">
      <div class="reviews__rated--star">
        <i class="fas fa-star fa-2x"></i>
        <h2>{{ getStartReview.averageMark }}</h2>
      </div>
      <div class="reviews__rated--sub">
        {{ getStartReview.totalReview }} {{ $t('hotel_detail.detail_v4.people_rated_here') }}
      </div>
    </div>
    <div class="reviews__map">
      <div class="reviews__map--flex">
          <div class="block">
            <span class="cleanliness">{{ $t('hotel_detail.detail_v4.review_c') }}</span>
            <span>{{ $t('hotel_detail.detail_v4.cleanliness') }}</span>
          </div>

          <div class="slider">
            <the-go-2-joy-slider
              :disable="true"
              :minValue="0"
              :maxValue="5"
              :percentValue="getStartReview.averageMarkClean"
              >
            </the-go-2-joy-slider>
          </div>

          <div class="rating">{{ getStartReview.averageMarkClean }}</div>
      </div>

      <div class="reviews__map--flex">
          <div class="block">
            <span class="facilities">{{ $t('hotel_detail.detail_v4.review_f') }}</span>
            <span>{{ $t('hotel_detail.detail_v4.facilities') }}</span>
          </div>

          <div class="slider">
            <the-go-2-joy-slider
              :disable="true"
              :minValue="0"
              :maxValue="5"
              :percentValue="getStartReview.averageMarkFacility"
              >
            </the-go-2-joy-slider>
          </div>

          <div class="rating">{{ getStartReview.averageMarkFacility }}</div>
      </div>

      <div class="reviews__map--flex">
          <div class="block">
            <span class="services">{{ $t('hotel_detail.detail_v4.review_s') }}</span>
            <span>{{ $t('hotel_detail.detail_v4.services') }}</span>
          </div>

          <div class="slider">
            <the-go-2-joy-slider
              :disable="true"
              :minValue="0"
              :maxValue="5"
              :percentValue="getStartReview.averageMarkService"
              >
            </the-go-2-joy-slider>
          </div>

          <div class="rating">{{ getStartReview.averageMarkService }}</div>
      </div>

    </div>

    <div class="border-bottom"></div>

    <div class="reviews__resp">
      <div class="info-user" v-for="(item, index) in getCommentReview" :key="index">
        <div v-if="item.markClean != 0 || item.markFacility != 0 || item.markService != 0" class="reviews__resp--flex">
          <div class="block" v-if="item.markClean != 0">
            <span class="excellent">{{ $t('hotel_detail.detail_v4.review_c') }}</span>
            <span v-if="item.markClean == 1">{{ $t('hotel_detail.detail_v4.very_bad') }}</span>
            <span v-if="item.markClean == 2">{{ $t('hotel_detail.detail_v4.bad') }}</span>
            <span v-if="item.markClean == 3">{{ $t('hotel_detail.detail_v4.normal') }}</span>
            <span v-if="item.markClean == 4">{{ $t('hotel_detail.detail_v4.good') }}</span>
            <span v-if="item.markClean == 5">{{ $t('hotel_detail.detail_v4.excellent') }}</span>
          </div>

          <div class="block" v-if="item.markFacility != 0">
            <span class="normal">{{ $t('hotel_detail.detail_v4.review_f') }}</span>
            <span v-if="item.markFacility == 1">{{ $t('hotel_detail.detail_v4.very_bad') }}</span>
            <span v-if="item.markFacility == 2">{{ $t('hotel_detail.detail_v4.bad') }}</span>
            <span v-if="item.markFacility == 3">{{ $t('hotel_detail.detail_v4.normal') }}</span>
            <span v-if="item.markFacility == 4">{{ $t('hotel_detail.detail_v4.good') }}</span>
            <span v-if="item.markFacility == 5">{{ $t('hotel_detail.detail_v4.excellent') }}</span>
          </div>

          <div class="block" v-if="item.markService != 0">
            <span class="bad">{{ $t('hotel_detail.detail_v4.review_s') }}</span>
            <span v-if="item.markService == 1">{{ $t('hotel_detail.detail_v4.very_bad') }}</span>
            <span v-if="item.markService == 2">{{ $t('hotel_detail.detail_v4.bad') }}</span>
            <span v-if="item.markService == 3">{{ $t('hotel_detail.detail_v4.normal') }}</span>
            <span v-if="item.markService == 4">{{ $t('hotel_detail.detail_v4.good') }}</span>
            <span v-if="item.markService == 5">{{ $t('hotel_detail.detail_v4.excellent') }}</span>
          </div>
        </div>

        <div class="info-basic" :id="item.sn">
          <span class="bold">{{ formatNickName(item.userNickName) }}</span>
          <span>| {{ formatDate(item.createTime) }}</span>

          <button :class="checkHidenButtonEdit(item.appUserSn) == true ? 'display-none' : ''" @click="onEdit(item)"><i class="fas fa-pen"></i></button>
        </div>

        <div class="info-content">
          <p class="bold info-name">{{ item.roomTypeName }}</p>
          <p>{{ item.comment }}</p>
        </div>

        <div class="reviews__like">
          <button :disabled="ui.isLoadingLike" @click="onLike(item)" >
            <i class="far fa-thumbs-up" :class="item.isLiked ? 'text-g2j' : ''"></i>
          </button>
          {{ item.numOfLike }}
        </div>
        <div class="reviews__reply" v-if="item.hotelReply">
          <div class="info-user">
            <div class="info-content">
              <p class="bold info-name">{{ $t('hotel_detail.detail_v4.hotel_reply') }}</p>
              <p>{{ item.hotelReply }}</p>
            </div>
          </div>
        </div>

        <div class="line"></div>
      </div>
    </div>

    <infinite-loading
      :distance="500"
      :throttle-limit="100"
      spinner="circles"
      @infinite="infiniteHandler"
    >
      <div slot="no-more"></div>
      <div slot="no-results"></div>
    </infinite-loading>

  </div>
</template>

<script>
import TheGo2JoySlider from "~jsPartialPath/global/component/go2joy-slider/TheGo2JoySlider.vue";
import { apiCaller } from "~jsHelperPath/service/ApiHandler";
import { AJAX_URL } from "~jsDefinePath/ajax-url";
import { getToken } from "~jsDefinePath/general";
import {
  ROUTER_NAME,
} from '~jsBasePath/vue-router/router-define';
import {
  G2JRouter,
} from '~jsHelperPath/util/HandleRouterGlobal';
import { mapGetters } from "~jsPath/lib/lib-manager";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsPath/base/vuex/modules/page-info-module";

export default {
    components: { TheGo2JoySlider },
    props: {
      startReview: [Array, Object],
      sn: [String, Number],
      hotelSn: [String, Number],
    },

    data() {
      return {
        page: 1,
        ui: {
          isLoadingLike: false,
          isLoaded: false
        },
        commentReview: []
      }
    },

    computed: {
      getStartReview() {
        return this.startReview
      },
      getCommentReview() {
        return this.commentReview
      },
      getReviewSn() {
        return this.sn;
      },
      ...mapGetters(PAGE_INFO_MODULE_NAME, {
        hasUserInfo: "hasUserInfo",
      })
    },

    methods: {
      formatDate (date) {
        let CDate = dayjs(date).format('DD/MM/YYYY')
        return CDate
      },// formatDate()

      formatNickName(nickName) {
        if(nickName) {
          let firstCharacter = nickName.substring(0,1);
          let lastCharacter = nickName.slice(-1);
          let sanitizedEmail = firstCharacter + "*****" + lastCharacter;
          return sanitizedEmail;
        }
      }, // formatNickName

      onLike(item) {
        this.ui.isLoadingLike = true;
        if(!this.hasUserInfo) {
          G2JRouter.replace({ name: ROUTER_NAME['login-page'] });
        } else {
          const self = this;
          let status = !item.isLiked
          apiCaller({
              metaUrl: AJAX_URL.hotel_v4.updateLikeUserReview,
              data: {
                sn            : item.sn,
                status        : !item.isLiked,
              },
              method: 'POST',
              headers: {
                  Authorization: getToken(),
              },
              dataType: 'json',
              error(err) {
                  self.errorList = err.response?.data.error || []
              },
              success(objResponse) {
              if(
                  _.isEmpty(objResponse) ||
                  objResponse.error
              ) {
                  self.errorList = objResponse.error;
                  return;
              }

                // let data = objResponse?.data ?? [];
                item.isLiked = status;
              },
              complete() {
                let j = self.commentReview.find(d => d.sn == item.sn)
                if(item.isLiked) {
                  j.numOfLike = j.numOfLike + 1
                } else {
                  j.numOfLike = j.numOfLike - 1
                }
                self.ui.isLoadingLike = false;
              },
          });
        }
      }, // onLike

    checkHidenButtonEdit(userReviewSn) {
        // Đã login & chính user đó login
       // const userInfo = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : '';
       const userInfo = localStorage.getItem("userInfo")
         ? JSON.parse(
             decodeURIComponent(
               escape(window.atob(localStorage.getItem("userInfo")))
             )
           )
         : "";
       if (this.hasUserInfo && userInfo && userInfo.sn == userReviewSn) {
         return false;
       }
       return true;
     }, // checkHidenButtonEdit

      onEdit(data) {
        this.$emit('onEdit', data)
      }, // onEdit

      openModalReviewScrollBySn() {
        let self = this;
        if(self.getReviewSn && !self.ui.isLoaded) {
          setTimeout(() => {
            document.getElementById(self.getReviewSn).scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
          }, 1000);
        }
      }, // openModalReviewScrollBySn

      infiniteHandler($state) {
        const self = this;
        if(self.commentReview.length == 0 || self.commentReview.length >= 9) {
          apiCaller({
            metaUrl: AJAX_URL.hotel_v4.getReviewList,
            data: {
                hotelSn     : self.hotelSn,
                limit       : 10,
                page        : this.page
            },
            method: 'GET',
            headers: {
                Authorization: getToken(),
            },
            dataType: 'json',
            error(err) {
                self.errorList = err.response?.data.error || []
                $state.complete();
            },
            success(objResponse) {
            if(
                _.isEmpty(objResponse) ||
                objResponse.error ||
                _.isEmpty(objResponse.data) ||
                _.isEmpty(objResponse.data[1])
            ) {
                self.errorList = objResponse.error;
                $state.complete();
                return;
            }
              let data = objResponse?.data ?? [];

              if (data.length) {
                self.page += 1;
                self.startReview = data[0]
                // xóa data đầu tiên của mảng
                data.shift();
                self.commentReview.push(...data);
                $state.loaded();
              } else {
                $state.complete();
              }
            },
            complete() {
              self.openModalReviewScrollBySn()
              self.ui.isLoaded = true;
            },
          });
        } else {
          $state.complete();
        }
      } // infiniteHandler
    }
}
</script>
