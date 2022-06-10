<template>
  <div class="login-social-outer">
    <div class="facebook-outer">
      <fb-signin-button
        :params="fbSignInParams"
        @success="onSignInSuccess"
        @error="onSignInError"
      >
        <img
          src="../../../../image/icon/facebook-logo.svg"
          width="100%"
          height="100%"
        />
      </fb-signin-button>
    </div>
    <div class="google-outer">
      <button
        class="google-signin-button"
        @click="googleSignIn"
      >
        <img
          src="../../../../image/icon/google-logo.svg"
          width="100%"
          height="100%"
        />
      </button>
    </div>
  </div>
</template>

<script>
  import { ARR_ENV, ENV } from "~jsDefinePath/general";

  Vue.use(vuelidate.default);

  import { lodash as _ } from "~jsLibPath/lib-manager";

  import {
    MODULE_NAME as PAGE_INFO_MODULE_NAME,
    pageLoginSocialModule,
  } from "../page-module";
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import { G2JRouter, getG2JRoute } from "~jsHelperPath/util/HandleRouterGlobal";
  import { G2JFirebase } from "~jsHelperPath/util/HandleTracking";
  import { ROUTER_NAME } from "~jsBasePath/vue-router/router-define";
  import { EVENT_BUS_KEY } from "~jsDefinePath/event-bus";

  export default {
    data() {
      return {
        submited: false,
        errorList: [],

        fbSignInParamsENVList: {
          [ARR_ENV.development]: {
            appId: "694028141844484",
            appSecret: "badc3be68e1bbbb42be60ac24b862d58",
          },
          [ARR_ENV.staging]: {
            appId: "694028141844484",
            appSecret: "badc3be68e1bbbb42be60ac24b862d58",
          },
          [ARR_ENV.production]: {
            appId: "694028141844484",
            appSecret: "badc3be68e1bbbb42be60ac24b862d58",
          },
        },

        renderParams: {
          width: 250,
          height: 50,
          longtitle: true,
        },

        fbSignInParams: {
          scope: "email,user_likes",
          return_scopes: true,
        },
      };
    },

    computed: {
      // ggSignInParamWithCurENV() {
      //   return this.ggSignInParamsENVList[ENV];
      // }, // ggSignInParamWithCurENV

      fbSignInParamWithCurENV() {
        return this.fbSignInParamsENVList[ENV];
      }, // fbSignInParamWithCurENV
    },

    created() {
      const self = this;
      if (!self.$store.hasModule(PAGE_INFO_MODULE_NAME)) {
        self.$store.registerModule(PAGE_INFO_MODULE_NAME, pageLoginSocialModule);
      }
      EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
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
    },

    beforeDestroy() {
      console.log("destroy");
    },

    methods: {
      googleSignIn: function () {
        let self = this;

        //Google singin provider
        var ggProvider = new G2JFirebase.auth.GoogleAuthProvider();
        //Sign in with Google
        G2JFirebase.auth()
          .signInWithPopup(ggProvider)
          .then(function (result) {
            let tokenInfo = {
              domain: result.credential.signInMethod,
              token: {
                token: result.credential.idToken,
                expires_at: 3600,
                // expires_at: 60 * 60 * 24 * 1000
              },
            };

            self.getTokenSocial(tokenInfo);
          })
          .catch(function (error) {
            console.error("Error: hande error here>>>", error.code);
          });
      },

      onSignInSuccess() {
        FB.api(
          "/me",
          "GET",
          { fields: "id,name,email,picture" },
          function (response) {
            console.log("response facebook:", response);
          }
        );
        this.getToken();
      },

      getToken() {
        let self = this;
        FB.getLoginStatus(function (response) {
          if (response.status === "connected") {
            let domain = response.authResponse.graphDomain;
            let tokenInfo = {
              domain: domain,
              token: response.authResponse,
            };
            self.getTokenSocial(tokenInfo);
          }
        });
      },

      onSignInError(error) {
        console.log("Đăng nhập facebook thất bại", error);
      },

      getTokenSocial(data) {
        let self = this;
        EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        let form = {};
        let token = data.token;

        if (data.domain == "facebook") {
          form = {
            token: token.accessToken ? token.accessToken : "",
            expiresAt: token.data_access_expiration_time
              ? token.data_access_expiration_time
              : "",
            viaApp: 2,
          };
        } else {
          form = {
            token: token.token ? token.token : "",
            expiresAt: token.expires_at ? token.expires_at : "",
            viaApp: 3,
          };
        }
        localStorage.setItem("viaApp", form.viaApp);
        apiCaller({
          metaUrl: AJAX_URL.login_v4.signIn,
          data: {
            email: "",
            mobile: "",
            countryCode: "",
            password: "",
            remember: 1,
            token: form.token,
            viaApp: Number(form.viaApp),
          },
          method: "POST",
          dataType: "json",
          error(err) {
            self.errorList = err.response?.data.error || [];
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
            // self.errorInfoSocial = 6; // 6: Tài khoản không tồn tại trên hệ thống
            localStorage.setItem("tokenSocial", form.token);
            G2JRouter.replace({
              name: ROUTER_NAME["sign-up-page"],
            });
          },
          success(objResponse) {
            if (!objResponse || objResponse.error || !objResponse.data) {
              EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
              self.errorList = objResponse.error || [];
              return;
            }

            let data = objResponse?.data ?? [];
            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("expiresAt", JSON.stringify(data.expiresAt));
            // localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
            // localStorage.setItem("userInfo", btoa(JSON.stringify(data.userInfo)));
            localStorage.setItem(
              "userInfo",
              btoa(unescape(encodeURIComponent(JSON.stringify(data.userInfo))))
            );
            const g2jRoute = getG2JRoute();

            if (g2jRoute.params.redirect) {
              G2JRouter.replace(g2jRoute.params.redirect);
            } else {
              G2JRouter.replace({ name: ROUTER_NAME["home-page"] });
            }

            EventBus.emit(EVENT_BUS_KEY.UPDATE_USER_PROFILE);
          },
          complete() {
            // EventBus.emit('IS_SHOW_ROUTER_LOADING', false);
          },
        });
        //     commit("setToken", form);
      },
    },
  };
</script>
