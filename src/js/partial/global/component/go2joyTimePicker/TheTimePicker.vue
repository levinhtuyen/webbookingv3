<template>
  <div
    class="time-picker"
    :class="customTimePickerClass"
  >
    <div
      ref="dropdown"
      class="g2j-dropdown-box time-picker__dropdown-box is-center"
      @click.stop="open()"
    >
      <div
        class="g2j-dropdown-box__head g2j-dropdown-box-head"
      >
        <i class="far fa-clock" />
        <span>{{ valueTime }}</span>
        <i
          v-if="valueTime != ' ' && isClear == true"
          class="far fa-times-circle"
          aria-hidden="true"
          @click="clearValue()"
        />
      </div> <!-- .g2j-dropdown-box__head -->
      <div
        class="g2j-dropdown-box__body g2j-dropdown-box-body scroll-bar-custom"
      >
        <div
          v-for="range in rangeTime"
          :key="range.time"
          :value="range.time"
          :class="(start && range.num < start.hour || (range.num == start.hour && range.min < start.min)) || (end && range.num > end.hour || (range.num == end.hour && range.min > end.min )) ? 'hide' : ''"
          class="time-picker-item"
          @click.stop="onPickTime(range.time)"
        >
          <!--condition in class will disable from start to before and end time to after   -->
          {{ range.time }}
        </div>
      </div>
    </div> <!-- .g2j-dropdown-box -->
  </div>
</template>

<script>
import { onClickEvent } from '~jsHelperPath/util/PrivateEventCustom';

export default {
  props: {
    customTimePickerClass: {
      type   : String,
      default: ""
    },
    objTime: {
      type   : Object,
      default: null
    },
    value:{
      type   : String,
      default: ""
    },
    isClear:{
      type   : Boolean,
      default: false
    }
  },
  data() {
    return {
      rangeTime:   [],
      valueTime:   this.value,
      elTimePickerDropdownBox: null,
    };
  },
  computed: {
    start: {
      get: function () {
        let time = this.objTime.start.split(':');
        return {hour: Number(time[0]), min : Number(time[1])}
      },
      // set: function (data) {
      //   this.objTime.start = data
      // }
    },
    end: {
      get: function () {
        let time = this.objTime.end.split(':');
        return {hour: Number(time[0]), min : Number(time[1])}
      },
      // set: function (data) {
      //   this.objTime.end = data
      // }
    }
  },
  watch: {
    value: function(val) {
      this.valueTime = val
    },
    objTime: function(){
      this.rangeTime = this.getRangeTime();
    },
  },
  created() {
  },
  mounted() {
    const self = this;
    self.elTimePickerDropdownBox = document.getElementsByClassName('time-picker__dropdown-box');
    onClickEvent(document, function() {
      if(self.$refs.dropdown){
        self.$refs.dropdown.classList.remove('is-show');
      }
    });
  },
  methods: {
    open(){
      this.hideAllTimePickerDropdownBox();
      this.$refs.dropdown.classList.add('is-show');
    },

    onPickTime(time) {
      this.valueTime = time;
      this.$refs.dropdown.classList.remove('is-show');
      this.$emit('setTime',time)
    },

    clearValue(){
      this.valueTime = ' ';
      this.$emit('setTime',' ');
    },

    hideAllTimePickerDropdownBox() {
      if(this.elTimePickerDropdownBox.length) {
        for( const elItem of this.elTimePickerDropdownBox ) {
          elItem.classList.remove('is-show');
        }
      }
    }, // hideAllTimePickerDropdownBox()

    getRangeTime() {
      let range       = [];
      let count       = 1;// num of loop in 1 hour(ex: 30 min => loop 2 times)
      let hour        = 0;
      let min         = 0;
      let i           = 0;// num of loop to max time (ex:maxTime=24 => loop 24 times)
      let steps       = this.objTime.step.split(':');
      let maxTime     = this.objTime.maxTime.split(':');
      let minTime     = this.objTime.minTime.split(':');
      if(Number(steps[0]) == 0){
        const stepMin = Number(steps[1]);
        do {// if step is min (00:30)
          if(i > Number(minTime[0])){
            range.push({
                time: `${hour}:${min < 10 ? min+'0' : min}`,
                num:  hour,
                min:  min
              }
            );
          }
          if(count < (60/stepMin)){
              count++;
              min+=stepMin
          }else{// end loop 1 hour an restart new loop of next hour
              hour++
              count = 1
              min   = 0
          }
          i++
        } while (i <= Number(maxTime[0])*(60/stepMin));
      }else{
        let start = this.objTime.start.split(':');
        const min = Number(start[1]);
        do {// if step is hour (01:00)
          range.push({
              time: `${hour}:${min < 10 ? min+'0' : min}`,
              num:  hour,
              min:  min
            }
          );
          hour++
        } while (hour <= Number(maxTime[0]));
      }
      return range;
    }, // getRangeTime()
  }
};
</script>
