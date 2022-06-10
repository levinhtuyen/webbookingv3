<template>
  <a
    v-if="this.isValidToShow"
    class="g2j-article-card"
    target="_blank"
    :class="{
      'swiper-slide': isSlide,
    }"
    :href="detailPathList.default"
    :style="`width:${width}px`"
  >
    <div class="g2j-article-card__img-outer">
      <img
        v-if="hasImageUrl"
        :data-src="imageUrl"
        class="g2j-article-card__img lazyload"
        loading="lazy"
        alt="go2joy article"

        data-sizes="auto"
        data-expand="-5"
        itemprop="photo"

        onerror="this.classList.add('is-image-error')"

        width="100%"
        height="100%"
      >
    </div> <!-- .g2j-article-card__img-outer -->

    <div
      v-if="hasHashTag"
      class="g2j-article-card__hash-tag-field"
    >
      <div class="hash-tag">
        <span class="hash-tag-label">
          {{ hashTag }}
        </span>
      </div> <!-- .hash-tag -->
    </div> <!-- .g2j-article-card__hash-tag-field -->

    <div
      v-if="hasTitle"
      class="g2j-article-card__title"
    >
      <h4 class="g2j-article-card__title-label">
        {{ title }}
      </h4> <!-- .g2j-article-card__title-label -->
    </div> <!-- .g2j-article-card__title -->
  </a> <!-- .g2j-article-card -->
</template>

<script>
import {
  _,
} from '~jsLibPath/lib-manager';
import {
  getArticleDetailPath,
} from '~jsHelperPath/util/HandleUrl';

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
      title: {},

      hasInfo: false,
      hasDetailPathList: false,
      hasImageUrl: false,
      hasTitle: false,
      hasHashTag: false,
    }
  },

  computed: {
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
      this.title = this.generateTitle();
      this.hashTag = this.generateHashTag();
    }, // setupData()

    checkDataExist() {
      this.hasDetailPathList = !_.isEmpty(this.detailPathList);
      this.hasImageUrl = !_.isEmpty(this.imageUrl);
      this.hasTitle = !_.isEmpty(this.title);
      this.hasHashTag = !_.isEmpty(this.hashTag);
    }, // checkDataExist()

    generateDetailPathList() {
      if(!this.hasInfo) {
        return {};
      }

      const tmpSlug = (
        !_.isEmpty(this.info.slug) ?
          this.info.slug.trim() :
        !_.isEmpty(this.info.title) ?
          GetSlug(this.info.title) :
          ''
      );

      if(_.isEmpty(tmpSlug)) {
        return {};
      }

      return getArticleDetailPath(
        {
          title: tmpSlug + '-' + this.info.sn,
        },
        {
          articleSn: this.info.sn,
          categorySn: this.info.categorySn,
        }
      );
    }, // generateDetailPathList()

    generateImageUrl() {
      if(
        !this.hasInfo ||
        _.isEmpty(this.info.imagePath)
      ) {
        return '';
      }

      return (this.$assetsServiceUrl || '') + '/' + this.info.imagePath;
    }, // generateImageUrl()

    generateTitle() {
      if(
        !this.hasInfo ||
        _.isEmpty(this.info.title)
      ) {
        return {};
      }

      return he.decode(this.info.title).trim();
    }, // generateTitle()

    generateHashTag() {
      if(
        !this.hasInfo ||
        _.isEmpty(this.info.hashtag)
      ) {
        return '';
      }

      return he.decode(this.info.hashtag).trim();
    }, // generateHashTag()
  },
}
</script>
