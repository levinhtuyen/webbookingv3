<template>
  <div
    v-if="isValidToShow || isDisableInvalid"
    class="light-square-card-outer"
    :class="{
      'swiper-slide': isSlide,
    }"
    :style="isSlide && width ? `width:${width}px` : undefined"
  >
    <router-link
      :to="isValidToShow ? detailPathList[language] : ''"
      v-slot="{ href, navigate }"
    >
      <component
        :is="isValidToShow ? 'a' : 'div'"
        :href="isValidToShow ? href : undefined"
        class="light-square-card light-square-card"
        @click.prevent="checkToNavigateCorrect(href, navigate)"
      >
        <!-- @click="isValidToShow ? navigate : undefined" -->
        <div class="light-square-card__head card-head">
          <img
            v-if="hasImageUrl"
            :data-src="imageUrl"
            class="light-square-card__img card-img lazyload"
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
            class="light-square-card__amenity-pack"
          >
            <div class="light-square-card__amenity-pack-head">
              <div class="light-square-card__amenity-pack-img-outer">
                <img
                  :data-src="IMAGE_URL + '/amenity-update_30112021.png?v=' + CACHE_VERSION"
                  class="light-square-card__amenity-pack-img lazyload"
                  loading="lazy"
                  :alt="title + ' amenity pack'"
                  data-sizes="auto"
                  data-expand="-5"
                  itemprop="photo"
                  onerror="this.classList.add('is-image-error')"
                  width="45"
                  height="45"
                >
              </div> <!-- .light-square-card__amenity-pack-img-outer -->
            </div> <!-- .light-square-card__amenity-pack-head -->
            <div class="light-square-card__amenity-pack-body">
              <span class="light-square-card__amenity-pack-title">
                {{ $t('common.amenity_pack') }}
              </span>
            </div> <!-- .light-square-card__amenity-pack-body -->
          </div> <!-- .light-square-card__amenity-pack -->
        </div> <!-- .light-square-card__head -->

        <div class="light-square-card__body card-body">
          <div class="light-square-card__tag-field card-tag-field">
            <div
              v-if="info.isGo2Choice"
              class="light-square-card__tag card-tag --orange-gradient"
            >
              <img
                :src="IMAGE_URL + '/g2choice-rectangular-tag.jpg?v=' + CACHE_VERSION"
                alt="go2joychoice"
                class="tag-img"
                width="82"
                height="20"
              >
            </div> <!-- .light-square-card__tag -->

            <div
              v-if="info.newHotel"
              class="light-square-card__tag card-tag --blue"
            >
              <img
                :src="IMAGE_URL + `/svg/new-tag--${ language }.svg`"
                :alt="$t('common.new')"
                class="tag-img"
                width="100%"
                height="100%"
              >
            </div> <!-- .light-square-card__tag -->

            <div
              v-if="info.hotHotel"
              class="light-square-card__tag card-tag --red"
            >
              <img
                :src="IMAGE_URL + `/svg/hot-tag--${ language }.svg`"
                :alt="$t('common.hot')"
                class="tag-img"
                width="100%"
                height="100%"
              >
            </div> <!-- .light-square-card__tag -->
          </div> <!-- .light-square-card__tag-field -->

          <div
            v-if="hasTitle"
            class="light-square-card__title card-title"
          >
            <h4 class="light-square-card__title-label card-title-label">
              {{ title }}
            </h4>
          </div> <!-- .light-square-card__title -->

          <div class="light-square-card__info-room">
            <div
              v-if="[1,2,3,4,5].includes(info.bedSize)"
              class="is-data-info"
            >
              <p v-if="info.bedSize === 1">{{ $t('hotel_detail.detail_v4.bed_type.single') }}</p>
              <p v-else-if="info.bedSize === 2">{{ $t('hotel_detail.detail_v4.bed_type.double') }}</p>
              <p v-else-if="info.bedSize === 3">{{ $t('hotel_detail.detail_v4.bed_type.twin') }}</p>
              <p v-else-if="info.bedSize === 4">{{ $t('hotel_detail.detail_v4.bed_type.triple') }}</p>
              <p v-else-if="info.bedSize === 5">{{ $t('hotel_detail.detail_v4.bed_type.2_double') }}</p>
            </div>
            <span
              v-if="info.square > 0"
              class="is-data-info"
            >
              &nbsp;{{ info.square }}m<sup>2</sup>
            </span>
            <span
              class="is-data-info is-view"
              v-if="viewRoom"
            >
              &nbsp;<span v-if="language === 'en'">
                {{ viewRoom.nameEn }}
              </span>
              <span v-else>{{ viewRoom.name }}</span>
            </span>
          </div>

          <div
            v-if="hasBenefitListWithLocale"
            class="light-square-card__benefit-tag-field card-benefit-tag-field"
          >
            <div
              v-for="benefitLabelWithLocale,idx in benefitListWithLocale"
              :key="idx"
              class="light-square-card__benefit-tag-col"
            >
              <span class="light-square-card__benefit-tag">
                {{ benefitLabelWithLocale[language] }}
              </span> <!-- .light-square-card__benefit-tag -->
            </div> <!-- .light-square-card__benefit-tag-col -->
          </div> <!-- .light-square-card__benefit-tag-field -->

          <div class="light-square-card__meta-info-field card-meta-info-field">
            <div class="light-square-card__price-group-col card-price-group-col">
              <div
                v-if="hasBookingTypeLabel"
                class="booking-type"
              >
                {{ bookingTypeLabel }}
              </div> <!-- .booking-type -->
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
              <div class="select-room">
                <p>{{ $t("hotel_detail.detail_v4.select_room") }}</p>
              </div>
            </div> <!-- .light-square-card__price-group-col -->

            <div
              v-if="
                hasRating ||
                hasTotalReview
              "
              class="light-square-card__more-info card-more-info"
            >
              <div class="district-info">
                <template v-if="hasDistrictName">
                  <span class="district-label">
                    {{ districtName }}
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
            </div> <!-- .light-square-card__more-info -->
          </div> <!-- .light-square-card__meta-info-field -->
        </div> <!-- .light-square-card__body -->
      </component> <!-- .light-square-card -->
    </router-link>
  </div> <!-- .light-square-card-outer -->
</template>

<script>
  import { IMAGE_URL, CACHE_VERSION, HAS_MOITAI } from "~jsDefinePath/general";
  import { getRoomDetailPagePath } from "~jsHelperPath/util/HandleUrl";
  import { MIXIN_CONFIG as HOTEL_CARD_MIXIN_CONFIG } from "~jsPartialPath/global/mixin/HotelCardMixin";
  import { EVENT_BUS_KEY } from "~jsDefinePath/event-bus";

  export default {
    mixins: [HOTEL_CARD_MIXIN_CONFIG],

    props: {
      hotelInfoV4: {
        type: Object,
        default: new Object(),
      }, // hotelInfoV4
      isDefaultOvernightSpecial: Boolean,
      isOvernightSpecial: Boolean,
    },

    data() {
      return {
        HAS_MOITAI,
        IMAGE_URL,
        CACHE_VERSION,
        viewRoom: [],
      };
    },
    computed: {
      dataItem() {
        return this.hotelInfoV4;
      },
    },
    created() {
      this.viewRoom = this.info.roomViewList[0];
    },
    methods: {
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
      checkToNavigateCorrect(href) {
        if (!HAS_MOITAI) {
          EventBus.emit(EVENT_BUS_KEY.OPEN_MODAL_DIRECT_APP, true);
          return;
        }
        if (this.isValidToShow) {
          // if (this.isDefaultOvernightSpecial && this.isOvernightSpecial) {
          //   // đợi api, cần check phòng đó có bị disable đối với case tonight hay k, gửi qua kia
          //   //đọc lại câu trên thêm lần nữa đi ba
          //   // let isDisable = this.info && !this.info.availableTonight;
          //   this.$emit("bookOvernightSpecial");
          //   return;
          // }
          this.$router.push(href);
        }
      },
    },
  };
</script>
