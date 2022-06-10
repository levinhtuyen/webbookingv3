<template>
  <modal
    ref="error-payment-modal"
    :isClose="false"
    :visible.sync="visible"
    :disableClickBackground="true"
    class="error-payment-modal"
  >
    <template slot="header">
      <div class="error-payment-modal__header">
        <img :src="IMAGE_URL + '/icon/payment/error_payment.svg'">
      </div>
    </template>
    <template slot="body">
      <div class="error-payment-modal__body">
        <div class="error-payment-title">
          {{$t('payment_v4.step_2.book_cancelled')}}
        </div>
        <!-- v-if="message && message.length" -->
        <div class="error-payment-content">
          <!-- <p
            v-for="(v,k) in message"
            :key="k"
          >{{v.message}}</p> -->

          <template v-if="message && message.length">
            <p
              v-for="(v,k) in message"
              :key="k"
            >{{v.message}}</p>
          </template>
          <p v-else>
            {{$t('payment_v4.step_2.error_payment')}}
          </p>
        </div>
      </div>
    </template>
    <template slot="footer">
      <div class="error-payment-modal__footer">
        <button
          class="g2j-button-book-now"
          @click="$emit('bookOther')"
        >
          {{$t('payment_v4.step_2.book_another')}}
        </button>
      </div>
    </template>
  </modal>
</template>

<script>
  import {
    IMAGE_URL,
    CACHE_VERSION,
    ASSETS_SERVICE_URL,
    HAS_MOITAI,
  } from "~jsDefinePath/general";

  export default {
    props: {
      message: [Array, Object],
    },
    components: {
      modal: () =>
        import("~jsPartialPath/global/component/modal/ModalComponent.vue"),
    },
    data() {
      return {
        IMAGE_URL,
        visible: false, //check show modal
      };
    },

    methods: {
      openModal() {
        this.visible = true; //key => hiện modal
      },
      closeModal() {
        this.visible = false; //key => ẩn modal
      },
    },
    computed: {},
  };
</script>

