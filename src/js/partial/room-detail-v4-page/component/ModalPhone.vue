<template>
  <modal
    ref="filter-modal"
    :visible.sync="visible"
    class="filter-modal"
  >
    <!-- :disableClickBackground="ui.disableClickBackground" -->
    <template slot="header">
      <div class="modal-header">
        <div class="image">
            <img class="custom-img" :src="IMAGE_URL + '/logo/verifycation-logo.png'" width="20%" height="20%">
        </div>
      </div>
    </template>
    <template slot="body">
      <div class="filter-modal__body">
        <div class="filter-modal__body--sort">
            <h2 v-show="language === 'en'">
                Please
            <router-link :to="{name: 'login-page'}">
                Sign in
            </router-link>
                to receive promotion
            </h2>
            <h2 v-show="language !== 'en'">
            <router-link :to="{name: 'login-page'}">
                Đăng nhập
            </router-link>
                để nhận khuyến mãi
            </h2>
            <div class="modal-info-basic">
                <p>{{ $t('room.title_phone') }}</p>
            </div>
        </div>

        <div class="modal-input">
            <Go2joyFlagSection
            v-if="form.countryCode && visible"
            :code-country="form.countryCode"
            @changeCodeCountry="keyCountryCode"
          />
          <div>
        <input class="code-input-main-item"
                v-focus="visible"
                v-model="$v.form.mobile.$model"
                tabindex="1"
                oninput="this.value = this.value.replace(/[^0-9.]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');"
                type="text"
                maxlength="16"
                :placeholder="$t('room.mobile_number')"
                @keyup.enter="applyFilter"
            />
          </div>

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
      <div class="filter-modal__footer btn">
        <button
            class="modal-btn-apply btn-active"
            @click="applyFilter"
        >
        {{ $t('room.book_as_guest') }}
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
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
} from '~jsBasePath/vuex/modules/page-info-module';

import {
  _,
  mapState,
  required,
  minLength,
  maxLength
} from "~jsLibPath/lib-manager";
Vue.use(vuelidate.default);

export default {
    props: {
        filter: [Object, Array],
        codeCountry: String,
        errorList: [Object, Array],
    },
    components: {
        'modal': () => import('~jsPartialPath/global/component/modal/ModalComponent.vue'),
        Go2joyFlagSection
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
        ...mapState(PAGE_INFO_MODULE_NAME, {
            language: 'language',
        }),
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
