<template>
  <modal
    ref="fill-out-modal"
    :visible.sync="visible"
    class="fill-out-modal"
    :isClose="false"
    :disableClickBackground="ui.disableClickBackground"
  >
    <template slot="header">
      <div class="modal-header">
        <div class="image">
          <img
            class="custom-img"
            :src="IMAGE_URL + '/svg/phone-popup.svg'"
            width="20%"
            height="20%"
          >
        </div>
      </div>
    </template>
    <template slot="body">
      <div class="fill-out-modal__body">
        <div class="fill-out-modal__body--sort">
          <h2 v-if="isTypeInfo === 0">
            <router-link :to="{name: 'login-page'}">
              {{ $t('room.sign_in') }}
            </router-link>
            {{ $t('room.or_fill_out_your_information_to_book_as_guest') }}
          </h2>

          <h2 v-else-if="isTypeInfo === 1">
            {{ $t('room.fill_out_guest_information_to_make_a_reservation') }}
          </h2>

          <div v-else-if="isTypeInfo === 2">
            <h2>
              {{ $t('room.you_have_another_booking_at_the_same_time') }}
            </h2>
            <div class="modal-info-basic">
              <p>{{  $t('room.sub_title_overlap') }}</p>
            </div>
          </div>

        </div>

        <div class="fill-out-modal__body--form">
          <div class="col">
            <input
              class="code-input-main-item m-6px"
              v-model="$v.form.firstName.$model"
              type="text"
              :placeholder="$t('room.first_name')"
            />
            <span
              v-show="!$v.form.firstName.required"
              class="text-danger"
            >(*)</span>
          </div>

          <div class="col">
            <input
              class="code-input-main-item m-6px"
              v-model="$v.form.lastName.$model"
              type="text"
              :placeholder="$t('room.last_name')"
            />
            <span
              v-show="!$v.form.lastName.required"
              class="text-danger"
            >(*)</span>
          </div>
        </div>

        <div class="fill-out-modal__body--form">
          <div class="col">
            <el-select
              class="margin-custom"
              v-model="$v.form.gender.$model"
              :placeholder="$t('room.gender')"
            >
              <el-option
                v-for="item in genderOptions"
                :key="item.value"
                :label="$t(`${item.label}`)"
                :value="item.value"
              >
              </el-option>
            </el-select>

            <span
              v-show="!$v.form.gender.required"
              class="text-danger"
            >(*)</span>
          </div>

          <div class="col">
            <input
              class="code-input-main-item m-6px"
              v-model="$v.form.age.$model"
              type="number"
              :placeholder="$t('room.age')"
            />
            <span
              v-show="!$v.form.age.required"
              class="text-danger"
            >(*)</span>
          </div>
        </div>

        <div class="fill-out-modal__body--form">
          <div class="col w-100">
            <input
              class="code-input-main-item m-6px"
              v-model="$v.form.email.$model"
              type="text"
              :placeholder="$t('room.email')"
            />
            <span
              v-show="!$v.form.email.required"
              class="text-danger"
            >(*)</span>
          </div>
        </div>

        <div class="fill-out-modal__body--form">
          <div class="col w-100">
            <Go2joyFlagSection
              v-if="form.countryCode && visible"
              :code-country="form.countryCode"
              @changeCodeCountry="keyCountryCode"
            />
            <input
              class="code-input-main-item m-6px p-revert"
              v-model="$v.form.mobile.$model"
              tabindex="1"
              oninput="this.value = this.value.replace(/[^0-9.]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');"
              type="text"
              maxlength="16"
              :placeholder="$t('room.mobile_number')"
            />
            <span
              v-show="!$v.form.mobile.required"
              class="text-danger"
            >(*)</span>
          </div>
        </div>

        <p class="error m-1em-0 note-text">* {{ $t('room.please_ensure_that_your_information_is_correct_to_get_booking_confirmation') }}</p>

        <div class="error-list-fill-out">

          <p
            v-show="!$v.form.firstName.required && ui.submited"
            class="error"
          >{{ $t('room.first_name_is_required') }}</p>
          <p
            v-show="!$v.form.lastName.required && ui.submited"
            class="error"
          >{{ $t('room.last_name_is_required') }}</p>
          <p
            v-show="!$v.form.age.required && ui.submited"
            class="error"
          >{{ $t('room.age_is_required') }}</p>

          <p
            v-show="!$v.form.email.email && ui.submited"
            class="error"
          >{{ $t('room.this_email_is_incorrect_format_please_try_again') }}</p>
          <p
            v-show="!$v.form.email.required && ui.submited"
            class="error"
          >{{ $t('room.email_is_required') }}</p>

          <p
            v-show="!$v.form.mobile.required && ui.submited"
            class="error"
          >{{ $t('room.mobile_number_is_required') }}</p>
          <p
            v-show="!$v.form.mobile.minLength && ui.submited"
            class="error"
          >{{ $t('room.mobile_must_have_9_to_16_digits') }}</p>
          <p
            v-show="!$v.form.mobile.maxLength && ui.submited"
            class="error"
          >{{ $t('room.mobile_must_have_9_to_16_digits') }}</p>
        </div>

        <div v-if="getErrrors">
          <div
            v-for="(error, index) in getErrrors"
            :key="index"
            class="error-modal"
          >
            <p>{{ error.message }}</p>
          </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <div class="fill-out-modal__footer btn">
        <button
          class="modal-btn-apply btn-active"
          @click="applyFilter"
        >
          {{ $t('room.confirm') }}
        </button>

        <button
          class="modal-btn-apply"
          @click="closeModal"
        >
          {{ $t('vertify_code.cancel') }}
        </button>
      </div>
    </template>
  </modal>
</template>

<script>
  import { IMAGE_URL } from "~jsDefinePath/general";
  import Go2joyFlagSection from "~jsPartialPath/global/component/go2joy-flags/Go2joyFlagsSection.vue";
  import {
    _,
    email,
    required,
    minLength,
    maxLength,
  } from "~jsLibPath/lib-manager";
  Vue.use(vuelidate.default);

  export default {
    props: {
      filter: [Object, Array],
      codeCountry: String,
      errorList: [Object, Array],
      isTypeInfo: Number, // 0: isNotSignedIn, 1: isSignedIn, 2: isOverLap
    },
    components: {
      modal: () =>
        import("~jsPartialPath/global/component/modal/ModalComponent.vue"),
      Go2joyFlagSection,
    },
    data() {
      return {
        visible: false,
        IMAGE_URL,
        ui: {
          disableClickBackground: true,
          submited: false,
        },
        form: {
          countryCode: "84",
          mobile: "",
          firstName: "",
          lastName: "",
          gender: null, // 1: name, 2: nữ
          email: "",
          age: "",
        },
        genderOptions: [
          {
            value: 1,
            label: "room.male",
          },
          {
            value: 2,
            label: "room.female",
          },
        ],
      };
    },

    validations: {
      form: {
        mobile: {
          required,
          minLength: minLength(9),
          maxLength: maxLength(16),
        },
        firstName: {
          required,
        },
        lastName: {
          required,
        },
        email: {
          required,
          email,
        },
        gender: {
          required,
        },
        age: {
          required,
        },
      },
    },

    computed: {
      getErrrors: function () {
        return this.errorList;
      },
    },

    created() {
      const profileInfo = localStorage.getItem("userInfo")
        ? JSON.parse(
            decodeURIComponent(
              escape(window.atob(localStorage.getItem("userInfo")))
            )
          )
        : "";
      // const payMentInfo = sessionStorage.getItem("paymentInfo") ? JSON.parse(sessionStorage.getItem("paymentInfo")) : '';
      const payMentInfo = localStorage.getItem("paymentInfo")
        ? JSON.parse(localStorage.getItem("paymentInfo"))
        : "";

      if (payMentInfo && payMentInfo.guestInformation) {
        this.form.countryCode = payMentInfo.guestInformation.countryCode;
        this.form.mobile = payMentInfo.guestInformation.mobile;
        this.form.firstName = payMentInfo.guestInformation.firstName;
        this.form.lastName = payMentInfo.guestInformation.lastName;
        this.form.gender = payMentInfo.guestInformation.gender
          ? payMentInfo.guestInformation.gender
          : ""; // 1= name, 2= nữ
        this.form.email = payMentInfo.guestInformation.email;
        this.form.age = payMentInfo.guestInformation.age;
      } else if (profileInfo) {
        this.form.countryCode = profileInfo.countryCode;
        this.form.mobile = profileInfo.mobile;
        this.form.gender = profileInfo.gender ? profileInfo.gender : ""; // 1= name, 2= nữ
        this.form.email = profileInfo.email;
        (this.form.age = profileInfo.birthday
          ? dayjs().year() - dayjs(profileInfo.birthday).year()
          : ""),
          (this.form.firstName = "");
        this.form.lastName = "";
      } else {
      }
    },

    methods: {
      isEmpty: _.isEmpty,
      applyFilter() {
        let self = this;
        this.ui.submited = true;

        self.$v.$touch();
        if (!self.$v.$invalid) {
          let value = "";
          this.$emit("update:filter", value);
          this.$emit("apply", this.form);
        }
      },
      showModal() {
        this.visible = true;
      },
      closeModal() {
        this.visible = false;
        this.$emit("resetModal");
      },

      keyCountryCode(value) {
        this.form.countryCode = value;
      },
    },
    watch: {
      visible(val) {
        this.$emit("update:visible", val);
      },
      "form.age": function (val) {
        if (val > 120) {
          this.form.age = 120;
        } else if (val < 0) {
          this.form.age = 1;
        }
      },
    },
  };
</script>
