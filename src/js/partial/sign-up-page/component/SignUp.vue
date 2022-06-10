<template>
  <div class="custom-card">
    <div class="custom-row">
      <div class="head-outer">
        <div class="title">
          {{ $t('sign_up.welcome_to_go2joy') }}
        </div>
        <div class="info">
          <span>{{ $t('sign_up.sign_up') }} </span>{{ $t('sign_up.to_enjoy_your_stay_with_more_benefit') }}
        </div>
      </div>

      <div class="form-outer">
        <div class="input-container">
          <div class="input-row">
            <div class="lable">
              Email
            </div>
            <div class="input-outer">
              <input
                v-model.trim="$v.email.$model"
                class="input-field"
                :class="{ 'input-error': $v.email.$error && submited }"
                type="email"
                :placeholder="$t('sign_up.email')"
                @keyup.enter="continueBtn"
              >
            </div>
          </div>
          <div
            v-if="!$v.email.required && submited"
            class="error"
          >
            {{ $t('sign_up.email_is_required') }}
          </div>
          <div
            v-if="!$v.email.email && submited"
            class="error"
          >
            {{ $t('sign_up.the_email_must_be_a_valid_email_address') }}
          </div>

          <div
            v-for="(error, index) in errorList"
            :key="index"
            class="error"
          >
            <p v-if="error.code == 4">
              {{ $t('sign_up.email_is_required') }}
            </p>
            <p v-if="error.code == 5">
              {{ $t('sign_up.email_has_been_registered') }}
            </p>
            <p v-if="error.code == 6">
              {{ $t('sign_up.email_is_invalid') }}
            </p>
          </div>
        </div>

        <div class="input-container">
          <div class="input-row">
            <div class="lable">
              Nickname
            </div>
            <div class="input-outer">
              <input
                v-model="$v.nickName.$model"
                class="input-field"
                :class="{ 'input-error': $v.nickName.$error && submited }"
                type="text"
                :placeholder="$t('sign_up.nick_name')"
                @keyup.enter="continueBtn"
              >
            </div>
          </div>
          <div
            v-if="!$v.nickName.required && submited"
            class="error"
          >
            {{ $t('sign_up.nickname_is_required') }}
          </div>

          <div
            v-for="(error, index) in errorList"
            :key="index"
            class="error"
          >
            <p v-if="error.code == 7">
              {{ $t('sign_up.nickname_is_required') }}
            </p>
            <p v-if="error.code == 8">
              {{ $t('sign_up.nickname_has_been_registered') }}
            </p>
            <p v-if="error.code == 9">
              {{ $t('sign_up.nickname_is_invalid') }}
            </p>
          </div>
        </div>

        <div class="input-container">
          <div class="input-row">
            <div class="lable">
              {{ $t('sign_up.mobile_number') }}
            </div>
            <div class="input-outer flag-mobile">
              <Go2joyFlagSection
                v-if="codeCountry"
                :code-country="codeCountry"
                @changeCodeCountry="keyCodeCountry"
              />
              <div class="mobile-input">
                <input
                  v-model.trim="$v.mobile.$model"
                  class="input-field"
                  :class="{ 'input-error': $v.mobile.$error && submited }"
                  type="text"
                  :placeholder="$t('sign_up.mobile_number')"
                  @keyup.enter="continueBtn"
                >
              </div>
            </div>
          </div>
          <div
            v-if="!$v.mobile.required && submited"
            class="error"
          >
            {{ $t('sign_up.mobile_is_required') }}
          </div>

          <div
            v-for="(error, index) in errorList"
            :key="index"
            class="error"
          >
            <p v-if="error.code == 1">
              {{ $t('sign_up.mobile_is_required') }}
            </p>
            <p v-if="error.code == 2">
              {{ $t('sign_up.mobile_has_been_registered') }}
            </p>
            <p v-if="error.code == 3 || error.code == 14">
              {{ $t('sign_up.mobile_is_invalid') }}
            </p>
          </div>
        </div>

        <div
          v-if="!token"
          class="input-container"
        >
          <div class="input-row">
            <div class="lable">
              {{ $t('sign_up.password') }}
            </div>
            <div class="input-outer input-password">
              <input
                v-model.trim="$v.password.$model"
                class="input-field"
                :class="{ 'input-error': $v.password.$error && submited }"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="$t('sign_up.password')"
                @keyup.enter="continueBtn"
              >
              <i
                v-if="showPassword"
                class="fas fa-eye icon icon-eye"
                @click="showPassword =!showPassword"
              />
              <i
                v-else
                class="fa fa-eye-slash icon icon-eye"
                @click="showPassword =!showPassword"
              />
            </div>
          </div>
          <div
            v-if="!$v.password.required && submited"
            class="error"
          >
            {{ $t('sign_up.password_is_required') }}
          </div>
          <div
            v-for="(error, index) in errorList"
            :key="index"
            class="error"
          >
            <p v-if="error.code == 10">
              {{ $t('sign_up.password_is_required') }}
            </p>
          </div>
          <div
            v-if="!validationPassword"
            class="error"
          >
            {{ $t('sign_up.it_must_be_6_16_characters_of_english_numbers') }}
          </div>
        </div>

        <div
          v-if="!token"
          class="input-container"
        >
          <div class="input-row">
            <div class="lable">
              {{ $t('sign_up.confirm_password') }}
            </div>
            <div class="input-outer input-password">
              <input
                v-model.trim="$v.confirmPassword.$model"
                class="input-field"
                :class="{ 'input-error': $v.confirmPassword.$error && submited }"
                :type="showConfirmPassword ? 'text' : 'password'"
                :placeholder="$t('sign_up.confirm_password')"
                @keyup.enter="continueBtn"
              >
              <i
                v-if="showConfirmPassword"
                class="fas fa-eye icon icon-eye"
                @click="showConfirmPassword =!showConfirmPassword"
              />
              <i
                v-else
                class="fa fa-eye-slash icon icon-eye"
                @click="showConfirmPassword =!showConfirmPassword"
              />
            </div>
          </div>
          <div
            v-if="!$v.confirmPassword.required && submited"
            class="error"
          >
            {{ $t('sign_up.confirm_password_is_required') }}
          </div>
          <div
            v-if="!$v.confirmPassword.sameAsPassword && submited"
            class="error"
          >
            {{ $t('sign_up.password_does_not_match_please_try_again') }}
          </div>
        </div>
        <div
          v-for="(error, index) in errorList"
          :key="index"
          class="error"
        >
          <p v-if="error.code == 15">
            {{ $t('sign_up.please_wait_a_little_longer_to_receive_the_message') }}
          </p>
        </div>

        <div
          class="policy"
          @click="policy = !policy"
        >
          <input
            v-model="policy"
            type="checkbox"
          >
          {{ $t('sign_up.i_agree_to_the') }}

          <router-link
            v-slot="{ href, navigate }"
            :to="policyPagePath[language]"
          >
            <a
              :href="href"
              @click.stop="navigate"
            >
              {{ $t('sign_up.service_agreement_and_privacy_policy') }}
            </a>
          </router-link>
        </div>
        <div
          v-if="!token"
          class="btn"
        >
          <button
            :disabled="disableBtn()"
            type="submit"
            class="g2j-button-book-now"
            @click="continueBtn()"
          >
            {{ $t('sign_up.continue') }}
          </button>
        </div>
        <div
          v-else
          class="btn"
        >
          <button
            :disabled="disableBtnSocial()"
            type="submit"
            class="g2j-button-book-now"
            @click="continueBtn()"
          >
            {{ $t('sign_up.continue') }}
          </button>
        </div>
        <model
          ref="filter-modal"
          :error-list="errorList"
          :timer="timer"
          :count-down="minutesAndSeconds(timer)"
          :code-country="codeCountry"
          :mobile="mobile"
          :filter.sync="filter"
          @apply="applyFilter"
          @resendCode="resendCode"
          @saveInfoMobileOld="saveInfoMobileOld"
        />
      </div>
      <div class="dont-account">
        {{ $t('sign_up.if_you_already_have_an_account') }},
        <router-link :to="{name: 'login-page'}">
          {{ $t('sign_up.sign_in_now') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import SignUpSocial from "./SignUpSocial.vue";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import { ROUTER_NAME } from "~jsBasePath/vue-router/router-define";
  import { ADJUST_TRACKING } from "~jsDefinePath/tracking-define";
  import { EVENT_BUS_KEY } from "~jsDefinePath/event-bus";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/page-info-module";
  import { getPolicyPagePath } from "~jsHelperPath/util/HandleUrl";
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import Model from "./Modal.vue";
  import Go2joyFlagSection from "~jsPartialPath/global/component/go2joy-flags/Go2joyFlagsSection.vue";
  Vue.use(vuelidate.default);
  import {
    _,
    Vue,
    mapGetters,
    mapState,
    mapActions,
    required,
    email,
  } from "~jsLibPath/lib-manager";
  import {
    MODULE_NAME as LOGIN_PAGE_MODULE_NAME,
    pageLoginSocialModule,
  } from "~jsPartialPath/login-page/page-module";

  const sameAs = validators?.sameAs ?? null;

  export default {
    name: "SignUpPage",

    components: {
      SignUpSocial,
      Model,
      Go2joyFlagSection,
    },
    data() {
      return {
        verifyCode: "",
        codeCountry: "84",
        mobile: "",
        nickName: "",
        password: "",
        confirmPassword: "",
        email: "",
        viaApp: "",
        // token google test
        token: localStorage.getItem("tokenSocial")
          ? localStorage.getItem("tokenSocial")
          : "",

        policy: false, // service & policy
        submited: false,
        showPassword: false,
        showConfirmPassword: false,
        errorList: [],
        validationPassword: true, // check  format password

        tempMobileOld: "",
        tempArray: [],

        params: {
          client_id:
            "996813056756-go8l6e9b6e2qrejkqre5o1ggmb6naau4.apps.googleusercontent.com", // login google
        },

        fbSignInParams: {
          scope: "email,user_likes",
          return_scopes: true,
        },

        timer: 180,
        tempTimer: 0,

        policyPagePath: getPolicyPagePath(),
      };
    },

    validations() {
      if (!this.token) {
        return {
          email: {
            required,
            email,
          },
          nickName: {
            required,
          },
          mobile: {
            required,
          },
          password: {
            required,
          },
          confirmPassword: {
            required,
            sameAsPassword: sameAs("password"),
          },
        };
      } else {
        return {
          email: {
            required,
            email,
          },
          nickName: {
            required,
          },
          mobile: {
            required,
          },
        };
      }
    },

    computed: {
      ...mapGetters(LOGIN_PAGE_MODULE_NAME, {
        isLoading: "isLoading",
        tokenInfo: "tokenInfo",
        basicInfo: "basicInfo",
      }),

      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),
    },

    mounted() {
      setInterval(() => {
        this.timer -= 1;
      }, 1000);
    },

    beforeDestroy() {
      this.$store.unregisterModule(LOGIN_PAGE_MODULE_NAME, pageLoginSocialModule);
    },

    methods: {
      isEmpty: _.isEmpty,
      ...mapActions(LOGIN_PAGE_MODULE_NAME, {
        setBasicInfo: "setBasicInfo",
      }),

      minutesAndSeconds(value) {
        if (value > 0) {
          var minutes = Math.floor(parseInt(value, 10) / 60);
          var seconds = parseInt(value, 10) - minutes * 60;
          if (seconds < 10) {
            seconds = "0" + seconds;
          }
          this.tempTimer = value;
          return `${minutes}:${seconds}`;
        } else {
          this.activeSendCode = true;
          return `0:00`;
        }
      },

      disableBtn() {
        return (
          _.isEmpty(this.email) ||
          _.isEmpty(this.nickName) ||
          _.isEmpty(this.mobile) ||
          _.isEmpty(this.password) ||
          _.isEmpty(this.confirmPassword) ||
          !this.policy
        );
      },
      disableBtnSocial() {
        return (
          _.isEmpty(this.email) ||
          _.isEmpty(this.nickName) ||
          _.isEmpty(this.mobile) ||
          !this.policy
        );
      },
      applyFilter(data) {
        this.verifyCode = data;
        this.signUpManual();
      },
      clickFilter() {
        this.$refs["filter-modal"].showModal();
      },
      resendCode() {
        this.timer = 180;
        this.fieldChecking();
      },

      validatePassword(password) {
        var re =
          /^(?=.*[A-Za-z])(?=.*\d)[a-zA-Z0-9!@#$%^&*()~¥=_+}{":;'?/>.<,`\-\|\[\]]{6,16}$/;
        this.validationPassword = re.test(password);
      }, // validatePassword

      checkBeforeCallApi() {
        const self = this;
        this.$v.$touch();
        if (!this.$v.$invalid) {
          setTimeout(() => {
            if (!self.tempMobileOld) {
              self.fieldChecking();
            } else {
              self.checkDuplicate();
            }
          }, 500);
        }
      }, // checkBeforeCallApi

      continueBtn() {
        const self = this;
        this.policy = true;
        this.submited = true;
        if (localStorage.getItem("tokenSocial") != null) {
          this.checkBeforeCallApi();
        } else {
          this.validatePassword(this.password);
          if (this.validationPassword == true) {
            this.checkBeforeCallApi();
          }
        }
      }, // continueBtn()

      saveInfoMobileOld(value) {
        let self = this;
        let mobile = this.mobile.replace(/^0+/, "");
        // const test = _.find(self.tempArray, ['mobile', mobile]);
        const test = _.find(self.tempArray, function (obj) {
          if (obj.mobile == mobile && obj.codeCountry == self.codeCountry) {
            return true;
          }
        });

        if (test == undefined) {
          self.tempArray.push({
            codeCountry: self.codeCountryOld,
            mobile: self.tempMobileOld,
            timer: value,
          });
        } else {
          test.timer = value;
        }
      },

      checkDuplicate() {
        let self = this;
        let mobile = this.mobile.replace(/^0+/, "");
        if (self.tempArray.length > 0) {
          // const test = _.find(self.tempArray, ['mobile', mobile]);
          const test = _.find(self.tempArray, function (obj) {
            if (obj.mobile == mobile && obj.codeCountry == self.codeCountry) {
              return true;
            }
          });

          if (test == undefined) {
            self.fieldChecking();
          } else {
            if (test.timer > 1) {
              self.$refs["filter-modal"].showModal();
              self.timer = test.timer;
            } else {
              self.$refs["filter-modal"].showModal();
              self.timer = 180;
            }
          }
        } else {
          self.$refs["filter-modal"].showModal();
        }
      },

      fieldChecking() {
        const self = this;
        apiCaller({
          metaUrl: AJAX_URL.login.fieldChecking,
          data: {
            userId: "",
            mobile: this.mobile.replace(/\s+/g, ""),
            countryCode: this.codeCountry,
            nickName: this.nickName,
            email: this.email,
          },
          method: "GET",
          dataType: "json",
          error() {},
          success(objResponse) {
            if (_.isEmpty(objResponse) || objResponse.error) {
              self.errorList = objResponse.error;
              return;
            }
            if (objResponse.data == true) {
              self.getVetifyCode(); // call api vertify code
            }
          },
          complete() {},
        });
      }, // fieldChecking()

      getVetifyCode() {
        const self = this;
        apiCaller({
          metaUrl: AJAX_URL.login.sendVerifyCodeSignUp,
          data: {
            mobile: this.mobile.replace(/\s+/g, ""),
            countryCode: this.codeCountry,
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
            self.$refs["filter-modal"].showModal();
            self.timer = 180;
            self.minutesAndSeconds(self.timer);

            // self.tempMobileOld = self.mobile; // save old mobile
            self.codeCountryOld = self.codeCountry; // save old mobile
            self.tempMobileOld = self.mobile.replace(/^0+/, ""); // save old mobile
          },
          complete() {},
        });
      }, // getVetifyCode()

      signUpManual() {
        const self = this;
        apiCaller({
          metaUrl: AJAX_URL.login.signup,
          data: {
            mobile: this.mobile.replace(/\s+/g, ""),
            password: this.token ? "" : md5(this.password),
            email: this.email,
            nickName: this.nickName,
            verifyCode: this.verifyCode,
            countryCode: this.codeCountry,
            isoCode: "VN",
            viaApp: this.token ? localStorage.getItem("viaApp") : 1,
            token: this.token ? this.token.replaceAll('"', "") : "",
          },
          method: "POST",
          dataType: "json",

          error(err) {
            self.errorList = err.responseJSON.error;
          },

          success(objResponse) {
            if (_.isEmpty(objResponse) || objResponse.error) {
              self.errorList = objResponse.error;
              return;
            }

            let res = objResponse?.data ?? [];
            if (res) {
              localStorage.setItem("token", res.accessToken);
              localStorage.setItem("expiresAt", res.expiresAt);
              // localStorage.setItem("userInfo", res.userInfo);
              // localStorage.setItem(
              //   "userInfo",
              //   btoa(JSON.stringify(res.userInfo))
              // );
              localStorage.setItem(
                "userInfo",
                btoa(unescape(encodeURIComponent(JSON.stringify(res.userInfo))))
              );
              localStorage.removeItem("tokenSocial");

              if (window.Adjust) {
                window.Adjust.trackEvent({
                  eventToken: ADJUST_TRACKING.TRACKING_SIGNUP,
                });
              }

              if (self.$route.params.redirect) {
                self.$router.replace(self.$route.params.redirect);
              } else {
                self.$router.replace({ name: ROUTER_NAME["account-page"] });
              }

              EventBus.emit(EVENT_BUS_KEY.UPDATE_USER_PROFILE);
            }
            self.$refs["filter-modal"].closeModal();
          },
          complete() {},
        });
      }, // signUpManual()

      keyCodeCountry(value) {
        this.codeCountry = value;
      },
    },

    watch: {
      password(value) {
        if (this.submited == true) {
          this.validatePassword(value);
        }
      }, // password
    },
    created() {},
  };
</script>
