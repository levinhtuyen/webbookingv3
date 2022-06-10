<template>
  <modal
    ref="filter-modal-cancel-error"
    :visible.sync="visible"
    class="filter-modal cancel-error-modal"
  >
    <template slot="header">
      <div class="modal-header">
        <h1>{{ $t('modal_cancel_overtime.cancellation_failed') }}</h1>
      </div>
    </template>
    <template slot="body">
      <div class="filter-modal__body">
        <div class="filter-modal__body--sort">
            <div class="modal-info-basic" v-if="messageErrors.length > 0">
                <p v-for="(item, index) in messageErrors" :key="index">
                  <i class="fa fa-times icon-error"></i>
                  {{ item.message }}
                </p>
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
      messageErrors: {
        type: Array,
        default: []
      }
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
        this.visible = false
    } // closeModal
  }
}
</script>
