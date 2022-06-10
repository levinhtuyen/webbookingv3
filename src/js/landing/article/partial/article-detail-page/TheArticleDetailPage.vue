<template>
  <div class="article-detail-page" v-if="dataDetail">
    <div class="article-detail-page__banner">
      <div class="banner-image">
        <g2j-image
          :url-img="`${ASSETS_SERVICE_URL}/${dataDetail.imagePath}`"
        ></g2j-image>
        <div class="banner-background"></div>
        <div class="banner-title">
          <h1>
            {{ dataDetail.title }}
          </h1>
        </div>
      </div>
    </div>
    <div class="article-detail-content-page">
      <div class="article-detail-content-page__breadcrumb">
        <div class="breadcrumb">
          <p>
            <span class="title-image">
              <!-- <i class="fas fa-home"></i> -->
              <img :src="`${IMAGE_URL}/article/icon_home.svg`" alt="icon_home.svg" />
            </span>
            <span><a class="title" href="/article">Home Article</a></span>
            <span class="icon-right"><i class="far fa-angle-right"></i></span>
            <span class="title">
              <router-link
                  :to="articleCategoryItemPath(dataGet).default"
                  >{{ nameCategory }}
              </router-link>
            </span>
            <span class="icon-right"><i class="far fa-angle-right"></i></span>
            <span class="title-detail">{{ dataDetail.title }}</span>
          </p>
        </div>
      </div>
      <div class="article-detail-content-page__action-button">
        <div class="acton-button">
          <div class="hastag" v-if="dataGet.hashtag">
            <router-link
              :to="articleCategoryItemPath(dataGet).default"
              >
              <p>{{ dataGet.hashtag }}</p>
            </router-link>
          </div>
          <div class="button-share">
            <button class="button-share-facebook">
              <a
                target="_blank"
                :href="`https://www.facebook.com/sharer/sharer.php?u=http://go2joy.vn/${this.$route.fullPath}`"
                class="text-icon-facebook"
              >
                <span><i class="fab fa-facebook"></i> Share on Facebook</span>
              </a>
            </button>
            <button title="Share" @click="handleCopyLink()" class="button-copy">
              <i class="fas fa-share-alt"></i>
            </button>
          </div>
        </div>
        <div class="info-detail">
          <div class="note-more-block" v-if="dataDetail.author">
            <p class="by-admin">
              {{ $t("common.by") }}
              <span class="color-go2joy style-bold">{{ dataDetail.author }}</span>
            </p>
          </div>
          <div class="note-more-block">
            <img :src="`${IMAGE_URL}/article/time.svg`" alt="" />
            <p class="time">{{ formatDateTime(dataDetail.createTime) }}</p>
          </div>
          <!-- <div class="note-more-block">
            <img :src="`${IMAGE_URL}/article/union.svg1`" alt="" />
            <p class="view">
              {{ dataDetail.numberOfView }} {{ $t("common.views") }}
            </p>
          </div> -->
        </div>
      </div>
      <!-- <div class="article-detail-content-page__short-content">
        <p class="content">{{ dataDetail.subContent }}</p>
      </div> -->
      <div class="article-detail-content-page__content">

        <p class="content" v-html="dataDetail.content"></p>
        <div v-if="dataDetail.schema" v-html="dataDetail.schema"></div>
      </div>
      <div
        v-if="!!dataGetList.length"
        class="article-detail-content-page__related-posts"
      >
        <div class="related-posts">
          <div class="related-posts__topic" :class="dataGetList.length <= 3 ? 'topic-100' : ''">
            <div class="related-posts__topic--title">
              <div>
                <span class="border-color-FF6400">Related</span>
                <span class="color-go2joy">Posts</span>
              </div>
            </div>
            <div class="related-posts__topic--list-button" v-show="dataGetList.length > 3">
              <div class="button related-posts-button-prev">
                <i class="fas fa-arrow-left"></i>
              </div>
              <div class="button related-posts-button-next">
                <i class="fas fa-arrow-right"></i>
              </div>
            </div>
          </div>
          <div class="related-posts__slide">
            <g2j-swiper-component
              v-if="!!dataGetList.length"
              :name="'related-posts'"
              :is-check-button="true"
              :data.sync="dataGetList"
              :breakpoints="breakpoints"
              :option-more="{

              }"

            >
              <template slot-scope="slotProps">
                <div class="slide-item">
                  <div class="slide-item__image">
                    <router-link
                      :to="articleItemPath(slotProps.item, displayTypeSn,).default"
                    >
                      <g2j-image
                        :url-img="`${ASSETS_SERVICE_URL}/${slotProps.item.imagePath}`"
                      ></g2j-image>
                    </router-link>
                  </div>
                  <div class="slide-item__title">
                    <router-link
                      :to="articleItemPath(slotProps.item, displayTypeSn).default"
                    >
                      <h3>{{ slotProps.item.title }}</h3>
                    </router-link>
                  </div>
                  <div class="slide-item__note-more-block">
                    <img :src="`${IMAGE_URL}/article/time.svg`" alt="" />
                    <p class="time">
                      {{ formatDateTime(slotProps.item.createTime) }}
                    </p>
                  </div>
                </div>
              </template>
            </g2j-swiper-component>
          </div>
        </div>
      </div>
      <div class="line-end-content"></div>
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
import { getArticleCategoryPath } from "~jsHelperPath/util/HandleUrl";
export default {
  components: {
    TheFooterSectionv4: () =>
      import("~jsPartialPath/global/TheFooterSectionv4.vue"),
    "g2j-swiper-component": () =>
      import(
        "~jsPartialPath/global/component/g2j-swiper-base/Go2JoySwiper.vue"
      ),
    "g2j-image": () =>
      import("~jsPartialPath/global/component/g2j-img/Go2JoyImages.vue"),
  },
  data() {
    return {
      AJAX_URL,
      IMAGE_URL,
      ASSETS_SERVICE_URL,
      dataDetail: {},
      dataGet: {},
      dataGetList: {},
      dataSlide: [],
      nameCategory: "",
      replaceHref: '',
      breakpoints: {
        320: {
          slidesPerView: 1.5,
          spaceBetween: 10,
        },
        375: {
          slidesPerView: 1.5,
          spaceBetween: 10,
        },
        // for pad
        758: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
        // for desktop
        1280: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
      },
      id: "",
      resError: null,
      hash: ''
    };
  },
  async created() {
    this.articleSn = this.$route.query.articleSn;
    await this.getDataArticleById();
    await this.getDataList();
    EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, false);

  },
  watch: {
    "$route.path":  function (newBlogSn, oldBlogSn) {
      this.id = this.$route.path;
      if (newBlogSn !== oldBlogSn) {
        this.id = newBlogSn;

        this.getDataArticleById();
        this.getDataList();

        // return articleItemPath(this.dataDetail)
      }

    },
  },
  methods: {
    articleItemPath(item, displayTypeSn) {
      return getArticleDetailPath(
      {
          title: `${this.removeAccents(item.slug ? item.slug : item.title).toLowerCase()}-${item.articleSn}`
      },
      {
      }
      );
    }, // articleItemPath
    removeAccents(str) {
      return str.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D')
                .replace(/\s/g, "-");
    },
    handleCopyLink() {
      let text = window.location.href;

      setTimeout(async () => {
        this.copyText(text);
      }, 500);
    }, // handleCopyLink()
    copyText(element) {
      var textToCopy = element;
      var myTemporaryInputElement = document.createElement("input");
      myTemporaryInputElement.type = "text";
      myTemporaryInputElement.value = textToCopy;
      document.body.appendChild(myTemporaryInputElement);

      myTemporaryInputElement.select();
      document.execCommand("Copy");
      const result = document.execCommand("copy");
      if (result === "unsuccessful") {
        alert("Failed to copy text.");
        this.copyToClipboard(element);
      } else {
        alert("Copied");
      }
      document.body.removeChild(myTemporaryInputElement);
    },
    articleCategoryItemPath(item) {
      return getArticleCategoryPath(
        {
          categoryName: `${this.removeAccents(this.cutHashTag(item.name ? item.name : 'category').toLowerCase())}-${item.sn}`
        },
        {
        }
      );
    }, // articleCategoryItemPath
    async getDataArticleById() {

      EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
      let data = {
        // displayTypeSn: this.$route.query.displayTypeSn,
        articleSn: this.getSlugNoQueryString(),
      };
      try {
        let res = await apiCaller({
          metaUrl: AJAX_URL.article.detail,
          dataType: "json",
          method: "GET",
          data: data,
          contentType: "application/json; charset=utf-8",
        });
        this.dataGet = res.data;
        this.nameCategory = this.dataGet.name.replace("|", " ");
        this.dataDetail = this.dataGet.article
        this.addCode()
        this.getTitleAndDescription(this.dataDetail)
        let slug = this.$route.path
        let getStringSlug = slug.split("/")
        let stringTitle = getStringSlug[getStringSlug.length - 1];
        let stringSlug = `${this.dataDetail.slug}-${this.dataDetail.sn}`
        if(stringTitle !== stringSlug){
          this.$router.push({
            name: "article-detail-page",
            params: { title: stringSlug }
          });
        }


      } catch (error) {
        this.resError = error;
        console.log(error)
        this.$router.replace({
          name: 'not-found-page',
        });
      } finally {
        EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        setTimeout(() => {
          this.addCode()

        },500)
        setTimeout(() => {
          this.onScrollToHash()
        },1000)
      }
    },
    formatDateTime(time) {
      if (!time) {
        return "";
      } else {
        return dayjs(time).format("MMM DD, YYYY");
      }
    },
    getSlugNoQueryString(){
        let slug = this.$route.path
        let stringTitle = slug.split("-");
        return stringTitle[stringTitle.length - 1]
    },
    async getDataList() {
      let data = {
        articleSn: this.getSlugNoQueryString(),
      };
      try {
        let res = await apiCaller({
          metaUrl: AJAX_URL.article.limit,
          // url: url,
          dataType: "json",
          method: "GET",
          data: data,
          contentType: "application/json; charset=utf-8",
        });
        this.dataGetList = res.data;
      } catch (error) {
        this.resError = error
      } finally {
        EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
      }
    },
    addCode() {
      let self = this
      var x = document.getElementsByClassName("mce-toc");
      if(x && x.length > 0){
        let y = x[0].querySelectorAll("h2")
        y[0].textContent = ""
      }
      if(x.length > 0 ){
        x[0].innerHTML+="<div class=seen-more><div  class='button-show-hide'> <div id=checkHideShow1 class='button show-button'><p>Xem thêm</p></div><div id=checkHideShow2 class='button hide-button'><p>Thu gọn</p></div></div>"
        x[0].firstElementChild.innerHTML+=
          "<div class='header-content-of-table'><div class='title-content-of-table'> <div class=anchor></div><div class='set-height'> <h2 class='border-color-FF6400'>Mục lục</h2></div></div></div></div>";
        x[0].getElementsByTagName('ul')[0].className += "contentul";
        const contentul = document.getElementsByClassName("contentul")[0];
        contentul.style.maxHeight = contentul.scrollHeight + "px";
          const el1 = document.getElementById("checkHideShow1");
          contentul.style.maxHeight = '270px';
          el1.addEventListener("click", function(event) {
            el1.classList.add("hide-button");
            el1.classList.remove("show-button");
            el2.classList.add("show-button");
            el2.classList.remove("hide-button");
            contentul.style.maxHeight = contentul.scrollHeight + "px";
          })
          const el2 = document.getElementById("checkHideShow2");
          el2.addEventListener("click", function(event) {
            el2.classList.remove("show-button");
            el2.classList.add("hide-button");
            el1.classList.remove("hide-button");
            el1.classList.add("show-button");
            contentul.style.maxHeight = '270px';
          })
          document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                let id = anchor.getAttribute('href')
                let divId = document.getElementById(id.replace(/^#+/, ""))
                var top = -80;
                const y = divId.getBoundingClientRect().top + window.pageYOffset + top;
                window.location.hash = id;
                window.scrollTo({
                    block: 'start',
                    behavior: 'smooth',
                    top: y,
                });
            });
        });

      }

    },
    onScrollToHash(){
      if(!this.$route.hash){
        return
      }else {
        let hash = this.$route.hash
        let divId = document.getElementById(hash.replace(/^#+/, ""))
        var top = -85;
        const y = divId.getBoundingClientRect().top + window.pageYOffset + top;
        window.scrollTo({
            block: 'start',
            behavior: 'smooth',
            top: y,
        });
      }
    },
    cutHashTag(text) {
      if (!text) return;
      return text.replace(/#/g, "");
    },
    getTitleAndDescription(dataDetail){
      if(!dataDetail){
        return
      }

      this.$metaTag.setup({
        title: dataDetail.title,
        description: dataDetail.subContent,
        'twitter:title': dataDetail.subContent,
        'og:description': dataDetail.subContent,
      });
    },
  },

};
</script>
<style src="./article-detail-page-style.css"></style>
