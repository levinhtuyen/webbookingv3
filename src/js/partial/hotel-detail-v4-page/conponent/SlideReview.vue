<template>
<div class="slide-review">
  <g2j-swiper-component
      v-if="!!dataSlideReview.length"
      :name="'slide-review'"
      :breakpoints="breakpoints"
      :data.sync="dataSlideReview"
      :option-more="{}"
    >
      <template slot-scope="slotProps">
        <div class="slide-block">
          <div @click="openModalReviewScrollBySn(slotProps.item.sn)" class="slide-block__content">
            <div v-if="slotProps.item.markClean != 0 || slotProps.item.markFacility != 0 || slotProps.item.markService != 0" class="slide-block__content--header">
              <div class="block">
                <p class="excellent option"><span>{{ $t('hotel_detail.detail_v4.review_c') }}</span></p>
                <p v-if="slotProps.item.markClean == 1">{{ $t('hotel_detail.detail_v4.very_bad') }}</p>
                <p v-if="slotProps.item.markClean == 2">{{ $t('hotel_detail.detail_v4.bad') }}</p>
                <p v-if="slotProps.item.markClean == 3">{{ $t('hotel_detail.detail_v4.normal') }}</p>
                <p v-if="slotProps.item.markClean == 4">{{ $t('hotel_detail.detail_v4.good') }}</p>
                <p v-if="slotProps.item.markClean == 5">{{ $t('hotel_detail.detail_v4.excellent') }}</p>
              </div>

              <div class="block">
                <p class="normal option"><span>{{ $t('hotel_detail.detail_v4.review_f') }}</span></p>
                <p v-if="slotProps.item.markFacility == 1">{{ $t('hotel_detail.detail_v4.very_bad') }}</p>
                <p v-if="slotProps.item.markFacility == 2">{{ $t('hotel_detail.detail_v4.bad') }}</p>
                <p v-if="slotProps.item.markFacility == 3">{{ $t('hotel_detail.detail_v4.normal') }}</p>
                <p v-if="slotProps.item.markFacility == 4">{{ $t('hotel_detail.detail_v4.good') }}</p>
                <p v-if="slotProps.item.markFacility == 5">{{ $t('hotel_detail.detail_v4.excellent') }}</p>
              </div>

              <div class="block">
                <p class="bad option"><span>{{ $t('hotel_detail.detail_v4.review_s') }}</span></p>
                <p v-if="slotProps.item.markService == 1">{{ $t('hotel_detail.detail_v4.very_bad') }}</p>
                <p v-if="slotProps.item.markService == 2">{{ $t('hotel_detail.detail_v4.bad') }}</p>
                <p v-if="slotProps.item.markService == 3">{{ $t('hotel_detail.detail_v4.normal') }}</p>
                <p v-if="slotProps.item.markService == 4">{{ $t('hotel_detail.detail_v4.good') }}</p>
                <p v-if="slotProps.item.markService == 5">{{ $t('hotel_detail.detail_v4.excellent') }}</p>
              </div>
            </div>


            <div class="slide-block__content--user">
              <div class="is-name">
                <p v-if="slotProps.item.userNickName">{{ getViewNickName(slotProps.item.userNickName) }}</p>
                <p v-else>***</p>
              </div>
              <div class="is-date"><p>{{ formatDate(slotProps.item.createTime) }}</p></div>
            </div>
            <div class="slide-block__content--name-room">
              <p>{{ slotProps.item.roomTypeName }}</p>
            </div>

            <div class="slide-block__content--comment">
              <p>{{ slotProps.item.comment }}</p>
            </div>
          </div>

          <div class="slide-block__content--like">
              <button :disabled="ui.isLoadingLike" @click="onLike(slotProps.item)">
                <i class="far fa-thumbs-up" :class="slotProps.item.isLiked ? 'text-g2j' : ''"></i>
                <span> {{ slotProps.item.numOfLike }}</span>
                <span>{{ $t('hotel_detail.detail_v4.likes') }}</span>
              </button>
            </div>
        </div>
      </template>

      <modal-review ref="filter-modal-reviews" />

    </g2j-swiper-component>
</div>
</template>

<script>
import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsPath/base/vuex/modules/page-info-module";
import { _, mapState, mapGetters } from "~jsPath/lib/lib-manager";
import { apiCaller } from "~jsHelperPath/service/ApiHandler";
import { AJAX_URL } from "~jsDefinePath/ajax-url";
import { getToken } from "~jsDefinePath/general";
import {
  G2JRouter,
} from '~jsHelperPath/util/HandleRouterGlobal';
import {
  ROUTER_NAME,
} from '~jsBasePath/vue-router/router-define';

export default {
components: {
  "g2j-swiper-component": () =>
      import(
        "~jsPartialPath/global/component/g2j-swiper-base/Go2JoySwiper.vue"
      ),
  },
  props: {
    userReviewFormList: {
      type: [Array,Object],
      default: '[]'
    },
  },
  data() {
    return {
      breakpoints: {
        320: {
          slidesPerView: 1.05,
          spaceBetween: 16,
        },
        375: {
          slidesPerView: 1.05,
          spaceBetween: 16,
        },
        // for pad
        758: {
          slidesPerView: 2.08,
          spaceBetween: 16,
        },
        // for desktop
        1280: {
          slidesPerView: 2.08,
          spaceBetween: 16,
        },
      },

      ui: {
        isLoadingLike: false,
        isLoading: false
      },
      commentReview: []
    }
  },
  computed: {
    ...mapState(PAGE_INFO_MODULE_NAME, {
      language: "language",
    }),
    dataSlideReview(){
      return this.userReviewFormList
    },
    ...mapGetters(PAGE_INFO_MODULE_NAME, {
        hasUserInfo: "hasUserInfo",
      }),
  },
  methods: {
    formatDate (date) {
        let CDate = dayjs(date).locale(this.language).format("DD/MM/YYYY");
        return CDate
    },// formatDate()

    openModalReviewScrollBySn(sn) {
      this.$emit("openModalReviewScrollBySn", sn);
    }, // openModalReviewScrollBySn

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
              let j = self.userReviewFormList.find(d => d.sn == item.sn)
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
    
    getViewNickName(string){
      let textFirst = string.slice(0,1)
      let textLast = string.slice(-1)
      let stringA = string.slice(1,-1)
      let stringB = ''
      for (var i = 0; i < stringA.length; i++){
        let a = stringA[i].replace(stringA[i],'*')
          stringB = stringB.concat(a)
      }
      return textFirst + stringB + textLast
    } // getViewNickName
  },
}
</script>
