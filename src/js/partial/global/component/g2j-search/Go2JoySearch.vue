<template>
  <div class="gj2-search-header">
    <div
      v-if="isShowBg"
      class="gj2-search-header__background"
    >
    </div>
    <v-select
      id="selected"
      ref="select"
      :placeholder="$t('search.placeholder')"
      label="name"
      v-model="modelVSelect"
      :options="optionSearch"
      :filterable="false"
      :clearSearchOnBlur="clearSearchSub"
      :closeOnSelect="true"
      :noDrop="isNoDrop"
      @search:blur="searchBlur"
      @search="searchVSelect"
      @input="inputVSelect"
      @open="onOpen"
      @close="onClose"
      @keydown.native.enter="onSearch"
    >
      <!-- :clearable="false" -->
      <template #open-indicator="{ attributes }">
      </template>
      <!-- handle container with button "Search" -->
      <template #no-options="{ search, searching, loading }">
        <div v-if="searching">
          <div
            v-if="isNodata"
            class="container-nodata"
          >
            <!-- {{$t('search.not_found')}} -->
            <div class="container-nodata">
              <g2j-image :url-img="`${IMAGE_URL}/svg/nodata_search.svg`">
              </g2j-image>
              <p class="container-nodata__title"> {{$t('search.not_found')}} </p>
              <span class="container-nodata__content"> {{$t('search.not_found_content')}} </span>
            </div>

          </div>
          <span v-else>
            <div class="container-loading">
              <!-- <i class="fas fa-spinner fa-pulse"></i> -->

              <div class="g2j-loading-wrap">
                <div class="g2j-loading-wrap__loading-spinner-outer">
                  <div class="g2j-loading-wrap__loading-spinner-line">
                    <span class="g2j-loading-wrap__loading-spinner-item"></span>
                  </div>
                  <div class="g2j-loading-wrap__loading-spinner-line">
                    <span class="g2j-loading-wrap__loading-spinner-item"></span>
                  </div>
                  <div class="g2j-loading-wrap__loading-spinner-line">
                    <span class="g2j-loading-wrap__loading-spinner-item"></span>
                  </div>
                  <div class="g2j-loading-wrap__loading-spinner-line">
                    <span class="g2j-loading-wrap__loading-spinner-item"></span>
                  </div>
                  <div class="g2j-loading-wrap__loading-spinner-line">
                    <span class="g2j-loading-wrap__loading-spinner-item"></span>
                  </div>
                  <div class="g2j-loading-wrap__loading-spinner-line">
                    <span class="g2j-loading-wrap__loading-spinner-item"></span>
                  </div>
                  <div class="g2j-loading-wrap__loading-spinner-line">
                    <span class="g2j-loading-wrap__loading-spinner-item"></span>
                  </div>
                  <div class="g2j-loading-wrap__loading-spinner-line">
                    <span class="g2j-loading-wrap__loading-spinner-item"></span>
                  </div>
                  <div class="g2j-loading-wrap__loading-spinner-line">
                    <span class="g2j-loading-wrap__loading-spinner-item"></span>
                  </div>
                  <div class="g2j-loading-wrap__loading-spinner-line">
                    <span class="g2j-loading-wrap__loading-spinner-item"></span>
                  </div>
                </div> <!-- .g2j-loading-wrap__loading-snipper-outer -->

                <div class="g2j-loading-wrap__img-outer">
                  <template v-for="loadingImgItemInfo, key in loadingImgInfoList">
                    <img
                      :key="key"
                      class="g2j-loading-wrap__img"
                      width="100%"
                      height="100%"
                      :src="loadingImgItemInfo.src"
                      :alt="loadingImgItemInfo.alt"
                    >
                  </template>
                </div>
                <!-- .g2j-loading-wrap__img-outer -->
              </div> <!-- .g2j-loadig-wrap -->

            </div>
          </span>
        </div>
        <div v-else>
          {{$t('search.placeholder')}}

        </div>

      </template>

      <template #option="{ sn, name, address, imagePath, isGo2Choice }">
        <div class="item-search">
          <div class="item-search__img">
            <g2j-image :url-img="`${AssetsServiceUrl}/${imagePath}`"></g2j-image>
          </div>
          <div class="item-search__info">
            <div class="item-search__info--name option-name">
              {{name? name.toUpperCase():""}}
            </div>
            <div class="item-search__info--address">
              {{address}}
            </div>
          </div>
          <div
            class="item-search__icon"
            v-if="isGo2Choice"
          >
            <g2j-image :url-img="`${IMAGE_URL}/g2choice-rectangular-tag.jpg?v=${CACHE_VERSION}`"></g2j-image>
          </div>
        </div>
      </template>

      <template #selected-option="{ name }">
        <div class="item-selected">
          <strong>{{name}}</strong>
        </div>
      </template>

      <template #list-footer>
        <li
          v-show="hasInfinity"
          ref="load"
          class="loader"
        >
          <div class="container-loading-footer">
            <i class="fas fa-spinner fa-pulse"></i>
          </div>
        </li>
      </template>

    </v-select>

    <!-- Ui mobile -->
    <div class="mobile-search">
      <img
        :src="IMAGE_URL + '/svg/search.svg' "
        @click="openSearchMobile()"
      >
      <div
        class="nav nav-one"
        :class="{'visible': isShowNav}"
      >
        <div
          class="nav nav-two"
          :class="{'visible': isShowNav}"
        >
          <div
            class="nav nav-main"
            :class="{'visible': isShowNav}"
          >
            <div class="container-search-mobile">
              <button class="nav-btn close-btn">
                <i
                  class="fas fa-chevron-left"
                  @click="closeSearchMobile()"
                ></i>
              </button>
              <v-select
                ref="select-mobile"
                :placeholder="$t('search.placeholder')"
                label="name"
                v-model="modelVSelect"
                :options="optionSearch"
                :filterable="false"
                :clearSearchOnBlur="clearSearchSub"
                :closeOnSelect="true"
                :noDrop="isNoDrop"
                @search="searchVSelect"
                @search:blur="searchBlur"
                @input="inputVSelect"
                @open="onOpen"
                @close="onClose"
                @keydown.native.enter="onSearch"
                class="selected"
              >

                <template #no-options="{ search, searching, loading }">
                  <div v-if="searching">
                    <span v-if="isNodata">
                      {{$t('search.not_found')}}
                    </span>
                    <span v-else>
                      <div class="container-loading">
                        <!-- <i class="fas fa-spinner fa-pulse"></i> -->
                        <div class="g2j-loading-wrap">
                          <div class="g2j-loading-wrap__loading-spinner-outer">
                            <div class="g2j-loading-wrap__loading-spinner-line">
                              <span class="g2j-loading-wrap__loading-spinner-item"></span>
                            </div>
                            <div class="g2j-loading-wrap__loading-spinner-line">
                              <span class="g2j-loading-wrap__loading-spinner-item"></span>
                            </div>
                            <div class="g2j-loading-wrap__loading-spinner-line">
                              <span class="g2j-loading-wrap__loading-spinner-item"></span>
                            </div>
                            <div class="g2j-loading-wrap__loading-spinner-line">
                              <span class="g2j-loading-wrap__loading-spinner-item"></span>
                            </div>
                            <div class="g2j-loading-wrap__loading-spinner-line">
                              <span class="g2j-loading-wrap__loading-spinner-item"></span>
                            </div>
                            <div class="g2j-loading-wrap__loading-spinner-line">
                              <span class="g2j-loading-wrap__loading-spinner-item"></span>
                            </div>
                            <div class="g2j-loading-wrap__loading-spinner-line">
                              <span class="g2j-loading-wrap__loading-spinner-item"></span>
                            </div>
                            <div class="g2j-loading-wrap__loading-spinner-line">
                              <span class="g2j-loading-wrap__loading-spinner-item"></span>
                            </div>
                            <div class="g2j-loading-wrap__loading-spinner-line">
                              <span class="g2j-loading-wrap__loading-spinner-item"></span>
                            </div>
                            <div class="g2j-loading-wrap__loading-spinner-line">
                              <span class="g2j-loading-wrap__loading-spinner-item"></span>
                            </div>
                          </div> <!-- .g2j-loading-wrap__loading-snipper-outer -->

                          <div class="g2j-loading-wrap__img-outer">
                            <template v-for="loadingImgItemInfo, key in loadingImgInfoList">
                              <img
                                :key="key"
                                class="g2j-loading-wrap__img"
                                width="100%"
                                height="100%"
                                :src="loadingImgItemInfo.src"
                                :alt="loadingImgItemInfo.alt"
                              >
                            </template>
                          </div>
                          <!-- .g2j-loading-wrap__img-outer -->
                        </div> <!-- .g2j-loadig-wrap -->
                      </div>
                    </span>
                  </div>
                  <div v-else>
                    {{$t('search.placeholder')}}
                  </div>
                </template>

                <template #option="{ id, name, address, imagePath,isGo2Choice }">
                  <div class="item-search">
                    <div class="item-search__img">
                      <g2j-image :url-img="`${AssetsServiceUrl}/${imagePath}`"></g2j-image>
                    </div>
                    <div class="item-search__info">
                      <div class="item-search__info--name option-name">
                        {{name? name.toUpperCase():""}}
                      </div>
                      <div class="item-search__info--address">
                        {{address}}
                      </div>
                    </div>
                    <div
                      class="item-search__icon"
                      v-if="isGo2Choice"
                    >
                      <g2j-image :url-img="`${IMAGE_URL}/g2choice-rectangular-tag.jpg`"></g2j-image>
                    </div>
                  </div>
                </template>

                <template #list-footer>
                  <li
                    v-show="hasInfinity"
                    ref="load"
                    class="loader"
                  >
                    <div class="container-loading-footer">
                      <i class="fas fa-spinner fa-pulse"></i>
                    </div>
                  </li>
                </template>

              </v-select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Ui mobile -->
  </div>
</template>

<script>
  import {
    IMAGE_URL,
    CACHE_VERSION,
    ASSETS_SERVICE_URL,
    getToken,
  } from "~jsDefinePath/general";

  import { getUrlQueryString } from "~jsPath/helper/util/HandleUrl";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import { getSlug } from "~jsPath/helper/util/SlugHandler";
  import { G2JFbqTracking } from "~jsHelperPath/util/HandleTracking";
  import { getHotelDetailPagePath } from "~jsHelperPath/util/HandleUrl";
  import { mapState } from "~jsPath/lib/lib-manager";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsPath/base/vuex/modules/page-info-module";
  import { DISPATCHER_PARAMS_ID } from "~jsPath/define/dispatcher-params-id";
  export default {
    name: "Go2JoySearch",
    data() {
      return {
        IMAGE_URL,
        CACHE_VERSION,
        ASSETS_SERVICE_URL,
        optionSearch: [], // list option result
        optionDefault: [], // list option result

        modelVSelect: [], //giá trị ng dùng nhập vào => text
        elementDefault: null, // cái này dùng để hight light option
        elementOption: null,
        isNoDrop: false,
        searchKeyword: "", //keyword when user input

        isShowNav: false, // hiển thị dưới mobile
        isShowBg: false, // bật tắt background khi focus input

        observer: null, // 1 bí thuật
        isInfiniteScroll: false, // bật tắt infinity scroll

        isNodata: false, // để check khi nào k có data

        limit: 10, // giới hạn 1 lần search
        page: 1, // giá trị cho trang hiện tại đang lấy => cộng dồn khi scroll
        loadingSearch: null,
        AssetsServiceUrl: null,
        loadingImgInfoList: [
          {
            src: IMAGE_URL + "/svg/go2joy-logo.svg",
            alt: "go2joy logo",
          },
          {
            src: IMAGE_URL + "/svg/coupon-logo.svg",
            alt: "coupon logo",
          },
          {
            src: IMAGE_URL + "/svg/promotion-logo.svg",
            alt: "promotion logo",
          },
          {
            src: IMAGE_URL + "/svg/hotel-logo.svg",
            alt: "hotel logo",
          },
          {
            src: IMAGE_URL + "/svg/point-logo.svg",
            alt: "point logo",
          },
          {
            src: IMAGE_URL + "/svg/tem-logo.svg",
            alt: "tem logo",
          },
          {
            src: IMAGE_URL + "/svg/notification-logo.svg",
            alt: "notification logo",
          },
        ],
      };
    },
    components: {
      "v-select": window.VueSelect.VueSelect,
    },
    created() {},
    mounted() {
      this.observer = new IntersectionObserver(this.infiniteScroll); //ta goi no la bi thuat
    },
    computed: {
      hasInfinity() {
        return this.isInfiniteScroll; //key de hoat dong cai scroll ma goi api, dung sua cai nay
      },
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),
    },

    methods: {
      async infiniteScroll([{ isIntersecting, target }]) {
        if (isIntersecting) {
          //xác nhận scroll tới giá trị cuối
          const boxContainer = target.offsetParent;
          const scrollTop = target.offsetParent.scrollTop;

          // call api =>>
          await this.getsSearchHotel(this.searchKeyword);

          await this.$nextTick();
          boxContainer.scrollTop = parseInt(scrollTop); // do e biet a dang nghi gi => biet dc lam gi thi lien he
        }
      },
      openSearchMobile() {
        //mở giao diện search dưới mobile
        this.isShowNav = true;
        this.$refs["select-mobile"].$refs.search.focus(); // cho nay cho auto focus khi o thiet bi di dong
      },
      closeSearchMobile() {
        //đóng cái nav ở mobile
        this.isShowNav = false;
      },
      searchBlur() {
        // console.log("this.$ref:>> ", this.$refs["select"]);
        this.optionDefault = [];
        this.optionDefault = [...this.optionSearch];
      },

      searchVSelect(text, loading) {
        this.loadingSearch = loading;
        if (text && text != "" && getSlug(text) == getSlug(this.searchKeyword))
          return;
        //được kích hoạt khi ng dùng nhập
        this.searchKeyword = ""; //reset keyword cho chắc
        this.searchKeyword = text.toString();
        this.isInfiniteScroll = false; // set lúc ban đầu k có data thì k infinity

        //reset data, hợp lí khi người dùng xoá keyword
        this.optionSearch = [];
        this.isNodata = false;
        this.page = 0;

        //call api để lấy list option => nên làm thêm điều kiện keyword để gọi api
        if (this.searchKeyword.trim().length >= 1) {
          this.searchDebounce(loading, text, this);
        }
      },
      async onHighLight(text) {
        await this.$nextTick(); //bi thuat do dung xoa
        this.elementDefault = document.getElementsByClassName("option-name"); //lấy thằng cần tô màu

        let check = (this.page - 1) * this.limit;
        Object.keys(this.elementDefault).map((el, index) => {
          if (index >= check) {
            let str = this.elementDefault[el].innerHTML; //get string cua 1 option
            let str2 = getSlug(str);
            let indexD = str2
              .trim()
              .toString()
              .toLowerCase()
              .search(getSlug(text.trim().toString().toLowerCase())); //tim vị trí của keyword
            // .search(text.trim().toString().toLowerCase());
            let textD = str.trim().toString().substr(indexD, text.length); //lấy keyword nằm trong option
            let res = str.replace(
              textD,
              `<span style='color:#fd6500'>${textD}</span>`
            ); // replace nó với màu yêu thích
            this.elementDefault[el].innerHTML = res; //gán lại sau khi xử lý xong
          }
        });
      },

      inputVSelect(data) {
        //khi chon 1 option, co the co nhieu xu ly
        this.goHotel(data);
      },
      onSearch(evt) {
        //cho nay chua can
        // if (!this.searchKeyword || this.searchKeyword.length == 0) return;
        // this.$router.push({
        //   name: "search-page",
        //   query: { keyword: this.searchKeyword },
        // });
        // this.isNoDrop = true;
        // this.searchKeyword = ""
      },
      onClose() {
        //khi dong list search
        this.isShowBg = false;
        this.observer.disconnect();
        // nguoi tung thuong hoa ng dung

        //tat scroll body
        document.documentElement.style.overflow = null; // firefox, chrome
        document.body.scroll = "yes"; // ie only;
      },

      async onOpen() {
        // an scroll body
        document.documentElement.style.overflow = "hidden"; // firefox, chrome
        document.body.scroll = "no"; // ie only ;

        //khi mo list search
        this.isNoDrop = false;
        this.isNodata = false; //để phân biệt với chưa search và search k có data
        this.isShowBg = true; // hien thi cai background mau den
        // this.limit = 10
        this.page = 0; //set lại page, vì khi call api auto +1 nên để 0

        if (this.hasInfinity) {
          // cho nay la check scroll
          await this.$nextTick();
          this.observer.observe(this.$refs.load);
        }

        this.optionSearch = []; //khi mo ra clear cache

        if (this.optionDefault.length) {
          this.optionSearch = this.optionDefault;
          // this.page = Number(this.optionDefault.length / this.limit);
          // console.log("this.page :>> ", this.page);
          this.page = 1;
          this.onHighLight(this.searchKeyword);
        }
      },
      clearSearchSub(data) {
        //cho nay thich viet vay do
        return !data.clearSearchOnSelect && !data.multiple;
      },
      searchDebounce: _.debounce((loading, text, vm) => {
        if (vm.searchKeyword) {
          vm.getsSearchHotel(text, loading);
        }
      }, 700), //delay  roi moi goi api

      async getsSearchHotel(text, loading) {
        // lay tam api cu xai do~, khi nao co api moi thi cap nhat trong nay
        this.page = Number(this.optionSearch.length / this.limit);
        this.page = this.page + 1;

        let normal = {
          keyword: text,
          limit: 10,
          page: this.page,
        };

        // EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        try {
          let res = await apiCaller({
            metaUrl: AJAX_URL.search.searchHeader,
            dataType: "json",
            data: normal,
            method: "GET",
            contentType: "application/json; charset=utf-8",
            headers: {
              Authorization: getToken(),
            },
          });
          this.AssetsServiceUrl =
            res?.client_format_data.assets_service_url ?? "";
          this.isNodata = this.optionSearch.length == 0 ? true : false;
          if (this.searchKeyword.trim().length == 0) {
            this.optionSearch = [];
            return;
          }
          // check search k có kết quả
          if (res.data.hotelList == 0) {
            //khi mà nó scroll và k search thêm dc nữa thì dừng infinity scroll
            this.isInfiniteScroll = false;
            return;
          }

          //them data vao list option => kết hợp với clear tại onOpen nó mới hợp lí, nếu k sẽ bị trùng data
          this.optionSearch = [...this.optionSearch, ...res.data?.hotelList];
          this.onHighLight(text); // call func hight light keyword

          G2JFbqTracking("Search", {
            search_string: this.searchKeyword,
            content_category: "Hotel Search",
            content_ids: this.optionSearch.slice(0, 5),
            content_type: "hotel",
          });

          if (this.optionSearch.length >= 10) {
            //khi nao tren 10 option thi moi co load more - infinity scroll
            this.isInfiniteScroll = true;
          }
          if (this.hasInfinity) {
            // chỗ này lại là 1 bí thuật
            await this.$nextTick();
            this.observer.observe(this.$refs.load);
          }

          // EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
        } catch (error) {
          console.log("error :>> ", error);
          // EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
        }
      },
      goHotel(data) {
        //di toi hotel detail
        this.onInsertRecentHotel(data.sn);

        // this.$router.push({
        //   name: "hotel-detail-page",
        //   params: { hotelName: GetSlug(data.name) },
        //   query: { hotelSn: data.sn, from: "search" },
        // });
        if (this.$route.name == "hotel-detail-page") {
          let query = { ...this.$route.query };
          let params = { ...this.$route.params };

          params.hotelName =
            GetSlug(data.name) +
            "-" +
            DISPATCHER_PARAMS_ID.G2J_HOTEL_SN_ID +
            data.sn;

          this.$router.replace({
            query,
            params,
          });
          return;
        }
        this.$router.push(
          getHotelDetailPagePath(
            { hotelName: GetSlug(data.name) },
            { hotelSn: data.sn, from: "search" }
          )[this.language]
        );
      },
      async onInsertRecentHotel(hotelSn) {
        try {
          let res = await apiCaller({
            metaUrl: AJAX_URL.search.searchRecent,
            dataType: "json",
            data: {
              hotelSn,
            },
            method: "POST",
            contentType: "application/json; charset=utf-8",
          });
        } catch (error) {}
      },
    },
    watch: {
      $route() {
        this.modelVSelect = ""; //clear keyword khi chuyen route
        this.closeSearchMobile(); //đóng cái nav khi chọn 1 option chứ k thấy gì
      },
    },
    beforeDestroy() {
      this.observer.disconnect(); // viet cho no dung quy trinh chu k destroy bao gio dau
    },
  };
</script>

<style>
</style>
