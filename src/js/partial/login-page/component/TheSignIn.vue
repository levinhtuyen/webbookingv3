<template>
  <div class="custom-card">
    <div class="custom-row">
      <div class="head-outer">
        <div class="title">
          {{ $t('sign_in.welcome_to_go2joy') }}
        </div>
        <div class="info">
          <span>{{ $t('sign_in.sign_in') }} </span>{{ $t('sign_in.to_enjoy_your_stay_with_more_benefit') }}
        </div>
      </div>
      <div class="form-outer">
        <div class="input-container">
          <div class="input-container-inner">
            <i class="fa fa-user icon" />
            <input
              v-model.trim="$v.form.username.$model"
              class="input-field"
              :class="{ 'input-error': $v.form.username.$error && submited }"
              type="text"
              :placeholder="$t('sign_in.email')"
              @keyup.enter="signIn"
            >
          </div>
          <div
            v-if="!$v.form.username.required && submited"
            class="error"
          >
            {{ $t('sign_in.the_email_is_required') }}
          </div>
          <div
            v-if="!validationEmail"
            class="error"
          >
            {{ $t('sign_in.email_is_incorrect_format_please_try_again') }}
          </div>
          <div
            v-for="(error, index) in errorInfo"
            :key="index"
            class="error"
          >
            <p v-if="error.code == 11">
              {{ $t('sign_in.the_email_is_required') }}
            </p>
            <p v-if="error.code == 6">
              {{ $t('sign_in.the_email_is_not_registered') }}
            </p>

          </div>
        </div>
        <div class="input-container">
          <div class="input-container-inner">
            <i class="fas fa-lock icon" />
            <input
              v-model.trim="$v.form.password.$model"
              class="input-field"
              :class="{ 'input-error': $v.form.password.$error && submited }"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="$t('sign_in.password')"
              @keyup.enter="signIn"
            >
            <i
              v-if="showPassword"
              class="fas fa-eye icon-eye"
              @click="showPassword =!showPassword"
            />
            <i
              v-else
              class="fa fa-eye-slash icon icon-eye"
              @click="showPassword =!showPassword"
            />
          </div>
          <div
            v-if="!$v.form.password.required && submited"
            class="error"
          >
            {{ $t('sign_in.password_is_required') }}
          </div>
          <div
            v-for="(error, index) in errorInfo"
            :key="index"
            class="error"
          >
            <!-- <p v-if="error.code == 11">
              {{ $t('sign_in.password_is_required') }}
            </p>
            <p v-if="error.code == 7">
              {{ $t('sign_in.password_does_not_match_please_try_again') }}
            </p> -->
            <!-- <p v-if="error.code == 99">
              {{ $t('sign_in.email_or_password_incorrect') }}
            </p> -->
            <!-- v-if="error.code != 11 && error.code != 7" -->
            <p >
              {{error.message}}
            </p>
          </div>
        </div> <!-- .input-container-outer -->

        <div class="forget-pass-outer">
          <router-link :to="{name: 'forget-password-page'}">
            {{ $t('sign_in.forgot_password') }}
          </router-link>
        </div>
        <div class="btn">
          <button
            :disabled="disableBtn()"
            type="submit"
            class="g2j-button-book-now"
            @click="signIn"
          >
            {{ $t('sign_in.sign_in') }}
          </button>
        </div>
      </div>
      <div class="sign-in-via">
        {{ $t('sign_in.or_sign_in_via') }}
      </div>
      <sign-in-social />
      <div class="dont-account">
        {{ $t('sign_in.dont_have_an_account') }}
        <router-link :to="{name: 'sign-up-page'}">
          {{ $t('sign_in.sign_up_now') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import SignInSocial from './SignInSocial.vue'

import {
  _,
  Vue,
  mapGetters,
  mapActions,
  required,
} from "~jsLibPath/lib-manager";

import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
  pageLoginSocialModule,
} from "../page-module";
import { test } from '~jsPath/partial/list-task-detail-page/page-module';

export default {
  name: "SignInPage",
  components: {
      SignInSocial
  },
  data() {
    Vue.use(vuelidate.default);
    return {
      form: {
        username    : "",
        password    : "",
      },

      verifyCode    : "",
      codeCountry   : "84",
      viaApp        : "",
      token         : "",

      submited      : false,
      showPassword  : false,
      validationEmail    : true
    };
  },

  validations: {
    form: {
      username: {
        required,
      },
      password: {
        required,
      }
    }
  },

  created() {
    if(localStorage.getItem('tokenSocial') != null) {
      localStorage.removeItem('tokenSocial');
    }
    this.$store.registerModule(PAGE_INFO_MODULE_NAME, pageLoginSocialModule);
  },

  computed: {
    ...mapGetters(PAGE_INFO_MODULE_NAME, {
        isLoading: "isLoading",
        tokenInfo: "tokenInfo",
        basicInfo: "basicInfo",
        errorInfo: "errorInfo"
    })
  },

  methods: {
    isEmpty: _.isEmpty,
    ...mapActions(PAGE_INFO_MODULE_NAME, {
        getTokenSocial: "getTokenSocial",
        setBasicInfo: "setBasicInfo",
        submitManual: "submitManual",
        setReset: "setReset"
    }),

    disableBtn() {
      return _.isEmpty(this.basicInfo.username) || _.isEmpty(this.basicInfo.password);
    },

    validEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.validationEmail = re.test(email);
    },

    signIn() {
      if(isNaN(this.form.username) == true) { // là kiểu string
        this.validEmail(this.form.username);
      }
      if(this.validationEmail == true) {
        this.submited = true;
        this.$v.$touch();
        if (this.$v.$invalid) {
        } else {
            this.submitManual.call(this.$router);
        }
      }
    },

    changeTab() {
      this.setReset();
      this.form.username = '',
      this.form.password = ''
    },

    keyCodeCountry(value){
      this.codeCountry = value;
    }
  },

  watch: {
    "form.username": function() {
      this.setBasicInfo(this.form)
    },
    "form.password": function() {
      this.setBasicInfo(this.form);
    }
  },

  beforeDestroy() {
    this.$store.unregisterModule(PAGE_INFO_MODULE_NAME, pageLoginSocialModule);
  },
};
</script>
