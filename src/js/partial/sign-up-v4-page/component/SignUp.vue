<template>
  <div class="custom-card sign-up">
    <div class="sign-up__title">
      <div class="sign-up__title--main">
        <p v-if="!isSignUpSocial">{{ $t('sign_up.welcome_to_go2joy') }}</p>
        <!-- {{ $t('sign_up.registration_complete') }} -->
        <p v-if="isSignUpSocial">{{ $t('sign_up.mobile_number') }}</p>
      </div>
      <div class="sign-up__title--sup">
        <p v-if="!isSignUpSocial">{{ $t('sign_up.register_to_enjoy_your_stay_with_more_benefit') }}</p>
        <!-- {{ $t('sign_up.create_go2joy_account_with_your_social_account') }} -->
        <p v-if="isSignUpSocial">{{ $t('sign_up.input_number_description') }}</p>
      </div>
    </div>

    <div class="w-100 mt-1em">

      <div class="sign-up__tabs--flex">
        <Go2joyFlagSection
          v-if="form.countryCode"
          :code-country="form.countryCode"
          @changeCodeCountry="keyCountryCode"
        />
        <input
          v-focus
          class="input-field"
          :class="{ 'input-error': $v.form.mobile.$error && ui.submited }"
          type="number"
          v-model="$v.form.mobile.$model"
          :placeholder="$t('sign_up.mobile_number')"
          @keydown="$v.$reset , onKeyDownInputNumber()"
          @keyup.enter="submit"
        />
      </div>
    </div>

    <p
      v-if="!$v.form.mobile.required && ui.submited"
      class="error w-100"
    >{{ $t('sign_up.mobile_number_is_required') }}</p>
    <p
      v-if="!$v.form.mobile.minLength && ui.submited"
      class="error w-100"
    >{{ $t('sign_up.mobile_must_have_9_to_16_digits') }}</p>
    <p
      v-if="!$v.form.mobile.maxLength && ui.submited"
      class="error w-100"
    >{{ $t('sign_up.mobile_must_have_9_to_16_digits') }}</p>

    <!-- errors list BE -->
    <div
      class="error w-100"
      v-for="(err, index) in errorList"
      :key="index"
    >
      <p v-if="err.code === 2">{{ err.message }}</p>
      <p v-else-if="err.code === 4">{{ err.message }}</p>
      <p v-else-if="err.code === 3">{{ err.message }}</p>
      <p v-else-if="err.code === 14">{{ err.message }}</p>
    </div>
    <!-- errors list BE -->
    <template v-if="!isSignUpSocial">

      <div class="sign-up__tabs--flex">
        <i class="fas fa-address-card filter-grayscale mr-8px"></i>
        <input
          class="input-field"
          :class="{ 'input-error': $v.form.nickName.$error && ui.submited }"
          type="text"
          v-model="$v.form.nickName.$model"
          :placeholder="$t('sign_up.nick_name')"
          autocomplete="off"
          @keyup.enter="submit"
        />
      </div>

      <p
        v-if="!$v.form.nickName.required && ui.submited"
        class="error w-100"
      >{{ $t('sign_up.nick_name_is_required') }}</p>
      <!-- <p
        v-if="!ui.validationNickName && ui.submited"
        class="error w-100"
      >{{ $t('sign_up.nick_name_must_from_6_characters') }}</p>
      <p
        v-else-if="!$v.form.nickName.minLength && ui.submited"
        class="error w-100"
      >{{ $t('sign_up.nick_name_must_from_6_characters') }}</p> -->

      <!-- errors list BE -->
    </template>

    <div
      class="error w-100"
      v-for="(err, index) in errorList"
      :key="index"
    >
      <p v-if="err.code === 14">{{err.message}}</p>
      <p v-if="err.code === 8">{{ err.message }}</p>
      <p v-if="err.code === 15">{{ err.message }}</p>
      <p v-if="err.code === 20">{{ err.message }}</p>

    </div>
    <div class="error w-100">
      <p v-for="(v,k) in  errorWaitingVerifycode">
        {{v.message}}
      </p>
    </div>
    <!-- errors list BE -->

    <div class="sign-up__apply">
      <div class="sign-up__apply--outer">
        <!-- <input
            v-model="ui.policy"
            type="checkbox"
          > -->
        <span class="mr-1">{{ $t('sign_up.i_agree_to') }}</span>
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
      <div class="sign-up__apply--btn">
        <button
          type="submit"
          :disabled="disableBtn"
          @click="submit"
        >
          {{ $t('sign_up.continue')}}
          <!-- {{!isSignUpSocial? $t('sign_up.register') :$t('sign_up.continue')  }}
          -->
        </button>
      </div>
    </div>

    <div
      v-show="!isSignUpSocial"
      class="sign-up__social"
    >
      <p class="sign-up__social--bold">{{ $t('sign_up.or_sign_up_with') }}</p>
      <sign-up-social
        ref="sign-up-social"
        :mobileUser="form.mobile"
        :countryCodeUser="form.countryCode"
        :isLinkedAccount.sync="isLinkedAccount"
      />
      <p class="sign-up__social--link">
        {{ $t('sign_up.if_you_already_have_an_account') }}
        <router-link :to="{name: 'login-page'}">
          {{ $t('sign_up.sign_in_now') }}
        </router-link>
      </p>
    </div>

    <!-- <model
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
      /> -->

    <!-- // START popup set up password -->
    <ModalSetupPassword
      ref="modal-password"
      :error-list="errorList"
      :mobile="form.mobile"
      :filter.sync="filter"
      @apply="applyModalPassword"
    />
    <!-- // END popup set up password -->

    <!-- // START popup sign up successfully -->
    <ModalSignedUp
      ref="modal-signed-up"
      :mobile="form.mobile"
      :filter.sync="filterModalSignedUp"
    />
    <!-- // END popup sign up successfully -->
    <g2j-verify-modal
      ref="g2j-verify-modal"
      :country-code="form.countryCode"
      :phone-number="form.mobile"
      :error-waiting-verifycode="errorWaitingVerifycode"
      :error-get-verify-code="errorGetVerifyCode"
      @getVerifyCode="getVerifyCodeGuest"
      @applyVerifyCode="getSignUp"
      @resentVerifyCode="getVerifyCodeGuest"
    >
    </g2j-verify-modal>
    <modal-verify-account
      ref="modal-verify-account"
      :linkedAccount="linkedAccount"
      :isLinkedAccount="isLinkedAccount"
      @onGoogle="onGoogle"
      @onFacebook="onFacebook"
    >

    </modal-verify-account>

  </div>
</template>

<script>
  // import SignUpSocial from './SignUpSocial.vue';
  import SignUpSocial from "~jsPartialPath/login-v4-page/component/SignInSocial.vue";

  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import { EVENT_BUS_KEY } from "~jsDefinePath/event-bus";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/page-info-module";
  import { MODULE_NAME as PROFILE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/profile-info-module";
  import { getPolicyPagePath } from "~jsHelperPath/util/HandleUrl";
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";

  import Model from "./Modal.vue";
  import ModalSetupPassword from "./ModalSetupPassword.vue";
  import ModalSignedUp from "./ModalSignedUp.vue";
  import Go2joyFlagSection from "~jsPartialPath/global/component/go2joy-flags/Go2joyFlagsSection.vue";
  import { G2JRouter, getG2JRoute } from "~jsHelperPath/util/HandleRouterGlobal";
  import { ROUTER_NAME } from "~jsBasePath/vue-router/router-define";

  Vue.use(vuelidate.default);
  import {
    _,
    Vue,
    mapState,
    mapActions,
    required,
    minLength,
    maxLength,
  } from "~jsLibPath/lib-manager";
  import { BASE_URL } from "~jsDefinePath/general";
  export default {
    name: "SignUpPage",
    components: {
      SignUpSocial,
      Model,
      Go2joyFlagSection,
      ModalSetupPassword,
      ModalSignedUp,
      "g2j-verify-modal": () =>
        import(
          "~jsPartialPath/global/component/modal-vetify-code/ModalVerifyCode.vue"
        ),
      "modal-verify-account": () => import("./ModalVerifyAccount.vue"),
    },
    data() {
      return {
        BASE_URL,
        isLoadingSubmit: false,
        form: {
          mobile: "",
          password: "",
          nickName: "",
          verifyCode: "",
          countryCode: "84",
          isoCode: "VN",
          viaApp: 1,
        },
        filterModalSignedUp: {},
        confirmPassword: "",
        // token google test
        token: localStorage.getItem("tokenSocial")
          ? localStorage.getItem("tokenSocial")
          : "",
        ui: {
          submited: false,
          policy: false, // service & policy
        },
        showPassword: false,
        showConfirmPassword: false,
        errorList: [],
        validationPassword: true, // check  format password
        validationNickName: true, // check  format nickName
        tempMobileOld: "",
        tempArray: [],
        params: {
          client_id:
            "996813056756-go8l6e9b6e2qrejkqre5o1ggmb6naau4.apps.googleusercontent.com",
          // "996813056756-go8l6e9b6e2qrejkqre5o1ggmb6naau4.apps.googleusercontent.com", // login google
        },
        fbSignInParams: {
          scope: "email,user_likes",
          return_scopes: true,
        },
        timer: 180,
        // tempTimer           : 0,
        policyPagePath: getPolicyPagePath(),
        errorGetVerifyCode: [],
        errorWaitingVerifycode: [],
        typeCheckField: 1,
        linkedAccount: [],
        emailGoogle: localStorage.getItem("emailGoogle")
          ? JSON.parse(
              decodeURIComponent(
                escape(window.atob(localStorage.getItem("emailGoogle")))
              )
            )
          : "",
        isLinkedAccount: false,
      };
    },

    validations: {
      form: {
        nickName: {
          required,
          // minLength: minLength(6),
        },
        mobile: {
          required,
          minLength: minLength(9),
          maxLength: maxLength(16),
        },
      },
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),
      ...mapState(PROFILE_INFO_MODULE_NAME, {
        mobileSignUp: "mobileSignUp",
      }),
      // ...mapActions(PROFILE_INFO_MODULE_NAME, {
      //   setMobileSignUp: "setMobileSignUp",
      // }),
      disableBtn() {
        if (this.isSignUpSocial) {
          return _.isEmpty(this.form.mobile);
        }
        return (
          _.isEmpty(this.form.mobile) ||
          _.isEmpty(this.form.nickName) ||
          this.isLoadingSubmit
        );
      },

      isSignUpSocial() {
        return this.token;
      },
    },

    watch: {
      password(value) {
        if (this.ui.submited === true) {
          this.validatePassword(value);
        }
      }, // password
      "form.nickName": function (value) {
        if (this.ui.submited === true) {
          this.validateNickName(value);
        }
      },
    },

    created() {
      if (!_.isEmpty(this.mobileSignUp)) {
        this.form.mobile = this.mobileSignUp;
      }
      // NOTE - Setup meta tag
      this.$metaTag.setup({
        title: "Đăng ký thành viên Go2Joy!",
        description:
          "Đăng ký làm thành viên của Go2Joy để có cơ hội nhận được những ưu đãi vô cùng hấp dẫn.",
        "og:type": "website",
        "og:title": "Đăng ký thành viên Go2Joy!",
        "og:description":
          "Đăng ký làm thành viên của Go2Joy để có cơ hội nhận được những ưu đãi vô cùng hấp dẫn.",
        "og:url": BASE_URL + window.location.pathname,
        "og:site_name": "Go2Joy",
        "og:image": "",
        "og:image:width": "1200",
        "og:image:height": "628",
      });
    },

    mounted() {
      setInterval(() => {
        this.timer -= 1;
      }, 1000);
    },

    methods: {
      isEmpty: _.isEmpty,
      onFacebook() {
        this.$refs["sign-up-social"].onSignInFb();
      },
      onGoogle() {
        this.$refs["sign-up-social"].googleSignIn();
      },
      openModalVerifyCode() {
        this.$refs["modal-verify-account"].openModal();
      },
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

      disableBtnSocial() {
        return (
          _.isEmpty(this.form.nickName) ||
          _.isEmpty(this.form.mobile) ||
          !this.ui.policy
        );
      },

      applyFilter(data) {
        this.form.verifyCode = data;
        this.verifyCodeBeforeSignUp();
      },

      applyModalPassword(data) {
        this.form.password = data;
        this.signUpManual();
      },

      clickFilter() {
        this.$refs["filter-modal"].showModal();
      },
      resendCode() {
        this.timer = 180;
        this.sendVerifyCodeSignUp();
      },

      resetModal() {
        setTimeout(() => {
          this.timer = 180;
        }, 500);
      },

      validatePassword(password) {
        var re =
          /^(?=.*[A-Za-z])(?=.*\d)[a-zA-Z0-9!@#$%^&*()~¥=_+}{":;'?/>.<,`\-\|\[\]]{6,16}$/;
        this.validationPassword = re.test(password);
      }, // validatePassword

      validateNickName(nickName) {
        var re = /^(?=.*[a-zA-Z])(?=.*[0-9])/gm;
        this.ui.validationNickName = re.test(nickName);
      }, // validatePassword

      submit() {
        this.ui.submited = true;
        // this.validateNickName(this.form.nickName);
        this.$v.$touch();

        //cai nay them do sau
        if (this.isSignUpSocial && !this.$v.form.mobile.$invalid) {
          // this.form.viaApp = 2; // dang test
          this.form.viaApp =
            this.token && localStorage.getItem("viaApp")
              ? localStorage.getItem("viaApp")
              : 1;
          // this.getVerifyCodeGuest();
          this.handleApplyVerifyCode();
          return;
        }
        if (!this.$v.$invalid) {
          // this.$refs["g2j-verify-modal"].openModal();
          // this.getVerifyCodeGuest();
          this.handleApplyVerifyCode();
        }
      }, // submit()

      // saveInfoMobileOld(value) {
      //   let self = this;
      //   let mobile = this.form.mobile.replace(/^0+/, '');
      //   const test = _.find(self.tempArray, function(obj) {
      //       if (obj.mobile == mobile && obj.countryCode == self.form.countryCode) {
      //           return true;
      //       }
      //   });

      //   if(test == undefined) {
      //     self.tempArray.push({
      //       countryCode: self.countryCodeOld,
      //       mobile: self.tempMobileOld,
      //       timer : value
      //     })
      //   } else {
      //     test.timer = value;
      //   }
      // },

      // checkDuplicate() {
      //   let self = this;
      //   let mobile = this.form.mobile.replace(/^0+/, '')
      //   if(self.tempArray.length > 0) {
      //     const test = _.find(self.tempArray, function(obj) {
      //       if (obj.mobile == mobile && obj.countryCode == self.form.countryCode) {
      //           return true;
      //       }
      //   });

      //   if(test == undefined) {
      //     self.fieldChecking();
      //   } else {
      //       if(test.timer > 1) {
      //         self.$refs['filter-modal'].showModal();
      //         self.timer = test.timer;
      //       } else {
      //         self.$refs['filter-modal'].showModal();
      //         self.timer = 180;
      //       }
      //     }
      //   } else {
      //     self.$refs['filter-modal'].showModal();
      //   }
      // },

      fieldChecking() {
        const self = this;
        this.isLoadingSubmit = true;
        apiCaller({
          metaUrl: AJAX_URL.login_v4.fieldChecking,
          data: {
            mobile: this.form.mobile,
            countryCode: this.form.countryCode,
            nickName: this.form.nickName,
            type: 1,
          },
          method: "GET",
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
              self.errorList = [];
              self.sendVerifyCodeSignUp(); // call api vertify code
            }
          },
          complete() {
            self.isLoadingSubmit = false;
          },
        });
      }, // fieldChecking()

      sendVerifyCodeSignUp() {
        const self = this;
        const formData = Object.keys(this.form).reduce((formData, key) => {
          formData.append(key, this.form[key]);
          return formData;
        }, new FormData());
        apiCaller({
          metaUrl: AJAX_URL.login_v4.sendVerifyCodeSignUp,
          data: formData,
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

            // self.tempMobileOld = self.mobile; // save old mobile
            self.countryCodeOld = self.form.countryCode; // save old mobile
            self.tempMobileOld = self.form.mobile.replace(/^0+/, ""); // save old mobile
          },
          complete() {},
        });
      }, // sendVerifyCodeSignUp()

      // test axios verifyCodeBeforeSignUp
      async verifyCodeBeforeSignUp() {
        const self = this;
        const formData = Object.keys(this.form).reduce((formData, key) => {
          formData.append(key, this.form[key]);
          return formData;
        }, new FormData());
        apiCaller({
          metaUrl: AJAX_URL.login_v4.verifyCodeBeforeSignUp,
          data: formData,
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
            self.$refs["filter-modal"].closeModal();

            let viaApp = self.token ? localStorage.getItem("viaApp") : 1;
            if (viaApp == 1) {
              setTimeout(() => {
                self.$refs["modal-password"].showModal();
              }, 500);
            } else {
              self.signUpManual();
            }
          },
          complete() {},
        });
      },
      // end test axios verifyCodeBeforeSignUp

      signUpManual() {
        const self = this;
        EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        apiCaller({
          metaUrl: AJAX_URL.login_v4.signup,
          data: {
            mobile: this.form.mobile,
            password: this.token ? "" : md5(this.form.password),
            nickName: this.form.nickName,
            verifyCode: this.form.verifyCode,
            countryCode: this.form.countryCode,
            isoCode: this.form.isoCode,
            viaApp: this.token ? localStorage.getItem("viaApp") : 1,
            token: this.token ? this.token.replaceAll('"', "") : "",
          },
          method: "POST",
          dataType: "json",

          error(err) {
            self.errorList = err.response?.data.error || [];
          },

          success(objResponse) {
            if (
              _.isEmpty(objResponse) ||
              objResponse.error ||
              _.isEmpty(objResponse.data)
            ) {
              self.errorList = objResponse.error || [];
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

              self.filterModalSignedUp = res?.couponSignUp ?? {};
              // có api thỉ mở khúc bên dưới
              self.$refs["modal-password"].closeModal();
              setTimeout(() => {
                self.$refs["modal-signed-up"].showModal();
              }, 500);

              // if(self.$route.params.redirect) {
              //   self.$router.replace(self.$route.params.redirect);
              // } else {
              //   self.$router.replace({ name: ROUTER_NAME['account-page'] });
              // }
              EventBus.emit(EVENT_BUS_KEY.UPDATE_USER_PROFILE);
            }
            // self.$refs['filter-modal'].closeModal();
          },
          complete() {
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          },
        });
      }, // signUpManual()

      //from phudnd with love v-v
      keyCountryCode(value, isoCode) {
        this.form.countryCode = value;
        this.form.isoCode = isoCode;
      },
      async getSignUp(code) {
        let _objData = {
          mobile: this.form.mobile,
          verifyCode: code,
          countryCode: this.form.countryCode,
          isoCode: this.form.isoCode || "VN",
          nickName: this.form.nickName,
          viaApp: this.token ? localStorage.getItem("viaApp") : 1,
          token: this.token,
          email: this.emailGoogle || null,
        };

        let self = this;
        self.errorGetVerifyCode = [];
        self.errorList = [];
        await apiCaller({
          metaUrl: AJAX_URL.login_v4.signUpV4,
          data: _objData,
          method: "POST",
          dataType: "json",
          error(err) {},
          success(objResponse) {
            if (
              _.isEmpty(objResponse) ||
              objResponse.error ||
              _.isEmpty(objResponse.data)
            ) {
              self.errorList = objResponse.error || [];
              self.errorGetVerifyCode = objResponse.error || [];
              return;
            }
            let data = objResponse?.data ?? [];
            self.$refs["g2j-verify-modal"].closeModal();
            if (objResponse.data.linkedAccount && self.isSignUpSocial) {
              self.linkedAccount = objResponse.data.linkedAccount;
              self.openModalVerifyCode();
              return;
            }
            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("expiresAt", JSON.stringify(data.expiresAt));
            // localStorage.setItem(
            //   "userInfo",
            //   btoa(JSON.stringify(data.userInfo))
            // );
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
        });
      },
      async getVerifyCodeGuest() {
        const _objData = {
          mobile: this.form.mobile,
          countryCode: this.form.countryCode,
        };

        //reset error
        this.errorList = [];
        this.errorGetVerifyCode = [];
        this.errorWaitingVerifycode = [];

        try {
          let res = await apiCaller({
            metaUrl: AJAX_URL.login_v4.sendVerifyCode,
            dataType: "json",
            data: _objData,
            method: "POST",
            contentType: "application/json; charset=utf-8",
          });
          this.$refs["g2j-verify-modal"].openModal();
          if (res.response && res.response.data.error) {
            this.errorWaitingVerifycode = res.response.data.error;
          }
          // if (res.data) {
          //   this.$refs["g2j-verify-modal"].openModal();
          // }
        } catch (error) {
          console.log("error :>> ", error.responseJSON);
        }
      },
      async getCheckField() {
        let _paramsCheckField = {
          viaApp: this.form.viaApp || 1,
          countryCode: this.form.countryCode || 84,
          mobile: this.form.mobile,
          nickName: this.form.nickName,
          type: this.typeCheckField,
        };
        this.errorList = []; //reset data
        let self = this;
        await apiCaller({
          metaUrl: AJAX_URL.login_v4.checkFieldV4,
          data: _paramsCheckField,
          method: "POST",
          dataType: "json",
          error(err) {},
          success(objResponse) {
            if (_.isEmpty(objResponse.data) || objResponse.error) {
              self.errorList = objResponse.error || [];
              return false;
            }
            if (objResponse.data) {
              return true;
            }
          },
        });
      },
      async handleApplyVerifyCode(code) {
        try {
          await this.getCheckField();
          if (!this.errorList || _.isEmpty(this.errorList)) {
            // this.getSignUp(code);
            this.getVerifyCodeGuest();
          }
        } catch (error) {
          console.log("error :>> ", error);
        }
      },
      onKeyDownInputNumber() {
        this.errorList = [];
        this.errorWaitingVerifycode = [];
      },
    },
    beforeDestroy() {
      setTimeout(() => {
        localStorage.removeItem("arrMobileVerify");
      }, 3000);
    },
  };
</script>
