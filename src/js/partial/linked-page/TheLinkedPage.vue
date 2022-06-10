<template>
  <div class="linked-page container">
    <h2 class="linked-page__title"> {{ $t("common.linked_account") }}</h2>
    <div class="linked-page__container-button">
      <div class="linked-page-button">
        <img
          :src="`${IMAGE_URL}/icon/account/fb_sign_in.svg`"
          width="30px"
          height="30px"
        />
        <p class="linked-page-button__title"> Facebook</p>
        <label class="switch">
          <input
            :disabled="isDisableFacebook"
            type="checkbox"
            v-model="facebook"
            @change="onChangeFacebook('facebook')"
          >
          <span class="slider round"></span>
        </label>
      </div>
      <div class="linked-page-button">
        <img
          :src="`${IMAGE_URL}/icon/account/gg_sign_in.svg`"
          width="30px"
          height="30px"
        />
        <p class="linked-page-button__title"> Google</p>
        <label class="switch">
          <input
            type="checkbox"
            v-model="google"
            :disabled="isDisableGoogle"
            @change="onChangeGoogle()"
          >
          <span class="slider round"></span>
        </label>
      </div>

    </div>

    <g2j-toast
      :key="'notify-error'"
      :is-active.sync="isShowError"
      :message="$t('common.update_fail')"
    ></g2j-toast>

    <g2j-toast
      :key="'notify-success'"
      :is-active.sync="isShowSuccess"
      :message="$t('common.update_success')"
      :type="'success'"
    ></g2j-toast>
    <!-- khi nao ranh gom 2 cai tren lai  -->
  </div>
</template>

<script>
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import { getToken, IMAGE_URL } from "~jsDefinePath/general";
  import { G2JFirebase } from "~jsHelperPath/util/HandleTracking";
  import { ARR_ENV, ENV } from "~jsDefinePath/general";

  export default {
    data() {
      return {
        IMAGE_URL,
        dataSocial: [],
        apple: false,
        facebook: false,
        google: false,
        fbSignInParams: {
          scope: "email,user_likes",
          return_scopes: true,
        },
        fbSignInParamsENVList: {
          [ARR_ENV.development]: {
            appId: "1801724940084193",
            appSecret: "badc3be68e1bbbb42be60ac24b862d58",
          },
          [ARR_ENV.staging]: {
            appId: "1801724940084193",
            appSecret: "badc3be68e1bbbb42be60ac24b862d58",
          },
          [ARR_ENV.production]: {
            appId: "1801724940084193",
            appSecret: "badc3be68e1bbbb42be60ac24b862d58",
          },
        },
        isShowError: false,
        isShowSuccess: false,
        isDisableGoogle: false,
        isDisableFacebook: false,
      };
    },
    methods: {
      async getLinkedAccount() {
        try {
          let res = await apiCaller({
            metaUrl: AJAX_URL.profile.getLinkedAccount,
            dataType: "json",
            method: "GET",
            contentType: "application/json; charset=utf-8",
            headers: {
              Authorization: getToken(),
            },
          });
          if (res && res.data) {
            this.dataSocial = res.data || [];
            this.facebook = res.data.facebook;
            this.google = res.data.google;
          }
          if (res.response && res.response.data.error) {
            console.log("error");
          }
          EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
        } catch (error) {
          console.log("error :>> ", error);
        }
      },
      onChangeGoogle() {
        if (this.google) {
          this.isDisableGoogle = true;
          this.googleSignIn();
        } else {
          this.updateLinkAccountSocial({ viaApp: 3, status: 0 });
        }
      },
      onChangeFacebook() {
        if (this.facebook) {
          this.isDisableFacebook = true;
          window.FB.login((response) => {
            if (!response.authResponse) {
              this.facebook = !this.facebook;
              this.isShowError = true;
              this.isDisableFacebook = false;
              return;
            }
            let params = {
              viaApp: 2,
              token: response.authResponse.accessToken,
              status: 1,
            };
            this.updateLinkAccountSocial(params);
          }, this.fbSignInParams);
        } else {
          this.updateLinkAccountSocial({ viaApp: 2, status: 0 });
        }
      },
      async updateLinkAccountSocial({ viaApp, token, email, status }) {
        try {
          let _params = {
            viaApp,
            token,
            email,
            status,
          };
          let res = await apiCaller({
            metaUrl: AJAX_URL.profile.updateLinkAccountSocial,
            dataType: "json",
            data: _params,
            method: "POST",
            contentType: "application/json; charset=utf-8",
            headers: {
              Authorization: getToken(),
            },
          });
          if (res && res.data) {
            this.isShowSuccess = true;
          }
          if (res.response && res.response.data.error) {
            this.getLinkedAccount(); //neu cap nhat k thanh cong thi lay lai thong tin
          }
        } catch (error) {
          console.log("error :>> ", error);
        } finally {
          this.isDisableGoogle = false;
          this.isDisableFacebook = false;
        }
      },
      googleSignIn: function () {
        let self = this;
        //Google singin provider
        var ggProvider = new G2JFirebase.auth.GoogleAuthProvider();
        //Sign in with Google
        G2JFirebase.auth()
          .signInWithPopup(ggProvider)
          .then(function (result) {
            let emailGoogle = result?.additionalUserInfo?.profile?.email;
            let params = {
              viaApp: 3,
              token: result.credential.idToken,
              status: 1,
              email: emailGoogle,
            };
            self.updateLinkAccountSocial(params);
          })
          .catch(function (error) {
            console.error("Error: hande error here>>>", error);
            self.isShowError = true;
            self.google = !self.google;
            self.isDisableGoogle = false;
          });
      },
    },
    async created() {
      let self = this;
      window.fbAsyncInit = function () {
        window.FB.init({
          ...self.fbSignInParamWithCurENV,
          cookie: true, // enable cookies to allow the server to access the session
          xfbml: true, // parse social plugins on this page
          version: "v3.3", // use graph api version 2.8
        });
      };
      (function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");

      self.getLinkedAccount();

      // EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
    },
    computed: {
      fbSignInParamWithCurENV() {
        return this.fbSignInParamsENVList[ENV];
      }, // fbSignInParamWithCurENV
    },
  };
</script>

<style src="./linked-page-style.css"></style>
