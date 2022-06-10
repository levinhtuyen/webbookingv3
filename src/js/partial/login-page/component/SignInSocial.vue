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
      <GoogleLogin
        :params="ggSignInParamWithCurENV"
        :onSuccess="onSuccess"
        :onFailure="onFailure"
      >
        <img
          src="../../../../image/icon/google-logo.svg"
          width="100%"
          height="100%"
        />
      </GoogleLogin>
    </div>
  </div>
</template>

<script>
  import { ARR_ENV, ENV } from "~jsDefinePath/general";
  import GoogleLogin from "vue-google-login";

  Vue.use(vuelidate.default);

  import {
    lodash as _,
    Vue,
    mapGetters,
    mapActions,
    mapState,
    required,
    minLength,
  } from "~jsLibPath/lib-manager";

  import {
    MODULE_NAME as PAGE_INFO_MODULE_NAME,
    pageLoginSocialModule,
  } from "../page-module";

  export default {
    components: {
      GoogleLogin,
    },
    data() {
      return {
        username: "",
        password: "",
        submited: false,

        ggSignInParamsENVList: {
          [ARR_ENV.development]: {
            client_id:
              "996813056756-go8l6e9b6e2qrejkqre5o1ggmb6naau4.apps.googleusercontent.com", // login google
          },
          [ARR_ENV.staging]: {
            client_id:
              "996813056756-go8l6e9b6e2qrejkqre5o1ggmb6naau4.apps.googleusercontent.com", // login google
          },
          [ARR_ENV.production]: {
            client_id:
              "996813056756-cnd3cl4cd6l577e6pbj21brmhcsm1iaf.apps.googleusercontent.com", // login google
          },
        }, // ggSignInParamsENVList

        fbSignInParamsENVList: {
          // [ARR_ENV.development] : {
          //   appId: '600355787582449',
          //   appSecret: 'c4ce4ebd01cb36641d542eb419cd7911',
          // },
          // [ARR_ENV.staging] : {
          //   appId: '600355787582449',
          //   appSecret: 'c4ce4ebd01cb36641d542eb419cd7911',
          // },
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
      ...mapGetters(PAGE_INFO_MODULE_NAME, {
        isLoading: "isLoading",
        tokenInfo: "tokenInfo",
      }),

      ggSignInParamWithCurENV() {
        return this.ggSignInParamsENVList[ENV];
      }, // ggSignInParamWithCurENV

      fbSignInParamWithCurENV() {
        return this.fbSignInParamsENVList[ENV];
      }, // fbSignInParamWithCurENV
    },

    validations: {
      username: {
        required,
      },
      password: {
        required,
      },
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

    methods: {
      ...mapActions(PAGE_INFO_MODULE_NAME, {
        getTokenSocial: "getTokenSocial",
      }),

      onFailure(error) {
        console.log("đăng nhập thất bại!");
      },

      onSuccess(googleUser) {
        const googleUserObject = googleUser;
        for (const key in googleUserObject) {
          if (
            googleUserObject[key].idpId &&
            googleUserObject[key].idpId == "google"
          ) {
            let domain = googleUserObject[key].idpId;
            let tokenInfo = {
              domain: domain,
              token: googleUserObject[key],
            };
            this.getTokenSocial(tokenInfo);
            break;
          }
        }
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
        console.log("OH NOES", error);
      },
    },
    beforeDestroy() {
      if (this.$store.hasModule(PAGE_INFO_MODULE_NAME)) {
        this.$store.unregisterModule(
          PAGE_INFO_MODULE_NAME,
          pageLoginSocialModule
        );
      }
    },
  };
</script>

<style>
  .fb-signin-button {
    display: inline-block;
  }
  #google-signin-btn-1 {
    padding: inherit;
    border: none;
    background: none;
  }
</style>
