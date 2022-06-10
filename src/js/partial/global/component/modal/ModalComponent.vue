<template>
  <div
    ref="modal-component"
    class="modal-component"
    v-show="visible"
  >
    <div
      v-if="!disableClickBackground"
      class="modal-component__wrapper"
      @click="beforeClose"
    >
    </div>
    <div
      v-else
      class="modal-component__wrapper"
    >
    </div>
    <transition :name="nameTransition">
      <div
        v-show="visible"
        :key="visible"
        class="modal-component__main modal-component-class-custom"
      >
        <div
          v-if="isClose"
          class="modal-component__main--button"
        >
          <i
            @click="beforeClose"
            class="fas fa-times"
          ></i>
        </div>
        <div
          v-if="hasHeader"
          class="modal-component__main--header"
        >
          <slot name="header"></slot>
        </div>
        <div class="modal-component__main--body">
          <slot name="body"></slot>
        </div>
        <div
          v-if="hasFooter"
          class="modal-component__main--footer"
        >
          <slot name="footer"></slot>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false,
      },

      isClose: {
        type: Boolean,
        default: true,
      },
      hasHeader: {
        type: Boolean,
        default: true,
      },
      hasFooter: {
        type: Boolean,
        default: true,
      },
      disableClickBackground: {
        type: Boolean,
        default: false,
      },
      nameTransition: {
        type: String,
        default: "fade-y",
        validator: function (value) {
          // The value must match one of these strings
          return (
            [
              "fade",
              "fade-x",
              "fade-y",
              "scale-in",
              "shrink",
              "swirl",
              "tilt",
            ].indexOf(value) !== -1
          );
        },
      },
    },
    methods: {
      closeModal() {
        this.$emit("update:visible", false);
      },
      beforeClose() {
        let checkEmit = this.$listeners.beforeClose || null;
        if (checkEmit) {
          this.$emit("beforeClose", (cancel) => {
            if (cancel !== false) {
              this.$emit("update:visible", false);
              this.$emit("close");
            }
          });
        } else {
          this.closeModal();
        }
      },
    },
    created() {},
    watch: {
      visible: {
        handler(val) {
          if (val) {
            document.documentElement.style.overflow = "hidden"; // firefox, chrome
            document.body.scroll = "no"; // ie only ;
          } else {
            document.documentElement.style.overflow = null; // firefox, chrome
            document.body.scroll = "yes"; // ie only
          }
        },
        immediate: true,
      },
    },

    mounted() {
      let elContainer = document.getElementsByClassName("modal-component__main");
    },
    beforeDestroy() {
      // document.documentElement.style.overflow = "auto"; // firefox, chrome
      // NOTE - change from auto to null cause if document with overflow auto -> the position sticky doesn't work, null value same default value of overflow attribute of document
      document.documentElement.style.overflow = null; // firefox, chrome

      document.documentElement.style.removeProperty("overflow");

      document.body.scroll = "yes"; // ie only;
    },
  };
</script>
