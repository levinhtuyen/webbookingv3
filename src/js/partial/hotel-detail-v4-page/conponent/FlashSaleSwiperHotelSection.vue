<template>
  <section
    v-if="isShowSection"
    class="flash-sale-horizontal-swiper-hotel-section"
  >
    <div
      class="container"
      v-if="info.hotelList.length > 0"
    >
      <div class="flash-sale-horizontal-swiper-hotel-block">
        <div class="flash-sale-horizontal-swiper-hotel-block__head">
          <div
            v-if="hasTitleList"
            class="title-col"
          >
            <h3 class="title-label">
              {{ titleList[language] }}
            </h3>
          </div> <!-- .title-col -->

          <div
            v-if="
              hasViewMoreList ||
              hasViewMoreHref
            "
            class="navigate-col"
          >
            <router-link
              v-if="hasViewMoreList"
              :to="viewMoreList[language]"
              v-slot="{ href }"
            >
              <a
                :href="href"
                class="navigate-field"
                @click.prevent="trackingAndDirect(href)"
              >
                <span class="navigate-label">
                  {{ $t('common.read_more') }}
                </span>

                <span class="icon-shape">
                  <i class="fal fa-arrow-right"></i>
                </span>
              </a>
            </router-link>
            <a
              v-if="hasViewMoreHref"
              :href="viewMoreHref"
              class="navigate-field"
              target="_blank"
            >
              <span class="navigate-label">
                {{ $t('common.read_more') }}
              </span>

              <span class="icon-shape">
                <i class="fal fa-arrow-right"></i>
              </span>
            </a>
          </div> <!-- .navigate-col -->
        </div> <!-- .flash-sale-horizontal-swiper-hotel-block__head -->

        <div class="flash-sale-horizontal-swiper-hotel-block__body">
          <div
            ref="G2jHotelSwiperContainer"
            class="flash-sale-horizontal-swiper-hotel-container swiper-container"
          >
            <div class="flash-sale-horizontal-swiper-hotel-wrap swiper-wrapper">
              <template v-if="displayType == 5">
                <LightSquareHotelCard
                  v-for="itemInfo, idx in itemList"
                  :key="idx"
                  :is-slide="true"
                  :is-disable-invalid="false"
                  :info="{
                    ...itemInfo,
                    order: (idx + 1),
                    total: itemList.length,
                    min_item_enable_swiper: minItemToEnableSwiper
                  }"
                  :width="cardWidth"
                  :assetsServiceUrl="assetsServiceUrl"
                  :hotelInfoV4="hotelInfoV4"
                  :isOvernightSpecial="isOvernightSpecial"
                  :isDefaultOvernightSpecial="isDefaultOvernightSpecial"
                  @bookOvernightSpecial="val => $emit('bookOvernightSpecial',val)"
                  @mounted="onCardMounted"
                />
              </template>
            </div> <!-- .flash-sale-horizontal-swiper-hotel-wrap -->
          </div> <!-- .flash-sale-horizontal-swiper-hotel-container -->
        </div> <!-- .flash-sale-horizontal-swiper-hotel-block__body -->
      </div> <!-- .flash-sale-horizontal-swiper-hotel-block -->
    </div> <!-- .container -->
  </section> <!-- .flash-sale-horizontal-swiper-hotel-section -->
</template>

<script>
  import {
    LANGUAGE_VALID,
    SWIPER_FREEMODE_CONFIG,
    IS_MOBILE,
    IS_SAFARI_BROWSER,
  } from "~jsDefinePath/general";
  import {
    FIREBASE_TRACKING,
    DABLE_TRACKING,
  } from "~jsDefinePath/tracking-define";
  import { _, he, mapState } from "~jsLibPath/lib-manager";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/page-info-module";
  import { getHotelListPath } from "~jsHelperPath/util/HandleUrl";
  import { getPromotionPath } from "~jsHelperPath/util/HandleUrl";
  import {
    G2JFirebase,
    G2JDablenaTracking,
  } from "~jsHelperPath/util/HandleTracking";
  import {
    onResizeEvent,
    removeOnResizeEvent,
  } from "~jsHelperPath/util/PrivateEventCustom";

  export default {
    components: {
      LightSquareHotelCard: () => import("./LightSquareHotelCard.vue"),
    },

    props: {
      assetsServiceUrl: {
        default: "",
        type: String,
      }, // assetsServiceUrl

      info: {
        type: Object,
        default: new Object(),
      }, // info

      hotelInfoV4: {
        type: Object,
        default: new Object(),
      }, // hotelInfoV4
      isDefaultOvernightSpecial: Boolean,
      isOvernightSpecial: Boolean,
    },

    data() {
      return {
        displayType: this.info.displayType,
        titleList: {},
        viewMoreList: {},
        viewMoreHref: "",

        hasList: false,
        hasTitleList: false,
        hasViewMoreList: false,
        hasViewMoreHref: false,

        itemList:
          this.info.displayType === 1
            ? this.info.promotionList && this.info.promotionList.length
              ? this.info.promotionList
              : []
            : this.info.hotelList && this.info.hotelList.length
            ? this.info.hotelList
            : this.info.articleList && this.info.articleList.length
            ? this.info.articleList
            : [],

        invalidItemList: [],

        maxItemPerViewEachBreakPoint: {},
        maxItemPerView: 0,

        swiperInitial: null,

        TimeoutHandler: new TimeoutHandler(),
        calcWidthOfCardTimeout: null,
        resetSwiperTimeout: null,

        cardWidth: null,
      };
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, ["language"]),

      totalValidItems() {
        return this.itemList.length - this.invalidItemList.length;
      }, // totalValidItems

      isShowSection() {
        return this.totalValidItems > 0;
      }, // isShowSection

      minItemToEnableSwiper() {
        return this.maxItemPerView + 1;
      }, // minItemToEnableSwiper

      enableSwiper() {
        return this.totalValidItems >= this.minItemToEnableSwiper;
      }, // enableSwiper()
    },

    created() {
      const self = this;

      // NOTE - check is item list exist
      self.hasList = !_.isEmpty(self.itemList);

      self.initSectionInfo();
      // NOTE - handle responsive behavior
      self.calcWidthOfCardTimeout = self.TimeoutHandler.init(
        "calWidthOfCard_" + Date.now(),
        150,
        function () {
          self.maxItemPerView =
            self.maxItemPerViewEachBreakPoint[self.getBreakPointCurrent()];

          const tmpCardWidth =
            ((document.body.clientWidth > 768 ? 768 : document.body.clientWidth) -
              48) /
              self.maxItemPerView -
            (self.maxItemPerView === 1
              ? 0
              : (16 * (self.maxItemPerView - 1)) / self.maxItemPerView);

          if (tmpCardWidth !== self.cardWidth) {
            self.cardWidth = tmpCardWidth;
            self.swiperInitial?.destroy(true, true);

            if (self.enableSwiper) {
              self.resetSwiperTimeout.handle();
            }
          }
        }
      );
      self.resetSwiperTimeout = self.TimeoutHandler.init(
        "resetSwiper_" + Date.now(),
        150,
        self.initSwiper
      );

      onResizeEvent(window, self.calcWidthOfCardTimeout.handle);
    },

    beforeDestroy() {
      const self = this;

      self.resetSwiperTimeout.destroy();
      self.calcWidthOfCardTimeout.destroy();
      removeOnResizeEvent(window, self.calcWidthOfCardTimeout.handle);
    },

    methods: {
      initSectionInfo() {
        // NOTE - If has list of collection then do generate title and view more list
        if (this.hasList) {
          this.maxItemPerViewEachBreakPoint =
            this.generateMaxItemPerViewEachBreakPoint();
          this.maxItemPerView =
            this.maxItemPerViewEachBreakPoint[this.getBreakPointCurrent()];

          this.cardWidth =
            ((document.body.clientWidth > 768 ? 768 : document.body.clientWidth) -
              48) /
              this.maxItemPerView -
            (this.maxItemPerView === 1
              ? 0
              : (16 * (this.maxItemPerView - 1)) / this.maxItemPerView);
        }

        this.setupData();
        this.checkDataExist();
      }, // initSectionInfo()

      setupData() {
        this.titleList = this.generateTitleList();
        this.viewMoreList = this.generateViewMoreList();
        this.viewMoreHref = this.generateViewMoreHref();
      }, // setupData()

      checkDataExist() {
        this.hasTitleList = !_.isEmpty(this.titleList);
        this.hasViewMoreList = !_.isEmpty(this.viewMoreList);
        this.hasViewMoreHref = !_.isEmpty(this.viewMoreHref);
      }, // checkDataExist()

      generateMaxItemPerViewEachBreakPoint() {
        if (this.displayType === 7) {
          return {
            "720px": 4,
            "540px": 3,
            "375px": 2,
            "280px": 1,
          };
        }

        return {
          "720px": 2,
          "540px": 1,
          "375px": 1,
          "280px": 1,
        };
      }, // generateMaxItemPerViewEachBreakPoint()

      generateTitleList() {
        // NOTE - Case 1
        // NOTE - If the title is not string of type or if it's string of type and trim() of it is empty -> return {} empty
        if (typeof this.info.title !== "string" || !this.info.title.trim()) {
          return {};
        }

        // NOTE - Case 2
        // NOTE - If pass case 1, we will split the title and check condition on it
        const titleSplitted = this.info.title.split("|");

        // NOTE - Cause the title is string of type, so the split native method worked and the a string split a letter or word does not exist in title -> the result will give an array with length always = 1
        // NOTE - If length = 1 we will check the trim() of [0] word of 0 index else we will check words of 0 index and 1 index (if one of 2 group condition is true -> return {})
        if (
          (titleSplitted.length === 1 && !titleSplitted[0].trim()) ||
          (!titleSplitted[0].trim() && !titleSplitted[1].trim())
        ) {
          return {};
        }

        if (titleSplitted.length === 1 && titleSplitted[0].trim()) {
          const finalTitle = he.decode(titleSplitted[0].trim());

          return {
            [LANGUAGE_VALID.vi]: finalTitle,
            [LANGUAGE_VALID.en]: finalTitle,
          };
        }

        const finalTitleVi = titleSplitted[0].trim();
        const finalTitleEn = titleSplitted[1].trim();

        return {
          [LANGUAGE_VALID.vi]: finalTitleVi
            ? he.decode(finalTitleVi)
            : he.decode(finalTitleEn),
          [LANGUAGE_VALID.en]: finalTitleEn
            ? he.decode(finalTitleEn)
            : he.decode(finalTitleVi),
        };
      }, // generateTitleList()

      generateViewMoreList() {
        if (typeof this.info.sn !== "number") {
          return {};
        }

        if (this.displayType === 1) {
          return getPromotionPath({
            type: 2,
          });
        }

        const slug = this.hasTitleList
          ? GetSlugWithoutDash(this.titleList[LANGUAGE_VALID.en])
          : "collection";

        return getHotelListPath(
          {
            categoryName: slug,
          },
          {
            hotelCollectionSn: this.info.sn,
          }
        );
      }, // generateViewMoreList()

      generateViewMoreHref() {
        if (_.isEmpty(this.info.path)) {
          return "";
        }

        return this.info.path[LANGUAGE_VALID.vi];
      }, // generateViewMoreHref()

      onCardMounted(objRes) {
        if (!objRes.is_valid) {
          this.invalidItemList.push(objRes.info);
        }

        if (objRes.is_finish_render_list && this.enableSwiper) {
          this.initSwiper();
          this.$emit("mounted");
        }
      }, // onCardMounted()

      initSwiper() {
        if (Swiper && this.$refs.G2jHotelSwiperContainer && this.enableSwiper) {
          const self = this;

          self.swiperInitial = new Swiper(self.$refs.G2jHotelSwiperContainer, {
            ...SWIPER_FREEMODE_CONFIG,
            slidesPerView: "auto",
            spaceBetween: 0,

            grabCursor: true,

            // Enable lazy loading
            lazy: {
              checkInView: true,
              loadPrevNext: true,
            },
          });
        }
      }, // initSwiper()

      getBreakPointCurrent() {
        if (window.matchMedia("(min-width: 720px)").matches) {
          return "720px";
        }

        if (window.matchMedia("(min-width: 640px)").matches) {
          if (
            IS_MOBILE &&
            IS_SAFARI_BROWSER &&
            window.matchMedia("(orientation : landscape)").matches
          ) {
            return "720px";
          }

          return "540px";
        }

        if (window.matchMedia("(min-width: 540px)").matches) {
          return "540px";
        }

        if (window.matchMedia("(min-width: 375px)").matches) {
          return "375px";
        }

        return "280px";
      }, // getBreakPointCurrent()

      trackingAndDirect(href) {
        if (this.hasTitleList) {
          const titleCase = GenerateTitleCase(this.titleList[LANGUAGE_VALID.en]);

          G2JFirebase.analytics().logEvent(
            FIREBASE_TRACKING.TRACKING_PREFIX +
              GetCustomSlug("", 500, false)(titleCase)
          );
          G2JDablenaTracking(
            DABLE_TRACKING.TRACKING_SEE_ALL_PREFIX +
              GetCustomSlug("", 500, false)(titleCase)
          );
        }

        if (href) {
          this.$router.push(href);
        }
      }, // trackingAndDirect()
    },
  };
</script>
