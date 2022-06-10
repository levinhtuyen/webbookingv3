<template>
  <div class="article-page">
    <section class="article-detail-section">
      <div class="article-detail-banner-block">
        <g2j-image
          :url-img="`${ASSETS_SERVICE_URL}/${dataBanner.imagePath}`"
        ></g2j-image>
        <div class="title-article-page">
          <h1 class="is-title-big" v-html="dataBanner.title"></h1>
        </div>
      </div>
      <div class="container">
        <div class="article-detail-block">

          <!-- Start article-detail-block -->
          <div
            class="article-detail-block-hastag"
            v-if="dataPinArticle && dataPinArticleList"
          >
            <div class="article-detail-block-hastag__image">
              <router-link
                :to="articleItemPath(dataPinArticleList, dataPinArticle.sn).default"
              >
                <g2j-image
                  :url-img="`${ASSETS_SERVICE_URL}/${dataPinArticleList.thumbnailPath}`"
                ></g2j-image>
              </router-link>
            </div>
            <div class="article-detail-block-hastag__content">
              <div
                class="article-detail-block-hastag__content--hastag"
              >
                <!-- <div
                  class="text-hastag"
                  v-for="(v, k) in dataPinArticle.hashtag"
                  :key="k"
                >
                  <a :href="v.name">
                    <p>
                      {{ v.name }}
                    </p>
                  </a>
                </div> -->
                <div
                  class="text-hastag"
                >
                  <router-link
                  :to="articleCategoryItemPath(dataPinArticleList, dataPinArticleList.categorySn).default"
                  >
                    <p>
                      <!-- #ĂN CHƠI -->
                      {{ dataPinArticleList.hashtag }}
                    </p>
                  </router-link>
                </div>
              </div>
              <div class="article-detail-block-hastag__content--title">
                <router-link
                  :to="articleItemPath(dataPinArticleList, dataPinArticle.sn).default"
                >
                  <h3>
                    {{ dataPinArticleList.title }}
                  </h3>
                </router-link>
              </div>
              <div class="article-detail-block-hastag__content--short-content">
                {{ dataPinArticleList.subContent }}
              </div>
              <div class="article-detail-block-hastag__content--note-more">
                <div class="note-more-block">
                  <p class="by-admin" v-if="dataPinArticleList.author">
                    By
                    <span class="color-go2joy">{{ dataPinArticleList.author }}</span>
                  </p>
                </div>
                <div class="note-more-block">
                  <img :src="`${IMAGE_URL}/article/time.svg`" alt="time.svg" />
                  <p class="time">
                    {{ formatDateTime(dataPinArticleList.createTime) }}
                  </p>
                </div>
                <!-- <div class="note-more-block">
                  <img
                    :src="`${IMAGE_URL}/article/union.svg`"
                    alt="union.svg"
                  />
                  <p class="view">{{ dataSlide0[0].numberOfView }} views</p>
                </div> -->
              </div>
            </div>
          </div>

          <!-- Start Sort article block -->
          <div class="article-list-sort" v-for="(article,index) in dataArticleSection" :key="index">
            <!-- Start article mở khóa block -->
            <div
            class="article-detail-block-lock-room"
            v-if="article.sn === 3 && article.articleList.length != 0"
            >
              <div class="article-detail-block-lock-room__topic" :class="article.articleList.length <= 3 ? 'topic-100' : ''">
                <div class="article-detail-block-lock-room__topic--title">
                  <div
                    :id="cutHashTag(article.hashtag)"
                    class="anchor"
                  ></div>
                  <div class="set-height">
                    <h2 class="border-color-FF6400">{{ article.title }}</h2>
                    <!-- <h2 class="color-go2joy margin-left-10">{{ cutString(article.title)[1] }}</h2> -->
                  </div>
                </div>
                <div class="article-detail-block-lock-room__topic--list-button" v-show="article.articleList.length > 3">
                  <div class="button slide-lock-room-button-prev">
                    <i class="fas fa-arrow-left"></i>
                  </div>
                  <div class="button slide-lock-room-button-next">
                    <i class="fas fa-arrow-right"></i>
                  </div>
                </div>
              </div>
              <div class="article-detail-block-lock-room__slide">
                <g2j-swiper-component
                  :name="'slide-lock-room'"
                  v-if="!!article.articleList.length"
                  :breakpoints="breakpoints"
                  :is-check-button="true"
                  :data.sync="article.articleList"
                >
                  <template slot-scope="slotProps">
                    <div class="slide-item">
                      <div class="slide-item__image">
                        <router-link
                          :to="
                            articleItemPath(slotProps.item, article.sn).default
                          "
                        >
                          <g2j-image
                            :url-img="`${ASSETS_SERVICE_URL}/${slotProps.item.thumbnailPath}`"
                          ></g2j-image>
                        </router-link>
                      </div>
                      <div class="slide-item__title">
                        <router-link
                          :to="
                            articleItemPath(slotProps.item, article.sn).default
                          "
                          ><h3>{{ slotProps.item.title }}</h3></router-link
                        >
                      </div>
                      <div class="slide-item__note-more-block">
                        <img
                          :src="`${IMAGE_URL}/article/time.svg`"
                          alt="time.svg"
                        />
                        <p class="time">
                          {{ formatDateTime(slotProps.item.createTime) }}
                        </p>
                      </div>
                    </div>
                  </template>
                </g2j-swiper-component>
              </div>
              <div class="article-detail-block-see-more">

                  <div class="article-see-more">
                    <router-link
                    :to="articleCategoryItemPath(article, article.categorySn).default"
                    >
                      <p>{{ $t("common.see_more") }}</p>
                    </router-link>
                  </div>

                <div class="article-line"></div>
              </div>
            </div>
            <!-- End article mở khóa block -->

            <!-- Start article Cố Vấn block -->
            <div
            class="article-detail-block-adviser"
            v-if="article.sn === 4 && article.articleList.length != 0"
            >
              <div class="article-detail-block-adviser__topic" :class="article.articleList.length <= 6 ? 'topic-100' : ''">
                <div class="article-detail-block-adviser__topic--title">
                  <div
                    :id="cutHashTag(article.hashtag)"
                    class="anchor"
                  ></div>
                  <div class="set-height">
                    <h2 class="border-color-FF6400">{{ article.title }}</h2>
                    <!-- <h2 class="color-go2joy margin-left-10">{{ cutString(article.title)[1] }} </h2> -->
                  </div>
                </div>
                <div class="article-detail-block-adviser__topic--list-button" v-show="article.articleList.length > 6">
                  <div class="button slide-adviser-button-prev">
                    <i class="fas fa-arrow-left"></i>
                  </div>
                  <div class="button slide-adviser-button-next">
                    <i class="fas fa-arrow-right"></i>
                  </div>
                </div>
              </div>
              <div class="article-detail-block-adviser__slide">
                <g2j-swiper-component
                  v-if="!!article.articleList.length && IS_MOBILE"
                  :breakpoints="breakpoints"
                  :name="'slide-adviser'"
                  :is-check-button="true"
                  :data.sync="article.articleList"
                  :option-more="{}"
                >
                  <template slot-scope="slotProps">
                    <div class="slide-item">
                      <div class="slide-item__image">
                        <router-link
                          :to="
                            articleItemPath(slotProps.item, article.sn).default
                          "
                        >
                          <g2j-image
                            :url-img="`${ASSETS_SERVICE_URL}/${slotProps.item.thumbnailPath}`"
                          ></g2j-image>
                        </router-link>
                      </div>
                      <router-link
                        :to="
                          articleItemPath(slotProps.item, article.sn).default
                        "
                      >
                        <div class="slide-item__overlay">
                          <div class="slide-item__overlay--content">
                            <div class="title">
                              <h3>{{ slotProps.item.title }}</h3>
                            </div>
                            <div class="short-content">
                                <div class="note-more-block-time">
                                  <img :src="`${IMAGE_URL}/article/time1.svg`" alt="time1.svg" />
                                  <p class="time">
                                    {{ formatDateTime(slotProps.item.createTime) }}
                                  </p>
                                </div>
                                <div class="note-more-block-view" v-if="slotProps.item.numberOfView">
                                  <img :src="`${IMAGE_URL}/article/union1.svg`" alt="" />
                                    <span class="color-go2joy">{{ slotProps.item.numberOfView }} </span>
                                    <span>&nbsp; {{ $t("common.views") }}</span>
                                </div>

                              </div>
                          </div>
                        </div>
                      </router-link>
                    </div>
                  </template>
                </g2j-swiper-component>
                <g2j-swiper-component
                  v-if="!!article.articleList.length && !IS_MOBILE"
                  :name="'slide-adviser'"
                  :is-check-button="true"
                  :data="setArrAdviser(article.articleList)"
                  :option-more="{}"
                  :breakpoints="breakpoints"
                >
                  <template slot-scope="slotProps">
                    <div class="container-item">
                      <div
                        class="slide-item"
                        v-for="(v, k) in slotProps.item"
                        :key="k"
                      >
                        <div class="slide-item__image">
                          <router-link
                            :to="articleItemPath(v, article.sn).default"
                          >
                            <g2j-image
                              :url-img="`${ASSETS_SERVICE_URL}/${v.thumbnailPath}`"
                            ></g2j-image>
                          </router-link>
                        </div>
                        <router-link
                          :to="articleItemPath(v, article.sn).default"
                        >
                          <div class="slide-item__overlay">
                            <div class="slide-item__overlay--content">
                              <div class="title">
                                <h3>{{ v.title }}</h3>
                              </div>
                              <div class="short-content">
                                <div class="note-more-block-time">
                                  <img :src="`${IMAGE_URL}/article/time1.svg`" alt="time1.svg" />
                                  <p class="time">
                                    {{ formatDateTime(v.createTime) }}
                                  </p>
                                </div>
                                <div class="note-more-block-view" v-if="v.numberOfView">
                                  <img :src="`${IMAGE_URL}/article/union1.svg`" alt="" />
                                    <span class="color-go2joy">{{ v.numberOfView }} </span>
                                    <span>&nbsp; {{ $t("common.views") }}</span>
                                </div>

                              </div>
                            </div>
                          </div>
                        </router-link>
                      </div>
                    </div>
                  </template>
                </g2j-swiper-component>
              </div>
              <div class="article-detail-block-see-more">

                  <div class="article-see-more">
                    <router-link
                    :to="articleCategoryItemPath(article, article.categorySn).default"
                    >
                      <p>{{ $t("common.see_more") }}</p>
                    </router-link>
                  </div>

                <div class="article-line"></div>
              </div>
            </div>
            <!-- End article Cố Vấn block -->

            <!-- Start article Tuyệt Chill block -->
            <div
              class="article-detail-block-chill"
              v-if="article.sn === 5 && article.articleList.length != 0"
            >
              <div class="article-detail-block-chill__topic" :class="article.articleList.length <= 2 ? 'topic-100' : ''">
                <div class="article-detail-block-chill__topic--title">
                  <div
                    :id="cutHashTag(article.hashtag)"
                    class="anchor"
                  ></div>
                  <div class="set-height">
                    <h2 class="border-color-FF6400">{{ article.title }}</h2>
                    <!-- <h2 class="color-go2joy margin-left-10">{{ cutString(article.title)[1] }}</h2> -->
                  </div>
                </div>
                <div class="article-detail-block-chill__topic--list-button" v-show="article.articleList.length > 2">
                  <div class="button slide-chill-button-prev">
                    <i class="fas fa-arrow-left"></i>
                  </div>
                  <div class="button slide-chill-button-next">
                    <i class="fas fa-arrow-right"></i>
                  </div>
                </div>
              </div>
              <g2j-swiper-component
                v-if="!!article.articleList.length"
                :name="'slide-chill'"
                :is-check-button="true"
                :data="IS_MOBILE ? article.articleList : setArrChill(article.articleList)"
                :breakpoints="{
                  320: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                  },
                }"
              >
                <template slot-scope="slotProps">
                  <div
                    v-if="!IS_MOBILE"
                    class="article-detail-block-chill__slide"
                  >
                    <div
                      v-if="typeof slotProps.item[0] === 'object'"
                      class="slide-item1"
                    >
                      <div class="article-detail-block-chill__slide--image">
                        <router-link
                          :to="
                            articleItemPath(slotProps.item[0], article.sn)[
                              'vi'
                            ]
                          "
                        >
                          <g2j-image
                            :url-img="`${ASSETS_SERVICE_URL}/${slotProps.item[0].thumbnailPath}`"
                          ></g2j-image>
                        </router-link>
                      </div>
                      <div class="article-detail-block-chill__slide--content">
                        <div class="title">
                          <router-link
                            :to="
                              articleItemPath(slotProps.item[0], article.sn)[
                                'vi'
                              ]
                            "
                          >
                            <h3>{{ slotProps.item[0].title }}</h3>
                          </router-link>
                        </div>
                        <div class="short-content">
                          <p>{{ slotProps.item[0].subContent }}</p>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="typeof slotProps.item[1] === 'object'"
                      class="slide-item2"
                    >
                      <div class="article-detail-block-chill__slide--content">
                        <div class="title">
                          <router-link
                            :to="
                              articleItemPath(slotProps.item[1], article.sn)[
                                'vi'
                              ]
                            "
                          >
                            <h3>{{ slotProps.item[1].title }}</h3>
                          </router-link>
                        </div>
                        <div class="short-content">
                          <p>{{ slotProps.item[1].subContent }}</p>
                        </div>
                      </div>
                      <div class="article-detail-block-chill__slide--image">
                        <router-link
                          :to="
                            articleItemPath(slotProps.item[1], article.sn)[
                              'vi'
                            ]
                          "
                        >
                          <g2j-image
                            :url-img="`${ASSETS_SERVICE_URL}/${slotProps.item[1].thumbnailPath}`"
                          ></g2j-image>
                        </router-link>
                      </div>
                    </div>
                  </div>
                  <div class="article-detail-block-chill__slide" v-else>
                    <div
                      class="slide-item1"
                    >
                      <div class="article-detail-block-chill__slide--image">
                        <router-link
                          :to="
                            articleItemPath(slotProps.item, article.sn).default
                          "
                        >
                          <g2j-image
                            :url-img="`${ASSETS_SERVICE_URL}/${slotProps.item.thumbnailPath}`"
                          ></g2j-image>
                        </router-link>
                      </div>
                      <div class="article-detail-block-chill__slide--content">
                        <div class="title">
                          <router-link
                            :to="
                              articleItemPath(slotProps.item, article.sn)[
                                'vi'
                              ]
                            "
                          >
                            <h3>{{ slotProps.item.title }}</h3>
                          </router-link>
                        </div>
                        <div class="short-content">
                          <p>{{ slotProps.item.subContent }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </g2j-swiper-component>
              <div class="article-detail-block-see-more">

                  <div class="article-see-more">
                    <router-link
                    :to="articleCategoryItemPath(article, article.categorySn).default"
                    >
                      <p>{{ $t("common.see_more") }}</p>
                    </router-link>
                  </div>

                <div class="article-line"></div>
              </div>
            </div>
            <!-- End article Tuyệt Chill block -->

            <!-- Start article Vi Vu block -->
            <div
              class="article-detail-block-vivu"
              v-if="article.sn === 6 && article.articleList.length != 0"
            >
              <div class="article-detail-block-vivu__topic" :class="article.articleList.length <= 3 ? 'topic-100' : ''">
                <div class="article-detail-block-vivu__topic--title">
                  <div
                    :id="cutHashTag(article.hashtag)"
                    class="anchor"
                  ></div>
                  <div class="set-height">
                    <h2 class="border-color-FF6400">{{ article.title }}</h2>
                    <!-- <h2 class="color-go2joy margin-left-10">{{ cutString(article.title)[1] }}</h2> -->
                  </div>
                </div>
                <div class="article-detail-block-vivu__topic--list-button" v-show="article.articleList.length > 3">
                  <div class="button slide-4-button-prev">
                    <i class="fas fa-arrow-left"></i>
                  </div>
                  <div class="button slide-4-button-next">
                    <i class="fas fa-arrow-right"></i>
                  </div>
                </div>
              </div>
              <div class="article-detail-block-vivu__slide">
                <g2j-swiper-component
                  :name="'slide-4'"
                  :breakpoints="breakpoints"
                  :is-check-button="true"
                  :data="article.articleList"
                  :option-more="{

                  }"
                >
                  <template slot-scope="slotProps">
                    <router-link
                        :to="
                          articleItemPath(slotProps.item, article.sn).default
                        "
                      >
                      <div class="article-detail-block-vivu__slide-item">
                        <div class="article-detail-block-vivu__slide--image">
                          <g2j-image
                            :url-img="`${ASSETS_SERVICE_URL}/${slotProps.item.thumbnailPath}`"
                          >
                          </g2j-image>
                          <div class="title">
                            <router-link
                              :to="
                                articleItemPath(slotProps.item, article.sn)[
                                  'vi'
                                ]
                              "
                            >
                              <h3>
                                {{ slotProps.item.title }}
                              </h3>
                            </router-link>
                          </div>
                          <router-link
                            :to="
                              articleItemPath(slotProps.item, article.sn).default
                            "
                          >
                            <div class="icon-search">
                              <img :src="`${IMAGE_URL}/article/search.svg`" alt="" />
                            </div>
                          </router-link>
                        </div>
                      </div>
                    </router-link>
                  </template>
                </g2j-swiper-component>
              </div>
              <div class="article-detail-block-see-more">

                  <div class="article-see-more">
                    <router-link
                    :to="articleCategoryItemPath(article, article.categorySn).default"
                    >
                      <p>{{ $t("common.see_more") }}</p>
                    </router-link>
                  </div>

                <div class="article-line"></div>
              </div>
            </div>
            <!-- End article Vi Vu block -->
          </div>
          <!-- End Sort article block -->
        </div>
        <div class="line-end-content"></div>
      </div>
    </section>
    <!-- .article-detail-section -->
    <!-- <TheFooterSectionv4></TheFooterSectionv4> -->
  </div>
</template>

<script>
import { AJAX_URL } from "~jsDefinePath/ajax-url";
import { apiCaller } from "~jsHelperPath/service/ApiHandler";
import { IMAGE_URL, IS_MOBILE } from "~jsDefinePath/general";
import { ASSETS_SERVICE_URL } from "~jsDefinePath/general";
import { EVENT_BUS_KEY } from "~jsDefinePath/event-bus";
import { EventBus } from "~jsHelperPath/service/EventBus";
import { getArticleDetailPath } from "~jsHelperPath/util/HandleUrl";
import { getArticleCategoryPath } from "~jsHelperPath/util/HandleUrl";
export default {
  data() {
    return {
      AJAX_URL,
      IMAGE_URL,
      IS_MOBILE,
      ASSETS_SERVICE_URL,
      dataBanner: [],
      dataPinArticle: [],
      dataArticleSection: [],
      articleData: [],
      breakpoints: {
        320: {
          slidesPerView: 1.5,
        },
        375: {
          slidesPerView: 1.5,
        },
        // for pad
        758: {
          slidesPerView: 3,
        },
        // for desktop
        1280: {
          slidesPerView: 3,
        },
      },
      breakpointsvivu: {
        320: {
          slidesPerView: 1.5,
        },
        375: {
          slidesPerView: 1.5,
        },
        // for pad
        758: {
          slidesPerView: 3,

        },
        // for desktop
        1280: {
          slidesPerView: 3,

        },
      },
      dataRes: null,
      dataError: null
    };
  },
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
  async created() {
    await this.getDataArticle();
    EventBus.emit(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, false);
  },

  computed: {
    arrChill() {
      if (!this.dataSlide3 || this.dataSection3.length == 0) return [];

      return _.chunk(this.dataSlide3, 2);
    },
    arrAdviser() {
      //  if (!this.dataSlide2 || this.dataSection2.length == 0) return [];
      // let arrResult = _.chunk(this.dataSlide2, 6);
      // arrResult.forEach((el,i) => {
      //   if (el.length <6){
      //     let num = 6 - el.length
      //     arrResult[i] = [...el, ...arrResult[0].slice(0,num)]
      //   }
      // });
      // return arrResult
      if (!this.dataSlide2 || this.dataSection2.length == 0) return [];
      return _.chunk(this.dataSlide2, 2);
    },
  },

  methods: {
    setArrAdviser(data) {
      //  if (!this.dataSlide2 || this.dataSection2.length == 0) return [];
      // let arrResult = _.chunk(this.dataSlide2, 6);
      // arrResult.forEach((el,i) => {
      //   if (el.length <6){
      //     let num = 6 - el.length
      //     arrResult[i] = [...el, ...arrResult[0].slice(0,num)]
      //   }
      // });
      // return arrResult
      if (!data || data.length == 0) return [];
      return _.chunk(data, 2);
    },
    setArrChill(data) {
      if (!data || data.length == 0) return [];

      return _.chunk(data, 2);
    },
    articleItemPath(item, categorySn) {

      return getArticleDetailPath(
        {
          title: `${item.slug ? item.slug : this.removeAccents(item.title).toLowerCase()}-${item.sn}`
        },
        {
        }
      );
    }, // articleItemPath

    articleCategoryItemPath(item, categorySn) {
      return getArticleCategoryPath(
        {
          categoryName: `${this.removeAccents(this.cutHashTag(item.categoryName ? item.categoryName : 'category').toLowerCase())}-${categorySn}`
        },
        {
        }
      );
    }, // articleCategoryItemPath

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

    async getDataArticle() {
      EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
      try {
        let res = await apiCaller({
          metaUrl: AJAX_URL.article.home,
          dataType: "json",
          method: "GET",
          contentType: "application/json; charset=utf-8",
        });
        this.articleData = res.data;
        this.initData(this.articleData);
      } catch (error) {
        this.dataError = error
      } finally {
        EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
      }
    },

    initData(data) {
      this.dataBanner = data[0]
      this.dataPinArticle = data[1]
      this.dataPinArticleList =  this.dataPinArticle.articleList[0]
      this.dataArticleSection = data.filter(item => (item.sn !== 1 && item.sn !==2))

      // NOTE - Setup meta tag
      this.$metaTag.setup({
        title: this.dataBanner.title.replace(/(<([^>]+)>)/ig, ''),
      });
    },

    formatDateTime(time) {
      if (!time) {
        return "";
      } else {
        return dayjs(time).format("MMM DD, YYYY");
      }
    },
  },
};
</script>
<style src="./article-page-style.css">
</style>
