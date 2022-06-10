<template>
  <div>
    <template v-if="promotion.typesOfDisplay == 0">
      <div class="promotion-content-list__item--image">
        <!-- <router-link :to="checkAction(promotion)"> -->
        <router-link
          :to="promotionDetailPath[language]"
          v-slot="{ href, navigate }"
        >
          <a :href="href" @click="navigate">
            <g2j-image
              :url-img="`${ASSETS_SERVICE_URL}/${promotion.imageList[0].imagePath}`"
            ></g2j-image>
            <!-- <img :src="$formatLinkImage(promotion.imageList[0].imagePath)" alt=""> -->
          </a>
        </router-link>
      </div>
      <div
        class="promotion-content-list__item--apply"
        v-if="(promotion.canApply == true || signIn == false) && isShow == true"
      >
        <div
          class="apply-now"
          @click="
            applyNowCoupon(promotion),
              G2JDablenaTracking(DABLE_TRACKING.TRACKING_APPLY_NOW_PROMOTION)
          "
        >
          <p class="title">{{ $t("promotion.apply_now") }}</p>
        </div>

      </div>


       <!-- <div v-else class="promotion-content-list__item--apply">
         <div class="apply-now" @click="onShowListHotel(promotion)">
            <p class="title">More</p>
         </div>
      </div> -->

    </template>
    <template v-else>
      <div class="promotion-content-list__item--image">
        <!-- <router-link :to="checkAction(promotion)"> -->
        <div class="promotion-item">
          <div class="promotion-item__img">
            <router-link
              :to="promotionDetailPath[language]"
              v-slot="{ href, navigate }"
            >
              <a :href="href" @click="navigate">
                <img
                  :src="$formatLinkImage(promotion.imageList[0].imagePath)"
                  alt=""
                />
              </a>
            </router-link>
          </div>
          <div class="promotion-item__detail-hotel">
            <p v-html="getStringSubConent(promotion.subContentVi)"></p>
          </div>
        </div>
      </div>
      <div
        class="promotion-content-list__item--apply"
        v-if="promotion.canApply == true && isShow == true"
      >
        <div
          class="apply-now"
          @click="
            applyNowCoupon(promotion),
              G2JDablenaTracking(DABLE_TRACKING.TRACKING_APPLY_NOW_PROMOTION)
          "
        >
          <p class="title">{{ getStringButton(promotion.nameOfButton) }}</p>
        </div>
      </div>
      <!-- <div v-if="promotion.canApply == false" class="promotion-content-list__item--apply">
        <div class="apply-now" @click="onShowListHotel(promotion)">
          <p class="title">More</p>
        </div>
      </div> -->
    </template>
    <PopupApplyCouponSuccess
      ref="popup-modal-apply-coupon-success"
      @close="closePopupModalApplyCouponSuccess"
    >
    </PopupApplyCouponSuccess>
    <PopupApplyCouponError
      v-if="getErrorObj"
      :getErrorObj="getErrorObj"
      ref="popup-modal-apply-coupon-error"
      @close="closePopupModalApplyCouponError"
    >
    </PopupApplyCouponError>
    <ModalSelectHotel ref="modal-select-hotel"> </ModalSelectHotel>
  </div>
</template>

<script>
import { _, mapState } from "~jsLibPath/lib-manager";
import { ASSETS_SERVICE_URL } from "~jsDefinePath/general";
import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/page-info-module";
import { getPromotionDetailPath } from "~jsHelperPath/util/HandleUrl";
import { getToken } from "~jsDefinePath/general";
import { AJAX_URL } from "~jsDefinePath/ajax-url";
import {
  DABLE_TRACKING,
} from "~jsDefinePath/tracking-define";
import {
  G2JDablenaTracking,
} from "~jsHelperPath/util/HandleTracking";
import { apiCaller } from '~jsHelperPath/service/ApiHandler';
import PopupApplyCouponSuccess from "./popupApplyCouponSuccess.vue";
import PopupApplyCouponError from "./popupApplyCouponError.vue";
import ModalSelectHotel from "./modalSelectHotel.vue";

export default {
  props: {
    promotion: [Object, Array],
    typePromotion: [String, Number],
  },
  components: {
    PopupApplyCouponSuccess,
    PopupApplyCouponError,
    ModalSelectHotel,
  },
  name: "PromotionItem",
  data() {
    return {
      signIn: false,
      ajaxApplyCouponResponse: null,
      getErrorObj: [],
      isShow: true,
      listApplyCoupon: [],
      ASSETS_SERVICE_URL,
      DABLE_TRACKING,
    };
  },

  computed: {
    ...mapState(PAGE_INFO_MODULE_NAME, {
      language: "language",
    }),

    promotionDetailPath() {
      return getPromotionDetailPath(
        {
          promotionName: GetSlug(this.promotion.title),
        },
        {
          sn: this.promotion.sn,
        }
      );
    }, // promotionDetailPath
    type() {
      return this.typePromotion;
    },
  },
  mounted() {
    this.checkSignIn();
    // console.log('this.isShow :>> ', this.isShow);

  },
  methods: {
    G2JDablenaTracking,
    onShowListHotel(data){
      this.$refs['modal-select-hotel'].openModal(data.sn)
    },
    getStringSubConent(contentDetail) {
      let stringObject = contentDetail.split("\n");
      return (
        `<span class="promotion-item__title-label"><b>${stringObject[0]}</b></span><br/>` +
        `<span>${stringObject[1]}</span><br/>` +
        `<span>${stringObject[2]}</span>`
      );
    }, //getStringSubConent

    getStringButton(textButton) {
      let stringObject = textButton.split(/[|,/]/);
      if (this.language == "en") {
        return stringObject[1];
      } else {
        return stringObject[0];
      }
    }, //getStringButton

    applyCoupon(dataParams) {
      const self = this;

      this.ajaxApplyCouponResponse = apiCaller({
        metaUrl: AJAX_URL.applyNowCoupon.applyCoupon,
        data: dataParams,
        method: "PUT",
        headers: {
          Authorization: getToken(),
        },
        dataType: "json",
        error: function (error) {
          self.getErrorObj = error.responseJSON.error;
          self.showPopupModalApplyCouponError();
        },
        success(objResponse) {
          // self.showPopupModalApplyCouponSuccess();
          self.isShow = false;
          self.$refs['modal-select-hotel'].openModal(self.promotion.sn)
          if (
            _.isEmpty(objResponse) ||
            objResponse.error ||
            _.isEmpty(objResponse.data)
          ) {
            return;
          }

          // self.responseApplyCoupon = objResponse.data?.arlicles ?? [];
        },
        complete() {
          EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
        },
      });
    }, // applyCoupon

    checkSignIn() {
      if (_.isEmpty(getToken())) {
        this.signIn == false;
      } else {
        this.signIn = true;
      }

    }, //checkSignIn

    applyNowCoupon(idCoupon) {
      if (this.signIn == true) {
        // sign in
        if (this.type == 1) {
          // is promotion
          let data = {
            promotionSn: Number(idCoupon.sn),
          };
          this.applyCoupon(data);
        } else {
          // is event
          let data = {
            event: Number(idCoupon.sn),
          };
          this.applyCoupon(data);
        }
      } else {
        // no sign in
        // this.$router.push('/login');
        this.$router.push({
          name: "login-page",
        });
        // this.showPopupModal()
      }
    }, //applyNowCoupon

    showPopupModalApplyCouponSuccess() {
      this.$refs[
        "popup-modal-apply-coupon-success"
      ].showModalApplyCouponSuccess();
    }, //showPopupModalApplyCouponSuccess

    closePopupModalApplyCouponSuccess() {
      this.$refs[
        "popup-modal-apply-coupon-success"
      ].closeModalApplyCouponSuccess();
    }, //closePopupModalApplyCouponSuccess

    showPopupModalApplyCouponError() {
      this.$refs["popup-modal-apply-coupon-error"].showModalApplyCouponError();
    }, //showPopupModalApplyCouponError

    closePopupModalApplyCouponError() {
      this.$refs["popup-modal-apply-coupon-error"].closeModalApplyCouponError();
    }, //closePopupModalApplyCouponError
  },
};
</script>
