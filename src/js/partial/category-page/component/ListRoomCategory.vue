<template>
  <div class="list-room-category">
    <div
      v-for="(v, k) in listData"
      :key="k"
      class="list-room-category__container-item"
    >
      <div
        class="list-room-category__container-item--cover lazyload"
        @click="goDetailHotel(v)"
      >
        <g2j-image
          :url-img="urlImg(v.imagePath)"
          :alt-img="v.name"
        />

        <!-- TODO: label FlashSale -->
        <div
          v-if="getDisplayFlashSale(v) && v.flashSale == true"
          class="label-flash-sale"
        >
          <span v-if="v.flashSale == true">
            &nbsp; <i class="fas fa-bolt" />&nbsp;
            {{ $t('hotel_info.flash_sale') }} |
            <span v-if="v.numOfRoom > 0">
              {{ getNumOfRoom(v.numOfRoom) }}
            </span>
            <span v-else> {{ $t('hotel_info.sold_out') }}
            </span>
          </span>
        </div>
        <!-- end FlashSale -->

        <!-- TODO: label Hotel hot -->
        <div
          v-if="v.hotHotel2"
          class="label-hotel-hot"
        >
          <span>&nbsp;<i class="fab fa-gripfire" /> &nbsp; {{ $t('category.hot_hotel') }} </span>
        </div>
        <!-- end Hotel hot -->

        <!-- TODO: label Hotel new -->
        <div
          v-if="v.newHotel2"
          class="label-hotel-new"
        >
          <span>&nbsp;<i class="fas fa-building" /> &nbsp; {{ $t('category.new_hotel') }} </span>
        </div>
        <!-- end Hotel new -->
      </div>
      <div class="list-room-category__container-item--content">
        <div class="container-title-img">
          <div
            class="hotel-name"
            :title="v.name"
          >
            {{ v.name ? v.name : "" }}
          </div>
          <div class="img-go2choice" v-if="v.isGo2Choice">
            <g2j-image
            :url-img="`${IMAGE_URL}/g2choice-rectangular-tag.jpg?v=${ CACHE_VERSION }`"
            ></g2j-image>
          </div>
        </div>

        <div class="star-rate">
          <p>
            <i class="fas fa-star" />
            <span class="Rectangle-1158-title"> {{ v.averageMark }} ({{ v.totalReview }}) </span>
          </p>
        </div>
        <div class="map">
          <a>
            <i class="fas fa-map" />
            <span> {{ v.districtName }} </span>
          </a>
        </div>

        <!-- TODO: show label room -->
        <div class="label-room">
          <!-- <button @click="clickTest(v)">test</button> -->
          <label-room :data-item="(v)" />
        </div>
        <!-- end show label -->
        <!-- TODO: show  -->
        <div class="list-room-category-label-remaining-day">
          <label-remaining-day
            v-if="v.displayRule.daysLeft != 0 || v.discount == true"
            :type="'special'"
          >
            <template slot="title">
              <span> {{ $t('category.special_offer') }}</span>
            </template>
            <template slot="content">
              <span :title="getNumOfDay(v.displayRule.daysLeft)">
                {{ _getRemain(v.displayRule.daysLeft,'day') }}
              </span>
            </template>
          </label-remaining-day>
        </div>
        <div
          v-if="v.displayRule"
          class="container-price"
        >
          <!-- TODO: show first hours -->
          <div v-if="v.displayRule.priceFirstHours > 0">
            <span class="container-price__title-first-hours">
              {{ v.firstHours }} {{ $t('category.first_hours') }}
            </span>

            <span
              v-if="v.displayRule.firstHoursOrigin > v.displayRule.priceFirstHours"
              class="container-price__first-hours-origin"
            >
              {{ $formatlowestPrice(v.displayRule.firstHoursOrigin) }}
            </span>

            <span
              class="container-price__first-hours"
              v-html="$formatPrice(v.displayRule.priceFirstHours)"
            >
              <!-- {{$formatPrice(v.displayRule.priceFirstHours)}} -->
            </span>
          </div>
          <!-- end first time -->

          <!-- TODO: show overnight  -->
          <div v-if="v.displayRule.priceOvernight > 0">
            <span class="container-price__title-overnight">
              {{ $t('category.overnight') }}
            </span>

            <span v-if="v.displayRule.overnightOrigin > v.displayRule.priceOvernight">
              <span
                class="container-price__overnight-origin"
                v-html="$formatlowestPrice(v.displayRule.overnightOrigin)"
              />
            </span>

            <span
              class=" container-price__overnight"
              v-html="$formatPrice(v.displayRule.priceOvernight)"
            />
          </div>
          <!-- end overnight -->

          <!-- TODO: show daily -->
          <div v-if="v.displayRule.oneDayOrigin > 0 && (v.displayRule.overnightOrigin < 1 || v.displayRule.firstHoursOrigin < 1)">
            <span class="container-price__title-daily">
              {{ $t('category.daily') }}
            </span>
            <span v-if="v.displayRule.oneDayOrigin > v.displayRule.priceOneDay">
              <span
                class="container-price__daily-origin"
                v-html="$formatlowestPrice(v.displayRule.oneDayOrigin)"
              />
            </span>
            <span
              class="container-price__daily"
              v-html="$formatPrice(v.displayRule.priceOneDay)"
            />
          </div>
          <!-- end daily -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { _getTypeLabel, _getRemain } from "~jsPath/helper/util/getLabel";

  import {
    IMAGE_URL,
    CACHE_VERSION,
    ASSETS_SERVICE_URL,
  } from "~jsDefinePath/general";

  export default {
    components: {
      "label-room": () =>
        import("~jsPartialPath/global/component/label-room/LabelRoom.vue"),
      "label-remaining-day": () =>
        import(
          "~jsPartialPath/global/component/label-remaining-day/LabelRemainingDay.vue"
        ),
    },
    props: {
      data: {
        type: Array,
      },
    },
    data() {
      return {
        IMAGE_URL,
        CACHE_VERSION,
        ASSETS_SERVICE_URL,
      };
    },
    computed: {
      listData() {
        return this.data;
      },
    },
    mounted() {
      // console.log("this.listData :>> ", this.listData);
    },
    methods: {
      _getRemain,
      clickTest(v) {
        console.log(" _getTypeLabel(v) :>> ", _getTypeLabel(v));
      },
      getNumOfRoom(numRoom) {
        if (localStorage["g2j-translate-language"] == "en") {
          return `${numRoom} room(s) left`;
        } else {
          return `Còn lại ${numRoom} phòng`;
        }
      },
      getNumOfDay(numRoom) {
        if (localStorage["g2j-translate-language"] == "en") {
          return `${numRoom} day(s) left`;
        } else {
          return `Còn lại ${numRoom} ngày`;
        }
      },

      getDisplayFlashSale(flashSaleRoomTypeForm) {
        if (flashSaleRoomTypeForm == null) {
          flashSaleRoomTypeForm = false;
          return flashSaleRoomTypeForm;
        } else {
          flashSaleRoomTypeForm = true;
          return flashSaleRoomTypeForm;
        }
      },
      goDetailHotel(data) {
        let id = data.sn;
        this.$router.push({
          name: "hotel-detail-page",
          params: { hotelName: GetSlug(data.name) },
          query: { hotelSn: id },
        });
      },
      urlImg(url) {
        return `https://go2joy.s3-ap-southeast-1.amazonaws.com/` + url;
      },
    },
  };
</script>
