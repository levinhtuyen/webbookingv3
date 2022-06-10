<template>
  <div
    ref="MainProfilePage"
    class="main-profile-page container"
  >
    <div class="profile-page">
      <div class="profile-page__title">
        <p>{{ $t('profile.profile') }} </p>
      </div>
      <div class="profile-page__content">
        <div class="profile-page__content--content">
          <div class="profile-page__content--content-line">
            <div class="content-title">
              <span>{{ $t('profile.nick_name') }}</span>
              <span class="color-red">(*)</span>
            </div>
            <div class="content-info">
              <input
                v-model="dataProfile.nickName"
                class="input-info"
                type="text"
                @input="checkValidateNicknameMobile(dataProfile.nickName,dataProfile.mobile)"
              >
            </div>
          </div>
          <div
            v-if="dataProfile.nickName == ''"
            class="profile-page__display-mesage-error"
          >
            <p>{{ $t('profile.validate_value.nick_name_required') }}</p>
          </div>
          <div
            v-if="errorUserName != []"
            class="profile-page__display-mesage-error"
          >
            <p
              v-for="(messageError, index) in errorUserName"
              :key="index"
            >
              {{ messageError.message }}
            </p>
          </div>
        </div>
        <div class="profile-page__content--content">
          <div class="profile-page__content--content-line">
            <div class="content-title">
              <span>{{ $t('profile.email') }} </span>
            </div>
            <div class="content-info ">
              <!-- <div class="input-info">
                {{ dataProfile.email }}
              </div> -->
              <input
                v-model.trim="dataProfile.email"
                class="input-info"
                type="text"
                @input="validateEmail(dataProfile.email)"
              >
            </div>
            <div
              v-if="isEmail == false"
              class="profile-page__display-mesage-error"
            >
              <p>{{ $t('profile.validate_value.email') }}</p>
            </div>
          </div>
        </div>
        <!-- <div class="profile-page__content--content ">
          <div class="profile-page__content--content-line">
            <div class="content-title">
              <span>{{ $t('profile.mobile_number') }}</span>
              <span class="color-red">(*)</span>
            </div>
            <div class="content-info">
              <div class="flag">
                <Go2joyFlagsSection
                  v-if="dataProfile.countryCode"
                  :code-country="dataProfile.countryCode"
                  @changeCodeCountry="changeCodeCountry"
                />
              </div>
              <input
                v-model="dataProfile.mobile"
                class="input-info"
                type="number"
                @input="checkValidateNicknameMobile(dataProfile.nickName,dataProfile.mobile),errorMobile = []"
              >

            </div>
            <div
              v-if="isphone == false"
              class="profile-page__display-mesage-error"
            >
              <p>{{ $t('profile.validate_value.phone_number') }}</p>
            </div>
          </div>
          <div
            v-if="dataProfile.mobile == ''"
            class="profile-page__display-mesage-error"
          >
            <p>{{ $t('profile.validate_value.mobile_required') }}</p>
          </div>
          <div
            v-if="errorMobile != []"
            class="profile-page__display-mesage-error"
          >
            <p
              v-for="(messageError, index) in errorMobile"
              :key="index"
            >
              {{ messageError.message }}
            </p>
          </div>
        </div> -->
        <div class="profile-page__content--content">
          <div class="profile-page__content--content-line">
            <div class="content-title">
              <span>{{ $t('profile.mobile_number') }}</span>
            </div>
            <div class="content-info content-email">
              <div class="input-info">
                +({{dataProfile.countryCode}}) {{dataProfile.mobile}}
              </div>
            </div>
            <!-- <div
              v-if="isEmail == false"
              class="profile-page__display-mesage-error"
            >
              <p>{{ $t('profile.validate_value.email') }}</p>
            </div> -->
          </div>
        </div>

        <!-- end -->
        <div class="profile-page__content--content">
          <div class="profile-page__content--content-line">
            <div class="content-title">
              <span>{{ $t('profile.date_of_birth') }}</span>
            </div>
            <div class="content-date-of-birth-info">
              <!-- <span>{{ formatDate(dataProfile.birthday) }}</span>
              {{ valueTime }}
              <div class="content-date-of-birth__icon">
                <img :src="IMAGE_URL + '/svg/calendar.svg'" alt="" />

              </div> -->
              <el-date-picker
                v-model="dataProfile.birthday"
                type="date"
                lang="en"
                format="dd/MM/yyyy"
              />
            </div>
          </div>
        </div>
        <div class="profile-page__content--content">
          <div class="profile-page__content--content-line">
            <div class="content-title">
              <span>{{ $t('profile.gender') }}</span>
            </div>
            <div class="content-gender-info">
              <div class="content-gender-info__filter">
                <FilterSelect
                  :options="optionGender"
                  :selected="dataProfile.gender"
                  @handleSelectedChange="handleSelectedChangeGender"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="profile-page__display-mesage-error-center" v-if="checkError != []">
                  <p v-for="(messageError, index) in checkError" :key="index">
                      {{ messageError.message }}
                  </p>
              </div> -->
      </div>
      <!-- class="profile-page__button-update--button" -->
      <div class="profile-page__button-update">
        <button
          class="g2j-button-book-now"
          @click="funcUpdateProfile()"
        >
          {{ $t('profile.update') }}
        </button>
      </div>
      <!-- <div
        v-if="signInSocial == false"
        class="profile-page__password"
      >
        <div class="profile-page__password-line">
          <div class="profile-page__password-line--content-line">
            <div class="content-title">
              <span>{{ $t('profile.password') }}</span>
              <span class="color-red">(*)</span>
            </div>
            <div class="content-info">
              <input
                id="password-field-profile"
                v-model="password"
                autocomplete="new-password"
                class="input-info-password"
                type="password"
                placeholder="*********"
                @input="checkValidatePassword(password,passwordNew,passwordConfirm)"
              >
              <div class="content-info-icon">
                <span
                  toggle="password-field-profile"
                  class="fa fa-fw fa-eye-slash field-icon toggle-password"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="profile-page__password-line">
          <div class="profile-page__password-line--content-line">
            <div class="content-title">
              <span>{{ $t('profile.new_password') }} </span>
              <span class="color-red">(*)</span>
            </div>
            <div class="content-info">
              <input
                id="new-password-field-profile"
                v-model="passwordNew"
                autocomplete="new-password"
                class="input-info-password"
                type="password"
                placeholder="*********"
                @input="checkValidatePassword(password,passwordNew,passwordConfirm)"
              >
              <div class="content-info-icon">
                <span
                  toggle="new-password-field-profile"
                  class="fa fa-fw fa-eye-slash field-icon toggle-password"
                />
              </div>
            </div>
          </div>
          <div
            v-if="passwordNew == '' && checkPassword == true"
            class="profile-page__display-mesage-error"
          >
            <p>{{ $t('profile.validate_value.new_password_required') }}</p>
          </div>
        </div>
        <div class="profile-page__password-line">
          <div class="profile-page__password-line--content-line">
            <div class="content-title">
              <span>{{ $t('profile.confirm_password') }}</span>
              <span class="color-red">(*)</span>
            </div>
            <div class="content-info">
              <input
                id="confirm-password-field-profile"
                v-model="passwordConfirm"
                autocomplete="new-password"
                class="input-info-password"
                type="password"
                placeholder="*********"
                @input="checkValidatePassword(password,passwordNew,passwordConfirm)"
              >
              <div class="content-info-icon">
                <span
                  toggle="confirm-password-field-profile"
                  class="fa fa-fw fa-eye-slash field-icon toggle-password"
                />
              </div>
            </div>
          </div>
          <div
            v-if="passwordConfirm == '' && checkPassword == true"
            class="profile-page__display-mesage-error"
          >
            <p>{{ $t('profile.validate_value.confirm_password_required') }}</p>
          </div>
        </div>
      </div> -->
      <!-- <div
        v-if="checkErrorPassword != null"
        class="profile-page__display-mesage-error-center"
      >
        <p
          v-for="(messageError, index) in checkErrorPassword"
          :key="index"
        >
          {{ messageError.message }}
        </p>
      </div> -->

      <!-- <div
        v-if="signInSocial == false"
        class="profile-page__button-update"
      >
        <button
          class="g2j-button-book-now"
          @click="getUpdatePassword()"
        >
          {{ $t('profile.change_password') }}
        </button>
      </div> -->
    </div>
    <PopupModalSuccess
      ref="popup-modal-success"
      @close="closePopupModalSuccess"
    />

    <PopupModalVerifyCode
      v-if="dataProfile.mobile && dataProfile.countryCode"
      ref="popup-modal-verify-code"
      :country-code="dataProfile.countryCode"
      :phone-number="dataProfile.mobile"
      :count-down="minutesAndSeconds(timer)"
      :error-waiting-verifycode="errorWaitingVerifycode"
      :check-error-verify-code="checkErrorVerifyCode"
      :active-send-code="activeSendCode"
      @close="closePopupModalVerifyCode"
      @sendVerifyCode="sendVerifyCode"
      @getVerifyCodeInput="getVerifyCodeInput"
    />
    <PopupChangePasswordSuccess
      ref="popup-modal-password-success"
      @close="closePopupModalChangePasswordSuccess"
    />
  </div>
</template>

<script>
  import { _ } from "~jsPath/lib/lib-manager";
  import FilterSelect from "../global/component/FilterSelect.vue";
  import { IMAGE_URL, getToken, BASE_URL } from "~jsDefinePath/general";

  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import Go2joyFlagsSection from "../global/component/go2joy-flags/Go2joyFlagsSection.vue";
  import PopupModalSuccess from "./component/PopupSuccess.vue";
  import PopupModalVerifyCode from "./component/PopupVerifyCode.vue";
  import PopupChangePasswordSuccess from "./component/PopupChangePasswordSuccess.vue";

  export default {
    components: {
      FilterSelect,
      Go2joyFlagsSection,
      PopupModalSuccess,
      PopupModalVerifyCode,
      PopupChangePasswordSuccess,
    },
    data() {
      return {
        BASE_URL,
        IMAGE_URL,
        dataProfile: {
          birthday: null,
        },
        password: "",
        passwordNew: "",
        passwordConfirm: "",
        checkError: [],
        checkData: false,
        dataOld: {},
        valueTime: "",
        checkVerify: false,
        checkErrorPassword: [],
        language: localStorage.getItem("g2j-translate-language"),
        type: 2,
        timer: 180,
        activeSendCode: false,
        checkErrorVerifyCode: "",
        errorUserName: [],
        errorEmail: [],
        errorMobile: [],
        errorWaitingVerifycode: [],
        signInSocial: false,
        checkPassword: false,
      };
    },
    computed: {
      optionGender() {
        return [
          {
            value: 1,
            label: this.$t("profile.male"),
          },
          {
            value: 2,
            label: this.$t("profile.female"),
          },
        ];
      }, // topAreaFavorite
    },
    async created() {
      // NOTE - Setup meta tag
      this.$metaTag.setup({
        title: "Tài khoản của tôi - Go2Joy",
        description: "Trang thông tin tài khoản",
        "og:type": "website",
        "og:title": "Tài khoản của tôi - Go2Joy",
        "og:description": "Trang thông tin tài khoản",
        "og:url": BASE_URL + window.location.pathname,
        "og:site_name": "Go2Joy",
        "og:image": "",
        "og:image:width": "1200",
        "og:image:height": "628",
      });

      // NOTE - Get user profile
      await this.getUserProfile();
      // EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
    },
    mounted() {
      const self = this;
      // NOTE - instead getElementsBuClassName from document we will use MainProfilePage DOM to get that elements, this will reduce amount of DOM and enhance performance
      const elTogglePassword =
        self.$refs["MainProfilePage"].getElementsByClassName("toggle-password");

      if (elTogglePassword.length) {
        for (const elTogglePasswordItem of elTogglePassword) {
          elTogglePasswordItem.addEventListener("click", function () {
            const arrClassList = this.classList;

            if (arrClassList.contains("fa-eye-slash")) {
              arrClassList.remove("fa-eye-slash");
              arrClassList.add("fa-eye");
            } else {
              arrClassList.remove("fa-eye");
              arrClassList.add("fa-eye-slash");
            }

            const elPasswordInput = document.getElementById(
              this.getAttribute("toggle")
            );

            if (elPasswordInput) {
              console.log(elPasswordInput.getAttribute("type"));
              if (elPasswordInput.getAttribute("type") === "password") {
                elPasswordInput.setAttribute("type", "text");
                elPasswordInput.setAttribute("class", "input-font-size");
              } else {
                elPasswordInput.setAttribute("type", "password");
                elPasswordInput.setAttribute("class", "input-info-password");
              }
            }
          });
        }
      }

      ELEMENT.locale(ELEMENT.lang.en);

      setInterval(() => {
        this.timer -= 1;
      }, 1000);
      this.checkValidatePassword(
        this.password,
        this.passwordNew,
        this.passwordConfirm
      );
    },
    methods: {
      async getUserProfile() {
        let self = this;
        EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        await apiCaller({
          metaUrl: AJAX_URL.profile.profile,
          // url: `https://staging-api.go2joy.vn/api/v3/web-booking/user/getUserProfile`,
          dataType: "json",
          method: "GET",
          headers: {
            Authorization: getToken(),
          },
          contentType: "application/json; charset=utf-8",
          success: function (result) {
            let data = result.data;
            self.dataProfile = data;
            self.dataOld = _.cloneDeep(data);
            self.dataProfile.viaApp == 1
              ? (self.signInSocial = false)
              : (self.signInSocial = true);
            self.dataOld = _.cloneDeep(data);
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          },
          error: function (error) {
            console.log("error :>> ", error);
          },
        });
      }, // getUserProfile()

      async funcUpdateProfile() {
        EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        let self = this;
        self.dataProfile.birthday = dayjs(self.dataProfile.birthday).format(
          "YYYY-MM-DD"
        );
        await self.getFieldChecking();
        if (self.checkData == true) {
          if (
            self.dataProfile.mobile != self.dataOld.mobile ||
            self.dataProfile.countryCode != self.dataOld.countryCode
          ) {
            await self.sendVerifyCode();
            if (self.checkVerify == true) {
              EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
              await self.showPopupModalVerifyCode();
            }
          } else {
            this.getUpdateData();
          }
        }
      }, //funcUpdateProfile

      changeCodeCountry(value) {
        this.dataProfile.countryCode = value;
      }, //changeCodeCountry

      getVerifyCodeInput(verifyCodeInput) {
        this.dataProfile.verifyCode = verifyCodeInput;
        this.getUpdateData();
      }, //getVerifyCodeInput

      getUpdateData() {
        let self = this;
        self.errorUserName = [];
        self.errorMobile = [];
        EventBus.emit("IS_SHOW_ROUTER_LOADING", true);

        const dataSendStringify = JSON.stringify({
          ...this.dataProfile,
          _method: "PUT",
        });
        let _params = {
          ...this.dataProfile,
        };
        // _params.birthday = null;

        apiCaller({
          // metaUrl: AJAX_URL.profile.updateProfile,
          metaUrl: AJAX_URL.profile.updateProfile,
          dataType: "json",
          method: "POST",
          data: _params,
          headers: {
            Authorization: getToken(),
          },
          contentType: "application/json; charset=utf-8",
          success: function (result) {
            // let data = result.data
            if (result.data != null) {
              EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
              self.showPopupModalSuccess();
              // localStorage.setItem("userInfo", btoa(JSON.stringify(result.data)));
              localStorage.setItem(
                "userInfo",
                btoa(unescape(encodeURIComponent(JSON.stringify(result.data))))
              );
            } else {
              EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
              if (result.error && result.error.length > 0) {
                self.errorUserName = result.error.filter(
                  (item) => item.code >= 7 && item.code <= 9
                );
                self.errorMobile = result.error.filter(
                  (item) => item.code >= 1 && item.code <= 3
                );
                self.checkError = result.error.filter((item) => item.code == 20);
                self.errorWaitingVerifycode = self.checkError[0];
                if (self.checkError && self.checkError.length > 0) {
                  self.showPopupModalVerifyCode();
                }
              }
            }
          },
          error: function (error) {
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
            self.checkError = error.responseJSON.error;
            self.errorUserName = error.responseJSON.error.filter(
              (item) => (item.code >= 7 && item.code <= 9) || item.code == 15
            );
            self.errorMobile = error.responseJSON.error.filter(
              (item) => item.code >= 1 && item.code <= 3
            );
          },
        });
      }, // getUpdateData()

      async getFieldChecking() {
        let self = this;
        EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        let dataCheck = {
          birthday: "",
          countryCode: "",
          email: "",
          gender: 0,
          mobile: "",
          nickName: "",
        };
        self.errorUserName = [];
        self.errorMobile = [];
        self.dataProfile.birthday != self.dataOld.birthday
          ? (dataCheck.birthday = self.dataProfile.birthday)
          : "";
        self.dataProfile.email != self.dataOld.email
          ? (dataCheck.email = self.dataProfile.email)
          : "";
        self.dataProfile.gender != self.dataOld.gender
          ? (dataCheck.gender = self.dataProfile.gender)
          : "";
        if (
          self.dataProfile.countryCode != self.dataOld.countryCode ||
          self.dataProfile.mobile != self.dataOld.mobile
        ) {
          dataCheck.countryCode = self.dataProfile.countryCode;
          dataCheck.mobile = self.dataProfile.mobile;
        }

        self.dataProfile.nickName != self.dataOld.nickName
          ? (dataCheck.nickName = self.dataProfile.nickName)
          : "";

        const dataSend = {
          userId: this.dataProfile.sn,
          mobile: dataCheck.mobile,
          gender: dataCheck.gender,
          nickName: dataCheck.nickName,
          email: dataCheck.email,
          birthday: dataCheck.birthday,
          countryCode: dataCheck.countryCode,
        };

        await apiCaller({
          metaUrl: AJAX_URL.profile.fieldCheckingProfile,
          data: dataSend,
          dataType: "json",
          method: "GET",
          headers: {
            Authorization: getToken(),
          },
          contentType: "application/json; charset=utf-8",
          success: function (result) {
            self.checkData = result.data;

            if (result.error && result.error.length > 0) {
              self.errorUserName = result.error.filter(
                (item) => item.code >= 7 && item.code <= 9
              );
              self.errorMobile = result.error.filter(
                (item) => item.code >= 1 && item.code <= 3
              );
            }

            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          },
          error: function (error) {
            self.errorUserName = error.responseJSON.error.filter(
              (item) => item.code >= 7 && item.code <= 9
            );
            self.errorMobile = error.responseJSON.error.filter(
              (item) => item.code >= 1 && item.code <= 3
            );
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          },
        });
      }, // getFieldChecking()

      async sendVerifyCode() {
        let self = this;
        let dataBody = {
          mobile: this.dataProfile.mobile,
          countryCode: this.dataProfile.countryCode,
        };
        await apiCaller({
          metaUrl: AJAX_URL.profile.sendVerifyCodeSignUp,
          dataType: "json",
          method: "POST",
          headers: {
            Authorization: getToken(),
          },
          data: JSON.stringify(dataBody),
          contentType: "application/json; charset=utf-8",
          success: function (result) {
            // let data = result.data
            self.checkVerify = result.data;
            if (self.checkVerify == true) {
              self.errorWaitingVerifycode = [];
            }
            self.timer = 3 * 60;
            self.minutesAndSeconds(self.timer);
            self.checkError = [];
            if (result.error && result.error.length > 0) {
              self.errorMobile = result.error.filter(
                (item) => item.code == 2 && item.code == 14
              );
            }
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          },
          error: function (error) {
            self.errorMobile = [];
            self.errorMobile = error.responseJSON.error[0];
            if (self.errorMobile.code == 14 || self.errorMobile.code == 4) {
              self.errorMobile = error.responseJSON.error;
            } else {
              self.errorWaitingVerifycode = error.responseJSON.error[0];
              self.showPopupModalVerifyCode();
            }
            // if(error.responseJSON.error.length > 0){
            //   self.errorMobile = error.responseJSON.error.filter(item => (item.code == 14));
            // }else{
            //   self.errorWaitingVerifycode = error.responseJSON.error.filter(item => (item.code == 15));
            //   self.showPopupModalVerifyCode();
            // }

            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          },
        });
      }, //checkVerifyCode()

      handleSelectedChangeGender(val) {
        this.dataProfile.gender = val;
      }, // handleSelectedChangeGender(),

      getUpdatePassword() {
        let self = this;
        self.checkErrorPassword = [];
        EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        let dataPassword = {
          // currentPassword: "e99a18c428cb38d5f260853678922e03",
          // newPassword: 'e99a18c428cb38d5f260853678922e03'
          currentPassword: md5(self.password),
          newPassword: md5(self.passwordNew),
        };
        if (
          (self.password != "" ||
            self.passwordNew != "" ||
            self.passwordConfirm != "") &&
          self.passwordNew == self.passwordConfirm
        ) {
          const dataSendStringify = JSON.stringify({
            ...dataPassword,
            _method: "PUT",
          });

          apiCaller({
            metaUrl: AJAX_URL.profile.updateUserPassword,
            dataType: "json",
            method: "POST",
            data: dataSendStringify,
            headers: {
              Authorization: getToken(),
            },
            contentType: "application/json; charset=utf-8",
            success: function (result) {
              EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
              self.showPopupModalChangePasswordSuccess();
            },
            error: function (error) {
              self.checkErrorPassword = error.responseJSON.error;
              EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
            },
          });
        } else {
          EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          if (self.passwordNew != self.passwordConfirm) {
            self.checkErrorPassword[0] = {
              message: `${this.$t("profile.change_password_popup.error")}`,
            };
          } else {
            self.checkErrorPassword[0] = {
              message: `${this.$t("profile.change_password_popup.required")}`,
              // message: "Password, new password, confirm password is required ! "
            };
          }
        }
      }, //getUpdatePassword

      showPopupModalVerifyCode() {
        this.$refs["popup-modal-verify-code"].showModalVerifyCode();
      }, //showPopupModalVerifyCode

      closePopupModalVerifyCode() {
        this.$refs["popup-modal-verify-code"].closeModalVerifyCode();
      }, //closePopupModalVerifyCode

      showPopupModalSuccess() {
        this.$refs["popup-modal-success"].showModalSuccess();
      }, //showPopupModalSuccess

      closePopupModalSuccess() {
        this.$refs["popup-modal-success"].closeModalSuccess();
      }, //closePopupModalSuccess

      showPopupModalChangePasswordSuccess() {
        this.$refs["popup-modal-password-success"].showModalPasswordSuccess();
      }, //showPopupModalSuccess

      closePopupModalChangePasswordSuccess() {
        this.$refs["popup-modal-password-success"].closeModalPasswordSuccess();
      }, //closePopupModalSuccess

      telephoneCheck(str) {
        this.isphone =
          /^(1\s|2|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(
            str
          );
      }, //telephoneCheck

      validateEmail(email) {
        this.isEmail =
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            email
          );
        let btnSubmit = document.getElementsByClassName("g2j-button-book-now")[0];
        if (email == "") {
          btnSubmit.classList.remove("displayButton");
          btnSubmit.classList.add("noneDisplayButton");
          btnSubmit.disable = true;
          btnSubmit.disabled = "disabled";
        } else {
          btnSubmit.classList.remove("noneDisplayButton");
          btnSubmit.classList.add("displayButton");
          btnSubmit.disabled = "";
        }
      }, //validateEmail

      minutesAndSeconds(value) {
        if (value > 0) {
          var minutes = Math.floor(parseInt(value, 10) / 60);

          var seconds = parseInt(value, 10) - minutes * 60;
          if (seconds < 10) {
            seconds = "0" + seconds;
          }
          return `${minutes}:${seconds}`;
        } else {
          this.activeSendCode = true;
          return `0:00`;
        }
      }, //minutesAndSeconds

      checkValidateNicknameMobile(nickname, mobile, email) {
        // "g2j-button-book-now"
        let input = document.getElementsByClassName("g2j-button-book-now")[0];
        if (nickname == "" || mobile == "" || email) {
          input.classList.remove("displayButton");
          input.classList.add("noneDisplayButton");
          input.disable = true;
          input.disabled = "disabled";
        } else {
          input.classList.remove("noneDisplayButton");
          input.classList.add("displayButton");
          input.disabled = "";
        }
      }, //checkValidate
      checkValidateEmail(email) {
        // "g2j-button-book-now"
        let input = document.getElementsByClassName("g2j-button-book-now")[0];
        if (email == "") {
          input.classList.remove("displayButton");
          input.classList.add("noneDisplayButton");
          input.disable = true;
          input.disabled = "disabled";
        } else {
          input.classList.remove("noneDisplayButton");
          input.classList.add("displayButton");
          input.disabled = "";
        }
      }, //checkValidate

      checkValidatePassword(password, passwordNew, passwordConfirm) {
        // "g2j-button-book-now"
        let checkPassword = document.getElementsByClassName(
          "g2j-button-book-now"
        )[1];
        if (password == "" || passwordNew == "" || passwordConfirm == "") {
          checkPassword.classList.remove("displayButton");
          checkPassword.classList.add("noneDisplayButton");
          checkPassword.disable = true;
          checkPassword.disabled = "disabled";
        } else {
          checkPassword.classList.remove("noneDisplayButton");
          checkPassword.classList.add("displayButton");
          checkPassword.disabled = "";
        }
      },
    },
  };
</script>

<style src="./profile-page-style.css"></style>
