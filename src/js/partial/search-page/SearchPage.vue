<template>
  <div class="search-page">
    <div class="container">
      <!--search-page__group-key, TODO: group button to filter -->

      <br>
      <div class="search-page__group-key">
        <div class="search-page__group-key--title">
          <i class="fas fa-building" />
          {{ $t('search.hot_key') }}
        </div>
        <div class="search-page__group-key--key-group">
          <button
            v-for="(v, k) in keyList"
            :key="k"
            :class="keyActive == v.value ? 'active' : ''"
            @click="clickKeyWord(v)"
          >
            {{ v.name }}
          </button>
        </div>
      </div>
      <!-- end search-page__group-key -->

      <!-- table to show data -->
      <div class="search-page__table">
        <EmptyState v-if="!tableData || tableData.length == 0" />

        <table v-else>
          <thead>
            <tr>
              <th> {{ $t('search.hotel_name') }}</th>
              <th>{{ $t('search.address') }}</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(data, k) in tableData"
              :key="k"
            >
              <td>
                <a @click="goHotel(data)">{{ data.name }}</a>
              </td>
              <td>
                <a @click="goHotel(data)">{{ data.address }}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- end table -->
    </div>
  </div>
</template>

<script>
  import { IMAGE_URL } from "~jsDefinePath/general";
  import { EVENT_BUS_KEY } from "~jsDefinePath/event-bus";
  import {
    FIREBASE_TRACKING,
    DABLE_TRACKING,
  } from "~jsDefinePath/tracking-define";
  import { getUrlQueryString } from "~jsPath/helper/util/HandleUrl";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import {
    G2JFirebase,
    G2JDablenaTracking,
  } from "~jsHelperPath/util/HandleTracking";
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";

  export default {
    components: {
      EmptyState: () => import("./component/EmptySate.vue"),
      "back-button": () =>
        import(
          "~jsPartialPath/global/component/back-button/BackButtonComponent.vue"
        ),
    },
    data() {
      return {
        placeholderSearch: "Search by name, address...",
        keyList: [
          { id: 1, name: "#bontam", value: "#bontam" },
          { id: 2, name: "#ghetinhyeu", value: "#ghetinhyeu" },
          { id: 3, name: "#KSHot", value: "#KSHot" },
          { id: 4, name: "#Romantic", value: "#Romantic" },
          { id: 5, name: "#KSTinhYeu", value: "#KSTinhYeu" },
          // { id: 6, name: "#KMHot", value: "#KMHot" },
          // { id: 7, name: "#coupon", value: "#coupon" }
        ],
        keyActive: null, // check click keywords
        tableData: [], // data to show
        textSearch: "", //model of input
        timeoutSearch: null,
        isShowLoading: false,
      };
    },
    computed: {
      imageUrl() {
        return IMAGE_URL;
      },
    },
    watch: {
      "$route.query": function (oldQuery, curQuery) {
        if (JSON.stringify(oldQuery) !== JSON.stringify(curQuery)) {
          this.initRoute();
        }
      },
    },
    created() {
      EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
      this.initRoute();

      // NOTE - tracking
      G2JFirebase.analytics().logEvent(FIREBASE_TRACKING.TRACKING_SEARCH, {
        name: "",
      });
      G2JDablenaTracking(DABLE_TRACKING.TRACKING_SEARCH);
    },

    mounted() {

      const self = this;

      EventBus.on(EVENT_BUS_KEY.REQUEST_SEARCH_TASK, function (searchKeyword) {
        self.textSearch = searchKeyword;
        // khi co key r ma nhap tiep
        if (self.keyActive && self.textSearch.length) {
          self.keyActive = null;
        }

        // khi nhap text bang keyword
        if (self.textSearch.length) {
          let checkActive = self.keyList.find(
            (el) => el.value == self.textSearch
          );
          if (checkActive) {
            self.keyActive = checkActive.value;
            self.getsSearchHotel(self.textSearch, "hashTag");
            return;
          }
        }
        // khi xoa keyword
        if (!self.textSearch.length) {
          self.keyActive = null;
          self.$router.replace({
            name: "search-page",
          });
        }

        if (self.textSearch && self.textSearch.length) {
          self.$router.push({
            name: "search-page",
            query: { keyword: self.textSearch },
          });
          // self.getsSearchHotel(self.textSearch);
        } else {
          // self.getList();
        }
      });
    },

    beforeDestroy() {
      EventBus.off(EVENT_BUS_KEY.REQUEST_SEARCH_TASK);
    },

    methods: {
      goHotel(data) {
        this.$router.push({
          name: "hotel-detail-page",
          params: { hotelName: GetSlug(data.name) },
          query: { hotelSn: data.sn },
        });
      },
      clickKeyWord(key) {
        if (!key || !key.id) return;
        if (key.value == this.keyActive) {
          this.keyActive = null;
          this.textSearch = "";
          this.$router.replace({ name: "search-page" });
          return;
        }
        this.keyActive = key.value;
        let query = {
          keyword: key.value,
        };
        this.textSearch = key.value;
        this.$router.push({ name: "search-page", query: query });
      },

      async getsSearchHotel(text, type) {
        // dat ten method theo v2 cho de research
        // let url = "https://staging-api.go2joy.vn/api/v1/web-booking/home/getHotelSearchList?";
        let url = `${AJAX_URL.search.searchHotel}`;
        let body;
        let normal = {
          kara: 0,
          name: 1,
          address: 1,
          hashTag: 0,
          keyword: text.toString(),
          offset: 0,
          limit: 20,
          oneForAll: 0,
        };
        let hashTag = {
          kara: 0,
          name: 0,
          address: 0,
          hashTag: 1,
          keyword: text.toString(),
          offset: 0,
          limit: 20,
          oneForAll: 1,
        };

        // check type to search
        if (type == "hashTag") {
          body = hashTag;
        } else {
          body = normal;
        }
        EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
         try {
          let res = await apiCaller({
            metaUrl: AJAX_URL.search.searchHotel,
            dataType: "json",
            data: body,
            method: "GET",
            contentType: "application/json; charset=utf-8",
          });
          this.tableData = res.data.hotelList;
         } catch (error) {
          console.log("error :>> ", error);
          setTimeout(() => {
            this.tableData = [];
          }, 5000);
        } finally {
          EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
        }


        // let urlQuery = url + getUrlQueryString(body);
        // try {
        //   const response = await fetch(urlQuery, {
        //     method: "GET",
        //     mode: "cors",
        //     cache: "no-cache",
        //     credentials: "same-origin",
        //     headers: {
        //       deviceid: "device_for_web",
        //       "Content-Type": "application/json;charset=UTF-8",
        //       authorization: "",
        //     },
        //   });
        //   // body: JSON.stringify(body)
        //   let data = await response.json();

        //   // this.tableData = data.hotelFormList;
        //   this.tableData = data.data.hotelList;
        //   // this.isShowLoading = false;

        //   EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
        // } catch (error) {
        //   console.log("error :>> ", error);
        //   setTimeout(() => {
        //     this.tableData = [];
        //     EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
        //   }, 5000);
        // }

        // try {
        //   let res = await apiCaller({
        //     url: url,
        //     method: "POST",
        //     dataType: "json",
        //     headers: {
        //       'Device-Encode': 'device_for_web',
        //       "RequestVerificationToken": $('input[name="__RequestVerificationToken"]').val()
        //     },
        //     processData: false,
        //     contentType: "application/json; charset=utf-8",
        //     data: JSON.stringify(body),
        //   })
        //   console.log('res :>> ', res);

        //   EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
        // } catch (error) {
        //   console.log('error :>> ', error);
        //   EventBus.emit("IS_SHOW_ROUTER_LOADING", false);

        // }
      },
      async getList() {
        // dat ten method theo v2 cho de research
        // api nay nghe noi bi stop r => check lai
        EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        let url =
          "https://api.go2joy.vn/hotelapi/home/view/findLimitHotelInCollection?hotelCollectionSn=11&longitude=106.6813099&latitude=10.7642086&limit=50&offset=0";

        try {
          let res = await apiCaller({
            url: url,
            dataType: "json",
            method: "GET",
            headers: {
              "Device-Encode": "device_for_web",
              Authorization: "",
            },
            contentType: "application/json; charset=utf-8",
          });
          this.tableData = res;
          EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
        } catch (error) {
          console.log("error :>> ", error);
        }
      },
      initRoute() {
        let query = this.$route.query;
        this.keyActive = query.keyword;
        this.textSearch = query.keyword;

        if (this.textSearch && this.textSearch.length) {
          if (this.textSearch[0] == "#") {
            // check search theo kieu gi => 1 sai lam nho nho
            this.getsSearchHotel(this.textSearch, "hashTag");
          } else {
            this.getsSearchHotel(this.textSearch);
          }
        } else {
          this.getList();
        }
      },
    },
  };
</script>

<style src="./search-page-style.css"></style>
