<template>
  <transition name="fade">
    <G2jBasicModal
      v-show="isShow"
      :custom-modal-class="'g2j-direct-app-notice-modal'"
      @close="closeModal"
      @mounted="onBasicModalMounted"
    >
      <template #head-title />

      <template #body-content>
        <div class="g2j-direct-app-notice-modal__img-outer">
          <img
            :src="IMAGE_URL + '/bg/direct-app-notice-img.png'"
            :alt="$t('common.direct_app_notice_content_first')"
            class="g2j-direct-app-notice-modal__img"
          >
        </div> <!-- .g2j-direct-app-notice-modal__img-outer -->
        <h2 class="g2j-direct-app-notice-modal__content--title">{{ $t('common.direct_app_notice_title') }}</h2>
        <div class="g2j-direct-app-notice-modal__content--first">
          {{ $t('common.direct_app_notice_content_first') }}
        </div> <!-- .g2j-direct-app-notice-modal__content--first -->

        <div class="g2j-direct-app-notice-modal__content--second">
          {{ $t('common.direct_app_notice_content_second') }}
        </div> <!-- .g2j-direct-app-notice-modal__content--first -->

        <div class="g2j-direct-app-notice-modal__container-group">
          <img
            :src="IMAGE_URL + '/qrcode.svg'"
            alt="QR Go2Joy App"
            height="85px"
            width="85px"
          >
          <div class="g2j-direct-app-notice-modal__btn-group">
            <a
              class="g2j-direct-app-notice-modal__btn-item g2j-direct-app-notice-modal__ios-download-btn"
              target="_blank"
              href="https://ga7fe.app.goo.gl/buttonios"
            >
              <img
                :src="IMAGE_URL + '/apple-download-btn.png'"
                alt="Donwload Go2Joy App for iOS"
              >
            </a> <!-- .g2j-direct-app-notice-modal__ios-download-btn -->

            <a
              class="g2j-direct-app-notice-modal__btn-item g2j-direct-app-notice-modal__android-download-btn"
              target="_blank"
              href="https://ga7fe.app.goo.gl/buttonandroid"
            >
              <img
                :src="IMAGE_URL + '/android-download-btn.png'"
                alt="Donwload Go2Joy App for Android"
              >
            </a> <!-- .g2j-direct-app-notice-modal__android-download-btn -->
          </div>

        </div> <!-- .g2j-direct-app-notice-modal__btn-group -->
      </template>
    </G2jBasicModal>
  </transition>
</template>

<script>
  import { IMAGE_URL } from "~jsDefinePath/general";
  // import G2jBasicModal from "~jsPath/partial/global/component/g2j-basic-modal/G2jBasicModal.vue";

  export default {
    components: {
      G2jBasicModal: () =>
        import(
          "~jsPath/partial/global/component/g2j-basic-modal/G2jBasicModal.vue"
        ),
    },

    props: {
      isShow: {
        default: false,
        type: Boolean,
      },
    },

    data() {
      return {
        IMAGE_URL,
      };
    },

    created() {},

    methods: {
      closeModal() {
        this.$emit("onCloseModal");
      },
    },
  };
</script>
