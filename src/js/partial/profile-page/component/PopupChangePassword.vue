<template>
  <modal
    ref="popup-modal-change-password"
    :visible.sync="visible"
    class="popup-modal-change-password"
  >
    <template slot="header">
      <div class="popup-modal-change-password__header">
        <h1>{{ $t('profile.change_password_popup.change_popup')}}</h1>
      </div>
    </template>
    <template slot="body">
      <div class="popup-modal-change-password__body">
        <div class="popup-modal-change-password__body--content-line">
          <div class="content-info">
            <input
              id="password-field-popup"
              class="input-info-password"
              type="password"
              :placeholder="$t('profile.change_password_popup.password')"
              v-model="password"
            />
            <div class="content-info-icon">
              <span
                @click="handleClickEyes('toggle-change-password')"
                toggle="#password-field-popup"
                class="fa fa-fw fa-eye field-icon toggle-change-password"
              ></span>
            </div>
          </div>
        </div>
        <div class="popup-modal-change-password__body--content-line">
          <div class="content-info">
            <input
              id="confirm-password-field-popup"
              class="input-info-password"
              type="password"
              :placeholder="$t('profile.change_password_popup.confirm_password')"
              v-model="passwordConfirm"
            />
            <div class="content-info-icon">
              <span
                @click="handleClickEyes('toggle-change-confirm-password')"
                toggle="#confirm-password-field-popup"
                class="toggle-change-confirm-password fa fa-fw fa-eye field-icon "
              ></span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <div class="popup-modal-change-password__footer">
         <div class="check-error" v-if="getError == 'error'">
          {{ $t('profile.change_password_popup.error')}}
        </div>
        <div class="popup-modal-change-password__footer--button">
          <button
            class="popup-modal-change-password__footer--btn-close"
            @click="updatePassword()"
          >{{ $t('profile.change_password_popup.confirm')}}</button>
        </div>
      </div>
    </template>
  </modal>
</template>

<script>
  export default {
    props: {
    },
    components: {
      'modal': () => import('~jsPartialPath/global/component/modal/ModalComponent.vue')
    },
    data () {
      return {
        checked: '',
        visible: false,
        password: '',
        passwordConfirm: '',
        getError: '',
      }

    },
    methods: {
      showModalChangePassword () {
        this.visible = true
      },
      closeModalChangePassword () {
        this.visible = false
      },
      backLayout(){
        this.$router.push({ name: 'account-page'})
      },
      handleClickEyes(a) {
        const elTogglePassword = self.$refs['MainProfilePage'].getElementsByClassName(a);

        if(elTogglePassword.length) {
          const elTogglePasswordItem = elTogglePassword[0];
          const elTogglePasswordItem = this.classList;

          if(elTogglePasswordItem.contains('fa-eye-slash')) {
            elTogglePasswordItem.remove('fa-eye-slash');
            elTogglePasswordItem.add('fa-eye');
          } else {
            elTogglePasswordItem.remove('fa-eye');
            elTogglePasswordItem.add('fa-eye-slash');
          }

          const elPasswordInput = document.getElementById(elTogglePasswordItem.getAttribute('toggle'));

          if(elPasswordInput) {
            console.log(elPasswordInput.getAttribute("type"));
            if (elPasswordInput.getAttribute("type") === "password") {
              elPasswordInput.setAttribute("type", "text");
              elPasswordInput.setAttribute("class", "input-font-size");
            } else {
              elPasswordInput.setAttribute("type", "password");
              elPasswordInput.setAttribute("class", "input-info-password");
            }
          }
        }
      }, //handle eye

      updatePassword(){
        if(this.password != this.passwordConfirm){
          this.getError = 'error'
        }else{
          this.getError= 'true'
          console.log('11111');
          this.closeModalChangePassword()
          this.$emit('showPopupModalChangePasswordSuccess')
        }

      }


    },
    mounted() {

    },
  }
</script>

