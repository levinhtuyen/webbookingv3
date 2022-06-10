<template>
  <modal
    ref="popup-modal-verify-code"
    :visible.sync="visible"
    class="popup-modal-verify-code"
    :disable-click-background="true"
  >
    <template slot="header">
      <!-- <div class="popup-modal-verify-code__header">
        <h1>{{ $t("modal-verify-code.verification_code") }}</h1>
      </div> -->
      <div class="popup-modal-verify-code__header">
        <img
          :src="IMAGE_URL + '/logo/verifycation-logo.png'"
          width="100%"
          height="100%"
        >
      </div>
    </template>
    <template slot="body">
      <div class="popup-modal-verify-code__body">
        <div class="popup-modal-verify-code__body--sort">
          <div class="modal-info-basic">
            <h2 class="modal-info-basic__title">{{ $t('vertify_code.verification_code') }}</h2>
            <p>
              {{
                $t("modal-verify-code.verification_code_has_been_sent_to")
              }}
            </p>
            <p class="text-orange">
              <!-- +{{ countryCodeMobile }}{{ phoneMobile }} -->
              {{mobileNumber}}
            </p>
          </div>
        </div>
        <!-- Category -->
        <div class="popup-modal-verify-code__body--modal-input">
          <input
            v-for="(v,k) in arrCode"
            v-focus="k==0&&isFocus "
            :id="'input-code-'+k"
            :key="k"
            :ref="'input-code-'+k"
            v-model="v.value"
            autocomplete="off"
            class="code-input-main-item"
            maxlength="1"
            oninput="this.value = this.value.replace(/[^0-9.]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');"
            type="text"
            :disabled="disabledInput"
            @keyup.exact="checkKeyUp($event,v.value)"
          >

        </div>
        <!-- end Category -->
        <div class="popup-modal-verify-code__time-code">
          <div class="timer">
            <span class="timeCountdown">{{ countDownNumber }}</span>
          </div>
          <div
            v-if="checkActiveSendCode == true"
            class="resend-code"
          >
            <a @click="resendCode">
              {{ $t("modal-verify-code.resend_code") }}
            </a>
          </div>
          <div
            v-else
            class="resend-code"
          >
            <a class="disable-resend-code">
              {{ $t("modal-verify-code.resend_code") }}
            </a>
          </div>
        </div>
      </div>
      <div
        v-if="errorWaitingVerify"
        class="popup-error"
      >
        <p
          v-for="(v,k) in errorWaitingVerify"
          :key="k"
        >
          {{ v.message }}
        </p>
      </div>
      <div
        v-if="errorGetVerify"
        class="popup-error"
      >
        <p
          v-for="(v,k) in errorGetVerify"
          :key="k"
        >{{ v.message }}</p>
      </div>
    </template>
    <template slot="footer">
      <div class="popup-modal-verify-code__footer">
        <div class="popup-modal-verify-code__footer--button">
          <button
            id="checkDisable"
            type="button"
            name="checkDisableButton"
            class="modal-btn-apply g2j-button-book-now"
            @click="closeModal()"
          >
            <!-- :class="disabledBtn ?'noneDisplayButton':''" -->
            <!-- :disabled="disabledBtn " -->
            <!-- || errorGetVerify.message -->
            {{ $t('vertify_code.cancel') }}
          </button>

          <!-- <button
            class="modal-btn-apply"
            @click="closeModal"
        >
        {{ $t('vertify_code.cancel') }}
        </button> -->
        </div>
      </div>
    </template>
  </modal>
</template>

<script>
  import { IMAGE_URL } from "~jsDefinePath/general";
  // lưu ý sau khi hoàn tất quá  trình nhớ xoá arrMobileVerify, vd ơ duoi
  // setTimeout(()=>{
  //       localStorage.removeItem('arrMobileVerify')
  //     },3000)
  export default {
    components: {
      modal: () =>
        import("~jsPartialPath/global/component/modal/ModalComponent.vue"),
    },
    props: {
      phoneNumber: [Number, String],
      countryCode: [Number, String],
      countDown: [Number, String],
      // activeSendCode: [Boolean, String],
      errorWaitingVerifycode: [Object, Array],
      errorGetVerifyCode: [Object, Array],
    },
    data() {
      return {
        checked: "",
        visible: false,
        IMAGE_URL,
        verifyCode1: "",
        verifyCode2: "",
        verifyCode3: "",
        verifyCode4: "",
        verifyCode: "1234",
        arrCode: [
          { id: 0, value: "" },
          { id: 1, value: "" },
          { id: 2, value: "" },
          { id: 3, value: "" },
        ],
        buttonDisplay: false,
        valueTime: "",
        now: new Date(),
        activeResendCode: false,
        disabledInput: false,
        isFocus: false,
        timer: 180,
        activeSendCode: false,
        setCountDown: null,
        disabledBtn: true,
      };
    },
    computed: {
      mobileNumber() {
        const a = this.phoneNumber.toString().substr(0, 3);
        const b = this.phoneNumber.toString().substr(3, 3);
        const c = this.phoneNumber.toString().substr(6); //cut ngc lai moi dung
        return `${a}-${b}-${c}`;
      },
      valueTimeNow() {
        return this.valueTime;
      },
      phoneMobile() {
        return this.phoneNumber;
      },
      countryCodeMobile() {
        return this.countryCode;
      },
      countDownNumber() {
        this.checkDisableButton();
        // return this.countDown;
        return this.minutesAndSeconds(this.timer);
      },
      checkActiveSendCode() {
        return this.activeSendCode;
      },
      errorWaitingVerify() {
        return this.errorWaitingVerifycode;
      },
      errorGetVerify() {
        return this.errorGetVerifyCode;
      },
    },
    watch: {
      visible() {
        if (!this.visible) {
          let arrPhone =
            JSON.parse(localStorage.getItem("arrMobileVerify")) || [];
          let findPhone = arrPhone.find((el) => el.phone == this.phoneMobile);
          if (!findPhone) {
            arrPhone.push({
              phone: this.phoneMobile,
              timer: this.timer,
              timeStop: new Date(),
            });
          } else {
            findPhone.timer = this.timer;
            findPhone.timeStop = new Date();
          }

          localStorage.setItem("arrMobileVerify", JSON.stringify(arrPhone));
        }
      },
    },
    created() {},
    methods: {
      isEmpty: _.isEmpty,
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
      },
      initData() {
        // this.$emit("getVerifyCode");

        this.arrCode = [
          { id: 0, value: "" },
          { id: 1, value: "" },
          { id: 2, value: "" },
          { id: 3, value: "" },
        ];
        this.checkPhoneValid(); //check so dien thoai cu

        clearInterval(this.setCountDown);
        this.setCountDown = null;
        this.setUpTimer();
      },
      checkPhoneValid() {
        let arrPhone = JSON.parse(localStorage.getItem("arrMobileVerify"));
        if (!arrPhone) return;
        let findPhone = Object.values(arrPhone).find(
          (el) => el.phone == this.phoneNumber
        );

        if (!findPhone) {
          this.timer = 180;
          return;
        }
        if (this.isEmpty(this.errorWaitingVerify)) {
          this.timer = 180;
          return;
        }
        let dateNow = dayjs();
        let check = dateNow.diff(findPhone.timeStop, "s");
        if (check < 180) {
          this.timer = findPhone.timer - check;
        } else {
          this.timer = 180;
        }
        if (this.timer < 0) {
          this.timer = 180;
        }
      },
      setUpTimer() {
        // this.timer = 180;
        this.setCountDown = setInterval(() => {
          this.timer -= 1;
        }, 1000);
      },
      openModal() {
        this.visible = true;
        this.$nextTick(function () {
          // const input = document.getElementById('valueID1');
          // input.focus();
          this.isFocus = true;
          this.initData();
        });
      }, //openModal
      closeModal() {
        this.visible = false;
      }, //actionButtonVerifyCode

      resendCode() {
        this.timer = 180;
        this.$emit("resentVerifyCode");
        // this.$emit("getVerifyCode");
      }, //resendCode

      applyVerifyCode() {
        this.verifyCode = this.arrCode.map((el) => el.value).join("");
        this.$emit("applyVerifyCode", this.verifyCode);
      }, //applyVerifyCode

      checkKeyUp($event, value) {
        if (
          (($event.keyCode >= 48 && $event.keyCode <= 57) ||
            ($event.keyCode >= 96 && $event.keyCode <= 105)) &&
          $event.target.nextElementSibling &&
          value
        ) {
          this.isFocus = false;
          $event.target.nextElementSibling.focus();
        } else if ($event.keyCode == 8 && $event.target.previousElementSibling) {
          $event.target.previousElementSibling.focus();
        }
        let checkComplete = this.arrCode.every((el) => el.value);
        if (checkComplete) {
          this.applyVerifyCode();
          // this.closeModal();
        }
      }, //checkKeyUp

      checkDisableButton() {
        let input = document.getElementsByClassName("code-input-main-item");
        let element = document.getElementsByClassName("modal-btn-apply")[0];
        if (input.length > 0 && !!element.classList) {
          if (
            input[3].value == "" ||
            input[2].value == "" ||
            input[1].value == "" ||
            input[0].value == ""
          ) {
            //from a Tuyen with love
            // element.classList.remove("displayButton");
            // element.classList.add("noneDisplayButton");
            // element.disabled = "disabled";
            // element.disable = true;
            this.disabledBtn = true;
          } else {
            // element.classList.remove("noneDisplayButton");
            // element.classList.add("displayButton");
            // element.disabled = "";
            this.disabledBtn = false;
          }
        }
      }, //checkDisableButton
    },
  };
</script>
