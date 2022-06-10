<template>
  <div  class="g2j-swiper-component" >
      <!-- v-if="!isEmpty(dataList)" -->
    <div
      class="g2j-swiper-component-wrapper-outer "
      :class="`${this.name}-swiper-container`"
    >
    <!-- g2j-swiper-container -->
      <div class="g2j-swiper-component-wrapper swiper-wrapper">
        <div
          v-for="(slide, index) in dataList"
          :key="index"
          class="g2j-swiper-component-wrapper-item swiper-slide"
          @click="handleSelect(slide)"
        >
          <slot :item="slide" />
        </div>
        <slot name="button"></slot>
        <!-- .g2j-swiper-component-wrapper-item -->
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      name: {
        type : String,
        default: 'g2j-swiper'
      },
      data: {
        type: [Array, Object],
      },
      breakpoints: {
        type: [Array, Object],
        default:  {
          // for mobile
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          375: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          // for pad
          758: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          // for desktop
          1280: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
        }
      },
      optionMore: [Object,Array],
      isCheckButton: {
        type:Boolean,
        default:false
      }
    },
    computed: {
      dataList() {
        return this.data;
      },
    },
    watch: {

    },
    created() {},
    mounted() {
      let self = this

      setTimeout(function() {
        const Swipes = new Swiper(`.${self.name}-swiper-container`, {
          on: {
            init: function (e) {
              if (self.isCheckButton){
                if (this.isEnd){
                  let btnPrev = document.getElementsByClassName(`${self.name}-button-prev`)
                  let btnNext = document.getElementsByClassName(`${self.name}-button-next`)
                  btnPrev[0].style.display="none"
                  btnNext[0].style.display="none"
                  return
                }

                let button = document.getElementsByClassName(`${self.name}-button-prev`)
                button[0].style.opacity="0.5"
                button[0].disable= true
              }
            },
          },
          loop: false,
          observer: true,
          navigation: {
            // nextEl: ".swiper-button-next",
            // prevEl: ".swiper-button-prev",
            nextEl: `.${self.name}-button-next`,
            prevEl:  `.${self.name}-button-prev`,
          },
          breakpoints: self.breakpoints,
          ...self.optionMore
        });

        Swipes.on("slideChange", function() {
          if (self.isCheckButton){
            if(this.realIndex == 0){
              let button = document.getElementsByClassName(`${self.name}-button-prev`)
              button[0].style.opacity="0.5"
              button[0].disable= true
            }
            else{
              let button = document.getElementsByClassName(`${self.name}-button-prev`)
              button[0].style.opacity="1"
              button[0].disable= false
            }
            if(this.isEnd){
                let button = document.getElementsByClassName(`${self.name}-button-next`)
                button[0].style.opacity="0.5"
                button[0].disable= true
            } else {
                let button = document.getElementsByClassName(`${self.name}-button-next`)
                button[0].style.opacity="1"
                button[0].disable= false
            }
          }
        });

        self.$emit('initSwiper', Swipes);
      }, 150);
    },
    methods: {
      isEmpty: _.isEmpty,
      handleSelect(data){
        this.$emit('selectItem',data)
      }
    },
  };
</script>
