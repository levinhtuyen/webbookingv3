<template>
  <modal
    ref="filter-modal"
    :visible.sync="visible"
    class="filter-modal"
  >
    <template slot="header">
      <div class="filter-modal__header">
        <h1>{{ $t("category.sort_filter") }}</h1>
      </div>
    </template>
    <template slot="body">
      <div class="filter-modal__body">
        <div class="filter-modal__body--sort">
          <label class="title">
            {{ $t("category.sort") }}
          </label>
          <div class="filter-modal-group-radio">
            <label
              v-for="(v, k) in sortData"
              :key="k"
              class="filter-modal-group-radio__container"
            >
              <input
                v-model="checked"
                checked="checked"
                type="radio"
                name="radio"
                :value="v.value"
                @click="selectSort"
              >
              {{ v.name }}
              <span class="checkmark" />
            </label>
          </div>
        </div>
        <!-- Category -->
        <div class="filter-modal__body--category">
          <label class="title">
            {{ $t("category.category") }}
          </label>
          <div class="filter-modal-group-btn-category">
            <button
              :class="{ active: activeCouple == true }"
              @click="(activeCouple = !activeCouple), (activeTravel = false)"
            >
              {{ $t("category.couple_hotel") }}
            </button>
            <button
              :class="{ active: activeTravel == true }"
              @click="(activeTravel = !activeTravel), (activeCouple = false)"
            >
              {{ $t("category.travel_hotel") }}
            </button>
          </div>
        </div>
        <!-- end Category -->

        <div class="filter-modal__body--features">
          <label class="title">
            {{ $t("category.features") }}
          </label>
          <div class="filter-modal-features-list">
            <div
              v-for="(v, k) in featuresData"
              :key="k"
              class="filter-modal-features-list__item"
              :class="{ active: v.active }"
              @click="v.active = !v.active"
            >
              <div class="filter-modal-features-list__item--img">
                <img :src="IMAGE_URL + `/icon/filter/${v.img}`">
              </div>
              <p class="style-name-check">
                {{ v.name }}
              </p>
            </div>
          </div>
        </div>
        <div class="filter-modal__body--price-range">
          <label class="title">
            {{ $t("category.price_range") }}
          </label>
          <div class="price-range-container">
            <input
              v-model="minVal"
              type="range"
              :min="min"
              :max="max"
              :step="step"
              class="thumb thumb--left"
              @input="changeMin"
            >
            <input
              v-model="maxVal"
              type="range"
              :min="min"
              :max="max"
              :step="step"
              class="thumb thumb--right"
              @input="changeMax()"
            >
            <div class="price-range__slider">
              <div class="price-range__slider--track" />
              <div class="price-range__slider--range" />
              <div class="price-range__slider--left-value">
                {{ formatVND(minVal) }}
              </div>
              <div class="price-range__slider--right-value">
                {{ formatVND(maxVal) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <div class="filter-modal__footer">
        <!-- <button
          class="filter-modal__footer--btn-close"
          @click="visible = false"
        >Close</button> -->
        <button
          class="filter-modal__footer--btn-apply"
          @click="applyFilter()"
        >
          {{ $t("category.apply") }}
        </button>
      </div>
    </template>
  </modal>
</template>

<script>
import { IMAGE_URL } from "~jsDefinePath/general";
import { FIREBASE_TRACKING } from "~jsDefinePath/tracking-define";
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
  COMMIT_KEY as PAGE_INFO_COMMIT_KEY,
} from "~jsPath/base/vuex/modules/page-info-module";
import { mapState } from "~jsLibPath/lib-manager";
import { G2JFirebase } from "~jsHelperPath/util/HandleTracking";

export default {
  components: {
    modal: () =>
      import("~jsPartialPath/global/component/modal/ModalComponent.vue"),
  },
  props: {
    filter: [Object, Array],
    // visible: {
    //   type: Boolean,
    // },
  },
  data() {
    return {
      checked: "",
      visible: false,
      activeCouple: false,
      activeTravel: false,
      IMAGE_URL,
      featuresData: [
        {
          id: 1,
          name: this.$t("category.speacial"),
          img: "s.png",
          active: false,
        },
        {
          id: 2,
          name: this.$t("category.promotion"),
          img: "p.png",
          active: false,
        },
        {
          id: 3,
          name: this.$t("category.new_hotel"),
          img: "n.png",
          active: false,
        },
        {
          id: 4,
          name: this.$t("category.hot_hotel"),
          img: "h.png",
          active: false,
        },
        {
          id: 5,
          name: this.$t("category.stamp"),
          img: "stamp.png",
          active: false,
        },
        {
          id: 6,
          name: this.$t("category.360_photo"),
          img: "360.png",
          active: false,
        },
        {
          id: 7,
          name: this.$t("category.amenity_pack"),
          img: "amenity.png",
          active: false,
        },
      ],
      min: 0,
      max: 3000000,
      step: 50000,
      minVal: 0,
      maxVal: 3000000,
    };
  },
  watch: {
    visible(val) {
      this.$emit("update:visible", val);
    },
    filter: {
      handler(val) {
        this.activeCouple = val.loveHotel;
        this.activeTravel = val.travelHotel;
        this.featuresData[0].active = val.directDiscount;
        this.featuresData[1].active = val.hasPromotion;
        this.featuresData[2].active = val.newHotel;
        this.featuresData[3].active = val.hotHotel;
        this.featuresData[4].active = val.stamp;
        this.featuresData[5].active = val.exifImage;
        this.featuresData[6].active = val.amenityPackHotel;
        this.minVal = val.minPrice;
        this.maxVal = val.maxPrice;
      },
      deep: true,
      immediate: true,
    },
    language() {
      this.featuresData.map((el, i) => (el.name = this.nameFeatures[i].name));
    },
  },
  methods: {
    applyFilter() {
      // NOTE - tracking
      G2JFirebase.analytics().logEvent(FIREBASE_TRACKING.TRACKING_FILTER);
      // NOTE - filter
      let filter = {
        sort: this.checked,
        loveHotel: this.activeCouple,
        travelHotel: this.activeTravel,
        directDiscount: this.featuresData[0].active,
        hasPromotion: this.featuresData[1].active,
        newHotel: this.featuresData[2].active,
        hotHotel: this.featuresData[3].active,
        stamp: this.featuresData[4].active,
        exifImage: this.featuresData[5].active,
        amenityPackHotel: this.featuresData[6].active,
        minPrice: this.minVal,
        maxPrice: this.maxVal,
      };
      this.$emit("update:filter", filter);
      this.$emit("apply", filter);
    },
    selectSort(evt) {
      let value = evt.target.value;
      console.log("value :>> ", value);
      if (value == this.checked) {
        this.checked = "";
      }
    },

    changeMin(evt) {
      if (Number(this.minVal) >= Number(this.maxVal) - Number(this.step)) {
        this.minVal = Number(this.maxVal) - Number(this.step);
      }
    },
    changeMax(evt) {
      if (Number(this.maxVal) <= Number(this.minVal) + Number(this.step)) {
        this.maxVal = Number(this.minVal) + Number(this.step);
      }
    },
    formatVND(v) {
      return `${("" + v).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VNĐ `;
    },
    showModal() {
      this.visible = true;
    },
    closeModal() {
      this.visible = false;
    },
  },
  computed: {
    ...mapState(PAGE_INFO_MODULE_NAME, {
      language: "language",
    }),
    sortData() {
      return [
        { name: this.$t("category.price_increasing"), value: "1" },
        { name: this.$t("category.price_descreasing"), value: "2" },
        { name: this.$t("category.rating_review"), value: "3" },
      ];
    },
    nameFeatures() {
      return [
        { id: 1, name: this.$t("category.special_offer") },
        { id: 2, name: this.$t("category.promotion") },
        { id: 3, name: this.$t("category.new_hotel") },
        { id: 4, name: this.$t("category.hot_hotel") },
        { id: 5, name: this.$t("category.stamp") },
        { id: 6, name: this.$t("category.360_photo") },
        { id: 7, name: this.$t("category.amenity_pack") },
      ];
    },
  },
  mounted() {},
};
</script>
