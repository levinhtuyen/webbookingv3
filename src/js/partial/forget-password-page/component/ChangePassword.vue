<template>
  <modal
    ref="filter-modal"
    :visible.sync="visible"
    class="filter-modal"
  >
    <template slot="header">
      <div class="modal-header">
        <h1>{{ $t('forget_password.change_password') }}</h1>
      </div>
    </template>
    <template slot="body">
      <div class="filter-modal__body change-password-modal-body">
        <div class="input-container">
          <input
            v-model="$v.password.$model"
            class="input-field"
            :class="{ 'input-error': $v.password.$error && submited }"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="$t('sign_up.password')"
          >
          <i
            v-if="showPassword"
            class="fas fa-eye icon icon-eye"
            @click="showPassword =!showPassword"
          />
          <i
            v-else
            class="fa fa-eye-slash icon icon-eye"
            @click="showPassword =!showPassword"
          />
        </div>
        <div
          v-if="!$v.password.required && submited"
          class="error"
        >
          {{ $t('sign_up.password_is_required') }}
        </div>

        <div class="input-container">
          <input
            v-model="$v.confirmPassword.$model"
            class="input-field"
            :class="{ 'input-error': $v.confirmPassword.$error && submited }"
            :type="showPasswordConfirm ? 'text' : 'password'"
            :placeholder="$t('sign_up.confirm_password')"
          >
          <i
            v-if="showPasswordConfirm"
            class="fas fa-eye icon icon-eye"
            @click="showPasswordConfirm =!showPasswordConfirm"
          />
          <i
            v-else
            class="fa fa-eye-slash icon icon-eye"
            @click="showPasswordConfirm =!showPasswordConfirm"
          />
        </div>
        <div
          v-if="!$v.confirmPassword.required && submited"
          class="error"
        >
          {{ $t('sign_up.confirm_password_is_required') }}
        </div>
        <div
          v-if="!$v.confirmPassword.sameAsPassword && submited"
          class="error"
        >
          {{ $t('sign_up.password_does_not_match_please_try_again') }}
        </div>

        <div
          v-if="errorModal"
          class="error"
        >
          <div
            v-for="(error, index) in errorModal"
            :key="index"
          >
            <p v-if="error.code == 10">
              {{ $t('sign_up.confirm_password_is_required') }}
            </p>
          </div>
        </div>
        <!-- end Category -->
      </div>
    </template>
    <template slot="footer">
      <div class="filter-modal__footer btn">
        <button
          :disabled="disableBtn()"
          class="modal-btn-apply g2j-button-book-now "
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
  Vue,
  required,
} from "~jsLibPath/lib-manager";
const sameAs = validators?.sameAs ?? null;
Vue.use(vuelidate.default);

export default {
    components: {
        'modal': () => import('~jsPartialPath/global/component/modal/ModalComponent.vue')
    },
    props: {
        filter: [Object, Array],
        errorModal: {
            type: Array,
            default: [],
        },
    },
    data () {
        return {
            visible             : false,
            IMAGE_URL,
            password            : '',
            confirmPassword     : '',
            showPassword        : false,
            showPasswordConfirm : false,
            submited            : false,
        }
    },

    validations: {
        password: {
            required
        },
        confirmPassword: {
            required,
            sameAsPassword: sameAs('password')
        }
    },
    watch: {
        visible (val) {
            this.$emit('update:visible', val)
        }
    },

    methods: {
        isEmpty: _.isEmpty,
        disableBtn() {
            return _.isEmpty(this.password) || _.isEmpty(this.confirmPassword);
        },
        applyFilter () {
            const self = this;
            this.submited = true;
            this.$v.$touch();
            if (this.$v.$invalid) {
            } else {
                setTimeout(() => {
                self.$emit('update:filter', self.password);
                self.$emit('apply', self.password);
                }, 500);
            }
        },
        showModal () {
            this.visible = true
        },
        closeModal () {
            this.visible = false
        }
    }
}
</script>
