<template>
  <section class="footer-sticky-section">
    <div class="container">
      <div class="footer-sticky-block">
        <template v-for="footerItem, key in footerStickyItemList">
          <router-link
            :key="key"
            :to="footerItem.path[language]"
            class="footer-sticky-block__navigate-col"
            :class="{
              'is-active': footerItem.is_active,
              'disable-click': footerItem.disable_click,
              'enable-hover': !IS_MOBILE,
            }"
          >
            <div class="footer-sticky-block__navigate-col-inner">
              <div
                v-if="footerItem.title"
                class="footer-sticky-block__icon-shape"
                v-html="footerItem.icon"
              /> <!-- .footer-sticky-block__icon-shape -->
              <div class="footer-sticky-block__icon-title">
                {{ footerItem.title }}
              </div> <!-- .footer-sticky-block__icon-title -->
            </div> <!-- .footer-sticky-block__navigate-col-inner -->
          </router-link>
        </template>
      </div> <!-- .footer-sticky-block -->
    </div>
  </section> <!-- .footer-sticky-section -->
</template>

<script>
import {
  IS_MOBILE,
} from '~jsDefinePath/general';
import {
  mapState,
  mapGetters,
} from '~jsLibPath/lib-manager';
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
} from '~jsBasePath/vuex/modules/page-info-module';
import {
  ROUTER_NAME,
} from '~jsBasePath/vue-router/router-define';
import {
  getHomePath,
  getPromotionPath,
  getLoginPath,
  getAccountPagePath,
} from '~jsHelperPath/util/HandleUrl';

export default {
  data() {
    return {
      IS_MOBILE,
    }
  },

  computed: {
    ...mapState(PAGE_INFO_MODULE_NAME, {
      language: 'language',
    }),

    ...mapGetters(PAGE_INFO_MODULE_NAME, {
      hasUserInfo: 'hasUserInfo',
    }),

    loginPageInfo() {
      return  {
        icon: '<span class="footer-sticky-block__icon footer-sticky-block__user-icon"></span>',
        title: this.$t('common.account_icon_title'),
        path: getLoginPath(),
        router_name: ROUTER_NAME['login-page'],
      };
    }, // loginPageInfo

    footerStickyItemList() {
      return [
        {
          icon: '<span class="footer-sticky-block__icon footer-sticky-block__home-icon"></span>',
          title: this.$t('common.home_icon_title'),
          path: getHomePath(),
          is_active: this.$route.name === ROUTER_NAME['home-page'],
          disable_click: this.$route.name === ROUTER_NAME['home-page'],
        },
        {
          icon: '<span class="footer-sticky-block__icon footer-sticky-block__promotion-icon"></span>',
          title: this.$t('common.promotion_icon_title'),
          path: getPromotionPath({type: 1}),
          is_active: (
            this.$route.name === ROUTER_NAME['promotion-page'] &&
            this.$route.query.type == 1
          ),
          disable_click: (
            this.$route.name === ROUTER_NAME['promotion-page'] &&
            this.$route.query.type == 1
          ),
        },
        {
          icon: '<span class="footer-sticky-block__icon footer-sticky-block__user-icon"></span>',
          title: this.$t('common.account_icon_title'),
          path: this.accountRedirectPagePath,
          router_name: ROUTER_NAME['login-page'],
          is_active: (
            this.$route.name === ROUTER_NAME['login-page'] ||
            this.$route.name === ROUTER_NAME['sign-up-page'] ||
            this.$route.name === ROUTER_NAME['account-page'] ||
            this.$route.name === ROUTER_NAME['profile-page'] ||
            this.$route.name === ROUTER_NAME['forget-password-page'] ||
            this.$route.name === ROUTER_NAME['stamp-page'] ||
            this.$route.name === ROUTER_NAME['stamp-detail-page'] ||
            this.$route.name === ROUTER_NAME['coupon-page'] ||
            this.$route.name === ROUTER_NAME['point-page'] ||
            this.$route.name === ROUTER_NAME['booking-page'] ||
            this.$route.name === ROUTER_NAME['booking-detail-page']
          ),
          disable_click: (
            this.$route.name === ROUTER_NAME['account-page'] ||
            this.$route.name === ROUTER_NAME['sign-up-page'] ||
            this.$route.name === ROUTER_NAME['account-page']
          ),
        },
      ];
    }, // footerStickyItemList

    accountRedirectPagePath() {
      if(this.hasUserInfo) {
        return getAccountPagePath();
      }

      return getLoginPath();
    }, // isShowMyAccountLink
  },

  created() {},

  methods: {},
};
</script>
