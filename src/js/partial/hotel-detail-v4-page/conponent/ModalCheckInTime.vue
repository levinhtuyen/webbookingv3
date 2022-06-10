<template>
  <modal
    ref="modal-checkin-time"
    class="modal-checkin-time"
    :visible.sync="visible"
  >
    <!-- :isClose='false' -->
    <!-- :disableClickBackground="true" -->
    <template slot="header">
      <div class="modal-checkin-time__header">

      </div>
    </template>
    <template slot="body">
      <div class="modal-checkin-time__body">
        <h2 class="modal-checkin-time__body--title">
          {{ $t("hotel_detail.checkin_time.title_modal") }}
        </h2>
        <span class="modal-checkin-time__body--subtitle"> {{ $t("hotel_detail.checkin_time.sub_title") }}</span>
        <div class="modal-checkin-time__body--container-button">
          <button
            class="g2j-button-book-now"
            @click="onClickSelectType('right-now')"
            :class="{active: isActive=='right-now'}"
          > {{ $t("hotel_detail.checkin_time.right_now") }}
            ({{now}} {{formatMMM(dayjs())}})</button>

          <button
            @click="onClickSelectType('tonight')"
            class="g2j-button-book-now"
            :class="{active: isActive=='tonight'}"
            :disabled="isDisableToNight && isDisable"
          >{{ $t("hotel_detail.checkin_time.tonight") }} ({{startOvernight}} {{formatMMM(dayjs())}})</button>
          <!-- {{formatMMM((dayCheckIn).subtract(1, "day"))}} -->
          <button
            @click="onClickSelectType('other-date')"
            class="g2j-button-book-now"
            :class="{active: isActive=='other-date'}"
          >{{ $t("hotel_detail.checkin_time.other_date") }}</button>
        </div>

      </div>
    </template>
    <template slot="footer">
      <div class="modal-checkin-time__footer btn"></div>
    </template>
  </modal>
</template>

<script>
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/page-info-module";
  import { IMAGE_URL, ASSETS_SERVICE_URL } from "~jsDefinePath/general";

  import { _, mapState } from "~jsLibPath/lib-manager";

  export default {
    components: {
      modal: () =>
        import("~jsPartialPath/global/component/modal/ModalComponent.vue"),
    },
    props: {
      dayCheckIn: String,
      timeCheckIn: String,
      timeNow: String,
      startOvernight: String,
      isDefault: Boolean,
      timeSelect: [String, Number],
      typeOvernight: String,
      isDisableToNight: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        IMAGE_URL,
        ASSETS_SERVICE_URL,
        visible: false,
        isActive: "right-now", //right-now, tonight, other-date
        isDisable: false,
        dataSubmit: null,
      };
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),
      now() {
        return this.handleFormatTime(dayjs().hour() + ":" + dayjs().minute());
      },
    },

    created() {},

    methods: {
      isEmpty: _.isEmpty,
      dayjs,
      openModal({ name, info }) {
        // this.typeOvernight = 'right-now'
        if (!this.isEmpty(name) && !this.isEmpty(info)) {
          this.dataSubmit = { name, info };
          if (name && name == "room") {
            this.isDisable = true;
          } else {
            this.isDisable = false;
          }
        }

        if (this.isDefault) {
          this.typeOvernight = "right-now";
        }
        this.isActive = this.typeOvernight;
        this.visible = true;
      },
      closeModal() {
        this.visible = false;
      },
      handleFormatTime(data) {
        //type HH:mm
        if (!data) return;
        let time = data.split(":");
        time[0] = time[0] == 24 ? "00" : time[0];
        time[1] = time[1] < 10 ? "0" + Number(time[1]) : time[1];
        let result =
          Number(time[0]) < 10
            ? "0" + Number(time[0]) + ":" + time[1]
            : time[0] + ":" + time[1];
        return result;
      }, // handleFormatTime
      formatMMM(day) {
        if (!day) return;
        let CDate = dayjs(day).locale(this.language).format("DD/MM/YYYY");
        return CDate;
      }, // formatMMM()
      async onClickSelectType(name) {
        this.isActive = name;
        if (name != "other-date") {
          this.$emit("update:typeOvernight", name);
        }

        if (name == "right-now") {
          let time = dayjs().hour() + ":" + dayjs().minute();
          time = this.handleFormatTime(time);
          await this.$emit("update:timeCheckIn", time);
          await this.$emit("update:dayCheckIn", dayjs());
          await this.$emit("update:dayCheckOut", dayjs());
          await this.$emit("update:timeSelect", 2);

          await this.$emit("submit", this.dataSubmit);
          this.$emit("update:isDefault", false); // bien nay de check con trinh

          this.closeModal();
        }
        if (name == "tonight") {
          await this.$emit("update:timeCheckIn", this.startOvernight);
          await this.$emit("update:dayCheckIn", dayjs());
          await this.$emit("update:dayCheckOut", dayjs().add(1, "day"));
          await this.$emit("update:timeSelect", 2);

          await this.$emit("submit", this.dataSubmit);

          this.$emit("update:isDefault", false); // bien nay de check con trinh

          this.closeModal();
        }
        if (name == "other-date") {
          // await this.$emit("update:timeCheckIn", this.startOvernight);
          // await this.$emit("update:dayCheckIn", dayjs().add(1, "day"));
          // await this.$emit("update:dayCheckOut", dayjs().add(2, "day"));
          //suy nghi di
          await this.$emit("update:timeSelect", 2);

          this.$emit("bookCalendar");

          this.closeModal();
        }
      },
    },
    watch: {},
  };
</script>
