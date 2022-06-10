<template>
  <G2JBasicModal
    v-if="isShowModal"
    :custom-modal-class="customClass"
    @close="closeModal"
  >
    <template #head-title >
      Extra service
    </template>
    <template #body-content>
      <div
        class="service-list scroll-bar-custom"
      >
        <div
          v-for="(room, inxRom) in extraServiceList"
          :key="inxRom"
          class="service-item"
        >
          <img
            class="service-image"
            :src="room.imgUrl"
          >
          <div class="service-content">
            <p>{{ room.name }}</p>
            <p>{{ room.price }}</p>
            <p class="action">
              <i class="fa fa-minus minus fa-xs" />
              <span class="px-10px">1</span>
              <i class="fa fa-plus plus fa-xs" />
            </p>
          </div>
        </div>
      </div>
    </template>
  </G2JBasicModal>
</template>
<script>
import G2JBasicModal from '~jsPath/partial/global/component/g2j-basic-modal/G2jBasicModal.vue';
export default {
  components: {
    G2JBasicModal
  },
  props: {
    customClass: {
      type: String,
      default: " "
    }
  },
  data() {
    return {
      isShowModal: false,
      extraServiceList: []
    };
  },
  computed: {},
  created() {},
  methods: {
    openModal(data) {
      this.extraServiceList = data;
      this.isShowModal = true;
    },
    closeModal() {
      this.isShowModal = false;
    },
    onChangeRoom(data) {
      this.$emit("onChangeRoom", data);
      this.closeModal();
    }
  }
};
</script>
