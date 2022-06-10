<template>
  <div class="g2j-card">
    <div class="g2j-card-label">
      <div class="g2j-card-label__item is-hot" v-if="hotelHot">
        <span>{{ $t("hotel_detail.detail_v4.hot") }}</span>
      </div>
      <div class="g2j-card-label__item is-new" v-if="hotelNew">
        <span>{{ $t("hotel_detail.detail_v4.new") }}</span>
      </div>

      <div
        v-if="hasAccommodation"
        class="g2j-card-label__accommondation-tag"
      >
        {{ accommodationLabelWithLocale[language] }}
      </div>
    </div>
  </div>
</template>

<script>
import {
  _,
  he,
  mapState,
} from '~jsLibPath/lib-manager';
import {
  LANGUAGE_VALID,
} from '~jsDefinePath/general';
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
} from '~jsBasePath/vuex/modules/page-info-module';

export default {
  props: {
    hotHotel: {
      type: Number,
      default: "",
    }, // hotHotel

    newHotel: {
      type: Number,
      default: "",
    }, // newHotel

    accommodation: {
      type: String,
      default: '',
    }, // accommodation
  },

  data() {
    return {
      accommodationLabelWithLocale: {},
      hasAccommodation: false,
    };
  },

  computed: {
    ...mapState(PAGE_INFO_MODULE_NAME, [
      'language',
    ]),

    hotelHot() {
      return this.hotHotel;
    },
    hotelNew() {
      return this.newHotel;
    },
  },

  created() {
    this.accommodationLabelWithLocale = this.generateAccommodationLabelWithLocale();

    this.hasAccommodation = !_.isEmpty(this.accommodationLabelWithLocale);
  },

  methods: {
    generateAccommodationLabelWithLocale() {
      // NOTE - Case 1
      // NOTE - If the title is not string of type or if it's string of type and trim() of it is empty -> return {} empty
      if(
        typeof this.accommodation !== 'string' ||
        !this.accommodation.trim()
      ) {
        return {};
      }

      // NOTE - Case 2
      // NOTE - If pass case 1, we will split the title and check condition on it
      const titleSplitted = this.accommodation.split('|');

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
    }, // generateAccommodationLabelWithLocale()
  },
};
</script>

<style>
</style>
