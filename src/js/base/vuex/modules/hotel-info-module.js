import { _ } from "~jsPath/lib/lib-manager";

import { AJAX_URL } from "~jsDefinePath/ajax-url";
import { getUrlQueryString } from "~jsPath/helper/util/HandleUrl";
import { getToken } from "~jsDefinePath/general";
import { apiCaller } from "~jsHelperPath/service/ApiHandler";

const MODULE_NAME = "hotelInfoModule";

const MUTATIONS_KEY = {
  setHotelInfo: "setHotelInfo",
  setHotelInfoV4: "setHotelInfoV4",
  setRoomActive: "setRoomActive",
};

const COMMIT_KEY = {
  setHotelInfo: MODULE_NAME + "/" + MUTATIONS_KEY.setHotelInfo,
  setHotelInfoV4: MODULE_NAME + "/" + MUTATIONS_KEY.setHotelInfoV4,
  setRoomActive: MODULE_NAME + "/" + MUTATIONS_KEY.setRoomActive,
};

const hotelInfoModule = {
  namespaced: true,

  state: {
    hotelInfo: null,
    hotelInfoV4: null,
    roomActive: null,
  },

  getters: {
    hotelInfo(state) {
      return state.hotelInfo;
    },
    hotelInfoV4(state) {
      return state.hotelInfoV4;
    },
    roomActive(state) {
      return state.roomActive;
    },
  },

  mutations: {
    [MUTATIONS_KEY.setHotelInfo](state, hotelInfo) {
      state.hotelInfo = hotelInfo;
    },
    [MUTATIONS_KEY.setHotelInfoV4](state, hotelInfoV4) {
      state.hotelInfoV4 = hotelInfoV4;
    },
    [MUTATIONS_KEY.setRoomActive](state, roomActive) {
      let result = { ...roomActive };
      state.roomActive = result;
    },
  },
  actions: {
    async getHotelInfo({ commit }, { sn, query }) {
      EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
      try {
        let res = await apiCaller({
          metaUrl: AJAX_URL.hotel.info,
          dataType: "json",
          data: query,
          method: "GET",
          contentType: "application/json; charset=utf-8",
        });
        commit(MUTATIONS_KEY.setHotelInfo, res.data);
        EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
      } catch (error) {
        console.log("error :>> ", error);
        setTimeout(() => {
          EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          EventBus.emit("REDIRECT-404-PAGE");
        }, 3500);
      }
    },
    async getHotelInfoV4({ commit }, { sn, query }) {
      // EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
      try {
        let res = await apiCaller({
          metaUrl: AJAX_URL.hotel.infoV4,
          dataType: "json",
          data: query,
          headers: {
            Authorization: getToken(),
          },
          method: "GET",
          contentType: "application/json; charset=utf-8",
        });

        if (_.isEmpty(res.data)) {
          EventBus.emit("REDIRECT-404-PAGE");
        } else {
          commit(MUTATIONS_KEY.setHotelInfoV4, res.data);
        }
      } catch (error) {
        console.log("error :>> ", error);
        EventBus.emit("REDIRECT-404-PAGE");
      } finally {
        EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
      }
    },
    setRoomActive({ commit }, room) {
      // console.log('room :>> ', room);
      // let obj ={
      //   roomName: room.name,
      //   roomSn: room.sn,
      //   mode :room.mode
      // }
      commit(MUTATIONS_KEY.setRoomActive, room);
    },
    async caculateBooking({ commit }, dataObject) {
      // let url = `${AJAX_URL.payment.calculateBooking}`;
      EventBus.emit("IS_SHOW_ROUTER_LOADING", true);

      try {
        const data = await apiCaller({
          metaUrl: AJAX_URL.payment.calculateBooking,
          dataType: "json",
          data: JSON.stringify(dataObject),
          method: "POST",
          headers: {
            Authorization: getToken(),
          },
          contentType: "application/json; charset=utf-8",
        });
        EventBus.emit("IS_SHOW_ROUTER_LOADING", false);

        return data;
      } catch (error) {
        console.log("error :>> ", error);
        EventBus.emit("REDIRECT-404-PAGE");
      }
    },
    async beforeCreateBooing({ commit }, dataObject) {
      const data = await apiCaller({
        metaUrl: AJAX_URL.payment.beforeCreateBooking,
        dataType: "json",
        data: JSON.stringify(dataObject),
        method: "POST",
        contentType: "application/json; charset=utf-8",
      });
      return data;
    },
  },
};

export { MODULE_NAME, MUTATIONS_KEY, COMMIT_KEY, hotelInfoModule };
