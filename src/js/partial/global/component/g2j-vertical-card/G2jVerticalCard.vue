<template>
  <router-link
    v-if="isValidToShow || isDisableInvalid"
    :to="isValidToShow ? detailPathList[language] : ''"
    v-slot="{ href, navigate }"
  >
    <component
      :is="isValidToShow ? 'a' : 'div'"
      :href="isValidToShow ? href : undefined"
      @click="navigate"
      class="g2j-vertical-card vertical-card"
      :class="{
        'swiper-slide': isSlide,
      }"
      :style="isSlide && width ? `width:${width}px` : undefined"
    >
      <img
        v-if="hasImageUrl"
        :data-src="imageUrl"
        class="g2j-vertical-card__img lazyload"
        loading="lazy"
        :alt="title"

        data-sizes="auto"
        data-expand="-5"
        itemprop="photo"

        onerror="this.classList.add('is-image-error')"

        width="100%"
        height="100%"
      > <!-- .g2j-vertical-card__img -->

      <div class="g2j-vertical-card__content">
        <div
          v-if="info.isGo2Choice"
          class="g2j-vertical-card__tag card-tag"
        >
          <img
            :src="IMAGE_URL + '/svg/g2choice-arrow-tag.svg?v=' + CACHE_VERSION"
            alt="go2joychoice"
            class="tag-img"
            width="102"
            height="24"
          >
        </div> <!-- .g2j-vertical-card__tag -->

        <div class="g2j-vertical-card__meta-content-group">
          <div class="g2j-vertical-card__title">
            <h4
              v-if="hasTitle"
              class="g2j-vertical-card__title-label"
            >
              {{ title }}
            </h4> <!-- .g2j-vertical-card__title-label -->
          </div> <!-- .g2j-vertical-card__title -->

          <div class="g2j-vertical-card__more-info-field">
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
          </div> <!-- .g2j-vertical-card__more-info-field -->
        </div> <!-- .g2j-vertical-card__meta-content-group -->
      </div> <!-- .g2j-vertical-card__content -->
    </component> <!-- .g2j-vertical-card -->
  </router-link>
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
      CACHE_VERSION,
      IMAGE_URL,
    };
  },
}
</script>
