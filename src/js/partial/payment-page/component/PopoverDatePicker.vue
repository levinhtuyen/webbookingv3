<template>
  <ThePopover
    ref="popover"
    v-click-outside="onClose"
    :custom-popover-class="'payment-date-time-picker '+type"
  >
    <template #popover-content>
      <div
        class="check-in-date-pick active"
        :class="$route.query.mode == 2? 'disable':''"
        @click="onShow"
      >
        <span class="time">
          {{ type == 'check-in-popover' ? startTime : endTime }}
        </span>
        <span
          v-if="bookingType != 1"
          class="date"
        >
          {{ this.dayjs(type == 'check-in-popover' ? startDate : endDate).format('MMM DD, YYYY') }}
        </span>
        <span
          v-else
          class="date"
        >
          {{ this.dayjs(endDate).format('MMM DD, YYYY') }}
        </span>
      </div>
    </template>
    <template #popover-overlay>
      <div class="popover-item popover-header">
        <div
          v-if="bookingType != 3"
          class="popover-div time-limit"
        >
          <span>{{ startTime }} ~</span>
          <span>{{ endTime }}</span>
        </div>
        <div
          v-show="bookingType == 1 || (bookingType == 2 && type == 'check-in-popover') || bookingType == 3"
          class="popover-div date-picker"
        >
          <vuejs-datepicker
            :value="startDate"
            :wrapper-class="`${bookingType != 1 ? 'two-days' : ''} start-date`"
            format="dd/MM/yyyy"
            :disabled-dates="disabledStartDates"
            @focusin.native="onOpenedStart"
            @input="onChangeStartDate"
          />
        </div>
        <div
          v-show="bookingType != 1 && ((bookingType == 2 && type == 'check-out-popover') || bookingType == 3)"
          class="popover-div date-picker"
        >
          <vuejs-datepicker
            :value="endDate"
            :wrapper-class="bookingType == 3 ? 'end-date' : ''"
            format="dd/MM/yyyy"
            :disabled-dates="disabledEndDates"
            @focusin.native="onOpenedEnd"
            @input="onChangeEndDate"
          />
        </div>
      </div>
      <div
        v-show="bookingType == 1"
        class="popover-item popover-content"
      >
        <div class="popover-div start-time">
          <TimePicker
            :obj-time="objCheckInTime"
            :value="startTime"
            @setTime="setStartTime"
          />
        </div>
        <div class="popover-div end-time">
          <TimePicker
            :obj-time="objCheckOutTime"
            :value="endTime"
            @setTime="setEndTime"
          />
        </div>
      </div>
      <div class="popover-footer">
        <button @click="onClose">OK</button>
      </div>
    </template>
  </ThePopover>
</template>

<script>
  import ThePopover from "~jsPartialPath/global/component/g2j-popover/ThePopover.vue";
  import TimePicker from "~jsPartialPath/global/component/go2joyTimePicker/TheTimePicker.vue";

  export default {
    components: {
      ThePopover,
      TimePicker,
      vuejsDatepicker,
    },
    props: {
      type: {
        type: String,
        default: ""
      },
      objCheckIn:{
        type: Object,
        default: null
      },
      objCheckOut:{
        type: Object,
        default: null
      },
      startTimePick:{
        type: String,
        default: ""
      },
      endTimePick:{
        type: String,
        default: ""
      },
      startDatePicker: {
        type: Date,
        default: new Date()
      },
      endDatePicker: {
        type: Date,
        default: new Date()
      },
      bookingType: {
        type: Number,
        default: 1
      }
    },
    data () {
      return {
        disabledStartDates: {},
        disabledEndDates: {},
        startTime: '',
        endTime:   '',
        startDate: new Date(),
        endDate:   new Date(),
        objCheckInTime : {},
        objCheckOutTime: {}
      };
    },
    computed: {

    },
    watch: {
      objCheckIn(val) {
        this.objCheckInTime = val || {};
      },
      objCheckOut(val) {
        this.objCheckOutTime = val || {};
      },
      startTimePick(val){
        this.startTime = val;
      },
      endTimePick(val) {
        this.endTime   = val;
      },
      startDatePicker(val){
        this.startDate = val;
      },
      endDatePicker(val){
        this.endDate = val;
      },
    },
    created () {
    },
    mounted () {
    },
    methods: {
      onShow () {
        if (this.$route.query.mode == 2) return
        this.$refs.popover.show();
      },
      onClose () {
        this.$refs.popover.hide();
      },
      onOpenedStart(){
        // if current time doesn't pass start time hour
        if(new Date().getHours() < this.objCheckInTime.startTimeHour){
          let passDate = new Date();
          this.disabledStartDates = {
            to: new Date(passDate.getFullYear(),passDate.getMonth(),new Date().getDate()-1)
          }
        }else{
          this.disabledStartDates = {
            to: new Date(Date.now() - 8.64e7)
          }
        }
      },
      onOpenedEnd(){
        this.disabledEndDates = {
          to: new Date(this.startDate.getFullYear(),this.startDate.getMonth(),this.startDate.getDate()+1)
        };
      },
      onChangeStartDate (date) {
        this.$emit('onChangeStartDate',date);
      },
      onChangeEndDate (date) {
        this.$emit('onChangeEndDate',date);
      },
      setStartTime (time) {
        this.$emit('setStartTime', time);
      },
      setEndTime (time) {
        this.$emit('setEndTime', time);
      }
    }
  };
</script>
