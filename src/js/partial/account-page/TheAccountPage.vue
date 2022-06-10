<template>
  <div
    v-if="$route.name === 'account-page'"
    ref="test"
    class="account-page"
  >
    <section class="account-section">
      <div class="container">
        <div class="account-block">
          <h2>{{ $t('account.account') }}</h2>
        </div>
        <div>
          <div class="custom-card">
            <div class="title-outer">
              {{ $t('account.personal') }}
            </div>
            <div class="row-outer">
              <ul>
                <li>
                  <router-link :to="{name: 'profile-page'}">
                    <img
                      :src="IMAGE_URL + '/' + iconMyProfile"
                      width="25"
                      height="25"
                    >
                    {{ $t('account.my_profile') }}
                  </router-link>
                </li>
                <li>
                  <router-link :to="{name: 'booking-page'}">
                    <img
                      :src="IMAGE_URL + '/' + icon"
                      width="25"
                      height="25"
                    >
                    {{ $t('account.my_booking') }}
                  </router-link>
                </li>
                <li>
                  <router-link :to="{name: 'stamp-page'}">
                    <img
                      :src="IMAGE_URL + '/' + iconMyStamp"
                      width="25"
                      height="25"
                    >
                    {{ $t('account.my_stamp') }}
                  </router-link>
                </li>
                <li>
                  <router-link :to="{name: 'point-page'}">
                    <img
                      :src="IMAGE_URL + '/' + iconMyPoint"
                      width="25"
                      height="25"
                    >
                    {{ $t('account.my_point') }}
                  </router-link>
                </li>
                <li>
                  <router-link :to="{name: 'coupon-page'}">
                    <img
                      :src="IMAGE_URL + '/' + iconMyCoupon"
                      width="25"
                      height="25"
                    >
                    {{ $t('account.my_coupon') }}
                  </router-link>
                </li>
                <li>
                  <router-link :to="{name: 'linked-page'}">
                    <img
                      :src="IMAGE_URL + '/' + iconLinked"
                      width="25"
                      height="25"
                    >
                    {{ $t('account.linked_account') }}
                  </router-link>
                </li>
                <li>
                  <a @click="signOut()">
                    <img
                      :src="IMAGE_URL + '/' + iconSignOut"
                      width="25"
                      height="25"
                    >
                    {{ $t('account.sign_out') }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="custom-card">
            <div class="title-outer">
              {{ $t('account.information') }}
            </div>
            <div class="row-outer">
              <ul>
                <li>
                  <router-link :to="{name: 'term-condition-page'}">
                    <img
                      :src="IMAGE_URL + '/' + iconTerm"
                      width="25"
                      height="25"
                    >
                    {{ $t('account.terms_privacy_policy') }}
                  </router-link>
                </li>
                <li>
                  <router-link :to="{name: 'about-us-page'}">
                    <img
                      :src="IMAGE_URL + '/' + iconAboutUs"
                      width="25"
                      height="25"
                    >
                    {{ $t('account.about_us') }}
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import { IMAGE_URL } from "~jsDefinePath/general";
  import { DISPATH_KEY as PAGE_INFO_DISPATCH_KEY } from "~jsBasePath/vuex/modules/page-info-module";
  import { ROUTER_NAME } from "~jsBasePath/vue-router/router-define";
  import { G2JRouter, getG2JRoute } from "~jsHelperPath/util/HandleRouterGlobal";
  export default {
    data() {
      return {
        IMAGE_URL,
        icon: "icon/account/clock.png",
        iconMyProfile: "icon/account/profile.png",
        iconMyStamp: "icon/account/stamp.png",
        iconMyPoint: "icon/account/point.png",
        iconMyCoupon: "icon/account/coupon.png",
        iconLinked: "icon/account/linked.svg",
        iconSignOut: "icon/account/sign-out.png",
        iconTerm: "icon/account/term.png",
        iconAboutUs: "icon/account/about-us.png",
      };
    },
    created() {
      EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
    },
    methods: {
      signOut() {
        // localStorage.clear();
        localStorage.removeItem("tokenSocial");
        localStorage.removeItem("token");
        localStorage.removeItem("viaApp");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("expiresAt");
        localStorage.removeItem("access_token");
        localStorage.removeItem("profile");
        localStorage.removeItem("emailGoogle");
        sessionStorage.removeItem("paymentInfo");

        // NOTE - remove user profile in vuex 'page-info-module'
        this.$store.dispatch(PAGE_INFO_DISPATCH_KEY.clearUserInfo);
        // this.$router.push({ name: 'login-page' });
        G2JRouter.replace({ name: ROUTER_NAME["login-page"] });
      },
    },
  };
</script>

<style src="./account-page-style.css"></style>
