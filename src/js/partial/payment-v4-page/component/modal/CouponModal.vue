<template>
  <modal
    ref="coupon-payment"
    :visible.sync="visible"
    class="coupon-payment"
  >
    <template slot="header">
      <div class="coupon-payment__header">
        {{$t('payment_v4.step_2.select_coupon')}}
      </div>
    </template>
    <template slot="body">
      <div class="coupon-payment__body">
        <template v-if="couponList && couponList.length ==0 ">
          <div
            class="coupon-item loading-content"
            v-for="(item, index) in 2"
          >
            <VueContentLoading
              :key="index"
              :width="300"
              :height="150"
            >
              <rect
                x="15"
                y="10"
                rx="4"
                ry="4"
                width="90%"
                height="30"
              />
              <rect
                x="30"
                y="80"
                rx="4"
                ry="4"
                width="40%"
                height="10"
              />
              <rect
                x="30"
                y="100"
                rx="4"
                ry="4"
                width="60%"
                height="10"
              />
              <rect
                x="30"
                y="120"
                rx="4"
                ry="4"
                width="50%"
                height="10"
              />
            </VueContentLoading>
          </div>

        </template>
        <template v-if="couponList &&couponList.length">
          <div
            class="coupon-item"
            v-for="(v,k) in couponList"
            :key="k"
            :class="v.canUseStatus == 3 ? 'disable':''"
          >
            <div class="coupon-item__header">
              <div class="coupon-item__header--left content-left">
                <router-link
                  :to="promotionDetailPath(v)[language]"
                  v-slot="{ href, navigate }"
                >
                  <a
                    :href="href"
                    @click="navigate"
                    target="_blank"
                    class="title"
                  >
                    {{v.promotionName}} </a>
                </router-link>
                <!-- <p class="title">
                  {{v.promotionName}}
                </p> -->
              </div>
              <div class="coupon-item__header--right content-right">
                <span class="number">{{v.num}}x</span>
              </div>
            </div>
            <div class="coupon-item__body">
              <div class="coupon-item__body--left content-left">
                <p
                  class="title"
                  v-html="typeDiscount(v)"
                ></p>
                <div
                  class="container-tag"
                  v-if="v.useCondition"
                >
                  <p
                    v-if="v.useCondition.hourly"
                    class="tag"
                  >{{$t('payment_v4.step_1.hourly')}}</p>
                  <p
                    v-if="v.useCondition.overnight"
                    class="tag"
                  >{{$t('payment_v4.step_1.overnight')}}</p>
                  <p
                    v-if="v.useCondition.daily"
                    class="tag"
                  >{{$t('payment_v4.step_1.daily')}}</p>

                </div>
                <p class="date">{{v.start}} ~ {{v.end ? v.end :""}}</p>
                <p class="description">
                  {{v.couponMemo?handleDescription(v.couponMemo) :''}}

                </p>
              </div>
              <div
                @click="onSelectCoupon(v)"
                class="coupon-item__body--right content-right"
              >
                <img
                  v-if="v.canUseStatus == 2"
                  :src="`${IMAGE_URL}/icon/payment/save.svg`"
                  alt="save-img"
                  class="img-save-coupon"
                  @click="applyCoupon(v)"
                ></img>
                <template v-if="v.canUseStatus == 1">
                  <img
                    v-if=" v.sn == couponRewardComponent.sn"
                    class="img-select-coupon"
                    :src="`${IMAGE_URL}/icon/payment/check.svg`"
                    alt="check-img"
                  ></img>
                  <img
                    v-else
                    class="img-select-coupon"
                    :src="`${IMAGE_URL}/icon/payment/check_gray.svg`"
                    alt="check-img"
                  ></i>
                </template>

                <img
                  v-if="v.canUseStatus == 3"
                  :src="`${IMAGE_URL}/icon/payment/check.svg`"
                  class="disable"
                  alt="check-img"
                ></img>
              </div>

            </div>
            <div
              v-if="v.canUseStatus == 3"
              class="coupon-item__footer"
            >
              <span>{{$t('payment_v4.step_2.not_aligible')}}</span>
            </div>

          </div>
        </template>
        <template>
          <div
            class="container-nodata"
            v-show="couponList == null "
          >
            <g2j-image
              class="nodata-coupon"
              :url-img="IMAGE_URL + '/icon/no-data/no_coupon.svg'"
            ></g2j-image>
            <!-- <img :src="IMAGE_URL + '/icon/no-data/no_coupon.svg'"> -->
            <h3>{{$t('payment_v4.step_2.title_nocoupon')}}</h3>
            <span class="nodata-description">{{$t('payment_v4.step_2.description_nocoupon')}}
            </span>
          </div>
        </template>
      </div>
    </template>
    <template slot="footer">
      <div class="coupon-payment__footer">
        <button
          :disabled="couponList == null || couponList.length ==0 "
          @click="onConfirmCoupon()"
          class="g2j-button-book-now"
          :class="{disable : couponList == null || couponList.length ==0}"
        >{{$t('payment_v4.step_2.confirm')}}</button>
      </div>
    </template>
  </modal>
</template>

<script>
  import {
    IMAGE_URL,
    CACHE_VERSION,
    ASSETS_SERVICE_URL,
    getToken,
  } from "~jsDefinePath/general";
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import {
    getFormattedCurrency,
    formatPriceVND,
  } from "~jsPath/helper/util/formatNumber";
  import { getPromotionDetailPath } from "~jsHelperPath/util/HandleUrl";
  import { mapState } from "~jsPath/lib/lib-manager";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsPath/base/vuex/modules/page-info-module";

  export default {
    props: {
      couponReward: [Object, Array],
      paymentInfo: [Object, Array],
    },
    components: {
      modal: () =>
        import("~jsPartialPath/global/component/modal/ModalComponent.vue"),
      VueContentLoading: window.VueContentLoading.VueContentLoading,
    },
    data() {
      return {
        IMAGE_URL,
        visible: false, //check show modal
        couponList: [],
        couponRewardComponent: {},
      };
    },
    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),
    },
    methods: {
      isEmpty: _.isEmpty,
      getFormattedCurrency,
      formatPriceVND,
      handleDescription(data) {
        if (!data) return;
        let arr = data.split("|");
        return this.language == "vi" ? arr[0] : arr[1];
      },
      typeDiscount(data) {
        if (!data) return;
        let type = data.discountType;
        let value = data.discount ? data.discount : 0;
        switch (type) {
          case 1:
            return formatPriceVND(value);
            break;
          case 2:
            return value + " %";
            break;
          case 3:
            return this.$t("payment_v4.step_2.hotel_gift").toUpperCase();
            break;
          case 4:
            return this.$t("payment_v4.step_2.extra_hour").toUpperCase();
            break;
          case 5:
            let hour = data.useCondition.numHours;
            let day = data.useCondition.numDays;
            let result;

            if (data.useCondition.hourly) {
              result =
                this.$t("payment_v4.step_2.same_price") +
                `<span class="high-light"> ${this.formatPriceVND(
                  value
                )}/ ${hour} ${this.$t("payment_v4.step_2.hours")}</span>`;
              return result;
            } else if (data.useCondition.daily) {
              result =
                this.$t("payment_v4.step_2.same_price") +
                `<span class="high-light"> ${this.formatPriceVND(value)}/ ${
                  data.useCondition.numDays
                } ${this.$t("payment_v4.step_2.days")}</span>`;
              return result;
            } else {
              return `${this.$t(
                "payment_v4.step_2.same_price"
              )} ${this.formatPriceVND(value)}/ ${this.$t(
                "payment_v4.step_2.overnights"
              )}`;
            }
            break;

          default:
            break;
        }
        return;
      },
      promotionDetailPath(promotion) {
        if (!promotion) return;
        return getPromotionDetailPath(
          {
            promotionName: GetSlug(promotion.promotionName),
          },
          {
            sn: promotion.promotionSn,
          }
        );
      }, // promotionDetailPath
      openModal() {
        this.getCoupon();
        // this.couponRewardComponent = this.couponReward
        //   ? this.couponReward
        //   : this.couponList[0];
        this.visible = true; //key => hiện modal
      },
      closeModal() {
        this.visible = false; //key => ẩn modal
      },
      async getCoupon() {
        this.couponList = [];
        let query = {
          // hotelSn: 4154,
          // roomTypeSn: 11449,
          // type: 1,
          // checkInDatePlan: "2021-11-12",
          // endDate: "2021-11-12",
          // startTime: "07:00",
          // endTime: "11:00",
          // mode: 1,
          ...this.paymentInfo,
          justHas: 0, // 1:lay cái nào đã áp dụng, 0 là còn cái nịt
        };
        //  obj.paymentMethod = this.paymentMethod
        //   ? this.paymentMethod.typePayment
        //   : null;
        query.paymentMethod = null;
        try {
          let res = await apiCaller({
            metaUrl: AJAX_URL.payment_v4.promotionList,
            method: "POST",
            headers: {
              Authorization: getToken(),
            },
            dataType: "json",
            data: query,
          });
          this.couponList = res.data && res.data.length ? res.data : null;
          let firstItem = this.couponList ? this.couponList[0] : {};
          this.couponRewardComponent = this.couponReward
            ? this.couponReward
            : firstItem;
        } catch (error) {
          console.log("error :>> ", error);
        }
      },
      onSelectCoupon(data) {
        if (this.isEmpty(data)) return;
        if (JSON.stringify(data) === JSON.stringify(this.couponRewardComponent)) {
          this.couponRewardComponent = {};
          return;
        }
        this.couponRewardComponent = data;
      },
      async applyCoupon(data) {
        let params;
        this.couponList = []; // de cho loading thoi
        if (data.type == 1) {
          // is promotion
          params = {
            promotionSn: data.promotionSn,
          };
        } else {
          // is event
          params = {
            event: data.promotionSn,
          };
        }
        try {
          let res = await apiCaller({
            metaUrl: AJAX_URL.applyNowCoupon.applyCoupon,
            data: params,
            method: "PUT",
            headers: {
              Authorization: getToken(),
            },
          });
        } catch (error) {
        } finally {
          this.getCoupon();
        }
      },
      onConfirmCoupon() {
        this.$emit("update:couponReward", this.couponRewardComponent);
        this.closeModal();
        this.$emit("doneCoupon");
      },
    },
  };
</script>

