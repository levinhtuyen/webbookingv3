<template>
  <modal
    ref="filter-modal"
    :visible.sync="visible"
    class="filter-modal"
  >
    <template slot="header">
      <div class="modal-header">
        <h1>{{ $t('vertify_code.verification_code') }}</h1>
      </div>
    </template>
    <template slot="body">
      <div class="filter-modal__body">
        <div class="filter-modal__body--sort">
            <div class="image">
                <img :src="IMAGE_URL + '/logo/verifycation-logo.png'" width="100%" height="100%">
            </div>
            <div class="modal-info-basic">
                <p>{{ $t('vertify_code.verification_code_has_been_sent_to') }}</p>
                <p class="text-orange">+{{codeCountry}}{{mobileNumber}}</p>
            </div>
        </div>
        <div class="modal-input">
            <input class="code-input-main-item" v-model="value1" tabindex="1" v-on:keyup="checkKeyUp($event)" oninput="this.value = this.value.replace(/[^0-9.]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');" type="text" maxlength="1" />
            <input class="code-input-main-item" v-model="value2" tabindex="2" v-on:keyup="checkKeyUp($event)" oninput="this.value = this.value.replace(/[^0-9.]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');" type="text" maxlength="1" />
            <input class="code-input-main-item" v-model="value3" tabindex="3" v-on:keyup="checkKeyUp($event)" oninput="this.value = this.value.replace(/[^0-9.]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');" type="text" maxlength="1" />
            <input class="code-input-main-item" v-model="value4" tabindex="4" v-on:keyup="checkKeyUp($event)" oninput="this.value = this.value.replace(/[^0-9.]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');" type="text" maxlength="1" />
        </div>
        <div class="modal-time-code">
            <div id="timer">{{ countDownNumber }}</div>
            <div class="resend-code">
                <button :disabled="timerNumber > 0 ? 'disabled' : null" @click="resendCode()">{{ $t('vertify_code.resend_code') }}</button>
            </div>
        </div>
        <div v-if="errorList">
            <div v-for="(error, index) in errorList" :key="index" class="error-modal">
                <p v-if="error.code == 20">{{ $t('vertify_code.this_verification_code_is_not_valid_please_try_again') }}</p>
                <p v-if="error.code == 19">{{ $t('vertify_code.the_valid_time_has_expired_please_try_again') }}</p>
                <p v-if="error.code == 0">{{ $t('vertify_code.social_token_is_expired') }}</p>
            </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <div class="filter-modal__footer btn">
        <button
            :disabled="disableBtn()"
            class="modal-btn-apply"
            @click="applyFilter()"
        >
        {{ $t('vertify_code.verify') }}
        </button>
      </div>
    </template>
  </modal>
</template>

<script>
import {
IMAGE_URL
} from '~jsDefinePath/general';
import {
  _,
} from "~jsLibPath/lib-manager";

export default {
    props: {
        filter: [Object, Array],
        mobile: String,
        codeCountry: String,
        errorList: [Object, Array],
        countDown: [Number,String],
        timer: [Number, String]
    },
    components: {
        'modal': () => import('~jsPartialPath/global/component/modal/ModalComponent.vue')
    },
    data () {
        return {
            visible: false,
            IMAGE_URL,
            value1: '',
            value2: '',
            value3: '',
            value4: ''
        }
    },
    computed: {
        mobileNumber: function () {
            return this.mobile.replace(/^0+/, '');
        },
        countDownNumber: function() {
            return this.countDown;
        },
        timerNumber: function() {
            return this.timer
        }
    },
    methods: {
        isEmpty: _.isEmpty,
        disableBtn() {
            return _.isEmpty(this.value1) || _.isEmpty(this.value2) || _.isEmpty(this.value3) || _.isEmpty(this.value4);
        },
        resendCode() {
          this.$emit('resendCode');
        },
        applyFilter () {
            let value = String(this.value1) + String(this.value2) + String(this.value3) + String(this.value4);
            this.$emit('update:filter', value);
            this.$emit('apply', value);
        },
        showModal () {
            this.visible = true
        },
        closeModal () {
            this.visible = false
        },
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
    },
    watch: {
        visible (val) {
            if(val == false) {
                this.$emit('saveInfoMobileOld', this.timerNumber);
            }
            this.$emit('update:visible', val)
        }
    }
}
</script>