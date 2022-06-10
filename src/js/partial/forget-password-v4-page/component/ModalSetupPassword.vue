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
            Set up your new
            <span class="bold">Password</span>
          </p>
          <p v-show="language === 'vi'">
            Cài đặt 
            <span class="bold">mật khẩu</span>
            mới
          </p>
      </div>
    </template>
    <template slot="body">
      <div class="modal-password__body">

        <div class="w-100 mt-1em">
          <div class="forget-password__tabs--flex">
            <i class="fas fa-lock filter-grayscale" />
            <input
              class="input-field"
              :type="ui.showPassword ? 'text' : 'password'"
              v-model.trim="$v.form.password.$model"
              :placeholder="$t('forget_password.enter_your_password')"
            />
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

          <p v-if="!$v.form.password.required && ui.submited" class="error w-100">
            {{ $t('forget_password.password_is_required') }}
          </p>
          <p v-if="!ui.validationPassword && ui.submited" class="error w-100">
            {{ $t('forget_password.password_must_be_6_16_characters_of_english_numbers') }}
          </p>

          <div class="forget-password__tabs--flex">
            <i class="fas fa-lock filter-grayscale" />
            <input
              class="input-field"
              :type="ui.showConfirmPassword ? 'text' : 'password'"
              v-model.trim="$v.form.confirmPassword.$model"
              :placeholder="$t('forget_password.input_your_password_again')"
            />
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

          <p v-if="!$v.form.confirmPassword.required && ui.submited" class="error w-100">
            {{ $t('forget_password.confirm_password_is_required') }}
          </p>
          <p v-if="!$v.form.confirmPassword.sameAsPassword && ui.submited" class="error w-100">
            {{ $t('forget_password.password_and_confirm_password_not_match') }}
          </p>

          <!-- -- start err BE -- -->
          <p v-for="(err, index) in errorList" :key="index" class="error w-100">
            {{ err.message }}
          </p>
          <!-- -- end err BE -- -->
        </div>
        
      </div>
    </template>
    <template slot="footer">
      <div class="modal-password__footer btn">
        <button
          :disabled="disableBtn"
          class="modal-btn-apply"
          @click="submit"
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
  Vue,
  mapState,
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
        isSubmiting: Boolean
    },
    components: {
        'modal': () => import('~jsPartialPath/global/component/modal/ModalComponent.vue')
    },
    data () {
        return {
            visible: false,
            form: {
              password: '',
              confirmPassword: '',
            },
            ui: {
              showPassword        : false,
              showConfirmPassword : false,
              submited            : false,
              validationPassword  : true, // check  format password
              disableClickBackground: true
            }
        }
    },

    validations: {
      form: {
        password: {
          required
        },
        confirmPassword: {
          required,
          sameAsPassword: sameAs('password')
        }
      }
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: 'language',
      }),
      disableBtn() {
        return _.isEmpty(this.form.password) || _.isEmpty(this.form.confirmPassword) || this.isSubmiting;
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

        submit() {
          this.ui.submited = true;
          this.validatePassword(this.form.password);

          if(!this.$v.$invalid && this.ui.validationPassword == true) {
              this.applyFilter();
          }
        },

        applyFilter () {
            let value = '';
            this.$emit('update:filter', value);
            this.$emit('apply', this.form.password);
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