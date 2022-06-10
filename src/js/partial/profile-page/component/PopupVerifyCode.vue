<template>
  <modal
    ref="popup-modal-verify-code"
    :visible.sync="visible"
    class="popup-modal-verify-code"
  >
    <template slot="header">
      <div class="popup-modal-verify-code__header">
        <h1>{{ $t('profile.vertify_code.verification_code')}}</h1>
      </div>
    </template>
    <template slot="body">
      <div class="popup-modal-verify-code__body">
        <div class="popup-modal-verify-code__body--sort">
            <div class="image">
                <img :src="IMAGE_URL + '/logo/verifycation-logo.png'" width="100%" height="100%">
            </div>
            <div class="modal-info-basic">
                <p>{{ $t('profile.vertify_code.verification_code_has_been_sent_to')}}</p>
                <p class="text-orange">+{{ countryCodeMobile }}{{ phoneMobile }}</p>
            </div>
        </div>
        <!-- Category -->
        <div class="popup-modal-verify-code__body--modal-input">
            <input autocomplete="off" class="code-input-main-item" v-model="verifyCode1" tabindex="1"  type="number" v-on:keyup="checkKeyUp($event)" maxlength="1" max="9" min="0"  />
            <input autocomplete="off" class="code-input-main-item" v-model="verifyCode2"  tabindex="2" type="number" v-on:keyup="checkKeyUp($event)" maxlength="1" max="9" min="0" />
            <input autocomplete="off" class="code-input-main-item" v-model="verifyCode3"  tabindex="3" type="number" v-on:keyup="checkKeyUp($event)" maxlength="1" max="9" min="0" />
            <input autocomplete="off" class="code-input-main-item" v-model="verifyCode4"  tabindex="4" type="number" v-on:keyup="checkKeyUp($event)" maxlength="1" max="9" min="0" />
        </div>
        <!-- end Category -->
        <div class="popup-modal-verify-code__time-code">
            <div class="timer">
              <span class="timeCountdown">{{ countDownNumber }}</span>
            </div>
            <div v-if="checkActiveSendCode == true"
            class="resend-code">
              <a  @click="resendCode">
              {{ $t('profile.vertify_code.resend_code')}}
              </a>
            </div>
            <div v-else
            class="resend-code">
              <a class="disable-resend-code">
              {{ $t('profile.vertify_code.resend_code')}}
              </a>
            </div>

        </div>
      </div>
      <div class="popup-error" v-if="errorWaitingVerify && errorWaitingVerify.message">
        {{ errorWaitingVerify.message }}
      </div>
    </template>
    <template slot="footer">
      <div class="popup-modal-verify-code__footer">
        <div class="popup-modal-verify-code__footer--button" >
          <input type="button" id="checkDisable" name="checkDisableButton"
            class="modal-btn-apply"
            @click="applyVerifyCode()" :value="$t('profile.vertify_code.verify')"
          >
        </div>
      </div>
    </template>
  </modal>
</template>

<script>
import {
IMAGE_URL
} from '~jsDefinePath/general';
export default {
  props: {
    phoneNumber:[Number,String],
    countryCode: [Number,String],
    countDown: [Number,String],
    activeSendCode:[Boolean,String],
    errorWaitingVerifycode: [Object,Array]
  },
  components: {
    'modal': () => import('~jsPartialPath/global/component/modal/ModalComponent.vue')
  },
  data () {
    return {
      checked: '',
      visible: false,
      IMAGE_URL,
      verifyCode1: '',
      verifyCode2: '',
      verifyCode3: '',
      verifyCode4: '',
      verifyCode: '1234',
      buttonDisplay: false,
      valueTime : '',
      now: new Date(),
      activeResendCode: false,
    }

  },
  created () {
  },
  methods: {
    showModalVerifyCode () {
      this.visible = true

    }, //showModalVerifyCode

    closeModalVerifyCode () {
      this.visible = false
    }, //actionButtonVerifyCode

    resendCode(){
      this.$emit('sendVerifyCode')
    }, //resendCode

    applyVerifyCode(){
      this.verifyCode = String(this.verifyCode1) + String(this.verifyCode2) + String(this.verifyCode3) + String(this.verifyCode4)
      this.$emit('getVerifyCodeInput',this.verifyCode)
      this.closeModalVerifyCode()
    }, //applyVerifyCode

    checkKeyUp($event){
      if($event.target){
        if (($event.which >= 48 && $event.which <= 57) || ($event.which >= 96 && $event.which <= 105)) {
          if( $event.target.tabIndex < 4){
            setTimeout($event.target.nextElementSibling.focus(), 200);
          }
        }else if($event.which == 8){
          if($event.target.tabIndex > 1){
            $event.target.previousElementSibling.focus()
          }
        }
      }

    }, //checkKeyUp

    checkDisableButton(){
      let input = document.getElementsByClassName("code-input-main-item")
      let element = document.getElementsByClassName("modal-btn-apply")[0]
      if((input.length > 0 && !!element.classList)){
        if(input[3].value == '' || input[2].value == '' || input[1].value == '' || input[0].value == ''){
        element.classList.remove("displayButton")
        element.classList.add("noneDisplayButton")
        element.disable = true;
        element.disabled = "disabled";
        }else{
          element.classList.remove("noneDisplayButton")
          element.classList.add("displayButton")
          element.disabled = "";
        }
      }

    }, //checkDisableButton

  },
  computed: {
      valueTimeNow() {
          return this.valueTime
      },
      phoneMobile(){
        return this.phoneNumber
      },
      countryCodeMobile(){
        return this.countryCode
      },
      countDownNumber(){
        this.checkDisableButton()
        return this.countDown
      },
      checkActiveSendCode(){
        return this.activeSendCode
      },
      errorWaitingVerify(){
        return this.errorWaitingVerifycode
      }
  },

}
</script>
