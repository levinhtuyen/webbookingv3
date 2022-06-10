<template>
    <div>
        <div v-html="getSoldOut(getDataRoom, getDataSetting.roomSettingFormList)"></div>
        <div v-html="getCheckRoom(getDataRoom, getDataSetting.roomSettingFormList)"></div>
        <div v-html="getCheckLockDaily(getDataRoom, getDataSetting.roomSettingFormList)"></div>
        <div v-html="getLabelHasGift(getDataRoom)"></div>
    </div>
</template>

<script>
export default {
    name: "CheckLabel",
    props: {
        roomTypeItem : [Array,Object],
        dataSetting :[Array,Object]
    },
    data() {
        return {

        }
    },
    computed: {
        getDataRoom(){
            return this.roomTypeItem
        },
        getDataSetting(){
            return this.dataSetting
        },
    },
    methods: {
        getSoldOut(dataHotel) {
        if (dataHotel.status == 2) {
          return `<div class="col-12 style-lock-room"></p><p class="style-lock-room-p">
                        <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                        <span class="style-lock-text"> `+ `${this.$t("hotel_detail.sold-out-today")}` + `</span></p></div>`;
        }
        },
        getCheckRoom (dataHotel, dataSetting){
            let dataSettingRoom = null
            dataSetting.forEach(el => {
            if (dataHotel.sn == el.roomTypeSn) {
                dataSettingRoom = el
            }
            })
            if (dataSettingRoom.notConfirmed == false && (dataSettingRoom.wHourly == false || dataSettingRoom.wDaily == false || dataSettingRoom.wOvernight == false)) {
            if (dataSettingRoom.sunday == false && dataSettingRoom.saturday == false && dataSettingRoom.friday == false && dataSettingRoom.wHourly == false && dataSettingRoom.wDaily == false && dataSettingRoom.wOvernight == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}`+` :` + `${this.$t("hotel_detail.hourly")} ${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime}, ${this.$t("hotel_detail.overnight")} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.daily")} ${this.$t("hotel_detail.friday")}, ${this.$t("hotel_detail.saturday")}, ${this.$t("hotel_detail.sunday")}` + `</span></p></div>`
            } else if (dataSettingRoom.sunday == false && dataSettingRoom.saturday == false && dataSettingRoom.friday == false && dataSettingRoom.wHourly == false && dataSettingRoom.wDaily == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}`+` :` + `${this.$t("hotel_detail.hourly")} ${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.daily")} ${this.$t("hotel_detail.friday")}, ${this.$t("hotel_detail.saturday")}, ${this.$t("hotel_detail.sunday")}` + `</span></p></div>`
            } else if (dataSettingRoom.sunday == false && dataSettingRoom.saturday == false && dataSettingRoom.friday == false && dataSettingRoom.wHourly == false && dataSettingRoom.wOvernight == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}`+` :` + `${this.$t("hotel_detail.hourly")} ${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.overnight")} ${this.$t("hotel_detail.friday")}, ${this.$t("hotel_detail.saturday")}, ${this.$t("hotel_detail.sunday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_hourly_overnight_weekend, dataSettingRoom.getwStartTime(), dataSettingRoom.getwEndTime())
            } else if (dataSettingRoom.sunday == false && dataSettingRoom.saturday == false && dataSettingRoom.friday == false && dataSettingRoom.wDaily == false && dataSettingRoom.wOvernight == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")} ${this.$t("hotel_detail.overnight")} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.daily")} ${this.$t("hotel_detail.friday")}, ${this.$t("hotel_detail.saturday")}, ${this.$t("hotel_detail.sunday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_overnight_daily_weekend)
            } else if (dataSettingRoom.saturday == false && dataSettingRoom.friday == false && dataSettingRoom.wHourly == false && dataSettingRoom.wDaily == false && dataSettingRoom.wOvernight == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")} ${this.$t("hotel_detail.friday")}, ${this.$t("hotel_detail.saturday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_friday_saturday_weekend)
            } else if (dataSettingRoom.sunday == false && dataSettingRoom.friday == false && dataSettingRoom.wHourly == false && dataSettingRoom.wDaily == false && dataSettingRoom.wOvernight == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")} ${this.$t("hotel_detail.friday")}, ${this.$t("hotel_detail.saturday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_friday_sunday_weekend)
            } else if (dataSettingRoom.sunday == false && dataSettingRoom.saturday == false && dataSettingRoom.wHourly == false && dataSettingRoom.wDaily == false && dataSettingRoom.wOvernight == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")} ${this.$t("hotel_detail.saturday")}, ${this.$t("hotel_detail.sunday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_saturday_sunday_weekend)
            } else if (dataSettingRoom.sunday == false && dataSettingRoom.saturday == false && dataSettingRoom.friday == false && dataSettingRoom.wHourly == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}`+` :` + `${this.$t("hotel_detail.hourly")} ${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime}  ${this.$t("hotel_detail.friday")}, ${this.$t("hotel_detail.saturday")}, ${this.$t("hotel_detail.sunday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_hourly_weekend, dataSettingRoom.getwStartTime(), dataSettingRoom.getwEndTime())
            } else if (dataSettingRoom.sunday == false && dataSettingRoom.saturday == false && dataSettingRoom.friday == false && dataSettingRoom.wOvernight == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")} ${this.$t("hotel_detail.overnight")}  ${this.$t("hotel_detail.friday")}, ${this.$t("hotel_detail.saturday")}, ${this.$t("hotel_detail.sunday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_overnight_weekend)
            } else if (dataSettingRoom.sunday == false && dataSettingRoom.saturday == false && dataSettingRoom.friday == false && dataSettingRoom.wDaily == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}  ${this.$t("hotel_detail.daily")} ${this.$t("hotel_detail.friday")}, ${this.$t("hotel_detail.saturday")}, ${this.$t("hotel_detail.sunday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_dayly_weekend)
            } else if (dataSettingRoom.saturday == false && dataSettingRoom.friday == false && dataSettingRoom.wHourly == false && dataSettingRoom.wOvernight == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}`+` :` + `${this.$t("hotel_detail.hourly")} ${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.overnight")} ${this.$t("hotel_detail.friday")}, ${this.$t("hotel_detail.saturday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_hourly_overnight_firday_saturday_weekend, dataSettingRoom.getwStartTime(), dataSettingRoom.getwEndTime())
            } else if (dataSettingRoom.saturday == false && dataSettingRoom.friday == false && dataSettingRoom.wHourly == false && dataSettingRoom.wDaily == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}`+` :` + `${this.$t("hotel_detail.hourly")} ${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime} ${this.$t("hotel_detail.and")} daily ${this.$t("hotel_detail.friday")}, ${this.$t("hotel_detail.saturday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_hourly_daily_firday_saturday_weekend, dataSettingRoom.getwStartTime(), dataSettingRoom.getwEndTime())
            } else if (dataSettingRoom.saturday == false && dataSettingRoom.friday == false && dataSettingRoom.wDaily == false && dataSettingRoom.wOvernight == false) {
                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")} ${this.$t("hotel_detail.overnight")} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.daily")} ${this.$t("hotel_detail.friday")}, ${this.$t("hotel_detail.saturday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_overnight_daily_firday_daily_weekend)
            } else if (dataSettingRoom.sunday == false && dataSettingRoom.friday == false && dataSettingRoom.wHourly == false && dataSettingRoom.wOvernight == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}`+` :` + `${this.$t("hotel_detail.hourly")} ${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.overnight")} ${this.$t("hotel_detail.friday")}, ${this.$t("hotel_detail.sunday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_hourly_overnight_firday_sunday_weekend, dataSettingRoom.getwStartTime(), dataSettingRoom.getwEndTime())
            } else if (dataSettingRoom.sunday == false && dataSettingRoom.friday == false && dataSettingRoom.wHourly == false && dataSettingRoom.wDaily == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}`+` :` + `${this.$t("hotel_detail.hourly")} ${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.daily")} ${this.$t("hotel_detail.friday")}, ${this.$t("hotel_detail.sunday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_hourly_daily_firday_sunday_weekend, dataSettingRoom.getwStartTime(), dataSettingRoom.getwEndTime())
            } else if (dataSettingRoom.sunday == false && dataSettingRoom.friday == false && dataSettingRoom.wDaily == false && dataSettingRoom.wOvernight == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")} ${this.$t("hotel_detail.overnight")} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.daily")} ${this.$t("hotel_detail.friday")}, ${this.$t("hotel_detail.sunday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_overnight_daily_firday_sunday_weekend)
            } else if (dataSettingRoom.friday == false && dataSettingRoom.saturday == false && dataSettingRoom.wHourly == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}`+` :` + `${this.$t("hotel_detail.hourly")} ${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime} ${this.$t("hotel_detail.friday")}, ${this.$t("hotel_detail.saturday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_hourly_friday_saturday_weekend, dataSettingRoom.getwStartTime(), dataSettingRoom.getwEndTime())
            } else if (dataSettingRoom.sunday == false && dataSettingRoom.saturday == false && dataSettingRoom.wHourly == false && dataSettingRoom.wOvernight == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}`+` :` + `${this.$t("hotel_detail.hourly")} ${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.overnight")}  ${this.$t("hotel_detail.saturday")}, ${this.$t("hotel_detail.sunday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_hourly_overnight_saturday_sunday_weekend, dataSettingRoom.getwStartTime(), dataSettingRoom.getwEndTime())
            } else if (dataSettingRoom.sunday == false && dataSettingRoom.saturday == false && dataSettingRoom.wHourly == false && dataSettingRoom.wDaily == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}`+` :` + `${this.$t("hotel_detail.hourly")} ${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.daily")}  ${this.$t("hotel_detail.saturday")}, ${this.$t("hotel_detail.sunday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_hourly_daily_saturday_sunday_weekend, dataSettingRoom.getwStartTime(), dataSettingRoom.getwEndTime())
            } else if (dataSettingRoom.sunday == false && dataSettingRoom.saturday == false && dataSettingRoom.wDaily == false && dataSettingRoom.wOvernight == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")} ${this.$t("hotel_detail.overnight")} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.daily")}  ${this.$t("hotel_detail.saturday")}, ${this.$t("hotel_detail.sunday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_overnight_daily_saturday_sunday_weekend)
            } else if (dataSettingRoom.friday == false && dataSettingRoom.wHourly == false && dataSettingRoom.wDaily == false && dataSettingRoom.wOvernight == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}`+` :` + `${this.$t("hotel_detail.hourly")} ${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime}, ${this.$t("hotel_detail.overnight")} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.daily")} ${this.$t("hotel_detail.friday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_hourly_overnight_daily_friday_weekend, dataSettingRoom.getwStartTime(), dataSettingRoom.getwEndTime())
            } else if (dataSettingRoom.saturday == false && dataSettingRoom.wHourly == false && dataSettingRoom.wDaily == false && dataSettingRoom.wOvernight == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}`+` :` + `${this.$t("hotel_detail.hourly")} ${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime}, ${this.$t("hotel_detail.overnight")} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.daily")} ${this.$t("hotel_detail.saturday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_hourly_overnight_daily_saturday_weekend, dataSettingRoom.getwStartTime(), dataSettingRoom.getwEndTime())
            } else if (dataSettingRoom.sunday == false && dataSettingRoom.wHourly == false && dataSettingRoom.wDaily == false && dataSettingRoom.wOvernight == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}`+` :` + `${this.$t("hotel_detail.hourly")} ${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime}, ${this.$t("hotel_detail.overnight")} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.daily")} ${this.$t("hotel_detail.sunday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_hourly_overnight_daily_sunday_weekend, dataSettingRoom.getwStartTime(), dataSettingRoom.getwEndTime())
            } else if (dataSettingRoom.friday == false && dataSettingRoom.wHourly == false && dataSettingRoom.wDaily == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}`+` :` + `${this.$t("hotel_detail.hourly")} ${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.daily")} ${this.$t("hotel_detail.friday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_hourly_daily_friday_weekend, dataSettingRoom.getwStartTime(), dataSettingRoom.getwEndTime())
            } else if (dataSettingRoom.friday == false && dataSettingRoom.wHourly == false && dataSettingRoom.wOvernight == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}`+` :` + `${this.$t("hotel_detail.hourly")} ${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.overnight")} ${this.$t("hotel_detail.friday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_hourly_overnight_friday_weekend, dataSettingRoom.getwStartTime(), dataSettingRoom.getwEndTime())
            } else if (dataSettingRoom.friday == false && dataSettingRoom.wOvernight == false && dataSettingRoom.wDaily == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")} ${this.$t("hotel_detail.overnight")} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.daily")} ${this.$t("hotel_detail.friday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_overnight_daily_friday_weekend)
            } else if (dataSettingRoom.saturday == false && dataSettingRoom.wHourly == false && dataSettingRoom.wDaily == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}`+` :` + `${this.$t("hotel_detail.hourly")} ${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.daily")} ${this.$t("hotel_detail.saturday")}` + `</span></p></div>`

                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_hourly_daily_saturday_weekend, dataSettingRoom.getwStartTime(), dataSettingRoom.getwEndTime())
            } else if (dataSettingRoom.saturday == false && dataSettingRoom.wHourly == false && dataSettingRoom.wOvernight == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}`+` :` + `${this.$t("hotel_detail.hourly")} ${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.overnight")} ${this.$t("hotel_detail.saturday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_hourly_overnight_saturday_weekend, dataSettingRoom.getwStartTime(), dataSettingRoom.getwEndTime())
            } else if (dataSettingRoom.saturday == false && dataSettingRoom.wOvernight == false && dataSettingRoom.wDaily == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")} ${this.$t("hotel_detail.overnight")} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.daily")} ${this.$t("hotel_detail.saturday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_overnight_daily_saturday_weekend)
            } else if (dataSettingRoom.sunday == false && dataSettingRoom.wHourly == false && dataSettingRoom.wDaily == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}`+` :` + `${this.$t("hotel_detail.hourly")} ${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.daily")} ${this.$t("hotel_detail.sunday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_hourly_daily_sunday_weekend, dataSettingRoom.getwStartTime(), dataSettingRoom.getwEndTime())
            } else if (dataSettingRoom.sunday == false && dataSettingRoom.wHourly == false && dataSettingRoom.wOvernight == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}`+` :` + `${this.$t("hotel_detail.hourly")} ${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.overnight")} ${this.$t("hotel_detail.sunday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_hourly_overnight_sunday_weekend, dataSettingRoom.getwStartTime(), dataSettingRoom.getwEndTime())
            } else if (dataSettingRoom.sunday == false && dataSettingRoom.wOvernight == false && dataSettingRoom.wDaily == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")} ${this.$t("hotel_detail.overnight")} ${this.$t("hotel_detail.and")} ${this.$t("hotel_detail.daily")} ${this.$t("hotel_detail.sunday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_overnight_daily_sunday_weekend)
            } else if (dataSettingRoom.friday == false && dataSettingRoom.wHourly == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}`+` :` + `${this.$t("hotel_detail.hourly")} ${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime} ${this.$t("hotel_detail.friday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_hourly_friday_weekend, dataSettingRoom.getwStartTime(), dataSettingRoom.getwEndTime())
            } else if (dataSettingRoom.friday == false && dataSettingRoom.wOvernight == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")} ${this.$t("hotel_detail.overnight")} ${this.$t("hotel_detail.friday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_overnight_friday_weekend)
            } else if (dataSettingRoom.friday == false && dataSettingRoom.wDaily == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")} ${this.$t("hotel_detail.daily")} ${this.$t("hotel_detail.friday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_daily_friday_weekend)
            } else if (dataSettingRoom.saturday == false && dataSettingRoom.wHourly == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}`+` :` + `${this.$t("hotel_detail.hourly")} ${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime} ${this.$t("hotel_detail.saturday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_hourly_saturday_weekend, dataSettingRoom.getwStartTime(), dataSettingRoom.getwEndTime())
            } else if (dataSettingRoom.saturday == false && dataSettingRoom.wOvernight == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")} ${this.$t("hotel_detail.overnight")} ${this.$t("hotel_detail.saturday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_overnight_saturday_weekend)
            } else if (dataSettingRoom.saturday == false && dataSettingRoom.wDaily == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")} ${this.$t("hotel_detail.daily")} ${this.$t("hotel_detail.saturday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_daily_saturday_weekend)
            } else if (dataSettingRoom.sunday == false && dataSettingRoom.wHourly == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}`+` :` + `${this.$t("hotel_detail.hourly")} ${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime} ${this.$t("hotel_detail.sunday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_hourly_sunday_weekend, dataSettingRoom.getwStartTime(), dataSettingRoom.getwEndTime())
            } else if (dataSettingRoom.sunday == false && dataSettingRoom.wOvernight == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")} ${this.$t("hotel_detail.overnight")} ${this.$t("hotel_detail.sunday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_overnight_sunday_weekend)
            } else if (dataSettingRoom.sunday == false && dataSettingRoom.wDaily == false) {

                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")} ${this.$t("hotel_detail.daily")} ${this.$t("hotel_detail.sunday")}` + `</span></p></div>`
                // holder.tvSoldOutWeeken.text = context.getString(R.string.txt_3_2_sold_out_daily_sunday_weekend)
            }
            // else {
            //     holder.lnSoldOutWeeken.visibility = View.GONE
            // }
            }
        },
        getCheckLockDaily (dataHotel, dataSetting){
            let dataSettingRoom = null
            dataSetting.forEach(el => {
            if (dataHotel.sn == el.roomTypeSn) {
                dataSettingRoom = el
            }
            })

            if (dataSettingRoom.notConfirmed == false && dataSettingRoom.startDate != null && dataSettingRoom.endDate != null && (dataSettingRoom.sHourly == false || dataSettingRoom.sDaily == false || dataSettingRoom.sOvernight == false)) {
            if (dataSettingRoom.sHourly == false && dataSettingRoom.sDaily == false && dataSettingRoom.sOvernight == false) {
                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}` + `${this.$t("hotel_detail.hourly")}` + `${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime},` + `${this.$t("hotel_detail.overnight")}` +`${this.$t("hotel_detail.and")}` + `${this.$t("hotel_detail.daily")}` + `${this.$t("hotel_detail.from")}`  +`${dataSettingRoom.startDate}`+ `${this.$t("hotel_detail.to")}` +`${dataSettingRoom.endDate}` + `</span></p></div>`
                // holder.tvSoldOutOtherDay.text = context.getString(R.string.txt_3_2_sold_out_from_to, dataSettingRoom.getsStartTime(), dataSettingRoom.getsEndTime(), dataSettingRoom.startDateDDMM, dataSettingRoom.endDateDDMM)
            } else if (dataSettingRoom.sHourly == false && dataSettingRoom.sDaily == false) {
                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}` + `${this.$t("hotel_detail.hourly")}` + `${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime}`+ `${this.$t("hotel_detail.and")}` + `${this.$t("hotel_detail.daily")}` + `${this.$t("hotel_detail.from")}`+ `${dataSettingRoom.startDate}`+ `${this.$t("hotel_detail.to")}` +`${dataSettingRoom.endDate}` + `</span></p></div>`
                // holder.tvSoldOutOtherDay.text = context.getString(R.string.txt_3_2_sold_out_hourly_daily_from_to, dataSettingRoom.getsStartTime(), dataSettingRoom.getsEndTime(), dataSettingRoom.startDateDDMM, dataSettingRoom.endDateDDMM)
            } else if (dataSettingRoom.sHourly == false && dataSettingRoom.sOvernight == false) {
                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}` + `${this.$t("hotel_detail.hourly")}` + `${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime}` + `${this.$t("hotel_detail.and")}` + `${this.$t("hotel_detail.overnight")}` + `${this.$t("hotel_detail.from")}` + ` ${dataSettingRoom.startDate}`+ `${this.$t("hotel_detail.to")}` +`${dataSettingRoom.endDate}` + `</span></p></div>`
                // holder.tvSoldOutOtherDay.text = context.getString(R.string.txt_3_2_sold_out_hourly_overnight_from_to, dataSettingRoom.getsStartTime(), dataSettingRoom.getsEndTime(), dataSettingRoom.startDateDDMM, dataSettingRoom.endDateDDMM)
            } else if (dataSettingRoom.sDaily == false && dataSettingRoom.sOvernight == false) {
                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}` + `${this.$t("hotel_detail.overnight")}` + `${this.$t("hotel_detail.and")}` + `${this.$t("hotel_detail.daily")}` + `${this.$t("hotel_detail.from")}` + `${dataSettingRoom.startDate}`+ `${this.$t("hotel_detail.to")}` +`${dataSettingRoom.endDate}` + `</span></p></div>`
                // holder.tvSoldOutOtherDay.text = context.getString(R.string.txt_3_2_sold_out_overnight_daily_from_to, dataSettingRoom.startDateDDMM, dataSettingRoom.endDateDDMM)
            } else if (dataSettingRoom.sHourly == false) {
                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}` + `${this.$t("hotel_detail.hourly")}` + `${dataSettingRoom.wStartTime}~${dataSettingRoom.wEndTime} `+ `${this.$t("hotel_detail.from")}` + `${dataSettingRoom.startDate}`+ `${this.$t("hotel_detail.to")}` +`${dataSettingRoom.endDate}` + `</span></p></div>`
                // holder.tvSoldOutOtherDay.text = context.getString(R.string.txt_3_2_sold_out_hourly_from_to, dataSettingRoom.getsStartTime(), dataSettingRoom.getsEndTime(), dataSettingRoom.startDateDDMM, dataSettingRoom.endDateDDMM)
            } else if (dataSettingRoom.sDaily == false) {
                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}` + `daily ` + `${this.$t("hotel_detail.from")}` +`${dataSettingRoom.startDate}`+ `${this.$t("hotel_detail.to")}` +`${dataSettingRoom.endDate}` + `</span></p></div>`
                // holder.tvSoldOutOtherDay.text = context.getString(R.string.txt_3_2_sold_out_daily_from_to, dataSettingRoom.startDateDDMM, dataSettingRoom.endDateDDMM)
            } else if (dataSettingRoom.sOvernight == false) {
                return `<div class="col-12 style-lock-room"><p class="style-lock-room-p">
                            <span class="style-lock-i"><i class="style-lock fas fa-lock"></i></span>
                            <span class="style-lock-text">` + `${this.$t("hotel_detail.sold_out")}` + `${this.$t("hotel_detail.overnight")}` + `${this.$t("hotel_detail.from")}` +` ${dataSettingRoom.startDate}`+ `${this.$t("hotel_detail.to")}` +`${dataSettingRoom.endDate}` + `</span></p></div>`
                // holder.tvSoldOutOtherDay.text = context.getString(R.string.txt_3_2_sold_out_overnight_from_to, dataSettingRoom.startDateDDMM, dataSettingRoom.endDateDDMM)
            }
            }
        },
        getLabelHasGift (item) {
            let hasGift = false
            if (!item.displayRule) {
            return
            } else if (item.displayRule.typeDisplay) {
            item.displayRule.typeDisplay.forEach(room => {
                if (room == 5 || room == 6) {
                hasGift = true
                }
            })
            }
            if (hasGift == true) {
            return `<div class="label-addition">
                        <p> ` + `${this.$t("hotel_detail.get-addition")}` + ` ${item.bonusHour}` + ` ${this.$t("hotel_detail.more-hours-free")}` + ` ${item.minProHour}` + ` ${this.$t("hotel_detail.hours")}</p>
                    </div>`
            }
        },
    },
}
</script>

<style lang="scss" scoped>

</style>
