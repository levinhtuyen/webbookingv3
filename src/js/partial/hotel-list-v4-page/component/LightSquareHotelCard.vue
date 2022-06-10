<template>
  <div
    v-if="isValidToShow || isDisableInvalid"
    class="light-square-hotel-card-outer"
  >
    <router-link
      :to="isValidToShow ? detailPathList[language] : ''"
      v-slot="{ href, navigate }"
    >
      <component
        :is="isValidToShow ? 'a' : 'div'"
        :href="isValidToShow ? href : undefined"
        @click="navigate"
        class="light-square-hotel-card light-square-card"
        :class="{
          '--top': info.top
        }"
      >
        <div
          v-if="info.top"
          class="light-square-hotel-card__top-mark"
        >
          <span class="top-mark-label-group">
            <img
              :src="IMAGE_URL + '/svg/logo--white.svg'"
              alt="Top Hotel Go2Joy"
              height="16"
              width="16"
              class="top-mark-logo"
            > <!-- .top-mark-logo -->

            <span class="top-mark-label">
              Top
            </span> <!-- .top-mark-label -->
          </span> <!-- .top-mark-label -->
        </div> <!-- .light-square-hotel-card__top-mark -->

        <div class="light-square-hotel-card__head card-head">
          <img
            v-if="hasImageUrl"
            :data-src="imageUrl"
            class="light-square-hotel-card__img card-img lazyload"
            loading="lazy"
            :alt="title"

            data-sizes="auto"
            data-expand="-5"
            itemprop="photo"

            onerror="this.classList.add('is-image-error')"

            width="100%"
            height="100%"
          >

          <div
            v-if="hasAccommondationLabelWithLocale"
            class="light-square-hotel-card__accommondation-info-tag"
          >
            {{ accommondationLabelWithLocale[language] }}
          </div> <!-- .light-square-hotel-card__accommondation-info-tag -->

          <div class="light-square-hotel-card__head-meta-info">
            <div
              v-if="
                info.isTet ||
                info.amenityPack
              "
              class="light-square-hotel-card__amenity-pack-field"
            >
              <div
                v-if="info.isTet"
                class="light-square-hotel-card__tet-label-marker"
              >
                <div class="light-square-hotel-card__tet-label-marker-head">
                  <img
                    :data-src="IMAGE_URL + '/svg/joy-tet.svg?v=' + CACHE_VERSION"
                    class="light-square-hotel-card__tet-label-marker-img lazyload"
                    loading="lazy"
                    :alt="title + ' ' + $t('common.joy_tet')"

                    data-sizes="auto"
                    data-expand="-5"
                    itemprop="photo"

                    onerror="this.classList.add('is-image-error')"

                    width="35"
                    height="35"
                  >
                </div> <!-- .light-square-hotel-card__tet-label-marker-head -->

                <div class="light-square-hotel-card__tet-label-marker-body">
                  <span class="light-square-hotel-card__tet-label-marker-title">
                    {{ $t('common.joy_tet') }}
                  </span>
                </div> <!-- .light-square-hotel-card__tet-label-marker-body -->
              </div> <!-- .light-square-hotel-card__tet-label-marker -->
              <div
                v-else-if="info.amenityPack"
                class="light-square-hotel-card__amenity-pack"
              >
                <div class="light-square-hotel-card__amenity-pack-head">
                  <div class="light-square-hotel-card__amenity-pack-img-outer">
                    <img
                      :data-src="IMAGE_URL + '/amenity-update_30112021.png?v=' + CACHE_VERSION"
                      class="light-square-hotel-card__amenity-pack-img lazyload"
                      loading="lazy"
                      :alt="title + ' amenity pack'"

                      data-sizes="auto"
                      data-expand="-5"
                      itemprop="photo"

                      onerror="this.classList.add('is-image-error')"

                      width="45"
                      height="45"
                    >
                  </div> <!-- .light-square-hotel-card__amenity-pack-img-outer -->
                </div> <!-- .light-square-hotel-card__amenity-pack-head -->
                <div class="light-square-hotel-card__amenity-pack-body">
                  <span class="light-square-hotel-card__amenity-pack-title">
                    {{ $t('common.amenity_pack') }}
                  </span>
                </div> <!-- .light-square-hotel-card__amenity-pack-body -->
              </div> <!-- .light-square-hotel-card__amenity-pack -->
            </div> <!-- .light-square-hotel-card__amenity-pack-field -->

            <div class="head-meta-info-row">
              <div
                v-if="hasAddress"
                class="light-square-hotel-card__address-field"
              >
                <span class="icon-shape">
                  <i class="fas fa-map-marker-alt"></i>
                </span>

                <span class="address-label">
                  {{ address }}
                </span>
              </div> <!-- .light-square-hotel-card__address-field -->
              <div class="light-square-hotel-card__tag-field card-tag-field">
                <div
                  v-if="info.newHotel"
                  class="light-square-hotel-card__tag card-tag --blue"
                >
                  <img
                    :src="IMAGE_URL + `/svg/new-tag--${ language }.svg`"
                    :alt="$t('common.new')"
                    class="tag-img"
                    width="100%"
                    height="100%"
                  >
                </div> <!-- .light-square-hotel-card__tag -->

                <div
                  v-if="info.hotHotel"
                  class="light-square-hotel-card__tag card-tag --red"
                >
                  <img
                    :src="IMAGE_URL + `/svg/hot-tag--${ language }.svg`"
                    :alt="$t('common.hot')"
                    class="tag-img"
                    width="100%"
                    height="100%"
                  >
                </div> <!-- .light-square-hotel-card__tag -->
              </div> <!-- .light-square-hotel-card__tag-field -->
            </div> <!-- .head-meta-info-row -->
          </div> <!-- .light-square-hotel-card__head-meta-info -->
        </div> <!-- .light-square-hotel-card__head -->

        <div class="light-square-hotel-card__body card-body">
          <div
            v-if="hasHashTagList"
            class="light-square-hotel-card__hash-tag-field"
          >
            <span
              v-for="hashTagLabel, idx in hashTagList"
              :key="idx"
              class="light-square-hotel-card__hash-tag-label"
            >
              {{ hashTagLabel }}
            </span>
          </div> <!-- .light-square-hotel-card__hash-tag-field -->

          <div
            v-if="hasTitle"
            class="light-square-hotel-card__title card-title"
          >
            <h4 class="light-square-hotel-card__title-label card-title-label">
              {{ title }}
            </h4>
          </div> <!-- .light-square-hotel-card__title -->

          <div
            v-if="
              hasBenefitListWithLocale ||
              info.isGo2Choice ||
              hasRoomLeftLabelWithLocale
            "
            class="light-square-hotel-card__benefit-tag-field card-benefit-tag-field"
          >
            <div
              v-if="info.isGo2Choice"
              class="light-square-hotel-card__tag card-tag --orange-gradient"
            >
              <img
                :src="IMAGE_URL + '/g2choice-rectangular-tag.jpg?v=' + CACHE_VERSION"
                alt="go2joychoice"
                class="tag-img"
                width="82"
                height="20"
              >
            </div> <!-- .light-square-hotel-card__tag -->

            <template v-if="hasBenefitListWithLocale">
              <div
                v-for="benefitLabelWithLocale,idx in benefitListWithLocale"
                :key="idx"
                class="light-square-hotel-card__benefit-tag-col"
              >
                <span class="light-square-hotel-card__benefit-tag">
                  {{ benefitLabelWithLocale[language] }}
                </span> <!-- .light-square-hotel-card__benefit-tag -->
              </div> <!-- .light-square-hotel-card__benefit-tag-col -->
            </template>

            <div
              v-if="hasRoomLeftLabelWithLocale"
              class="light-square-hotel-card__room-left-col"
            >
              <div class="light-square-hotel-card__room-left-tag">
                {{ roomLeftLabelWithLocale[language] }}
              </div>
            </div> <!-- .light-square-hotel-card__room-left-col -->
          </div> <!-- .light-square-hotel-card__benefit-tag-field -->

          <div class="light-square-hotel-card__meta-info-field card-meta-info-field">
            <div class="light-square-hotel-card__price-group-col card-price-group-col">
              <div
                v-if="hasBookingTypeLabel"
                class="booking-type"
              >
                {{ bookingTypeLabel }}
              </div> <!-- .booking-type -->

              <div
                v-if="isGettingPrice"
                class="final-price-loading-field"
              >
                <div class="final-price-loading-dot"></div>
                <div class="final-price-loading-dot"></div>
                <div class="final-price-loading-dot"></div>
                <div class="final-price-loading-dot"></div>
              </div> <!-- .final-price-loading-field -->

              <div
                v-else-if="hasEmptyPriceLabelWithLocale"
                class="empty-price-label-field-outer"
              >
                <div
                  class="empty-price-label-field"
                  v-html="emptyPriceLabelWithLocale[language]"
                >
                </div> <!-- .empty-price-label-field -->
              </div> <!-- .empty-price-label-field-outer -->

              <div
                v-else-if="hasCurPrice || hasOldPrice"
                class="price-group"
              >
                <span
                  v-if="hasCurPrice"
                  class="cur-price"
                  v-html="curPrice"
                >
                </span> <!-- .cur-price -->

                <span
                  v-if="hasOldPrice"
                  class="old-price"
                  v-html="oldPrice"
                >
                </span> <!-- .old-price -->
              </div> <!-- .price-group -->
            </div> <!-- .light-square-hotel-card__price-group-col -->

            <div
              v-if="
                hasRating ||
                hasTotalReview
              "
              class="light-square-hotel-card__more-info card-more-info"
            >
              <div class="distance-info">
                <template v-if="hasDistance">
                  <span class="distance-label">
                    {{ distance }}
                  </span>
                  <span class="icon-shape">
                    <i class="fas fa-map-marker-alt"></i>
                  </span>
                </template>
              </div> <!-- .district-info -->

              <div class="rating-info">
                <span
                  v-if="hasRating"
                  class="rating-point"
                >
                  {{ rating }}
                </span>

                <span
                  v-if="hasTotalReview"
                  class="total-review"
                >
                  ({{ totalReview }})
                </span>

                <span class="icon-shape">
                  <i class="fas fa-star"></i>
                </span>
              </div> <!-- .rating-info -->

              <!-- <div
                v-if="hasRooms"
                class="rooms-info"
              >
                {{ roomsLocaleList[language] }}
              </div> -->
            </div> <!-- .light-square-hotel-card__more-info -->
          </div> <!-- .light-square-hotel-card__meta-info-field -->
        </div> <!-- .light-square-hotel-card__body -->
      </component> <!-- .light-square-hotel-card -->
    </router-link>
  </div> <!-- .light-square-hotel-card-outer -->
</template>

<script>
import {
  _,
  mapState,
} from '~jsLibPath/lib-manager';
import {
  IMAGE_URL,
  CACHE_VERSION,
  LANGUAGE_VALID,
} from '~jsDefinePath/general';
import {
  getHotelDetailPagePath
} from '~jsHelperPath/util/HandleUrl';
import {
  MODULE_NAME as HOTEL_LIST_PAGE_MODULE_NAME,
} from '../page-module';
import {
  MIXIN_CONFIG as HOTEL_CARD_MIXIN_CONFIG,
} from '~jsPartialPath/global/mixin/HotelCardMixin';
import { formatToThounsands } from "~jsHelperPath/util/General";

export default {
  mixins: [
    HOTEL_CARD_MIXIN_CONFIG,
  ],

  props: {
    filterTimes: {
      type: Number,
      default: 0,
    }, // filterTimes

    infoUpdate: {
      default: {},
      type: new Object,
    }, // infoUpdate
  },

  data() {
    return {
      IMAGE_URL,
      CACHE_VERSION,

      // NOTE - to show/hide loading for get final price
      isGettingPrice: false,

      // NOTE - check if hotel is agoda hotel
      isAgoda: false,

      // NOTE - if after get final price, the price still empty then we need show an noty for that case
      emptyPriceLabelWithLocale: '',

      // NOTE - Accommondation info for agoda hotel
      accommondationLabelWithLocale: {},

      // NOTE - to know info update in exist
      hasInfoUpdate: false,

      // NOTE - to know the empty price label is setup
      hasEmptyPriceLabelWithLocale: false,

      // NOTE - check if exist accommondationLabelWithLocale
      hasAccommondationLabelWithLocale: false,
    }
  },

  computed: {
    ...mapState(HOTEL_LIST_PAGE_MODULE_NAME, [
      'objQueryString'
    ]),

    bookingTypeLabel() {
      if(!this.hasInfo) {
        return '';
      }

      return (
        this.info.displayRule.bookingType === 1 ?
          {
            [LANGUAGE_VALID.vi]: this.info.firstHours + ' giờ đầu',
            [LANGUAGE_VALID.en]: this.info.firstHours + ' first hour(s)',
          }[this.language] :
        this.info.displayRule.bookingType === 2 ?
          this.$t('common.overnight') :
        this.info.displayRule.bookingType === 3 ?
          this.$t('common.daily') :
        ''
      );
    }, // bookingTypeLabel
  },

  watch: {
    filterTimes: function() {
      this.detailPathList = this.generateDetailPathList();
    }, // filterTimes

    infoUpdate: function(val) {
      this.hasInfoUpdate = !_.isEmpty(val);

      // NOTE - setup data
      this.curPrice = this.generateFinalCurPrice();
      this.oldPrice = this.generateFinalOldPrice();
      this.emptyPriceLabelWithLocale = this.generateEmptyPriceLabelWithLocale();

      // NOTE - check data exist
      this.hasCurPrice = !_.isEmpty(this.curPrice);
      this.hasOldPrice = !_.isEmpty(this.oldPrice);
      this.hasEmptyPriceLabelWithLocale = !_.isEmpty(this.emptyPriceLabelWithLocale);

      this.isGettingPrice = false;
    },
    // infoUpdate()
  },

  created() {
    // NOTE - check if hotel is agoda hotel
    this.isAgoda = (
      this.hasInfo &&
      this.info.origin === 2
    );

    // NOTE - check if this hotel need to get final price
    this.isGettingPrice = (
      this.isAgoda &&
      !this.info.roomAvailable
    );

    // NOTE - setup data
    this.accommondationLabelWithLocale = this.generateAccommondationLabelWithLocale();

    // NOTE - check if data is exist
    this.hasAccommondationLabelWithLocale = !_.isEmpty(this.accommondationLabelWithLocale);

    // NOTE - replace check isValidToShow of HotelCardMixin
    this.isValidToShow = (
      this.hasInfo &&
      this.hasDetailPathList &&
      (
        this.hasCurPrice ||
        this.isGettingPrice
      )
    );
  },

  methods: {
    generateDetailPathList() {
      if(
        !this.hasInfo ||
        typeof this.info.sn !== 'number'
      ) {
        return {}
      }

      const _dayCheckInFormatted = this.objQueryString.checkInDatePlan;
      const _dayCheckOutFormatted = this.objQueryString.endDate;

      return getHotelDetailPagePath(
        {
          hotelName: GetSlug(this.info.name),
        },
        {
          hotelSn: this.info.sn,
          bookingType: this.info.displayRule.bookingType,
          startDate: _dayCheckInFormatted,
          endDate: _dayCheckOutFormatted,
        }
      );
    }, // generateDetailPathList()

    generateFinalCurPrice() {
      if(!this.hasInfoUpdate) {
        return 0;
      }

      const tmpCurPrice = (
        this.infoUpdate.displayRule.discountPrice === 0 ?
          this.infoUpdate.displayRule.originPrice :
        this.infoUpdate.displayRule.originPrice < this.infoUpdate.displayRule.discountPrice ?
          this.infoUpdate.displayRule.originPrice :
          this.infoUpdate.displayRule.discountPrice
      );

      return (
        tmpCurPrice > 0 ?
          formatToThounsands(tmpCurPrice) + '<sup>đ</sup>' :
        ''
      );
    }, // generateFinalCurPrice()

    generateFinalOldPrice() {
      if(!this.hasInfoUpdate) {
        return 0;
      }

      const tmpOldPrice = (
        this.infoUpdate.displayRule.discountPrice === 0 ?
          0 :
        this.infoUpdate.displayRule.originPrice <= this.infoUpdate.displayRule.discountPrice ?
          0 :
          this.infoUpdate.displayRule.originPrice
      );

      return (
        tmpOldPrice > 0 ?
          formatToThounsands(tmpOldPrice) + '<sup>đ</sup>' :
        ''
      )
    }, // generateFinalOldPrice()

    generateEmptyPriceLabelWithLocale() {
      if(
        !this.hasInfoUpdate ||
        _.isEmpty(this.curPrice) ||
        !this.infoUpdate.roomAvailable
      ) {
        return {
          [LANGUAGE_VALID.vi]: '<span class="icon-shape"><i class="far fa-clock"></i></span><span class="empty-price-label">Hết phòng</span>',
          [LANGUAGE_VALID.en]: '<span class="icon-shape"><i class="far fa-clock"></i></span><span class="empty-price-label">Out of room on date</span>',
        };
      }

      return {};
    }, // generateEmptyPriceLabelWithLocale()

    generateAccommondationLabelWithLocale() {
      // NOTE - Case 1
      // NOTE - If the title is not string of type or if it's string of type and trim() of it is empty -> return {} empty
      if(
        !this.isAgoda ||
        typeof this.info.type !== 'string' ||
        !this.info.type.trim()
      ) {
        return {};
      }

      // NOTE - Case 2
      // NOTE - If pass case 1, we will split the title and check condition on it
      const titleSplitted = this.info.type.split('|');

      // NOTE - Cause the title is string of type, so the split native method worked and the a string split a letter or word does not exist in title -> the result will give an array with length always = 1
      // NOTE - If length = 1 we will check the trim() of [0] word of 0 index else we will check words of 0 index and 1 index (if one of 2 group condition is true -> return {})
      if(
        (
          titleSplitted.length === 1 &&
          !titleSplitted[0].trim()
        ) ||
        (
          !titleSplitted[0].trim() &&
          !titleSplitted[1].trim()
        )
      ) {
        return {};
      }

      if(
        titleSplitted.length === 1 &&
        titleSplitted[0].trim()
      ) {
        const finalTitle = he.decode(titleSplitted[0].trim());

        return {
          [LANGUAGE_VALID.vi]: finalTitle,
          [LANGUAGE_VALID.en]: finalTitle,
        };
      }

      const finalTitleVi = titleSplitted[0].trim();
      const finalTitleEn = titleSplitted[1].trim();

      return {
        [LANGUAGE_VALID.vi]: (
          finalTitleVi ?
            he.decode(finalTitleVi) :
            he.decode(finalTitleEn)
        ),
        [LANGUAGE_VALID.en]: (
          finalTitleEn ?
            he.decode(finalTitleEn) :
            he.decode(finalTitleVi)
        ),
      };
    }, // generateAccommondationLabelWithLocale()
  },
}
</script>
