<template>
  <div class="article-category-page" :key="reRenderCounter">
      <div class="article-category-banner" v-if="additionalData">
        <!-- <img :src="`${IMAGE_URL}/article/banner_category.png`" alt="time.svg" /> -->
        <g2j-image
          :url-img="`${ASSETS_SERVICE_URL}/${additionalData.imagePath}`"
        ></g2j-image>
        <div class="title-article-category-page">
          <h1 class="is-title-category">{{ additionalData.name }}</h1>
        </div>
      </div>
      <div class="article-category-breadcrumb container" v-if="additionalData">
        <div class="breadcrumb">
          <p>
            <span class="title-image">
              <!-- <i class="fas fa-home"></i> -->
              <img :src="`${IMAGE_URL}/article/icon_home.svg`" alt="icon_home.svg" />
            </span>
            <span><a class="title color-go2joy" href="/article">Home Article</a></span>
            <span class="icon-right"><i class="far fa-angle-right"></i></span>
            <span class="title">{{ additionalData.name }}</span>
          </p>
        </div>
      </div>
      <div class="article-category-list-item container">
        <div class="article-item" v-for="(article,idx) in articleListDisplay " :key="idx">
          <div class="article-item__image">
            <router-link
              :to="articleItemPath(article)['vi']">
              <g2j-image
                :url-img="`${ASSETS_SERVICE_URL}/${article.imagePath}`"
              ></g2j-image>
            </router-link>
            <div class="article-item__image--mobile">
              <div class="is-subcontent">
                <p>{{ article.subContent }}</p>
              </div>
              <div class="is-info">
                  <div class="note-more-block">
                    <img :src="`${IMAGE_URL}/article/time.svg`" alt="time.svg" />
                    <p class="time">
                      {{ article.createTime }}
                    </p>
                  </div>
              </div>
            </div>
          </div>

          <div class="article-item__content">
            <div class="is-title">
              <router-link
              :to="articleItemPath(article)['vi']">
                <h3>{{ article.title }}</h3>
              </router-link>
            </div>
            <div class="is-subcontent">
              <p>{{ article.subContent }}</p>
            </div>
            <div class="is-info">
                <div class="note-more-block">
                  <img :src="`${IMAGE_URL}/article/time.svg`" alt="time.svg" />
                  <p class="time">
                    {{ article.createTime }}
                  </p>
                </div>
            </div>
          </div>
        </div>

        <div
          class="infinite-loading-block"
          v-if="isShowInfiniteLoading"
        >
          <vue-infinite-loading
            :distance="500"
            :throttle-limit="100"
            spinner="circles"
            @infinite="infiniteHandler"
          >
            <div slot="no-more"></div>
            <div slot="no-results"></div>
          </vue-infinite-loading>
        </div> <!-- .infinite-loading-block -->
      </div>
    <TheFooterSectionv4></TheFooterSectionv4>
  </div>
  <!-- .article-detail-page -->
</template>

<script>
import { AJAX_URL } from "~jsDefinePath/ajax-url";
import { apiCaller } from "~jsHelperPath/service/ApiHandler";
import { IMAGE_URL } from "~jsDefinePath/general";
import { ASSETS_SERVICE_URL } from "~jsDefinePath/general";
import { EVENT_BUS_KEY } from "~jsDefinePath/event-bus";
import { EventBus } from "~jsHelperPath/service/EventBus";
import { getArticleDetailPath } from "~jsHelperPath/util/HandleUrl";
import {
  _
} from '~jsLibPath/lib-manager';
export default {
  components: {
    TheFooterSectionv4: () =>
      import("~jsPartialPath/global/TheFooterSectionv4.vue"),
      "g2j-image": () =>
      import("~jsPartialPath/global/component/g2j-img/Go2JoyImages.vue"),
      VueInfiniteLoading: window.VueInfiniteLoading.default,
  },
  data() {
    return {
      AJAX_URL,
      IMAGE_URL,
      ASSETS_SERVICE_URL,
      EVENT_BUS_KEY,
      ajaxArticleList: null,
      articleList: [],
      additionalData: null,
      id: "",
      curPage: 0,
      totalPage: 0,
      isFirstSetupData: true,
      reRenderCounter: 0,
    };
  },
  async created() {
    await this.getAjaxArticleList()
    setTimeout(() => {
      EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, false);
    },1000)
  },
  computed: {
    hasArticleList() {
      return !_.isEmpty(this.articleList);
    }, // hasArticleList()

    isShowInfiniteLoading() {
      return (
        this.hasArticleList &&
        (this.curPage < this.totalPage)

      );
    }, // isShowInfiniteLoading

    articleListDisplay(){
      return this.articleList
    }
  },
  methods: {
    infiniteHandler($state) {

      this.getAjaxArticleList($state);
    }, // infiniteHandler()

    articleItemPath(item) {

      return getArticleDetailPath(
        {
          title: `${this.removeAccents(item.slug ? item.slug : item.title).toLowerCase()}-${item.sn}`
        },
        {
        }
      );
    }, // articleItemPath

    cutHashTag(text) {
      if (!text) return;
      return text.replace(/#/g, "");
    },

    removeAccents(str) {
      return str.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D')
                .replace(/\s/g, "-");
    },

    cutString(stringTitle) {
      let arrayStrig = [];
      if (!stringTitle) {
        return "";
      } else {
        arrayStrig = stringTitle.split("|");
      }
      return arrayStrig;
    },

    formatDateTime(time) {
      if (!time) {
        return "";
      } else {
        return dayjs(time).format("MMM DD, YYYY");
      }
    },

    getAjaxArticleList(infiniteLoadingState = null) {
      if(this.ajaxArticleList) {
        return;
      }

      const self = this;
      let nextPage = 0;

      if(infiniteLoadingState) {
        nextPage = self.curPage + 1;
      } else {
        nextPage = 1;
      }
      const _objRequest = {
        categorySn: this.getSlugNoQueryString(),
        limit :5,
        page: nextPage,
      }
      self.ajaxArticleList = apiCaller({
        metaUrl: AJAX_URL.article.category,
        data: _objRequest,
        dataType: "json",
        method: "GET",
        error () {
          if(self.isFirstSetupData) {
            self.isFirstSetupData = false;
          }
          // NOTE - reset hotelList and isFilter flag when isFilter true
          self.articleList = [];
          self.isFilter = false;
          // NOTE - Stop infinite loading handler
          infiniteLoadingState?.loaded();
          self.ajaxArticleList = null;
        },

        success (objResponse) {
          if(
            _.isEmpty(objResponse) ||
            objResponse.error ||
            _.isEmpty(objResponse.data)
          ) {
            if(self.isFirstSetupData) {
              self.isFirstSetupData = false;
            }
            // NOTE - reset hotelList and isFilter flag when isFilter true
            self.articleList = [];
            self.isFilter = false;
            // NOTE - Stop infinite loading handlerinfiniteLoadingState);
            infiniteLoadingState?.loaded();

            self.ajaxArticleList = null;
            return;
          }
          self.additionalData = objResponse.data.additionalData;
          self.articleList = [...self.articleList,...objResponse.data.articleList]
          // NOTE - replace slug when edit url
          let slug = self.$route.path
          let getStringSlug = slug.split("/")
          let stringTitle = getStringSlug[getStringSlug.length - 1];
          let stringSlug = `${self.removeAccents(self.additionalData.name).toLowerCase()}-${self.additionalData.sn}`
          if(stringTitle !== stringSlug){
            self.$router.push({
              name: "article-category-page",
              params: { categoryName: stringSlug }
            });
          }
          // NOTE - update curPage and totalPage, handle infinite loading state
          self.totalPage = objResponse.data.meta.lastPage || 1;
          self.curPage = nextPage;
          if(self.curPage < self.totalPage) {
            infiniteLoadingState?.loaded();
          } else {
            infiniteLoadingState?.complete();
          }
          self.ajaxArticleList = null;
          if(!infiniteLoadingState) {
            self.reRenderCounter++;
          }

        },
      });

    }, // getAjaxHotelList()

    resetData() {
      this.articleList = [];
    },

    getSlugNoQueryString(){
      let slug = this.$route.path
      let stringTitle = slug.split("-");
      return stringTitle[stringTitle.length - 1]
    },
  },


};
</script>
<style src="./article-category-page-style.css"></style>
