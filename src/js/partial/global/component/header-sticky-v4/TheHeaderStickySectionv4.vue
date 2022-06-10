<template>
  <header class="header-sticky-section">
    <div class="container">
      <div class="header-sticky-block">
        <div class="header-sticky-block__info-col">
          <a
            :href="BASE_URL"
            class="header-sticky-block__logo-shape"
          >
            <div class="header-sticky-block__logo-img-outer">
              <img
                :src="IMAGE_URL + '/svg/go2joy-logo.svg?v=' + CACHE_VERSION"
                width="100%"
                height="100%"
                alt="go2joy"
                class="header-sticky-block__logo-img"
              >
            </div>
          </a>
        </div> <!-- .header-sticky-block__info-col -->

        <div
          v-show="isShowSearchBar"
          class="header-sticky-block__search-col"
          style="z-index:20"
        >
          <!-- <div
            class="header-sticky-block__search-input-outer"
            @click="directToSearchPage"
          >
            <span class="header-sticky-block__search-icon-shape">
              <i class="header-sticky-block__search-icon" />
            </span>
            <input
              v-model="searchKeyword"
              type="text"
              class="header-sticky-block__search-input"
              autocomplete="off"
              :placeholder="$t('common.search_placeholder')"
              @input="asyncInputSearchKeywordTimeout.handle"
            >
          </div>  -->
          <!-- .header-sticky-block__search-input-outer -->
          <div class="header-sticky-block__search-input-outer">
            <G2jSearch />
          </div>
        </div> <!-- .header-sticky-block__search-shape -->

        <div class="header-sticky-block__feature-col">
          <div
            class="header-sticky-block__translate-dropdown-box g2j-dropdown-box g2j-dropdown-box--js enable-hover is-right-side"
          >
            <div class="g2j-dropdown-box__head">
              <div class="header-sticky-block__translate-field">
                <div class="header-sticky-block__translate-field__country-icon-shape">
                  <span
                    class="header-sticky-block__translate-field__country-icon"
                    :class="curLanguageSelected.icon_class"
                  />
                </div> <!-- .header-sticky-block__translate-field__country-icon-shape -->
              </div> <!-- .header-sticky-block__translate-feature -->
            </div> <!-- .g2j-dropdown-box__head -->

            <div class="g2j-dropdown-box__body g2j-dropdown-box-body">
              <div class="g2j-dropdown-box__body-inner">
                <div class="header-sticky-block__translate-dropdown-box__select-list">
                  <template v-for="languageInfoItem, key in languageInfoList">
                    <div
                      :key="key"
                      class="header-sticky-block__translate-dropdown-box__select-item enable-hover"
                      :class="{
                        'is-active' : language === key,
                      }"
                      @click.stop="
                        changeLanguage(key);
                      "
                    >
                      <div class="header-sticky-block__translate-dropdown-box__country-icon-shape">
                        <span
                          class="header-sticky-block__translate-dropdown-box__country-icon"
                          :class="languageInfoItem.icon_list_class"
                        />
                      </div> <!-- .header-sticky-block__translate-dropdown-box__country-icon-shape -->

                      <div class="header-sticky-block__translate-dropdown-box__label">
                        {{ languageTitleList[key] }}
                      </div> <!-- .header-sticky-block__translate-dropdown-box__label -->
                    </div> <!-- .header-sticky-block__translate-dropdown-box__select-item -->
                  </template>
                </div>
              </div>
            </div>
          </div> <!-- .g2j-dropdown-box -->
        </div> <!-- .header-sticky-block__feature-col -->
      </div> <!-- .header-sticky-block -->
    </div>
  </header> <!-- .header-sticky-section -->
</template>

<script>
  import {
    BASE_URL,
    IMAGE_URL,
    CACHE_VERSION,
    LANGUAGE_VALID,
    LANGUAGE_DEFAULT,
    IS_MOBILE,
    IP_INFO,
  } from "~jsDefinePath/general";
  import { ROUTER_NAME } from "~jsBasePath/vue-router/router-define";
  import { EVENT_BUS_KEY } from "~jsDefinePath/event-bus";
  import { mapState, mapGetters } from "~jsLibPath/lib-manager";
  import {
    getSearchPagePath,
    getProfilePagePath,
  } from "~jsHelperPath/util/HandleUrl";
  import {
    MODULE_NAME as PAGE_INFO_MODULE_NAME,
    COMMIT_KEY as PAGE_INFO_COMMIT_KEY,
  } from "~jsBasePath/vuex/modules/page-info-module";
  import G2jSearch from "~jsPartialPath/global/component/g2j-search/Go2JoySearch.vue";

  export default {
    components: {
      G2jSearch,
    },

    data() {
      return {
        BASE_URL,
        IMAGE_URL,
        CACHE_VERSION,

        IS_MOBILE,

        TimeoutHandler: new TimeoutHandler(),
        searchPath: getSearchPagePath(),
        profilePagePath: getProfilePagePath(),

        LANGUAGE_VALID,

        languageInfoList: {
          [LANGUAGE_VALID.vi]: {
            icon_class: "header-sticky-block__translate-field__country-icon--vn",
            icon_list_class:
              "header-sticky-block__translate-dropdown-box__country-icon--vn",
          },

          [LANGUAGE_VALID.en]: {
            icon_class: "header-sticky-block__translate-field__country-icon--uk",
            icon_list_class:
              "header-sticky-block__translate-dropdown-box__country-icon--uk",
          },
        },

        isShowTranslateDropdownBody: false,

        searchKeyword: "",

        asyncInputSearchKeywordTimeout: null,
      };
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),

      ...mapGetters(PAGE_INFO_MODULE_NAME, {
        hasUserInfo: "hasUserInfo",
        nickName: "nickName",
      }),

      languageTitleList() {
        return {
          [LANGUAGE_VALID.vi]: this.$t("common.vi_language"),
          [LANGUAGE_VALID.en]: this.$t("common.en_language"),
        };
      }, // languageTitleList

      curLanguageTitleSelected() {
        return this.languageTitleList[this.language];
      }, // curLanguageTitle

      curLanguageSelected() {
        return this.languageInfoList[this.language];
      }, // curLanguageSelected

      isShowSearchBar() {
        return !(
          this.$route.name === ROUTER_NAME["login-page"] ||
          this.$route.name === ROUTER_NAME["sign-up-page"] ||
          this.$route.name === ROUTER_NAME["forget-password-page"]
        );
      }, // isShowSearchBar
    },

    watch: {
      // NOTE - reset searchKeyword về '' khi thực hiện chuyển sang route khác
      "$route.name": function (routerName) {
        if (routerName !== ROUTER_NAME["search-page"]) {
          this.searchKeyword = "";
        }
      },
    },

    created() {
      // Promise.all([VueSelect.js]).then(function () {
      //   if (window.VueSelect) {
      //     Vue.component("v-select", window.VueSelect.VueSelect);
      //   }
      // });;
      const self = this;

      self.asyncInputSearchKeywordTimeout = self.TimeoutHandler.init(
        "inputSearchKeywordTimeout",
        500,
        self.requestSearchTask
      );
    },
    mounted() {},
    methods: {
      changeLanguage(selectLanguage) {
        if (selectLanguage !== this.language && LANGUAGE_VALID[selectLanguage]) {
          this.$store.commit(PAGE_INFO_COMMIT_KEY.setLanguage, selectLanguage);

          const routerParams = this.$route.params;

          routerParams.language =
            selectLanguage === LANGUAGE_DEFAULT + '-' + IP_INFO.country.toLowerCase() ? undefined : selectLanguage + '-' + IP_INFO.country.toLowerCase();

          this.$router.replace({
            name: this.$route.name,
            params: routerParams,
            query: this.$route.query,
          });
        }
      }, // changeLanguage()

      directToSearchPage() {
        if (this.searchPath && this.$route.name !== ROUTER_NAME["search-page"]) {
          this.$router.push(this.searchPath[this.language]);
        }
      }, // directToSearchPage()

      requestSearchTask() {
        EventBus.emit(
          EVENT_BUS_KEY.REQUEST_SEARCH_TASK,
          this.searchKeyword.escape()
        );
      }, // reqeustSearchTask
    },
  };
</script>
