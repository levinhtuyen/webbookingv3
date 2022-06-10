<template>
  <div class="g2j-hotel-slide">
    <div class="g2j-hotel-slide__button">
      <div class="button button-next">
        <div class="icon-left" @click="$router.go(-1)">
          <i class="fas fa-chevron-left"></i>
        </div>
      </div>
      <div class="button" v-if="checkLayoutDisplay">
        <div class="is-number" v-if="numberFavorite !== 0">
          {{ numberFavorite }}
        </div>
        <div
          @click="checkHeart(isActive)"
          class="icon-heart"
          v-if="isActive === false"
        >
          <i class="far fa-heart"></i>
        </div>
        <div
          class="icon-heart active"
          @click="checkHeart(isActive)"
          v-if="isActive === true"
        >
          <i class="fas fa-heart"></i>
        </div>
      </div>
    </div>
    <g2j-swiper-component
      v-if="!!slideImage.length"
      :name="'hotel-detail'"
      :data.sync="slideImage"
      :breakpoints="breakpoints"
      :is-check-button="false"
      :option-more="{ scrollbar, loop, autoplay }"
      @initSwiper="actionSwiper"
    >
      <template slot-scope="slotProps">
        <div class="slide-item">
          <div class="slide-item__image">
            <g2j-image
              :url-img="`${ASSETS_SERVICE_URL}/${slotProps.item.imagePath}`"
            >
            </g2j-image>
          </div>
        </div>

        <!-- <template>
          <div class="g2j-hotel-slide__name-room">
            <div class="name-room">
              <span>{{ slotProps.item.roomTypeName }}</span>
            </div>
          </div>
        </template> -->
      </template>
    </g2j-swiper-component>
    <div class="g2j-hotel-slide__name-room" v-if="dataSlide && dataSlide.roomTypeName">
      <div class="name-room">
        <span>{{ dataSlide.roomTypeName }}</span>
      </div>
    </div>
    <div class="g2j-hotel-slide__scrollbar">
      <div class="swiper-scrollbar"></div>
    </div>
  </div>
</template>

<script>
import { getToken } from "~jsDefinePath/general";
import { ASSETS_SERVICE_URL } from "~jsDefinePath/general";
export default {
  components: {
    "g2j-swiper-component": () =>
      import(
        "~jsPartialPath/global/component/g2j-swiper-base/Go2JoySwiper.vue"
      ),
    "g2j-image": () =>
      import("~jsPartialPath/global/component/g2j-img/Go2JoyImages.vue"),
  },
  props: {
    listImageSlide: {
      type: [Array, Object],
      default: "[]",
    },
    roomTypeList: {
      type: [Array, Object],
      default: "[]",
    },
    isHotelDetail: {
      type: Boolean,
    },
    totalFavorite: {
      type: Number,
      default: Number,
    },
    isFavorite: {
      type: Boolean,
    }
  },
  data() {
    return {
      ASSETS_SERVICE_URL,
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        375: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        // for pad
        758: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        // for desktop
        1280: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
      },
      scrollbar: {
        el: ".swiper-scrollbar",
        hide: true,
      },
      loop: false,
      isActive: false,
      swiper: null,
      autoplay: {
        delay: 5000,
      },
      slideActive: 0,
      dataSlide: {},
      signIn: false,
    };
  },
  computed: {
    slideImage() {
      return this.listImageSlide;
    },
    listRoom() {
      return this.roomTypeList;
    },
    activeSlide() {
      return this.slideActive;
    },
    checkLayoutDisplay() {
      return this.isHotelDetail;
    },
    numberFavorite() {
      return Number(this.totalFavorite);
    },
    checkFavorite(){
      return this.isFavorite
    }
  },
  created() {
    this.checkSignIn();

  },
  watch: {

    slideActive(val) {
      if (this.slideImage[val] && this.slideImage[val].roomTypeSn) {
        this.listRoom.map((el) => {
          if ((el.roomTypeSn) == (this.slideImage[val].roomTypeSn)) {
            this.dataSlide = el;
          }
        });
      } else {
        this.dataSlide = {};
      }
    },
    checkFavorite(val){
      this.isActive = val
    },
  },

  methods: {
    checkHeart(isActive) {
      if (this.signIn === false) {
        this.$router.push({
          name: "login-page",
        });
      } else {
        if (isActive === false) {
          this.isActive = true;
          this.totalFavorite++;
        } else {
          this.isActive = false;
          this.totalFavorite--;
        }
        this.$emit("onUpdateFavorite", this.isActive);
      }
    },
    actionSwiper(swiper) {
      let self = this;
      swiper.on("activeIndexChange", function () {
        self.slideActive = this.activeIndex;
      });

    },
    checkSignIn() {
      if (_.isEmpty(getToken())) {
        this.signIn == false;
      } else {
        this.signIn = true;
      }
    }, //checkSignIn
  },
};
</script>

<style>
</style>
