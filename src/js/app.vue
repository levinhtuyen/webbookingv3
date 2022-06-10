<template>
  <div class="app main-container">
    <!-- <keep-alive :include="['the-home-page', 'the-list-task-page']">
      <router-view />
    </keep-alive> -->

    <TheHeaderStickySection />

    <!-- <router-view /> -->
    <keep-alive :include="['HotelList']">
      <router-view />
    </keep-alive>

    <TheFooterStickySection />

    <!-- NOTE - Nếu đặt thêm 1 component có update ở dưới router-view -> router view sẽ tự update khi component default/other change -->
    <transition :name="(isShowLoading ? '' : 'fade')">
      <TheG2jLoading
        v-show="isShowLoading"
        :key="routerViewCacheVersion"
        :extend-class="extendLoadingClass"
      />
    </transition>
    <TheG2JDirectAppNoticeModal
      :is-show="isShowDirectAppNoticeModal"
      @onCloseModal="closeDirectAppNoticeModal"
    >

    </TheG2JDirectAppNoticeModal>
  </div>
  <!-- .vue-app -->
</template>

<script>
  import { mapGetters, mapState } from "~jsLibPath/lib-manager";
  import { EVENT_BUS_KEY } from "~jsDefinePath/event-bus";
  import { LOCAL_STORAGE_KEY } from "~jsDefinePath/local-storage";
  import {
    MODULE_NAME as PAGE_INFO_MODULE_NAME,
    COMMIT_KEY as PAGE_INFO_COMMIT_KEY,
    DISPATH_KEY as PAGE_INFO_DISPATCH_KEY,
  } from "~jsBasePath/vuex/modules/page-info-module";
  import { onVisibilityChange } from "~jsHelperPath/util/PrivateEventCustom";
  // import TheHeaderStickySection from "~jsPartialPath/global/component/header-sticky-v4/TheHeaderStickySectionv4.vue";
  // import TheFooterStickySection from "~jsPartialPath/global/component/footer-sticky/TheFooterStickySection.vue";
  // import TheG2jLoading from "~jsPath/partial/global/component/go2joy-loading/TheG2jLoading.vue";

  export default {
    name: "App",

    components: {
      // TheHeaderStickySection,
      // TheFooterStickySection,
      // TheG2jLoading,
      TheHeaderStickySection: () =>
        import(
          "~jsPartialPath/global/component/header-sticky-v4/TheHeaderStickySectionv4.vue"
        ),
      TheFooterStickySection: () =>
        import(
          "~jsPartialPath/global/component/footer-sticky/TheFooterStickySection.vue"
        ),
      TheG2jLoading: () =>
        import(
          "~jsPath/partial/global/component/go2joy-loading/TheG2jLoading.vue"
        ),
      TheG2JDirectAppNoticeModal: () =>
        import(
          "~jsPartialPath/global/component/g2j-direct-app-notice-modal/TheG2JDirectAppNoticeModal.vue"
        ),
    },

    data() {
      return {
        TimeoutHandler: new TimeoutHandler(),

        routerViewCacheVersion: Date.now(),
        isFirstLoading: true,
        isShowLoading: true,
        loadingNameSpace: "",
        extendLoadingClass: "is-fill",
        isSetPersonalLocationInfo: false,

        // NOTE - Element for header translate dropdownbox
        elHeaderBlockTranslateDropdownBox: null,
        elHeaderBlockTranslateFieldCountryIcon: null,
        elHeaderBlockTranslateFieldLabel: null,
        elHeaderBlockTranslateDropdownBoxSelectItem: null,
        elHeaderBlockTranslateDropdownBoxLabel: null,

        objTranslateDropdownBoxSelectItemInfoWithLanguage: {
          vi: {
            order: 0,
            suffix_icon_class: "vn",
            label: {
              vi: "Tiếng Việt",
              en: "Tiếng anh",
            },
          },

          en: {
            order: 1,
            suffix_icon_class: "uk",
            label: {
              vi: "Vietnamese",
              en: "English",
            },
          },
        }, // objTranslateDropdownBoxSelectItemInfoWithLanguage {...}
        isShowDirectAppNoticeModal: false,
      };
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
        personalLocationInfo: "personalLocationInfo",
        hasUserInfo: "hasUserInfo",
      }),

      ...mapGetters(PAGE_INFO_MODULE_NAME, ["curProvinceSn"]),
    },

    created() {
      const self = this;

      self.initSetupDynamicDataStore();

      self.handleEventBusListender();

      let checkUserInfo;
      if (localStorage.userInfo) {
        // NOTE - Check JSON is valid format
        if (
          /^[\],:{}\s]*$/.test(
            localStorage.userInfo
              .replace(/\\["\\\/bfnrtu]/g, "@")
              .replace(
                /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                "]"
              )
              .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
          )
        ) {
          //the json is ok
          checkUserInfo = JSON.parse(localStorage.userInfo);
          if (
            localStorage.userInfo &&
            (localStorage.userInfo === "[object Object]" ||
              typeof checkUserInfo != "string")
          ) {
            localStorage.removeItem("userInfo");
            localStorage.removeItem("tokenSocial");
            localStorage.removeItem("token");
            localStorage.removeItem("viaApp");
            localStorage.removeItem("userInfo");
            localStorage.removeItem("expiresAt");
            localStorage.removeItem("access_token");
            localStorage.removeItem("profile");
            sessionStorage.removeItem("paymentInfo");

            // NOTE - remove user profile in vuex 'page-info-module'
            this.$store.dispatch(PAGE_INFO_DISPATCH_KEY.clearUserInfo);
          }
        }
      }

      const profileInfo = localStorage.getItem("userInfo")
        ? JSON.parse(
            decodeURIComponent(
              escape(window.atob(localStorage.getItem("userInfo")))
            )
          )
        : "";

      if (self.isEmpty(profileInfo)) {
        self.handleKeepLogin();
      }
      // self.handleKeepLogin();

      onVisibilityChange(document, function () {
        // NOTE - if tab is active again, this event will fired
        if (!document.hidden) {
          // NOTE - after tab is actiev again we will execute more than 1 condition, so we will use if > if
          if (
            localStorage[LOCAL_STORAGE_KEY.G2J_CUR_PROVINCE_SN] &&
            self.curProvinceSn !=
              localStorage[LOCAL_STORAGE_KEY.G2J_CUR_PROVINCE_SN]
          ) {
            location.reload();
          }
        }
      });
    },

    mounted() {
      const self = this;
      setTimeout(function () {
        self.removeG2JLoadingSectionTemplateNJK();
      }, 150);
    },

    methods: {
      isEmpty: _.isEmpty,
      closeDirectAppNoticeModal() {
        this.isShowDirectAppNoticeModal = false;
      },
      removeG2JLoadingSectionTemplateNJK() {
        const elG2JLoadingSection = document.getElementById(
          "g2j-loading-section--template-njk"
        );

        if (elG2JLoadingSection) {
          elG2JLoadingSection.remove();
        }
      }, // removeG2jLoadingSectionTemplateNJK()

      initSetupDynamicDataStore() {
        // NOTE - Init setup for personalLocationInfo
        let tmpPersonalLocationInfo =
          localStorage[LOCAL_STORAGE_KEY.G2J_PERSONAL_LOCATION_INFO];

        if (tmpPersonalLocationInfo) {
          tmpPersonalLocationInfo = JSON.parse(tmpPersonalLocationInfo);

          tmpPersonalLocationInfo.longitude = tmpPersonalLocationInfo.longitude
            ? tmpPersonalLocationInfo.longitude
            : this.personalLocationInfo.longitude;

          tmpPersonalLocationInfo.latitude = tmpPersonalLocationInfo.latitude
            ? tmpPersonalLocationInfo.latitude
            : this.personalLocationInfo.latitude;

          tmpPersonalLocationInfo.provinceSn = tmpPersonalLocationInfo.provinceSn
            ? tmpPersonalLocationInfo.provinceSn
            : this.personalLocationInfo.provinceSn;

          this.$store.commit(
            PAGE_INFO_COMMIT_KEY.setPersonalLocationInfo,
            tmpPersonalLocationInfo
          );
        }
      }, // initSetupDynamicDataStore()

      handleEventBusListender() {
        const self = this;

        EventBus.on("UPDATE_ROUTER_VIEW", function (cache) {
          self.routerViewCacheVersion = cache;
        });

        // NOTE - Handle is_show_router_loading
        const hideRouterLoadingTimeout = self.TimeoutHandler.init(
          "hideRouterLoading",
          150,
          function () {
            self.loadingNameSpace = "";
            self.isShowLoading = false;
          }
        );

        EventBus.on(
          EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING,
          function (requestLoadingInfo) {
            if (self.isFirstLoading) {
              self.isFirstLoading = false;
            }

            if (
              (typeof requestLoadingInfo === "boolean" && requestLoadingInfo) ||
              (typeof requestLoadingInfo === "object" &&
                requestLoadingInfo.is_show)
            ) {
              hideRouterLoadingTimeout.clear();
              self.isShowLoading = true;

              if (typeof requestLoadingInfo === "object") {
                self.extendLoadingClass = requestLoadingInfo.extend_class || "";
                self.loadingNameSpace = requestLoadingInfo.namespace || "";
              }
            } else if (
              !self.loadingNameSpace ||
              (typeof requestLoadingInfo === "object" && requestLoadingInfo)
            ) {
              hideRouterLoadingTimeout.handle();
            }
          }
        );

        // NOTE - redirect 404 page
        EventBus.on("REDIRECT-404-PAGE", () => {
          this.$router.push({ name: "not-found-page" });
        });

        // NOTE - update user profile
        EventBus.on(EVENT_BUS_KEY.UPDATE_USER_PROFILE, function () {
          self.handleKeepLogin();
        });

        EventBus.on(EVENT_BUS_KEY.OPEN_MODAL_DIRECT_APP, function (val) {
          self.isShowDirectAppNoticeModal = val;
        });
      }, // handleEventBusListender()

      handleKeepLogin() {
        this.$store.dispatch(PAGE_INFO_DISPATCH_KEY.getAjaxUserProfile);
      }, // handleKeepLogin()
    },
  };
</script>
