<template>
  <div
    class="g2j-basic-modal"
    :class="{
      [customModalClass]: customModalClass,
      'g2j-basic-modal--zindex-top': isZindexTop,
      'g2j-basic-modal--disable-close': disableUserCloseModal,
    }"
  >
    <div
      class="g2j-basic-modal__bg modal-bg"
      :class="{
        '--disable-click': disableUserCloseModal
      }"
      @click.stop="closeModal"
    />

    <div
      class="g2j-basic-modal__section modal-section"
      :class="{
        '--disable-close': disableUserCloseModal
      }"
    >
      <div
        v-if="!hideHeadModal"
        class="g2j-basic-modal__section__head section-head"
      >
        <div class="g2j-basic-modal__section__head__title head-title">
          <slot name="head-title" />
        </div>

        <div
          v-if="!disableUserCloseModal"
          class="g2j-basic-modal__section__head__close-btn close-btn"
          @click.stop="closeModal"
        >
          <i class="fal fa-times" />
        </div>
      </div> <!-- .g2j-basic-modal__section__head -->

      <div class="g2j-basic-modal__section__body section-body scroll-bar-custom">
        <slot name="body-content" />

        <slot name="body-control" />
      </div> <!-- .g2j-basic-modal__section__body -->
    </div> <!-- .g2j-basic-modal__section -->
  </div> <!-- .g2j-basic-modal -->
</template>

<script>
  import { IMAGE_URL } from "~jsDefinePath/general";

  export default {
    name: "G2jBasicModal",
    props: {
      customModalClass: {
        type: String,
        default: "",
      },

      hideHeadModal: {
        type: Boolean,
        default: false,
      },

      disableUserCloseModal: {
        type: Boolean,
        default: false,
      },

      disableWindowScroll: {
        type: Boolean,
        default: false,
      },

      isZindexTop: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        IMAGE_URL,
        // imageUrl: IMAGE_URL,
      };
    },

    created() {},

    mounted() {
      this.$emit("mounted");

      if (this.disableWindowScroll) {
        document
          .getElementsByTagName("html")[0]
          .classList.add("is-disable-scroll--g2j-basic-modal");
      }
    },

    beforeDestroy() {
      if (this.disableWindowScroll) {
        document
          .getElementsByTagName("html")[0]
          .classList.remove("is-disable-scroll--g2j-basic-modal");
      }
    },

    methods: {
      closeModal() {
        if (!this.disableUserCloseModal) {
          this.$emit("close");
        }
      }, // closeModal()
    },
  };
</script>
