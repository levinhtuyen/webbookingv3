<template>
  <div class="review__rating-star">
    <template v-for="(n, idx) in 5">
      <i
        :key="idx"
        class="fal fa-star star-icon"
        :class="{ 'is-active' : idx === curActiveRatingStar }"
        @click="changeRatingStar(idx)"
      ></i>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    rattingStart: [Number, String]
  },
  data() {
    return {
      objDataSend: {
        rating_star: ''
      },
      // curActiveRatingStar: null
      curActiveRatingStar: this.rattingStart ? (5 - this.rattingStart) : null
    }
  },

  methods: {
    changeRatingStar(idx) {
      if(this.curActiveRatingStar != idx) {
        this.curActiveRatingStar = idx;
        this.objDataSend.rating_star = this.generateRatingStarNumberToSend(this.curActiveRatingStar);
      }
    }, // changeRatingStar()
    generateRatingStarNumberToSend(ratingStar) {
      /**
        * NOTE - tính lại số sao chính xác theo số tương ứng đang hiển thị
        * vd hiển thị 0 thì số sao chính xác là 5 (vì hiển thị là số index nghịch đảo của rating hiện tại)
        */
      ratingStar = Number(ratingStar);
      if(_.isNaN(ratingStar)) {
        return 0;
      }

      this.$emit('apply', [5,4,3,2,1][ratingStar])

      return [5,4,3,2,1][ratingStar];
    }, // generateRatingStarNumberToSend()
  },
}
</script>

<style>

</style>