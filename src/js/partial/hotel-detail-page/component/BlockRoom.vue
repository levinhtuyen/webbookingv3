<template>
  <div
    v-if="!isEmpty(hotelItemInfo)"
    :key="hotelItemInfo.sn"
    class="block-room"
    :class="{ 'swiper-slide': isSlide }"
  >
    <router-link :to="!HAS_MOITAI ? hotelItemPath[language] : ''">
      <div class="block-room-inner">
        <div
          class="block-room__img-col"
          :title="htmlDecode(hotelItemInfo.name)"
        >
          <g2j-image
            :url-img="`${ASSETS_SERVICE_URL}/${hotelItemInfo.imagePath}`"
          ></g2j-image>
        </div>
        <!-- .block-room__img-col -->

        <div class="block-room__info-col">
          <!-- <div class="block-room__title" v-if="hotelItemInfo.mode == 2">
          <div
            class="block-room__title-field"
            :title="htmlDecode(hotelItemInfo.name)"
          >
            {{ htmlDecode(hotelItemInfo.name) }}
          </div>

          <div class="block-room__title-book-now">
            <span
              class="block-room__title-book-now__label"
              @click.prevent="setActiveFlashSale()"
              ><i class="fas fa-calendar-check"></i
              ><span> {{ $t("hotel_detail.block_room_book_now") }}</span></span
            >
          </div>
        </div> -->
          <div class="block-room__title">
            <div
              class="block-room__title-field"
              :title="htmlDecode(hotelItemInfo.name)"
            >
              {{ htmlDecode(hotelItemInfo.name) }}
            </div>

            <div class="block-room__title-book-now">
              <span
                @click.prevent="
                  setActive(),
                    G2JDablenaTracking(DABLE_TRACKING.TRACKING_VIEW_BOOK_NOW)
                "
                class="block-room__title-book-now__label"
                ><i class="fas fa-calendar-check"></i
                ><span>
                  {{ $t("hotel_detail.block_room_book_now") }}</span
                ></span
              >
            </div>
          </div>
          <!-- .block-room__title-field -->

          <div class="block-room__sale-off-info-row">
            <template v-if="hotelItemInfo.mode == 2">
              <LabelRemainingDay :type="'flash-sale'">
                <template slot="title">
                  <span> {{ $t("hotel_detail.flash_sale") }} </span>
                </template>
                <template slot="content">
                  <span
                    v-if="hotelItemInfo.numOfRoom - hotelItemInfo.bookCount > 0"
                    :title="
                      _getRemain(
                        hotelItemInfo.numOfRoom - hotelItemInfo.bookCount,
                        'room'
                      )
                    "
                  >
                    {{
                      _getRemain(
                        hotelItemInfo.numOfRoom - hotelItemInfo.bookCount,
                        "room"
                      )
                    }}
                  </span>
                  <span v-else>{{
                    $t("hotel_detail.sold_out")
                  }}</span> </template
                >d
              </LabelRemainingDay>
            </template>
            <LabelRoom
              :data-item="hotelItemInfo"
              class="block-room__sale-off-info-row--label-room"
              v-else
            />
          </div>
          <div
            class="block-room__sale-off-info-row"
            v-if="hotelItemInfo.displayRule.daysLeft > 0"
          >
            <LabelRemainingDay :type="'special'">
              <template slot="title">
                <span>{{ $t("hotel_detail.direct_discount") }} </span>
              </template>
              <template slot="content">
                <span
                  :title="_getRemain(hotelItemInfo.displayRule.daysLeft, 'day')"
                >
                  {{ _getRemain(hotelItemInfo.displayRule.daysLeft, "day") }}
                </span>
              </template>
            </LabelRemainingDay>
          </div>
          <!-- .block-room__sale-off-info-row -->

          <div class="block-room__price-field">
            <div class="block-room__price-type-label">
              <div v-html="getHourly(hotelItemInfo)"></div>
              <div v-html="getOvernight(hotelItemInfo)"></div>
              <div v-html="getDaily(hotelItemInfo)"></div>
            </div>
          </div>
          <!-- .block-room__price-field -->
        </div>
        <!-- .block-room__info-col -->
      </div>
      <!-- .block-room-inner -->
    </router-link>
    <!-- .hot-deal-swiper-slide-inner -->
  </div>
  <!-- .block-room -->
</template>

<script>
  import { _, he, mapState, mapGetters } from "~jsLibPath/lib-manager";
  import {
    IMAGE_URL,
    CACHE_VERSION,
    ASSETS_SERVICE_URL,
    HAS_MOITAI,
  } from "~jsDefinePath/general";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/page-info-module";
  import { formatToThounsands } from "~jsHelperPath/util/General";
  import LabelRoom from "~jsPartialPath/global/component/label-room/LabelRoom.vue";
  import LabelRemainingDay from "../../global/component/label-remaining-day/LabelRemainingDay.vue";
  import { _getRemain } from "~jsPath/helper/util/getLabel";
  import {
    getPaymentPagePath,
    getHotelDetailPagePath,
    getRoomDetailPagePath,
  } from "~jsPath/helper/util/HandleUrl";
  import { MODULE_NAME as HOTEL_INFO_MODULE_NAME } from "~jsPath/base/vuex/modules/hotel-info-module";
  import {
    G2JDablenaTracking,
  } from "~jsHelperPath/util/HandleTracking";
  import {
    DABLE_TRACKING,
  } from "~jsDefinePath/tracking-define";
  export default {
    components: {
      LabelRoom,
      LabelRemainingDay,
    },

    props: {
      hotelItemInfo: {
        default: {},
        type: Object,
      },
      isSlide: {
        default: false,
        type: Boolean,
      },

      lazyloadClass: {
        default: "lazyload",
        type: String,
      },
      key: String,
    },

    data() {
      return {
        IMAGE_URL,
        CACHE_VERSION,
        ASSETS_SERVICE_URL,
        DABLE_TRACKING,
        priceTypeLabelWithLanguage: {
          firstHoursOrigin: {
            vi: "giờ đầu",
            en: "first hour",
          },
          overnightOrigin: {
            vi: "Qua đêm",
            en: "Overnight",
          },
          oneDayOrigin: {
            vi: "Ngày",
            en: "Overnight",
          },
        }, // priceTypeLabelWithLanguage
      };
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),
      ...mapGetters(PAGE_INFO_MODULE_NAME, {
        hasUserInfo: "hasUserInfo",
      }),
      ...mapGetters(HOTEL_INFO_MODULE_NAME, {
        hotelInfo: "hotelInfo",
      }),

      hotelItemPath() {
        if (!this.$route.query.hotelSn) {
          return getHotelDetailPagePath(
            {
              hotelName: this.hotelItemInfo.name,
            },
            {
              hotelSn: this.hotelItemInfo.sn,
            }
          );
        }

        return getRoomDetailPagePath(
          {
            hotelName: this.$route.params.hotelName,
            roomName: GetSlug(this.hotelItemInfo.name),
          },
          {
            hotelSn: this.$route.query.hotelSn,
            roomSn: this.hotelItemInfo.sn,
            modeRoom: this.hotelItemInfo.mode,
            mode: this.hotelItemInfo.mode,
          }
        );
      }, // hotelItemPath
    },

    created() {},

    methods: {
      isEmpty: _.isEmpty,
      _getRemain,
      G2JDablenaTracking,
      // goPayment(hotelItemInfo), setActive()
      hotelItemPath() {
        if (!this.$route.query.hotelSn) {
          return getHotelDetailPagePath(
            {
              hotelName: this.hotelItemInfo.name,
            },
            {
              hotelSn: this.hotelItemInfo.sn,
            }
          );
        }
        return getRoomDetailPagePath(
          {
            hotelName: this.$route.params.hotelName,
            roomName: GetSlug(this.hotelItemInfo.name),
          },
          {
            hotelSn: this.$route.query.hotelSn,
            roomSn: this.hotelItemInfo.sn,
            modeRoom: this.hotelItemInfo.mode,
            mode: this.hotelItemInfo.mode,
          }
        );
      }, // hotelItemPath
      setActive() {
        if (
          this.hotelItemInfo.mode == 2 &&
          this.hotelItemInfo.numOfRoom - this.hotelItemInfo.bookCount == 0
        ) {
          this.$emit("soldOutRoom");
          return;
        }
        if (this.hotelItemInfo.mode == 2 && !HAS_MOITAI) {
          this.$emit("activeRoomFlashSale");
          return;
        }
        this.$emit("activeRoom", this.hotelItemInfo);
      },
      goPayment(data) {
        let hotelSn = this.hotelInfo.sn;
        let roomSn = data.sn;
        let mode = data.mode;
        let hotelName = this.hotelItemInfo.name;
        let roomName = data.name;
        const paymentPagePath = getPaymentPagePath(
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

        this.$router.push(paymentPagePath[this.language]);

        // let params = { ...this.$route.params }
        // params.roomSn = data.sn
        // this.$router.push({ name: 'payment', params, query: { mode: data.mode } })
      },
      htmlDecode(content) {
        if (!content) {
          return "";
        }

        return he.decode(content);
      }, // htmlDecode()

      formatToThounsands,

      goOn(data) {
        // if (!this.$route.params.hotelSn) {
        //   // console.log('is duplicate');
        //   this.$router.push({
        //     name: "hotel-detail-page",
        //     params: { hotelSn: data.sn },
        //   });
        //   return;
        // }
        // this.$router.push({
        //   name: "room-detail-page",
        //   params: { roomSn: data.sn, modeRoom: data.mode },
        //   query: { mode: data.mode },
        // });

      },

      getHourly(dataDisplayRule) {
        const displayRuleRoom = dataDisplayRule.displayRule;
        if (displayRuleRoom.firstHoursOrigin > 0) {
          if (
            displayRuleRoom.firstHoursOrigin <= displayRuleRoom.priceFirstHours
          ) {
            return (
              `${dataDisplayRule.firstHours}` +
              ` ${this.$t(
                "hotel_detail.block_room_hourly"
              )} <span class="block-room__current-price-label">` +
              `${formatToThounsands(displayRuleRoom.priceFirstHours)}` +
              `<sup>đ</sup></span>`
            );
          } else {
            return (
              `${dataDisplayRule.firstHours}` +
              ` ${this.$t(
                "hotel_detail.block_room_hourly"
              )} <span class="block-room__origin-price-label">` +
              `${formatToThounsands(displayRuleRoom.firstHoursOrigin)}` +
              `<sup>đ</sup></span> <span class="block-room__current-price-label">` +
              `${formatToThounsands(displayRuleRoom.priceFirstHours)}` +
              `<sup>đ</sup></span>`
            );
          }
        } else {
          return "";
        }
      }, // getHourly
      getOvernight(dataDisplayRule) {
        const displayRuleRoom = dataDisplayRule.displayRule;
        if (displayRuleRoom.overnightOrigin > 0) {
          if (displayRuleRoom.overnightOrigin <= displayRuleRoom.priceOvernight) {
            return (
              ` ${this.$t(
                "hotel_detail.block_room_overnight"
              )} <span class="block-room__current-price-label">` +
              `${formatToThounsands(displayRuleRoom.priceOvernight)}` +
              `<sup>đ</sup></span>`
            );
          } else {
            return (
              ` ${this.$t(
                "hotel_detail.block_room_overnight"
              )} <span class="block-room__origin-price-label">` +
              `${formatToThounsands(displayRuleRoom.overnightOrigin)}` +
              `<sup>đ</sup></span> <span class="block-room__current-price-label">` +
              `${formatToThounsands(displayRuleRoom.priceOvernight)}` +
              `<sup>đ</sup></span>`
            );
          }
        } else {
          return "";
        }
      }, // getOvernight
      getDaily(dataDisplayRule) {
        const displayRuleRoom = dataDisplayRule.displayRule;
        if (
          displayRuleRoom.oneDayOrigin > 0 &&
          (displayRuleRoom.overnightOrigin < 1 ||
            displayRuleRoom.firstHoursOrigin < 1)
        ) {
          if (displayRuleRoom.oneDayOrigin <= displayRuleRoom.priceOneDay) {
            return (
              ` ${this.$t(
                "hotel_detail.block_room_daily"
              )} <span class="block-room__current-price-label"> ` +
              ` ${formatToThounsands(displayRuleRoom.priceOneDay)}` +
              `<sup>đ</sup></span>`
            );
          } else {
            return (
              ` ${this.$t(
                "hotel_detail.block_room_daily"
              )} <span class="block-room__origin-price-label"> ` +
              ` ${formatToThounsands(displayRuleRoom.oneDayOrigin)}` +
              `<sup>đ</sup></span> <span class="block-room__current-price-label">` +
              ` ${formatToThounsands(displayRuleRoom.priceOneDay)}` +
              `<sup>đ</sup></span>`
            );
          }
        } else {
          return "";
        }
      }, // getDaily
    },
  };
</script>
