<template>
  <modal
    ref="g2j-select-date-time"
    :visible.sync="visible"
    class="g2j-select-date-time"
  >
    <template slot="header">
      <div class="g2j-select-date-time__header">
        <!-- this is header -->
      </div>
    </template>
    <template slot="body">
      <div class="g2j-select-date-time__body">
        <div class="g2j-select-date-time-type">
          <template v-for="(v,k) in filterTime">
            <button
              :disabled="!v.is_active"
              class="g2j-select-date-time-type__item"
              :key="k"
              :class="v.id == selectTime? 'active':''"
              @click="onSelectTypeTime(v)"
            >
              <g2j-image :urlImg="IMAGE_URL+`/icon/filter/${v.icon}`"></g2j-image>
              <div class="g2j-select-date-time-type__item--title">
                {{v.name}}
              </div>
            </button>
          </template>
        </div>
        <div class="g2j-select-date-time-option-time">
          <!-- hotel-list -->
          <template v-if="pageName != 'hotel-detail'&& selectTime!=3">
            <div
              v-if="!isShowCheckIn"
              class="g2j-select-date-time-option-time__check-in"
              @click="isShowCheckIn = !isShowCheckIn, isShowCheckOut = false"
            >
              <span class="g2j-select-date-time-option-time__check-in--title">
                {{$t('common.check_in')}}
              </span>
              <div class="g2j-select-date-time-option-time__check-in--time">
                {{formatMMM(dayCheckInComponent)}}
              </div>
            </div>
            <transition
              name="expand"
              mode="out-in"
            >
              <g2j-calendar
                :key="'hotel-list-type-hour-checkin'"
                v-if="isShowCheckIn && selectTime == 1"
                :title="$t('common.check_in')"
                :select-date.sync="dayCheckInComponent"
                :startDisable="startDisable"
              ></g2j-calendar>
              <g2j-calendar
                :key="'hotel-list-type-overnight-checkin'"
                v-if="isShowCheckIn && selectTime == 2"
                :title="$t('common.check_in')"
                :select-date.sync="dayCheckInComponent"
                :startDisable="startDisable"
              ></g2j-calendar>
            </transition>
            <!-- isShowCheckOut = !isShowCheckOut, isShowCheckIn = false, -->
            <div
              v-if="!isShowCheckOut"
              @click=" onClickCheckOut()"
              :class="selectTime == 2 || selectTime == 1?'disable-check-out':''"
              class="g2j-select-date-time-option-time__check-out"
            >
              <span class="g2j-select-date-time-option-time__check-out--title">
                {{$t('common.check_out')}}
              </span>
              <div class="g2j-select-date-time-option-time__check-out--time">
                {{formatMMM(dayCheckOutComponent)}}
              </div>
            </div>
            <transition
              name="expand"
              mode="out-in"
            >
              <g2j-calendar
                v-if="isShowCheckOut"
                :key="'hotel-list-type-hour-overnight-checkout'"
                :title="$t('common.check_out')"
                :select-date.sync="dayCheckOutComponent"
                :startDisable.sync="dayCheckInComponent"
                :isCheckOut="true"
              ></g2j-calendar>
            </transition>
          </template>

          <template v-if="pageName != 'hotel-detail' && selectTime==3">
            <div
              v-if="!isShowCheckIn"
              class="g2j-select-date-time-option-time__check-in"
              @click="isShowCheckIn = !isShowCheckIn, isShowCheckOut = false"
            >
              <span class="g2j-select-date-time-option-time__check-in--title">
                {{$t('common.check_in')}}
              </span>
              <div class="g2j-select-date-time-option-time__check-in--time">
                {{formatMMM(dayCheckInComponent)}}
              </div>
            </div>
            <transition
              name="expand"
              mode="out-in"
            >
              <g2j-calendar
                :key="'hotel-list-type-daily-checkin'"
                v-if="isShowCheckIn"
                :title="$t('common.check_in')"
                :select-date.sync="dayCheckInComponent"
                :startDisable="startDisable"
              ></g2j-calendar>
              <!-- :endDisable.sync="dayCheckOutComponent" -->
            </transition>
            <!-- isShowCheckOut = !isShowCheckOut, isShowCheckIn = false, -->
            <div
              v-if="!isShowCheckOut"
              @click=" onClickCheckOut()"
              :class="selectTime == 2 || selectTime == 1?'disable-check-out':''"
              class="g2j-select-date-time-option-time__check-out"
            >
              <span class="g2j-select-date-time-option-time__check-out--title">
                {{$t('common.check_out')}}
              </span>
              <div class="g2j-select-date-time-option-time__check-out--time">
                {{formatMMM(dayCheckOutComponent)}}
              </div>
            </div>
            <transition
              name="expand"
              mode="out-in"
            >
              <g2j-calendar
                v-if="isShowCheckOut"
                :key="'hotel-list-type-daily-checkout'"
                :title="$t('common.check_out')"
                :select-date.sync="dayCheckOutComponent"
                :startDisable.sync="dayjs(dayCheckInComponent).set('hour',0).set('minute',0).set('second',0).set('millisecond',0).add(1,'day')"
                :isCheckOut="true"
                @onClickDisable30day="$emit('onClickDisable30day')"
              ></g2j-calendar>
            </transition>
          </template>
          <!-- end hotel-list -->

          <!-- hotel-detail -->
          <template v-if="pageName == 'hotel-detail' && selectTime != 1">
            <div
              v-if="!isShowCheckIn"
              class="g2j-select-date-time-option-time__check-in"
              @click="isShowCheckIn = !isShowCheckIn, isShowCheckOut = false"
            >
              <span class="g2j-select-date-time-option-time__check-in--title">
                {{$t('common.check_in')}}
              </span>
              <div class="g2j-select-date-time-option-time__check-in--time">
                {{timeCheckInComponent}} {{formatMMM(dayCheckInComponent)}}
              </div>
            </div>
            <transition
              name="expand"
              mode="out-in"
            >
              <g2j-calendar
                v-if="isShowCheckIn && selectTime ==2"
                :key="'hotel-detail-type-overnight-checkin'"
                :title="$t('common.check_in')"
                :select-date.sync="dayCheckInComponent"
                :startDisable="startDisable"
                :time.sync="timeCheckInComponent"
              ></g2j-calendar>
              <g2j-calendar
                v-if="isShowCheckIn && selectTime ==3"
                :key="'hotel-detail-type-daily-checkin'"
                :title="$t('common.check_in')"
                :select-date.sync="dayCheckInComponent"
                :startDisable="startDisable"
                :time.sync="timeCheckInComponent"
              ></g2j-calendar>
              <!-- :isAgoda="isAgoda" -->
            </transition>
            <div
              v-if="!isShowCheckOut"
              @click="onClickCheckOut()"
              :class="selectTime == 2?'disable-check-out':''"
              class="g2j-select-date-time-option-time__check-out"
            >
              <span class="g2j-select-date-time-option-time__check-out--title">
                {{$t('common.check_out')}}
              </span>
              <div class="g2j-select-date-time-option-time__check-out--time">
                {{timeCheckOutComponent}} {{formatMMM(dayCheckOutComponent)}}
              </div>
            </div>
            <transition
              name="expand"
              mode="out-in"
            >
              <g2j-calendar
                v-if="isShowCheckOut"
                :key="'hotel-detail-type-overnight-daily-checkout'"
                :title="$t('common.check_out')"
                :select-date.sync="dayCheckOutComponent"
                :startDisable.sync="dayjs(dayCheckInComponent).add(1,'day')"
                :isAgoda="isAgoda"
                :time.sync="timeCheckOutComponent"
                :isCheckOut="true"
                @onClickDisableAgoda="$emit('onClickDisableAgoda')"
                @onClickDisable30day="$emit('onClickDisable30day')"
              ></g2j-calendar>
            </transition>
          </template><!-- hotel-detail overnight overnightt& daily -->

          <template v-if="pageName == 'hotel-detail' && selectTime == 1">
            <div
              v-if="!isShowCheckIn"
              class="g2j-select-date-time-option-time__check-in"
              @click="isShowCheckIn = !isShowCheckIn, isShowCheckOut = false "
            >
              <span class="g2j-select-date-time-option-time__check-in--title">
                {{$t('common.date')}}
              </span>
              <div class="g2j-select-date-time-option-time__check-in--time">
                {{formatMMM(dayCheckInComponent)}}
              </div>
            </div>

            <transition
              name="expand"
              mode="out-in"
            >

              <g2j-calendar
                v-if="isShowCheckIn"
                :key="'hotel-detail-type-hourly-checkin'"
                :title="$t('common.check_in')"
                :select-date.sync="dayCheckInComponent"
                :startDisable="startDisable"
              ></g2j-calendar>
            </transition>
            <div
              v-if="!isShowCheckOut"
              @click="isShowCheckOut = !isShowCheckOut, isShowCheckIn = false, openTimeSelect()"
              class="g2j-select-date-time-option-time__check-out"
            >
              <span class="g2j-select-date-time-option-time__check-out--title">
                {{$t('common.time')}}
              </span>
              <div class="g2j-select-date-time-option-time__check-out--time">
                <!-- 08:00 - 09:00 -->
                {{timeCheckInComponent}} - {{timeCheckOutComponent}}
              </div>
            </div>
            <transition
              name="expand"
              mode="out-in"
            >
              <div
                v-if="isShowCheckOut"
                class="g2j-select-date-time-type-hourly"
              >
                <div class="g2j-select-date-time-type-hourly__header">
                  <span class="g2j-select-date-time-type-hourly__header--title">Time</span>
                  <span class="g2j-select-date-time-type-hourly__header--time">
                    {{timeCheckInComponent}} - {{timeCheckOutComponent}}
                  </span>
                </div>
                <div class="g2j-select-date-time-type-hourly__note">
                  <span class="g2j-select-date-time-type-hourly__note--item">
                    <g2j-image :urlImg="IMAGE_URL+`/icon/filter/i.svg`"></g2j-image>
                    {{$t('common.hourly_available')}} {{timeStartHour}}
                  </span>
                </div>
                <div class="g2j-select-date-time-type-hourly__select">
                  <div class="g2j-select-date-time-type-hourly__select--check-in">
                    <span class="title"> {{$t('common.check_in')}}</span>
                    <div class="select-hour-check-in">
                      <p
                        v-for="(v,k) in arrTime"
                        :ref="`check-in-${v}`"
                      >
                        <button
                          class="select-hour-check-in__item"
                          :key="k"
                          :class="[
                            timeCheckInComponent.length &&compareTime(v,timeCheckInComponent) == 0? 'check-in-active':'',
                            isDisableCheckIn(v)?'disable':'']"
                          :disabled="isDisableCheckIn(v) ?true:false"
                          @click="onSelectTimeCheckIn(v)"
                        > {{v}}</button>
                      </p>
                    </div>
                  </div>
                  <div class="g2j-select-date-time-type-hourly__select--check-out">
                    <span class="title">{{$t('common.check_out')}}</span>
                    <div class="select-hour-check-out">
                      <p v-for="(v,k) in arrTime">
                        <button
                          class="select-hour-check-out__item"
                          :key="k"
                          :class="[
                          timeCheckOutComponent.length &&  compareTime(v,timeCheckOutComponent) == 0 ? 'check-out-active':'',
                            isDisableCheckOut(v)?'disable':'']"
                          :disabled="isDisableCheckOut(v) ?true:false"
                          @click="onSelectTimeCheckOut(v)"
                        > {{v}}</button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </template><!-- hotel-detail hour -->
          <!-- end hotel-detail -->
        </div>
      </div>
    </template>
    <template slot="footer">
      <div class="g2j-select-date-time__footer">
        <button
          @click="onSubmit()"
          class="g2j-button-book-now"
        >{{$t('common.confirm')}}</button>
      </div>
    </template>
  </modal>
</template>

<script>
  import {
    IMAGE_URL,
    CACHE_VERSION,
    ASSETS_SERVICE_URL,
  } from "~jsDefinePath/general";
  import {
    compareTime,
    compare1Hour,
    handleFormatTime,
  } from "~jsPath/helper/util/formatDate";
  import { mapGetters, mapActions, mapState } from "~jsPath/lib/lib-manager";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/page-info-module";
  // import mixin from "~jsPath/partial/hotel-detail-v4-page/mixin/mixin";

  export default {
    props: {
      filter: [Object, Array],
      typeTime: [String, Number],
      dayCheckIn: String,
      dayCheckOut: String,
      timeCheckIn: String,
      timeCheckOut: String,
      timeSpace: String,
      pageName: String,
      dataMore: [Object, Array],
      isDisableHourly: {
        type: Boolean,
        default: false,
      },
      isDisableOvernight: {
        type: Boolean,
        default: false,
      },
      isDisableDaily: {
        type: Boolean,
        default: false,
      },
      filterTime: {
        type: [Object, Array],
        default: [
          { id: 1, name: "Hourly", icon: "hourly.svg", is_active: true },
          { id: 2, name: "Overnight", icon: "overnight.svg", is_active: true },
          { id: 3, name: "Daily", icon: "daily.svg", is_active: true },
        ],
      },
      isAgoda: {
        type: Boolean,
        default: false,
      },
      isOvernightSpecial: {
        type: Boolean,
      },
      isOvernight: {
        type: Boolean,
      },
      checkHourWith6h: {
        type: Boolean,
      },
    },
    components: {
      modal: () =>
        import("~jsPartialPath/global/component/modal/ModalComponent.vue"),
      "g2j-calendar": () =>
        import("~jsPartialPath/global/component/g2j-calendar/Go2JoyCalendar.vue"),
    },
    data() {
      return {
        IMAGE_URL,
        visible: false, //check show modal
        // filterTime: [
        //   { id: 1, name: "Hourly", icon: "hourly.svg", is_active: true },
        //   { id: 2, name: "Overnight", icon: "overnight.svg", is_active: true },
        //   { id: 3, name: "Daily", icon: "daily.svg", is_active: true },
        // ], //option mặc định => nếu muốn truyền dô thì phải handle lại
        selectTime: "", //type-time default Hourly
        isShowCheckIn: true,
        isShowCheckOut: true,
        isShowTime: true,
        startDisable: dayjs().subtract(1, "day"), //"2021-11-29"
        endDisable: "",
        dayCheckInComponent: "",
        dayCheckOutComponent: "",
        timeCheckInComponent: "",
        timeCheckOutComponent: "",
        timeNow: "",
      };
    },

    methods: {
      dayjs: window.dayjs,
      handleFormatTime,
      compare1Hour,
      openModal() {
        // reset form

        this.isShowCheckIn = true;
        this.isShowCheckOut = false;
        this.isShowTime = false;
        this.selectTime = !this.typeTime ? 1 : this.typeTime;
        this.initFirst();

        this.visible = true; //key => hiện modal
      },
      closeModal() {
        this.visible = false; //key => ẩn modal
      },

      initFirst() {
        //gán data từ thằng cha
        this.timeCheckInComponent = this.timeCheckIn;
        this.timeCheckOutComponent = this.timeCheckOut;
        this.dayCheckInComponent = this.dayCheckIn;
        this.dayCheckOutComponent = this.dayCheckOut;
        this.startDisable = dayjs().subtract(1, "day");
        // if (this.typeTime == 1) {
        //   this.timeCheckInComponent = this.timeCheckIn;
        //   this.timeCheckOutComponent = this.timeCheckOut;
        // }
        if (this.selectTime == 1) {
          this.timeCheckInComponent = this.timeCheckIn;
          this.timeCheckOutComponent = this.timeCheckOut;
          this.dayCheckInComponent =
            this.dayCheckInComponent ||
            dayjs().set("hour", 0).set("minute", 0).set("second", 0);
          this.dayCheckOutComponent =
            this.dayCheckOutComponent ||
            dayjs().set("hour", 0).set("minute", 0).set("second", 0);
        }
        if (this.selectTime == 2) {
          this.dayCheckInComponent =
            this.dayCheckInComponent ||
            dayjs().set("hour", 0).set("minute", 0).set("second", 0);
          this.dayCheckOutComponent =
            this.dayCheckOutComponent ||
            this.dayjs(this.dayCheckInComponent).add(1, "day");

          if (this.isOvernightSpecial) {
            //cho nay can coi lai ne
            this.dayCheckInComponent = dayjs().add(1, "day");
            this.dayCheckOutComponent = dayjs().add(2, "day");
            this.timeCheckInComponent = this.dataMore.startOvernight + ":00";
            this.startDisable = dayjs();
          }
        }
        if (this.selectTime == 3) {
          this.dayCheckInComponent =
            this.dayCheckInComponent ||
            dayjs().set("hour", 0).set("minute", 0).set("second", 0);
          this.dayCheckOutComponent =
            this.dayCheckOutComponent ||
            this.dayjs(this.dayCheckInComponent).add(1, "day");
        }
        // this.initDateTimeComponent(this.selectTime, true);
      },
      onSelectTypeTime(data) {
        if (!data) return;
        //reset form khi chọn type khác
        this.isShowCheckIn = true;
        this.isShowCheckOut = false;

        this.selectTime = data.id; // key => chọn type
        if (data.id == 2 && this.isOvernightSpecial) {
          this.$emit("changeTypeOvernightSpecial");
          this.closeModal();
        }
        // await this.$nextTick();
        this.initDateTimeComponent(data.id);
      },
      initDateTimeComponent(data, first) {
        if (data == 1) {
          let h = dayjs().hour();
          let m = dayjs().minute();
          let hourWithFirstHours;
          let firstHour =
            this.dataMore && this.dataMore.firstHours
              ? this.dataMore.firstHours
              : 0;

          if (m > 30) {
            this.timeNow = h + 1 + ":00";
            hourWithFirstHours = h + firstHour + ":00";
            this.timeCheckInComponent =
              !this.timeCheckIn || !first
                ? dayjs().add(1, "hour").hour() + ":00"
                : this.timeCheckIn;
            this.timeCheckOutComponent =
              !this.timeCheckOut || !first
                ? dayjs()
                    .add(1 + firstHour, "hour")
                    .hour() + ":00"
                : this.timeCheckOut;
          } else {
            this.timeNow = h + ":30";
            hourWithFirstHours =
              !this.timeCheckIn || !first
                ? dayjs().add(firstHour, "hour").hour() + ":30"
                : this.timeCheckIn;
            this.timeCheckInComponent = h + ":30";
            this.timeCheckOutComponent =
              !this.timeCheckOut || !first
                ? dayjs().add(firstHour, "hour").hour() + ":30"
                : this.timeCheckOut;
          }

          if (this.dataMore) {
            let startHourlyTime = this.dataMore.startHourlyTime + ":00";
            let startOvernight = this.dataMore.startOvernight + ":00";
            let endOvernight = this.dataMore.endOvernight + ":00";
            let checkOvernight = this.compareTime(
              hourWithFirstHours,
              startOvernight
            );

            let checkOvernight2 = this.compareTime(
              hourWithFirstHours,
              endOvernight
            );

            let checkOvernightWithHour = this.compareTime(
              hourWithFirstHours,
              startHourlyTime
            );
            // checkOvernight != -1 ||
            // (checkOvernightWithHour != 1 && checkOvernight2 == -1)
            if (this.isOvernight) {
              let check = this.compareTime(this.timeCheckIn, startOvernight);
              let check2 = this.compareTime(this.timeCheckOut, endOvernight);
              this.timeCheckInComponent =
                check != -1 || check2 == -1
                  ? this.dataMore.startHourlyTime + ":00"
                  : this.timeCheckIn;
              this.timeCheckOutComponent =
                check != -1 || check2 == -1
                  ? this.dataMore.startHourlyTime + firstHour + ":00"
                  : this.timeCheckOut;

              if (!first) {
                this.timeCheckInComponent = this.dataMore.startHourlyTime + ":00";
                this.timeCheckOutComponent =
                  this.dataMore.startHourlyTime + firstHour + ":00";
                this.dayCheckInComponent = this.isOvernightSpecial
                  ? dayjs()
                  : dayjs(this.dayCheckIn).add(1, "day");
              }
              this.dayCheckOutComponent = this.dayCheckInComponent;
              this.startDisable = this.isOvernightSpecial
                ? dayjs().subtract(1, "day")
                : dayjs();

              return;
            }
          }

          // this.dayCheckInComponent = this.dayCheckIn;
          this.dayCheckInComponent = !this.dayCheckInComponent
            ? dayjs()
            : this.dayCheckInComponent;

          this.dayCheckOutComponent = this.dayCheckInComponent;
        }

        if (data == 2) {
          if (this.dataMore) {
            this.timeCheckInComponent = this.dataMore.startOvernight + ":00";
            this.timeCheckOutComponent = this.dataMore.endOvernight + ":00";
          }

          // this.dayCheckInComponent = this.dayCheckIn;
          this.dayCheckInComponent = !this.dayCheckInComponent
            ? dayjs()
            : this.dayCheckInComponent;

          this.dayCheckOutComponent = dayjs(this.dayCheckInComponent).add(
            1,
            "day"
          );
          this.startDisable = dayjs().subtract(1, "day");

          return;
        }
        if (data == 3) {
          if (this.dataMore) {
            this.timeCheckInComponent = this.dataMore.checkin + ":00";
            this.timeCheckOutComponent = this.dataMore.checkout + ":00";
          }

          this.dayCheckInComponent = !this.dayCheckInComponent
            ? dayjs(this.dayCheckInComponent)
            : this.dayCheckInComponent;
          // this.dayCheckInComponent = this.dayCheckIn;

          this.dayCheckOutComponent = dayjs(this.dayCheckInComponent).add(
            1,
            "day"
          );

          this.startDisable = dayjs().subtract(1, "day");
          return;
        }
      },

      onSelectTimeCheckIn(time) {
        if (this.selectTime == 1) {
          this.timeCheckInComponent = time; // key => gán cho thời gian check-in
          this.timeCheckOutComponent = this.addHour(
            this.timeCheckInComponent,
            this.timeSpace
          ); // key => dựa vào thời gian theo giờ mà cộng vào cho check-out

          this.openTimeSelect(); //cân nhắc có nên để cái này hay k? hiển thị cái active khi chọn
        }
      },
      onSelectTimeCheckOut(time) {
        this.timeCheckOutComponent = time; // key => chọn thời gian check-out
      },
      openTimeSelect() {
        setTimeout(() => {
          let elCheckIn = document.getElementsByClassName("check-in-active")[0];
          let containerCheckIn = document.getElementsByClassName(
            "select-hour-check-in"
          )[0];
          let elCheckOut = document.getElementsByClassName("check-out-active")[0];
          let containerCheckOut = document.getElementsByClassName(
            "select-hour-check-out"
          )[0];
          if (elCheckIn) {
            containerCheckIn.scrollTop =
              elCheckIn.offsetTop - containerCheckIn.offsetTop;
          }
          if (elCheckOut) {
            containerCheckOut.scrollTop =
              elCheckOut.offsetTop - containerCheckOut.offsetTop;
          }
        }, 100);
      },
      onSubmit() {
        // sync data roi tat

        this.$emit("update:typeTime", this.selectTime);
        this.$emit("update:dayCheckIn", this.dayCheckInComponent);
        this.$emit("update:dayCheckOut", this.dayCheckOutComponent);
        this.$emit(
          "update:timeCheckIn",
          this.handleFormatTime(this.timeCheckInComponent)
        );
        this.$emit(
          "update:timeCheckOut",
          this.handleFormatTime(this.timeCheckOutComponent)
        );
        this.$emit("onSubmit");
        this.closeModal();
      },
      onClickCheckOut() {
        if (this.selectTime == 2) return;
        if (
          this.pageName != "hotel-detail" &&
          (this.selectTime == 2 || this.selectTime == 1)
        )
          return;

        this.isShowCheckOut = !this.isShowCheckOut;
        this.isShowCheckIn = false;
      },
      isDisableCheckIn(val) {
        // chỗ này check disable time bên check-in

        //nhớ check xem phải có cùng ngày hay k?

        //so voi thoi gian hien tai
        let checkWithNow =
          this.compareTime(this.timeCheckNow, val) == 1 ? true : false;

        //so voi thoi gian bat dau overnight
        let startOvernight =
          Number(this.dataMore.startOvernight) - Number(this.timeSpace) + ":00";
        let checkOverNight =
          this.compareTime(val, startOvernight) == 1 ? true : false;

        //so voi thoi gian bat dau dat theo gio
        let checkStartHour =
          this.compareTime(val, this.timeStartHour) != -1 && dayjs().get("date")
            ? false
            : true;

        if (dayjs().get("date") == dayjs(this.dayCheckInComponent).get("date")) {
          return checkWithNow || checkStartHour || checkOverNight;
        } else {
          return checkOverNight || checkStartHour;
        }
      },
      isDisableCheckOut(val) {
        // chỗ này check disable time bên check-out
        let checkWithCheckIn =
          this.compareTime(
            val,
            this.addHour(this.timeCheckInComponent, this.timeSpace)
          ) == -1
            ? true
            : false;

        let startOvernight = this.dataMore.startOvernight + ":00";
        let checkOverNight =
          this.compareTime(val, startOvernight) == 1 ? true : false;

        let check1Hour = !this.compare1Hour(this.timeCheckInComponent, val);

        return checkWithCheckIn || checkOverNight || check1Hour;
      },
      addHour(time, space) {
        // type HH:mm
        let hour = time.split(":");
        return Number(hour[0]) + Number(space) + ":" + hour[1];
      },

      compareTime,
      formatMMM(date) {
        if (!date) return;
        let CDate = dayjs(date).locale(this.language).format("DD/MM/YYYY");
        return CDate;
      }, // formatMMM()
    },
    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),

      arrTime() {
        //https://codereview.stackexchange.com/questions/121066/creating-an-array-with-quarter-hour-times
        let x = 30; //minutes interval
        let times = []; // time array
        let tt = 0; // start time
        let ap = ["AM", "PM"]; // AM-PM

        //loop to increment the time and push results in array
        for (let i = 0; tt < 24 * 60; i++) {
          let hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
          let mm = tt % 60; // getting minutes of the hour in 0-55 format
          times[i] = ("0" + hh).slice(-2) + ":" + ("0" + mm).slice(-2);
          times[i] = times[i].toString();
          // +ap[Math.floor(hh / 12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
          tt = tt + x;
        }
        return times;
      },
      timeCheckNow() {
        let h = dayjs().hour();
        let m = dayjs().minute();
        let result;
        if (m >= 30) {
          result = h + 1 + ":00";
        } else result = h + ":30";

        return result;
      },
      timeStartHour() {
        return this.dataMore.startHourlyTime + ":00";
      },
    },
    updated() {
      // console.log("this is update");
    },
    mounted() {},
    watch: {
      timeCheckIn(value) {
        this.timeCheckInComponent = value;
      },
      timeCheckOut(value) {
        this.timeCheckOutComponent = value;
      },
      // dayCheckOut(value) {
      //   this.dayCheckOutComponent = value;
      // },
      // dayCheckIn(value) {
      //   this.dayCheckInComponent = value;
      // },

      dayCheckInComponent(val) {
        if (this.selectTime == 2 && this.pageName == "hotel-detail") {
          // this.dayCheckOutComponent = this.isOvernightSpecial
          //   ? dayjs(this.dayCheckInComponent)
          //   : dayjs(this.dayCheckInComponent).add(1, "day");
          this.dayCheckOutComponent = dayjs(this.dayCheckInComponent).add(
            1,
            "day"
          );
        }

        if (this.selectTime == 1 && this.pageName == "hotel-detail") {
          this.dayCheckOutComponent = val;
        }

        if (this.selectTime == 3) {
          //  && this.pageName == "hotel-detail"

          if (
            dayjs(this.dayCheckOutComponent).isBefore(dayjs(val)) ||
            dayjs(this.dayCheckOutComponent).diff(dayjs(val), "day") == 0
          ) {
            this.dayCheckOutComponent = dayjs(val).add(1, "day");
          }
          if (
            this.isAgoda &&
            dayjs(this.dayCheckOutComponent).diff(
              dayjs(this.dayCheckInComponent),
              "day"
            ) > 14
          ) {
            this.dayCheckOutComponent = dayjs(val).add(14, "day");
          }
        }

        if (this.selectTime == 1 && this.pageName != "hotel-detail") {
          this.dayCheckOutComponent = val;
        }
        if (this.selectTime == 2 && this.pageName != "hotel-detail") {
          this.dayCheckOutComponent = dayjs(val).add(1, "day");
        }
      },
    },
  };
</script>

