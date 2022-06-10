<template>
  <div
    class="light-square-room-card-outer"
    :class="{
      'swiper-slide': isSlide,
    }"
    :style="isSlide && width ? `width:${width}px` : undefined"
  >
    <router-link
      :to="isValidToShow ? detailPathList[language] : ''"
      v-slot="{ href, navigate }"
    >
      <div
        class="light-square-room-card"
        :class="{
          '--is-disable': !isValidToShow
        }"
      >
        <component
          :is="isValidToShow ? 'a' : 'div'"
          :href="isValidToShow ? href : undefined"
          class="light-square-room-card__inner"
          @click.prevent="checkToNavigateCorrect(href, navigate)"
        >
          <div class="light-square-room-card__head card-head">
            <img
              v-if="hasImageUrl"
              :data-src="imageUrl"
              class="light-square-room-card__img card-img lazyload"
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
              v-if="info.amenityPack"
              class="light-square-room-card__amenity-pack"
            >
              <div class="light-square-room-card__amenity-pack-head">
                <div class="light-square-room-card__amenity-pack-img-outer">
                  <img
                    :data-src="IMAGE_URL + '/amenity-update_30112021.png?v=' + CACHE_VERSION"
                    class="light-square-room-card__amenity-pack-img lazyload"
                    loading="lazy"
                    :alt="title + ' amenity pack'"
                    data-sizes="auto"
                    data-expand="-5"
                    itemprop="photo"
                    onerror="this.classList.add('is-image-error')"
                    width="45"
                    height="45"
                  >
                </div> <!-- .light-square-room-card__amenity-pack-img-outer -->
              </div> <!-- .light-square-room-card__amenity-pack-head -->
              <div class="light-square-room-card__amenity-pack-body">
                <span class="light-square-room-card__amenity-pack-title">
                  {{ $t('common.amenity_pack') }}
                </span>
              </div> <!-- .light-square-room-card__amenity-pack-body -->
            </div> <!-- .light-square-room-card__amenity-pack -->

            <span
              v-if="info.soldOut"
              class="light-square-room-card__soldout-label"
            >
              {{ $t('common.sold_out') }}
            </span>
          </div> <!-- .light-square-room-card__head -->

          <div class="light-square-room-card__body card-body">
            <div class="light-square-room-card__tag-field card-tag-field">
              <div
                v-if="info.isGo2Choice"
                class="light-square-room-card__tag card-tag --orange-gradient"
              >
                <img
                  :src="IMAGE_URL + '/g2choice-rectangular-tag.jpg?v=' + CACHE_VERSION"
                  alt="go2joychoice"
                  class="tag-img"
                  width="82"
                  height="20"
                >
              </div> <!-- .light-square-room-card__tag -->

              <div
                v-if="info.newHotel"
                class="light-square-room-card__tag card-tag --blue"
              >
                <img
                  :src="IMAGE_URL + `/svg/new-tag--${ language }.svg`"
                  :alt="$t('common.new')"
                  class="tag-img"
                  width="100%"
                  height="100%"
                >
              </div> <!-- .light-square-room-card__tag -->

              <div
                v-if="info.hotHotel"
                class="light-square-room-card__tag card-tag --red"
              >
                <img
                  :src="IMAGE_URL + `/svg/hot-tag--${ language }.svg`"
                  :alt="$t('common.hot')"
                  class="tag-img"
                  width="100%"
                  height="100%"
                >
              </div> <!-- .light-square-room-card__tag -->
            </div> <!-- .light-square-room-card__tag-field -->

            <div
              v-if="hasTitle"
              class="light-square-room-card__title card-title"
            >
              <h4 class="light-square-room-card__title-label card-title-label">
                {{ title }}
              </h4>
            </div> <!-- .light-square-room-card__title -->

            <div
              v-if="
                hasBedType ||
                hasSquare ||
                hasRoomView
              "
              class="light-square-room-card__facility-field"
            >
              <div
                v-if="hasBedType"
                class="facility-col"
              >
                <span class="facility-label">
                  {{
                    info.bedSize == 1
                    ? $t("common.single")
                    : info.bedSize == 2
                    ? $t("common.double")
                    : info.bedSize == 3
                    ? $t("common.twin")
                    : info.bedSize == 4
                    ? $t("common.triple")
                    : info.bedSize == 5
                    ? $t("common.2_double") :
                    ''
                  }}
                </span> <!-- .facility-label -->
              </div> <!-- .facility-col -->
              <div
                v-else-if="hasBedTypeLabelWithLocale"
                class="facility-col"
              >
                <span class="facility-label">
                  {{ bedTypeLabelWithLocale[language] }}
                </span> <!-- .facility-label -->
              </div> <!-- .facility-col -->

              <div
                v-if="hasSquare"
                class="facility-col"
              >
                <span class="facility-label">
                  {{ info.square }}m<sup>2</sup>
                </span> <!-- .facility-label -->
              </div> <!-- .facility-col -->

              <div
                v-if="hasRoomView"
                class="facility-col"
              >
                <span class="facility-label">
                  {{ roomViewLabelWithLocale[language] }}
                </span> <!-- .facility-label -->
              </div> <!-- .facility-col -->
            </div> <!-- .light-square-room-card__facility-field -->
            <div
              v-else
              class="light-square-room-card__facility-field"
            >
            </div>

            <div
              v-if="
                hasBenefitListWithLocale ||
                hasRoomLeftLabelWithLocale
              "
              class="light-square-room-card__benefit-tag-field card-benefit-tag-field"
            >
              <div
                v-for="benefitLabelWithLocale,idx in benefitListWithLocale"
                :key="idx"
                class="light-square-room-card__benefit-tag-col"
              >
                <span class="light-square-room-card__benefit-tag">
                  {{ benefitLabelWithLocale[language] }}
                </span> <!-- .light-square-room-card__benefit-tag -->
              </div> <!-- .light-square-room-card__benefit-tag-col -->

              <div
                v-if="hasRoomLeftLabelWithLocale"
                class="light-square-room-card__room-left-col"
              >
                <div class="light-square-room-card__room-left-tag">
                  {{ roomLeftLabelWithLocale[language] }}
                </div>
              </div> <!-- .light-square-room-card__room-left-col -->
            </div> <!-- .light-square-room-card__benefit-tag-field -->

            <div
              v-else
              class="light-square-room-card__benefit-tag-field card-benefit-tag-field"
            >
            </div> <!-- .light-square-room-card__benefit-tag-field -->

            <div class="light-square-room-card__meta-info-field card-meta-info-field">
              <div class="light-square-room-card__price-group-col card-price-group-col">
                <div
                  v-if="hasBookingType"
                  class="booking-type"
                >
                  {{ bookingType }}
                </div> <!-- .booking-type -->
                <div
                  v-else
                  class="booking-type"
                ></div>

                <div
                  v-if="hasCurPrice || hasOldPrice"
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
              </div>
              <!-- .light-square-room-card__price-group-col -->

              <div class="light-square-room-card__detail-btn-col card-detail-btn-col">
                <button class="detail-btn">
                  {{ $t('common.select_room') }}
                </button>
              </div> <!-- .light-square-room-card__more-info -->
            </div>
            <!-- .light-square-room-card__meta-info-field -->
          </div> <!-- .light-square-room-card__body -->
        </component>

        <div
          v-if="hasCancellationPolicyWithLocale"
          class="light-square-room-card__cancellation-field"
          @click.prevent="$emit('openCancellationPolicyModal', cancellationPolicyWithLocale)"
        >
          <span class="cancellation-label">
            {{ $t('common.cancellation_policy') }}
          </span> <!-- .cancellation-label -->
          <span class="icon-shape">
            <i class="fal fa-info-circle"></i>
          </span> <!-- .icon-shape -->
        </div>
        <!-- .light-square-room-card__cancellation-field -->

        <div
          v-if="
            hasMaxHourLabelWithLocale ||
            hasAdditionalLabelWithLocale ||
            hasAdditionalGiftLabelWithLocale ||
            hasAdditionalPromotionLabelWithLocale ||
            hasLockLabelWithLocale
          "
          class="light-square-room-card__extend-info-group"
        >
          <div
            v-if="hasMaxHourLabelWithLocale"
            class="light-square-room-card__extend-info-field"
          >
            {{ maxHourLabelWithLocale[language] }}
          </div> <!-- .light-square-room-card__extend-info-field -->

          <div
            v-if="
              !hasMaxHourLabelWithLocale &&
              hasAdditionalLabelWithLocale
            "
            class="light-square-room-card__extend-info-field"
          >
            {{ additionalLabelWithLocale[language] }}
          </div> <!-- .light-square-room-card__extend-info-field -->

          <div
            v-if="
              !hasMaxHourLabelWithLocale &&
              !hasAdditionalLabelWithLocale &&
              hasAdditionalGiftLabelWithLocale
            "
            class="light-square-room-card__extend-info-field"
          >
            {{ additionalGiftLabelWithLocale[language] }}
          </div> <!-- .light-square-room-card__extend-info-field -->

          <div
            v-if="
              !hasMaxHourLabelWithLocale &&
              !hasAdditionalLabelWithLocale &&
              hasAdditionalPromotionLabelWithLocale
            "
            class="light-square-room-card__extend-info-field"
          >
            {{ additionalPromotionLabelWithLocale[language] }}
          </div> <!-- .light-square-room-card__extend-info-field -->

          <div
            v-if="hasLockLabelWithLocale"
            class="light-square-room-card__extend-info-field"
          >
            <span class="icon-shape">
              <img
                :src="IMAGE_URL + '/icon/lock.svg?v=' + CACHE_VERSION"
                alt="khoá"
                width="9"
                height="12"
                class="icon-img"
              >
            </span>
            <span class="lock-label">
              {{ lockLabelWithLocale[language] }}
            </span>
          </div> <!-- .light-square-room-card__extend-info-field -->
        </div> <!-- .light-square-room-card__extend-info-group -->
      </div> <!-- .light-square-room-card -->
    </router-link>
  </div> <!-- .light-square-room-card-outer -->
</template>

<script>
  import { _, he, mapState } from "~jsLibPath/lib-manager";
  import {
    IMAGE_URL,
    CACHE_VERSION,
    LANGUAGE_VALID,
    HAS_MOITAI,
  } from "~jsDefinePath/general";
  import { getRoomDetailPagePath } from "~jsHelperPath/util/HandleUrl";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/page-info-module";
  import { formatToThounsands } from "~jsHelperPath/util/General";
  import { EVENT_BUS_KEY } from "~jsDefinePath/event-bus";

  export default {
    props: {
      hotelInfoV4: {
        type: Object,
        default: new Object(),
      }, // hotelInfoV4

      timeBetween: {
        type: Number,
        default: 0,
      }, // timeBetween

      isDisableInvalid: {
        default: true,
        type: Boolean,
      }, // isDisableInvalid

      info: {
        default: {},
        type: new Object(),
      }, // info
      isDefaultOvernightSpecial: Boolean,
      isOvernightSpecial: Boolean,
    },

    data() {
      return {
        IMAGE_URL,
        HAS_MOITAI,
        CACHE_VERSION,

        hasInfo: !_.isEmpty(this.info) || !_.isEmpty(this.info.displayRule),

        isShowModal: false,

        // NOTE - setup data
        title: "",
        additionalLabelWithLocale: {},
        additionalPromotionLabelWithLocale: {},
        additionalGiftLabelWithLocale: {},
        square: 0,
        roomViewLabelWithLocale: {},
        imageUrl: "",
        curPrice: "",
        oldPrice: "",
        benefitListWithLocale: [],
        lockLabelWithLocale: {},
        cancellationPolicyWithLocale: {},
        roomLeftLabelWithLocale: {},
        maxHourLabelWithLocale: {},

        // NOTE - exist status of data
        hasBedType: false,
        hasSquare: false,
        hasRoomView: false,
        hasBookingType: false,
        hasAdditionalLabelWithLocale: false,
        hasAdditionalPromotionLabelWithLocale: false,
        hasAdditionalGiftLabelWithLocale: false,
        hasImageUrl: false,
        hasTitle: false,
        hasCurPrice: false,
        hasOldPrice: false,
        hasBenefitListWithLocale: false,
        hasLockLabelWithLocale: false,
        hasCancellationPolicyWithLocale: false,
        hasRoomLeftLabelWithLocale: false,
        hasMaxHourLabelWithLocale: false,

        isValidToShow: false,
      };
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, ["language"]),

      bookingType() {
        if (!this.hasInfo) {
          return "";
        }

        return this.hotelInfoV4.timeSelect == 1
          ? {
              [LANGUAGE_VALID.vi]: this.finalTimeBetween + " giờ",
              [LANGUAGE_VALID.en]: this.finalTimeBetween + " hour(s)",
            }[this.language]
          : this.hotelInfoV4.timeSelect == 2
          ? this.$t("common.overnight")
          : this.hotelInfoV4.timeSelect == 3
          ? {
              [LANGUAGE_VALID.vi]: this.timeBetween + " ngày",
              [LANGUAGE_VALID.en]: this.timeBetween + " day(s)",
            }[this.language]
          : "";
      }, // bookingType

      finalTimeBetween() {
        if (!this.hasInfo) {
          return this.timeBetween;
        }

        return this.timeBetween <= this.info.firstHours
          ? this.info.firstHours
          : this.timeBetween;
      }, // finalTimeBetween

      hasFinalTimeBetween() {
        return this.finalTimeBetween > 0;
      }, // hasFinalTimeBetween
    },

    created() {
      // NOTE - setup data
      this.detailPathList = this.generateDetailPathList();
      this.imageUrl = this.generateImageUrl();
      this.title = this.generateTitle();

      this.additionalLabelWithLocale = this.generateAdditionalLabelWithLocale();
      this.additionalPromotionLabelWithLocale =
        this.generateAdditionalPromotionLabelWithLocale();
      this.additionalGiftLabelWithLocale =
        this.generateAdditionalGiftLabelWithLocale();
      this.bedTypeLabelWithLocale = this.generateBedTypeLabelWithLocale();
      this.square = this.generateSquare();
      this.roomViewLabelWithLocale = this.generateRoomViewLabel();

      this.curPrice = this.generateCurPrice();
      this.oldPrice = this.generateOldPrice();

      this.benefitListWithLocale = this.generateBenefitListWithLocale();
      this.lockLabelWithLocale = this.generateLockLabelWithLocale();
      this.cancellationPolicyWithLocale =
        this.generateCancellationPolicyWithLocale();
      this.roomLeftLabelWithLocale = this.generateRoomLeftLabelWithLocale();
      this.maxHourLabelWithLocale = this.generateMaxHourLabelWithLocale();

      // NOTE - check if exist data
      this.hasDetailPathList = !_.isEmpty(this.detailPathList);
      this.hasImageUrl = !_.isEmpty(this.imageUrl);
      this.hasTitle = !_.isEmpty(this.title);

      const _tmpBedType = Number(this.info.bedSize);

      this.hasBedType = _tmpBedType ? true : false;
      this.hasSquare = this.square > 0;
      this.hasRoomView = !_.isEmpty(this.roomViewLabelWithLocale);

      this.hasBookingType = !_.isEmpty(this.bookingType);
      this.hasBedTypeLabelWithLocale = !_.isEmpty(this.bedTypeLabelWithLocale);
      this.hasAdditionalLabelWithLocale = !_.isEmpty(
        this.additionalLabelWithLocale
      );
      this.hasAdditionalPromotionLabelWithLocale = !_.isEmpty(
        this.additionalPromotionLabelWithLocale
      );
      this.hasAdditionalGiftLabelWithLocale = !_.isEmpty(
        this.additionalGiftLabelWithLocale
      );

      this.hasCurPrice = !_.isEmpty(this.curPrice);
      this.hasOldPrice = !_.isEmpty(this.oldPrice);

      this.hasBenefitListWithLocale = !_.isEmpty(this.benefitListWithLocale);
      this.hasLockLabelWithLocale = !_.isEmpty(this.lockLabelWithLocale);
      this.hasCancellationPolicyWithLocale = !_.isEmpty(
        this.cancellationPolicyWithLocale
      );
      this.hasRoomLeftLabelWithLocale = !_.isEmpty(this.roomLeftLabelWithLocale);
      this.hasMaxHourLabelWithLocale = !_.isEmpty(this.maxHourLabelWithLocale);

      // NOTE - check valid to show
      this.checkValidToShow();
    },

    mounted() {
      const self = this;

      self.$emit("mounted", {
        is_valid: self.isValidToShow,
        is_finish_render_list: self.info.order === self.info.total,
        info: self.info,
      });
    },

    methods: {
      checkValidToShow() {
        // if (this.isOvernightSpecial) {
        //   let checkAvailable = this.info.available || this.info.availableRightNow; // check available with right now
        //   this.isValidToShow =
        //     this.hasInfo &&
        //     this.hasDetailPathList &&
        //     this.hasCurPrice &&
        //     !this.info.soldOut &&
        //     !this.hasAdditionalLabelWithLocale &&
        //     this.info.dailyTomorrowAvailable &&
        //     checkAvailable;
        //   return;
        // }

        this.isValidToShow =
          this.hasInfo &&
          this.hasDetailPathList &&
          this.hasCurPrice &&
          !this.info.soldOut &&
          this.info.available &&
          !this.hasAdditionalLabelWithLocale &&
          this.info.dailyTomorrowAvailable;
      }, // checkValidToShow()

      generateDetailPathList() {
        if (!this.hasInfo || typeof this.info.sn !== "number") {
          return {};
        }

        return getRoomDetailPagePath(
          {
            hotelName: this.$route.params.hotelName,
            roomName: GetSlug(this.info.name),
          },
          {
            hotelSn: this.hotelInfoV4.sn,
            roomTypeSn: this.info.sn,
            mode: this.info.mode,
            bookingType: this.hotelInfoV4.timeSelect,
            checkInDatePlan: this.hotelInfoV4.startDate.format("YYYY-MM-DD"),
            endDate: this.hotelInfoV4.endDate.format("YYYY-MM-DD"),
            startTime: this.hotelInfoV4.startTime,
            endTime: this.hotelInfoV4.endTime,
            paymentMethod: this.hotelInfoV4.paymentMethod || 1,
          }
        );
      }, // generateDetailPathList()

      generateAdditionalLabelWithLocale() {
        // NOTE - Case 1
        // NOTE - If the title is not string of type or if it's string of type and trim() of it is empty -> return {} empty

        if (
          !this.info ||
          typeof this.info.additionForBookingRoom !== "string" ||
          !this.info.additionForBookingRoom.trim()
        ) {
          return {};
        }

        // NOTE - Case 2
        // NOTE - If pass case 1, we will split the title and check condition on it
        const tmpAdditionalForBookingRoomLabel =
          this.info.additionForBookingRoom.split("|");

        // NOTE - Cause the typeDisplayText is string of type, so the split native method worked and the a string split a letter or word does not exist in typeDisplayText -> the result will give an array with length always = 1
        // NOTE - If length = 1 we will check the trim() of [0] word of 0 index else we will check words of 0 index and 1 index (if one of 2 group condition is true -> return {})
        if (
          (tmpAdditionalForBookingRoomLabel.length === 1 &&
            !tmpAdditionalForBookingRoomLabel[0].trim()) ||
          (!tmpAdditionalForBookingRoomLabel[0].trim() &&
            !tmpAdditionalForBookingRoomLabel[1].trim())
        ) {
          return {};
        }

        if (
          tmpAdditionalForBookingRoomLabel.length === 1 &&
          tmpAdditionalForBookingRoomLabel[0].trim()
        ) {
          const finalTmpAdditionalForBookingRoomLabel = he.decode(
            tmpAdditionalForBookingRoomLabel[0].trim()
          );

          return {
            [LANGUAGE_VALID.vi]: finalTmpAdditionalForBookingRoomLabel,
            [LANGUAGE_VALID.en]: finalTmpAdditionalForBookingRoomLabel,
          };
        }

        const finalTmpAdditionalForBookingRoomLabelVi =
          tmpAdditionalForBookingRoomLabel[0].trim();
        const finalTmpAdditionalForBookingRoomLabelEn =
          tmpAdditionalForBookingRoomLabel[1].trim();

        return {
          [LANGUAGE_VALID.vi]: finalTmpAdditionalForBookingRoomLabelVi
            ? he.decode(finalTmpAdditionalForBookingRoomLabelVi)
            : he.decode(finalTmpAdditionalForBookingRoomLabelEn),
          [LANGUAGE_VALID.en]: finalTmpAdditionalForBookingRoomLabelEn
            ? he.decode(finalTmpAdditionalForBookingRoomLabelEn)
            : he.decode(finalTmpAdditionalForBookingRoomLabelVi),
        };
      }, // generateAdditionalLabelWithLocale()

      generateAdditionalPromotionLabelWithLocale() {
        // NOTE - Case 1
        // NOTE - If the title is not string of type or if it's string of type and trim() of it is empty -> return {} empty
        if (
          !this.info ||
          typeof this.info.additionForMorePromotion !== "string" ||
          !this.info.additionForMorePromotion.trim()
        ) {
          return {};
        }

        // NOTE - Case 2
        // NOTE - If pass case 1, we will split the title and check condition on it
        const tmpAdditionalForMorePromotionLabel =
          this.info.additionForMorePromotion.split("|");

        // NOTE - Cause the typeDisplayText is string of type, so the split native method worked and the a string split a letter or word does not exist in typeDisplayText -> the result will give an array with length always = 1
        // NOTE - If length = 1 we will check the trim() of [0] word of 0 index else we will check words of 0 index and 1 index (if one of 2 group condition is true -> return {})
        if (
          (tmpAdditionalForMorePromotionLabel.length === 1 &&
            !tmpAdditionalForMorePromotionLabel[0].trim()) ||
          (!tmpAdditionalForMorePromotionLabel[0].trim() &&
            !tmpAdditionalForMorePromotionLabel[1].trim())
        ) {
          return {};
        }

        if (
          tmpAdditionalForMorePromotionLabel.length === 1 &&
          tmpAdditionalForMorePromotionLabel[0].trim()
        ) {
          const finalTmpAdditionalForMorePromotionLabel = he.decode(
            tmpAdditionalForMorePromotionLabel[0].trim()
          );

          return {
            [LANGUAGE_VALID.vi]: finalTmpAdditionalForMorePromotionLabel,
            [LANGUAGE_VALID.en]: finalTmpAdditionalForMorePromotionLabel,
          };
        }

        const finalTmpAdditionalForMorePromotionLabelVi =
          tmpAdditionalForMorePromotionLabel[0].trim();
        const finalTmpAdditionalForMorePromotionLabelEn =
          tmpAdditionalForMorePromotionLabel[1].trim();

        return {
          [LANGUAGE_VALID.vi]: finalTmpAdditionalForMorePromotionLabelVi
            ? he.decode(finalTmpAdditionalForMorePromotionLabelVi)
            : he.decode(finalTmpAdditionalForMorePromotionLabelEn),
          [LANGUAGE_VALID.en]: finalTmpAdditionalForMorePromotionLabelEn
            ? he.decode(finalTmpAdditionalForMorePromotionLabelEn)
            : he.decode(finalTmpAdditionalForMorePromotionLabelVi),
        };
      }, // generateAdditionalPromotionLabelWithLocale()

      generateAdditionalGiftLabelWithLocale() {
        // NOTE - Case 1
        // NOTE - If the title is not string of type or if it's string of type and trim() of it is empty -> return {} empty
        if (
          !this.info ||
          !this.info.hasGift ||
          typeof this.info.giftDescription !== "string" ||
          this.info.giftDescription === "null" ||
          !this.info.giftDescription.trim()
        ) {
          return {};
        }

        // NOTE - Case 2
        // NOTE - If pass case 1, we will split the title and check condition on it
        const tmpAdditionalForGiftLabel = this.info.giftDescription.split("|");

        // NOTE - Cause the typeDisplayText is string of type, so the split native method worked and the a string split a letter or word does not exist in typeDisplayText -> the result will give an array with length always = 1
        // NOTE - If length = 1 we will check the trim() of [0] word of 0 index else we will check words of 0 index and 1 index (if one of 2 group condition is true -> return {})
        if (
          (tmpAdditionalForGiftLabel.length === 1 &&
            !tmpAdditionalForGiftLabel[0].trim()) ||
          (!tmpAdditionalForGiftLabel[0].trim() &&
            !tmpAdditionalForGiftLabel[1].trim())
        ) {
          return {};
        }

        if (
          tmpAdditionalForGiftLabel.length === 1 &&
          tmpAdditionalForGiftLabel[0].trim()
        ) {
          const finalTmpAdditionalForGiftLabel = he.decode(
            tmpAdditionalForGiftLabel[0].trim()
          );

          return {
            [LANGUAGE_VALID.vi]: finalTmpAdditionalForGiftLabel,
            [LANGUAGE_VALID.en]: finalTmpAdditionalForGiftLabel,
          };
        }

        const finalTmpAdditionalForGiftLabelVi =
          tmpAdditionalForGiftLabel[0].trim();
        const finalTmpAdditionalForGiftLabelEn =
          tmpAdditionalForGiftLabel[1].trim();

        return {
          [LANGUAGE_VALID.vi]: finalTmpAdditionalForGiftLabelVi
            ? he.decode(finalTmpAdditionalForGiftLabelVi)
            : he.decode(finalTmpAdditionalForGiftLabelEn),
          [LANGUAGE_VALID.en]: finalTmpAdditionalForGiftLabelEn
            ? he.decode(finalTmpAdditionalForGiftLabelEn)
            : he.decode(finalTmpAdditionalForGiftLabelVi),
        };
      }, // generateAdditionalGiftLabelWithLocale()

      generateLockLabelWithLocale() {
        // NOTE - Case 1
        // NOTE - If the title is not string of type or if it's string of type and trim() of it is empty -> return {} empty
        if (
          typeof this.info.displayLock !== "string" ||
          !this.info.displayLock.trim()
        ) {
          return {};
        }

        // NOTE - Case 2
        // NOTE - If pass case 1, we will split the title and check condition on it
        const tmpLockLabelSplitted = this.info.displayLock.split("|");

        // NOTE - Cause the typeDisplayText is string of type, so the split native method worked and the a string split a letter or word does not exist in typeDisplayText -> the result will give an array with length always = 1
        // NOTE - If length = 1 we will check the trim() of [0] word of 0 index else we will check words of 0 index and 1 index (if one of 2 group condition is true -> return {})
        if (
          (tmpLockLabelSplitted.length === 1 &&
            !tmpLockLabelSplitted[0].trim()) ||
          (!tmpLockLabelSplitted[0].trim() && !tmpLockLabelSplitted[1].trim())
        ) {
          return {};
        }

        if (tmpLockLabelSplitted.length === 1 && tmpLockLabelSplitted[0].trim()) {
          const finalTmpLockLabel = he.decode(tmpLockLabelSplitted[0].trim());

          return {
            [LANGUAGE_VALID.vi]: finalTmpLockLabel,
            [LANGUAGE_VALID.en]: finalTmpLockLabel,
          };
        }

        const finalTmpLockLabelVi = tmpLockLabelSplitted[0].trim();
        const finalTmpLockLabelEn = tmpLockLabelSplitted[1].trim();

        return {
          [LANGUAGE_VALID.vi]: finalTmpLockLabelVi
            ? he.decode(finalTmpLockLabelVi)
            : he.decode(finalTmpLockLabelEn),
          [LANGUAGE_VALID.en]: finalTmpLockLabelEn
            ? he.decode(finalTmpLockLabelEn)
            : he.decode(finalTmpLockLabelVi),
        };
      }, // generateLockLabelWithLocale()

      generateBedTypeLabelWithLocale() {
        if (
          !this.hasInfo ||
          this.hasBedType ||
          typeof this.info.bedType !== "string" ||
          !this.info.bedType.trim()
        ) {
          return {};
        }

        // NOTE - Case 2
        // NOTE - If pass case 1, we will split the title and check condition on it
        const tmpBedTypeSplitted = this.info.bedType.split("|");

        // NOTE - Cause the typeDisplayText is string of type, so the split native method worked and the a string split a letter or word does not exist in typeDisplayText -> the result will give an array with length always = 1
        // NOTE - If length = 1 we will check the trim() of [0] word of 0 index else we will check words of 0 index and 1 index (if one of 2 group condition is true -> return {})
        if (
          (tmpBedTypeSplitted.length === 1 && !tmpBedTypeSplitted[0].trim()) ||
          (!tmpBedTypeSplitted[0].trim() && !tmpBedTypeSplitted[1].trim())
        ) {
          return {};
        }

        if (tmpBedTypeSplitted.length === 1 && tmpBedTypeSplitted[0].trim()) {
          const finalBedTypeLabel = he.decode(tmpBedTypeSplitted[0].trim());

          return {
            [LANGUAGE_VALID.vi]: finalBedTypeLabel,
            [LANGUAGE_VALID.en]: finalBedTypeLabel,
          };
        }

        const finalBedTypeLabelVi = tmpBedTypeSplitted[0].trim();
        const finalBedTypeLabelEn = tmpBedTypeSplitted[1].trim();

        return {
          [LANGUAGE_VALID.vi]: finalBedTypeLabelVi
            ? he.decode(finalBedTypeLabelVi)
            : he.decode(finalBedTypeLabelEn),
          [LANGUAGE_VALID.en]: finalBedTypeLabelEn
            ? he.decode(finalBedTypeLabelEn)
            : he.decode(finalBedTypeLabelVi),
        };
      }, // generateBedTypeLabelWithLocale()

      generateSquare() {
        if (!this.hasInfo) {
          return 0;
        }

        const _tmpSquare = Number(this.info.square);

        return _tmpSquare > 0 ? _tmpSquare : 0;
      }, // generateSquare()

      generateRoomViewLabel() {
        if (!this.hasInfo || _.isEmpty(this.info.roomViewList)) {
          return {};
        }

        return {
          [LANGUAGE_VALID.vi]: he.decode(this.info.roomViewList[0].name),
          [LANGUAGE_VALID.en]: he.decode(this.info.roomViewList[0].nameEn),
        };
      }, // generateRoomViewLabel()

      generateImageUrl() {
        if (!this.hasInfo) {
          return "";
        }

        return (this.$assetsServiceUrl || "") + "/" + this.info.imagePath;
      }, // generateImageUrl()

      generateTitle() {
        // NOTE - Case 1
        // NOTE - If the title is not string of type or if it's string of type and trim() of it is empty -> return {} empty
        if (
          !this.hasInfo ||
          typeof this.info.name !== "string" ||
          !this.info.name.trim()
        ) {
          return "";
        }

        return he.decode(this.info.name.trim());
      }, // generateTitle()

      generateCurPrice() {
        if (!this.hasInfo) {
          return 0;
        }

        // const tmpCurPrice = (
        //   this.info.displayRule.discountPrice === 0 ?
        //     this.info.displayRule.originPrice :
        //   this.info.displayRule.originPrice < this.info.displayRule.discountPrice ?
        //     this.info.displayRule.originPrice :
        //     this.info.displayRule.discountPrice
        // );

        const tmpCurPrice =
          this.info.displayRule.discountPrice > 0
            ? this.info.displayRule.discountPrice
            : this.info.displayRule.originPrice;

        return tmpCurPrice > 0
          ? formatToThounsands(tmpCurPrice) + "<sup>đ</sup>"
          : "";
      }, // generateCurPrice()

      generateOldPrice() {
        if (!this.hasInfo) {
          return 0;
        }

        // const tmpOldPrice = (
        //   this.info.displayRule.discountPrice === 0 ?
        //     0 :
        //   this.info.displayRule.originPrice <= this.info.displayRule.discountPrice ?
        //     0 :
        //     this.info.displayRule.originPrice
        // );

        const tmpOldPrice =
          this.info.displayRule.originPrice > 0
            ? this.info.displayRule.originPrice >
              this.info.displayRule.discountPrice
              ? this.info.displayRule.originPrice
              : 0
            : 0;

        return tmpOldPrice > 0
          ? formatToThounsands(tmpOldPrice) + "<sup>đ</sup>"
          : "";
      }, // generateOldPrice()

      generateBenefitListWithLocale() {
        if (!this.hasInfo || _.isEmpty(this.info.displayRule.typeDisplayText)) {
          return [];
        }

        const tmpBenefitList = [];

        this.info.displayRule.typeDisplayText.forEach(function (
          typeDisplayTextItem
        ) {
          // NOTE - Case 1
          // NOTE - If the title is not string of type or if it's string of type and trim() of it is empty -> return {} empty
          if (
            typeof typeDisplayTextItem !== "string" ||
            !typeDisplayTextItem.trim()
          ) {
            return {};
          }

          // NOTE - Case 2
          // NOTE - If pass case 1, we will split the title and check condition on it
          const typeDisplayTextSplitted = typeDisplayTextItem.split("|");

          // NOTE - Cause the typeDisplayText is string of type, so the split native method worked and the a string split a letter or word does not exist in typeDisplayText -> the result will give an array with length always = 1
          // NOTE - If length = 1 we will check the trim() of [0] word of 0 index else we will check words of 0 index and 1 index (if one of 2 group condition is true -> return {})
          if (
            (typeDisplayTextSplitted.length === 1 &&
              !typeDisplayTextSplitted[0].trim()) ||
            (!typeDisplayTextSplitted[0].trim() &&
              !typeDisplayTextSplitted[1].trim())
          ) {
            return;
          }

          if (
            typeDisplayTextSplitted.length === 1 &&
            typeDisplayTextSplitted[0].trim()
          ) {
            const finaltypeDisplayText = he.decode(
              typeDisplayTextSplitted[0].trim()
            );

            tmpBenefitList.push({
              [LANGUAGE_VALID.vi]: finaltypeDisplayText,
              [LANGUAGE_VALID.en]: finaltypeDisplayText,
            });

            return;
          }

          const finaltypeDisplayTextVi = typeDisplayTextSplitted[0].trim();
          const finaltypeDisplayTextEn = typeDisplayTextSplitted[1].trim();

          tmpBenefitList.push({
            [LANGUAGE_VALID.vi]: finaltypeDisplayTextVi
              ? he.decode(finaltypeDisplayTextVi)
              : he.decode(finaltypeDisplayTextEn),
            [LANGUAGE_VALID.en]: finaltypeDisplayTextEn
              ? he.decode(finaltypeDisplayTextEn)
              : he.decode(finaltypeDisplayTextVi),
          });
        });

        if (!tmpBenefitList.length) {
          return [];
        }

        return tmpBenefitList;
      }, // generateBenefitListWithLocale()

      generateCancellationPolicyWithLocale() {
        if (!this.hasInfo || _.isEmpty(this.info.cancelDescription)) {
          return {};
        }

        let _tmpCancellationPolicyWithLocale = {};

        if (!_.isEmpty(this.info.cancelDescription.cancellationPolicy.trim())) {
          _tmpCancellationPolicyWithLocale[LANGUAGE_VALID.vi] = he
            .decode(this.info.cancelDescription.cancellationPolicy)
            .trim();
        }

        if (!_.isEmpty(this.info.cancelDescription.cancellationPolicyEn.trim())) {
          _tmpCancellationPolicyWithLocale[LANGUAGE_VALID.en] = he
            .decode(this.info.cancelDescription.cancellationPolicyEn)
            .trim();
        }

        _tmpCancellationPolicyWithLocale[LANGUAGE_VALID.vi] =
          _tmpCancellationPolicyWithLocale[LANGUAGE_VALID.vi] ||
          _tmpCancellationPolicyWithLocale[LANGUAGE_VALID.en];

        _tmpCancellationPolicyWithLocale[LANGUAGE_VALID.en] =
          _tmpCancellationPolicyWithLocale[LANGUAGE_VALID.en] ||
          _tmpCancellationPolicyWithLocale[LANGUAGE_VALID.en];

        if (_.isEmpty(_tmpCancellationPolicyWithLocale[LANGUAGE_VALID.vi])) {
          return {};
        }

        return _tmpCancellationPolicyWithLocale;
      }, // generateCancellationPolicy()

      generateRoomLeftLabelWithLocale() {
        if (
          !this.hasInfo ||
          !(this.info.origin === 2 && !this.info.roomAvailable) ||
          typeof this.info.displayRule.roomsLeft !== "number" ||
          this.info.displayRule.roomsLeft === 0
        ) {
          return {};
        }

        return {
          [LANGUAGE_VALID.vi]:
            "Chỉ còn " + this.info.displayRule.roomsLeft + " phòng",
          [LANGUAGE_VALID.en]:
            "Only " + this.info.displayRule.roomsLeft + " left",
        };
      }, // generateRoomLeftLabelWithLocale()

      generateMaxHourLabelWithLocale() {
        // NOTE - Case 1
        // NOTE - If the title is not string of type or if it's string of type and trim() of it is empty -> return {} empty
        if (
          typeof this.info.maxHourForBookingRoom !== "string" ||
          !this.info.maxHourForBookingRoom.trim()
        ) {
          return {};
        }

        // NOTE - Case 2
        // NOTE - If pass case 1, we will split the title and check condition on it
        const tmpMaxHourForBookingRoomSplitted =
          this.info.maxHourForBookingRoom.split("|");

        // NOTE - Cause the typeDisplayText is string of type, so the split native method worked and the a string split a letter or word does not exist in typeDisplayText -> the result will give an array with length always = 1
        // NOTE - If length = 1 we will check the trim() of [0] word of 0 index else we will check words of 0 index and 1 index (if one of 2 group condition is true -> return {})
        if (
          (tmpMaxHourForBookingRoomSplitted.length === 1 &&
            !tmpMaxHourForBookingRoomSplitted[0].trim()) ||
          (!tmpMaxHourForBookingRoomSplitted[0].trim() &&
            !tmpMaxHourForBookingRoomSplitted[1].trim())
        ) {
          return {};
        }

        if (
          tmpMaxHourForBookingRoomSplitted.length === 1 &&
          tmpMaxHourForBookingRoomSplitted[0].trim()
        ) {
          const finalTmpMaxHourForBookingRoom = he.decode(
            tmpMaxHourForBookingRoomSplitted[0].trim()
          );

          return {
            [LANGUAGE_VALID.vi]: finalTmpMaxHourForBookingRoom,
            [LANGUAGE_VALID.en]: finalTmpMaxHourForBookingRoom,
          };
        }

        const finalTmpMaxHourForBookingRoomVi =
          tmpMaxHourForBookingRoomSplitted[0].trim();
        const finalTmpMaxHourForBookingRoomEn =
          tmpMaxHourForBookingRoomSplitted[1].trim();

        return {
          [LANGUAGE_VALID.vi]: finalTmpMaxHourForBookingRoomVi
            ? he.decode(finalTmpMaxHourForBookingRoomVi)
            : he.decode(finalTmpMaxHourForBookingRoomEn),
          [LANGUAGE_VALID.en]: finalTmpMaxHourForBookingRoomEn
            ? he.decode(finalTmpMaxHourForBookingRoomEn)
            : he.decode(finalTmpMaxHourForBookingRoomVi),
        };
      }, // generateMaxHourLabelWithLocale()

      checkToNavigateCorrect(href) {
        if (!HAS_MOITAI) {
          EventBus.emit(EVENT_BUS_KEY.OPEN_MODAL_DIRECT_APP, true);
          return;
        }
        if (
          this.hasMaxHourLabelWithLocale &&
          this.timeBetween > this.info.maxNumHour &&
          this.isValidToShow
        ) {
          this.$emit("openChangeTypeBookingModal", {
            href,
            max_hours: this.info.maxNumHour,
          });
        } else if (this.isValidToShow) {
          if (this.isDefaultOvernightSpecial && this.isOvernightSpecial) {
            // đợi api, cần check phòng đó có bị disable đối với case tonight hay k, gửi qua kia
            //đọc lại câu trên thêm lần nữa đi ba
            let isDisable = this.info && !this.info.availableTonight;
            this.$emit("bookOvernightSpecial", {
              isDisable,
              info: this.info,
            });
            return;
          }
          this.$router.push(href);
        }
      }, // checkToNavigateCorrect()
    },
  };
</script>
