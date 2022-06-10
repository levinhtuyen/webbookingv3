<template>
  <modal
    ref="popup-modal-apply-coupon-error"
    :visible.sync="visible"
    class="popup-modal-apply-coupon-error"
  >
    <template slot="header">
      <div class="popup-modal-apply-coupon-error__header">
        <h1>{{ $t('promotion.apply_coupon_error_popup.apply_failed')}}</h1>
      </div>
    </template>
    <template slot="body">
      <div class="popup-modal-apply-coupon-error__body">
        <p v-for="(error,index) in errorObj" :key="index"><i class="fas fa-times-circle"></i><span>{{ error.message }}</span></p>
      </div>
    </template>
    <template slot="footer">
      <div class="popup-modal-apply-coupon-error__footer">
        <div class="popup-modal-apply-coupon-error__footer--button">
          <button
            class="popup-modal-apply-coupon-error__footer--btn-close"
            @click="visible = false"
          >{{ $t('promotion.apply_coupon_error_popup.close')}}</button>
        </div>
      </div>
    </template>
  </modal>
</template>

<script>
  export default {
    props: {
      getErrorObj: [Array,Object]
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
    computed: {
      errorObj() {
        return this.getErrorObj
      }
    },
    methods: {
      showModalApplyCouponError () {
        this.visible = true
      },
      closeModalApplyCouponError () {
        this.visible = false
      },
      backLayout(){
        this.$router.push({ name: 'account-page'})
      }
    },
  }
</script>

