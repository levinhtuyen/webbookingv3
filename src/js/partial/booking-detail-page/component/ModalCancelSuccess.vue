<template>
  <modal
    ref="filter-modal-cancel-success"
    :visible.sync="visible"
    class="filter-modal"
  >
    <template slot="header">
      <div class="modal-header">
        <h1>{{ $t('modal_cancel_success.cancelled') }}</h1>
      </div>
    </template>
    <template slot="body">
      <div class="filter-modal__body">
        <div class="filter-modal__body--sort">
            <div class="modal-info-basic">
                <p><i class="fa fa-check icon-success"></i> {{ $t('modal_cancel_success.your_booking_has_been_successfully_cancelled') }}</p>
            </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <div class="filter-modal__footer btn">
        <button
        class="modal-btn-yes"
        @click="closeModal()"
        >
        {{ $t('modal_cancel.back') }}
        </button>
      </div>
    </template>
  </modal>
</template>

<script>
export default {
  props: {
      filter: [Object, Array],
  },
  components: {
      'modal': () => import('~jsPartialPath/global/component/modal/ModalComponent.vue')
  },
  data () {
    return {
      visible: false,
    }
  },
  methods: {
    showModal () {
      this.visible = true
    }, // showModal
    
    closeModal () {
      this.visible = false;
      this.$router.go(0);
    } // closeModal
  }
}
</script>
