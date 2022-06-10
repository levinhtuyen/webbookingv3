<template>
  <modal
    ref="filter-modal"
    :visible.sync="visible"
    class="filter-modal"
  >
    <template slot="header">
      <div class="modal-header">
        <h1>{{ $t('modal_cancel.cancel_booking') }}</h1>
      </div>
    </template>
    <template slot="body">
      <div class="filter-modal__body">
        <div class="filter-modal__body--sort">
            <div class="modal-info-basic">
                <p>{{ $t('modal_cancel.are_you_sure_you_want_to_cancel_this_booking') }}</p>
            </div>
        </div>
      </div>
    </template>
    <template slot="footer">
        <div class="filter-modal__footer">
            <button
            class="modal-btn-yes"
            @click="yesFilter()"
            >
            {{ $t('modal_cancel.yes_cancel') }}
            </button>
            <button
            class="modal-btn-no"
            @click="closeModal()"
            >
            {{ $t('modal_cancel.no_keep_the_booking') }}
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
            this.visible = false
        }, // closeModal

        yesFilter () {
            this.$emit('apply')
        } // yesFilter
    },
    watch: {
        visible (val) {
            this.$emit('update:visible', val)
        }
    }
}
</script>
