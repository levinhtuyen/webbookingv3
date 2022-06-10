<template>
  <modal
    ref="modal-sold-out-room"
    class="modal-sold-out-room"
    :visible.sync="visible"
    :hasHeader="false"
    :hasFooter="false"
  >
    <!-- :isClose="false" -->
    <template slot="body">
      <div class="modal-sold-out-room__body">
        {{$t('hotel_detail.note_modal_sold_out_room')}}
      </div>
    </template>
    <template slot="footer">
      <div class="modal-sold-out-room__footer">

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
