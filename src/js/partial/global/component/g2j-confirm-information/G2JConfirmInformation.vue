<template>
  <div class="g2j-confirm-information container">
    <div class="g2j-confirm-information__item">
      <div
        @click="$emit('onBack')"
        class="confirm-button-back"
      >
        <i class="fas fa-chevron-left"></i>
      </div>
      <div class="confirm-image">
        <div
          class="confirm-image__image"
          v-if="stepActive === 1"
        >
          <img :src="IMAGE_URL + '/icon/filter/calendar.svg'" />
        </div>
        <div
          class="confirm-image__image"
          v-else-if="stepActive === 2"
        >
          <img :src="IMAGE_URL + '/icon/filter/payment.svg'" />
        </div>
        <div
          class="confirm-image__image"
          v-else
        >
          <img :src="IMAGE_URL + '/icon/filter/booked.svg'" />
        </div>
      </div>
    </div>
    <div
      class="g2j-confirm-information__text"
      v-if="stepActive == 3"
    >
      <p>{{ $t("payment_v4.step_next.booked") }}</p>
    </div>
    <div
      class="g2j-confirm-information__text"
      v-if="stepActive == 2"
    >
      <p>{{ $t("payment_v4.step_next.choose_payment") }}</p>
    </div>
    <div
      class="g2j-confirm-information__text"
      v-if="stepActive == 1"
    >
      <p>{{ $t("payment_v4.step_next.confirm_information") }}</p>
    </div>
    <div class="g2j-confirm-information__step">
      <div class="progress-container">
        <div class="progress"></div>
        <div class="circle active">
          <i class="fas fa-check-circle active"></i>
        </div>
        <div class="circle active">
          <i
            class="fas fa-circle"
            :class="stepActive >= 2 ? '' : 'active'"
          ></i>
          <i
            class="fas fa-check-circle"
            :class="stepActive >= 2 ? 'active' : ' '"
          ></i>
        </div>
        <div class="circle active">
          <i
            class="fas fa-circle"
            :class="stepActive >= 3 ? '' : 'active'"
          ></i>
          <i
            class="fas fa-check-circle"
            :class="stepActive >= 3 ? 'active' : ' '"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { IMAGE_URL } from "~jsDefinePath/general";
  export default {
    props: {
      numberActiveStep: {
        type: Number,
        default: Number,
      },
    },
    data() {
      return {
        IMAGE_URL,
      };
    },
    computed: {
      stepActive() {
        return this.numberActiveStep;
      },
    },
    mounted() {
      this.checkStep();
    },
    methods: {
      checkStep() {
        var x = document.getElementsByClassName("progress");
        x[0].style.width = `${((this.stepActive - 1) / 2) * 100}%`;
      },
    },
    watch: {
      numberActiveStep() {
        this.checkStep();
      },
    },
  };
</script>

<style>
</style>
