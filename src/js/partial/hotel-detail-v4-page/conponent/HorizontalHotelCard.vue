<template>
  <div
    v-if="isValidToShow || isDisableInvalid"
    class="horizontal-hotel-card-outer"
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
        class="horizontal-hotel-card horizontal-card"
      >
        <div class="horizontal-hotel-card__img-col card-img-col">
          <img
            v-if="hasImageUrl"
            :data-src="imageUrl"
            class="horizontal-hotel-card__img lazyload"
            loading="lazy"
            :alt="title"
            data-sizes="auto"
            data-expand="-5"
            itemprop="photo"
            onerror="this.classList.add('is-image-error')"
            width="100%"
            height="100%"
          > <!-- .horizontal-hotel-card__img -->

          <div
            v-if="info.isGo2Choice"
            class="horizontal-hotel-card__tag card-tag"
          >
            <img
              :src="IMAGE_URL + '/svg/g2choice-arrow-tag.svg?v=' + CACHE_VERSION"
              alt="go2joychoice"
              class="tag-img"
              width="85"
              height="20"
            >
          </div> <!-- .horizontal-hotel-card__tag -->

          <!--tet-label is-Tet -->
          <div
            v-if="info.isTet"
            class="horizontal-hotel-card__amenity-pack"
          >
            <g2j-image
              :urlImg="IMAGE_URL+'/svg/g2j_tet.svg'"
              :altImg="'tet-label'"
            >
            </g2j-image>
          </div>
          <div
            v-else-if="info.amenityPack"
            class="horizontal-hotel-card__amenity-pack"
          >
            <div class="horizontal-hotel-card__amenity-pack-head">
              <div class="horizontal-hotel-card__amenity-pack-img-outer">
                <img
                  :data-src="IMAGE_URL + '/amenity-update_30112021.png?v=' + CACHE_VERSION"
                  class="horizontal-hotel-card__amenity-pack-img lazyload"
                  loading="lazy"
                  :alt="title + ' amenity pack'"
                  data-sizes="auto"
                  data-expand="-5"
                  itemprop="photo"
                  onerror="this.classList.add('is-image-error')"
                  width="45"
                  height="45"
                >
              </div> <!-- .horizontal-hotel-card__amenity-pack-img-outer -->
            </div> <!-- .horizontal-hotel-card__amenity-pack-head -->
            <div class="horizontal-hotel-card__amenity-pack-body">
              <span class="horizontal-hotel-card__amenity-pack-title">
                {{ $t('common.amenity_pack') }}
              </span>
            </div> <!-- .horizontal-hotel-card__amenity-pack-body -->
          </div> <!-- .horizontal-hotel-card__amenity-pack -->
        </div> <!-- .horizontal-hotel-card__img-col -->

        <div class="horizontal-hotel-card__content-col card-content-col">
          <div
            v-if="info.hotHotel || info.newHotel"
            class="horizontal-hotel-card__tag-field card-tag-field"
          >
            <div
              v-if="info.newHotel"
              class="horizontal-hotel-card__tag card-tag --blue"
            >
              <img
                :src="IMAGE_URL + `/svg/new-tag--${ language }.svg`"
                :alt="$t('common.new')"
                class="tag-img"
                width="100%"
                height="100%"
              >
            </div> <!-- .horizontal-hotel-card__tag -->

            <div
              v-if="info.hotHotel"
              :key="language"
              class="horizontal-hotel-card__tag card-tag --red"
            >
              <img
                :src="IMAGE_URL + `/svg/hot-tag--${ language }.svg`"
                :alt="$t('common.hot')"
                class="tag-img"
                width="100%"
                height="100%"
              >
            </div> <!-- .horizontal-hotel-card__tag -->
          </div> <!-- .horizontal-hotel-card__tag-field -->

          <div
            v-if="hasTitle"
            class="horizontal-hotel-card__title card-title"
          >
            <h4 class="horizontal-hotel-card__title-label">
              {{ title }}
            </h4> <!-- .horizontal-hotel-card__title-label -->
          </div> <!-- .horizontal-hotel-card__title -->

          <div class="horizontal-hotel-card__price-group card-price-group">
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
          </div> <!-- .horizontal-hotel-card__price-group -->

          <div class="horizontal-hotel-card__meta-info-field card-meta-info-field">
            <div
              v-if="hasBenefitLabelWithLocale"
              class="horizontal-hotel-card__benefit-col card-benefit-col"
            >
              <span class="horizontal-hotel-card__benefit-tag">
                {{ benefitLabelWithLocale[language] }}
              </span>
            </div> <!-- horizontal-hotel-card__benefit-col -->

            <div
              v-if="
                hasRating ||
                hasTotalReview
              "
              class="horizontal-hotel-card__more-info-col"
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
            </div> <!-- .horizontal-hotel-card__more-info-col -->
          </div> <!-- .horizontal-hotel-card__meta-info-field -->
        </div> <!-- .horizontal-hotel-card__content-col -->
      </component> <!-- .horizontal-hotel-card -->
    </router-link>
  </div> <!-- .horizontal-hotel-card-outer -->
</template>

<script>
  import { IMAGE_URL, CACHE_VERSION } from "~jsDefinePath/general";
  import { MIXIN_CONFIG as HOTEL_CARD_MIXIN_CONFIG } from "~jsPartialPath/global/mixin/HotelCardMixin";

  export default {
    mixins: [HOTEL_CARD_MIXIN_CONFIG],

    data() {
      return {
        IMAGE_URL,
        CACHE_VERSION,
      };
    },
    methods: {},
  };
</script>
