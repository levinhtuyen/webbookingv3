<template>
  <header class="header-sticky-section">
    <div class="container">
      <div class="header-sticky-block">
        <div class="header-sticky-block__info-col">
          <a :href="BASE_URL" class="header-sticky-block__logo-shape">
            <div class="header-sticky-block__logo-img-outer">
              <img
                :src="IMAGE_URL + '/svg/go2joy-logo.svg?v=' + CACHE_VERSION"
                width="100%"
                height="100%"
                alt="go2joy"
                class="header-sticky-block__logo-img"
              />
            </div>
          </a>
        </div>
        <!-- .header-sticky-block__info-col -->

        <div class="header-sticky-block__feature-col">
          <div class="header-sticky-block__book-now">
            <a :href="BASE_URL">
              <div class="booking-now">
                <p>{{ $t("common.book_now") }}</p>
              </div>
            </a>
          </div>
          <div
            class="
              header-sticky-block__translate-dropdown-box
              g2j-dropdown-box g2j-dropdown-box--js
              enable-hover
            "
            :class="{
              'is-right-side': !isShowLanguageSelectionCenter,
              'is-center': isShowLanguageSelectionCenter,
            }"
          >
            <div class="g2j-dropdown-box__head">
              <div class="header-sticky-block__translate-field">
                <div
                  class="
                    header-sticky-block__translate-field__country-icon-shape
                  "
                >
                  <span
                    class="header-sticky-block__translate-field__country-icon"
                    :class="curLanguageSelected.icon_class"
                  />
                </div>
                <!-- .header-sticky-block__translate-field__country-icon-shape -->
              </div>
              <!-- .header-sticky-block__translate-feature -->
            </div>
            <!-- .g2j-dropdown-box__head -->

            <div class="g2j-dropdown-box__body g2j-dropdown-box-body">
              <div class="g2j-dropdown-box__body-inner">
                <div
                  class="
                    header-sticky-block__translate-dropdown-box__select-list
                  "
                >
                  <template v-for="(languageInfoItem, key) in languageInfoList">
                    <div
                      :key="key"
                      class="
                        header-sticky-block__translate-dropdown-box__select-item
                        enable-hover
                      "
                      :class="{
                        'is-active': language === key,
                      }"
                      @click.stop="changeLanguage(key)"
                    >
                      <div
                        class="
                          header-sticky-block__translate-dropdown-box__country-icon-shape
                        "
                      >
                        <span
                          class="
                            header-sticky-block__translate-dropdown-box__country-icon
                          "
                          :class="languageInfoItem.icon_list_class"
                        />
                      </div>
                      <!-- .header-sticky-block__translate-dropdown-box__country-icon-shape -->

                      <div
                        class="
                          header-sticky-block__translate-dropdown-box__label
                        "
                      >
                        {{ languageTitleList[key] }}
                      </div>
                      <!-- .header-sticky-block__translate-dropdown-box__label -->
                    </div>
                    <!-- .header-sticky-block__translate-dropdown-box__select-item -->
                  </template>
                </div>
              </div>
            </div>
          </div>
          <!-- .g2j-dropdown-box -->
        </div>
        <!-- .header-sticky-block__feature-col -->
      </div>
      <!-- .header-sticky-block -->
    </div>
  </header>
  <!-- .header-sticky-section -->
</template>

<script>
import {
  BASE_URL,
  IMAGE_URL,
  CACHE_VERSION,
  LANGUAGE_VALID,
  LANGUAGE_DEFAULT,
  IS_MOBILE,
} from "~jsDefinePath/general";
import { ROUTER_NAME } from "~jsBasePath/vue-router/router-define";
import { mapState } from "~jsLibPath/lib-manager";
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
  COMMIT_KEY as PAGE_INFO_COMMIT_KEY,
} from "~jsBasePath/vuex/modules/page-info-module";
export default {
  data() {
    return {
      BASE_URL,
      IMAGE_URL,
      CACHE_VERSION,
      LANGUAGE_VALID,
      ROUTER_NAME,
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
      IS_MOBILE,
    };
  },

  created() {},
  computed: {
    ...mapState(PAGE_INFO_MODULE_NAME, {
      language: "language",
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
    isShowLanguageSelectionCenter() {
      return this.hasUserInfo;
    }, // isShowLanguageSelectionCenter()
  },
  methods: {
    changeLanguage(selectLanguage) {
      if (selectLanguage !== this.language && LANGUAGE_VALID[selectLanguage]) {
        this.$store.commit(PAGE_INFO_COMMIT_KEY.setLanguage, selectLanguage);

        const routerParams = this.$route.params;

        routerParams.language =
          selectLanguage === LANGUAGE_DEFAULT ? undefined : selectLanguage;

        this.$router.replace({
          name: this.$route.name,
          params: routerParams,
          query: this.$route.query,
        });
      }
    }, // changeLanguage()
  },
};
</script>
