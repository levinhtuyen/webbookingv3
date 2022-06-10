<template>
  <div class="detail-v4-page">
    <div
      v-if="hotelSn"
      class="id"
    >
      {{ hotelSn }}
    </div> <!--  NOTE - id class for google bot-->
    <!-- <G2JSlideHotel
      v-if="listImageSlide && roomTypeListSlide"
      :listImageSlide="listImageSlide"
      :roomTypeList="roomTypeListSlide"
      :totalFavorite="totalFavorite"
      :isHotelDetail="true"
      :isFavorite="favorite"
      @onUpdateFavorite="onUpdateFavorite"
    /> -->
    <TheGo2joySliderImage
      :key="reRenderSlider"
      :listImageSlide="listImageSlide"
      :isHiddenHeart="false"
      :data="dataHotelDetail"
      :custom-class-name="'hotel-detail-banner-swiper-container'"
      :hotelSn="hotelSn"
    />

    <div class="container">
      <!-- block Hotel Info -->
      <div
        v-if="dataHotelDetail"
        class="detail-v4-page__info"
      >
        <div class="detail-v4-page__info__head">
          <div class="start-review">
            <span>
              <i class="fas fa-star"></i>
              <span class="is-number-rate">
                {{ generateRating() }}</span>
            </span>
            <span class="is-review">
              ({{ dataHotelDetail.totalReview }}
              {{ $t("hotel_detail.detail_v4.review_rating") }})</span>
          </div>
          <div class="hotel-detail-card">
            <G2JCard
              v-if="dataHotelDetail"
              :hotHotel="dataHotelDetail.hotHotel"
              :newHotel="dataHotelDetail.newHotel"
              :accommodation="dataHotelDetail.type"
            />
          </div>
        </div>
        <div class="detail-v4-page__info--name">
          <h1>{{ dataHotelDetail.name }}</h1>
        </div>
        <div class="detail-v4-page__start-rate">
          <G2jStarRating
            v-if="dataHotelDetail.starRating && isAgoda"
            :starRating="dataHotelDetail.starRating"
          />
        </div>
        <div class="detail-v4-page__info__location">
          <p class="is-address">
            <span class="icon-location"><i class="fas fa-map-marker-alt"></i></span>
            <span
              class="is-location"
              v-if="Number(dataHotelDetail.distance) > 1"
            >{{ roudingMathNumber(dataHotelDetail.distance) }} km</span>
            <span
              class="is-location"
              v-else
            >{{ roudingMathNumber(dataHotelDetail.distance) }} m</span>
            |
            {{ dataHotelDetail.address }}
            <!-- <span class="view-map">| {{ $t("hotel_detail.detail_v4.view_map") }}
              <span class="is-icon-right"><i class="fas fa-chevron-right"></i></span></span> -->
          </p>
        </div>
      </div>
      <!-- block Hotel Info -->
      <!-- block Nearby -->
      <div
        class="detail-v4-page__what-nearby"
        v-if="dataHotelDetail && dataNearbyListEn"
      >
        <div class="what-nearby-and-more">
          <div class="what-nearby-and-more__title">
            <div class="is-title">
              <span>{{ $t("hotel_detail.detail_v4.what_nearby") }}</span>
            </div>
          </div>
          <div
            class="what-nearby-and-more__title-view-all"
            @click="openModalNearBy"
            v-if="dataNearbyListEn.length > 3"
          >
            <p>{{ $t("common.read_more") }}</p>
          </div>
        </div>
        <div
          class="what-nearby__content"
          v-if="language == 'en'"
        >
          <div
            class="what-nearby__content--line-content"
            v-for="(item,index) in dataNearbyListEn.slice(0,3)"
            :key="index"
          >
            <div class="is-name-hotel">{{ item.name }}</div>
            <div class="is-localtion-hotel">{{ roudingMathNumberNearBy(item.distance) }}{{ item.distanceUnit }}</div>
          </div>
        </div>
        <div
          class="what-nearby__content"
          v-else
        >
          <div
            class="what-nearby__content--line-content"
            v-for="(item,index) in dataNearbyListVi.slice(0,3)"
            :key="index"
          >
            <div class="is-name-hotel">{{ item.name }}</div>
            <div class="is-localtion-hotel">{{ roudingMathNumberNearBy(item.distance) }}{{ item.distanceUnit }}</div>
          </div>
        </div>
      </div>
      <!-- block Nearby -->
      <!-- block Stamp -->
      <div
        class="detail-v4-page__stamp"
        v-if="dataHotelDetail && dataHotelDetail.numToRedeem && !isAgoda"
      >
        <PointCard
          v-if="dataStamp"
          :myPointTotal="dataStamp"
          :dataHotelDetail="dataHotelDetail"
        />
      </div>
      <!-- block Stamp -->
      <!-- block Amenity Pack and isGo2Choice -->
      <SlideDiscount
        v-if="dataHotelDetail && (dataHotelDetail.amenityPack || dataHotelDetail.isGo2Choice)"
        :dataSlide="dataHotelDetail"
      />
      <!-- block Amenity Pack and isGo2Choice -->

      <div class="detail-v4-page__filter">
        <h3 class="detail-v4-page__filter--title">{{$t('hotel_detail.detail_v4.select_room')}}</h3>
        <div class="detail-v4-page__filter--type filter-type">
          <template v-for="(v, k) in filterTime">
            <button
              class="filter-type__item"
              :key="k"
              :disabled="!v.is_active"
              :class="v.id == timeSelect ? 'active' : ''"
              @click="onChangeTypeTime(v.id)"
            >
              <div class="filter-type__item--icon">
                <g2j-image :urlImg="IMAGE_URL + `/icon/filter/${v.icon}`"></g2j-image>
              </div>
              <span class="filter-type__item--title">{{ v.name }}</span>
            </button>
          </template>
        </div>
        <!-- filter type  -->
        <div class="detail-v4-page__filter--time filter-time">
          <div
            @click="openModalSelect()"
            class="filter-time__check-in"
          >
            <span class="filter-time__check-in--title">
              <g2j-image :urlImg="IMAGE_URL + `/icon/filter/calendar.svg`"></g2j-image>
              {{ $t("hotel_detail.detail_v4.check_in") }}
            </span>
            <p class="filter-time__check-in--label">
              {{ timeCheckIn }},
              {{ dayCheckIn ? formatMMM(dayCheckIn) : "Select date" }}
            </p>
          </div>
          <div
            @click="openModalSelect()"
            class="filter-time__check-out"
          >
            <span class="filter-time__check-out--title">
              <g2j-image :urlImg="IMAGE_URL + `/icon/filter/calendar.svg`"></g2j-image>
              {{ $t("hotel_detail.detail_v4.check_out") }}
            </span>
            <p class="filter-time__check-out--label">
              {{ timeCheckOut }},
              {{ dayCheckOut ? formatMMM(dayCheckOut) : "Select date" }}
            </p>
          </div>
        </div>
        <!-- filter time  -->
      </div>
      <g2j-select-date-time
        ref="select-date-time"
        :page-name="'hotel-detail'"
        :typeTime.sync="timeSelect"
        :dayCheckIn.sync="dayCheckIn"
        :dayCheckOut.sync="dayCheckOut"
        :timeCheckIn.sync="timeCheckIn"
        :timeCheckOut.sync="timeCheckOut"
        :timeSpace="dataFilterDateTime.firstHours"
        :data-more="dataFilterDateTime"
        :filterTime="filterTime"
        :isAgoda="isAgoda"
        :isOvernightSpecial="isOvernightSpecialCalendar"
        :isOvernight="isOvernight"
        :checkHourWith6h="checkHourWith6h"
        @onSubmit="onSubmit()"
        @onClickDisableAgoda="isShowToast = true"
        @onClickDisable30day="isShowToast30day = true"
        @changeTypeOvernightSpecial="openModalCheckInTime()"
      >
      </g2j-select-date-time>

      <hr class="hr-date-time" />
      <div
        v-if="isLoadingRoomList"
        class="detail-v4-page__loading-room-list"
      >
        <div
          v-for="(v,k) in 2"
          :key="k"
          class="detail-v4-page__loading-room-list--item"
        >
          <VueContentLoading
            :key="index"
            :width="350"
            :height="250"
          >
            <rect
              x="0"
              y="5"
              rx="4"
              ry="4"
              width="100%"
              height="100"
            />

            <rect
              x="10"
              y="130"
              rx="4"
              ry="4"
              width="80%"
              height="20"
            />
            <rect
              x="10"
              y="170"
              rx="4"
              ry="4"
              width="50%"
              height="10"
            />
            <rect
              x="10"
              y="190"
              rx="4"
              ry="4"
              width="30%"
              height="10"
            />
          </VueContentLoading>
        </div>

      </div>
      <template v-else>
        <!-- block Flash sale -->
        <div class="detail-v4-page__flash-sale">
          <FlashSaleSwiperHotelSection
            v-if="timeSelect == 2&&!isEmpty(flashSaleFormList) && !isEmpty(flashSaleFormList.hotelList)"
            :info="flashSaleFormList"
            :assetsServiceUrl="$assetsServiceUrl"
            :hotelInfoV4="{
            timeSelect: timeSelect,
            startDate: dayCheckIn,
            endDate: dayCheckOut,
            startTime: timeCheckIn,
            endTime: timeCheckOut,
            ...hotelInfoV4,
          }"
            :isOvernightSpecial="isOvernightSpecial"
            :isDefaultOvernightSpecial="timeSelect ==2?isDefaultOvernightSpecial: false"
            @bookOvernightSpecial=" val => onClickRoomOvernightSpecial(val)"
          />
        </div>
        <!-- block Flash sale -->
        <!-- block Room type -->
        <TheRoomTypeListSection
          v-if="timeCheckIn && timeCheckOut"
          ref="TheRoomTypeListSection"
          :key="reRenderCounter"
          :itemList="roomTypeList"
          :assetsServiceUrl="$assetsServiceUrl"
          :hotelInfoV4="{
          timeSelect: timeSelect,
          startDate: dayCheckIn,
          endDate: dayCheckOut,
          startTime: timeCheckIn,
          endTime: timeCheckOut,
          ...hotelInfoV4,
        }"
          :isOvernightSpecial="isOvernightSpecial"
          :isDefaultOvernightSpecial="timeSelect ==2?isDefaultOvernightSpecial: false"
          @bookOvernightSpecial="val => onClickRoomOvernightSpecial(val)"
        />
        <!-- block Room type -->
      </template>
      <!-- block slide review -->
      <div
        class="detail-v4-page__slide-review"
        v-if="!isEmpty(userReviewFormList)"
      >
        <div class="block-review">
          <div
            v-if="dataHotelDetail"
            class="block-review__title-rate"
          >
            <div class="is-title">
              <span>{{ $t("hotel_detail.detail_v4.review") }}</span>
            </div>
            <span
              class="is-rate"
              v-if="dataHotelDetail.starRating > 0"
            >{{ dataHotelDetail.starRating }}</span>
            <span class="is-number">({{ dataHotelDetail.totalReview }})</span>
            <span class="is-start"><i class="fas fa-star fa-2x"></i></span>
          </div>
          <div
            class="block-review__title-view-all"
            @click="openModalReview"
          >
            <p>{{ $t("common.read_more") }}</p>
          </div>
        </div>
        <SlideReview
          v-if="!isEmpty(userReviewFormList) && !ui.isLoadingReviews"
          :userReviewFormList="userReviewFormList"
          @openModalReviewScrollBySn="openModalReviewScrollBySn"
        />

        <div
          v-if="ui.isLoadingReviews"
          class="detail-v4-page__loading-room-list"
        >
          <div
            v-for="(v,k) in 2"
            :key="k"
            class="detail-v4-page__loading-room-list--item"
          >
            <VueContentLoading
              :key="index"
              :width="350"
              :height="250"
            >
              <rect
                x="0"
                y="5"
                rx="4"
                ry="4"
                width="100%"
                height="30"
              />
              <rect
                x="0"
                y="50"
                rx="4"
                ry="4"
                width="70%"
                height="20"
              />
              <rect
                x="0"
                y="85"
                rx="4"
                ry="4"
                width="50%"
                height="10"
              />
              <rect
                x="0"
                y="190"
                rx="4"
                ry="4"
                width="30%"
                height="10"
              />
            </VueContentLoading>
          </div>
        </div>

      </div>
      <!-- block facilities -->
      <div
        v-if="facilityWebList && facilityWebList.length > 0"
        class="detail-v4-page__facilities"
      >
        <div class="block-title-facilities">
          <div class="block-title-facilities__title">
            <div class="is-title">
              <span>{{ $t("hotel_detail.detail_v4.facilities") }}</span>
            </div>
          </div>
          <div
            v-if="facilityWebList && facilityWebList.length > 6"
            class="block-title-facilities__title-view-all"
          >
            <p @click="openModalFacilities">{{ $t("common.read_more") }}</p>
          </div>
        </div>
        <div class="block-note-facilities">
          <p>{{ $t('hotel_detail.detail_v4.facilities_might_be_different_depending_on_rooms') }}</p>
        </div>
        <BlockFacities
          v-if="!isEmpty(facilityMobileList)"
          :facilityFormList="facilityMobileList"
        />
      </div>
      <!-- block introduction -->
      <div
        class="detail-v4-page__introduction"
        v-if="dataHotelDetail && (dataHotelDetail.description || dataHotelDetail.enDescription)"
      >
        <div class="block-title-introduction">
          <div class="block-title-introduction__title">
            <div class="is-title">
              <span>{{ $t("hotel_detail.detail_v4.introduction") }}</span>
            </div>
          </div>
        </div>
        <div class="block-content-introduction">
          <div
            class="block-content-introduction__agoda"
            v-if="isAgoda && dataIntroductionSingleRoomAgoda"
          >
            <div class="block-content-agoda">
              <div
                class="block-content-hotel-agoda__item"
                v-if="dataIntroductionSingleRoomAgoda.maxOccupancyPerRoom"
              >
                <div class="check-agoda-title">
                  <p>{{ $t("hotel_detail.detail_v4.max_occupancy") }}</p>
                </div>
                <div class="check-agoda-data">
                  <p>{{ dataIntroductionSingleRoomAgoda.maxOccupancyPerRoom }} {{ $t("hotel_detail.detail_v4.guests") }}</p>
                </div>
              </div>
              <div
                class="block-content-hotel-agoda__item"
                v-if="dataIntroductionSingleRoomAgoda.maxExtraBeds"
              >
                <div class="check-agoda-title">
                  <p>{{ $t("hotel_detail.detail_v4.max_extra_beds") }}</p>
                </div>
                <div class="check-agoda-data">
                  <p>{{ dataIntroductionSingleRoomAgoda.maxExtraBeds }}</p>
                </div>
              </div>
              <div
                class="block-content-hotel-agoda__item"
                v-if="dataIntroductionSingleRoomAgoda.noOfRoom"
              >
                <div class="check-agoda-title">
                  <p>{{ $t("hotel_detail.detail_v4.no_of_room") }}</p>
                </div>
                <div class="checkagoda-data">
                  <p>{{ dataIntroductionSingleRoomAgoda.noOfRoom }}</p>
                </div>
              </div>
              <div
                class="block-content-hotel-agoda__item"
                v-if="dataIntroductionSingleRoomAgoda.maxInfantInRoom"
              >
                <div class="check-agoda-title">
                  <p>{{ $t("hotel_detail.detail_v4.max_infant_in_room") }}</p>
                </div>
                <div class="check-agoda-data">
                  <p>{{ dataIntroductionSingleRoomAgoda.maxInfantInRoom }}</p>
                </div>
              </div>
              <div
                class="block-content-hotel-agoda__content"
                v-if="dataIntroductionSingleRoomAgoda.sharedBathroom"
              >
                <div class="check-agoda-title">
                  <p>{{ $t("hotel_detail.detail_v4.shared_bathroom") }}</p>
                </div>
                <p
                  class="check-agoda-other"
                  v-html="dataIntroductionSingleRoomAgoda.sharedBathroom"
                ></p>
              </div>
            </div>
          </div>
          <div
            class="block-content-hotel"
            v-else
          >
            <p
              v-if="language == 'en'"
              v-html="dataHotelDetail.enDescription"
            ></p>
            <p
              v-else
              v-html="dataHotelDetail.description"
            ></p>

          </div>
        </div>
      </div>
      <!-- block introduction -->
      <!-- block policy -->
      <div
        class="detail-v4-page__policy"
        v-if="dataHotelDetail && !isAgoda"
      >
        <div class="block-title-policy">
          <div class="block-title-policy__title">
            <div class="is-title">
              <span>{{ $t("hotel_detail.detail_v4.hotel_policy") }}</span>
            </div>
          </div>
        </div>
        <div class="block-content-policy">
          <div class="block-content-policy__item is-hourly">
            <p class="title">{{ $t("hotel_detail.detail_v4.hourly") }}</p>
            <p class="data-policy"> {{ $t("hotel_detail.detail_v4.from") }} {{ dataHotelDetail.startHourlyTime }}:00</p>
          </div>
          <div class="block-content-policy__item is-overnight">
            <p class="title">{{ $t("hotel_detail.detail_v4.overnight") }}</p>
            <p class="data-policy"> {{ dataHotelDetail.startOvernight }}:00 – {{ dataHotelDetail.endOvernight }}:00</p>
          </div>
          <div class="block-content-policy__item is-daily">
            <p class="title">{{ $t("hotel_detail.detail_v4.daily") }}</p>
            <p class="data-policy">{{ dataHotelDetail.checkin }}:00 – {{ dataHotelDetail.checkout }}:00</p>
          </div>
        </div>
      </div>
      <!-- block policy -->
      <!-- block policy -->
      <div
        class="detail-v4-page__hotel-policy"
        v-if="dataHotelDetail && isAgoda"
      >
        <div class="block-title-hotel-policy">
          <div class="block-title-hotel-policy__title">
            <div class="is-title">
              <span>{{ $t("hotel_detail.detail_v4.hotel_policy") }}</span>
            </div>
          </div>
        </div>
        <div
          v-if="dataHotelDetail"
          class="block-content-hotel-policy"
        >
          <div
            class="block-content-hotel-policy__item"
            v-if="dataHotelPolicy.checkInFrom"
          >
            <div class="check-policy-title">
              <p>{{ $t("hotel_detail.detail_v4.checkin_from") }}</p>
            </div>
            <div class="check-policy-time">
              <p>{{ dataHotelPolicy.checkInFrom }}</p>
            </div>
          </div>
          <div
            class="block-content-hotel-policy__item"
            v-if="dataHotelPolicy.checkInUntil"
          >
            <div class="check-policy-title">
              <p>{{ $t("hotel_detail.detail_v4.checkin_until") }}</p>
            </div>
            <div class="check-policy-time">
              <p>{{ dataHotelPolicy.checkInUntil }}</p>
            </div>
          </div>
          <div
            class="block-content-hotel-policy__item"
            v-if="dataHotelPolicy.checkOutFrom"
          >
            <div class="check-policy-title">
              <p>{{ $t("hotel_detail.detail_v4.checkout_from") }}</p>
            </div>
            <div class="check-policy-time">
              <p>{{ dataHotelPolicy.checkOutFrom }}</p>
            </div>
          </div>
          <div
            class="block-content-hotel-policy__item"
            v-if="dataHotelPolicy.checkOutUntil"
          >
            <div class="check-policy-title">
              <p>{{ $t("hotel_detail.detail_v4.checkout_until") }}</p>
            </div>
            <div class="check-policy-time">
              <p>{{ dataHotelPolicy.checkOutUntil }}</p>
            </div>
          </div>
          <div
            class="block-content-hotel-policy__content"
            v-if="dataHotelPolicy.otherPolicy || dataHotelPolicy.otherPolicyEn"
          >
            <div class="check-policy-title">
              <p>{{ $t("hotel_detail.detail_v4.others") }}</p>
            </div>
            <p
              class="check-policy-other"
              v-if="language == 'vi'"
              v-html="dataHotelPolicy.otherPolicy"
            ></p>
            <p
              v-else
              v-html="dataHotelPolicy.otherPolicyEn"
            ></p>
          </div>
        </div>
      </div>
      <!-- block policy -->
      <!-- block langauge spoken -->
      <div
        class="detail-v4-page__language-spoken"
        v-if="dataHotelDetail && isAgoda && dataLanguageSpokenList"
      >
        <div class="block-title-language-spoken">
          <div class="block-title-language-spoken__title">
            <div class="is-title">
              <span>{{ $t("hotel_detail.detail_v4.langauage_spoken") }}</span>
            </div>
          </div>
          <div
            class="block-title-language-spoken__title-view-all"
            v-if="dataHotelDetail.languageSpokenList.length > 3"
          >
            <p @click="openModalSpoken">{{ $t("common.read_more") }}</p>
          </div>
        </div>
        <div class="block-content-language-spoken">
          <div
            class="block-content-language-spoken__content"
            v-for="(item,index) in dataLanguageSpokenList"
            :key="index"
          >
            <div class="is-name-country">{{ getLabelLanguageSpoken(item.name) }}</div>
            <div class="is-flage-image">
              <g2j-image :urlImg="IMAGE_URL + `/area/flag_${editToLowerCase(item.isoCode)}.png`"></g2j-image>
            </div>
          </div>
        </div>
      </div>
      <!-- block langauge spoken -->
      <!-- block Cancellation policy -->
      <div
        class="detail-v4-page__cancel-policy"
        v-if="dataHotelDetail && !isAgoda"
      >
        <div class="block-title-cancel-policy">
          <div class="block-title-cancel-policy__title">
            <div class="is-title">
              <span>{{ $t("hotel_detail.detail_v4.cancellation_policy") }}</span>
            </div>
          </div>
        </div>
        <div class="block-content-cancel-policy">
          <p>{{ $t("hotel_detail.detail_v4.free_cancellation_util") }} {{ dataHotelDetail.cancelBeforeHours }} {{ $t("hotel_detail.detail_v4.hour_before_check_in_time") }}</p>
        </div>
      </div>
      <!-- Section more hotel has room available -->
      <div class="detail-v4-page__list-room">
        <div
          class="loading-suggestion"
          v-if="!isShowSuggestionHotel"
        >
          <div
            v-for="(v,k) in 2"
            :key="k"
            class="loading-suggestion--item"
          >
            <VueContentLoading
              :key="index"
              :width="350"
              :height="250"
            >
              <rect
                x="0"
                y="5"
                rx="4"
                ry="4"
                width="40%"
                height="180"
              />

              <rect
                x="45%"
                y="5"
                rx="4"
                ry="4"
                width="40%"
                height="20"
              />
              <rect
                x="45%"
                y="35"
                rx="4"
                ry="4"
                width="20%"
                height="10"
              />
              <rect
                x="45%"
                y="55"
                rx="4"
                ry="4"
                width="20%"
                height="10"
              />
            </VueContentLoading>
          </div>
        </div>

        <HorizontalSwiperHotelSection
          :key="hotelSn +(new Date()).getTime()"
          v-if="!isEmpty(roomListRoom) && isShowSuggestionHotel"
          :info="roomListRoom"
          :assetsServiceUrl="$assetsServiceUrl"
          :hotelInfoV4="{
            type: timeSelect,
            startDate: dayCheckIn,
            endDate: dayCheckOut,
            startTime: timeCheckIn,
            endTime: timeCheckOut,
            ...hotelInfoV4,
          }"
        />

      </div>
      <!-- modal review -->

      <modal-review
        :key="hotelSn"
        ref="filter-modal-reviews"
        :error-list="errorList"
        :filter.sync="filter"
        :sn="scrollBySn"
        @resetModal="resetModal"
        @apply="applyFilter"
        @reloadReviews="getDataHotelDetail"
        :hotelSn="hotelSn"
      />
      <!-- modal review -->
      <!-- modal nearby -->
      <modal-nearby
        v-if="isAgoda"
        ref="select-modal-nearby"
        :hotelSn="hotelSn"
      />
      <!-- modal nearby -->
      <!-- modal nearby -->
      <modal-language-spoken
        v-if="isAgoda"
        ref="select-modal-language-spoken"
        :hotelSn="hotelSn"
      />
      <!-- modal nearby -->
      <!-- modal nearby -->
      <modal-policy ref="select-modal-policy" />
      <!-- modal nearby -->
      <modal-facilities
        ref="facility-modal"
        :facilityFormList="facilityAll"
      />
      <g2j-toast
        :key="'toast-14-day'"
        :is-active.sync="isShowToast"
        :message="$t('common.agoda_disable_select_day')"
      ></g2j-toast>
      <g2j-toast
        :key="'toast-30-day'"
        :is-active.sync="isShowToast30day"
        :message="$t('common.disable_select_30_day')"
      ></g2j-toast>
      <modal-checkin-time
        ref="modal-checkin-time"
        :timeSelect.sync="timeSelect"
        :timeCheckIn.sync="timeCheckIn"
        :timeNow="timeNow"
        :dayCheckIn.sync="dayCheckIn"
        :dayCheckOut.sync="dayCheckOut"
        :startOvernight="startOvernight"
        :isDefault.sync="isDefaultOvernightSpecial"
        :typeOvernight.sync="typeOvernightSpecial"
        @bookCalendar="openModalSelect('bookOther')"
        @submit="val => onSubMitCheckinTime(val)"
      >
      </modal-checkin-time>
    </div>
  </div>
</template>

<script>
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import G2JCard from "./conponent/CardHotel.vue";
  import G2JSlideHotel from "~jsPartialPath/global/component/g2j-slide-hotel/Go2JoySlideHotel.vue";
  import PointCard from "./conponent/PointCard.vue";
  import SlideDiscount from "./conponent/SlideDiscount.vue";
  import { mapGetters, mapActions, _, mapState } from "~jsPath/lib/lib-manager";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsPath/base/vuex/modules/page-info-module";
  import { MODULE_NAME as HOTEL_INFO_MODULE_NAME } from "~jsPath/base/vuex/modules/hotel-info-module";
  import { BOT_INFO, getToken, BASE_URL } from "~jsDefinePath/general";
  import {
    IMAGE_URL,
    CACHE_VERSION,
    ASSETS_SERVICE_URL,
  } from "~jsDefinePath/general";
  import { compareTime, handleFormatTime } from "~jsPath/helper/util/formatDate";
  import ModalReview from "./conponent/ModalReview.vue";
  import SlideReview from "./conponent/SlideReview.vue";
  import BlockFacities from "./conponent/BlockFacities.vue";
  import HorizontalSwiperHotelSection from "./conponent/HorizontalSwiperHotelSection.vue";
  import FlashSaleSwiperHotelSection from "./conponent/FlashSaleSwiperHotelSection.vue";
  import ModalFacilities from "./conponent/ModalFacilities.vue";
  import ModalNearby from "./conponent/ModalNearby.vue";
  import ModalPolicy from "./conponent/ModalPolicy.vue";
  import TheGo2joySliderImage from "~jsPartialPath/global/component/go2joy-slider/TheGo2joySliderImage.vue";
  import ModalLanguageSpoken from "./conponent/ModalLanguageSpoken.vue";
  import G2jStarRating from "~jsPartialPath/global/component/g2j-star-rating/G2jStarRating.vue";
  import { getRoomDetailPagePath } from "~jsHelperPath/util/HandleUrl";
  import { G2JFbqTracking } from "~jsHelperPath/util/HandleTracking";
  import { DISPATCHER_PARAMS_ID } from "~jsPath/define/dispatcher-params-id";

  export default {
    name: "TheHotelDetailV4Page",

    components: {
      G2JSlideHotel,
      G2JCard,
      PointCard,
      SlideDiscount,
      SlideReview,
      BlockFacities,
      "g2j-select-date-time": () =>
        import(
          "~jsPartialPath/global/component/g2j-select-date-time/G2JSelectDatetime.vue"
        ),
      ModalReview,
      HorizontalSwiperHotelSection,
      FlashSaleSwiperHotelSection,
      TheRoomTypeListSection: () =>
        import("./conponent/TheRoomTypeListSection.vue"),
      ModalFacilities,
      TheGo2joySliderImage,
      ModalNearby,
      ModalLanguageSpoken,
      ModalPolicy,
      G2jStarRating,
      VueContentLoading: window.VueContentLoading.VueContentLoading,
      "modal-checkin-time": () => import("./conponent/ModalCheckInTime.vue"),
    },
    data() {
      return {
        IMAGE_URL,
        ASSETS_SERVICE_URL,
        AJAX_URL,
        BASE_URL,
        dataHotelDetail: null,
        roomTypeList: [],
        listImageSlide: [],
        hotelSn: "",

        timeSelect: 1, //type to call api
        timeNow: "",
        dayCheckIn: "", // day check-in to call api
        dayCheckOut: "", // day check-out to call api
        timeCheckIn: "", // time check-in to call api
        timeCheckOut: "", // time check-out to call api
        dataFilterDateTime: {},

        isOvernightSpecial: null,
        isOvernightSpecialCalendar: null,
        isDefaultOvernightSpecial: true,
        typeOvernightSpecial: "right-now",
        hourWithFirstHours: null,
        startHourlyTime: null,
        startOvernight: null,
        endOvernight: null,
        isOvernight: null,
        checkHourWith6h: null,
        // startDaily: null,
        // endDaily: null,

        roomListRoom: [],
        mode: 1,
        totalFavorite: 0,
        userReviewFormList: [],
        roomTypeListSlide: [],
        favorite: false,
        dataStamp: {},

        reRenderCounter: 0,
        facilityWebList: [],
        facilityMobileList: [],
        facilityAll: [],
        scrollBySn: "",
        isAgoda: false,
        isShowToast: false,
        isShowToast30day: false,
        dataLanguageSpokenList: null,
        dataNearbyListEn: null,
        dataNearbyListVi: null,
        dataHotelPolicy: null,
        roomSingleDetail: null,
        dataIntroductionSingleRoomAgoda: null,
        flashSaleFormList: null,
        isLoadingRoomList: true,

        curScrollTop: 0,

        ui: {
          isLoadingReviews: false, //cai qq gi day~
        },
        isShowSuggestionHotel: false,

        // NOTE - define metaTagInfo
        metaTagInfo: {
          title: "",
          description: "",
        },
        checkGetRoom: false, //flag to check loading - phudnd
        reRenderSlider: 0, // flag to check re render slider
      };
    },

    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),

      listSlide() {
        //cai qq nay con dung k v?
        return this.listImageSlide;
      },
      ...mapGetters(HOTEL_INFO_MODULE_NAME, {
        hotelInfoV4: "hotelInfoV4",
        // roomActive: "roomActive",
      }),
      ...mapGetters(PAGE_INFO_MODULE_NAME, {
        hasUserInfo: "hasUserInfo",
      }),
      // ...mapState(PAGE_INFO_MODULE_NAME, {
      //   userInfo: "userProfile",
      // }),
      filterTime() {
        return [
          {
            id: 1,
            name: this.$t("common.hourly"),
            icon: "hourly.svg",
            is_active: this.isAgoda ? false : true,
          },
          {
            id: 2,
            name: this.$t("common.overnight"),
            icon: "overnight.svg",
            is_active: this.isAgoda ? false : true,
          },
          {
            id: 3,
            name: this.$t("common.daily"),
            icon: "daily.svg",
            is_active: true,
          },
        ];
      },
    },
    methods: {
      onSubMitCheckinTime(data) {
        if (this.isEmpty(data)) {
          this.updateURL();
        } else {
          let { info } = data;
          let roomDetailPath = getRoomDetailPagePath(
            {
              hotelName: this.$route.params.hotelName,
              roomName: GetSlug(info.name),
            },
            {
              hotelSn: this.hotelSn,
              roomTypeSn: info.sn,
              mode: info.mode,
              bookingType: this.timeSelect,
              checkInDatePlan: this.dayCheckIn.format("YYYY-MM-DD"),
              endDate: this.dayCheckOut.format("YYYY-MM-DD"),
              startTime: this.timeCheckIn,
              endTime: this.timeCheckOut,
              paymentMethod: this.hotelInfoV4.paymentMethod || 1,
            }
          );
          this.$router.push(roomDetailPath[this.language]);
        }
      },
      updateURL() {
        let query = { ...this.$route.query };
        // params.hotelName = GetSlug(this.dataHotelDetail.name);
        let params = { ...this.$route.params };
        // query.type = this.timeSelect;
        query.bookingType = this.timeSelect;
        query.startDate = this.dayCheckIn.format("YYYY-MM-DD");
        query.endDate = this.dayCheckOut.format("YYYY-MM-DD");
        query.startTime = this.timeCheckIn;
        query.endTime = this.timeCheckOut;
        query.mode = this.mode;

        if (this.$route.name == "hotel-detail-page") {
          this.$router.replace({
            name: this.$route.name,
            query,
            params,
          });
        }
      },
      async initRoute() {
        // Tâm phải tịnh, đầu óc thanh thản
        // K vấn vương điều gì

        // buôn bỏ đc là tốt

        let query = this.$route.query;
        let params = this.$route.params;
        let {
          startDate,
          endDate,
          type,
          hotelSn,
          startTime,
          endTime,
          mode,
          bookingType,
          from,
        } = query;

        this.timeSelect = !bookingType || bookingType == 0 ? 1 : bookingType; // lấy booking type, nếu = 0 thì set 1

        this.dayCheckIn = dayjs(startDate) || "";
        this.dayCheckOut = dayjs(endDate) || "";

        this.timeCheckIn = startTime || "";
        this.timeCheckOut = endTime || "";
        this.mode = !mode ? 1 : mode;

        if (
          startDate == "null" ||
          startDate == null ||
          !startDate ||
          startDate == "" ||
          endDate == "null" ||
          endDate == null ||
          endDate == "" ||
          !endDate
        ) {
          // phần này mới bổ sung thêm
          this.dayCheckIn = dayjs();
          this.dayCheckOut = dayjs();
          this.updateURL();
          return;
        }

        if (
          bookingType == 1 &&
          startDate &&
          endDate &&
          dayjs(endDate).diff(dayjs(startDate), "day") != 0
        ) {
          //case: dat o hourly ma khac ngay checkout
          this.dayCheckOut = this.dayCheckIn;
          this.updateURL(); // cap nhat lai url
          return;
        }

        if (
          bookingType == 2 &&
          startDate &&
          endDate &&
          dayjs(endDate).diff(dayjs(startDate), "day") != 1 &&
          !this.isOvernightSpecial
        ) {
          //case: dat o overnight ma ngay checkout khac ngay checkin +1
          this.dayCheckOut = dayjs(startDate).add(1, "day");
          this.updateURL(); // cap nhat lai url
          return;
        }
        if (startDate && endDate && dayjs(startDate).diff(dayjs(), "day") < 0) {
          this.dayCheckIn = dayjs();
          this.dayCheckOut =
            bookingType == 3 ? dayjs().add(1, "day") : this.dayCheckOut;

          this.updateURL(); // cap nhat lai url
          return;
        }
        //call api o day nhe nhang
        //    ================
        //   Muc tieu lam sao chay dc cho nay dung dan nhat
        //    ================
        // Suy nghi di

        if (!this.dataHotelDetail) {
          await this.getDataHotelDetail();
        } else {
          let pramSlug = this.$route.params.hotelName;
          let hotelSlug =
            GetSlug(this.dataHotelDetail.name) +
            "-" +
            DISPATCHER_PARAMS_ID.G2J_HOTEL_SN_ID +
            this.dataHotelDetail.sn;
          if (pramSlug != hotelSlug) {
            await this.getDataHotelDetail();
          }
        }

        // cai nay cho flash sale - ma gio k can disable
        if (
          this.isAgoda &&
          startDate &&
          endDate &&
          dayjs(endDate).diff(dayjs(startDate), "day") > 14
        ) {
          this.dayCheckOut = dayjs(startDate).add(14, "day");
          this.updateURL(); // cap nhat lai url
          return;
        }
        if (
          !startTime ||
          startTime == null ||
          startTime == "null" ||
          !endTime ||
          endTime == null ||
          endTime == "null"
        ) {
          //case: lan dau lam chuyen ay =)), khi ma k co thoi gian =>  thi chay cai nay de lay thoi gian

          // khi nao thay be tat qua thi mo may cai cmt ra, dong cai hien tai lai
          if (!this.dataFilterDateTime.hourly && bookingType == 1) {
            // this.timeSelect = this.timeSelect ? this.timeSelect : 1;
            this.timeSelect = 2;
          }
          if (!this.dataFilterDateTime.overnight && bookingType == 2) {
            // this.timeSelect = this.timeSelect ? this.timeSelect : 2;
            this.timeSelect = 3;
          }
          if (
            !this.dataFilterDateTime.hourly &&
            !this.dataFilterDateTime.overnight
          ) {
            // this.timeSelect = this.timeSelect ? this.timeSelect : 3;
            this.timeSelect = 3;
          }
          if (this.mode == 2 && from != "search") {
            // độ ưu tiên flash sale đang cao hơn
            this.timeSelect = 2;
          }
          await this.initDateTime(this.timeSelect); // cai nay quan trong ne lay datetime mac dinh
          this.updateURL();
          return;
        }

        // may thang api rau ria chay sau thi nam day
        this.isLoadingRoomList = true;

        await this.getRoomTypeList();
        this.getHotelSuggestionForHotelDetail(this.timeSelect);
        this.isLoadingRoomList = false;
        // document.documentElement.scrollTop(this.curScrollTop);
        // window.scrollTo({ top: this.curScrollTop, behavior: "smooth" });
      },
      openModalReview() {
        // setTimeout(() => {
        //   }, 500);
        this.$refs["filter-modal-reviews"].showModal();
      },

      async openModalFacilities() {
        if (!BOT_INFO.isBot) {
          const self = this;
          apiCaller({
            metaUrl: AJAX_URL.hotel_v4.getFacilityList,
            data: {
              hotelSn: self.hotelSn,
              // roomTypeSn  : 10,
            },
            method: "GET",
            headers: {
              Authorization: getToken(),
            },
            dataType: "json",
            error() {},
            success(objResponse) {
              if (_.isEmpty(objResponse) || objResponse.error) {
                return;
              }
              self.facilityAll = objResponse?.data ?? [];
            },
            complete() {
              setTimeout(() => {
                self.$refs["facility-modal"].showModal();
              }, 500);
            },
          });
        }
      }, // openModalFacilities

      openModalReviewScrollBySn(sn) {
        this.scrollBySn = sn;
        setTimeout(() => {
          this.$refs["filter-modal-reviews"].showModal();
        }, 500); // sao cu mo modal la setTimeout???
      }, // openModalReviewScrollBySn

      isEmpty: _.isEmpty,
      ...mapActions(HOTEL_INFO_MODULE_NAME, {
        // getHotelInfo: "getHotelInfo", //v3
        // sextRoomActive: "setRoomActive", //v3
        getHotelInfoV4: "getHotelInfoV4",
      }),
      compareTime, // so sánh thời gian với format HH:mm
      initDateTime(data) {
        if (this.isEmpty(this.dayCheckIn)) {
          this.dayCheckIn = dayjs();
        }
        if (data == 1) {
          let h = dayjs().hour();
          let m = dayjs().minute();
          if (m > 30) {
            this.timeCheckIn = dayjs().add(1, "hour").hour() + ":00";
            this.timeCheckOut =
              dayjs()
                .add(1 + this.dataFilterDateTime.firstHours, "hour")
                .hour() + ":00";
          } else {
            this.timeCheckIn = h + ":30";
            this.timeCheckOut =
              dayjs().add(this.dataFilterDateTime.firstHours, "hour").hour() +
              ":30";
          }

          if (!this.isOvernight && this.checkHourWith6h) {
            this.timeCheckIn = this.startHourlyTime;
            this.timeCheckOut =
              dayjs()
                .set("hour", this.dataFilterDateTime.startHourlyTime)
                .add(1 + this.dataFilterDateTime.firstHours, "hour")
                .hour() + ":00";
            return;
          }
          if (this.isOvernight) {
            if (this.dataFilterDateTime.overnight) {
              this.timeSelect = 2;

              this.timeCheckIn = this.isOvernightSpecial
                ? dayjs().hour() + ":" + dayjs().minute()
                : this.dataFilterDateTime.startOvernight + ":00";
              this.timeCheckOut = this.dataFilterDateTime.endOvernight + ":00";

              this.dayCheckOut = this.isOvernightSpecial
                ? dayjs(this.dayCheckIn)
                : dayjs(this.dayCheckIn).add(1, "day");

              this.timeCheckIn = this.handleFormatTime(this.timeCheckIn);
              this.timeCheckOut = this.handleFormatTime(this.timeCheckOut);
            } else {
              this.timeSelect = 3;
              this.timeCheckIn = this.dataFilterDateTime.checkin + ":00";
              this.timeCheckOut = this.dataFilterDateTime.checkout + ":00";
              this.dayCheckOut = dayjs(this.dayCheckIn).add(1, "day");
              this.timeCheckIn = this.handleFormatTime(this.timeCheckIn);
              this.timeCheckOut = this.handleFormatTime(this.timeCheckOut);
            }

            return;
          }
          // this.dayCheckIn = dayjs();

          this.dayCheckOut = dayjs(this.dayCheckIn);
        }
        if (data == 2) {
          this.timeCheckIn = this.isOvernightSpecial
            ? dayjs().hour() + ":" + dayjs().minute()
            : this.dataFilterDateTime.startOvernight + ":00";

          this.timeCheckOut = this.dataFilterDateTime.endOvernight + ":00";
          // this.dayCheckOut = dayjs(this.dayCheckIn).add(1, "day");
          this.dayCheckIn = this.isOvernightSpecial ? dayjs() : this.dayCheckIn;
          this.dayCheckOut = this.isOvernightSpecial
            ? dayjs(this.dayCheckIn)
            : dayjs(this.dayCheckIn).add(1, "day");
        }
        if (data == 3) {
          this.timeCheckIn = this.dataFilterDateTime.checkin + ":00";
          this.timeCheckOut = this.dataFilterDateTime.checkout + ":00";
          // this.dayCheckIn = dayjs();
          this.dayCheckIn = this.isOvernightSpecial ? dayjs() : this.dayCheckIn;
          this.dayCheckOut = this.dayCheckOut
            ? dayjs(this.dayCheckOut)
            : dayjs(this.dayCheckIn).add(1, "day");
        }
        this.timeCheckIn = this.handleFormatTime(this.timeCheckIn);
        this.timeCheckOut = this.handleFormatTime(this.timeCheckOut);
      }, // initDateTime
      onChangeTypeTime(data) {
        if (data == this.timeSelect) return;
        this.isLoadingRoomList = true;

        this.timeSelect = data;

        let check = data ? data : this.timeSelect;

        if (check == 1 && this.isOvernight && !this.checkHourWith6h) {
          this.timeSelect = 1;
          this.timeCheckIn = this.dataFilterDateTime.startHourlyTime + ":00";

          this.timeCheckOut =
            dayjs()
              .set("hour", this.dataFilterDateTime.startHourlyTime)
              .add(1 + this.dataFilterDateTime.firstHours, "hour")
              .hour() + ":00";
          this.dayCheckIn = this.isOvernightSpecial
            ? dayjs()
            : dayjs().add(1, "day");
          //cho nay co gi do sai sai
          // this.dayCheckOut = dayjs().add(2, "day");

          this.timeCheckIn = this.handleFormatTime(this.timeCheckIn);
          this.timeCheckOut = this.handleFormatTime(this.timeCheckOut);
          this.updateURL();
          return;
        }
        this.initDateTime(data);
        this.updateURL();
      }, // onChangeTypeTime
      async getDataHotelDetail() {
        this.ui.isLoadingReviews = true;

        // let id = this.$route.query.hotelSn;
        let params = { ...this.$route.params };
        let query = { ...this.$route.query };
        let arrHotelName = params.hotelName.split("-");

        //handle get hotel sn from url
        this.hotelSn =
          arrHotelName[arrHotelName.length - 1].slice(
            0,
            DISPATCHER_PARAMS_ID.G2J_HOTEL_SN_ID.length
          ) == DISPATCHER_PARAMS_ID.G2J_HOTEL_SN_ID
            ? arrHotelName[arrHotelName.length - 1].slice(
                DISPATCHER_PARAMS_ID.G2J_HOTEL_SN_ID.length
              )
            : null;

        //case nay cho may truong hop xua cu
        this.hotelSn =
          !this.hotelSn && query.hotelSn ? query.hotelSn : this.hotelSn;

        query.bookingType = this.timeSelect;
        query.startTime = this.handleFormatTime(query.startTime);
        query.endTime = this.handleFormatTime(query.endTime);
        query.hotelSn = this.hotelSn;
        await this.getHotelInfoV4({ query });

        // NOTE - setup meta tag infor
        if (this.hotelInfoV4) {
          const hotelName = GenerateTitleCase(this.hotelInfoV4.name);
          const provinceName = GenerateTitleCase(this.hotelInfoV4.provinceName);

          this.metaTagInfo.title =
            hotelName +
            ", " +
            provinceName +
            " - Cập nhật giá mới nhất năm " +
            new Date().getFullYear();
          this.metaTagInfo.description =
            "Ưu đãi đặt phòng khách sạn " +
            hotelName +
            " trên Go2Joy với giá tốt, đơn giản, nhanh chóng.";

          this.metaTagInfo["og:type"] = "hotel"; //end og:type
          this.metaTagInfo["og:title"] =
            hotelName +
            ", " +
            provinceName +
            " - Cập nhật giá mới nhất năm " +
            new Date().getFullYear(); //end og:title
          this.metaTagInfo["og:description"] =
            "Ưu đãi đặt phòng khách sạn " +
            hotelName +
            " trên Go2Joy với giá tốt, đơn giản, nhanh chóng."; //end og:description
          this.metaTagInfo["og:url"] = BASE_URL + window.location.pathname; //end og:url
          this.metaTagInfo["og:site_name"] = "Go2Joy"; //end og:site_name
          this.metaTagInfo[
            "og:image"
          ] = `${this.ASSETS_SERVICE_URL}/${this.hotelInfoV4.hotelImageList[0].imagePath}`; //end og:image
          this.metaTagInfo["og:image:width"] = "1200"; //end og:image:width
          this.metaTagInfo["og:image:height"] = "628"; //end og:image:height

          this.$metaTag.setup(this.metaTagInfo);
        }

        this.initData(this.hotelInfoV4);
        this.ui.isLoadingReviews = false;

        this.reRenderSlider++; //case: when click suggestion => render slider
      }, //getDataHotelDetail
      handleFormatTime,
      async getRoomTypeList() {
        let query = { ...this.$route.query };
        query.startTime = this.handleFormatTime(query.startTime);
        query.endTime = this.handleFormatTime(query.endTime);

        const _objQuery = {
          hotelSn: this.hotelSn,
          bookingType: this.timeSelect,
          startTime: this.handleFormatTime(query.startTime),
          endTime: this.handleFormatTime(query.endTime),
          startDate: this.dayCheckIn.format("YYYY-MM-DD"),
          endDate: this.dayCheckOut.format("YYYY-MM-DD"),
        };

        // NOTE - API roomTypeList just be called if user isn't bot
        if (!BOT_INFO.isBot) {
          try {
            let res = await apiCaller({
              metaUrl: AJAX_URL.hotel.roomTypeList,
              dataType: "json",
              data: _objQuery,
              method: "GET",
              contentType: "application/json; charset=utf-8",
            });

            if (_.isEmpty(res) || res.error || _.isEmpty(res.data)) {
              this.roomTypeList = [];
              this.reRenderCounter++;
              return;
            }
            this.roomTypeList = res.data;

            if (this.dataHotelDetail.origin !== 2) {
              let roomList = res.data;
              this.roomTypeList = roomList.roomTypeList;
              this.flashSaleFormList = {
                displayType: 5,
                hotelList: roomList.roomFlashSaleList,
                title: "Giảm sốc|Flash Sale",
              };
            }
            if (this.isAgoda && this.roomTypeList.length == 1) {
              this.getRoomSingleDetail();
            }
            this.reRenderCounter++;
          } catch (error) {
            console.log("error :>> ", error);
          } finally {
          }
        }
      }, // getRoomTypeList
      async getRoomSingleDetail() {
        let query = { ...this.$route.query };
        query.startTime = this.handleFormatTime(query.startTime);
        query.endTime = this.handleFormatTime(query.endTime);

        const _objQuery = {
          roomTypeSn: this.roomTypeList[0].sn,
          bookingType: this.timeSelect,
          startTime: this.handleFormatTime(query.startTime),
          endTime: this.handleFormatTime(query.endTime),
          startDate: this.dayCheckIn.format("YYYY-MM-DD"),
          endDate: this.dayCheckOut.format("YYYY-MM-DD"),
          mode: 1,
        };

        try {
          let res = await apiCaller({
            metaUrl: AJAX_URL.hotel_v4.getRoomTypeDetail,
            dataType: "json",
            data: _objQuery,
            method: "GET",
            contentType: "application/json; charset=utf-8",
          });

          if (_.isEmpty(res) || res.error || _.isEmpty(res.data)) {
            this.roomSingleDetail = [];
            this.reRenderCounter++;
            return;
          }

          this.roomSingleDetail = res.data;
          this.dataIntroductionSingleRoomAgoda =
            this.roomSingleDetail.roomDescription;
          this.reRenderCounter++;
        } catch (error) {
          console.log("error :>> ", error);
        } finally {
        }
      }, //getRoomSingleDetail
      initData(data) {
        if (!data) return;
        this.dataHotelDetail = data;

        //check hotel name on url with hotel name - v_v
        // chỗ này check hơi thừa => ver sau bỏ, hứa => phudnd
        let pramSlug = this.$route.params.hotelName;
        let hotelSlug =
          GetSlug(this.dataHotelDetail.name) +
          "-" +
          DISPATCHER_PARAMS_ID.G2J_HOTEL_SN_ID +
          this.dataHotelDetail.sn;

        if (hotelSlug != pramSlug) {
          let query = { ...this.$route.query };
          let params = { ...this.$route.params };
          params.hotelName = hotelSlug;
          this.checkGetRoom = true;
          this.$router.replace({ name: "hotel-detail-page", query, params });
        }
        //end

        this.mode = data.flashSaleList && data.flashSaleList.length ? 2 : 1; //mode: 1-normal, 2-flash-sale ^phudnd^

        this.userReviewFormList = this.dataHotelDetail.userReviewFormList;

        //handle facility from Thanh
        this.facilityWebList = this.dataHotelDetail.facilityFormList;
        if (this.facilityWebList && this.facilityWebList.length > 6) {
          this.facilityMobileList = this.facilityWebList.slice(0, 6);
        } else {
          this.facilityMobileList = this.facilityWebList;
        }
        this.totalFavorite = this.dataHotelDetail.totalFavorite;
        this.favorite = this.dataHotelDetail.favorite;
        //end facility

        //handle infomation hotel: stamp, redeem, discount
        this.dataStamp = {
          activeStamp: this.dataHotelDetail.activeStamp,
          numToRedeem: this.dataHotelDetail.numToRedeem,
          stampDiscount: this.dataHotelDetail.stampDiscount,
        };

        //handle slide from chu Tuyen => k thấy dùng
        this.roomTypeListSlide = data.roomSettingFormList;

        //hanlde for Agoda - ^phudnd^
        this.isAgoda = data.origin == 2 ? true : false; //  isAgoda: check ks có phải agoda
        this.timeSelect = this.isAgoda ? 3 : this.timeSelect; // nếu là ks agoda thì cho bookingType nó bằng 3

        //handle to show room data flash sale
        if (this.dataHotelDetail.origin == 2) {
          this.flashSaleFormList = {
            displayType: 5,
            hotelList: this.dataHotelDetail.flashSaleList,
            title: "Giảm sốc|Flash Sale",
          };
        }
        this.listImageSlide = data.hotelImageList.filter((el) => {
          return el.type == 1;
        });
        //end handle to show flash sale

        // check datetime - ^phudnd^
        let {
          hourly = true,
          overnight = true,
          daily = true,
          checkin,
          checkout,
          startHourlyTime,
          startOvernight,
          endOvernight,
          firstHours = 1,
        } = data;
        this.dataFilterDateTime = {
          hourly,
          overnight,
          daily,
          checkin,
          checkout,
          startHourlyTime,
          startOvernight,
          endOvernight,
          firstHours,
        };
        this.startOvernight = this.dataFilterDateTime.startOvernight + ":00";
        this.endOvernight = this.dataFilterDateTime.endOvernight + ":00";
        this.startHourlyTime = this.dataFilterDateTime.startHourlyTime + ":00";
        // let h = dayjs().hour();
        let m = dayjs().minute();
        if (m > 30) {
          this.hourWithFirstHours =
            dayjs().add(this.dataFilterDateTime.firstHours, "hour").hour() +
            ":00";
          this.timeNow = dayjs().add(1, "hour").hour() + ":00";
        } else {
          this.hourWithFirstHours =
            dayjs().add(this.dataFilterDateTime.firstHours, "hour").hour() +
            ":30";
          this.timeNow = dayjs().hour() + ":30";
        }
        //hourWithFirstHours => giờ hiện tại + với first hour

        //---variable check time---
        let checkWith6h =
          this.compareTime(this.startHourlyTime, "6:00") == 1
            ? "6:00"
            : this.startHourlyTime; //check gio hien tai so voi 6h

        let checkOvernight = this.compareTime(
          this.hourWithFirstHours,
          this.startOvernight
        ); //check giờ hiện tại so với giờ bắt đầu qua đêm

        let checkOvernight2 = this.compareTime(this.hourWithFirstHours, "06:00"); // check giờ hiện tại so với giờ kết thúc qua đêm
        // this.endOvernight;

        let checkOvernightWithHour = this.compareTime(
          this.hourWithFirstHours,
          this.startHourlyTime
        ); // check giờ hiện tại so với giờ bắt đầu theo giờ

        let checkStartEndOvernight = this.compareTime(
          this.startOvernight,
          this.endOvernight
        );
        if (checkStartEndOvernight == 1) {
          //khac ngay
          this.checkHourWith6h =
            this.timeNow.split(":")[0] >= 6 &&
            this.timeNow.split(":")[0] <
              this.dataFilterDateTime.startHourlyTime &&
            this.timeNow.split(":")[0] < this.dataFilterDateTime.startOvernight;

          this.isOvernight =
            checkOvernight != -1 ||
            (checkOvernight2 == -1 &&
              checkOvernightWithHour != 1 &&
              !this.checkHourWith6h);
        } else {
          // cung ngay
          this.isOvernight = checkOvernight != -1 && checkOvernight2 == -1;
        }

        let check0h = 0 <= Number(dayjs().hour()) && Number(dayjs().hour()) <= 6;
        let checkToday =
          dayjs().get("date") == dayjs(this.dayCheckIn).get("date");
        // checkToday &&
        this.isOvernightSpecial =
          checkToday &&
          check0h &&
          this.compareTime(checkWith6h, this.timeNow) != -1 &&
          this.isOvernight
            ? true
            : false;
        this.isOvernightSpecialCalendar =
          check0h &&
          this.compareTime(checkWith6h, this.timeNow) != -1 &&
          this.isOvernight
            ? true
            : false; //check xem có rơi vào trường hợp đặc biêt, là giờ qua đêm từ 0:00-6:00, biến này dùng cho nhiều component - đụng dô là cụt nách

        //end ^phudnd^

        this.dataLanguageSpokenList =
          this.dataHotelDetail.languageSpokenList.slice(0, 3);
        this.dataNearbyListEn = this.dataHotelDetail.nearbyList.en;
        this.dataNearbyListVi = this.dataHotelDetail.nearbyList.vi;
        this.dataHotelPolicy = this.dataHotelDetail.hotelPolicy;
      },
      onCheckInTime() {
        if (this.isOvernightSpecialCalendar) {
          // if (this.isOvernightSpecial) {
          // this.$refs["modal-checkin-time"].openModal();
          this.openModalCheckInTime();
        }
      },
      openModalCheckInTime(name = "default") {
        //open modal check-in time
        this.$refs["modal-checkin-time"].openModal(name);
      },
      openModalSelect(name = "default") {
        if (name != "default") {
          //eo biet sao code vay nua

          this.$refs["select-date-time"].openModal();
          return;
        }
        if (this.timeSelect == 2) {
          this.onCheckInTime();
          if (this.isOvernightSpecialCalendar) return;
        }

        //open modal select check-in check-out
        this.$refs["select-date-time"].openModal();
      }, // openModalSelect
      openModalNearBy() {
        this.$refs["select-modal-nearby"].showModal();
      }, // openModalNearBy
      openModalSpoken() {
        this.$refs["select-modal-language-spoken"].showModal();
      }, // openModalSpoken
      openModalPolicy() {
        this.$refs["select-modal-policy"].showModal();
      }, // openModalPolicy
      formatMMM(day) {
        if (!day) return;
        let CDate = dayjs(day).locale(this.language).format("DD/MM/YYYY");
        return CDate;
      }, // formatMMM()
      onSubmit() {
        // this.isLoadingRoomList = true;
        this.updateURL();
      }, // onSubmit
      async onUpdateFavorite(valueFavorite) {
        // console.log("valueFavorite :>> ", valueFavorite);
        // EventBus.emit("IS_SHOW_ROUTER_LOADING", true);

        if (!BOT_INFO.isBot) {
          try {
            let res = await apiCaller({
              metaUrl: AJAX_URL.hotel.favorite,
              dataType: "json",
              data: {
                hotelSn: this.hotelSn,
                favorite: valueFavorite,
              },
              headers: {
                Authorization: getToken(),
              },
              method: "POST",
              contentType: "application/json; charset=utf-8",
            });
          } catch (error) {
            console.log("error :>> ", error);
          }
        }
      }, // onUpdateFavorite
      getSliderValue(value) {}, // get value by slider global
      roudingMathNumber(number) {
        if (number >= 1) {
          return Math.round(number * 10) / 10;
        } else {
          return Math.round(number * 1000);
        }
      }, // roudingMathNumber
      roudingMathNumberNearBy(number) {
        return (Math.round(number * 10) / 10).toFixed(1);
      }, // roudingMathNumberNearBy

      async getHotelSuggestionForHotelDetail(timeSelect) {
        let id = this.hotelSn;
        let query = {
          limit: 15,
          bookingType: timeSelect,
          hotelSn: id,
        };
        // EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        this.isShowSuggestionHotel = false;
        try {
          let res = await apiCaller({
            metaUrl: AJAX_URL.hotel.suggestionForHotel,
            dataType: "json",
            data: query,
            method: "GET",
            contentType: "application/json; charset=utf-8",
          });

          this.roomListRoom = {
            displayType: 8,
            hotelList: res.data.hotelHasRoomAvailable,
            title: "Các khách sạn tương tự|More hotel has room available",
          };
          this.isShowSuggestionHotel = true;
          // this.roomListRoom.hotelList.unshift(dataHardCode);
        } catch (error) {
          console.log("error :>> ", error);
        }
      }, // getHotelSuggestionForHotelDetail
      editToLowerCase(string) {
        return string.toLowerCase();
      }, // editToLowerCase
      getLabelLanguageSpoken(string) {
        if (this.language == "en") {
          return string.split("|")[1];
        } else {
          return string.split("|")[0];
        }
      }, // getLabelLanguageSpoken
      generateRating() {
        if (
          !this.dataHotelDetail ||
          typeof this.dataHotelDetail.averageMark !== "number"
        ) {
          return 0;
        }

        let tmpRating = String(this.dataHotelDetail.averageMark);

        tmpRating = tmpRating.length === 1 ? tmpRating + ".0" : tmpRating;

        return String(tmpRating);
      }, // generateRating()

      onClickRoomOvernightSpecial({ isDisable, href, info }) {
        if (isDisable) {
          this.$refs["modal-checkin-time"].$props.isDisableToNight = isDisable;
        }
        this.openModalCheckInTime({ name: "room", href, info });
      },
    },
    created() {},
    mounted() {
      let Fbq = () => {
        if (this.isEmpty(this.dataHotelDetail)) {
          setTimeout(() => {
            Fbq();
          }, 400);
          return;
        }
        G2JFbqTracking("ViewContent", {
          content_type: "hotel",
          content_ids: [this.dataHotelDetail.sn],
          content_name: this.dataHotelDetail.name,
          content_category: "Hotel Detail",
          city: this.dataHotelDetail.provinceName,
        });
      };
      Fbq(); // fbq facebook tracking
    },
    watch: {
      "$route.params.hotelName": {
        async handler(newVal, oldVal) {
          if (newVal !== oldVal) {
            //check khi thay đổi url cập nhật hotel and room
            //case: update data from search
            await this.getDataHotelDetail();
            if (!this.checkGetRoom) {
              this.getRoomTypeList();
            }
          }
        },
      },
      "$route.query": {
        async handler(newVal, oldVal) {
          if (this.isEmpty(this.dataHotelDetail)) {
            EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
          }
          if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            await this.initRoute();
          }
        },
        immediate: true, //call bat chap, call trc created
      },
      hotelSn() {
        // handle loading suggestion list
        this.isShowSuggestionHotel = false;
        EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        window.scrollTo(0, 0);
      },
    },
  };
</script>

<style src="./hotel-detail-page-style.css"></style>
