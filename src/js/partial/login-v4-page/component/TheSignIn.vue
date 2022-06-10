<template>
  <div class="login">
    <div class="login__title">
      <div class="login__title--main">{{ $t('sign_in.welcome_to_go2joy') }}</div>
      <div class="login__title--sup">
        {{ $t('sign_in.sign_in_to_enjoy_your_stay_with_more_benefit') }}
      </div>
    </div>

    <div
      class="login__container-input"
      :class="{ 'input-error': $v.mobile.$error  }"
    >
      <Go2joyFlagSection
        v-if="countryCode"
        :code-country.sync="countryCode"
        @changeCodeCountry="keyCodeCountry"
      />
      <!-- <div
        @click="openModalCountry()"
        class="login__container-input--flag"
      >
        <img
          :src="`${IMAGE_URL}/static/area/${countryDefault.img}.png`"
          alt=""
          width="25px"
        >
        &nbsp;+({{countryDefault.id}})
      </div> -->
      <input
        v-focus
        class="input-field"
        type="number"
        v-model.lazy="$v.mobile.$model"
        :placeholder="$t('sign_in.mobile_number')"
        @keyup.enter="onSubmit()"
        @keydown="$v.$reset , onKeyDownInputNumber()"
      />
    </div>
    <div
      class=" w-100"
      v-for="(err, index) in errorList"
      :key="index"
    >
      <template v-if="err.code == 13">
        <div class="error-not-exist">
          <p>
            {{ $t('sign_in.account_exist') }}
          </p>
          <p
            @click="handleSetMobile()"
            class="error-not-exist__link-to"
          > {{ $t('sign_in.register_account') }}
          </p>
        </div>

      </template>
      <p
        class="error"
        v-else
      >{{err.message}}</p>

    </div>
    <div class="error w-100">
      <p v-for="(v,k) in errorWaitingVerifycode">{{v.message}}</p>
    </div>
    <div
      class="login__container-errors"
      v-if="$v.mobile.$error && $v.mobile.$dirty"
    >
      <p
        v-if="!$v.mobile.required"
        class="error w-100"
      >{{ $t('sign_in.mobile_is_required') }}</p>
      <p
        v-if="!$v.mobile.minLength ||!$v.mobile.maxLength "
        class="error w-100"
      >{{ $t('sign_in.mobile_must_have_9_to_16_digits') }}</p>

    </div>

    <div class="login__apply">
      <div class="login__apply--outer">
        <!-- <router-link :to="{name: 'forget-password-page'}">
          {{ $t('sign_in.forgot_your_password') }}
        </router-link> -->
      </div>
      <div class="login__apply--button">
        <button
          class="g2j-button-book-now"
          type="submit"
          :disabled="false"
          @click="onSubmit()"
        >{{ $t('sign_in.sign_in') }}</button>
      </div>
    </div>
    <div class="login__social">
      <p class="login__social--bold">{{ $t('sign_in.or_sign_in_via') }}</p>
      <sign-in-social />
      <p class="login__social--link">
        {{ $t('sign_in.dont_have_an_account') }}
        <router-link :to="{name: 'sign-up-page'}">
          {{ $t('sign_in.sign_up_now') }}
        </router-link>
      </p>
    </div>

    <!-- // START popup sign in by email -->
    <ModalSignInByEmail
      ref="modal-signin-email"
      :error-list="errorList"
      :mobile="form.mobile"
      :filter.sync="filter"
      @apply="applyModalSignInByEmail"
    />
    <!-- <g2j-select-country
      ref="g2j-select-country"
      :code-country.sync="countryCode"
      @changeCodeCountry="keyCodeCountry"
      @dataCountry="getDataCountry"
    >

    </g2j-select-country> -->
    <!-- // END popup sign in by email -->

    <g2j-verify-modal
      ref="g2j-verify-modal"
      :country-code="countryCode"
      :phone-number="mobile"
      :error-waiting-verifycode="errorWaitingVerifycode"
      :errorGetVerifyCode="errorGetVerifyCode"
      @getVerifyCode="getVerifyCodeGuest"
      @applyVerifyCode="getLogin"
      @resentVerifyCode="getVerifyCodeGuest"
    >
    </g2j-verify-modal>

  </div>
</template>
<script>
  import SignInSocial from "./SignInSocial.vue";
  import Go2joyFlagSection from "~jsPartialPath/global/component/go2joy-flags/Go2joyFlagsSection.vue";
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import ModalSignInByEmail from "./ModalSignInByEmail.vue";
  import { ROUTER_NAME } from "~jsBasePath/vue-router/router-define";
  import { EVENT_BUS_KEY } from "~jsDefinePath/event-bus";
  import { G2JRouter, getG2JRoute } from "~jsHelperPath/util/HandleRouterGlobal";
  import { MODULE_NAME as PROFILE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/profile-info-module";

  import {
    _,
    Vue,
    mapActions,
    required,
    requiredIf,
    minLength,
    maxLength,
  } from "~jsLibPath/lib-manager";
  import {
    IMAGE_URL,
    IS_MOBILE,
    ASSETS_SERVICE_URL,
    getToken,
  } from "~jsDefinePath/general";
  Vue.use(vuelidate.default);

  // Code này dựa trên code cũ của Thành
  // khó hiểu thì liên hệ Thành : thanh.nguyen@go2joy.vn - 0937519106

  //Phu chi là ng đến sau
  //Nếu thấy bất lực thì nâng số sau lên 1: 28

  export default {
    name: "SignInPage",
    components: {
      SignInSocial,
      Go2joyFlagSection,
      ModalSignInByEmail,
      "g2j-select-country": () =>
        import(
          "~jsPartialPath/global/component/g2j-select-country/G2JSelectCountry.vue"
        ),
      "g2j-verify-modal": () =>
        import(
          "~jsPartialPath/global/component/modal-vetify-code/ModalVerifyCode.vue"
        ),
    },
    data() {
      Vue.use(vuelidate.default);
      return {
        IMAGE_URL,
        form: {
          email: "",
          mobile: "",
          password: "",
          passwordEmail: "",
          countryCode: "84",
        },

        ui: {
          isSubmitting: false,
          // isCheckedMobile: true,
          // isCheckedEmail: false
          submited: false,
        },

        verifyCode: "",
        viaApp: 1,
        token: "",

        showPassword: false,
        showPasswordEmail: false,
        validationEmail: true,
        errorList: [],

        // main
        isMobileTabActive: true,

        mobile: "",
        countryCode: "84",

        countryDefault: {
          code: "VN",
          id: 84,
          img: "flag_vn",
          name: "Viet Nam",
        },

        errorWaitingVerifycode: [],
        errorGetVerifyCode: [],
      };
    },

    validations() {
      return {
        mobile: {
          required,
          minLength: minLength(9),
          maxLength: maxLength(16),
        },
      };
      // form: {
      //   mobile: {
      //     required,
      //     // minLength: minLength(9),
      //     minLength: requiredIf(function () {
      //       if (this.isMobileTabActive) {
      //         return minLength(9);
      //       }
      //     }),
      //     // maxLength: maxLength(16)
      //     maxLength: requiredIf(function () {
      //       if (this.isMobileTabActive) {
      //         return maxLength(16);
      //       }
      //     }),
      //   },
      //   email: {
      //     required: requiredIf(function () {
      //       return !this.isMobileTabActive;
      //     }),
      //   },
      //   password: {
      //     // required,
      //     required: requiredIf(function () {
      //       return this.isMobileTabActive;
      //     }),
      //   },
      //   passwordEmail: {
      //     // required,
      //     required: requiredIf(function () {
      //       return !this.isMobileTabActive;
      //     }),
      //   },
      // },
    },

    created() {
      this.setMobileSignUp("");
      if (localStorage.getItem("tokenSocial") != null) {
        localStorage.removeItem("tokenSocial");
      }
    },

    methods: {
      isEmpty: _.isEmpty,
      getDataCountry(data) {
        this.countryDefault = data;
      },
      openModalCountry() {
        this.$refs["g2j-select-country"].openModal();
      },
      validEmail(email) {
        var re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.validationEmail = re.test(email);
      },

      applyModalSignInByEmail(data) {
        this.isMobileTabActive = data;
        this.$refs["g2j-verify-modal"].closeModal();
      },

      fieldChecking() {
        const self = this;
        self.ui.isSubmitting = true;
        apiCaller({
          metaUrl: AJAX_URL.login_v4.fieldChecking,
          data: {
            mobile: self.isMobileTabActive ? self.form.mobile : "",
            countryCode: self.form.countryCode,
            type: 2,
          },
          method: "GET",
          dataType: "json",
          error(err) {
            self.errorList = err.response?.data.error || [];
            self.errorList.filter(function (err) {
              if (err.code === 17) {
                self.$refs["modal-signin-email"].showModal();
              }
            });
          },
          success(objResponse) {
            if (_.isEmpty(objResponse) || objResponse.error) {
              self.errorList = objResponse.error;
              return;
            }
            if (objResponse.data == true) {
              self.errorList = [];
              // self.submit(); // call api vertify code
              self.submitManual();
            }
          },
          complete() {
            self.ui.isSubmitting = false;
          },
        });
      }, // fieldChecking()

      submit() {
        // this.fieldChecking()
        this.$v.$touch();
        // self.ui.submited = true;

        // // if(self.isMobileTabActive === false) {
        // //   self.form.countryCode = ''
        // //   self.form.mobile = ''
        // // } else {
        // //   self.form.email = ''
        // // }

        // if (self.isMobileTabActive === false) {
        //   if (isNaN(self.form.email) == true) {
        //     // là kiểu string
        //     self.validEmail(self.form.email);
        //   }
        // }

        // if (self.isMobileTabActive === false) {
        //   if (self.validationEmail == true) {
        //     self.$v.$touch();
        //     if (!self.$v.$invalid) {
        //       self.fieldChecking();
        //     }
        //   }
        // } else {
        //   console.log('do day ne');
        //   if (!self.$v.$invalid) {
        //     self.fieldChecking();
        //   }
        // }
      },

      submitManual() {
        let self = this;
        self.ui.isSubmitting = true;

        apiCaller({
          metaUrl: AJAX_URL.login_v4.signIn,
          data: {
            email: self.isMobileTabActive ? "" : self.form.email,
            mobile: self.isMobileTabActive ? self.form.mobile : "",
            password: md5(
              self.isMobileTabActive
                ? self.form.password
                : self.form.passwordEmail
            ),
            countryCode: self.isMobileTabActive ? self.form.countryCode : "",
            remember: 1,
            token: "",
            viaApp: 1,
          },
          method: "POST",
          dataType: "json",
          error(err) {
            self.errorList = err.response?.data.error || [];
          },
          success(objResponse) {
            if (!objResponse || objResponse.error || !objResponse.data) {
              self.errorList = objResponse.error;
              return;
            }
            let data = objResponse?.data ?? [];
            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("expiresAt", JSON.stringify(data.expiresAt));
            // localStorage.setItem("userInfo", JSON.stringify(data.userInfo));
            // localStorage.setItem(
            //   "userInfo",
            //   btoa(JSON.stringify(objResponse.data))
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
          complete() {
            self.ui.isSubmitting = false;
          },
        });
      }, // submitManual()

      keyCodeCountry(value) {
        this.countryCode = value;
      },

      //from phudnd with love v-v
      onSubmit() {
        this.$v.$touch();
        if (this.$v.mobile.$error && this.$v.mobile.$dirty) {
          console.log("nhap dung di homie");
          return;
        } else {
          // this.getCheckField();
          // this.getVerifyCodeGuest();
          this.handleApplyVerifyCode();
        }
      },
      async handleApplyVerifyCode() {
        try {
          await this.getCheckField();
          if (!this.errorList || _.isEmpty(this.errorList)) {
            this.getVerifyCodeGuest();
          }
        } catch (error) {
          console.log("error :>> ", error);
        }
      },
      async getVerifyCodeGuest() {
        const _objData = {
          mobile: this.mobile,
          countryCode: this.countryCode,
        };
        this.errorWaitingVerifycode = [];
        this.errorGetVerifyCode = [];
        try {
          let res = await apiCaller({
            metaUrl: AJAX_URL.login_v4.sendVerifyCode,
            dataType: "json",
            data: _objData,
            method: "POST",
            contentType: "application/json; charset=utf-8",
          });
          // if (!this.isEmpty(res) || !this.isEmpty(res.data)) {
          //   this.$refs["g2j-verify-modal"].openModal();
          // }

          this.$refs["g2j-verify-modal"].openModal();
          if (res.response && res.response.data.error) {
            this.errorWaitingVerifycode = res.response.data.error;
          }
          // if (res.data) {
          //   this.$refs["g2j-verify-modal"].openModal();
          // }
        } catch (error) {
          console.log("error :>> ", error);
        }
      },
      async getLogin(code) {
        let _objData = {
          mobile: this.mobile,
          countryCode: this.countryCode,
          viaApp: this.viaApp,
          verifyCode: code,
        };

        let self = this;

        await apiCaller({
          metaUrl: AJAX_URL.login_v4.signInV4,
          data: _objData,
          method: "POST",
          dataType: "json",
          error(err) {
            // self.errorList = err.response?.data.error || [];
            // self.errorList.filter(function (err) {
            //   if (err.code === 17) {
            //     self.$refs["modal-signin-email"].showModal();
            //   }
            // });
          },
          success(objResponse) {
            self.errorList = [];
            self.errorGetVerifyCode = [];
            if (_.isEmpty(objResponse) || objResponse.error) {
              self.errorList = objResponse.error;
              self.errorGetVerifyCode = objResponse.error;
              return;
            }
            self.$refs["g2j-verify-modal"].closeModal();
            let data = objResponse?.data ?? [];
            if (data) {
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
            }

            EventBus.emit(EVENT_BUS_KEY.UPDATE_USER_PROFILE);
          },
        });
      },

      async getCheckField() {
        let _paramsCheckField = {
          viaApp: 1,
          countryCode: this.countryCode || 84,
          mobile: this.mobile,
          nickName: this.nickName,
          type: 2, //type 2 doi voi sign in
        };
        this.errorList = []; //reset error
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
      onKeyDownInputNumber() {
        if (this.errorList.length) {
          this.errorList = [];
        }
        if (this.errorWaitingVerifycode.length) {
          this.errorWaitingVerifycode = [];
        }
        if (this.errorGetVerifyCode.length) {
          this.errorGetVerifyCode = [];
        }
      },
      handleSetMobile() {
        this.setMobileSignUp(this.mobile);
        this.$router.push({ name: "sign-up-page" });
      },
      ...mapActions(PROFILE_INFO_MODULE_NAME, {
        setMobileSignUp: "setMobileSignUp", // luu vo vuex/profile-info
      }),
    },
    beforeDestroy() {
      setTimeout(() => {
        localStorage.removeItem("arrMobileVerify");
      }, 3000);
    },
    computed: {},
  };
</script>
