<template>
  <div class="detail-page" :key="$route.query.hotelSn">
    <div
      itemscope
      itemtype="https://schema.org/Hotel"
      class="container"
    >
      <!-- <back-button class="detail-page__back-button"></back-button> -->
      <div class="detail-page__slider">
        <slider-banner
          v-if="!!dataBanner.length"
          :data-banner="dataBanner"
          :height="'400px'"
          itemprop="photo"
        />
        <div
          v-if="dataHotelDetail && dataHotelDetail.isGo2Choice"
          class="detail-page__slider--container-go2joy"
        >
          <g2j-image
            :url-img="`${IMAGE_URL}/g2choice-rectangular-tag.jpg?v=${ CACHE_VERSION }`"
          ></g2j-image>
        </div>
      </div>
      <div class="detail-page__detail-hotel">
        <div
          itemprop="name"
          class="detail-page__detail-hotel--name-hotel"
        >
          {{ nameHotel }}
        </div>
        <div
          v-if="numberStart > 0"
          class="detail-page__detail-hotel--review"
          itemprop="aggregateRating"
          itemscope
          itemtype="https://schema.org/AggregateRating"
        >
          <div class="number-start">
            <span class="number-start_start"><i class="fas fa-star" /></span>
            <span
              class="number-start__number"
              itemprop="ratingValue"
            >{{
              numberStart
            }}</span>
          </div>

          <router-link
            tag="div"
            :to="{ name: 'comment-page', params: { hotelSn: `${hotelSn}` } }"
            class="number-review"
          >
            <div
              class="number-review__number"
              itemprop="reviewCount"
            >
              {{ numberReview }}&nbsp
            </div>
            <div class="number-review__review">
              {{ $t("hotel_detail.reviews") }} <i class="fas fa-angle-right" />
            </div>
          </router-link>
        </div>
        <div class="detail-page__detail-hotel--address">
          <div class="number-address">
            <div class="detail-page__detail-hotel--address">
              <div class="number-address">
                <div class="number-address__icon-number">
                  <div class="number-address__icon-number--icon">
                    <span><i class="fas fa-map-marked-alt" /></span>
                    <span>1 Km</span>
                  </div>

                  <router-link
                    itemprop="address"
                    tag="div"
                    class="number-address__icon-number--number"
                    :to="{
                      name: 'maps-page',
                      query:{
                        maps :encodeURI(JSON.stringify({
                          lng: longitude,
                          lat: latitude,
                          hotelSn: `${hotelSn}`,
                          }))
                      },
                    }"
                  >
                    {{ addressHotel }} <i class="fas fa-angle-right" />
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          <FlashSaleList
            v-if="!!roomFlashSale.length"
            :room-flash-sale="roomFlashSale"
            @activeRoom="selectRoom"
            @activeRoomFlashSale="selectRoomFlashSale"
            @soldOutRoom="handleSoldOutRoom"
          />
          <div class="detail-page__room-type-form">
            <RoomTypeList
              v-if="!!roomTypeList.length"
              :data-room-type-list="roomTypeList"
              :data-hotel-detail="dataHotelDetail"
              @activeRoom="selectRoom"
              @activeRoomFlashSale="selectRoomFlashSale"
            />
          </div>
          <div
            v-if="!!listComment.length"
            class="detail-page__comment"
          >
            <div class="detail-page__comment--comment-judge">
              <div class="comment-judge">
                {{ $t("hotel_detail.best_review") }}
              </div>
              <div class="comment-see-all">
                <router-link :to="{
                    name: 'comment-page',
                    params: { hotelSn: `${hotelSn}` },
                  }">
                  <span> {{ $t("hotel_detail.see_all") }} </span>
                </router-link>
              </div>
            </div>
            <div class="detail-page__comment--comment-review">
              <div
                v-for="(comment, index) in listComment"
                :key="index"
                class="comment-block"
              >

                <p
                  itemprop="reviewBody"
                  class="comment-block__text"
                >
                  {{ comment.comment }}
                </p>
                <p
                  class="comment-block__name-user"
                  itemprop="author"
                >
                  {{ comment.userNickName || ''}}
                </p>
              </div>
            </div>
          </div>
          <div
            v-if="!!listFacilities.length"
            class="detail-page__facilities"
          >
            <div class="facilities-title">
              {{ $t("hotel_detail.facilities") }}
            </div>
            <SliderFacilitiesHotelDetail
              v-if="!!listFacilities.length"
              :list-image-facilities="listFacilities"
            />
          </div>
          <div
            v-if="hotelInfo && hotelInfo.style ==4"
            class="detail-page__policy"
          >
            <div class="policy-title">
              <span>{{ $t("hotel_detail.hotel_policy") }}</span>
            </div>
            <div class="policy-content">
              <span v-if="language=='vi'" v-html="hotelInfo.description"></span>
              <span v-else v-html="hotelInfo.enDescription"></span>
            </div>
          </div>
          <!-- khách sạn có style 4 là ks quarantine => lấy policy từ description -->
          <div
            v-else
            class="detail-page__policy"
          >
            <div class="policy-title">
              <span>{{ $t("hotel_detail.policy") }}</span>
            </div>
            <div class="policy-content">
              <p class="policy-content__text">
                {{ $t("hotel_detail.start_hourly_time") }}:
                {{ $t("hotel_detail.from") }} {{ startHourlyTime }}h
              </p>
              <p class="policy-content__text">
                {{ $t("hotel_detail.daily_check_in_time") }}:
                {{ $t("hotel_detail.from") }} {{ checkin }}h
              </p>
              <p class="policy-content__text">
                {{ $t("hotel_detail.daily_check_out_time") }}:
                {{ $t("hotel_detail.from") }} {{ checkout }}h
              </p>
              <p class="policy-content__text">
                {{ $t("hotel_detail.overnight_time") }} {{ startOvernight }}h ~
                {{ endOvernight }}h
              </p>
              <p class="policy-content__text">
                {{ $t("hotel_detail.free_cancellation_until") }}
                {{ cancelBeforeHours }}.0
                {{ $t("hotel_detail.hour_before_check_in_time") }}
              </p>
            </div>
          </div>
          <div class="detail-page__about" v-if="aboutContent">
            <div class="about-title">
              <span>{{ $t("hotel_detail.introduction") }}</span>
            </div>
            <div class="about-content">
              <span
                itemprop="description"
                v-html="aboutContent"
              />
            </div>
          </div>
        </div>
        <!-- TODO: Đóng tạm thời, qua 1-2 sprint rồi xoá -->
        <!-- <div class="detail-page__book-now">
          <BookNow
            v-if="!hasUserInfo"
            :title="$t('hotel_detail.book_now')"
            @bookNow="
              clickBookNow(),
              G2JDablenaTracking(DABLE_TRACKING.TRACKING_VIEW_BOOK_NOW)
            "
          />

          <router-link
            v-else-if="!isEmpty(dataHotelDetail)"
            :to="linkToPayment()[language]"
          >
            <a
              :href="href"
              @click="
                navigate,
                G2JDablenaTracking(DABLE_TRACKING.TRACKING_VIEW_BOOK_NOW)
              "
            >
              <BookNow :title="$t('hotel_detail.book_now')" />
            </a>
          </router-link>
        </div> -->
      </div>
    </div>
    <ModalBookingWithLogin
      ref="modal-booking-with-login"
      @bookAsGuest="bookAsGuest"
      @bookAsLogin="bookAsLogin"
    />
    <TheG2JDirectAppNoticeModal
      :is-show="isShowDirectAppNoticeModal"
      @onCloseModal="closeDirectAppNoticeModal"
    />
    <ModalSoldOut ref="modal-sold-out-room" />
  </div>
</template>

<script>
  // import component
  // import SliderHotelDetail from './component/SliderHotelDetail.vue'
  import SliderFacilitiesHotelDetail from "./component/SliderFacilitiesHotelDetail.vue";
  import BookNow from "../global/component/book-now/BookNow.vue";
  import FlashSaleList from "./component/FlashSaleList.vue";
  import RoomTypeList from "./component/RoomTypeList.vue";
  import ModalBookingWithLogin from "~jsPartialPath/global/component/modal-booking-with-login/ModalBookingWithLogin.vue";
  import TheG2JDirectAppNoticeModal from "~jsPartialPath/global/component/g2j-direct-app-notice-modal/TheG2JDirectAppNoticeModal.vue";
  import ModalSoldOut from "./component/ModalSoldOut.vue";

  import { getPaymentPagePath } from "~jsHelperPath/util/HandleUrl";
  import { mapGetters, mapActions, _, mapState } from "~jsPath/lib/lib-manager";
  import { MODULE_NAME as HOTEL_INFO_MODULE_NAME } from "~jsPath/base/vuex/modules/hotel-info-module";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsPath/base/vuex/modules/page-info-module";

  import { HAS_MOITAI } from "~jsDefinePath/general";
  import {
    G2JDablenaTracking,
    G2JFirebase,
  } from "~jsHelperPath/util/HandleTracking";
  import {
    DABLE_TRACKING,
    FIREBASE_TRACKING,
  } from "~jsDefinePath/tracking-define";
  import {
    IMAGE_URL,
    CACHE_VERSION,
  } from '~jsDefinePath/general';

  export default {
    name: "TheHotelDetailPage",
    components: {
      // SliderHotelDetail,
      SliderFacilitiesHotelDetail,
      BookNow,
      FlashSaleList,
      RoomTypeList,
      "slider-banner": () =>
        import("~jsPartialPath/global/component/slider-banner/SliderBanner.vue"),
      ModalBookingWithLogin,
      TheG2JDirectAppNoticeModal,
      ModalSoldOut,
    },
    data() {
      return {
        IMAGE_URL,
        CACHE_VERSION,
        startHourlyTime: 0,
        checkin: 0,
        checkout: 0,
        startOvernight: 0,
        endOvernight: 0,
        cancelBeforeHours: 0,
        dataHotelDetail: null,
        roomFlashSale: [],
        roomTypeList: [],
        listComment: [],
        listFacilities: [],
        listImageSlide: [],
        hotelSn: this.$route.query.hotelSn,
        pageSize: 10,
        nameHotel: "",
        numberStart: 0,
        numberReview: 0,
        addressHotel: "",
        aboutContent: "",
        longitude: "",
        latitude: "",
        dataBanner: [],
        showComment: false,
        isShowDirectAppNoticeModal: false,
        DABLE_TRACKING,
      };
    },
    async created() {
      await this.getDataHotelDetail();
      this.setRoomActive(null);
      EventBus.emit("IS_SHOW_ROUTER_LOADING", false);

      G2JFirebase.analytics().logEvent(FIREBASE_TRACKING.TRACKING_DETAIL_HOTEL, {
        name: "",
      });
    },
    mounted() {},
    computed: {
      // dataBanner () {
      //   return this.listSlide.map(el => 'https://go2joy.s3-ap-southeast-1.amazonaws.com/' + el.imagePath)
      // },
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),

      listSlide() {
        return this.listImageSlide;
      },
      ...mapGetters(HOTEL_INFO_MODULE_NAME, {
        hotelInfo: "hotelInfo",
        roomActive: "roomActive",
      }),
      ...mapGetters(PAGE_INFO_MODULE_NAME, {
        hasUserInfo: "hasUserInfo",
      }),
    },
    methods: {
      ...mapActions(HOTEL_INFO_MODULE_NAME, {
        getHotelInfo: "getHotelInfo",
        setRoomActive: "setRoomActive",
      }),
      G2JDablenaTracking,
      handleSoldOutRoom() {
        this.$refs["modal-sold-out-room"].openModal();
      },
      closeDirectAppNoticeModal() {
        this.isShowDirectAppNoticeModal = false;
      },
      selectRoomFlashSale() {
        this.isShowDirectAppNoticeModal = true;
      },
      selectRoom(data) {
        //hiển thị modal khi ks cho thanh toán tại ks
        // if (this.hotelInfo.paymentMethod== 3 && !HAS_MOITAI){
        //   this.isShowDirectAppNoticeModal = true;
        //   return
        // }

        this.setRoomActive(data);
        if (!this.hasUserInfo ) {
          this.$refs["modal-booking-with-login"].openModal();
          return;
        }

        this.bookAsGuest();
      },
      isEmpty: _.isEmpty,
      linkToPayment() {
        if (this.isEmpty(this.dataHotelDetail)) return;
        //TODO: ẩn đi khi nào có chứng chỉ bộ công thương => đừng xoá
        let arrFlashSale = this.dataHotelDetail.flashSaleList;
        let firstSale = arrFlashSale.find(
          (el) => el.numOfRoom - el.bookCount > 0
        );
        if (
          this.dataHotelDetail.flashSaleList &&
          this.dataHotelDetail.flashSaleList.length > 0 &&
          firstSale &&
          HAS_MOITAI
        ) {
          this.getFirstRoomFlashSale();
          return;
        }

        if (
          this.dataHotelDetail.roomTypeList &&
          this.dataHotelDetail.roomTypeList.length > 0
        ) {
          let roomSn = this.dataHotelDetail.roomTypeList[0].sn;
          let mode = this.dataHotelDetail.roomTypeList[0].mode;
          this.setRoomActive(this.dataHotelDetail.roomTypeList[0]);

          return getPaymentPagePath(
            {
              hotelName: this.hotelInfo.name,
              roomName: this.dataHotelDetail.roomTypeList[0].name,
            },
            {
              hotelSn: this.hotelInfo.sn,
              roomSn: roomSn,
              mode: mode,
            }
          );
        }
        return false;
      },
      clickBookNow() {


        this.$refs["modal-booking-with-login"].openModal();

        let arrFlashSale = this.dataHotelDetail.flashSaleList;
        let firstSale = arrFlashSale.find(
          (el) => el.numOfRoom - el.bookCount > 0
        );
        if (
          this.dataHotelDetail.flashSaleList &&
          this.dataHotelDetail.flashSaleList.length > 0 &&
          firstSale &&
          HAS_MOITAI
        ) {
          this.setRoomActive(this.dataHotelDetail.flashSaleList[0]);
          return;
        }
        if (
          this.dataHotelDetail.roomTypeList &&
          this.dataHotelDetail.roomTypeList.length > 0
        ) {
          this.setRoomActive(this.dataHotelDetail.roomTypeList[0]);
          return;
        }
      },
      bookAsGuest() {
        if (!this.isEmpty(this.roomActive)) {
          const paymentPagePath = getPaymentPagePath(
            {
              hotelName: this.hotelInfo.name,
              roomName: this.roomActive.name,
            },
            {
              hotelSn: this.hotelInfo.sn,
              roomSn: this.roomActive.sn,
              mode: this.roomActive.mode,
            }
          );
          this.$router.push(paymentPagePath[this.language]);
          return;
        }
        //TODO: ẩn đi khi nào có chứng chỉ bộ công thương => đừng xoá
        let arrFlashSale = this.dataHotelDetail.flashSaleList;
        let firstSale = arrFlashSale.find(
          (el) => el.numOfRoom - el.bookCount > 0
        );
        //TODO: lấy thằng đầu tiên trong danh sách flash sale
        if (
          this.dataHotelDetail.flashSaleList &&
          this.dataHotelDetail.flashSaleList.length > 0 &&
          firstSale &&
          HAS_MOITAI
        ) {
          this.getFirstRoomFlashSale();
          return;
        }

        //TODO: lấy thằng đầu tiên trong danh sách phòng thường
        if (
          this.dataHotelDetail.roomTypeList &&
          this.dataHotelDetail.roomTypeList.length > 0
        ) {
          let roomSn = this.dataHotelDetail.roomTypeList[0].sn;
          let mode = this.dataHotelDetail.roomTypeList[0].mode;
          const paymentPagePath = getPaymentPagePath(
            {
              hotelName: this.hotelInfo.name,
              roomName: this.dataHotelDetail.roomTypeList[0].name,
            },
            {
              hotelSn: this.hotelInfo.sn,
              roomSn: roomSn,
              mode: mode,
            }
          );

          this.setRoomActive(this.dataHotelDetail.roomTypeList[0]);
          this.$router.push(paymentPagePath[this.language]);
        }
        return false;
      },
      getFirstRoomFlashSale() {
        //TODO: ẩn đi khi nào có chứng chỉ bộ công thương => đừng xoá

        let arrFlashSale = this.dataHotelDetail.flashSaleList;
        let firstSale = arrFlashSale.find(
          (el) => el.numOfRoom - el.bookCount > 0
        );
        if (firstSale) {
          let roomSn = firstSale.sn;
          let mode = firstSale.mode;
          const paymentPagePath = getPaymentPagePath(
            {
              hotelName: this.hotelInfo.name,
              roomName: firstSale.name,
            },
            {
              hotelSn: this.hotelInfo.sn,
              roomSn: roomSn,
              mode: mode,
            }
          );

          this.setRoomActive(this.dataHotelDetail.flashSaleList[0]);
          this.$router.push(paymentPagePath[this.language]);

          return true;
        }
      },
      bookAsLogin() {
        const paymentPagePath = getPaymentPagePath(
          {
            hotelName: this.hotelInfo.name,
            roomName: this.roomActive.name,
          },
          {
            hotelSn: this.hotelInfo.sn,
            roomSn: this.roomActive.sn,
            mode: this.roomActive.mode,
          }
        );
        this.$router.push({
          name: "login-page",
          params: { redirect_path: paymentPagePath[this.language] },
        });
      },
      handleLinkComment() {
        this.$route.push({ name: "comment-page", params: `${this.hotelSn}` });
      },
      async getDataHotelDetail() {
        let id = this.$route.query.hotelSn;
        let query = {
          limit: this.pageSize,
          page: "1",
          hotelSn: id,
        };

        if (_.isEmpty(this.hotelInfo) || this.hotelInfo.sn != id) {
          await this.getHotelInfo({ sn: id, query });
        }
        this.initData(this.hotelInfo);
      }, //getDataHotelDetail
      initData(data) {
        //how long??? CHECK pls
        if (!data) return;
        this.longitude = data.longitude;
        this.latitude = data.latitude;
        this.nameHotel = data.name;
        this.numberStart = data.averageMark;
        this.numberReview = data.totalReview;
        this.addressHotel = data.address;
        this.aboutContent = data.description;
        this.dataHotelDetail = data;
        this.roomFlashSale = data.flashSaleList;
        this.roomTypeList = data.roomTypeList;
        this.listComment = data.userReviewFormList;

        this.listFacilities = data.facilityFormList;
        this.listImageSlide = data.hotelImageList;
        this.startHourlyTime = data.startHourlyTime;
        this.checkin = data.checkin;
        this.checkout = data.checkout;
        this.startOvernight = data.startOvernight;
        this.endOvernight = data.endOvernight;
        this.cancelBeforeHours = data.cancelBeforeHours;

        // this.dataBanner = this.listImageSlide.map(el => 'https://go2joy.s3-ap-southeast-1.amazonaws.com/' + el.imagePath)
        this.dataBanner = this.listImageSlide;

      },
    },
    watch: {
      hotelInfo(hotel) {
        let query = { ...this.$route.query };
        let params = { ...this.$route.params };
        params.hotelName = GetSlug(hotel.name);
        this.$router.replace({ name: "hotel-detail-page", query, params });
      },
     '$route.query'(val){
       this.getDataHotelDetail()
      }
    },
  };
</script>

<style src="./hotel-detail-page-style.css"></style>
