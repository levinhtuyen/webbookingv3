<template>
  <modal
    ref="overlap-modal"
    :visible.sync="visible"
    class="overlap-modal"
    :disableClickBackground="ui.disableClickBackground"
  >
    <template slot="header">
      <div class="modal-header">
        <div class="image">
            <img class="custom-img" :src="IMAGE_URL + '/svg/phone-popup.svg'" width="20%" height="20%">
        </div>
      </div>
    </template>
    <template slot="body">
      <div class="overlap-modal__body">
        <div class="overlap-modal__body--sort">
            <h2>{{  $t('room.title_popup_overlap') }}</h2>
            <div class="modal-info-basic">
                <p>{{ $t('room.sub_title_popup_overlap') }}</p>
            </div>
        </div>

        <div class="modal-input">
            <Go2joyFlagSection
            v-if="form.countryCode && visible"
            :code-country="form.countryCode"
            @changeCodeCountry="keyCountryCode"
          />
            <input class="code-input-main-item"
                v-model="$v.form.mobile.$model"
                tabindex="1"
                oninput="this.value = this.value.replace(/[^0-9.]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');"
                type="text"
                maxlength="16"
                :placeholder="$t('room.mobile_number')"
            />
        </div>

        <p v-if="!$v.form.mobile.required && ui.submited" class="error w-100">{{ $t('room.mobile_number_is_required') }}</p>
        <p v-if="!$v.form.mobile.minLength && ui.submited" class="error w-100">{{ $t('room.mobile_must_have_9_to_16_digits') }}</p>
        <p v-if="!$v.form.mobile.maxLength && ui.submited" class="error w-100">{{ $t('room.mobile_must_have_9_to_16_digits') }}</p>

        <div v-if="getErrrors">
            <div v-for="(error, index) in getErrrors" :key="index" class="error-modal">
                <p>{{ error.message }}</p>
            </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <div class="overlap-modal__footer btn">
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
import {
IMAGE_URL
} from '~jsDefinePath/general';
import Go2joyFlagSection from "~jsPartialPath/global/component/go2joy-flags/Go2joyFlagsSection.vue";
import {
  _,
  required,
  minLength,
  maxLength
} from "~jsLibPath/lib-manager";
Vue.use(vuelidate.default);

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
        'modal': () => import('~jsPartialPath/global/component/modal/ModalComponent.vue'),
        Go2joyFlagSection,
    },
    data () {
        return {
            visible: false,
            IMAGE_URL,
            ui: {
                disableClickBackground: true,
                submited: false
            },
            form: {
                countryCode: '84',
                mobile: ''
            }
        }
    },

    validations: {
        form: {
            mobile: {
                required,
                minLength: minLength(9),
                maxLength: maxLength(16)
            }
        }
    },

    computed: {
        countDownNumber: function() {
            return this.countDown;
        },
        timerNumber: function() {
            return this.timer
        },
        getErrrors:function() {
            return this.errorList
        }
    },

    methods: {
        isEmpty: _.isEmpty,
        applyFilter () {
            let self = this;
            this.ui.submited = true;

            self.$v.$touch();
            if (!self.$v.$invalid) {
                let value = '';
                this.$emit('update:filter', value);
                this.$emit('apply', this.form);
            }
        },
        showModal () {
            this.visible = true
        },
        closeModal () {
            this.visible = false
            this.$emit('resetModal')
        },
        keyCountryCode(value){
            this.form.countryCode = value;
        }
    },
    watch: {
        visible (val) {
            this.$emit('update:visible', val)
        }
    }
}
</script>
