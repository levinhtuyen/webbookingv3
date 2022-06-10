<template>
  <div class="g2j-star-rating">
    <div class="g2j-star-rating__stars" :style="`--rating: ${numberRate};`">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    starRating: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
    }
  },
  computed: {
    numberRate() {
      return this.starRating
    }
  },

}
</script>

<style>

</style>
