<template>
  <modal
    ref="popup-modal-apply-coupon-success"
    :visible.sync="visible"
    class="popup-modal-apply-coupon-success"
  >
    <template slot="header">
      <div class="popup-modal-apply-coupon-success__header">
        <h1>{{ $t('promotion.apply_coupon_success_popup.success')}}</h1>
      </div>
    </template>
    <template slot="body">
      <div class="popup-modal-apply-coupon-success__body">
        <p><i class="fas fa-check-circle"></i><span>{{ $t('promotion.apply_coupon_success_popup.apply_success')}}</span></p>
      </div>
    </template>
    <template slot="footer">
      <div class="popup-modal-apply-coupon-success__footer">
        <div class="popup-modal-apply-coupon-success__footer--button">
          <button
            class="popup-modal-apply-coupon-success__footer--btn-close"
            @click="visible = false"
          >{{ $t('promotion.apply_coupon_success_popup.close')}}</button>
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
      showModalApplyCouponSuccess () {
        this.visible = true
      },
      closeModalApplyCouponSuccess () {
        this.visible = false
      },
      backLayout(){
        this.$router.push({ name: 'account-page'})
      }
    },
  }
</script>

