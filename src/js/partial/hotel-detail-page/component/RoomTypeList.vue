<template>
  <div class="section-room-type">
    <div
      v-for="(roomTypeItem, idx) in listRoomType"
      :key="idx"

    >
      <BlockRoom
        class="section-room-type__item"
        :key="roomTypeItem.sn"
        :hotel-item-info="roomTypeItem"
        :lazyloadClass="minRoomType <= idx + 1 ? 'swiper-lazy' : 'lazyload'"
        @activeRoom="val => $emit('activeRoom',val)"
      />
      <div class="section-room-type__item--label">
        <CheckLabel
          :roomTypeItem="roomTypeItem"
          :dataSetting="dataHotel"
        ></CheckLabel>
      </div>
    </div>
  </div>
</template>

<script>
  import { IS_MOBILE, IS_SAFARI_BROWSER } from "~jsDefinePath/general";
  import { _ } from "~jsLibPath/lib-manager";
  import CheckLabel from './CheckLabel.vue'
  import BlockRoom from "./BlockRoom.vue";
  export default {
    components: {
      BlockRoom,
      CheckLabel
    },
    props: {
      dataRoomTypeList: [Array, Object],
      dataHotelDetail: [Array, Object]
    },
    data () {
      return {
        IS_MOBILE,
        value: true,
        minRoomTypeToScrollEachBreakPoint: {
          "768px": 2,
          "320px": 1
        },
        roomTypeSwiper: null,
        IS_SAFARI_BROWSER,
        curBreakPoint: null,

        roomTypeReadmoreClass: "disable-readmore"
      };
    },
    computed: {
      listRoomType () {
        return this.dataRoomTypeList;
      },
      dataHotel () {
        return this.dataHotelDetail;
      }
    },
    methods: {
      isEmpty: _.isEmpty,

    },
    created () { }
  };
</script>
