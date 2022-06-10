<template>
  <G2JBasicModal
    v-if="isShowModal"
    :custom-modal-class="customClass"
    @close="closeModal"
  >
    <template #head-title>
      {{ " " }}
    </template>
    <template #body-content>
      <div class="room-list">
        <div
          v-for="(room, inxRom) in roomList"
          :key="inxRom"
          class="room-item"
          :class="
            room.sn == $route.query.roomSn && room.mode == $route.query.mode
              ? 'room-bg'
              : ''
          "
          @click="onChangeRoom(room, inxRom)"
        >
          <div class="room-image">
            <!-- <img :src="$formatLinkImage(room.imagePath)" /> -->
            <g2j-image
              :url-img="`${ASSETS_SERVICE_URL}/${room.imagePath}`"
              :alt-img="room.name || 'null'"
            ></g2j-image>
          </div>
          <div class="room-content">
            <div class="p-20px">
              <p class="room-name">
                {{ room.name }}
              </p>
              <div
                v-if="room && room.mode == 1 && room.displayRule"
                class="room-price mb-4px"

              >
                <!-- <p class="price-label" /> -->
                <p class="price-discount">
                  <label-room :data-item="room" />
                </p>
              </div>
              <!-- show label room - PLEASE check css -->
              <div
                v-if="room && room.mode == 1 && room.displayRule"
                class="room-price"
              >
                <!-- <p class="price-label" /> -->
                <p
                  v-if="room.discount == true && room.displayRule.daysLeft > 0"
                  class="price-discount"
                >
                  <label-remaining-day :type="'special'">
                    <template slot="title">
                      <span> {{ $t("payment.special_offer") }} </span>
                    </template>
                    <template slot="content">
                      <span>
                        {{ _getRemain(room.displayRule.daysLeft, "day") }}
                      </span>
                    </template>
                  </label-remaining-day>
                </p>
              </div>
              <!-- show label remaining day - PLEASE check css -->

              <div
                v-if="room && room.mode == 2 && room.displayRule"
                class="room-price"
              >
                <!-- <p class="price-label" /> -->
                <p
                  v-if="room.numOfRoom > 0 && room.displayRule.dayLeft != 0"
                  class="price-discount"
                >
                  <label-remaining-day :type="'flash-sale'">
                    <template slot="title">
                      <span> {{ $t("payment.flash_sale") }} </span>
                    </template>
                    <template slot="content">
                      <span>
                        {{ _getRemain(room.numOfRoom, "room") }}
                      </span>
                    </template>
                  </label-remaining-day>
                </p>
              </div>
              <!-- show label remaining day - PLEASE check css -->
              <div class="room-price">
                <p class="price-label">
                  {{ room.firstHours }} {{ $t("payment.firsthour") }}
                </p>
                <p
                  v-if="
                    room.displayRule.priceFirstHours <
                    room.displayRule.firstHoursOrigin
                  "
                  class="price-discount"
                >
                  <del>
                    {{ $formatPrice(room.displayRule.firstHoursOrigin) }}
                  </del>
                </p>
                <p class="price-final">
                  {{ $formatPrice(room.displayRule.priceFirstHours) }}
                </p>
              </div>
              <div class="room-price">
                <p class="price-label">
                  {{ $t("payment.additional") }}
                </p>
                <p
                  v-if="
                    room.displayRule.priceAdditionalHours <
                    room.displayRule.additionalOrigin
                  "
                  class="price-discount"
                >
                  <del>
                    {{ $formatPrice(room.displayRule.additionalOrigin) }}
                  </del>
                </p>
                <p class="price-final">
                  {{ $formatPrice(room.displayRule.priceAdditionalHours) }}
                </p>
              </div>
              <div class="room-price">
                <p class="price-label">
                  {{ $t("payment.room_type.overnight") }}
                </p>
                <p
                  v-if="
                    room.displayRule.priceOvernight <
                    room.displayRule.overnightOrigin
                  "
                  class="price-discount"
                >
                  <del>
                    {{ $formatPrice(room.displayRule.overnightOrigin) }}
                  </del>
                </p>
                <p class="price-final">
                  {{ $formatPrice(room.displayRule.priceOvernight) }}
                </p>
              </div>
              <div class="room-price">
                <p class="price-label">
                  {{ $t("payment.room_type.daily") }}
                </p>
                <p
                  v-if="
                    room.displayRule.priceOneDay < room.displayRule.oneDayOrigin
                  "
                  class="price-discount"
                >
                  <del>
                    {{ $formatPrice(room.displayRule.oneDayOrigin) }}
                  </del>
                </p>
                <p class="price-final">
                  {{ $formatPrice(room.displayRule.priceOneDay) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </G2JBasicModal>
</template>
<script>
  import G2JBasicModal from '~jsPath/partial/global/component/g2j-basic-modal/G2jBasicModal.vue';
  import { _getRemain } from "~jsPath/helper/util/getLabel";
  import {
    ASSETS_SERVICE_URL,
  } from '~jsDefinePath/general';
  export default {
    components: {
      G2JBasicModal,
      "label-room": () =>
        import("~jsPartialPath/global/component/label-room/LabelRoom.vue"),
      "label-remaining-day": () =>
        import(
          "~jsPartialPath/global/component/label-remaining-day/LabelRemainingDay.vue"
        ),
    },
    props: {
      customClass: {
        type: String,
        default: " ",
      },
    },
    data() {
      return {
        isShowModal: false,
        roomList: [],
        ASSETS_SERVICE_URL
      };
    },
    computed: {},
    created() {},
    methods: {
      _getRemain,
      openModal(data) {
        this.roomList = data;
        this.isShowModal = true;
      },
      closeModal() {
        this.isShowModal = false;
      },
      onChangeRoom(data, index) {
        this.$emit("onChangeRoom", data, index);
        this.closeModal();
      },
    },
  };
</script>
