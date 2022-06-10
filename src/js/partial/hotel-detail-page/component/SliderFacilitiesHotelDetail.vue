<template>
  <section class="facilities-section">
    <div class="facilities-block">
      <div
        v-if="!isEmpty(facilitiesList)"
        class="facilities-wrapper-outer swiper-container-facilities"
      >
        <div class="facilities-wrapper swiper-wrapper">
          <div
            v-for="(slide,index) in facilitiesList"
            :key="index"
            class="facilities-wrapper-item swiper-slide"
          >
            <div class="facilities-img-outer">
              <img
                :src="`https://go2joy.s3-ap-southeast-1.amazonaws.com/`+slide.imagePath"
                alt=""
              >
            </div>
            <div class="facilities-img-name">
              <p> {{ language=='vi'? slide.name:slide.nameEn }}</p>
            </div>
          </div> <!-- .facilities-wrapper-item -->
        </div>
      </div> <!-- .facilities-wrapper -->
    </div> <!-- .facilities-block -->
  </section> <!-- .facilities-section -->
</template>

<script>
  import {
    _,
    mapState
  } from '~jsLibPath/lib-manager';
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsPath/base/vuex/modules/page-info-module";

  export default {
    name: "SliderFacilitiesHotelDetail",
    props: {
      listImageFacilities: [Array]
    },
    data () {
      return {}
    },
    computed: {
      facilitiesList () {
        return this.listImageFacilities
      },
       ...mapState(PAGE_INFO_MODULE_NAME, {
        language: 'language',
      }),
    },

    mounted () {
      const Swipes = new Swiper('.swiper-container-facilities', {
        loop: false,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          '32': {
            'slidesPerView': 3,
            'spaceBetween': 20
          },
          '640': {
            'slidesPerView': 4,
            'spaceBetween': 20
          },
          '768': {
            'slidesPerView': 4,
            'spaceBetween': 40
          },
          '1024': {
            'slidesPerView': 6,
            'spaceBetween': 50
          }
        }
      });
    },

    methods: {
      isEmpty: _.isEmpty,
    }
  }
</script>
