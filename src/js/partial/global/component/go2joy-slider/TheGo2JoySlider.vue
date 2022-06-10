<template>          
  <input 
    :disabled="disable"
    ref="ElSlider"
    class="slider" 
    type="range" 
    :min="minValue" 
    :max="maxValue"
    v-model="percentValue" 
    :style="{'--webkitProgressPercent': percent+'%', '--transform': transform}"
    @click="setCSSProperty()"
    :ontouchend="setCSSProperty()"
  >
</template>
<script>
export default {
  props: {
      minValue: {
          type: Number,
          default: 0,
      },
      maxValue: {
          type: Number,
          default: 10,
      },
      percentValue: {
        type: Number,
        default: 0,
      },
      disable: { 
        type: Boolean,
        default: false,
      },
    },
    data() {
        return {
          percent: 0,
          transform: ''
        }
    },

    mounted() {
      this.setCSSProperty();
    },

    methods: {
      setCSSProperty() {
          if(this.minValue == this.maxValue) {
            this.percent    = 100;
            this.transform  = 'scale(0)'
          } else {
            const percent =
            ((this.percentValue - this.minValue) /
            (this.maxValue - this.minValue)) *
            100;
            this.percent    = percent;
            this.transform  = 'unset'
          }
      }
    },

    watch: {
      percentValue (val) {
        this.$emit('getSliderValue', val);
      }
  }
}
</script>