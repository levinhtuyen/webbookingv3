<template>
  <modal
    ref="popup-modal"
    :visible.sync="visible"
    class="popup-modal"
  >
    <template slot="header">
      <div class="popup-modal__header">
        <h1>{{ $t('promotion.popup_title')}}</h1>
      </div>
    </template>
    <template slot="body">
      <div class="popup-modal__body">
        <p>{{ $t('promotion.popup_content')}}</p>
      </div>
    </template>
    <template slot="footer">
      <div class="popup-modal__footer">
        <div class="popup-modal__footer--image">
            <img src="../../../../../image/AndroidDownload.svg" alt="">
        </div>
        <div class="popup-modal__footer--image">
            <img src="../../../../../image/IOSDownload.svg" alt="">
        </div>
        <div class="popup-modal__footer--button">
          <button
            class="popup-modal__footer--btn-close"
            @click="visible = false"
          >{{ $t('promotion.popup_close')}}</button>
        </div>
      </div>
    </template>
  </modal>
</template>

<script>
  export default {
    props: {
      filter: [Object, Array],
      // visible: {
      //   type: Boolean,
      // },
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
      showModal () {
        this.visible = true
      },
      closeModal () {
        this.visible = false
      }
    },
  }
</script>

