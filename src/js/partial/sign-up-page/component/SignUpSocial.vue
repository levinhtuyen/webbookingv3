<template>
    <div class="login-social-outer">
        <div class="facebook-outer">
          <fb-signin-button
            :params="fbSignInParams"
            @success="onSignInSuccess"
            @error="onSignInError"
          >
            <img src="../../../../image/icon/facebook-logo.svg" width="100%" height="100%" />
          </fb-signin-button>
        </div>
        <div class="google-outer">
          <GoogleLogin
            :params="params"
            :onSuccess="onSuccess"
            :onFailure="onFailure"
          >
            <img src="../../../../image/icon/google-logo.svg" width="100%" height="100%"/>
          </GoogleLogin>
        </div>
    </div>
</template>

<script>
import GoogleLogin from "vue-google-login";
import FBSignInButton from "vue-facebook-signin-button";

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
  pageSignUpModule,
} from "../page-module";

export default {
  components: {
      GoogleLogin,
      FBSignInButton,
  },
  data() {
    return {
      username: "",
      password: "",
      submited: false,

      params: {
        client_id:
          "996813056756-go8l6e9b6e2qrejkqre5o1ggmb6naau4.apps.googleusercontent.com", // login google
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

  validations: {
    username: {
      required,
    },
    password: {
      required,
    },
  },

  created() {
    if(!this.$store.hasModule(PAGE_INFO_MODULE_NAME)) {
      this.$store.registerModule(PAGE_INFO_MODULE_NAME, pageSignUpModule);
    }
    EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
    window.fbAsyncInit = function () {
      this.FB.init({
        appId: "1801724940084193",
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

  computed: {
    ...mapGetters(PAGE_INFO_MODULE_NAME, {
      isLoading: "isLoading",
      tokenInfo: "tokenInfo",
    }),
  },

  methods: {
    ...mapActions(PAGE_INFO_MODULE_NAME, {
      getTokenSocial: "getTokenSocial",
    }),

    signIn() {
      console.log("submit!");
      this.submited = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        console.log("error !");
      } else {
        // do your submit logic here
        setTimeout(() => {
          console.log("sucess !");
        }, 500);
      }
    },

    onSuccess(googleUser) {
      console.log("info google :", googleUser);
      // This only gets the user information: id, name, imageUrl and email
      console.log("Info profile :", googleUser.getBasicProfile());
      let domain = googleUser.qc.idpId;
      let tokenInfo = {
        domain: domain,
        token: googleUser.qc,
      };
      this.getTokenSocial(tokenInfo);
    },

    onSignInSuccess() {
      FB.api(
        "/me",
        "GET",
        { fields: "id,name,email,picture" },
        function (response) {
          console.log(response);
        }
      );
      this.getToken();
    },

    getToken() {
      let self = this;
      FB.getLoginStatus(function (response) {
        if (response.status === "connected") {
          console.log("Token facebook : ", response);
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
    if(this.$store.hasModule(PAGE_INFO_MODULE_NAME)) {
        this.$store.unregisterModule(PAGE_INFO_MODULE_NAME, pageSignUpModule);
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
