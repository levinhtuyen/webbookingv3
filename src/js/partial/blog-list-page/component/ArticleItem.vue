<template>
    <div class="article-section-list__item">
        <template>
            <div class="article-section-list__item--image" v-if="!isEmpty(dataArticle)">
            <!-- <router-link :to="checkAction(promotion)"> -->
                <router-link :to="articleItemPath[language]">
                     <!-- <img
                    :src="IMAGE_URL + '/g2j-lazy-loading--sm.png?v=' + CACHE_VERSION"
                    :data-src="`${ASSETS_SERVICE_URL}/${dataArticle.imagePath}`"
                    :alt="dataArticle.name"
                    width="100%"
                    height="100%"
                    class="g2j-hotel-product-card-horizontal__img lazyload"
                    :onerror="`this.src='${IMAGE_URL}/g2j-lazy-loading--sm.png?v=${CACHE_VERSION}'`"
                    > -->

                    <g2j-image
                    :url-img="`${ASSETS_SERVICE_URL}/${dataArticle.imagePath}`"
                    ></g2j-image>
                </router-link>
            </div>
            <div class="article-section-list__item--title">
                <div class="article-section-limit-title">
                  {{ dataArticle.title }}
                </div>
            </div>
        </template>

    </div>
</template>

<script>
import {
  IMAGE_URL,
  CACHE_VERSION,
  ASSETS_SERVICE_URL,
} from '~jsDefinePath/general';
import {
  _,
  mapState,
} from '~jsLibPath/lib-manager';
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
} from '~jsBasePath/vuex/modules/page-info-module';
import {
  getBlogDetailPagePath,
} from '~jsHelperPath/util/HandleUrl';

export default {
    props: {
        dataArticle: [Object, Array]
    },
    name: "TheArticleItem",
    data () {
        return {
            IMAGE_URL,
            CACHE_VERSION,
            ASSETS_SERVICE_URL,

        }
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: 'language',
      }),

      articleItemPath() {
        return getBlogDetailPagePath(
          {
            blogName: GetSlug(this.dataArticle.title)
          },
          {
            blogSn: this.dataArticle.sn,
          }
        );
      }, // articleItemPath
    },
    created () {
        console.log('ASSETS_SERVICE_URL :>> ', ASSETS_SERVICE_URL);
    },
    methods: {
        isEmpty: _.isEmpty,
        getIdForString (string) {
            var tabId = string.split("-").pop()
            return Number(tabId)
        },// getIdForString()

        getTitleGallery (obj) {
            var str;
            str = obj.title;
            str = str.toLowerCase();
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            str = str.replace(/đ/g, "d");
            //str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-");
            /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
            //str= str.replace(/-+-/g,"-"); //thay thế 2- thành 1-
            str = str.replace(/^\-+|\-+$/g, "");
            //cắt bỏ ký tự - ở đầu và cuối chuỗi
            let stringTitle = str.split(' ')
            stringTitle = stringTitle.join('-')
            stringTitle = stringTitle + `-${obj.sn}`
            return stringTitle
        },// getTitleGallery()
    },
}
</script>
