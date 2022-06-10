<template>
  <div class="article-detail-page">
    <section class="article-detail-section">
      <div class="container">
        <div class="article-detail-block">
          <!-- <TheGo2JoyBackComponent ></TheGo2JoyBackComponent> -->
          <div class="article-detail-page__content" v-if="!isEmpty(dataArticleDetail)">
              <div class="article-detail-page__content--date-time">
                  <div class="date-time"><span>{{ formatDate(dataArticleDetail.createTime)}}</span> </div>
                  <div class="time-ago">
                      <ul>
                          <li>
                              <span>{{ getTime(dataArticleDetail.createTime) }}</span>
                          </li>
                      </ul>
                  </div>
              </div>
              <div class="article-detail-page__content--title">
                  <div class="content-title">
                      {{ dataArticleDetail.title }}
                  </div>
              </div>
              <div class="article-detail-page__content--image">
                  <!-- <img
                  :src="IMAGE_URL + '/g2j-lazy-loading--sm.png?v=' + CACHE_VERSION"
                  :data-src="ASSETS_SERVICE_URL + '/' + dataArticleDetail.imagePath"
                  :alt="dataArticleDetail.title"
                  width="100%"
                  height="100%"
                  class="g2j-hotel-product-card-horizontal__img"
                  :class="lazyloadClass"
                  > -->
                  <g2j-image
                    :url-img="`${ASSETS_SERVICE_URL}/${dataArticleDetail.imagePath}`"
                  ></g2j-image>
              </div>
              <div class="article-detail-page__content--sub">
                  <div class="content-sub">
                      {{ dataArticleDetail.subContent}}
                  </div>
              </div>
              <div class="article-detail-page__content--content">
                  <div class="content-content" v-html="dataArticleDetail.content">
                  </div>
              </div>
          </div>
          <div class="article-detail-page__share">
              <div class="article-detail-page__share--container-button">
                <button class="button-share-facebook">
                  <a class="text-icon-facebook" :href="`https://www.facebook.com/sharer/sharer.php?u=http://go2joy.vn/#${this.$route.fullPath}`">
                      <i class="fab fa-facebook-square fa-x icon-facebook"></i>
                      <span>{{ $t('blog-detail.share-on-facebook') }}</span>
                  </a>
                </button>
                <button class="button-share-twitter">
                  <a class="text-icon-twitter" :href="`https://twitter.com/intent/tweet?url=http://go2joy.vn`+this.$route.fullPath">
                      <i class="fab fa-twitter fa-x icon-facebook"></i>
                      <span>{{ $t('blog-detail.share-on-twitter') }}</span>
                  </a>
                </button>
                <button
                  class="button-copy"
                  @click="handleCopyLink()"
                ><i class="fas fa-share-alt"></i></button>
              </div>
          </div>
          <div class="article-detail-page__category">
              <div class="title-category">
                  <p>{{ $t('blog-detail.go2joy_gallery')}}</p>
                  <div class="title-category__border"></div>
              </div>
              <TheArticleList
                :key="$route.query.blogSn"
              />
          </div>
        </div> <!-- .article-detail-block -->
      </div>
    </section> <!-- .article-detail-section -->

    <TheFooterSection />
  </div> <!-- .article-detail-page -->
</template>

<script>
import {
  IMAGE_URL,
  CACHE_VERSION,
  ASSETS_SERVICE_URL,
} from '~jsDefinePath/general';
import {
  _
} from '~jsLibPath/lib-manager';
import { apiCaller } from '~jsHelperPath/service/ApiHandler';
import {
  getToken,
} from "~jsDefinePath/general";
import {
  AJAX_URL
} from '~jsDefinePath/ajax-url';
// import TheGo2JoyBackComponent from '../global/component/go2joy-back/TheGo2JoyBack.vue'
import TheArticleList from './component/TheArticleIList.vue';
import TheFooterSection from '~jsPartialPath/global/TheFooterSection.vue';

export default {
    name: "TheArticleDetailPage",
    components: {
        // TheGo2JoyBackComponent,
        TheArticleList,
        TheFooterSection,
    },
    data () {
        return {
            IMAGE_URL,
            CACHE_VERSION,
            ASSETS_SERVICE_URL,
            sn: this.$route.query.blogSn ? this.$route.query.blogSn : '1',
            dataArticleDetail: []
        }
    },

    created () {
        this.id = this.$route.query.blogSn;
        this.getDataHotelDetail()

        if(
          window.dayjs &&
          window.dayjs_plugin_relativeTime
        ) {
          dayjs.extend(dayjs_plugin_relativeTime);
        }
    },
    watch: {
      '$route.query.blogSn': function(newBlogSn, oldBlogSn) {
        if(newBlogSn !== oldBlogSn) {
          this.id = newBlogSn;
          this.getDataHotelDetail();
        }
      }
    },

    methods: {
        isEmpty: _.isEmpty,
        getDataHotelDetail() {
            let self = this
            EventBus.emit('IS_SHOW_ROUTER_LOADING', {
              'extend_class': 'is-fill',
              'is_show': true,
            });
            apiCaller({
                metaUrl: AJAX_URL.blog.blogDetail,
                dataType: "json",
                type: "GET",
                headers: {
                  Authorization: getToken(),
                },
                data: {
                  sn: self.id
                },
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    let data = result.data
                    self.dataArticleDetail = data
                    EventBus.emit('IS_SHOW_ROUTER_LOADING', false);
                },
                error: function (error) {
                    console.log('error :>> ', error);
                }

            });

        },// getDataHotelDetail()

        getTime (time) {
            let now = new Date()
            return dayjs(time).fromNow();
        },// getTime()

        formatDate (date) {
            // let CDate = this.$formatTime(date,'name')
            let CDate = dayjs(date).format('MMM DD, YYYY')
            return CDate

        },// formatDate()

        handleCopyLink () {
            let text = window.location.href
            this.copyToClipboard(text)

        },// handleCopyLink()

        copyToClipboard(textToCopy) {
        // navigator clipboard api needs a secure context (https)
          if (navigator.clipboard && window.isSecureContext) {
              // navigator clipboard api method'
              return navigator.clipboard.writeText(textToCopy);
          } else {
              // text area method
              let textArea = document.createElement("textarea");
              textArea.value = textToCopy;
              // make the textarea out of viewport
              textArea.style.position = "fixed";
              textArea.style.left = "-999999px";
              textArea.style.top = "-999999px";
              document.body.appendChild(textArea);
              textArea.focus();
              textArea.select();
              return new Promise((res, rej) => {
                  // here the magic happens
                  document.execCommand('copy') ? res() : rej();
                  textArea.remove();
              });
          }
        },//copyToClipboard
    },
}
</script>
<style src="./blog-detail-page-style.css"></style>
