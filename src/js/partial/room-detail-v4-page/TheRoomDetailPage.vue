<template>
  <div>
    <div
      v-if="!isAllFacilities"
      class="room-detail"
    >
      <div
        v-if="$route.query.roomTypeSn"
        class="id"
      >
        {{ $route.query.roomTypeSn }}
      </div> <!-- NOTE - id class for google bot -->
      <TheGo2joySliderImage
        :listImageSlide="listImageSlide"
        :custom-class-name="'room-detail-banner-swiper-container'"
      />

      <div class="container">
        <div
          v-if="roomtypeDetail.origin === 1"
          class="room-detail__heading"
        >
          <p
            class="text-g2j text-uppercase room-detail__heading--timeline"
            v-if="bookingType == 1"
          >{{ $t('room.hourly') }}</p>
          <p
            class="text-g2j text-uppercase room-detail__heading--timeline"
            v-else-if="bookingType == 2"
          >{{ $t('room.overnight') }}</p>
          <p
            class="text-g2j text-uppercase room-detail__heading--timeline"
            v-else-if="bookingType == 3"
          >{{ $t('room.daily') }}</p>
          <div class="room-detail__heading--icon">
            <p
              v-for="(typeDisplay, index) in displayRule.typeDisplayText"
              :key="index"
            >
              <span v-show="language === 'en'">{{ typeDisplay.split("|")[1] }}</span>
              <span v-show="language !== 'en'">{{ typeDisplay.split("|")[0] }}</span>
            </p>
          </div>
        </div>

        <div
          v-else
          class="room-detail__heading"
        >
          <p class="text-g2j text-uppercase">{{ $t('room.daily') }}</p>
        </div>

        <!-- basic info -->
        <div class="room-detail__basic mt-mb-1em">
          <h2>{{ roomtypeDetail.name }}</h2>
          <p v-if="displayRule && displayRule.priceTypeText">
            <span v-show="language === 'en'">{{ displayRule.priceTypeText.split("|")[1] }}</span>
            <span v-show="language !== 'en'">{{ displayRule.priceTypeText.split("|")[0] }}</span>
          </p>
          <div
            v-if="displayRule && displayRule.discountPrice"
            class="room-detail__basic--flex"
          >
            <p>
              <span class="text-price">{{ displayRule.discountPrice > 0 ? $formatPrice(displayRule.discountPrice) : $formatPrice(displayRule.originPrice) }}</span>
              <span
                v-if="displayRule.originPrice > 0 && displayRule.originPrice > displayRule.discountPrice"
                class="strikethrough"
              ><s>{{ $formatPrice(displayRule.originPrice) }}</s></span>
            </p>

            <p
              v-if="roomtypeDetail.origin !== 1"
              class="icon-only-left text-uppercase"
            >
              <span v-show="language === 'en'">Only {{ displayRule.roomsLeft }} left</span>
              <span v-show="language !== 'en'">Chỉ còn {{ displayRule.roomsLeft }} phòng</span>
            </p>
          </div>

          <div class="room-detail__basic--table mt-mb-1em">
            <table>
              <tr>
                <td>
                  <p>{{ $t('room.check_in') }}</p>
                  <div class="datetime">
                    <p class="bold">{{ startTime }}</p>
                    <p class="bold">{{ formatDate(checkInDatePlan) }}</p>
                  </div>
                </td>
                <td>
                  <p>{{ $t('room.check_out') }}</p>
                  <div class="datetime">
                    <p class="bold">{{ endTime }}</p>
                    <p class="bold">{{ formatDate(endDate) }}</p>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <!-- end basic info -->

        <!-- room condition -->
        <div
          v-if="roomtypeDetail.bedSize || roomtypeDetail.bedType || roomtypeDetail.square || !isEmpty(roomtypeDetail.roomViewList)"
          class="room-detail__condition border-top"
        >
          <h2 class="mt-mb-1em">{{ $t('room.room_condition') }}</h2>
          <div class="row">
            <div
              v-if="roomtypeDetail.bedSize || roomtypeDetail.bedType"
              class="block"
            >
              <img
                :src="`${IMAGE_URL}/svg/shape.svg`"
                width="100%"
                height="100%"
                alt="Icon Fire"
              >
              <p v-if="roomtypeDetail.origin !== 2">
                <span v-if="roomtypeDetail.bedSize === 0">N/A</span>
                <span v-else-if="roomtypeDetail.bedSize === 1">{{ $t('room.single_bed') }}</span>
                <span v-else-if="roomtypeDetail.bedSize === 2">{{ $t('room.double_bed') }}</span>
                <span v-else-if="roomtypeDetail.bedSize === 3">{{ $t('room.twin_bed') }}</span>
                <span v-else-if="roomtypeDetail.bedSize === 4">{{ $t('room.triple_bed') }}</span>
                <span v-else-if="roomtypeDetail.bedSize === 5">{{ $t('room.2_double_bed') }}</span>
              </p>
              <p v-else>
                <span v-show="language === 'en'">{{ roomtypeDetail.bedType.split("|")[1] }}</span>
                <span v-show="language !== 'en'">{{ roomtypeDetail.bedType.split("|")[0] }}</span>
              </p>

            </div>
            <div
              v-if="roomtypeDetail.square"
              class="block"
            >
              <img
                :src="`${IMAGE_URL}/svg/room-condition.svg`"
                width="100%"
                height="100%"
                alt="Icon Fire"
              >
              <p>{{ roomtypeDetail.square }} m<sup>2</sup></p>
            </div>
            <div
              v-if="roomtypeDetail.roomViewList && roomtypeDetail.roomViewList[0]"
              class="block"
            >
              <img
                :src="`${IMAGE_URL}/svg/city-view.svg`"
                width="100%"
                height="100%"
                alt="Icon Fire"
              >
              <p v-show="language === 'en'">{{ roomtypeDetail.roomViewList && roomtypeDetail.roomViewList[0] ? roomtypeDetail.roomViewList[0].nameEn : $t('room.updating') }}</p>
              <p v-show="language !== 'en'">{{ roomtypeDetail.roomViewList && roomtypeDetail.roomViewList[0] ? roomtypeDetail.roomViewList[0].name : $t('room.updating') }}</p>
            </div>
          </div>
        </div>
        <!-- end room condition -->

        <!-- room benefits -->
        <div
          v-if="roomBenefitList && roomBenefitList.length > 0"
          class="room-detail__facilities border-top"
        >
          <div class="room-detail__facilities--heading">
            <h2 class="mt-mb-1em">{{ $t('room.benefits') }}</h2>
          </div>

          <div class="row">
            <div
              class="block"
              v-for="(item, index) in roomBenefitList"
              :key="index"
            >
              <p v-show="language !== 'en'">{{ item.name }}</p>
              <p v-show="language === 'en'">{{ item.nameEn }}</p>
            </div>
          </div>
        </div>
        <!-- end room benefits -->

        <!-- room description -->
        <div
          v-if="roomtypeDetail.origin != 2 && roomtypeDetail.memo && roomtypeDetail.memo != null"
          class="room-detail__description border-top"
        >
          <h2 class="mt-mb-1em">{{ $t('room.room_description') }}</h2>
          <div class="row">
            <p v-html="roomtypeDetail.memo"></p>
          </div>
        </div>

        <div
          v-if="roomtypeDetail.origin == 2 && roomtypeDetail.roomDescription"
          class="room-detail__facilities border-top"
        >
          <div class="room-detail__facilities--heading">
            <h2 class="mt-mb-1em">{{ $t('room.room_description') }}</h2>
          </div>
          <div class="row">
            <div class="block">
              <p class="bold-600">{{ $t('room.max_occupancy_per_room') }}</p>
              <p>{{ roomtypeDetail.roomDescription.maxOccupancyPerRoom }} {{ $t('room.guests') }}</p>
            </div>

            <div class="block">
              <p class="bold-600">{{ $t('room.max_extra_beds') }}</p>
              <p>{{ roomtypeDetail.roomDescription.maxExtraBeds }}</p>
            </div>

            <div class="block">
              <p class="bold-600">{{ $t('room.no_of_room') }}</p>
              <p>{{ roomtypeDetail.roomDescription.noOfRoom }}</p>
            </div>

            <div class="block">
              <p class="bold-600">{{ $t('room.max_infant_in_room') }}</p>
              <p>{{ roomtypeDetail.roomDescription.maxInfantInRoom }}</p>
            </div>

            <div
              class="block"
              v-if="roomtypeDetail.roomDescription.sharedBathroom"
            >
              <p class="bold-600">{{ $t('room.shared_Bathroom') }}</p>
            </div>
          </div>
        </div>
        <!-- end room description -->

        <!-- room price -->
        <div class="room-detail__facilities border-top">
          <div class="room-detail__facilities--heading">
            <h2 class="mt-mb-1em">{{ $t('room.original_price') }}</h2>
          </div>

          <div class="row">
            <div
              v-if="roomtypeDetail.firstHoursOrigin"
              class="block"
              v-show="language === 'en'"
            >
              <div class="bold-600">
                {{ roomtypeDetail.firstHours }} first hour(s) price:
              </div>
              <div>{{ $formatPrice(roomtypeDetail.firstHoursOrigin) }}</div>
            </div>

            <div
              v-if="roomtypeDetail.firstHoursOrigin"
              class="block"
              v-show="language !== 'en'"
            >
              <div class="bold-600">
                Giá {{ roomtypeDetail.firstHours }} giờ đầu:
              </div>
              <div>{{ $formatPrice(roomtypeDetail.firstHoursOrigin) }}</div>
            </div>

            <div
              v-if="roomtypeDetail.additionalOrigin"
              class="block"
              v-show="language === 'en'"
            >
              <div class="bold-600">
                {{ roomtypeDetail.additionalHours }} plus hour(s) price:
              </div>
              <div>{{ $formatPrice(roomtypeDetail.additionalOrigin) }}</div>
            </div>

            <div
              v-if="roomtypeDetail.additionalOrigin"
              class="block"
              v-show="language !== 'en'"
            >
              <div class="bold-600">
                Giá {{ roomtypeDetail.additionalHours }} giờ thêm:
              </div>
              <div>{{ $formatPrice(roomtypeDetail.additionalOrigin) }}</div>
            </div>

            <div
              v-if="roomtypeDetail.overnightOrigin"
              class="block"
            >
              <div class="bold-600">
                {{ $t('room.overnight_price') }}:
              </div>
              <div>{{ $formatPrice(roomtypeDetail.overnightOrigin) }}</div>
            </div>

            <div
              v-if="roomtypeDetail.oneDayOrigin"
              class="block"
            >
              <div class="bold-600">
                {{ $t('room.1_day_price') }}:
              </div>
              <div>{{ $formatPrice(roomtypeDetail.oneDayOrigin) }}</div>
            </div>
          </div>
          <p
            v-if="roomtypeDetail.origin == 2"
            class="note-price"
          >{{ $t('room.price_inclusive_of_tax_and_service_fees') }}</p>
        </div>
        <!-- end room price -->

        <!-- special gift -->
        <div
          class="room-detail__gift border-top"
          v-if="roomtypeDetail.hasGift"
        >
          <h2 class="mt-mb-1em">{{ $t('room.special_gift') }}</h2>
          <div class="row">
            <div class="mr-1em image-special-gift">
              <img
                :src="`${ASSETS_SERVICE_URL}/${roomtypeDetail.giftImages}`"
                width="100%"
                height="100%"
                :alt="roomtypeDetail.giftDescription || null"
              >
            </div>
            <p class="sub-content">
              {{ roomtypeDetail.giftDescription }}
              <!-- {{ $t('room.sub_content_special_gift') }} -->
            </p>
          </div>
        </div>
        <!-- end special gift -->

        <!-- facilities -->
        <div
          class="room-detail__facilities border-top"
          v-if="listWebFacilities && listWebFacilities.length > 0"
        >
          <div class="room-detail__facilities--heading">
            <h2 class="mt-mb-1em">{{ $t('room.facilities') }}</h2>
            <a
              :hidden="isHidenFaci"
              @click="onDirectAllFacilities"
            >
              {{ $t('room.view_all') }}
              <i class="fas fa-arrow-right"></i>
            </a>
          </div>

          <p>{{ $t('room.sub_facilities') }}</p>

          <div
            v-show="!isHidenFaci"
            class="row"
          >
            <div
              class="block"
              v-for="(item, index) in listMobileFacilities"
              :key="index"
            >
              <div>
                {{ language == "vi" ? item.name : item.nameEn }}
              </div>
              <g2j-image
                :url-img="`${ASSETS_SERVICE_URL}/${item.imagePath}`"
                :alt-img="item.originalName || null"
              />
            </div>
          </div>

          <div
            v-show="isHidenFaci"
            class="row"
          >
            <div
              class="block"
              v-for="(item, index) in facilityAll"
              :key="index"
            >
              <div>
                {{ language == "vi" ? item.name : item.nameEn }}
              </div>
              <g2j-image
                :url-img="`${ASSETS_SERVICE_URL}/${item.imagePath}`"
                :alt-img="item.originalName || null"
              />
            </div>
          </div>
        </div>
        <!-- end facilities -->

        <!-- button booking now -->
        <div class="room-detail__button">
          <button
            v-if="HAS_MOITAI"
            class="g2j-button-book-now"
            type="submit"
            :disabled="ui.isSubmiting"
            @click="onSubmit(),onFbqTracking()"
          >{{ $t('room.booking_now') }}</button>
        </div>
        <!-- fill agoda out modal -->
        <modal-agoda-fill-out
          key="modal-agoda-fill-out"
          ref="fill-out-modal"
          :filter.sync="filter"
          :isTypeInfo="ui.isTypeInfo"
          @resetModal="resetModal"
          @apply="applyModalFillOutAgoda"
        />

        <!-- pay attention modal -->
        <modal-pay-attention
          key="pay-attention-modal"
          ref="pay-attention-modal"
          :filter.sync="filter"
          :isTypeInfo="ui.isTypeInfo"
          :dateTimeFree="dateTimeFree"
          @resetModal="resetModal"
          @apply="applyModalAttention"
        />
        <!-- end pay attention modal -->

        <!-- phone modal -->
        <modal-phone
          key="modal-phone"
          ref="filter-modal"
          :error-list="errorList"
          :filter.sync="filter"
          @resetModal="resetModal"
          @apply="applyModalPhone"
        />
        <!-- end phone modal -->

        <!-- overlap modal -->
        <modal-overlap
          key="modal-overlap"
          ref="overlap-modal"
          :error-list="errorList"
          :timer="timer"
          :filter.sync="filter"
          @resetModal="resetModal"
          @apply="applyModalOverlap"
          @resendCode="resendCode"
        />
        <!-- end overlap modal -->

        <!-- require-pay modal -->
        <modal-require-pay
          key="modal-require-pay"
          ref="require-pay-modal"
          :error-list="errorList"
          :timer="timer"
          :filter.sync="filter"
          @resetModal="resetModal"
          @apply="applyModalRequirePay"
          @resendCode="resendCode"
        />
        <!-- end require-pay modal -->
      </div>
    </div>

    <!-- start page all facilities -->
    <all-facility
      :listFacilities="facilityAll"
      @onBack="onBack"
      v-else
    />
    <!-- end page all facilities -->

  </div>

</template>

<script>
  // import Go2joyFlagSection from "~jsPartialPath/global/component/go2joy-flags/Go2joyFlagsSection.vue";

  import { _, mapGetters, mapState } from "~jsLibPath/lib-manager";
  import {
    IMAGE_URL,
    CACHE_VERSION,
    HAS_MOITAI,
    ASSETS_SERVICE_URL,
    getToken,
    BOT_INFO,
    BASE_URL,
  } from "~jsDefinePath/general";

  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/page-info-module";
  import { MODULE_NAME as HOTEL_INFO_MODULE_NAME } from "~jsPath/base/vuex/modules/hotel-info-module";
  import { _getRemain } from "~jsPath/helper/util/getLabel";
  import { G2JDablenaTracking } from "~jsHelperPath/util/HandleTracking";
  import { DABLE_TRACKING } from "~jsDefinePath/tracking-define";
  import TheG2JDirectAppNoticeModal from "~jsPartialPath/global/component/g2j-direct-app-notice-modal/TheG2JDirectAppNoticeModal.vue";
  import AllFacility from "./component/AllFacility.vue";
  import ModalPhone from "./component/ModalPhone.vue";
  import ModalOverlap from "./component/ModalOverlap.vue";
  import ModalRequirePay from "./component/ModalRequirePay.vue";
  import ModalPayAttention from "./component/ModalPayAttention.vue";
  import ModalAgodaFillOut from "./component/ModalAgodaFillOut.vue";
  import TheGo2joySliderImage from "~jsPartialPath/global/component/go2joy-slider/TheGo2joySliderImage.vue";
  import { G2JRouter } from "~jsHelperPath/util/HandleRouterGlobal";
  import { ROUTER_NAME } from "~jsBasePath/vue-router/router-define";
  // resize
  import {
    onResizeEvent,
    removeOnResizeEvent,
  } from "~jsHelperPath/util/PrivateEventCustom";
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import { G2JFbqTracking } from "~jsHelperPath/util/HandleTracking";

  export default {
    components: {
      TheG2JDirectAppNoticeModal,
      AllFacility,
      ModalPhone,
      ModalOverlap,
      ModalRequirePay,
      ModalPayAttention,
      ModalAgodaFillOut,
      TheGo2joySliderImage,
      // Go2joyFlagSection,
    },
    data() {
      return {
        BASE_URL,
        IMAGE_URL,
        CACHE_VERSION,
        ASSETS_SERVICE_URL,
        HAS_MOITAI,
        DABLE_TRACKING,

        // main
        isAllFacilities: false,
        isHidenFaci: true,
        TimeoutHandler: new TimeoutHandler(),
        timeoutResize: null,
        curBreakPoint: null,

        // room type
        roomtypeDetail: [],
        displayRule: [],
        listMobileFacilities: [],
        listWebFacilities: [],
        facilityAll: [],
        roomBenefitList: [],

        roomTypeSn: this.$route.query.roomTypeSn,
        bookingType: this.$route.query.bookingType
          ? this.$route.query.bookingType
          : "", // 0: all, 1: hourly, 2: overnight, 3: daily,

        errorList: [],
        listImageSlide: [],
        roomTypeList: [],

        checkInDatePlan: this.$route.query.checkInDatePlan
          ? this.$route.query.checkInDatePlan
          : "",
        endDate: this.$route.query.endDate ? this.$route.query.endDate : "",
        startTime: this.$route.query.startTime,
        endTime: this.$route.query.endTime,
        paymentMethod: this.$route.query.paymentMethod
          ? this.$route.query.paymentMethod
          : "",
        roomMode:
          this.$route.query.mode == 1 || this.$route.query.mode == 2
            ? this.$route.query.mode
            : 1,
        hotelSn: this.$route.query.hotelSn,

        ui: {
          isSubmiting: false,
          isTypeInfo: 0, // 0: isNotSignedIn, 1: isSignedIn, 2: isOverLap
        },
        dateTimeFree: "",
      };
    },

    created() {
      const self = this;

      // handle format time
      if (Number(self.startTime.split(":")[0]) < 10) {
        self.startTime =
          "0" +
          Number(self.startTime.split(":")[0]) +
          ":" +
          self.startTime.split(":")[1];
      }
      if (Number(self.endTime.split(":")[0]) < 10) {
        self.endTime =
          "0" +
          Number(self.endTime.split(":")[0]) +
          ":" +
          self.endTime.split(":")[1];
      }

      EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
      self.getRoomV4Info();
      self.openModalFacilities();
      self.getBreakPointCurrent();

      // NOTE - handle responsive behavior
      self.timeoutResize = self.TimeoutHandler.init(
        "resizeHandle",
        150,
        function () {
          self.curBreakPoint = self.getBreakPointCurrent();
        }
      );
      onResizeEvent(window, self.timeoutResize.handle);
    },
    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),

      ...mapGetters(HOTEL_INFO_MODULE_NAME, {
        hotelInfo: "hotelInfo",
        hotelInfoV4: "hotelInfoV4",
      }),
    },

    beforeDestroy() {
      const self = this;
      self.timeoutResize.destroy();
      removeOnResizeEvent(window, self.timeoutResize.handle);
    },
    methods: {
      isEmpty: _.isEmpty,
      onDirectAllFacilities() {
        this.isAllFacilities = true;
      }, // onDirectAllFacilities

      onBack() {
        this.isAllFacilities = false;
      }, // onBack

      async getRoomV4Info() {
        let self = this;
        EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        apiCaller({
          metaUrl: AJAX_URL.hotel_v4.getRoomTypeDetail,
          data: {
            roomTypeSn: this.roomTypeSn,
            bookingType: this.bookingType,
            startTime: this.startTime,
            endTime: this.endTime,
            startDate: this.checkInDatePlan,
            endDate: this.endDate,
            mode: this.roomMode,
          },
          method: "GET",
          dataType: "json",
          error(err) {
            self.errorList = err.response?.data.error || [];
            EventBus.emit("REDIRECT-404-PAGE");
          },
          success(objResponse) {
            if (
              _.isEmpty(objResponse) ||
              objResponse.error ||
              _.isEmpty(objResponse.data)
            ) {
              self.errorList = objResponse.error;
              EventBus.emit("REDIRECT-404-PAGE");
              return;
            }
            let data = objResponse?.data ?? [];
            self.roomtypeDetail = data;

            // NOTE - Setup meta tag
            const roomName = GenerateTitleCase(self.roomtypeDetail.name);
            const hotelName = GenerateTitleCase(self.roomtypeDetail.hotelName);

            self.$metaTag.setup({
              title: hotelName + " - " + roomName,
              description: "Phòng " + roomName + " của khách sạn " + hotelName,
              "og:type": "website",
              "og:title": hotelName + " - " + roomName,
              "og:description":
                "Phòng " + roomName + " của khách sạn " + hotelName,
              "og:url": BASE_URL + window.location.pathname,
              "og:site_name": "Go2Joy",
              "og:image": "",
              "og:image:width": "1200",
              "og:image:height": "628",
            });
            //-- end setup meta tag

            self.displayRule = data ? data.displayRule : [];
            self.listWebFacilities = data ? data.roomFacilityList : [];

            const _tmpListImageSlide = data ? data.roomTypeImageList : [];

            if (_tmpListImageSlide && _tmpListImageSlide.length > 0) {
              _tmpListImageSlide.forEach((item) => {
                if (item.type != 2) {
                  self.listImageSlide.push(item);
                }
              });
            }
            self.roomBenefitList = data ? data.roomBenefitList : [];

            if (self.listWebFacilities && self.listWebFacilities.length > 6) {
              self.listMobileFacilities = self.listWebFacilities.slice(0, 6);
            } else {
              self.listMobileFacilities = self.listWebFacilities;
            }
          },
          complete() {
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          },
        });
      }, // getRoomV4Info

      async openModalFacilities() {
        if (!BOT_INFO.isBot) {
          const self = this;
          apiCaller({
            metaUrl: AJAX_URL.hotel_v4.getFacilityList,
            data: {
              hotelSn: self.$route.query.hotelSn,
              roomTypeSn: self.roomTypeSn,
            },
            method: "GET",
            headers: {
              Authorization: getToken(),
            },
            dataType: "json",
            error() {},
            success(objResponse) {
              if (_.isEmpty(objResponse) || objResponse.error) {
                return;
              }
              self.facilityAll = objResponse?.data ?? [];
            },
            complete() {
              // setTimeout(() => {
              //   self.$refs["facility-modal"].showModal();
              // }, 500);
            },
          });
        }
      }, // openModalFacilities

      // NOTE - get break point resize
      getBreakPointCurrent() {
        if (window.matchMedia("(min-width: 540px)").matches) {
          this.isHidenFaci = true;
          return "540px";
        }
        this.isHidenFaci = false;
        return "280px";
      }, // getBreakPointCurrent()

      // main
      G2JDablenaTracking,
      _getRemain,

      onSubmit() {
        const token = localStorage.getItem("token");
        // sẽ làm cho g2j & agoda
        if (this.roomtypeDetail.origin === 1) {
          // khách sạn Go2joy
          if (!token) {
            if (this.roomMode == 2) {
              this.$refs["require-pay-modal"].showModal();
            } else {
              // show popup as guest
              this.$refs["filter-modal"].showModal();
            }
          } else {
            if (this.roomMode == 2) {
              this.$refs["require-pay-modal"].showModal();
            } else {
              // direct to make a reservation
              this.checkOverlapBooking();
            }
          }
        } else {
          // Khách sạn Agoda
          if (!token) {
            this.ui.isTypeInfo = 0;
            this.$refs["fill-out-modal"].showModal();
          } else {
            // direct to make a reservation
            this.checkOverlapBooking();
          }
        }
      }, // onSubmit
      onFbqTracking() {
        G2JFbqTracking("InitiateCheckout", {
          content_type: "hotel",
          content_ids: this.hotelSn,
          checkin_date: this.checkInDatePlan,
          checkout_date: this.endDate,
          city: this.hotelInfoV4 ? this.hotelInfoV4.provinceName : "HCM",
          num_adults: 1,
          num_children: 0,
          value: this.displayRule.discountPrice,
          currency: "VND",
        });
      },
      applyModalPhone(data) {
        let paymentInfo = {
          roomName: this.roomtypeDetail.name,
          hotelName: this.roomtypeDetail.hotelName,
          origin: this.roomtypeDetail.origin,
          hotelSn: this.hotelSn,
          roomTypeSn: this.roomTypeSn,
          type: this.bookingType,
          checkInDatePlan: this.checkInDatePlan,
          endDate: this.endDate,
          startTime: this.startTime,
          endTime: this.endTime,
          mode: this.roomMode,
          redeemValue: 0, // chưa có
          mileagePoint: 0, // chưa có
          paymentMethod: this.paymentMethod,
          mobile: data.mobile,
          countryCode: data.countryCode,
          productList: [],
          guestInformation: null,
        };
        sessionStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));
        // localStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));
        G2JRouter.replace({ name: "payment-v4-page", data });
      }, // applyModalPhone

      checkOverlapBooking() {
        let self = this;
        this.ui.isSubmiting = true;

        apiCaller({
          metaUrl: AJAX_URL.hotel_v4.checkOverlapBooking,
          data: {
            hotelSn: Number(this.hotelSn),
            roomTypeSn: Number(this.roomTypeSn),
            type: Number(this.bookingType),
            checkInDatePlan: this.checkInDatePlan,
            endDate: this.endDate,
            startTime: this.startTime,
            endTime: this.endTime,
            mode: Number(this.roomMode),
          },
          headers: {
            Authorization: getToken(),
          },
          method: "POST",
          dataType: "json",
          contentType: "application/json; charset=utf-8",
          error(err) {
            self.errorList = err.response?.data.error || [];
          },
          success(objResponse) {
            if (_.isEmpty(objResponse) || objResponse.error) {
              self.errorList = objResponse.error;
              return;
            }

            let data = objResponse?.data ?? [];
            if (data) {
              if (self.roomtypeDetail.origin !== 2) {
                self.$refs["overlap-modal"].showModal();
              } else {
                self.ui.isTypeInfo = 2; // type: overlap agoda
                self.$refs["fill-out-modal"].showModal();
              }
            } else {
              // direct reservation
              let paymentInfo = {
                roomName: self.roomtypeDetail.name,
                hotelName: self.roomtypeDetail.hotelName,
                origin: self.roomtypeDetail.origin,
                hotelSn: self.hotelSn,
                roomTypeSn: self.roomTypeSn,
                type: self.bookingType,
                checkInDatePlan: self.checkInDatePlan,
                endDate: self.endDate,
                startTime: self.startTime,
                endTime: self.endTime,
                mode: self.roomMode,
                redeemValue: 0, // chưa có
                mileagePoint: 0, // chưa có
                paymentMethod: self.paymentMethod,
                mobile: "", // chưa có
                countryCode: "", // chưa có
                productList: [],
                guestInformation: null,
              };
              sessionStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));
              // localStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));

              if (self.roomtypeDetail.origin === 2) {
                self.ui.isTypeInfo = 1; // 0: isNotSignedIn, 1: isSignedIn, 2: isOverLap
                self.$refs["fill-out-modal"].showModal();
              } else {
                G2JRouter.replace({ name: ROUTER_NAME["payment-v4-page"] });
              }
            }
          },
          complete() {
            self.ui.isSubmiting = false;
          },
        });
      }, // checkOverlapBooking

      applyModalOverlap(data) {
        let paymentInfo = {
          roomName: this.roomtypeDetail.name,
          hotelName: this.roomtypeDetail.hotelName,
          origin: this.roomtypeDetail.origin,
          hotelSn: this.hotelSn,
          roomTypeSn: this.roomTypeSn,
          type: this.bookingType,
          checkInDatePlan: this.checkInDatePlan,
          endDate: this.endDate,
          startTime: this.startTime,
          endTime: this.endTime,
          mode: this.roomMode,
          redeemValue: 0, // chưa có
          mileagePoint: 0, // chưa có
          paymentMethod: this.paymentMethod,
          mobile: data.mobile,
          countryCode: data.countryCode,
          productList: [],
          guestInformation: null,
        };
        sessionStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));
        // localStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));
        G2JRouter.replace({ name: "payment-v4-page", data });
      }, // applyModalOverlap

      applyModalFillOutAgoda(data) {
        let paymentInfo = {
          roomName: this.roomtypeDetail.name,
          hotelName: this.roomtypeDetail.hotelName,
          origin: this.roomtypeDetail.origin,
          hotelSn: this.hotelSn,
          roomTypeSn: this.roomTypeSn,
          type: this.bookingType,
          checkInDatePlan: this.checkInDatePlan,
          endDate: this.endDate,
          startTime: this.startTime,
          endTime: this.endTime,
          mode: this.roomMode,
          redeemValue: 0, // chưa có
          mileagePoint: 0, // chưa có
          paymentMethod: this.paymentMethod,
          mobile: data.mobile,
          countryCode: data.countryCode,
          productList: [],

          guestInformation: {
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender,
            countryCode: data.countryCode,
            mobile: data.mobile,
            email: data.email,
            age: data.age,
          },
        };
        sessionStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));
        localStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));

        if (this.ui.isTypeInfo !== 2) {
          // check time tại đây để hiển thị loại popup attention
          if (
            this.roomtypeDetail &&
            this.roomtypeDetail.cancelDescription &&
            this.roomtypeDetail.cancelDescription.freeCancellation
          ) {
            let timeFree =
              this.roomtypeDetail.cancelDescription.freeCancellation +
              " 23:59:59";
            let timeFreeFormat = new Date(timeFree);
            let dateNowFormat = new Date();

            if (timeFreeFormat > dateNowFormat) {
              // popup cancel free
              this.ui.isTypeInfo = 2;
              this.dateTimeFree = timeFree;

              this.$refs["fill-out-modal"].closeModal();
              setTimeout(() => {
                this.$refs["pay-attention-modal"].showModal();
              }, 500);
            } else {
              // popup cancel fee
              this.ui.isTypeInfo = 1;
              this.$refs["fill-out-modal"].closeModal();
              setTimeout(() => {
                this.$refs["pay-attention-modal"].showModal();
              }, 500);
            }
          }
        } else {
          G2JRouter.replace({ name: "payment-v4-page" });
        }
      }, // applyModalFillOutAgoda

      applyModalAttention() {
        G2JRouter.replace({ name: "payment-v4-page" });
      }, // applyModalAttention

      applyModalRequirePay() {
        const token = localStorage.getItem("token");
        this.$refs["require-pay-modal"].closeModal();
        if (!token) {
          // show popup as guest
          setTimeout(() => {
            this.$refs["filter-modal"].showModal();
          }, 500);
        } else {
          this.checkOverlapBooking();
        }
      }, //applyModalRequirePay

      formatDate(date) {
        let CDate = dayjs(date).format("DD/MM/YYYY");
        return CDate;
      }, // formatDate()
    },
  };
</script>

<style src="./room-detail-page-style.css"></style>
