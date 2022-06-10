<template>
  <div
    v-if="isValidToShow || isDisableInvalid"
    class="g2j-dark-square-card-outer"
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
        @click="navigate"
        class="g2j-dark-square-card dark-square-card"
      >
        <img
          v-if="hasImageUrl"
          :data-src="imageUrl"
          class="g2j-dark-square-card__img lazyload"
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
          v-if="info.isTet"
          class="g2j-dark-square-card__tet-label-marker"
        >
          <div class="g2j-dark-square-card__tet-label-marker-head">
            <img
              :data-src="IMAGE_URL + '/svg/joy-tet.svg?v=' + CACHE_VERSION"
              class="g2j-dark-square-card__tet-label-marker-img lazyload"
              loading="lazy"
              :alt="title + ' ' + $t('common.joy_tet')"

              data-sizes="auto"
              data-expand="-5"
              itemprop="photo"

              onerror="this.classList.add('is-image-error')"

              width="35"
              height="35"
            >
          </div> <!-- .g2j-dark-square-card__tet-label-marker-head -->

          <div class="g2j-dark-square-card__tet-label-marker-body">
            <span class="g2j-dark-square-card__tet-label-marker-title">
              {{ $t('common.joy_tet') }}
            </span>
          </div> <!-- .g2j-dark-square-card__tet-label-marker-body -->
        </div> <!-- .g2j-dark-square-card__tet-label-marker -->
        <div
          v-else-if="info.amenityPack"
          class="g2j-dark-square-card__amenity-pack"
        >
          <div class="g2j-dark-square-card__amenity-pack-head">
            <div class="g2j-dark-square-card__amenity-pack-img-outer">
              <img
                :data-src="IMAGE_URL + '/amenity-update_30112021.png?v=' + CACHE_VERSION"
                class="g2j-dark-square-card__amenity-pack-img lazyload"
                loading="lazy"
                :alt="title + ' amenity pack'"

                data-sizes="auto"
                data-expand="-5"
                itemprop="photo"

                onerror="this.classList.add('is-image-error')"

                width="45"
                height="45"
              >
            </div> <!-- .g2j-dark-square-card__amenity-pack-img-outer -->
          </div> <!-- .g2j-dark-square-card__amenity-pack-head -->
          <div class="g2j-dark-square-card__amenity-pack-body">
            <span class="g2j-dark-square-card__amenity-pack-title">
              {{ $t('common.amenity_pack') }}
            </span>
          </div> <!-- .g2j-dark-square-card__amenity-pack-body -->
        </div> <!-- .g2j-dark-square-card__amenity-pack -->

        <div class="g2j-dark-square-card__content">
          <div class="g2j-dark-square-card__tag-field card-tag-field">
            <div
              v-if="info.isGo2Choice"
              class="g2j-dark-square-card__tag card-tag --orange-gradient"
            >
              <img
                :src="IMAGE_URL + '/g2choice-rectangular-tag.jpg?v=' + CACHE_VERSION"
                alt="go2joychoice"
                class="tag-img"
                width="82"
                height="20"
              >
            </div> <!-- .g2j-dark-square-card__tag -->

            <div
              v-if="info.newHotel"
              class="g2j-dark-square-card__tag card-tag --blue"
            >
              <img
                :src="IMAGE_URL + `/svg/new-tag--${ language }.svg`"
                :alt="$t('common.new')"
                class="tag-img"
                width="100%"
                height="100%"
              >
            </div> <!-- .g2j-dark-square-card__tag -->

            <div
              v-if="info.hotHotel"
              class="g2j-dark-square-card__tag card-tag --red"
            >
              <img
                :src="IMAGE_URL + `/svg/hot-tag--${ language }.svg`"
                :alt="$t('common.hot')"
                class="tag-img"
                width="100%"
                height="100%"
              >
            </div> <!-- .g2j-dark-square-card__tag -->
          </div> <!-- .g2j-dark-square-card__tag-field -->

          <div
            v-if="hasTitle"
            class="g2j-dark-square-card__title card-title"
          >
            <h4 class="g2j-dark-square-card__title-label card-title-label">
              {{ title }}
            </h4>
          </div> <!-- .g2j-dark-square-card__title -->

          <div
            v-if="hasBenefitListWithLocale"
            class="g2j-dark-square-card__benefit-tag-field card-benefit-tag-field"
          >
            <div
              v-for="benefitLabelWithLocale,idx in benefitListWithLocale"
              :key="idx"
              class="g2j-dark-square-card__benefit-tag-col"
            >
              <span class="g2j-dark-square-card__benefit-tag">
                {{ benefitLabelWithLocale[language] }}
              </span> <!-- .g2j-dark-square-card__benefit-tag -->
            </div> <!-- .g2j-dark-square-card__benefit-tag-col -->
          </div> <!-- .g2j-dark-square-card__benefit-tag-field -->

          <div class="g2j-dark-square-card__meta-info-field card-meta-info-field">
            <div class="g2j-dark-square-card__price-group-col card-price-group-col">
              <div
                v-if="hasBookingTypeLabel"
                class="booking-type"
              >
                {{ bookingTypeLabel }}
              </div> <!-- .booking-type -->
              <div class="price-group">
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
            </div> <!-- .g2j-dark-square-card__price-group-col -->

            <div
              v-if="
                hasRating ||
                hasTotalReview
              "
              class="g2j-dark-square-card__more-info card-more-info"
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
                <span class="icon-shape">
                  <i class="fas fa-star"></i>
                </span>

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
              </div> <!-- .rating-info -->
            </div> <!-- .g2j-dark-square-card__more-info -->
          </div> <!-- .g2j-dark-square-card__meta-info-field -->
        </div> <!-- .g2j-dark-square-card__content -->
      </component> <!-- .g2j-dark-square-card -->
    </router-link>
  </div> <!-- .g2j-dark-square-card-outer -->
</template>

<script>
import {
  IMAGE_URL,
  CACHE_VERSION,
} from '~jsDefinePath/general';
import {
  MIXIN_CONFIG as HOTEL_CARD_MIXIN_CONFIG,
} from '~jsPartialPath/global/mixin/HotelCardMixin';
export default {
  mixins: [
    HOTEL_CARD_MIXIN_CONFIG,
  ],

  data() {
    return {
      IMAGE_URL,
      CACHE_VERSION,
    }
  },
}
</script>
