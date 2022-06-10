<template>
  <div
    v-if="isShowCard"
    class="g2j-hotel-product-card-horizontal-outer"
    :class="{
      'swiper-slide': isSlide,
    }"
    itemscope
    itemtype="https://schema.org/Hotel"
  >
    <template v-if="isShowCardWithoutRouterLink">
      <div
        v-if="!isEmpty(hotelItemInfo)"
        :key="hotelItemInfo.sn"
        class="g2j-hotel-product-card-horizontal"
        @click="$emit('onClickFlashSaleCard')"
      >
        <div class="g2j-hotel-product-card-horizontal-inner">
          <div class="g2j-hotel-product-card-horizontal__img-col">
            <img
              :data-src="assetsServiceUrl + '/' + hotelItemInfo.imagePath"
              :alt="hotelItemInfo.name"
              width="100%"
              height="100%"
              class="g2j-hotel-product-card-horizontal__img"
              :class="lazyloadClass"
              data-expand="-20"
              onerror="this.classList.add('is-image-error')"
              itemprop="photo"
            >
          </div> <!-- .g2j-hotel-product-card-horizontal__img-col -->

          <div class="g2j-hotel-product-card-horizontal__info-col">
            <div
              itemprop="name"
              class="g2j-hotel-product-card-horizontal__title-field"
            >
              {{ htmlDecode(hotelItemInfo.name) }}
            </div> <!-- .g2j-hotel-product-card-horizontal__title-field -->

            <div class="g2j-hotel-product-card-horizontal__meta-info-field">
              <div
                v-if="hotelItemInfo.totalReview > 0"
                class="g2j-hotel-product-card-horizontal__rating-col"
                itemprop="aggregateRating"
                itemscope
                itemtype="https://schema.org/AggregateRating"
              >
                <span class="g2j-hotel-product-card-horizontal__star-icon-shape">
                  <i class="fas fa-star" />
                </span>

                <span
                  itemprop="ratingValue"
                  class="g2j-hotel-product-card-horizontal__score-label"
                >
                  {{ hotelItemInfo.averageMark }}
                </span>

                <span
                  itemprop="reviewCount"
                  class="g2j-hotel-product-card-horizontal__total-rating-label"
                >
                  ({{ hotelItemInfo.totalReview }})
                </span>
                <meta
                  itemprop="author"
                  content="customer"
                >
              </div> <!-- .g2j-hotel-product-card-horizontal__rating-col -->

              <div class="g2j-hotel-product-card-horizontal__location-col">
                <span class="g2j-hotel-product-card-horizontal__map-icon-shape">
                  <i class="fas fa-map-marked-alt" />
                </span>

                <span
                  class="g2j-hotel-product-card-horizontal__location-label"
                  itemprop="address"
                >
                  {{ hotelItemInfo.districtName }}
                </span>
              </div> <!-- .g2j-hotel-product-card-horizontal__location-col -->
            </div> <!-- .g2j-hotel-product-card-horizontal__meta-info-field -->

            <div class="g2j-hotel-product-card-horizontal__sale-off-info-row">
              <template v-if="isFlashSale">
                <div class="g2j-hotel-product-card-horizontal__flash-sale-field">
                  <div class="g2j-hotel-product-card-horizontal__flash-sale-mask-col">
                    <span class="g2j-hotel-product-card-horizontal__flash-sale-icon-shape">
                      <i class="fas fa-bolt" />
                    </span>

                    <span class="g2j-hotel-product-card-horizontal__flash-sale-label">
                      {{ $t('hotel_info.flash_sale') }}
                    </span>
                  </div> <!-- .g2j-hotel-product-card-horizontal__flash-sale-mask-col -->

                  <div
                    v-if="remainOfRoomLabel"
                    class="g2j-hotel-product-card-horizontal__flash-sale-info-col"
                  >
                    <span class="g2j-hotel-product-card-horizontal__flash-sale-info-label">
                      {{ remainOfRoomLabel }}
                    </span>
                  </div> <!-- .g2j-hotel-product-card-horizontal__flash-sale-info-col -->
                </div> <!-- .g2j-hotel-product-card-horizontal__flash-sale-field -->
              </template>

              <template v-else>
                <LabelRoom :data-item="hotelItemInfo" />
              </template>
            </div> <!-- .g2j-hotel-product-card-horizontal__sale-off-info-row -->

            <div class="g2j-hotel-product-card-horizontal__price-field">
              <div
                v-if="priceTypeLabel"
                class="g2j-hotel-product-card-horizontal__price-type-label"
              >
                {{ priceTypeLabel }}
              </div>

              <div class="g2j-hotel-product-card-horizontal__price-field-inner">
                <span
                  v-if="oldPrice"
                  class="g2j-hotel-product-card-horizontal__origin-price-label"
                  v-html="formatToThounsands(oldPrice) + '<sup>đ</sup>'"
                />

                <span
                  v-if="curPrice"
                  class="g2j-hotel-product-card-horizontal__current-price-label"
                  v-html="formatToThounsands(curPrice) + '<sup>đ</sup>'"
                />
              </div> <!-- .g2j-hotel-product-card-horizontal__price-field-inner -->
            </div> <!-- .g2j-hotel-product-card-horizontal__price-field -->
          </div> <!-- .g2j-hotel-product-card-horizontal__info-col -->
        </div> <!-- .hot-deal-swiper-slide-inner -->
      </div> <!-- .g2j-hotel-product-card-horizontal -->
    </template>

    <template v-else>
      <router-link
        v-slot="{ href, navigate }"
        :to="hotelProductCardPath[language]"
      >
        <a
          v-if="!isEmpty(hotelItemInfo)"
          :key="hotelItemInfo.sn"
          class="g2j-hotel-product-card-horizontal"
          :href="href"
          @click="navigate"
        >
          <div class="g2j-hotel-product-card-horizontal-inner">
            <div class="g2j-hotel-product-card-horizontal__img-col">
              <img
                :data-src="assetsServiceUrl + '/' + hotelItemInfo.imagePath"
                :alt="hotelItemInfo.name"
                width="100%"
                height="100%"
                class="g2j-hotel-product-card-horizontal__img"
                :class="lazyloadClass"
                data-expand="-20"
                onerror="this.classList.add('is-image-error')"
                itemprop="photo"
              >
            </div> <!-- .g2j-hotel-product-card-horizontal__img-col -->

            <div class="g2j-hotel-product-card-horizontal__info-col">
              <div
                class="g2j-hotel-product-card-horizontal__title-field"
                itemprop="name"
              >
                {{ htmlDecode(hotelItemInfo.name) }}
              </div> <!-- .g2j-hotel-product-card-horizontal__title-field -->

              <div class="g2j-hotel-product-card-horizontal__meta-info-field">
                <div
                  v-if="hotelItemInfo.totalReview > 0"
                  class="g2j-hotel-product-card-horizontal__rating-col"
                  itemprop="aggregateRating"
                  itemscope
                  itemtype="https://schema.org/AggregateRating"
                >
                  <span class="g2j-hotel-product-card-horizontal__star-icon-shape">
                    <i class="fas fa-star" />
                  </span>

                  <span
                    itemprop="ratingValue"
                    class="g2j-hotel-product-card-horizontal__score-label"
                  >
                    {{ hotelItemInfo.averageMark }}
                  </span>

                  <span
                    itemprop="reviewCount"
                    class="g2j-hotel-product-card-horizontal__total-rating-label"
                  >
                    ({{ hotelItemInfo.totalReview }})
                  </span>
                  <meta
                    itemprop="author"
                    content="customer"
                  >
                </div> <!-- .g2j-hotel-product-card-horizontal__rating-col -->

                <div class="g2j-hotel-product-card-horizontal__location-col">
                  <span class="g2j-hotel-product-card-horizontal__map-icon-shape">
                    <i class="fas fa-map-marked-alt" />
                  </span>

                  <span
                    class="g2j-hotel-product-card-horizontal__location-label"
                    itemprop="address"
                  >
                    {{ hotelItemInfo.districtName }}
                  </span>
                </div> <!-- .g2j-hotel-product-card-horizontal__location-col -->
              </div> <!-- .g2j-hotel-product-card-horizontal__meta-info-field -->

              <div class="g2j-hotel-product-card-horizontal__sale-off-info-row">
                <template v-if="isFlashSale">
                  <div class="g2j-hotel-product-card-horizontal__flash-sale-field">
                    <div class="g2j-hotel-product-card-horizontal__flash-sale-mask-col">
                      <span class="g2j-hotel-product-card-horizontal__flash-sale-icon-shape">
                        <i class="fas fa-bolt" />
                      </span>

                      <span class="g2j-hotel-product-card-horizontal__flash-sale-label">
                        {{ $t('hotel_info.flash_sale') }}
                      </span>
                    </div> <!-- .g2j-hotel-product-card-horizontal__flash-sale-mask-col -->

                    <div
                      v-if="remainOfRoomLabel"
                      class="g2j-hotel-product-card-horizontal__flash-sale-info-col"
                    >
                      <span class="g2j-hotel-product-card-horizontal__flash-sale-info-label">
                        {{ remainOfRoomLabel }}
                      </span>
                    </div> <!-- .g2j-hotel-product-card-horizontal__flash-sale-info-col -->
                  </div> <!-- .g2j-hotel-product-card-horizontal__flash-sale-field -->
                </template>

                <template v-else>
                  <LabelRoom :data-item="hotelItemInfo" />
                </template>
              </div> <!-- .g2j-hotel-product-card-horizontal__sale-off-info-row -->

              <div class="g2j-hotel-product-card-horizontal__price-field">
                <div
                  v-if="priceTypeLabel"
                  class="g2j-hotel-product-card-horizontal__price-type-label"
                >
                  {{ priceTypeLabel }}
                </div>

                <div class="g2j-hotel-product-card-horizontal__price-field-inner">
                  <span
                    v-if="oldPrice"
                    class="g2j-hotel-product-card-horizontal__origin-price-label"
                    v-html="formatToThounsands(oldPrice) + '<sup>đ</sup>'"
                  />

                  <span
                    v-if="curPrice"
                    class="g2j-hotel-product-card-horizontal__current-price-label"
                    v-html="formatToThounsands(curPrice) + '<sup>đ</sup>'"
                  />
                </div> <!-- .g2j-hotel-product-card-horizontal__price-field-inner -->
              </div> <!-- .g2j-hotel-product-card-horizontal__price-field -->
            </div> <!-- .g2j-hotel-product-card-horizontal__info-col -->
          </div> <!-- .hot-deal-swiper-slide-inner -->
        </a> <!-- .g2j-hotel-product-card-horizontal -->
      </router-link>
    </template>
  </div> <!-- .g2j-hotel-product-card-horizontal-outer -->
</template>

<script>
  import { _, he, mapState } from "~jsLibPath/lib-manager";
  import { IMAGE_URL, CACHE_VERSION, HAS_MOITAI } from "~jsDefinePath/general";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/page-info-module";
  import { getHotelDetailPagePath } from "~jsHelperPath/util/HandleUrl";
  import { formatToThounsands } from "~jsHelperPath/util/General";
  import LabelRoom from "~jsPartialPath/global/component/label-room/LabelRoom.vue";

  export default {
    components: {
      LabelRoom,
    },

    props: {
      hotelItemInfo: {
        default: () => {},
        type: Object,
      },

      isSlide: {
        default: false,
        type: Boolean,
      },

      lazyloadClass: {
        default: "lazyload",
        type: String,
      },

      assetsServiceUrl: {
        default: "",
        type: String,
      },
    },

    data() {
      return {
        IMAGE_URL,
        CACHE_VERSION,

        bookingTypeCodeOfPriceType: {
          firstHoursOrigin: 1,
          overnightOrigin: 2,
          oneDayOrigin: 3,
        },

        bookingTypeLabelWithLanguage: {
          1: {
            vi: "giờ đầu",
            en: "first hour",
          },
          2: {
            vi: "Qua đêm",
            en: "Overnight",
          },
          3: {
            vi: "Ngày",
            en: "Overnight",
          },
        }, // bookingTypeLabelWithLanguage
      };
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),

      isFlashSale() {
        return this.hotelItemInfo?.flashSale ?? false;
      }, // isFlashSale

      remainOfRoomLabel() {
        if (
          _.isEmpty(this.hotelItemInfo) ||
          typeof this.hotelItemInfo.numOfRoom !== "number" ||
          this.hotelItemInfo.numOfRoom <= 0
        ) {
          return "";
        }

        if (this.language === "vi") {
          return "Còn " + this.hotelItemInfo.numOfRoom + " phòng";
        }

        return this.hotelItemInfo.numOfRoom + " room(s) left";
      }, // remainOfRoom

      priceTypeLabel() {
        if (typeof this.bookingTypeCode === undefined) {
          return "";
        }

        if (this.bookingTypeCode === 1) {
          return (
            this.hotelItemInfo.firstHours +
            " " +
            this.bookingTypeLabelWithLanguage[this.bookingTypeCode][this.language]
          );
        }

        return this.bookingTypeLabelWithLanguage[this.bookingTypeCode][
          this.language
        ];
      }, // priceTypeLabel

      originPriceKey() {
        if (
          _.isEmpty(this.hotelItemInfo) ||
          _.isEmpty(this.hotelItemInfo.displayRule)
        ) {
          return null;
        }

        if (this.hotelItemInfo.displayRule.originPrice > 0) {
          return "originPrice";
        }

        if (
          this.isFlashSale &&
          this.hotelItemInfo.displayRule.overnightOrigin > 0
        ) {
          return "overnightOrigin";
        } else if (this.hotelItemInfo.displayRule.firstHoursOrigin > 0) {
          return "firstHoursOrigin";
        } else if (this.hotelItemInfo.displayRule.overnightOrigin > 0) {
          return "overnightOrigin";
        }

        return "oneDayOrigin";
      }, // originPriceKey

      newPriceKey() {
        if (
          _.isEmpty(this.hotelItemInfo) ||
          _.isEmpty(this.hotelItemInfo.displayRule)
        ) {
          return null;
        }

        if (this.hotelItemInfo.displayRule.discountPrice > 0) {
          return "discountPrice";
        }

        if (
          this.isFlashSale &&
          this.hotelItemInfo.displayRule.priceOvernight > 0
        ) {
          return "priceOvernight";
        } else if (this.hotelItemInfo.displayRule.priceFirstHours > 0) {
          return "priceFirstHours";
        } else if (this.hotelItemInfo.displayRule.priceOvernight > 0) {
          return "priceOvernight";
        }

        return "priceOneDay";
      }, // newPriceKey

      bookingTypeCode() {
        if (typeof this.hotelItemInfo.displayRule.bookingType === "number") {
          return this.hotelItemInfo.displayRule.bookingType;
        }

        return this.bookingTypeCodeOfPriceType[this.originPriceKey];
      }, // bookingTypeCode

      oldPrice() {
        if (!this.originPriceKey) {
          return null;
        }

        if (
          !this.newPriceKey ||
          this.hotelItemInfo.displayRule[this.newPriceKey] >=
            this.hotelItemInfo.displayRule[this.originPriceKey]
        ) {
          return null;
        }

        return this.hotelItemInfo.displayRule[this.originPriceKey];
      }, // oldPrice

      curPrice() {
        if (!this.originPriceKey) {
          return null;
        }

        if (
          !this.newPriceKey ||
          this.hotelItemInfo.displayRule[this.newPriceKey] >=
            this.hotelItemInfo.displayRule[this.originPriceKey]
        ) {
          return this.hotelItemInfo.displayRule[this.originPriceKey];
        }

        return this.hotelItemInfo.displayRule[this.newPriceKey];
      }, // curPrice

      hotelSn() {
        return this.hotelItemInfo.sn;
      }, // hotelSn()

      hotelProductCardPath() {
        return getHotelDetailPagePath(
          {
            hotelName: GetSlug(this.hotelItemInfo.name),
          },
          {
            hotelSn: this.hotelSn,
          }
        );
      }, // hotelProductCardPath

      isShowCard() {
        return this.curPrice > 0;
      }, // isShowCard

      // NOTE - If this hotel product is flash sale and doesn't have MINISTRY OF INTERNATIONAL TRADE AND INDUSTRY (Bộ công thương), we need show modal direct to app instead of router link to hotel detail page on web.
      isShowCardWithoutRouterLink() {
        if (!this.isShowCard) {
          return false;
        }

        return !HAS_MOITAI && this.isFlashSale;
      }, // isShowCardWithoutRouterLink
    },

    mounted() {
      const self = this;

      if (!self.isShowCard) {
        self.$emit("onRemoveCard", true);
      }
    },

    methods: {
      isEmpty: _.isEmpty,

      htmlDecode(content) {
        if (!content) {
          return "";
        }

        return he.decode(content);
      }, // htmlDecode()

      formatToThounsands,
    },
  };
</script>
