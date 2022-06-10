<template>
  <modal
    ref="popup-modal-success"
    :visible.sync="visible"
    class="popup-modal-success"
  >
    <template slot="header">
      <div class="popup-modal-success__header">
        <h1>{{ $t('profile.success_popup.update')}}</h1>
      </div>
    </template>
    <template slot="body">
      <div class="popup-modal-success__body">
        <p><i class="fas fa-check-circle"></i><span>{{ $t('profile.success_popup.update_success')}}</span></p>
      </div>
    </template>
    <template slot="footer">
      <div class="popup-modal-success__footer">
        <div class="popup-modal-success__footer--button">
          <button
            class="popup-modal-success__footer--btn-close"
            @click="visible = false,backLayout()"
          >{{ $t('profile.success_popup.back')}}</button>
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
      showModalSuccess () {
        this.visible = true
      },
      closeModalSuccess () {
        this.visible = false
      },
      backLayout(){
        this.$router.push({ name: 'account-page'})
      }
    },
  }
</script>

