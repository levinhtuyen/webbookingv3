<template>
  <div class="g2j-calendar">
    <div class="g2j-calendar__header">
      <span class="g2j-calendar__header--title">{{title}}</span>
      <span
        @click="onClickTitle()"
        class="g2j-calendar__header--date"
      >
        {{time? time :''}} {{formatMMM}}
      </span>
    </div>
    <div class="g2j-calendar__today">
      <span class="g2j-calendar__today--item">
        <span class="btn-left">
          <!-- @click="prevMonth()" -->
          <i class="fas fa-chevron-left calendar-swiper-button-prev"></i>
        </span>
        <!-- {{formatMMYYYY}} -->
        {{dataCalendar.length? dataCalendar[indexSlide].month :""}}
        <span class="btn-right">
          <!-- @click="nextMonth()" -->
          <i class="fas fa-chevron-right calendar-swiper-button-next"></i>
        </span>

      </span>
    </div>
    <hr class="g2j-calendar__hr">
    <!-- <div class="g2j-calendar__main">
      <div
        class="g2j-calendar__main--title-date"
        v-for="(v,k) in headerCalendar"
        :key="k"
      >
        {{v.name}}
      </div>
      <button
        class="g2j-calendar__main--item-date"
        v-for="(v,k) in arrCalendar"
        :key="k"
        @click="onSelectDay(v)"
        :class="[{active: isSameDay(v)},{'disable-agoda': isCheckAgoda(v)}]"
        :disabled="onDisable(v)"
      >
        {{v? v.getDate(): ''}}
      </button>
    </div> -->
    <g2j-swiper-component
      :name="'calendar-swiper'"
      :data.sync="dataCalendar"
      :breakpoints="breakpoints"
      @initSwiper="actionSwiper"
      :optionMore="{
        speed: 300,
      }"
    >
      <!-- initialSlide: 1 -->
      <template slot-scope="slotProps">
        <!-- <div>
          {{slotProps.item.month}}
        </div> -->
        <div class="g2j-calendar__main">
          <div
            class="g2j-calendar__main--title-date"
            v-for="(v,k) in headerCalendar"
            :key="k"
          >
            {{v.name}}
          </div>
          <button
            class="g2j-calendar__main--item-date"
            v-for="(v,k) in slotProps.item.data"
            :key="k"
            @click="onSelectDay(v)"
            :class="[{active: isSameDay(v)},{'disable-agoda': isCheckAgoda(v)}, {'disabled': isCheck30day(v)}]"
            :disabled="onDisable(v)"
          >
            {{v? v.getDate(): ''}}
          </button>
        </div>
      </template>
    </g2j-swiper-component>
  </div>
</template>

<script>
  import { mapGetters, mapActions, mapState } from "~jsPath/lib/lib-manager";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/page-info-module";
  export default {
    props: {
      title: String,
      selectDate: {
        type: String,
        // default: dayjs(),
      },
      startDisable: {
        type: String,
        // default: dayjs(),
      },
      endDisable: {
        type: String,
        // default: dayjs(),
      },
      isAgoda: {
        type: Boolean,
        default: false,
      },
      time: [String, Object],
      isCheckOut: {
        type: Boolean,
        default: false,
      },
    },
    components: {
      "g2j-swiper-component": () =>
        import(
          "~jsPartialPath/global/component/g2j-swiper-base/Go2JoySwiper.vue"
        ),
    },
    data() {
      return {
        headerCalendar: [
          { id: 1, value: 0, name: "S" },
          { id: 2, value: 0, name: "M" },
          { id: 3, value: 0, name: "T" },
          { id: 4, value: 0, name: "W" },
          { id: 5, value: 0, name: "T" },
          { id: 6, value: 0, name: "F" },
          { id: 7, value: 0, name: "S" },
        ],
        arrCalendar: [],
        toDay: dayjs(),
        curMonth: dayjs(),
        curYear: new Date().getFullYear(),
        breakpoints: {
          320: {
            slidesPerView: 1,
          },
        },
        dataCalendar: [],
        indexSlide: 0,
        prevM: null,
        nextM: null,
        swiperComponent: null,
      };
    },
    created() {
      this.initData();
      // this.initCalendar();
    },
    mounted() {
      this.prevM = dayjs(this.curMonth).subtract(1, "month");
      this.nextM = dayjs(this.curMonth).add(1, "month");
      this.dataCalendar = [
        // {
        //   month: this.prevM.format("MM.YYYY"),
        //   data: this.initItemCalendar(
        //     this.prevM.get("month"),
        //     this.prevM.get("year")
        //   ),
        // },
        {
          month: dayjs(this.curMonth).format("MM.YYYY"),
          data: this.initItemCalendar(
            dayjs(this.curMonth).get("month"),
            dayjs(this.curMonth).get("year")
          ),
        },
        {
          month: this.nextM.format("MM.YYYY"),
          data: this.initItemCalendar(
            this.nextM.get("month"),
            this.nextM.get("year")
          ),
        },
      ];

      while (dayjs(this.toDay).diff(dayjs(this.nextM), "month") >= 0) {
        this.nextM = dayjs(this.nextM).add(1, "month");
        this.dataCalendar.push({
          month: this.nextM.format("MM.YYYY"),
          data: this.initItemCalendar(
            this.nextM.get("month"),
            this.nextM.get("year")
          ),
        });
      }
    },
    methods: {
      dayjs: window.dayjs,

      actionSwiper(swiper) {
        let self = this;
        // self.indexSlide = swiper.activeIndex;
        self.swiperComponent = swiper;
        self.onClickTitle();
        // swiper.update(() => {});
        // swiper.on("activeIndexChange", function () {});
        // swiper.on("slideChangeTransitionStart", function () {});
        // swiper.on("transitionEnd", function () {});
        // swiper.on("slidePrevTransitionEnd", function () {});
        // swiper.on("slidesLengthChange", function () {});
        swiper.on("slideChange", function () {
          self.indexSlide = this.realIndex;
          if (this.realIndex == 0) {
            // self.prevM = dayjs(self.prevM).subtract(1, "month");
            // self.dataCalendar.unshift({
            //   month: dayjs(self.prevM).format("MM.YYYY"),
            //   data: self.initItemCalendar(
            //     dayjs(self.prevM).get("month"),
            //     dayjs(self.prevM).get("year")
            //   ),
            // });
          }
          if (this.realIndex == self.dataCalendar.length - 1) {
            self.nextM = dayjs(self.nextM).add(1, "month");
            self.dataCalendar.push({
              month: dayjs(self.nextM).format("MM.YYYY"),
              data: self.initItemCalendar(
                dayjs(self.nextM).get("month"),
                dayjs(self.nextM).get("year")
              ),
            });
          }
        });
      },
      initData() {
        if (this.selectDate) {
          this.toDay = new Date(this.selectDate);
          // this.curMonth = new Date(this.selectDate);
          // this.curYear = new Date(this.selectDate).getFullYear();
        }
      },
      getDaysInMonth(month, year) {
        let date = new Date(year, month, 1);
        let days = [];
        while (date.getMonth() === month) {
          days.push(new Date(date));
          date.setDate(date.getDate() + 1);
        }
        return days;
      },
      initCalendar() {
        let dateFromMonth = new Date(this.curMonth);
        let month = dateFromMonth.getMonth();
        let arr = this.getDaysInMonth(month, this.curYear);
        // let first = arr[0];
        let firstDay = arr[0].getDay();
        this.arrCalendar = [];
        this.arrCalendar.length = firstDay;
        this.arrCalendar = [...this.arrCalendar, ...arr];
      },
      initItemCalendar(month, year) {
        let arr = this.getDaysInMonth(month, year);
        let firstDay = arr[0].getDay();
        let result = [];
        result.length = firstDay;
        result = [...result, ...arr];
        return result;
      },
      onSelectDay(day) {
        if (this.isCheckAgoda(day)) {
          this.$emit("onClickDisableAgoda");
          return;
        }

        if (this.isCheck30day(day)) {
          this.$emit("onClickDisable30day");
          return;
        }
        this.toDay = dayjs(day);
        this.$emit("update:selectDate", this.toDay);
      },

      prevMonth() {
        let date = new Date(this.curMonth);
        if (date.getMonth() == 0) {
          this.curMonth = new Date(date.getFullYear() - 1, 11, 1);
          this.curYear = date.getFullYear() - 1;
        } else {
          this.curMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        }
        this.initCalendar();
      },
      nextMonth() {
        let date = new Date(this.curMonth);
        if (date.getMonth() == 11) {
          this.curMonth = new Date(date.getFullYear() + 1, 0, 1);
          this.curYear = date.getFullYear() + 1;
        } else {
          this.curMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        }
        this.initCalendar();
      },
      isSameDay(day) {
        if (!day) return;
        let check = new Date(this.toDay);
        return (
          day.getDate() == check.getDate() &&
          day.getMonth() == check.getMonth() &&
          day.getFullYear() == check.getFullYear()
        );
      },
      onDisable(day) {
        let checkBefore;
        let checkAfter;
        let check30day;
        // let checkAgoda; //check neu la agoda thi k the book qua 14 ngay
        if (this.startDisable) {
          checkBefore = dayjs(day).isBefore(dayjs(this.startDisable));
        }
        if (this.endDisable) {
          checkAfter = dayjs(day).isAfter(dayjs(this.endDisable));
        }
        // if (this.isAgoda) {
        //   checkAgoda =
        //     dayjs(day).diff(dayjs(this.startDisable).subtract(1, "day"), "day") >
        //     14;
        // }
        // || checkAgoda
        // if (this.isCheckOut) {
        //   check30day =
        //     dayjs(day).diff(dayjs(this.startDisable).subtract(1, "day"), "day") >
        //     30;
        // }

        return checkBefore || checkAfter;
      },
      isCheck30day(day) {
        let check30day;
        if (this.isCheckOut) {
          check30day =
            dayjs(day).diff(dayjs(this.startDisable).subtract(1, "day"), "day") >
            30;
        }
        return check30day;
      },
      isCheckAgoda(day) {
        let checkAgoda; //check neu la agoda thi k the book qua 14 ngay
        if (this.isAgoda) {
          checkAgoda =
            dayjs(day).diff(dayjs(this.startDisable).subtract(1, "day"), "day") >
            14;
        }
        return checkAgoda;
      },
      onClickTitle() {
        // this.curMonth = new Date(this.toDay);
        // this.curYear = new Date(this.toDay).getFullYear();
        // this.initCalendar();

        let month = dayjs(this.toDay).get("month") + 1;

        let index = this.dataCalendar.findIndex(
          (el, i) => el.month.slice(0, 2) == month
        );

        if (index != -1) {
          this.swiperComponent.activeIndex = index;
          this.indexSlide = index;
          this.swiperComponent.update();
        }
      },
    },
    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),
      formatMMM() {
        let CDate = dayjs(this.toDay).locale(this.language).format("DD/MM/YYYY");

        return CDate;
      }, // formatMMM()
      formatMMYYYY() {
        let date = dayjs(this.curMonth).locale(this.language).format("MM. YYYY");
        return date;
      }, // formatMMYYYY()
      // dataCalendar() {
      //   let d = dayjs(this.curMonth);
      //   return [
      //     {
      //       data: this.initItemCalendar(
      //         d.subtract(1, "month").get("month"),
      //         d.get("year")
      //       ),
      //     },
      //     {
      //       data: this.initItemCalendar(d.get("month"), d.get("year")),
      //     },
      //     {
      //       data: this.initItemCalendar(
      //         d.add(1, "month").get("month"),
      //         d.add(1, "month").get("year")
      //       ),
      //     },
      //   ];
      // },
    },
    watch: {
      indexSlide(val) {},
    },
  };
</script>

<style>
</style>
