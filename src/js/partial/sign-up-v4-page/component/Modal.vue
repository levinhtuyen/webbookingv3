<template>
  <modal
    ref="filter-modal"
    :visible.sync="visible"
    class="filter-modal"
    :isClose="false"
    :disableClickBackground="ui.disableClickBackground"
  >
    <template slot="header">
      <div class="modal-header">
        <div class="image">
            <img :src="IMAGE_URL + '/logo/verifycation-logo.png'" width="100%" height="100%">
        </div>
      </div>
    </template>
    <template slot="body">
      <div class="filter-modal__body">
        <div class="filter-modal__body--sort">
            <h2>{{ $t('vertify_code.verification_code') }}</h2>
            <div class="modal-info-basic">
                <p>{{ $t('vertify_code.verification_code_has_been_sent_to') }}</p>
                <!-- <p class="text-orange">+{{codeCountry}}{{mobileNumber}}</p> -->
                <p class="text-orange">{{mobileNumber}}</p>
            </div>
        </div>
        <div class="modal-input">
            <input class="code-input-main-item" id="valueID1" @focus="getsetSelectionRange1($event)" v-model="value1" tabindex="1" v-on:keyup="checkKeyUp($event)" oninput="this.value = this.value.replace(/[^0-9.]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');" type="text" maxlength="1" />
            <input class="code-input-main-item" id="valueID2" @focus="getsetSelectionRange2($event)" v-model="value2" tabindex="2" v-on:keyup="checkKeyUp($event)" oninput="this.value = this.value.replace(/[^0-9.]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');" type="text" maxlength="1" />
            <input class="code-input-main-item" id="valueID3" @focus="getsetSelectionRange3($event)" v-model="value3" tabindex="3" v-on:keyup="checkKeyUp($event)" oninput="this.value = this.value.replace(/[^0-9.]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');" type="text" maxlength="1" />
            <input class="code-input-main-item" id="valueID4" @focus="getsetSelectionRange4($event)" v-model="value4" tabindex="4" v-on:keyup="checkKeyUp($event)" oninput="this.value = this.value.replace(/[^0-9.]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');" type="text" maxlength="1" />
        </div>
        <div class="modal-time-code">
            <div id="timer">{{ countDownNumber }}</div>
            <div class="resend-code">
                <button :disabled="timerNumber > 0 ? 'disabled' : null" @click="resendCode()">{{ $t('vertify_code.resend_code') }}</button>
            </div>
        </div>
        <div v-if="getErrrors">
            <div v-for="(error, index) in getErrrors" :key="index" class="error-modal">
                <p v-if="error.code === 20">{{ error.message }}</p>
                <p v-else-if="error.code === 19">{{ error.message }}</p>
                <p v-else-if="error.code === 0">{{ error.message }}</p>
            </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <div class="filter-modal__footer btn">
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
            value4: '',
            ui: {
                disableClickBackground: true
            }
        }
    },
    computed: {
        mobileNumber: function () {
            const a = this.mobile.substr(0, 3) 
            const b = this.mobile.substr(3, 3) 
            const c = this.mobile.substr(6) 
            return `${a}-${b}-${c}`
        },
        countDownNumber: function() {
            return this.countDown;
        },
        timerNumber: function() {
            return this.timer
        },
        getErrrors:function() {
            this.value1 = '';
            this.value2 = '';
            this.value3 = '';
            this.value4 = ''; 
            this.$nextTick(function () {
                const input = document.getElementById('valueID1');
                input.focus();
            })        
            return this.errorList
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
            this.$nextTick(function () {
                const input = document.getElementById('valueID1');
                input.focus();
            })
        },
        closeModal () {
            this.visible = false
            this.$emit('resetModal')
        },

        getsetSelectionRange1($event) {
            const input = document.getElementById('valueID1');
            input.focus();
            input.setSelectionRange(0,2);

            this.checkKeyUp($event)
        },

        getsetSelectionRange2($event) {
            const input = document.getElementById('valueID2');
            input.focus();
            input.setSelectionRange(0,2);

            this.checkKeyUp($event)
        },

        getsetSelectionRange3($event) {
            const input = document.getElementById('valueID3');
            input.focus();
            input.setSelectionRange(0,2);

            this.checkKeyUp($event)
        },

        getsetSelectionRange4($event) {
            const input = document.getElementById('valueID4');
            input.focus();
            input.setSelectionRange(0,2);

            this.checkKeyUp($event)
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
            if(this.value1 && this.value2 && this.value3 && this.value4) {
                this.applyFilter();
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