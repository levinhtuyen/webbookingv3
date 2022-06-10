<template>
  <div class="slide-discount">
    <g2j-swiper-component
      v-if="!!dataSlideDiscount.length"
      :name="'slide-discount'"
      :breakpoints="breakpoints"
      :data.sync="dataSlideDiscount"
      :option-more="{}"
    >
      <template slot-scope="slotProps">
        <div class="slide-block">
          <div class="slide-block__content">
            <div class="slide-block__content--title">
              <p v-if="getLocalize === 'vi'">{{ slotProps.item.title_vi }}</p>
              <p v-else>{{ slotProps.item.title_en }}</p>
            </div>
            <div class="slide-block__content--image">
              <img :src="IMAGE_URL + `/${slotProps.item.imagePath}`" alt="" />
            </div>
          </div>
        </div>
      </template>
    </g2j-swiper-component>
  </div>
</template>

<script>
import {
  IMAGE_URL,
  CACHE_VERSION,
} from "~jsDefinePath/general";
import { ASSETS_SERVICE_URL } from "~jsDefinePath/general";
export default {
  props: {
    dataSlide: {
      type: [Array, Object],
      default: "[]",
    },
    isAgoda: {
      type: Boolean
    }
  },
  components: {
    "g2j-swiper-component": () =>
      import(
        "~jsPartialPath/global/component/g2j-swiper-base/Go2JoySwiper.vue"
      ),
    "g2j-image": () =>
      import("~jsPartialPath/global/component/g2j-img/Go2JoyImages.vue"),
  },
  data() {
    return {
      ASSETS_SERVICE_URL,
      IMAGE_URL,
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
      dataSlideDiscount: [
        {
          title_en:
            "Enjoy the top certified room quality in Go2Choice hotel network, with the smooth bedsheet & towels from Everon, following our strict hygiene standards",
          title_vi:
            "Trải nghiệm bộ chăn - ga - gối - khăn Everon chất lượng cao, được đảm bảo khử khuẩn và thay mới liên tục đạt chuẩn Go2Choice",
          imagePath: "g2choice.png?v="+CACHE_VERSION,
        },
        {
          title_en:
            "Go2Joy kindly provide you a set of Shampoo & Shower Gel from Korea Brand when check-in here.",
          title_vi:
            "Go2Joy tặng ngay bộ chăm sóc cá nhân từ Hàn Quốc khi nhận phòng tại khách sạn",
          imagePath: "amenity.png",
        },
      ],
      signIn: false,
    };
  },
  created() {
      this.checkDisplayData(
      this.dataHotelDetail.isGo2Choice,
      this.dataHotelDetail.amenityPack,
      this.agoda
    );
  },
  computed: {
    dataHotelDetail() {
      return this.dataSlide;
    },
    getLocalize() {
      return this._i18n.locale;
    },
  },

  methods: {
    checkDisplayData(isGo2Choice, amenityPack,agoda) {
      if (isGo2Choice || (isGo2Choice && amenityPack)) {
        this.dataSlideDiscount = this.dataSlideDiscount.slice(0, 1);
      } else if (amenityPack === true) {
        this.dataSlideDiscount = this.dataSlideDiscount.slice(1, 2);
      } else {
        this.dataSlideDiscount = [];
      }
      return this.dataSlideDiscount;
    },
  },
};
</script>
