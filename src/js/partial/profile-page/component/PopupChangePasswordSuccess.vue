<template>
  <modal
    ref="popup-modal-password-success"
    :visible.sync="visible"
    class="popup-modal-change-password-success"
  >
    <template slot="header">
      <div class="popup-modal-change-password-success__header">
        <h1>{{ $t('profile.change_password_success_popup.change_popup')}}</h1>
      </div>
    </template>
    <template slot="body">
      <div class="popup-modal-change-password-success__body">
        <p><i class="fas fa-check-circle"></i><span>{{ $t('profile.change_password_success_popup.password_change_success')}}</span></p>
      </div>
    </template>
    <template slot="footer">
      <div class="popup-modal-change-password-success__footer">
        <div class="popup-modal-change-password-success__footer--button">
          <button
            class="popup-modal-change-password-success__footer--btn-close"
            @click="visible = false,backLayout()"
          >{{ $t('profile.change_password_success_popup.back_to_home')}}</button>
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

      }

    },
    methods: {
      showModalPasswordSuccess () {
        this.visible = true
      },
      closeModalPasswordSuccess () {
        this.visible = false
      },
      backLayout(){
        this.$router.push({ name: 'home-page'})
      },


    },
    mounted() {

    },
  }
</script>

