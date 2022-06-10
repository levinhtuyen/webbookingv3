<template>
  <section class="footer-section">
    <div class="container">
      <div class="footer-block">
        <div class="footer-block__head">
          <div class="footer-block__logo-col">
            <a
              :href="BASE_URL"
              class="footer-block__logo-img-field"
            >
              <img
                :src="IMAGE_URL + '/logo/go2joy-logo.png?v=' + CACHE_VERSION"
                alt="Go2Joy"
                width="100%"
                height="100%"
                class="footer-block__logo-img"
              />
            </a>
            <!-- .footer-block__logo-img-field -->

            <div class="footer-block__slogan-field">
              <h2 class="footer-block__slogan-title-label">
                {{ $t("common.more_booking") }}
              </h2>
              <!-- .footer-block__slogan-title-label -->

              <div class="footer-block__slogan-content">
                {{ $t("common.short_intro") }}
              </div>
              <!-- .footer-block__slogan-content -->
            </div>
            <!-- .footer-block__slogan-field -->
          </div>
          <!-- .footer-block__logo-col -->

          <!-- <div class="footer-block__smart-phone-img-col">
            <img
              src=""
              :data-src="
                IMAGE_URL + '/go2joy-iphone-img.png?v=' + CACHE_VERSION
              "
              alt="Go2Joy application"
              width="100%"
              height="100%"
              class="footer-block__smart-phone-img lazyload"
            />
          </div> -->
          <!-- .footer-block__smart-phone-img-col -->

          <div class="footer-block__meta-info-col">
            <div class="footer-block__meta-info-col--container-qr-download">
              <div class="footer-block__qrcode-img-col">
                <div class="footer-block__qrcode-img-outer">
                  <div class="footer-block__qrcode-img-inner">
                    <img
                      :src="IMAGE_URL + '/qrcode.png?v=' + CACHE_VERSION"
                      alt="Go2Joy"
                      width="100%"
                      height="100%"
                      class="footer-block__qrcode-img"
                    />
                  </div>
                  <!-- .footer-block__qrcode-img-inner -->
                </div>
                <!-- .footer-block__qrcode-img-outer -->
              </div>
              <!-- .footer-block__qrcode-img-col -->

              <div class="footer-block__download-app-img-col">
                <a
                  class="footer-block__download-app-img-outer"
                  :class="{
                    'enable-hover': !IS_MOBILE,
                  }"
                  :href="downloadAppleAppUrl"
                  target="_blank"
                  @click.prevent="
                    trackingDablena(
                      downloadAppleAppUrl,
                      true,
                      DABLE_TRACKING.TRACKING_VIEW_DOWNLOAD_IOS
                    )
                  "
                >
                  <img
                    :src="IMAGE_URL + '/apple-download-btn.png'"
                    alt="Go2Joy apple application"
                    width="100%"
                    height="100%"
                    class="footer-block__download-app-img"
                  />
                </a>
                <!-- .footer-block__download-app-img-outer -->

                <a
                  class="footer-block__download-app-img-outer"
                  :class="{
                    'enable-hover': !IS_MOBILE,
                  }"
                  :href="downloadAppAndroidUrl"
                  target="_blank"
                  @click.prevent="
                    trackingDablena(
                      downloadAppAndroidUrl,
                      true,
                      DABLE_TRACKING.TRACKING_VIEW_DOWNLOAD_ANDROID
                    )
                  "
                >
                  <img
                    :src="IMAGE_URL + '/android-download-btn.png'"
                    alt="Go2Joy android application"
                    width="100%"
                    height="100%"
                    class="footer-block__download-app-img"
                  />
                </a>
                <!-- .footer-block__download-app-img-outer -->
              </div>
              <!-- .footer-block__download-app-img-col -->
            </div>

            <div class="footer-block__footer">
              <div class="footer-block__follow-info-group">
                <div class="footer-block__follow-info-group__title">
                  {{ $t("common.follow_us") }}
                </div>

                <div class="footer-block__follow-info-group__follow-wrap">
                  <a
                    class="
                      footer-block__follow-info-group__follow-item
                      footer-block__follow-info-group__follow-item--fb
                    "
                    :class="{
                      'enable-hover': !IS_MOBILE,
                    }"
                    :href="fbUrl"
                    target="_blank"
                    @click.prevent="
                      trackingDablena(
                        fbUrl,
                        true,
                        DABLE_TRACKING.TRACKING_VIEW_FACEBOOK_PAGE
                      )
                    "
                    rel="nofollow"
                  >
                    <g2j-image
                      :urlImg="IMAGE_URL+'/svg/fb.svg'"
                      :altImg="'fb-image'"
                    ></g2j-image>
                  </a>

                  <a
                    class="
                      footer-block__follow-info-group__follow-item
                      footer-block__follow-info-group__follow-item--yt
                    "
                    :class="{
                      'enable-hover': !IS_MOBILE,
                    }"
                    :href="ytUrl"
                    target="_blank"
                    @click.prevent="
                      trackingDablena(
                        ytUrl,
                        true,
                        DABLE_TRACKING.TRACKING_VIEW_YOUTUBE_CHANNEL
                      )
                    "
                    rel="nofollow"
                  >
                    <!-- <i class="fab fa-youtube" /> -->
                    <g2j-image
                      :urlImg="IMAGE_URL+'/svg/youtube.svg'"
                      :altImg="'youtube-image'"
                    ></g2j-image>
                  </a>

                  <a
                    class="
                      footer-block__follow-info-group__follow-item
                      footer-block__follow-info-group__follow-item--fb
                    "
                    :class="{
                      'enable-hover': !IS_MOBILE,
                    }"
                    :href="tiktokUrl"
                    target="_blank"
                    rel="nofollow"
                  >
                    <g2j-image
                      :urlImg="IMAGE_URL+'/svg/tiktok.svg'"
                      :altImg="'tiktok-image'"
                    ></g2j-image>
                  </a>

                  <a
                    class="
                      footer-block__follow-info-group__follow-item
                      footer-block__follow-info-group__follow-item--fb
                    "
                    :class="{
                      'enable-hover': !IS_MOBILE,
                    }"
                    :href="instagramUrl"
                    target="_blank"
                    rel="nofollow"
                  >
                    <g2j-image
                      :urlImg="IMAGE_URL+'/svg/instagram.svg'"
                      :altImg="'instagram-image'"
                    ></g2j-image>
                  </a>

                </div>
                <!-- .footer-block__follow-info-group__follow-wrap -->
              </div>
              <!-- .footer-block__follow-info-group -->
            </div>
            <!-- .footer-block__footer -->

          </div>
          <!-- .footer-block__meta-info-col -->
        </div>
        <!-- .footer-block__head -->

        <div class="footer-block__body">
          <div class="footer-block__g2j-info-wrap">
            <template v-for="(go2joyInfoItem, idx) in go2joyInfoList">
              <div
                :key="idx"
                class="footer-block__g2j-info-wrap-item"
              >
                <div
                  v-if="go2joyInfoItem.title"
                  class="footer-block__g2j-info-wrap-item__head"
                >
                  {{ go2joyInfoItem.title }}
                </div>
                <!-- .footer-block__g2j-info-wrap-item__head -->

                <div class="footer-block__g2j-info-wrap-item__body">
                  <ul class="footer-block__g2j-info-list">
                    <template v-for="(go2joyInfoDataItem, idx) in go2joyInfoItem.data">
                      <li
                        :key="idx"
                        class="footer-block__g2j-info-item"
                      >

                        <template v-if="go2joyInfoDataItem.path">
                          <router-link
                            v-slot="{ href }"
                            :to="go2joyInfoDataItem.path[language]"
                            :class="{
                              'enable-hover': !IS_MOBILE,
                            }"
                          >
                            <a
                              :href="href"
                              @click.prevent="
                                trackingDablena(
                                  href,
                                  false,
                                  go2joyInfoDataItem.tracking_dable_name
                                )
                              "
                              :rel="go2joyInfoDataItem.rel"
                            >
                              {{ go2joyInfoDataItem.title }}
                            </a>
                          </router-link>
                        </template>

                        <template v-else-if="go2joyInfoDataItem.url">
                          <a
                            :class="{
                              'enable-hover': !IS_MOBILE,
                            }"
                            :href="go2joyInfoDataItem.url"
                            target="_blank"
                            @click.prevent="
                              trackingDablena(
                                go2joyInfoDataItem.url,
                                true,
                                go2joyInfoDataItem.tracking_dable_name
                              )
                            "
                            :rel="go2joyInfoDataItem.rel"
                          >
                            {{ go2joyInfoDataItem.title }} {{go2joyInfoDataItem.ref}}
                          </a>
                        </template>

                        <template v-else-if="go2joyInfoDataItem.phone">
                          <span class="footer-block__g2j-info-label">
                            {{ go2joyInfoDataItem.title }}:
                          </span>

                          <a
                            class="footer-block__g2j-info-contact-label"
                            :class="{
                              'enable-hover': !IS_MOBILE,
                            }"
                            :href="'tel:' + go2joyInfoDataItem.phone"
                          >
                            {{ go2joyInfoDataItem.phone }}
                          </a>
                        </template>

                        <template v-else-if="go2joyInfoDataItem.email">
                          <span class="footer-block__g2j-info-label">
                            {{ go2joyInfoDataItem.title }}:
                          </span>

                          <a
                            class="footer-block__g2j-info-contact-label"
                            :class="{
                              'enable-hover': !IS_MOBILE,
                            }"
                          >
                            <span
                              class="footer-block__g2j-info-contact-label--email"
                              @click="onMail(go2joyInfoDataItem.email)"
                              v-html="go2joyInfoDataItem.emailHidden"
                            ></span>
                          </a>
                        </template>

                        <template v-else>
                          {{ go2joyInfoDataItem.title }}
                        </template>
                      </li>
                      <!-- .footer-block__g2j-info-item -->
                    </template>
                  </ul>
                  <!-- .footer-block__g2j-info-list -->
                </div>

                <!-- .footer-block__g2j-info-wrap-item__body -->
              </div>

              <!-- .footer-block__g2j-info-wrap-item -->
            </template>
          </div>
          <div
            v-if=" ENV == ARR_ENV.production"
            class="footer-block__protection_dmca"
          >
            <a
              href="//www.dmca.com/Protection/Status.aspx?ID=c5d2b624-d5b5-4e9e-a6a6-ef7dff20ce92"
              title="DMCA.com Protection Status"
              class="dmca-badge"
            > <img
                src="https://images.dmca.com/Badges/dmca_protected_sml_120m.png?ID=c5d2b624-d5b5-4e9e-a6a6-ef7dff20ce92"
                alt="DMCA.com Protection Status"
              /></a>
            <!-- <script src="https://images.dmca.com/Badges/DMCABadgeHelper.min.js"> </script> -->
          </div>
          <!-- .footer-block__g2j-info-wrap -->
        </div>
        <!-- .footer-block__body -->
      </div>
      <!-- .footer-block -->
    </div>
    <!-- .container -->
  </section>
  <!-- .footer-section -->
</template>

<script>
  import { mapState } from "~jsLibPath/lib-manager";
  import {
    IMAGE_URL,
    CACHE_VERSION,
    IS_MOBILE,
    BASE_URL,
    LANGUAGE_VALID,
  } from "~jsDefinePath/general";
  import { DABLE_TRACKING } from "~jsDefinePath/tracking-define";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/page-info-module";
  import {
    getAboutUsPagePath,
    getTermConditionPagePath,
    getArticlePath,
  } from "~jsHelperPath/util/HandleUrl";
  import { G2JDablenaTracking } from "~jsHelperPath/util/HandleTracking";
  import { ARR_ENV, ENV } from "~jsDefinePath/general";

  export default {
    data() {
      return {
        ARR_ENV,
        ENV,
        IMAGE_URL,
        CACHE_VERSION,
        IS_MOBILE,
        BASE_URL,
        DABLE_TRACKING,

        downloadAppleAppUrl: "https://apps.apple.com/app/id1185445287?mt=8",
        downloadAppAndroidUrl:
          "https://play.google.com/store/apps/details?id=com.appromobile.hotel&hl=en&gl=US",

        ytUrl: "https://www.youtube.com/channel/UCSDPkEcsKB9nJqc_fbWwSdw",
        fbUrl: "https://www.facebook.com/go2joy.hotels",
        tiktokUrl: "https://vm.tiktok.com/ZSeLHLbHH/",
        instagramUrl: "https://www.instagram.com/go2joy_vietnam/",
      };
    },
    components: {
      "g2j-image": () =>
        import("~jsPartialPath/global/component/g2j-img/Go2JoyImages.vue"),
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),

      go2joyInfoList() {
        return [
          {
            data: [
              {
                title: this.$t("common.about_us"),
                path: getAboutUsPagePath(),
              },
              {
                title: this.$t("common.contact_with_us"),
                url: "https://docs.google.com/forms/d/e/1FAIpQLScCtwnRHg0BcfpQ_I2fKWAMY5CDwFytHWhx1oI8YlOA99wu2Q/viewform",
                tracking_dable_name: DABLE_TRACKING.TRACKING_CONTACT_US,
                rel: "nofollow",
              },
              {
                title: this.$t("common.blog"),
                url: BASE_URL + getArticlePath()?.default,
              },
              {
                title: this.$t("common.term_and_privacy_policy"),
                path: getTermConditionPagePath(),
              },
              {
                title: this.$t("common.regulations_on_operating_website"),
                url: "https://drive.google.com/file/d/16_4M-M4QWKVMtVIiu_DExqRgsQww_7xc/view",
                rel: "nofollow",
              },
              {
                title: this.$t("common.posting_regulations"),
                url: "https://drive.google.com/file/d/1MtCQ9KVMUz5x3pF1_TcOFG3v3cE3FTlR/view",
                rel: "nofollow",
              },
              {
                title: this.$t("common.privacy_policy"),
                url: "https://drive.google.com/file/d/1gLudtfxo8EufXxCRULaFObaBjGgW4-Be/view",
                rel: "nofollow",
              },
              {
                title: this.$t("common.complaint_handling_policy"),
                url: "https://drive.google.com/file/d/1-Kfz5QPdKZhK1L_lFnTGZsVBBB4MEpds/view",
                rel: "nofollow",
              },
            ],
          }, // ABOUT US

          {
            title: this.$t("common.go2joy_vietnamese"),

            data: [
              {
                title: "Hotline",
                phone: "0931 836 836",
              },
              // {
              //   title: this.$t("common.northern_hotline"),
              //   phone: "077 789 2399",
              // },
              {
                title: this.$t("common.customer_support"),
                email: "cskh@go2joy.vn",
                emailHidden: ` cskh<!-- >@. -->@<!-- >@. -->go2joy<!-- >@. -->.<!-- >@. -->vn`,
              },
              {
                title: this.$t("common.contact_cooperation"),
                email: "support@go2joy.vn",
                emailHidden: ` support<!-- >@. -->@<!-- >@. -->go2joy<!-- >@. -->.<!-- >@. -->vn`,
              },
            ],
          }, // GO2JOY VIETNAM JSC
        ];
      }, // go2joyInfoList
    },

    created() {},
    mounted() {
      if (
        !document.head.querySelector(
          '[src="https://images.dmca.com/Badges/DMCABadgeHelper.min.js"]'
        ) &&
        ENV == ARR_ENV.production
      ) {
        const elDCMAScript = document.createElement("script");
        elDCMAScript.setAttribute(
          "src",
          "https://images.dmca.com/Badges/DMCABadgeHelper.min.js"
        );
        elDCMAScript.setAttribute("type", "text/javascript");
        document.head.appendChild(elDCMAScript);
      }
    },
    methods: {
      onMail(email) {
        window.location.href = `mailto:${email}`;
      },
      trackingDablena(href, isOpenNewTab, trackingName) {
        if (trackingName && typeof trackingName === "string") {
          G2JDablenaTracking(trackingName);
        }

        if (href && typeof href === "string") {
          if (href.includes("http") && isOpenNewTab) {
            window.open(href, "_blank");
          } else if (!isOpenNewTab) {
            window.location.href = href;
          } else if (!href.includes("http")) {
            this.$router.push(href);
          }
        }
      }, // trackingDablena()
    },
  };
</script>
