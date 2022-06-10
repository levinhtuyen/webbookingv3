<template>
  <div class="custom-card forget-password">
    <div class="custom-row">
      <div class="forget-password__title">
        <div class="forget-password__title--main">
          <p v-show="language === 'en'">
            Forgot
            <span class="bold">Password?</span>
          </p>
          <p v-show="language === 'vi'">
            Quên
            <span class="bold">mật khẩu?</span>
          </p>
        </div>
        <div class="forget-password__title--sup">
          <p>{{ $t('forget_password.input_your_mobile_number_to_reset_password') }}</p>
        </div>
      </div>

      <div class="w-100 mt-1em">
        <div class="forget-password__tabs--flex">
          <Go2joyFlagSection
            v-if="form.countryCode"
            :code-country="form.countryCode"
            @changeCodeCountry="keyCodeCountry"
          />
          <input
            class="input-field"
            :class="{ 'input-error': $v.form.mobile.$error && ui.submited }"
            type="number"
            v-model="$v.form.mobile.$model"
            :placeholder="$t('forget_password.mobile_number')"
          />
        </div>
      </div>

      <p
        v-if="!$v.form.mobile.required && ui.submited"
        class="error w-100"
      >{{ $t('forget_password.mobile_is_required') }}</p>
      <p
        v-if="!$v.form.mobile.minLength && ui.submited"
        class="error w-100"
      >{{ $t('forget_password.mobile_must_have_9_to_16_digits') }}</p>
      <p
        v-if="!$v.form.mobile.maxLength && ui.submited"
        class="error w-100"
      >{{ $t('forget_password.mobile_must_have_9_to_16_digits') }}</p>

      <div
        class="error w-100"
        v-for="(err, index) in errorList"
        :key="index"
      >
        <!-- code === 20 => mã verify code nhập ko đúng -->
        <p v-if="err.code !== 20">{{ err.message }}</p>
      </div>

      <div class="forget-password__apply">
        <div class="forget-password__apply--btn">
          <button
            type="submit"
            :disabled="disableBtn"
            @click="submit"
          >{{ $t('forget_password.continue') }}</button>
        </div>
      </div>

      <model
        ref="filter-modal"
        :error-list="errorList"
        :timer="timer"
        :count-down="minutesAndSeconds(timer)"
        :code-country="form.countryCode"
        :mobile="form.mobile"
        :filter.sync="filter"
        @resetModal="resetModal"
        @apply="applyFilter"
        @resendCode="resendCode"
        @saveInfoMobileOld="saveInfoMobileOld"
      />

      <!-- // START popup set up password -->
      <ModalSetupPassword
        ref="modal-password"
        :error-list="errorList"
        :mobile="form.mobile"
        :filter.sync="filter"
        :isSubmiting="ui.isSubmitingModalSetupPassword"
        @apply="applyModalSetupPassword"
      />
      <!-- // END popup set up password -->

      <!-- // START popup set up password -->
      <ModalChangedPassword
        ref="modal-changed-password"
        :error-list="errorList"
        :mobile="form.mobile"
        :filter.sync="filter"
      />
      <!-- // END popup set up password -->
    </div>
  </div>
</template>

<script>
  import Go2joyFlagSection from "~jsPartialPath/global/component/go2joy-flags/Go2joyFlagsSection.vue";
  import Model from "./Modal.vue";
  import ModalSetupPassword from "./ModalSetupPassword.vue";
  import ModalChangedPassword from "./ModalChangedPassword.vue";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import {
    _,
    Vue,
    mapState,
    required,
    minLength,
    maxLength,
  } from "~jsLibPath/lib-manager";

  import {
    MODULE_NAME as PAGE_INFO_MODULE_NAME,
    pageLoginSocialModule,
  } from "../page-module";

  import { MODULE_NAME as PAGE_INFO_MODULE_NAME_INFO } from "~jsBasePath/vuex/modules/page-info-module";
  import { BASE_URL } from "~jsDefinePath/general";
  Vue.use(vuelidate.default);

  export default {
    name: "ForgetPasswordPage",
    components: {
      Go2joyFlagSection,
      Model,
      ModalSetupPassword,
      ModalChangedPassword,
    },
    data() {
      return {
        BASE_URL,
        form: {
          mobile: "",
          countryCode: "84",
          verifyCode: "",
          newPassword: "",
        },

        ui: {
          submited: false,
          isLoadingSubmit: false,
          isSubmitingModalSetupPassword: false,
        },

        errorList: [],

        codeCountryOld: "",
        tempMobileOld: "",
        tempArray: [],

        timer: 180,
        // tempTimer           : 0
      };
    },

    validations: {
      form: {
        mobile: {
          required,
          minLength: minLength(9),
          maxLength: maxLength(16),
        },
      },
    },

    created() {
      // NOTE - Setup meta tag
      this.$metaTag.setup({
        title: "Quên mật khẩu - Go2Joy",
        description: "Trang lấy lại mật khẩu tài khoản",
        "og:type": "website",
        "og:title": "Quên mật khẩu - Go2Joy",
        "og:description": "Trang lấy lại mật khẩu tài khoản",
        "og:url": BASE_URL + window.location.pathName,
        "og:site_name": "Go2Joy",
        "og:image": "",
        "og:image:width": "1200",
        "og:image:height": "628",
      });

      // NOTE - Register module
      this.$store.registerModule(PAGE_INFO_MODULE_NAME, pageLoginSocialModule);
    },

    mounted() {
      setInterval(() => {
        this.timer -= 1;
      }, 1000);
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME_INFO, {
        language: "language",
      }),
      disableBtn() {
        return _.isEmpty(this.form.mobile) || this.ui.isLoadingSubmit;
      },
    },

    methods: {
      isEmpty: _.isEmpty,
      minutesAndSeconds(value) {
        if (value > 0) {
          var minutes = Math.floor(parseInt(value, 10) / 60);
          var seconds = parseInt(value, 10) - minutes * 60;
          if (seconds < 10) {
            seconds = "0" + seconds;
          }
          // this.tempTimer = value;
          return `${minutes}:${seconds}`;
        } else {
          this.activeSendCode = true;
          return `0:00`;
        }
      },

      resendCode() {
        this.errorList = [];
        this.timer = 180;
        this.sendVerifyCodeForgotPassword();
      },

      resetModal() {
        setTimeout(() => {
          this.timer = 180;
        }, 500);
      },

      submit() {
        let self = this;
        self.ui.submited = true;
        self.$v.$touch();
        if (!self.$v.$invalid) {
          // if(!self.tempMobileOld) {
          self.sendVerifyCodeForgotPassword();
          // } else {
          //   self.checkDuplicate();
          // }
        }
      }, // continueBtn()

      // saveInfoMobileOld(value) {
      //   let self = this;
      //   let mobile = this.form.mobile;
      //   const test = _.find(self.tempArray, function(obj) {
      //       if (obj.mobile == mobile && obj.countryCode == self.form.countryCode) {
      //           return true;
      //       }
      //   });
      //   if(test == undefined) {
      //     this.tempArray.push({
      //       countryCode: self.codeCountryOld,
      //       mobile: self.tempMobileOld,
      //       timer : value
      //     })
      //   } else {
      //     test.timer = value;
      //   }
      // },

      // checkDuplicate() {
      //   let self = this;
      //   let mobile = this.form.mobile;
      //   if(this.tempArray.length > 0) {
      //     const test = _.find(self.tempArray, function(obj) {
      //         if (obj.mobile == mobile && obj.countryCode == self.form.countryCode) {
      //             return true;
      //         }
      //     });
      //     if(test == undefined) {
      //       self.sendVerifyCodeForgotPassword();
      //     } else {
      //         if(test.timer > 1) {
      //           self.$refs['filter-modal'].showModal();
      //           self.timer = test.timer;
      //         } else {
      //           self.$refs['filter-modal'].showModal();
      //           self.timer = 180;
      //         }
      //     }
      //   } else {
      //     self.$refs['filter-modal'].showModal();
      //   }
      // },

      applyFilter(data) {
        this.errorList = [];
        this.form.verifyCode = data;
        // this.$refs['filter-modal'].closeModal();
        this.verifyCodeForgotPassword();
      },
      applyModalSetupPassword(data) {
        this.errorList = [];
        this.form.newPassword = data;
        this.updatePasswordForgotPassword();
      },

      sendVerifyCodeForgotPassword() {
        const self = this;
        self.ui.isLoadingSubmit = true;

        apiCaller({
          metaUrl: AJAX_URL.login_v4.sendVerifyCodeForgotPassword,
          data: {
            mobile: this.form.mobile,
            countryCode: this.form.countryCode,
          },
          method: "POST",
          dataType: "json",
          error(err) {
            self.errorList = err.response?.data.error || [];
          },
          success(objResponse) {
            if (_.isEmpty(objResponse) || objResponse.error) {
              self.errorList = objResponse.error || [];
              return;
            }
            self.$refs["filter-modal"].showModal();
            self.timer = 180;
            self.minutesAndSeconds(self.timer);

            self.codeCountryOld = self.form.countryCode; // save old mobile
            self.tempMobileOld = self.form.mobile; // save old mobile

            if (objResponse.data == true) {
            }
          },
          complete() {
            self.ui.isLoadingSubmit = false;
          },
        });
      }, // sendVerifyCodeForgotPassword
      verifyCodeForgotPassword() {
        const self = this;
        apiCaller({
          metaUrl: AJAX_URL.login_v4.verifyCodeForgotPassword,
          data: {
            mobile: this.form.mobile,
            countryCode: this.form.countryCode,
            verifyCode: this.form.verifyCode,
          },
          method: "POST",
          dataType: "json",
          error(err) {
            self.errorList = err.response?.data.error || [];
          },
          success(objResponse) {
            if (_.isEmpty(objResponse) || objResponse.error) {
              self.errorList = objResponse.error;
              return;
            }

            if (objResponse.data == true) {
              self.$refs["filter-modal"].closeModal();
              setTimeout(() => {
                self.$refs["modal-password"].showModal();
              }, 500);
              // self.updatePasswordForgotPassword();
            }
          },
          complete() {},
        });
      }, // verifyCodeForgotPassword
      updatePasswordForgotPassword() {
        const self = this;
        self.ui.isSubmitingModalSetupPassword = true;

        apiCaller({
          metaUrl: AJAX_URL.login_v4.updatePasswordForgotPassword,
          data: {
            mobile: self.form.mobile,
            countryCode: self.form.countryCode,
            verifyCode: self.form.verifyCode,
            newPassword: md5(self.form.newPassword),
          },
          method: "POST",
          dataType: "json",
          error(err) {
            self.errorList = err.response?.data.error || [];
          },
          success(objResponse) {
            if (_.isEmpty(objResponse) || objResponse.error) {
              self.errorList = objResponse.error;
              return;
            }

            self.$refs["modal-password"].closeModal();
            setTimeout(() => {
              self.$refs["modal-changed-password"].showModal();
            }, 500);
          },
          complete() {
            self.ui.isSubmitingModalSetupPassword = false;
          },
        });
      }, // updatePasswordForgotPassword

      keyCodeCountry(value) {
        this.form.countryCode = value;
      },
    },
    beforeDestroy() {
      this.$store.unregisterModule(PAGE_INFO_MODULE_NAME, pageLoginSocialModule);
    },
  };
</script>
