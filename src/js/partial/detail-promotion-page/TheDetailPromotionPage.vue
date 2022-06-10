<template>
  <div class="promotion-page">
    <section class="promotion-section">
      <div class="container">
        <div class="prmotion-block">
          <div class="promotion-back-btn-outer">
            <!-- <BackButtonComponent></BackButtonComponent> -->
          </div>
          <div class="promotion-content">
            <div class="promotion-content__header"></div>
            <div
              class="promotion-content__banner"
              v-if="!isEmpty(src)"
            >
              <g2j-image :url-img="`${ASSETS_SERVICE_URL}/${src.imagePath}`"></g2j-image>
            </div>
            <div class="promotion-content__desc">
              <div
                v-if="language=='en'"
                v-html="contentEn"
              ></div>
              <div
                v-else
                v-html="content"
              ></div>
            </div>
            <div
              class="promotion-content__apply-now"
              v-if="
                (dataPromotionDetail.canApply == true || signIn == false) &&
                isShow == true
              "
            >
              <!-- apply-now -->
              <div
                class="g2j-button-book-now"
                @click="
                  applyNowCoupon(dataPromotionDetail),
                    G2JDablenaTracking(
                      DABLE_TRACKING.TRACKING_APPLY_NOW_PROMOTION
                    )
                "
              >
                <p class="title">{{ $t("promotion.apply_now") }}</p>
              </div>
            </div>
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
        </div>
        <!-- .promotion-block -->
      </div>
    </section>
    <!-- .promotion-section -->
  </div>
</template>

<script>
  import {
    IMAGE_URL,
    CACHE_VERSION,
    ASSETS_SERVICE_URL,
  } from "~jsDefinePath/general";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import { getToken, BASE_URL } from "~jsDefinePath/general";
  import { _, mapState } from "~jsLibPath/lib-manager";
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import {
    G2JFirebase,
    G2JDablenaTracking,
  } from "~jsHelperPath/util/HandleTracking";
  import {
    FIREBASE_TRACKING,
    DABLE_TRACKING,
  } from "~jsDefinePath/tracking-define";

  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/page-info-module";
  import { getPromotionDetailPath } from "~jsHelperPath/util/HandleUrl";
  import PopupApplyCouponSuccess from "../promotion-page/component/popupApplyCouponSuccess.vue";
  import PopupApplyCouponError from "../promotion-page/component/popupApplyCouponError.vue";
  import ModalSelectHotel from "~jsPartialPath/promotion-page/component/modalSelectHotel.vue";

  export default {
    name: "TheDetailPromotionPage",
    components: {
      PopupApplyCouponSuccess,
      PopupApplyCouponError,
      ModalSelectHotel,
    },
    data() {
      return {
        BASE_URL,
        action: 1,
        dataPromotionDetail: [],
        isShowModal: false,
        src: "",
        content: "",
        contentEn: "",
        showModal: false,
        sn: this.$route.query.sn,
        IMAGE_URL,
        CACHE_VERSION,
        ASSETS_SERVICE_URL,
        type: 1,
        getErrorObj: [],
        isShow: true,
        DABLE_TRACKING,
      };
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),
    },

    created() {
      // NOTE - tracking dable - view_promotion - Tuyến
      G2JFirebase.analytics().logEvent(
        FIREBASE_TRACKING.TRACKING_VIEW_PROMOTION,
        { name: "" }
      );
      G2JDablenaTracking(DABLE_TRACKING.TRACKING_VIEW_PROMOTION);
      this.getDataPromotionDetail();
      this.checkSignIn();
      EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
    },

    methods: {
      isEmpty: _.isEmpty,
      G2JDablenaTracking,
      getDataPromotionDetail() {
        let self = this;
        EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        apiCaller({
          metaUrl: AJAX_URL.promotion.promotionDetail,
          data: {
            promotionSn: self.sn,
            action: self.action,
          },
          headers: {
            Authorization: getToken(),
          },
          dataType: "json",
          type: "GET",
          contentType: "application/json; charset=utf-8",
          success: function (result) {
            let data = result.data;
            self.dataPromotionDetail = data;
            self.content = data.content;
            self.contentEn = data.contentEn;
            self.src = data.imageList[0];

            if (self.$route.params.promotionName === self.$route.query.sn) {
              const pathFormatted = getPromotionDetailPath(
                {
                  promotionName: GetSlug(data.title),
                },
                self.$route.query
              );

              self.$router.replace(pathFormatted[self.language]);
            }

            const tmpCouponStartDate = dayjs(data.couponStart);

            // NOTE - setup meta tag
            const titleTagContent =
              "Chương trình khuyến mãi số " +
            data.sn + (
              tmpCouponStartDate.isValid() ?
                " - Ngày " + tmpCouponStartDate.format("DD/MM/YYYY") :
              ""
            );

            self.$metaTag.setup({
              title: titleTagContent,
              description:
                titleTagContent + " dành riêng cho bạn khi đặt phòng tại Go2Joy",
              "og:type": "website",
              "og:title": titleTagContent,
              "og:description":
                titleTagContent + " dành riêng cho bạn khi đặt phòng tại Go2Joy",
              "og:url": BASE_URL + window.location.pathname,
              "og:site_name": "Go2Joy",
              "og:image": "",
              "og:image:width": "1200",
              "og:image:height": "628",
            });

            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          },
          error: function (error) {
            console.log("error :>> ", error);
            EventBus.emit("REDIRECT-404-PAGE");
          },
        });
      },
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
            self.$refs["modal-select-hotel"].openModal(
              self.dataPromotionDetail.sn
            );
            self.isShow = false;
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
          this.signIn = false;
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
              promotionSn: idCoupon.sn,
            };
            this.applyCoupon(data);
          } else {
            // is event
            let data = {
              event: idCoupon.sn,
            };
            this.applyCoupon(data);
          }
        } else {
          // no sign in
          this.$router.push("/login");
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

<style src="./detail-promotion-page-style.css"></style>
