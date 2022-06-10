<template>
  <modal
    ref="modal-select-login"
    class="modal-select-login"
    :visible.sync="visible"
  >
    <template slot="body">
      <div class="modal-select-login__body">
        {{ $t("select-login.note_modal_select_login") }}
      </div>
    </template>
    <template slot="footer">
      <div class="modal-select-login__footer">
        <button @click="$emit('bookAsLogin')">
          {{ $t("select-login.log_in") }}
        </button>
        <button @click="$emit('bookAsGuest')">
          {{ $t("select-login.book_as_guest") }}
        </button>
      </div>
    </template>
  </modal>
</template>

<script>
  import modal from "~jsPartialPath/global/component/modal/ModalComponent.vue";
  export default {
    data() {
      return {
        visible: false,
      };
    },
    components: {
      modal,
    },
    methods: {
      openModal() {
        this.visible = true;
      },
      closeModal() {
        this.visible = false;
      },
    },
  };
</script>
