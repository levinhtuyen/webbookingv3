<template>
  <div
    v-if="isValidToShow || isDisableInvalid"
    class="g2j-horizontal-card-outer"
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
        class="g2j-horizontal-card horizontal-card"
      >
        <div class="g2j-horizontal-card__img-col card-img-col">
          <img
            v-if="hasImageUrl"
            :data-src="imageUrl"
            class="g2j-horizontal-card__img lazyload"
            loading="lazy"
            :alt="title"

            data-sizes="auto"
            data-expand="-5"
            itemprop="photo"

            onerror="this.classList.add('is-image-error')"

            width="100%"
            height="100%"
          > <!-- .g2j-horizontal-card__img -->

          <div
            v-if="info.isGo2Choice"
            class="g2j-horizontal-card__tag card-tag"
          >
            <img
              :src="IMAGE_URL + '/svg/g2choice-arrow-tag.svg?v=' + CACHE_VERSION"
              alt="go2joychoice"
              class="tag-img"
              width="85"
              height="20"
            >
          </div> <!-- .g2j-horizontal-card__tag -->

          <div
            v-if="info.isTet"
            class="g2j-horizontal-card__tet-label-marker"
          >
            <div class="g2j-horizontal-card__tet-label-marker-head">
              <img
                :data-src="IMAGE_URL + '/svg/joy-tet.svg?v=' + CACHE_VERSION"
                class="g2j-horizontal-card__tet-label-marker-img lazyload"
                loading="lazy"
                :alt="title + ' ' + $t('common.joy_tet')"

                data-sizes="auto"
                data-expand="-5"
                itemprop="photo"

                onerror="this.classList.add('is-image-error')"

                width="35"
                height="35"
              >
            </div> <!-- .g2j-horizontal-card__tet-label-marker-head -->

            <div class="g2j-horizontal-card__tet-label-marker-body">
              <span class="g2j-horizontal-card__tet-label-marker-title">
                {{ $t('common.joy_tet') }}
              </span>
            </div> <!-- .g2j-horizontal-card__tet-label-marker-body -->
          </div> <!-- .g2j-horizontal-card__tet-label-marker -->
          <div
            v-else-if="info.amenityPack"
            class="g2j-horizontal-card__amenity-pack"
          >
            <div class="g2j-horizontal-card__amenity-pack-head">
              <div class="g2j-horizontal-card__amenity-pack-img-outer">
                <img
                  :data-src="IMAGE_URL + '/amenity-update_30112021.png?v=' + CACHE_VERSION"
                  class="g2j-horizontal-card__amenity-pack-img lazyload"
                  loading="lazy"
                  :alt="title + ' amenity pack'"

                  data-sizes="auto"
                  data-expand="-5"
                  itemprop="photo"

                  onerror="this.classList.add('is-image-error')"

                  width="45"
                  height="45"
                >
              </div> <!-- .g2j-horizontal-card__amenity-pack-img-outer -->
            </div> <!-- .g2j-horizontal-card__amenity-pack-head -->
            <div class="g2j-horizontal-card__amenity-pack-body">
              <span class="g2j-horizontal-card__amenity-pack-title">
                {{ $t('common.amenity_pack') }}
              </span>
            </div> <!-- .g2j-horizontal-card__amenity-pack-body -->
          </div> <!-- .g2j-horizontal-card__amenity-pack -->
        </div> <!-- .g2j-horizontal-card__img-col -->

        <div class="g2j-horizontal-card__content-col card-content-col">
          <div
            v-if="info.hotHotel || info.newHotel"
            class="g2j-horizontal-card__tag-field card-tag-field"
          >
            <div
              v-if="info.newHotel"
              class="g2j-horizontal-card__tag card-tag --blue"
            >
              <img
                :src="IMAGE_URL + `/svg/new-tag--${ language }.svg`"
                :alt="$t('common.new')"
                class="tag-img"
                width="100%"
                height="100%"
              >
            </div> <!-- .g2j-horizontal-card__tag -->

            <div
              v-if="info.hotHotel"
              class="g2j-horizontal-card__tag card-tag --red"
            >
              <img
                :src="IMAGE_URL + `/svg/hot-tag--${ language }.svg`"
                :alt="$t('common.hot')"
                class="tag-img"
                width="100%"
                height="100%"
              >
            </div> <!-- .g2j-horizontal-card__tag -->
          </div> <!-- .g2j-horizontal-card__tag-field -->

          <div
            v-if="hasTitle"
            class="g2j-horizontal-card__title card-title"
          >
            <h4 class="g2j-horizontal-card__title-label">
              {{ title }}
            </h4> <!-- .g2j-horizontal-card__title-label -->
          </div> <!-- .g2j-horizontal-card__title -->

          <div class="g2j-horizontal-card__price-group card-price-group">
            <div
              v-if="hasOldPrice"
              class="old-price"
              v-html="oldPrice"
            >
            </div> <!-- .old-price -->
            <div
              v-else
              class="old-price"
            >
            </div> <!-- .old-price -->

            <div
              v-if="hasCurPrice"
              class="cur-price"
              v-html="curPrice"
            >
            </div> <!-- .cur-price -->
            <div
              v-else
              class="cur-price"
            >
            </div> <!-- .cur-price -->
          </div> <!-- .g2j-horizontal-card__price-group -->

          <div class="g2j-horizontal-card__meta-info-field card-meta-info-field">
            <div
              v-if="hasBenefitLabelWithLocale"
              class="g2j-horizontal-card__benefit-col card-benefit-col"
            >
              <span class="g2j-horizontal-card__benefit-tag">
                {{ benefitLabelWithLocale[language] }}
              </span>
            </div> <!-- g2j-horizontal-card__benefit-col -->

            <div
              v-if="
                hasRating ||
                hasTotalReview
              "
              class="g2j-horizontal-card__more-info-col"
            >
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
            </div> <!-- .g2j-horizontal-card__more-info-col -->
          </div> <!-- .g2j-horizontal-card__meta-info-field -->
        </div> <!-- .g2j-horizontal-card__content-col -->
      </component> <!-- .g2j-horizontal-card -->
    </router-link>
  </div> <!-- .g2j-horizontal-card-outer -->
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
