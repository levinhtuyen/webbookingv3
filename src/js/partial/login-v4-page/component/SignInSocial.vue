<template>
  <div class="login-social-outer">
    <div class="facebook-outer">
      <fb-signin-button
        :params="fbSignInParams"
        @success="onSignInSuccess"
        @error="onSignInError"
      >
        <img
          :src="`${IMAGE_URL}/icon/facebook-logo.svg`"
          width="100%"
          height="100%"
        />
      </fb-signin-button>
    </div>
    <div class="google-outer">
      <!-- <GoogleLogin
            class="google-signin-button"
            :params="ggSignInParamWithCurENV"
            :onSuccess="onSuccess"
            :onFailure="onFailure"
          >
            <img src="../../../../image/icon/google-logo.svg" width="100%" height="100%"/>
          </GoogleLogin> -->

      <button
        class="google-signin-button"
        @click="googleSignIn"
      >
        <img
          :src="`${IMAGE_URL}/icon/google-logo.svg`"
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

  import {
    IMAGE_URL,
    IS_MOBILE,
    ASSETS_SERVICE_URL,
    getToken,
  } from "~jsDefinePath/general";
  export default {
    props: {
      mobileUser: [Number, String],
      countryCodeUser: [Number, String],
    },
    data() {
      return {
        IMAGE_URL,
        submited: false,
        errorList: [],

        // ggSignInParamsENVList: {
        //   [ARR_ENV.development] : {
        //     client_id:
        //     "996813056756-go8l6e9b6e2qrejkqre5o1ggmb6naau4.apps.googleusercontent.com", // login google
        //   },
        //   [ARR_ENV.staging] : {
        //     client_id:
        //     "996813056756-go8l6e9b6e2qrejkqre5o1ggmb6naau4.apps.googleusercontent.com", // login google
        //   },
        //   [ARR_ENV.production] : {
        //     client_id:
        //     "996813056756-cnd3cl4cd6l577e6pbj21brmhcsm1iaf.apps.googleusercontent.com", // login google
        //   },
        // }, // ggSignInParamsENVList

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

    methods: {
      googleSignIn: function () {
        let self = this;

        //Google singin provider
        var ggProvider = new G2JFirebase.auth.GoogleAuthProvider();
        //Sign in with Google
        G2JFirebase.auth()
          .signInWithPopup(ggProvider)
          .then(function (result) {
            // var result = result;
            // var credential = result.credential;
            // var token = result.credential.accessToken;
            // var idToken = result.credential.idToken;
            // var user = result.user;
            // console.log('User>>Goole>>>>', user);
            // console.log('token', token);
            // console.log('idToken', idToken);
            // console.log('credential', credential);
            // userId = user.uid;
            // console.log('userId', userId);
            let emailGoogle = result?.additionalUserInfo?.profile?.email;
            localStorage.setItem(
              "emailGoogle",
              btoa(unescape(encodeURIComponent(JSON.stringify(emailGoogle))))
            );
            // localStorage.setItem(
            //   "userInfo",
            //   btoa(unescape(encodeURIComponent(JSON.stringify(data.userInfo))))
            // );
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

      // onFailure(error) {
      //   console.log("Đăng nhập google thất bại!", error);
      // },

      // onSuccess(googleUser) {
      //   const googleUserObject = googleUser;
      //   for(const key in googleUserObject) {
      //     if(googleUserObject[key].idpId && googleUserObject[key].idpId == "google") {
      //       let domain = googleUserObject[key].idpId;
      //       let tokenInfo = {
      //         domain: domain,
      //         token: googleUserObject[key],
      //       };
      //       this.getTokenSocial(tokenInfo);
      //       break;
      //     }
      //   }
      // },

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
      onSignInFb() {
        window.FB.login((response) => {
          let domain = response.authResponse.graphDomain;
          let params = {
            domain: domain,
            token: response.authResponse,
          };
          this.getTokenSocial(params);
        }, this.fbSignInParams);
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
          //sign in with fb
          form = {
            token: token.accessToken ? token.accessToken : "",
            expiresAt: token.data_access_expiration_time
              ? token.data_access_expiration_time
              : "",
            viaApp: 2,
          };
        } else {
          //sign in with gg
          form = {
            token: token.token ? token.token : "",
            expiresAt: token.expires_at ? token.expires_at : "",
            viaApp: 3,
          };
        }
        localStorage.setItem("viaApp", form.viaApp);

        let paramSignIn = {
          token: form.token,
          viaApp: Number(form.viaApp),
          mobile: self.mobileUser,
          countryCode: self.countryCodeUser,
        };
        // if (self.mobileUser && self.countryCodeUser) {
        //   paramSignIn.mobileUser = self.mobileUser;
        //   paramSignIn.countryCodeUser = self.countryCodeUser;
        // }
        apiCaller({
          metaUrl: AJAX_URL.login_v4.signInV4,
          data: paramSignIn,
          method: "POST",
          dataType: "json",
          error(err) {
            self.errorList = err?.data.error || [];
            // self.errorInfoSocial = 6; // 6: Tài khoản không tồn tại trên hệ thống
            let tokenSocial = localStorage.getItem("tokenSocial");
            if (!tokenSocial) {
              localStorage.setItem("tokenSocial", form.token);
              localStorage.setItem("viaApp", form.viaApp);
              if (self.$route.name == "sign-up-page") {
                window.location.reload(); // hoc tu Thanh ak
                return;
              }
              G2JRouter.replace({
                name: ROUTER_NAME["sign-up-page"],
              });
              return;
            }
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);

            let errorSocial = self.errorList.find((el) => el.code == 6);

            if (errorSocial) {
              alert(errorSocial.message);
            }

            let errorLinked = self.errorList.find((el) => el.code == 10);
            if (errorLinked) {
              self.$emit("update:isLinkedAccount", true);
            }
            // dang xu ly
          },
          success(objResponse) {
            if (!objResponse || objResponse.error || !objResponse.data) {
              // EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
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
