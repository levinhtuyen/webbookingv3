<template>
  <router-link
    v-if="isValidToShow"
    :to="detailPathList[language]"
    v-slot="{ href, navigate }"
  >
    <a
      class="g2j-promotion-card"
      :class="{
        'swiper-slide': isSlide,
      }"
      :href="href"
      :style="`width:${width}px`"
      @click="navigate"
    >
      <img
        v-if="hasImageUrl"
        :data-src="imageUrl"
        class="g2j-promotion-card__img lazyload"
        loading="lazy"
        alt="go2joy promotion"

        data-sizes="auto"
        data-expand="-5"
        itemprop="photo"

        onerror="this.classList.add('is-image-error')"

        width="100%"
        height="100%"
      >
    </a> <!-- .g2j-promotion-card -->
  </router-link>
</template>

<script>
import {
  _,
  mapState,
} from '~jsLibPath/lib-manager';
import {
  getPromotionDetailPath,
} from '~jsHelperPath/util/HandleUrl';
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
} from '~jsBasePath/vuex/modules/page-info-module';

export default {
  props: {
    isSlide: {
      default: false,
      type: Boolean,
    }, // isSlide

    info: {
      default: {},
      type: new Object,
    }, // info

    width: {
      default: 216,
      type: Number,
    }, // width
  },

  data() {
    return {
      detailPathList: {},
      imageUrl: '',

      hasInfo: false,
      hasDetailPathList: false,
      hasImageUrl: false,
    }
  },

  computed: {
    ...mapState(PAGE_INFO_MODULE_NAME, [
      'language',
    ]),

    isValidToShow() {
      return (
        this.hasInfo &&
        this.hasDetailPathList
      );
    }, // isValidToShow
  },

  created() {
    const self = this;

    self.hasInfo = !_.isEmpty(self.info);

    self.setupData();
    self.checkDataExist();
  },

  mounted() {
    const self = this;

    self.$emit('mounted', {
      is_valid: self.isValidToShow,
      is_finish_render_list: (self.info.order === self.info.total),
      info: self.info,
    });
  },

  methods: {
    setupData() {
      this.detailPathList = this.generateDetailPathList();
      this.imageUrl = this.generateImageUrl();
    }, // setupData()

    checkDataExist() {
      this.hasDetailPathList = !_.isEmpty(this.detailPathList);
      this.hasImageUrl = !_.isEmpty(this.imageUrl);
    }, // checkDataExist()

    generateDetailPathList() {
      if(
        !this.hasInfo ||
        typeof this.info.sn !== 'number'
      ) {
        return {}
      }

      return getPromotionDetailPath(
        {
          promotionName: this.info.sn,
        },
        {
          sn: this.info.sn,
        }
      );
    }, // generateDetailPathList()

    generateImageUrl() {
      if(!this.hasInfo) {
        return '';
      }

      return (this.$assetsServiceUrl || '') + '/' + this.info.imagePath;
    }, // generateImageUrl()
  },
}
</script>
