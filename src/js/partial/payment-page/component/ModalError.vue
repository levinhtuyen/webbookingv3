<template>
  <modal
    ref="modal-error-payment"
    class="modal-error-payment"
    :visible.sync="visible"
    :has-footer="false"
  >
    <template slot="header">
      <div class="modal-error-payment__header">
       <span v-if="errorPayment">{{$t('payment.error_payment')}}</span>
       <span v-else>{{$t('payment.error')}}</span>
      </div>
    </template>
    <template slot="body">
      <div
        v-if="message"
        class="modal-error-payment__body"
      >
        <p
          v-for="(v,k) in message"
          :key="k"
        >{{v.message}}</p>

      </div>
    </template>
    <template slot="footer" />
  </modal>
</template>

<script>
  // import Go2joyFlagsSection from '~jsPartialPath/global/component/go2joy-flags/Go2joyFlagsSection.vue'
  import {
    Vue,
    numeric,
    minLength,
    required
  } from '~jsLibPath/lib-manager';
  Vue.use(vuelidate.default);

  export default {
    components: {
      'modal': () => import('~jsPartialPath/global/component/modal/ModalComponent.vue'),
      // Go2joyFlagsSection
    },
    props: {
      message: {
        type: String,
      },
    },
    data () {
      return {
        visible: false,
      }
    },

    methods: {
      openModal () {
        this.phone = ''
        this.visible = true
      },
      closeModal () {
        this.visible = false
      },

    },

    computed: {
      errorPayment() {
        if (!this.message) return
        let code20 = this.message.find((el) => el.code == 20);
        return code20?true:false
      }
    },

  }
</script>
