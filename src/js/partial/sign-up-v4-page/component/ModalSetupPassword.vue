<template>
  <modal
    ref="modal-password"
    :visible.sync="visible"
    :disableClickBackground="ui.disableClickBackground"
    class="modal-password"
  >
    <template slot="header">
      <div class="modal-password-header">
          <p v-show="language === 'en'">
            Set up your
            <span class="bold">Password</span>
          </p>
          <p v-show="language === 'vi'">
            Thiết lập 
            <span class="bold">mật khẩu</span>
            của bạn
          </p>
      </div>
    </template>
    <template slot="body">
      <div class="modal-password__body">
        <div class="w-100 mt-1em">
          <div class="sign-up__tabs--flex">
            <i class="fas fa-lock filter-grayscale" />
            <input
              v-model.trim="$v.password.$model"
              class="input-field"
              :class="{ 'input-error': $v.password.$error && ui.submited }"
              :type="ui.showPassword ? 'text' : 'password'"
              :placeholder="$t('sign_up.password')"
              @keyup.enter="applyFilter"
            >
            <i
              v-show="ui.showPassword"
              class="fas fa-eye icon-eye"
              @click="ui.showPassword =!ui.showPassword"
            />
            <i
              v-show="!ui.showPassword"
              class="fa fa-eye-slash icon icon-eye"
              @click="ui.showPassword =!ui.showPassword"
            />
          </div>

          <p v-show="!$v.password.required && ui.submited" class="error">
            {{ $t('sign_up.password_is_required') }}
          </p>
          
          <p v-show="!ui.validationPassword && ui.submited" class="error">
            {{ $t('sign_up.password_must_be_6_16_characters_of_english_numbers') }}
          </p>

          <div class="sign-up__tabs--flex">
            <i class="fas fa-lock filter-grayscale" />
            <input
              v-model.trim="$v.confirmPassword.$model"
              class="input-field"
              :class="{ 'input-error': $v.confirmPassword.$error && ui.submited }"
              :type="ui.showConfirmPassword ? 'text' : 'password'"
              :placeholder="$t('sign_up.confirm_password')"
              @keyup.enter="applyFilter"
            >
            <i
              v-show="ui.showConfirmPassword"
              class="fas fa-eye icon-eye"
              @click="ui.showConfirmPassword =!ui.showConfirmPassword"
            />
            <i
              v-show="!ui.showConfirmPassword"
              class="fa fa-eye-slash icon icon-eye"
              @click="ui.showConfirmPassword =!ui.showConfirmPassword"
            />
          </div>

          <p v-show="!$v.confirmPassword.sameAsPassword && ui.submited" class="error">
            {{ $t('sign_up.password_does_not_match_please_try_again') }}
          </p>
          <p v-show="!$v.confirmPassword.required && ui.submited" class="error">
            {{ $t('sign_up.confirm_password_is_required') }}
          </p>

          <div v-for="(err, index) in errorList" :key="index" class="error">
            <p v-if="err.code === 12">{{ err.message }}</p>
          </div>

        </div>
      </div>
    </template>
    <template slot="footer">
      <div class="modal-password__footer btn">
        <button
          :disabled="disableBtn"
          class="modal-btn-apply"
          @click="applyFilter()"
        >
        {{ $t('vertify_code.continue') }}
        </button>
      </div>
    </template>
  </modal>
</template>

<script>
import {
  _,
  mapState,
  Vue,
  required,
} from "~jsLibPath/lib-manager";
import {
    MODULE_NAME as PAGE_INFO_MODULE_NAME,
  } from '~jsBasePath/vuex/modules/page-info-module';

Vue.use(vuelidate.default);
const sameAs = validators?.sameAs ?? null;

export default {
    props: {
        filter: [Object, Array],
        errorList: [Object, Array],
    },
    components: {
        'modal': () => import('~jsPartialPath/global/component/modal/ModalComponent.vue')
    },
    data () {
        return {
            visible: false,
            password: '',
            confirmPassword: '',
            nickName: '',
            ui: {
              showPassword: false,
              showConfirmPassword: false,
              submited: false,
              validationPassword: false,
              disableClickBackground: true
            },
        }
    },

    validations() {
      return {
        password: {
          required
        },
        confirmPassword: {
          required,
          sameAsPassword: sameAs('password')
        }
      };
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: 'language',
      }),
      disableBtn() {
        return _.isEmpty(this.password) || _.isEmpty(this.confirmPassword);
      },
    },
    methods: {
        isEmpty: _.isEmpty,
        resendCode() {
          this.$emit('resendCode');
        },

        validatePassword(password) {
          var re = /^(?=.*[A-Za-z])(?=.*\d)[a-zA-Z0-9!@#$%^&*()~¥=_+}{":;'?/>.<,`\-\|\[\]]{6,16}$/
          this.ui.validationPassword = re.test(password);
        }, // validatePassword
        
        applyFilter () {
          this.ui.submited = true
          this.validatePassword(this.password);

          this.$v.$touch();
          if (!this.$v.$invalid && this.ui.validationPassword) {
            this.$emit('update:filter', this.password);
            this.$emit('apply', this.password);
          }
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
        },
        password(value) {
          if(this.ui.submited == true) {
            this.validatePassword(value);
          }
        }
    }
}
</script>