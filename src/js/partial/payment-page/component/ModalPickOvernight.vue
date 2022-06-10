<template>
  <G2jBasicModal
    v-if="isShowModal"
    class="modal-pick-overnight"
    @close="closeModal"
  >
    <template #head-title>
      {{ " " }}
    </template>
    <template #body-content>
      <div class="__option-1">
        <p>1.{{ $t('payment.room_type.right_now') }}</p>
        {{ option1 }}
        <input
          v-model="option"
          type="radio"
          name="option"
          value="0"
          @click="closeModal"
        >
      </div>
      <div class="__option-2">
        <p>2.{{ $t('payment.room_type.tonight') }}</p>
        {{ option2 }}
        <input
          v-model="option"
          type="radio"
          name="option"
          value="1"
          @click="closeModal"
        >
      </div>
    </template>
  </G2jBasicModal>
</template>
<script>
  import G2jBasicModal from '~jsPath/partial/global/component/g2j-basic-modal/G2jBasicModal.vue';

  export default {
    components: {
      G2jBasicModal,
    },
    data() {
      return {
        isShowModal : false,
        option      : 0,
        objOverNight: {}
      };
    },
    computed: {
      option1() {
        return `${this.objOverNight.current}(${dayjs(this.objOverNight.lastDate).format('DD/MM')}) ~ ${this.objOverNight.endOvernight}(${dayjs(this.objOverNight.currentDate).format('DD/MM')})`
      },
      option2() {
        return `${this.objOverNight.startOvernight}(${dayjs(this.objOverNight.currentDate).format('DD/MM')}) ~ ${this.objOverNight.endOvernight}(${dayjs(this.objOverNight.nextDate).format('DD/MM')})`
      }
    },
    methods: {
      openModal(data) {
        this.objOverNight             = data;
        let date                      = new Date()
        this.objOverNight.lastDate    = new Date(date.getFullYear(),date.getMonth(),new Date().getDate()-1);
        this.objOverNight.currentDate = date;
        this.objOverNight.nextDate    = new Date(date.getFullYear(),date.getMonth(),new Date().getDate()+1);
        this.isShowModal  = true;
      },
      closeModal() {
        this.isShowModal = false;
        this.$emit('pickOverNight',this.option)
      },
    },
  };
</script>
