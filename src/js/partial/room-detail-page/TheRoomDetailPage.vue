<template>
  <div v-if="hasRoomData" class="room-detail container">
    <div class="room-detail__slide">
      <slider-banner
        v-if="!!bannerRoom.length"
        height="400px"
        :data-banner.sync="bannerRoom"
      />
    </div>

    <div class="room-detail__head">
      <div class="room-detail__head--back-button">
        <!-- <back-button /> -->
      </div>
      <div class="room-detail__head--hotel-name">
        {{ hotelName }}
      </div>
    </div>

    <div class="room-detail__title-room">
      {{ roomData.name }}
    </div>

    <div
      v-if="roomData && roomData.displayRule"
      class="room-detail__container-label"
    >
      <label-room
        v-if="roomMode == 1"
        :data-item="roomData"
        class="room-detail__container-label--promotion"
      />

      <template
        v-if="roomData.discount == true && roomData.displayRule.daysLeft > 0"
      >
        <label-remaining-day :type="'special'">
          <template slot="title">
            <span> {{ $t("room.special_offer") }} </span>
          </template>
          <template slot="content">
            <span :title="_getRemain(roomData.displayRule.daysLeft, 'day')">
              {{ _getRemain(roomData.displayRule.daysLeft, "day") }}
            </span>
          </template>
        </label-remaining-day>
      </template>

      <template v-if="roomMode == 2 && roomData && roomData.displayRule">
        <label-remaining-day :type="'flash-sale'">
          <template slot="title">
            <span> {{ $t("room.flash_sale") }} </span>
          </template>
          <template slot="content">
            <span v-if="roomData.numOfRoom - roomData.bookCount > 0">
              <!-- Còn lại {{ (roomData.numOfRoom - roomData.bookCount) }} ngày -->
              {{ _getRemain(roomData.numOfRoom - roomData.bookCount, "room") }}
            </span>
            <span v-else>{{ $t("room.sold_out") }}</span>
          </template>
        </label-remaining-day>
      </template>
    </div>

    <div class="room-detail__information">
      <div
        v-if="roomMode == 1 && roomData && roomData.displayRule"
        class="room-detail__information--time"
      >
        <div
          v-if="roomData.displayRule.priceFirstHours != 0"
          class="first-hours"
        >
          <span class="title-label-room-detail"
            >{{ hotelData.firstHours }} {{ $t("room.firsthour") }}:</span
          >
          <p>
            <span
              v-if="
                roomData.displayRule.firstHoursOrigin !=
                roomData.displayRule.priceFirstHours
              "
            >
              <del
                v-html="$formatPrice(roomData.displayRule.firstHoursOrigin)"
              />
            </span>
            <span v-html="$formatPrice(roomData.displayRule.priceFirstHours)" />
          </p>
        </div>
        <!-- end frist hour -->

        <div
          v-if="roomData.displayRule.additionalOrigin != 0"
          class="next-hours"
        >
          <span class="title-label-room-detail"
            >{{ $t("room.additional") }}:</span
          >
          <p>
            <span
              v-if="
                roomData.displayRule.additionalOrigin !=
                roomData.displayRule.priceAdditionalHours
              "
            >
              <del
                v-html="$formatPrice(roomData.displayRule.additionalOrigin)"
              />
            </span>
            <span
              v-html="$formatPrice(roomData.displayRule.priceAdditionalHours)"
            />
          </p>
        </div>
        <!-- end next hour  -->

        <div v-if="roomData.displayRule.priceOvernight != 0" class="overnight">
          <span class="title-label-room-detail"
            >{{ $t("room.overnight") }}:</span
          >
          <p>
            <span
              v-if="
                roomData.displayRule.overnightOrigin !=
                roomData.displayRule.priceOvernight
              "
            >
              <del
                v-if="
                  roomData.displayRule.overnightOrigin >
                  roomData.displayRule.priceOvernight
                "
                v-html="$formatPrice(roomData.displayRule.overnightOrigin)"
              />
            </span>
            <span v-html="$formatPrice(roomData.displayRule.priceOvernight)" />
          </p>
        </div>
        <!-- end overnight -->

        <div v-if="roomData.displayRule.priceOneDay != 0" class="daily">
          <span class="title-label-room-detail"> {{ $t("room.daily") }}:</span>
          <p class="">
            <span
              v-if="
                roomData.displayRule.overnightOrigin !=
                roomData.displayRule.priceOvernight
              "
            >
              <del
                v-if="
                  roomData.displayRule.oneDayOrigin >
                  roomData.displayRule.priceOneDay
                "
                v-html="$formatPrice(roomData.displayRule.oneDayOrigin)"
              />
            </span>
            <span v-html="$formatPrice(roomData.displayRule.priceOneDay)" />
          </p>
        </div>
        <!-- end daily -->
      </div>

      <div
        v-if="roomMode == 2 && roomData && roomData.displayRule"
        class="room-detail__information--time"
      >
        <div v-if="roomData.displayRule.priceOvernight != 0" class="overnight">
          <span class="title-label-room-detail">
            {{ $t("room.overnight") }}
          </span>
          <p class="">
            <del
              v-if="
                roomData.displayRule.priceOvernight !=
                roomData.displayRule.overnightOrigin
              "
              v-html="$formatPrice(roomData.displayRule.overnightOrigin)"
            />
            <span
              class="font-size-title-price"
              v-html="$formatPrice(roomData.displayRule.priceOvernight)"
            />
          </p>
        </div>
      </div>

      <div class="room-detail__information--info">
        <div class="square">
          <span class="title-label-room-detail">
            {{ $t("room.square") }} :</span
          >
          {{ roomData.square ? roomData.square : $t("room.updating") }}
        </div>
        <div class="bed">
          <span class="title-label-room-detail"> {{ $t("room.bed") }} : </span>
          {{
            roomData.bedType == 1
              ? $t("room.bed_type.single")
              : roomData.bedType == 2
              ? $t("room.bed_type.double")
              : roomData.bedType == 3
              ? $t("room.bed_type.twin")
              : roomData.bedType == 4
              ? $t("room.bed_type.triple")
              : roomData.bedType == 5
              ? $t("room.bed_type.2_double")
              : $t("room.updating")
          }}
        </div>
        <div
          v-if="
            roomData &&
            roomData.roomViewList != null &&
            roomData.roomViewList.length != 0
          "
          class="view"
        >
          <span class="title-label-room-detail"> {{ $t("room.view") }} : </span>
          <span v-for="(view, index) in roomData.roomViewList" :key="index">
            <span>{{ view ? view.name : "" }}</span>
          </span>
        </div>
        <div v-else class="view">
          <span class="title-label-room-detail">{{ $t("room.view") }}: </span>
          <span> {{ $t("room.updating") }}</span>
        </div>
      </div>
    </div>

    <div class="room-detail__description">
      <span class="title-label-room-detail">
        {{ $t("room.description") }}:
      </span>

      {{
        roomData.memo && roomData.memo != "null"
          ? roomData.memo
          : $t("room.updating")
      }}
    </div>

    <div v-if="listFacilities.length" class="room-detail__facilities">
      <span class="title-label-room-detail">
        {{ $t("room.facilities") }}:
      </span>
      <div class="room-detail__facilities--content-img">
        <div v-for="(v, k) in listFacilities" :key="k" class="container-item">
          <g2j-image
            :url-img="`${ASSETS_SERVICE_URL}/${v.imagePath}`"
            :alt-img="v.originalName || null"
          />
          <div class="container-item__name">
            {{ language == "vi" ? v.name : v.nameEn }}
          </div>
        </div>
      </div>
    </div>

    <!-- TODO: không phải flashsale thì thoải mái, nếu là flashsale thì phải có cáp phép của bộ, và phòng phải còn  -->
    <div
      v-if="
        $route.query.mode == 1 ||
        ($route.query.mode == 2 &&
          HAS_MOITAI &&
          roomData.numOfRoom - roomData.bookCount != 0)
      "
      class="room-detail__footer"
    >
      <!-- <BookNow v-if="hotelInfo.paymentMethod==3" :title="$t('room.book_now')"   @bookNow="openDirectAppModal()" /> -->
      <router-link
        v-slot="{ href, navigate }"
        :to="linkToPayment()[language]"
        tag="div"
        class="room-detail__footer--container-btn"
      >
        <a
          :href="href"
          @click="
            navigate, G2JDablenaTracking(DABLE_TRACKING.TRACKING_VIEW_BOOK_NOW)
          "
        >
          <BookNow :title="$t('room.book_now')" />
        </a>
      </router-link>
    </div>
    <TheG2JDirectAppNoticeModal
      :is-show="isShowDirectAppNoticeModal"
      @onCloseModal="closeDirectAppNoticeModal"
    />
  </div>
</template>

<script>
import { _, mapGetters, mapActions, mapState } from "~jsLibPath/lib-manager";
import {
  IMAGE_URL,
  CACHE_VERSION,
  HAS_MOITAI,
  ASSETS_SERVICE_URL,
} from "~jsDefinePath/general";
import { getPaymentPagePath } from "~jsPath/helper/util/HandleUrl";
import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/page-info-module";
import { MODULE_NAME as HOTEL_INFO_MODULE_NAME } from "~jsPath/base/vuex/modules/hotel-info-module";
import { _getRemain } from "~jsPath/helper/util/getLabel";
import { G2JDablenaTracking } from "~jsHelperPath/util/HandleTracking";
import { DABLE_TRACKING } from "~jsDefinePath/tracking-define";
import TheG2JDirectAppNoticeModal from "~jsPartialPath/global/component/g2j-direct-app-notice-modal/TheG2JDirectAppNoticeModal.vue";

export default {
  components: {
    "slider-banner": () =>
      import("~jsPartialPath/global/component/slider-banner/SliderBanner.vue"),
    SliderFacilitiesHotelDetail: () =>
      import(
        "~jsPartialPath/hotel-detail-page/component/SliderFacilitiesHotelDetail.vue"
      ),
    BookNow: () =>
      import("~jsPartialPath/global/component/book-now/BookNow.vue"),
    "label-room": () =>
      import("~jsPartialPath/global/component/label-room/LabelRoom.vue"),
    "label-remaining-day": () =>
      import(
        "~jsPartialPath/global/component/label-remaining-day/LabelRemainingDay.vue"
      ),
      TheG2JDirectAppNoticeModal
  },
  data() {
    return {
      IMAGE_URL,
      CACHE_VERSION,
      ASSETS_SERVICE_URL,
      listFacilities: [],
      pageSize: 10,
      id: 1,
      hotelName: "",
      hotelData: [],
      roomData: [],
      hotelSn: this.$route.query.hotelSn,
      roomMode: this.$route.query.mode,
      roomSn: this.$route.query.roomSn,
      bannerRoom: [],
      HAS_MOITAI,
      DABLE_TRACKING,
      isShowDirectAppNoticeModal: false,

    };
  },
  created() {
    EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
    this.getDataHotelDetail();
  },
  computed: {
    ...mapState(PAGE_INFO_MODULE_NAME, {
      language: "language",
    }),

    ...mapGetters(HOTEL_INFO_MODULE_NAME, {
      hotelInfo: "hotelInfo",
    }),

    hasRoomData() {
      return !_.isEmpty(this.roomData);
    }, // hasRoomData
  },
  methods: {
    ...mapActions(HOTEL_INFO_MODULE_NAME, {
      getHotelInfo: "getHotelInfo",
      setRoomActive: "setRoomActive",
    }),
    G2JDablenaTracking,
    _getRemain,
    openDirectAppModal(){
      this.isShowDirectAppNoticeModal = true
    },
    closeDirectAppNoticeModal() {
      this.isShowDirectAppNoticeModal = false;
    },
    linkToPayment() {
      let hotelSn = this.hotelSn;
      let roomSn = this.roomSn;
      let mode = this.roomMode;
      let hotelName = this.hotelInfo.name;
      let roomName = this.roomData.name;
      this.setRoomActive(this.roomData);

      return getPaymentPagePath(
        {
          hotelName,
          roomName,
        },
        {
          hotelSn,
          roomSn,
          mode,
        }
      );
    },

    async getDataHotelDetail() {
      let id = this.$route.query.hotelSn;
      let query = {
        limit: this.pageSize,
        page: "1",
        hotelSn: id,
      };
      if (_.isEmpty(this.hotelInfo) || this.hotelInfo.sn != id) {
        await this.getHotelInfo({ sn: id, query });
      }
      this.initData(this.hotelInfo);
    },
    initData(data) {
      this.hotelData = data;
      this.hotelName = data.name;
      this.listFacilities = data.facilityFormList;
      if (this.roomMode == 2) {
        this.roomData = data.flashSaleList.find((x) => x.sn == this.roomSn);

        this.bannerRoom = this.roomData.roomTypeImages;
      }
      if (this.roomMode == 1) {
        this.roomData = data.roomTypeList.find((x) => x.sn == this.roomSn);

        this.bannerRoom = this.roomData?.roomTypeImageList;
      }
      if ((this.roomMode != 1 && this.roomMode != 2) || !this.roomData) {
        this.$router.go(-1);
      }
    },
  },
};
</script>

<style src="./room-detail-page-style.css"></style>
