<template>
  <div class="custom-card">
    <div class="custom-row">
      <div class="head-outer">
        <div class="title">
          {{ $t('forget_password.forgot_password') }}
        </div>
        <div class="info">
          {{ $t('forget_password.input_your_mobile_number_to_reset_password') }}
        </div>
      </div>

      <div class="form-outer">
        <div class="input-outer">
          <Go2joyFlagSection
            v-if="codeCountry"
            :code-country="codeCountry"
            @changeCodeCountry="keyCodeCountry"
          />
          <div class="input-container number-mobile">
            <input
              v-model="$v.mobile.$model"
              class="input-field"
              :class="{ 'input-error': $v.mobile.$error && submited }"
              type="text"
              :placeholder="$t('forget_password.mobile_number')"
              @keyup.enter="continueBtn"
            >
          </div>
        </div>
        <div
          v-if="!$v.mobile.required && submited"
          class="error"
        >
          {{ $t('forget_password.mobile_number_is_required') }}
        </div>
        <div
          v-for="(error, index) in errorList"
          :key="index"
          class="error"
        >
          <p v-if="error.code == 12">
            {{ $t('forget_password.mobile_has_not_been_registered') }}
          </p>
          <p v-if="error.code == 1">
            {{ $t('forget_password.mobile_number_is_required') }}
          </p>
          <p v-if="error.code == 3">
            {{ $t('forget_password.mobile_is_invalid') }}
          </p>
          <p v-if="error.code == 14">
            {{ $t('forget_password.please_wait_a_little_longer_to_receive_the_message') }}
          </p>
        </div>

        <div class="btn">
          <button
            :disabled="disableBtnMobile()"
            type="submit"
            class="g2j-button-book-now"
            @click="continueBtn()"
          >
            {{ $t('forget_password.continue') }}
          </button>
        </div>
      </div>
      <model
        ref="filter-modal"
        :error-modal="errorPopupCountdown"
        :timer="timer"
        :count-down="minutesAndSeconds(timer)"
        :code-country="codeCountry"
        :mobile="mobile"
        :filter.sync="filter"
        @apply="applyFilter"
        @resendCode="resendCode"
        @saveInfoMobileOld="saveInfoMobileOld"
      />
      <change-password
        ref="change-password-modal"
        :error-modal="errorPopupChangePassword"
        :filter.sync="filter"
        @apply="applyChangePassword"
      />
    </div>
  </div>
</template>

<script>
import Go2joyFlagSection from "~jsPartialPath/global/component/go2joy-flags/Go2joyFlagsSection.vue";
import Model from "./Modal.vue";
import ChangePassword from "./ChangePassword.vue";
import { AJAX_URL } from '~jsDefinePath/ajax-url';
import { apiCaller } from '~jsHelperPath/service/ApiHandler';
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
Vue.use(vuelidate.default);

export default {
  name: "ForgetPasswordPage",
  components: {
      Go2joyFlagSection,
      Model,
      ChangePassword
  },
  data() {
    return {
      mobile        : "",
      newPassword   : "",

      verifyCode    : "",
      codeCountry   : "84",

      submited      : false,
      errorList     : [],
      errorPopupCountdown     : [],
      errorPopupChangePassword: [],

      codeCountryOld      : '',
      tempMobileOld       : '',
      tempArray           : [],

      timer               : 180,
      tempTimer           : 0
    };
  },

  validations: {
    mobile: {
      required,
    }
  },

  created() {
    this.$store.registerModule(PAGE_INFO_MODULE_NAME, pageLoginSocialModule);
  },

  mounted() {
   setInterval(() => {
      this.timer -= 1
    }, 1000)
  },

  computed: {
    ...mapGetters(PAGE_INFO_MODULE_NAME, {
        isLoading: "isLoading",
        tokenInfo: "tokenInfo",
        basicInfo: "basicInfo"
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

    minutesAndSeconds (value) {
      if(value > 0){
        var minutes = Math.floor(parseInt(value, 10) / 60)
        var seconds = parseInt(value, 10) - minutes * 60
        if(seconds < 10) {
          seconds = "0" + seconds;
        }
        this.tempTimer = value;
        return `${minutes}:${seconds}`
      }else{
        this.activeSendCode = true
        return `0:00`
      }
    },

    resendCode() {
      this.timer = 180;
      this.sendVerifyCodeForgotPassword();
    },

    continueBtn() {
      const self = this;
      this.submited = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
      } else {
        setTimeout(() => {
          if(!self.tempMobileOld) {
            self.sendVerifyCodeForgotPassword();
          } else {
            self.checkDuplicate();
          }
        }, 500);
      }
    }, // continueBtn()

    saveInfoMobileOld(value) {
      let self = this;
      let mobile = this.mobile.replace( /\s/g, '');
      // const test = _.find(this.tempArray, ['mobile', this.mobile]);
      const test = _.find(self.tempArray, function(obj) {
          if (obj.mobile == mobile && obj.codeCountry == self.codeCountry) {
              return true;
          }
      });
      if(test == undefined) {
        this.tempArray.push({
          codeCountry: self.codeCountryOld,
          mobile: self.tempMobileOld,
          timer : value
        })
      } else {
        test.timer = value;
      }
    },

    checkDuplicate() {
      let self = this;
      let mobile = this.mobile.replace( /\s/g, '');
      if(this.tempArray.length > 0) {
        // const test = _.find(this.tempArray, ['mobile', this.mobile]);
        const test = _.find(self.tempArray, function(obj) {
            if (obj.mobile == mobile && obj.codeCountry == self.codeCountry) {
                return true;
            }
        });
        if(test == undefined) {
          self.sendVerifyCodeForgotPassword();
        } else {
            if(test.timer > 1) {
              self.$refs['filter-modal'].showModal();
              self.timer = test.timer;
            } else {
              self.$refs['filter-modal'].showModal();
              self.timer = 180;
            }
        }
      } else {
        this.$refs['filter-modal'].showModal();
      }
    },

    disableBtnMobile() {
      return _.isEmpty(this.mobile);
    },

    applyFilter (data) {
      this.verifyCode = data;
      // this.$refs['filter-modal'].closeModal();
      this.verifyCodeForgotPassword();
    },
    applyChangePassword(data) {
      this.newPassword = data;
      this.updatePasswordForgotPassword();
    },

    sendVerifyCodeForgotPassword() {
      const self = this;
      apiCaller({
        metaUrl: AJAX_URL.login.sendVerifyCodeForgotPassword,
        data: {
          mobile      : this.mobile.replace( /\s/g, ''),
          countryCode : this.codeCountry
        },
        method: 'POST',
        dataType: 'json',
        error(err) {
          self.errorList = err.responseJSON.error;
        },
        success(objResponse) {
          if(
            _.isEmpty(objResponse) ||
            objResponse.error
          ) {
            self.errorList = objResponse.error;
            return;
          }
          self.$refs['filter-modal'].showModal()
          self.timer = 180;
          self.minutesAndSeconds(self.timer);

          self.codeCountryOld = self.codeCountry // save old mobile
          self.tempMobileOld = self.mobile.replace( /\s/g, ''); // save old mobile

          if(objResponse.data == true) {}
        },
        complete() {},
      });
    }, // sendVerifyCodeForgotPassword
    verifyCodeForgotPassword() {
      const self = this;
      apiCaller({
        metaUrl: AJAX_URL.login.verifyCodeForgotPassword,
        data: {
          mobile      : this.mobile.replace( /\s/g, ''),
          countryCode : this.codeCountry,
          verifyCode  : this.verifyCode
        },
        method: 'POST',
        dataType: 'json',
        error(err) {
          self.errorPopupCountdown = err.responseJSON.error;
        },
        success(objResponse) {
          if(
            _.isEmpty(objResponse) ||
            objResponse.error
          ) {
            self.errorPopupCountdown = objResponse.error;
            return;
          }

          if(objResponse.data == true) {
            self.$refs['filter-modal'].closeModal();
            self.$refs['change-password-modal'].showModal()
            // self.updatePasswordForgotPassword();
          }
        },
        complete() {},
      });
    }, // verifyCodeForgotPassword
    updatePasswordForgotPassword() {
      const self = this;
      apiCaller({
        metaUrl: AJAX_URL.login.updatePasswordForgotPassword,
        data: {
          mobile      : self.mobile.replace( /\s/g, ''),
          countryCode : self.codeCountry,
          verifyCode  : self.verifyCode,
          newPassword : md5(self.newPassword)
        },
        method: 'POST',
        dataType: 'json',
        error(err) {
          self.errorPopupChangePassword = err.responseJSON.error;
        },
        success(objResponse) {
          if(
            _.isEmpty(objResponse) ||
            objResponse.error
          ) {
            self.errorPopupChangePassword = objResponse.error;
            return;
          }

          self.$router.push({ name: 'home-page' })
        },
        complete() {},
      });
    }, // updatePasswordForgotPassword

    changeTab() {
      this.setReset();
      this.mobile = '',
      this.form.password = ''
    },

    keyCodeCountry(value){
      this.codeCountry = value;
    }
  },

  beforeDestroy() {
    this.$store.unregisterModule(PAGE_INFO_MODULE_NAME, pageLoginSocialModule);
  },
};
</script>
