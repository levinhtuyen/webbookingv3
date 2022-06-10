<template>
  <div>
    <section class="room-type-list-section">
      <div
        v-if="hasHotelList"
        class="room-type-list-block"
      >
        <div class="room-type-list-wrap">
          <LightSquareRoomCard
            ref="LightSquareRoomCard"
            v-for="itemInfo, idx in itemList"
            :key="idx"
            :is-disable-invalid="false"
            :time-between="timeBetween"
            :info="{
              ...itemInfo,
              order: (idx + 1),
              total: itemList.length,
            }"
            :hotelInfoV4="hotelInfoV4"
            :assetsServiceUrl="assetsServiceUrl"
            :isDefaultOvernightSpecial="isDefaultOvernightSpecial"
            :isOvernightSpecial="isOvernightSpecial"
            @bookOvernightSpecial="val => $emit('bookOvernightSpecial',val)"
            @mounted="onCardMounted"
            @openCancellationPolicyModal="onOpenCancellationPolicyModal"
            @openChangeTypeBookingModal="onOpenChangeTypeBookingModal"
          />
        </div> <!-- .room-type-list-wrap -->
      </div> <!-- .room-type-list-block -->

      <div
        v-else
        class="room-type-list-empty-block"
      >
        <div class="empty-content">
          <img
            :src="IMAGE_URL + '/svg/no-room.svg'"
            :alt="noResultWithLocale.main[language]"
            class="hotel-list-empty-img"
            width="121"
            height="135"
          >
          <div
            class="main-empty-label"
            v-html="noResultWithLocale.main[language]"
          >
          </div> <!-- .main-empty-label -->

          <div
            class="sub-empty-label"
            v-html="noResultWithLocale.sub[language]"
          >
          </div> <!-- .sub-empty-label -->
        </div> <!-- .empty-content -->
      </div> <!-- .room-type-list-empty-block -->
    </section> <!-- .room-type-list-section -->

    <G2jBasicModal
      v-if="isShowCancellationPolicyModal"
      :custom-modal-class="'room-type-list-modal'"
      :disable-window-scroll="true"
      @close="onCloseCancellationPolicyModal"
    >
      <template #head-title>
        {{ $t('common.cancellation_policy') }}
      </template> <!-- slot: #body-content -->

      <template #body-content>
        <div class="modal-content-segment">
          {{ cancellationPolicyWithLocale[language] }}
        </div> <!-- .modal-content-segment -->
      </template> <!-- slot: #body-content -->

      <template #body-control>
        <div
          class="modal-control-group"
          @click="isShowCancellationPolicyModal = false"
        >
          <button class="control-btn --accept --uppercase">
            {{ $t('common.ok') }}
          </button>
        </div> <!-- .modal-control-group -->
      </template> <!-- slot: #body-control -->
    </G2jBasicModal>

    <G2jBasicModal
      v-if="isShowChangeTypeBookingModal"
      :custom-modal-class="'room-type-list-modal'"
      :disable-window-scroll="true"
      @close="onCloseChangeBookingTypeModal"
    >
      <template #head-title>
        {{ $t('common.change_booking_type') }}
      </template> <!-- slot: #body-content -->

      <template #body-content>
        <div class="modal-content-segment">
          {{ changeTypeBookingContentWithLocale[language] }}
        </div> <!-- .modal-content-segment -->
      </template> <!-- slot: #body-content -->

      <template #body-control>
        <div
          class="modal-control-group"
          @click="isShowCancellationPolicyModal = false"
        >
          <button
            class="control-btn --close"
            @click="onCloseChangeBookingTypeModal"
          >
            {{ $t('common.cancel') }}
          </button>

          <button
            class="control-btn --accept"
            @click="redirectToRoomTypeDetailWithDailyBookingType"
          >
            {{ $t('common.continue') }}
          </button>
        </div> <!-- .modal-control-group -->
      </template> <!-- slot: #body-control -->
    </G2jBasicModal>
  </div>
</template>

<script>
  import { _, mapState } from "~jsLibPath/lib-manager";
  import { IMAGE_URL, LANGUAGE_VALID } from "~jsDefinePath/general";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/page-info-module";
  import LightSquareRoomCard from "./LightSquareRoomCard.vue";
  import G2jBasicModal from "~jsPartialPath/global/component/g2j-basic-modal/G2jBasicModal.vue";

  export default {
    components: {
      LightSquareRoomCard,
      G2jBasicModal,
    },

    props: {
      assetsServiceUrl: {
        default: "",
        type: String,
      }, // assetsServiceUrl

      itemList: {
        default: new Array(),
        type: Array,
      }, // itemList

      hotelInfoV4: {
        type: Object,
        default: new Object(),
      }, // hotelInfoV4
      isDefaultOvernightSpecial: Boolean,
      isOvernightSpecial: Boolean,
    },

    data() {
      return {
        IMAGE_URL,

        timeBetween: 0,

        invalidItemList: [],

        noResultWithLocale: {
          main: {
            [LANGUAGE_VALID.vi]: "Không còn phòng trống",
            [LANGUAGE_VALID.en]: "Room is not available",
          },
          sub: {
            [LANGUAGE_VALID.vi]:
              "Rất tiếc, chúng tôi không còn phòng tại khách sạn này trong thời gian bạn chọn.</br>Hãy chọn ngày khác để đặt phòng.",
            [LANGUAGE_VALID.en]:
              "Sorry, we have no rooms at this hotel on your dates.</br>Change your dates to make a reservation.",
          },
        }, // noResultWithLocale

        isShowCancellationPolicyModal: false,

        cancellationPolicyWithLocale: {},

        isShowChangeTypeBookingModal: false,

        maxHoursOfRoomCard: 0,

        tmpRoomTypeDetailHref: null,
      };
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, ["language"]),

      hasHotelList() {
        return !_.isEmpty(this.itemList);
      }, // hasHotelList

      hasCancellationPolicy() {
        return !_.isEmpty(this.cancellationPolicy);
      }, // hasCancellationPolicy

      changeTypeBookingContentWithLocale() {
        return {
          [LANGUAGE_VALID.vi]: `Khách sạn quy định giờ tối đa để đặt theo giờ là ${this.maxHoursOfRoomCard} tiếng. Quá ${this.maxHoursOfRoomCard} tiếng tiền phòng sẽ áp dụng giá theo ngày. Bạn có muốn tiếp tục đặt phòng?`,
          [LANGUAGE_VALID.en]: `Maximum hours for hourly booking is ${this.maxHoursOfRoomCard} hour(s). Excess ${this.maxHoursOfRoomCard} hour(s), this your booking will be applied daily price. Do you want to continue?`,
        };
      }, // changeTypeBookingcontentWithLocale
    },

    created() {},

    mounted() {
      const self = this;

      setTimeout(function () {
        self.timeBetween = (() => {
          const bookingType = Number(self.$route.query.bookingType);

          const dayCheckIn = self.$route.query.startDate;
          const dayCheckOut = self.$route.query.endDate;

          const timeCheckIn = self.$route.query.startTime;
          const timeCheckOut = self.$route.query.endTime;

          if (bookingType == 1) {
            return dayjs()
              .hour(timeCheckOut.split(":")[0].trim())
              .diff(dayjs().hour(timeCheckIn.split(":")[0].trim()), "hours");
          } else if (bookingType == 3) {
            return dayjs(dayCheckOut).diff(dayjs(dayCheckIn), "day");
          }

          return 0;
        })();
      }, 150);
    },

    methods: {
      onCardMounted(objRes) {
        if (!objRes.is_valid) {
          this.invalidItemList.push(objRes.info);
        }

        if (objRes.is_finish_render_list) {
          this.$emit("mounted");
        }
      }, // onCardMounted()

      onOpenCancellationPolicyModal(cancellationPolicyWithLocale) {
        if (!_.isEmpty(cancellationPolicyWithLocale)) {
          this.cancellationPolicyWithLocale = cancellationPolicyWithLocale;
          this.isShowCancellationPolicyModal = true;
        }
      }, // onOpenCancellationPolicyModal()

      onCloseCancellationPolicyModal() {
        this.isShowCancellationPolicyModal = false;
      }, // onCloseCancellationPolicyModal()

      onOpenChangeTypeBookingModal(objRoomCardInfo) {
        this.isShowChangeTypeBookingModal = true;
        this.maxHoursOfRoomCard = objRoomCardInfo.max_hours;
        this.tmpRoomTypeDetailHref = objRoomCardInfo.href;
      }, // onOpenChangeTypeBookingModal()

      onCloseChangeBookingTypeModal() {
        this.isShowChangeTypeBookingModal = false;
        this.maxHoursOfRoomCard = 0;
        this.tmpRoomTypeDetailHref = null;
      }, // onCloseChangeBookingTypeModal()

      redirectToRoomTypeDetailWithDailyBookingType() {
        if (this.tmpRoomTypeDetailHref) {
          this.tmpRoomTypeDetailHref = this.tmpRoomTypeDetailHref.replace(
            "bookingType=1",
            "bookingType=3"
          );

          this.tmpRoomTypeDetailHref = this.tmpRoomTypeDetailHref.replace(
            `endDate=${this.hotelInfoV4.endDate.format("YYYY-MM-DD")}`,
            `endDate=${this.hotelInfoV4.startDate
              .add(1, "day")
              .format("YYYY-MM-DD")}`
          );

          this.$router.push(this.tmpRoomTypeDetailHref);
        }
      }, // redirectToRoomTypeDetailWithDailyBookingType()
    },
  };
</script>
