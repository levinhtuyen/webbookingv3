<template>
  <div class="payment-page">
    <div class="payment-section">
      <div class="payment-section__banner">

        <g2j-image
          itemprop="photo"
          class="banner-img-outer"
          :url-img="`${ASSETS_SERVICE_URL}/${hotelData.imagePath}`"
          :alt-img="hotelData.name? hotelData.name:null"
        />
        <p class="hotel-name">
          {{ hotelData.name }}
        </p>
      </div>
      <!-- end banner -->
      <div class="container">
        <div class="payment-block">
          <div class="payment-block__content">
            <div class="room-info">
              <div class="room-detail room-img">
                <!-- <img
                  v-if="roomData && roomData.imagePath"
                  :src="`${ASSETS_SERVICE_URL}/${roomData.imagePath}`"
                > -->
                <!-- v-if="roomData && roomData.imagePath" -->
                <g2j-image
                  itemprop="name"
                  :url-img="`${ASSETS_SERVICE_URL}/${avatarRoom}`"
                  :alt-img="roomName|| null"
                />
              </div>
              <div class="room-detail room-name-type">
                <div
                  class="__room-name"
                  @click="openModalChangeRoom"
                  itemprop="name"
                >
                  {{ roomName }}
                </div>
                <div
                  class="__room-type"
                  :class="mode == 2 ? 'text-center' : ''"
                >
                  <button
                    v-if="
                      mode != 2 && roomData && roomData.firstHoursOrigin > 0
                    "
                    class="room-type-button hour"
                    :class="bookingType == 1 ? 'active' : ''"
                    @click="onChangeTypeBooking(1),G2JDablenaTracking(DABLE_TRACKING.TRACKING_VIEW_BOOK_HOURLY)"
                  >
                    <p>{{ $t("payment.room_type.hour") }}</p>
                  </button>
                  <button
                    v-if="roomData && roomData.overnightOrigin > 0"
                    class="room-type-button overnight"
                    :class="bookingType == 2 ? 'active' : ''"
                    @click="onChangeTypeBooking(2),G2JDablenaTracking(DABLE_TRACKING.TRACKING_VIEW_BOOK_OVERNIGHT)"
                  >
                    <p>{{ $t("payment.room_type.overnight") }}</p>
                  </button>
                  <button
                    v-if="mode != 2 && roomData && roomData.oneDayOrigin > 0"
                    class="room-type-button daily"
                    :class="bookingType == 3 ? 'active' : ''"
                    @click="onChangeTypeBooking(3),G2JDablenaTracking(DABLE_TRACKING.TRACKING_VIEW_BOOK_DAILY)"
                  >
                    <p>{{ $t("payment.room_type.daily") }}</p>
                  </button>
                </div>
              </div>
              <div class="room-detail room-check-total">
                <div class="__check-info">
                  <div class="check-in">
                    <div class="check-in-note">
                      {{ $t("payment.check_in") }}
                      <TheGo2JoyToolTip :icon="'icon/question-logo.png'">
                        <template #description>
                          <p class="title">
                            {{ $t("hotel_detail.policy") }}
                          </p>
                          <p class="content">
                            <span>
                              {{ $t("hotel_detail.start_hourly_time") }}</span>:
                            <span>
                              {{
                                $t("hotel_detail.from") + hotelData
                                  ? hotelData.startHourlyTime
                                  : ""
                              }}</span>h
                          </p>
                          <p class="content">
                            <span>
                              {{ $t("hotel_detail.daily_check_in_time") }}</span>:
                            <span>
                              {{
                                $t("hotel_detail.from") + hotelData
                                  ? hotelData.checkin
                                  : ""
                              }}</span>h
                          </p>
                          <p class="content">
                            <span>
                              {{
                                $t("hotel_detail.daily_check_out_time")
                              }}</span>:
                            <span>
                              {{
                                $t("hotel_detail.from") + hotelData
                                  ? hotelData.checkout
                                  : ""
                              }}</span>h
                          </p>
                          <p class="content">
                            <span> {{ $t("hotel_detail.overnight_time") }}</span>:
                            <span>
                              {{
                                hotelData
                                  ? hotelData.startOvernight
                                  : "" + "h ~" + hotelData
                                    ? hotelData.endOvernight
                                    : ""
                              }}</span>h
                          </p>
                          <p class="content">
                            <span>
                              {{
                                $t("hotel_detail.free_cancellation_until")
                              }}</span>:
                            <span>
                              {{
                                (hotelData ? hotelData.cancelBeforeHours : "") +
                                  ".0" +
                                  $t("hotel_detail.hour_before_check_in_time")
                              }}</span>
                          </p>
                        </template>
                      </TheGo2JoyToolTip>
                    </div>
                    <PopoverDatePicker
                      ref="checkIn"
                      :type="'check-in-popover'"
                      :obj-check-in="objCheckIn"
                      :obj-check-out="objCheckOut"
                      :start-date-picker="startDate"
                      :end-date-picker="endDate"
                      :start-time-pick="startTimePick"
                      :end-time-pick="endTimePick"
                      :booking-type="bookingType"
                      @onChangeStartDate="onChangeStartDate"
                      @onChangeEndDate="onChangeEndDate"
                      @setStartTime="setStartTime"
                      @setEndTime="setEndTime"
                    />
                  </div>
                  <div class="check-out">
                    <div class="check-in-note">
                      {{ $t("payment.check_out") }}
                      <TheGo2JoyToolTip :icon="'icon/question-logo.png'">
                        <template #description>
                          <p class="title">
                            {{ $t("hotel_detail.policy") }}
                          </p>
                          <p class="content">
                            <span>{{
                              $t("hotel_detail.start_hourly_time")
                            }}</span>:
                            <span>{{
                              $t("hotel_detail.from") + hotelData
                                ? hotelData.startHourlyTime
                                : ""
                            }}</span>h
                          </p>
                          <p class="content">
                            <span>{{
                              $t("hotel_detail.daily_check_in_time")
                            }}</span>:
                            <span>{{
                              $t("hotel_detail.from") + hotelData
                                ? hotelData.checkin
                                : ""
                            }}</span>h
                          </p>
                          <p class="content">
                            <span>{{
                              $t("hotel_detail.daily_check_out_time")
                            }}</span>:
                            <span>{{
                              $t("hotel_detail.from") + hotelData
                                ? hotelData.checkout
                                : ""
                            }}</span>h
                          </p>
                          <p class="content">
                            <span>{{ $t("hotel_detail.overnight_time") }}</span>:
                            <span>{{
                              hotelData
                                ? hotelData.startOvernight
                                : "" + " h ~" + hotelData
                                  ? hotelData.endOvernight
                                  : ""
                            }}</span>h
                          </p>
                          <p class="content">
                            <span>{{
                              $t("hotel_detail.free_cancellation_until")
                            }}</span>:<span>{{
                              (hotelData ? hotelData.cancelBeforeHours : "") +
                                ".0 " +
                                $t("hotel_detail.hour_before_check_in_time")
                            }}</span>
                          </p>
                        </template>
                      </TheGo2JoyToolTip>
                    </div>
                    <PopoverDatePicker
                      ref="checkOut"
                      :type="'check-out-popover'"
                      :obj-check-in="objCheckIn"
                      :obj-check-out="objCheckOut"
                      :start-date-picker="startDate"
                      :end-date-picker="endDate"
                      :start-time-pick="startTimePick"
                      :end-time-pick="endTimePick"
                      :booking-type="bookingType"
                      @onChangeStartDate="onChangeStartDate"
                      @onChangeEndDate="onChangeEndDate"
                      @setStartTime="setStartTime"
                      @setEndTime="setEndTime"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- end room info -->
            <div
              v-if="!isEmpty(productList)"
              class="extra-service"
            >
              <div class="__header-extra-service">
                {{ $t("payment.extra_service") }}
              </div>
              <div class="__content-extra-service">
                <g2j-swiper-component
                  :data.sync="productList"
                  class="special-products"
                  @selectItem="openModalExtraService"
                >
                  <template slot-scope="slotProps">
                    <div class="special-products__container-img">
                      <img
                        :src="ASSETS_SERVICE_URL +'/'+slotProps.item.imagePath"
                        alt=""
                      >
                    </div>
                    <div class="special-products__name">
                      <p> {{ language == "vi" ? slotProps.item.name : slotProps.item.nameEn }}</p>
                    </div>
                  </template>
                </g2j-swiper-component>

                <div
                  v-if="isHasProductSelected"
                  class="menu-extra-service"
                >
                  <div class="special-service-box">
                    <div
                      v-for="(item, key) in productSelect"
                      :key="key"
                    >
                      <template v-for="(v, k) in item.data">
                        <div
                          v-if="v.num != 0"
                          :key="k"
                          class="service-info"
                        >
                          <div class="servive-name">
                            <p>{{ v.name }}</p>
                          </div>
                          <div class="servive-num">
                            <p class="action">
                              <button
                                :disabled="isSelectExtra"
                                class="servive-num__btn"
                                @click="changeItemSelect(v, k, 'minus')"
                              >
                                <i class="fa fa-minus minus fa-xs" />
                              </button>

                              <span class="px-10px">{{ v.num }}</span>
                              <button
                                :disabled="isSelectExtra"
                                @click="changeItemSelect(v, k, 'plus')"
                              >
                                <i class="fa fa-plus plus fa-xs" />
                              </button>
                            </p>
                          </div>
                          <div class="servive-price">
                            <p>{{ v.price }}</p>
                          </div>
                        </div>
                      </template>
                    </div>
                    <div
                      v-if="dataBooking && dataBooking.specialProductFee"
                      class="special-service-total"
                    >
                      <div class="service-total-text">
                        <p>{{ $t("payment.payment_info.ex_ser_fee") }}:</p>
                      </div>
                      <div class="service-total-price">
                        <p>
                          {{ formatPriceVND(dataBooking.specialProductFee) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- end extra-service -->
            <div class="promotion">
              <div class="__header-promotion">
                <div
                  class="header-item"
                  :class="promotionType == 1 ? 'active' : ''"
                  @click="onChangePromotion(1)"
                >
                  {{ $t("payment.promotion.coupon") }}
                </div>
                <div
                  class="header-item"
                  :class="promotionType == 2 ? 'active' : ''"
                  @click="onChangePromotion(2)"
                >
                  {{ $t("payment.promotion.stamp") }}
                </div>
                <div
                  class="header-item"
                  :class="promotionType == 3 ? 'active' : ''"
                  @click="onChangePromotion(3)"
                >
                  {{ $t("payment.promotion.point") }}
                </div>
              </div>
              <div
                v-if="hasUserInfo"
                class="__content-promotion login-mode"
              >
                <div v-show="promotionType == 1">
                  <div v-if="mode != 2">
                    <VueContentLoading
                      v-if="loadingCoupon"
                      :width="300"
                      :height="70"
                    >
                      <rect
                        x="0"
                        y="5"
                        rx="4"
                        ry="4"
                        width="80%"
                        height="10"
                      />
                      <rect
                        x="0"
                        y="25"
                        rx="4"
                        ry="4"
                        width="60%"
                        height="6"
                      />
                      <rect
                        x="0"
                        y="40"
                        rx="4"
                        ry="4"
                        width="40%"
                        height="6"
                      />
                    </VueContentLoading>
                    <div
                      v-else-if="promotionList.length > 0"
                      class="swiper-container swiper-coupon-promotion"
                    >
                      <div class="swiper-wrapper">
                        <template v-for="(pro, idx) in promotionList">
                          <div
                            :key="idx"
                            :set="
                              (isShowSwiper =
                                idx === Number(promotionList.length) - 1)
                            "
                            class="swiper-slide coupon-item promotion-item"
                          >
                            <div
                              class="coupon-title"
                              v-if="pro"
                            >
                              <router-link
                                :to="promotionDetailPath(pro)[language]"
                                v-slot="{ href, navigate }"
                              >
                                <a
                                  :href="href"
                                  @click="navigate"
                                  target="_blank"
                                  class="coupon-name"
                                >
                                  {{ pro.promotionName }}
                                </a>
                              </router-link>

                              <!-- <img
                                class="coupon-rule"
                                :src="`${IMAGE_URL}/icon/exclamation-logo.png`"
                                width="25"
                                height="25"
                                @click="onOpenRule(pro)"
                                alt="exclamation-logo.png"
                              > -->
                              <!-- <TheGo2JoyToolTip
                                :icon="'icon/exclamation-logo.png'"
                                class="tool-tip-coupon"
                              >
                                <template #description>
                                  <div class="text-bold-red">
                                    {{ pro.promotionName }}
                                  </div>
                                  <div>
                                    <div class='text-bold-red'>{{ $t('my_coupon_page.coupon_policy') }}</div>
                                    <div>{{ $t('my_coupon_page.1_Program_period') }}</div>
                                    <div>
                                      <ul class='inside'>
                                        <li>{{ pro.start + ' - ' + pro.end }}</li>
                                      </ul>
                                    </div>
                                    <div>{{ $t('my_coupon_page.2_application_for') }}</div>
                                    <div>
                                      <ul class='inside'>
                                        <li>{{ $t('my_coupon_page.individuals_who_are_citizens_living_and_working_in_vietnam_from_the_age_of_18_or_older_and_are_users_of_the_go2joy') }}</li>
                                      </ul>
                                    </div>
                                    <div>{{ $t('my_coupon_page.3_do_not_apply_for') }}</div>
                                    <div>
                                      <ul class='inside'>
                                        <li>{{ $t('my_coupon_page.groups_organizations_and_companies') }}</li>
                                        <li>{{ $t('my_coupon_page.go2Joy_employees_partner_companies_companies_that_advertise_for_go2joy_in_this_program') }}</li>
                                        <li>{{ $t('my_coupon_page.employees_of_hotel_partners_are_listed_in_the_go2joy_app') }}</li>
                                      </ul>
                                    </div>
                                    <div>{{ $t('my_coupon_page.4_terms_and_conditions_of_Coupon_application') }}</div>
                                    <div>
                                      <ul class='inside'>
                                        <li>{{ `${$t('my_coupon_page.just_apply')}: ${pro.start} - ${pro.end}` }}</li>
                                        <li>{{ $t('my_coupon_page.user_will_get_coupon_discount_of_80_max_80_000_vnd_when_sign_up') }}</li>
                                        <li>{{ $t('my_coupon_page.applicable_at_hotels_in_the_list') }}</li>
                                        <li>{{ $t('my_coupon_page.application_for_hourly_overnight_daily_booking') }}</li>
                                        <li>{{ $t('my_coupon_page.time_of_check_in_from_monday_to_sunday') }}</li>
                                        <li>{{ $t('my_coupon_page.coupons_are_valid_for_31_days_from_the_date_of_receipt_and_will_automatically_be_sent_to_your_account_upon_successful_registration_you_can_check_the_coupon_in_the_my_coupon_section') }}</li>
                                        <li>{{ $t('my_coupon_page.coupon_can_apply_with_a_special_offer') }}</li>
                                        <li>{{ $t('my_coupon_page.1_coupon_only_apply_1_time_per_hotel') }}</li>
                                        <li>{{ $t('my_coupon_page.coupons_cannot_be_exchanged_for_cash_and_are_not_transferable_in_any_way') }}</li>
                                        <li>{{ $t('my_coupon_page.each_device_can_only_receive_1_registration_coupon') }}</li>
                                        <li>{{ $t('my_coupon_page.go2joy_reserves_the_right_to_refuse_to_pay_the_promotion_fee_if_fraud_is_detected_or_violates_the_terms_and_conditions_of_this_promotion') }}</li>
                                      </ul>
                                    </div>
                                  </div>

                                </template>
                              </TheGo2JoyToolTip> -->
                            </div>
                            <p
                              class="coupon-price"
                              v-html="getDiscountType(pro)"
                            />
                            <p class="coupon-label">
                              {{ $t("payment.promotion.valid") }}
                            </p>
                            <p class="coupon-date">
                              {{ dayjs(pro.end).format("DD/MM/YYYY") }}
                            </p>
                            <button
                              :disabled="pro.canUseStatus == 3"
                              :class="`btn-payment coupon-button ${pro.status == 1 && pro.loading != 1 ? 'active' : pro.loading == 1 ? 'load' : ''}`"
                              @click="onUseCoupon(pro, idx)"
                            >
                              <span v-if="pro.status == 1 && pro.loading == 0">
                                {{ $t("payment.promotion.cancel") }}
                              </span>
                              <span v-if="pro.status == 0 && pro.loading == 0">
                                {{ $t("payment.promotion.use_now") }}
                              </span>
                              <i
                                v-if="pro.loading == 1"
                                class="promotion-loading fas fa-spinner fa-spin"
                              />
                            </button>
                          </div>
                        </template>
                      </div>
                    </div>
                    <div
                      v-else
                      class="no-data-content"
                    >
                      <div class="img-container-block">
                        <img :src="`${IMAGE_URL}/icon/no-data/coupon.png`">
                      </div>
                      <p class="name-promo">
                        {{ $t("my_coupon_page.you_have_no_coupon_yet") }}
                      </p>
                      <p class="content-promo">
                        {{ $t("my_coupon_page.note_empty") }}
                      </p>
                    </div>
                  </div>
                  <div
                    v-else
                    class="no-data-content"
                  >
                    <div class="img-container-block">
                      <img :src="`${IMAGE_URL}/icon/no-data/coupon.png`">
                    </div>
                    <p class="content-promo">
                      {{ $t("my_coupon_page.no_coupon_available") }}
                    </p>
                  </div>
                </div>
                <!-- end coupon -->
                <div
                  v-show="promotionType == 2"
                  :class="`stamp-promotion promotion-item ${
                    mode == 1 ? 'no-fl' : ''
                  }`"
                >
                  <div v-if="mode != 2">
                    <VueContentLoading
                      v-if="loadingStamp"
                      :width="300"
                      :height="70"
                    >
                      <rect
                        x="0"
                        y="5"
                        rx="4"
                        ry="4"
                        width="80%"
                        height="10"
                      />
                      <rect
                        x="0"
                        y="25"
                        rx="4"
                        ry="4"
                        width="60%"
                        height="6"
                      />
                      <rect
                        x="0"
                        y="40"
                        rx="4"
                        ry="4"
                        width="40%"
                        height="6"
                      />
                    </VueContentLoading>
                    <div v-else-if="!isEmpty(stampData)">
                      <p class="stamp-title">
                        <span class="stamp-name">
                          {{ stampData.hotelName }}
                        </span>
                        <TheGo2JoyToolTip :icon="'icon/exclamation-logo.png'">
                          <template #description>
                            <div class="text-bold-red">
                              {{ $t("my_stamp_page.stamp_policy") }}
                            </div>
                            <div class="text-normal">
                              {{
                                $t(
                                  "my_stamp_page.in_case_the_hotel_stops_stamp_program_users_will_be_notified_30_days_in_advance"
                                )
                              }}
                            </div>
                            <div>
                              <ul class="inside">
                                <li>
                                  {{
                                    $t(
                                      "my_stamp_page.for_users_having_no_stamp_yet"
                                    )
                                  }}
                                  <ul class="inside-child">
                                    <li>
                                      {{
                                        $t(
                                          "my_stamp_page.new_stamp_will_not_be_issued"
                                        )
                                      }}
                                    </li>
                                  </ul>
                                </li>
                                <li>
                                  {{
                                    $t(
                                      "my_stamp_page.for_users_having_at_least_1_stamp"
                                    )
                                  }}
                                  <ul class="inside-child">
                                    <li>
                                      {{
                                        $t(
                                          "my_stamp_page.30_days_to_collect_enought_stamps_and_redeem_after_30_days_all_stamps_will_no_longer_be_valid"
                                        )
                                      }}
                                    </li>
                                  </ul>
                                </li>
                              </ul>
                            </div>
                          </template>
                        </TheGo2JoyToolTip>
                      </p>
                      <div class="room-type">
                        <div :class="`room-type-label hour ${
                            stampData.redeemHourly == true ? 'active' : ''
                          }`">
                          <p>{{ $t("payment.room_type.hour") }}</p>
                        </div>
                        <div :class="`room-type-label overnight ${
                            stampData.redeemOvernight == true ? 'active' : ''
                          }`">
                          <p>{{ $t("payment.room_type.overnight") }}</p>
                        </div>
                        <div :class="`room-type-label daily ${
                            stampData.redeemDaily == true ? 'active' : ''
                          }`">
                          <p>{{ $t("payment.room_type.daily") }}</p>
                        </div>
                      </div>
                      <div class="stamp-price">
                        <div class="benefi-amount">
                          {{ getStampType(stampData) }}
                        </div>
                        <div class="no-of-stamp">
                          <span>{{ numStampActive }}</span>/{{ stampData.numToRedeem }}
                        </div>
                      </div>
                      <TheGo2JoySlider
                        :min-value="0"
                        :max-value="stampData.numToRedeem"
                        :percent-value="numStampActive"
                        :disable="true"
                      />
                      <div class="text-right">
                        <button
                          :disabled="
                            stampData.numToRedeem != numStampActive &&
                              redeemStamp == 0
                          "
                          :class="`btn-payment stamp-button ${
                            redeemStamp == 1 ? 'active' : ''
                          }`"
                          @click="onStampReedem()"
                        >
                          {{ $t("payment.promotion.redeem") }}
                        </button>
                      </div>
                    </div>
                    <div
                      v-else
                      class="no-data-content"
                    >
                      <div class="img-container-block">
                        <img :src="`${IMAGE_URL}/icon/no-data/stamp.png`">
                      </div>
                      <p class="name-promo">
                        {{ $t("my_stamp_page.you_have_no_stamp_yet") }}
                      </p>
                      <p class="content-promo">
                        {{ $t("my_stamp_page.note_empty") }}
                      </p>
                    </div>
                  </div>
                  <div
                    v-else
                    class="no-data-content"
                  >
                    <div class="img-container-block">
                      <img :src="`${IMAGE_URL}/icon/no-data/stamp.png`">
                    </div>
                    <p class="content-promo">
                      {{ $t("my_stamp_page.no_stamp_available") }}
                    </p>
                  </div>
                </div>
                <!-- end stamp -->
                <div
                  v-show="promotionType == 3"
                  class="promotion-item point-promotion"
                >
                  <div v-if="mode != 2">
                    <VueContentLoading
                      v-if="loadingPoint"
                      :width="300"
                      :height="70"
                    >
                      <rect
                        x="0"
                        y="5"
                        rx="4"
                        ry="4"
                        width="80%"
                        height="10"
                      />
                      <rect
                        x="0"
                        y="25"
                        rx="4"
                        ry="4"
                        width="60%"
                        height="6"
                      />
                      <rect
                        x="0"
                        y="40"
                        rx="4"
                        ry="4"
                        width="40%"
                        height="6"
                      />
                    </VueContentLoading>
                    <template v-else-if="!isEmpty(pointPayment)">
                      <div class="point-item">
                        <p class="point-name">
                          {{ $t("payment.my_point") }}
                          <TheGo2JoyToolTip
                            :icon="'icon/exclamation-logo.png'"
                            class="tool-tip-point-payment"
                          >
                            <template #description>
                              <div class="text-bold-red">
                                {{ $t("my_point_page.point_policy") }}
                              </div>
                              <div class="text-bold">
                                {{
                                  $t("my_point_page.1_how_to_accumulate_points")
                                }}
                              </div>
                              <div>
                                <ul class="inside">
                                  <li>
                                    {{
                                      $t(
                                        "my_point_page.pay_at_go2Joy_1_000_d_30_pts_equivalent_to_3_of_the_payment_value"
                                      )
                                    }}
                                  </li>
                                  <li>
                                    {{
                                      $t(
                                        "my_point_page.pay_at_hotel_1_000_d_10_pts_equivalent_to_1_of_the_payment_value"
                                      )
                                    }}
                                  </li>
                                  <li>
                                    {{
                                      $t(
                                        "my_point_page.amount_1_1_000_d_rounded_to_0"
                                      )
                                    }}
                                  </li>
                                  <li>
                                    {{
                                      $t(
                                        "my_point_page.payment_amount_after_deducting_cash_discounts_such_as_coupons_flashsales_stamp_redemption_point_redemption_and_direct_discount_etc"
                                      )
                                    }}
                                  </li>
                                  <li>
                                    {{
                                      $t(
                                        "my_point_page.accumulated_points_are_valid_for_12_months_to_redeem"
                                      )
                                    }}
                                  </li>
                                </ul>
                              </div>
                              <div class="text-bold">
                                {{
                                  $t("my_point_page.2_how_can_i_redeem_points")
                                }}
                              </div>
                              <div>
                                <ul class="inside">
                                  <li>
                                    {{
                                      $t(
                                        "my_point_page.redeem_points_for_room_10_000_pts_10_000_d"
                                      )
                                    }}
                                  </li>
                                  <li>
                                    {{
                                      $t(
                                        "my_point_page.redeem_points_for_other_products_services_of_hotels_and_affiliated_partners_according_to_separated_regulations"
                                      )
                                    }}
                                  </li>
                                  <li>
                                    {{
                                      $t(
                                        "my_point_page.minimum_accumulated_points_for_redemption_50_000_pts"
                                      )
                                    }}
                                  </li>
                                </ul>
                              </div>
                            </template>
                          </TheGo2JoyToolTip>
                        </p>
                        <p
                          v-if="pointPayment"
                          class="point-price"
                        >
                          {{ getNumberWithCommas(pointPayment.totalPoint) }} P
                        </p>
                      </div>
                      <div class="point-item">
                        <p class="point-note">
                          1P = 1VND
                        </p>
                        <p
                          v-if="pointPayment && pointPayment.totalPoint > 50000"
                          class="point-use"
                        >
                          {{ $t("payment.use") }}
                        </p>
                        <div>
                          <input
                            v-model="$v.pointUsed.$model"
                            class="style-input"
                            type="text"
                            :disabled="pointPayment && pointPayment.totalPoint < 50000"
                          >
                        </div>
                        P
                        </p>
                      </div>
                      <div
                        v-if="$v.pointUsed.$error "
                        class="point-item point-error"
                      >
                        <p v-if="!$v.pointUsed.numeric ">
                          {{ $t('payment.error_point.input_number') }}
                        </p>
                        <p v-else-if="!$v.pointUsed.minValue ">
                          {{ $t('payment.error_point.minimum') }} 50.000 P
                        </p>
                        <p v-else-if="!$v.pointUsed.maxValue ">
                          {{ $t('payment.error_point.maximum') }} {{ maxPointUser }} P
                        </p>
                      </div>
                      <div class="point-item">
                        <p>
                          {{ $t("payment.minimum_points_to_redeem") }} 50.000P
                        </p>
                        <p class="font-semibold">
                          <button
                            v-if="pointPayment && pointPayment.totalPoint > 50000"
                            class="point-all"
                            @click="handleUseAllPoint(pointUsed)"
                          >
                            <b>{{ $t("payment.use_all") }}</b>
                          </button>
                        </p>
                      </div>
                      <div
                        v-if="pointPayment && pointPayment.totalPoint > 50000"
                        class="text-right"
                      >
                        <button
                          :disabled="$v.pointUsed.$error || pointUsed==0"
                          class="point-button btn-payment"
                          :class="{ active: isShowInputPoint, disable : $v.pointUsed.$error||pointUsed==0 }"
                          @click="handleShowInputPoint()"
                        >
                          {{ $t("payment.redeem") }}
                        </button>
                      </div>
                    </template>
                    <div
                      v-else
                      class="no-data-content"
                    >
                      <div class="img-container-block">
                        <img :src="`${IMAGE_URL}/icon/no-data/point.png`">
                      </div>
                      <p class="name-promo">
                        {{ $t("my_point_page.you_have_no_point_yet") }}
                      </p>
                      <p class="content-promo">
                        {{ $t("my_point_page.note_empty") }}
                      </p>
                    </div>
                  </div>
                  <div
                    v-else
                    class="no-data-content"
                  >
                    <div class="img-container-block">
                      <img :src="`${IMAGE_URL}/icon/no-data/point.png`">
                    </div>
                    <p class="content-promo">
                      {{ $t("my_point_page.no_point_available") }}
                    </p>
                  </div>
                </div>
                <!-- end point -->
              </div>
              <!-- end log in mode -->
              <div
                v-else
                class="__content-promotion guest-mode flex"
              >
                <div class="left-content">
                  <p class="title">
                    {{ $t("payment.promotion.noteInstall") }}
                  </p>
                  <p class="sub-title">
                    {{ $t("payment.promotion.subNote") }}
                  </p>
                  <div class="download-button">
                    <a
                      class="download-item"
                      :class="{
                        'enable-hover': !IS_MOBILE,
                      }"
                      href="https://play.google.com/store/apps/details?id=com.appromobile.hotel&hl=en&gl=US"
                      target="_blank"
                    >
                      <img
                        :src="IMAGE_URL + '/android-download-btn.png'"
                        alt="Go2Joy android application"
                        width="100%"
                        height="100%"
                        class="footer-block__download-app-img"
                      >
                    </a>
                    <a
                      class="download-item"
                      :class="{
                        'enable-hover': !IS_MOBILE,
                      }"
                      href="https://apps.apple.com/app/id1185445287?mt=8"
                      target="_blank"
                    >
                      <img
                        :src="IMAGE_URL + '/apple-download-btn.png'"
                        alt="Go2Joy apple application"
                        width="100%"
                        height="100%"
                        class="footer-block__download-app-img"
                      >
                    </a>
                  </div>
                </div>
                <div class="right-content">
                  <img
                    class="img-content"
                    :src="IMAGE_URL + `/${imgPromotion}`"
                    alt=""
                  >
                </div>
              </div>
              <!-- end guest mode -->
            </div>
            <!-- end promotion -->
            <div
              v-if="!isEmpty(dataBooking)"
              class="payment-info"
            >
              <div class="payment-item">
                <div class="payment-label">
                  {{ $t("payment.payment_info.hotel_fee") }}
                </div>
                <div class="payment-price">
                  {{ formatPriceVND(dataBooking.hotelFee) }}
                </div>
              </div>
              <div class="payment-item">
                <div class="payment-label">
                  {{ $t("payment.payment_info.ex_ser_fee") }}
                </div>
                <div class="payment-price">
                  {{ formatPriceVND(dataBooking.specialProductFee) }}
                </div>
              </div>
              <div class="payment-item">
                <div class="payment-label">
                  {{ $t("payment.payment_info.high_demand") }}
                </div>
                <div class="payment-price">
                  {{ formatPriceVND(dataBooking.highDemand) }}
                </div>
              </div>
              <div class="payment-item">
                <div class="payment-label">
                  {{ $t("payment.payment_info.discount") }}
                </div>
                <div class="payment-price">
                  {{ formatPriceVND(dataBooking.totalDiscount) }}
                </div>
              </div>
              <!-- <div class="payment-item">
                <div class="payment-label">
                  {{ $t('payment.payment_info.coupon') }}
                </div>
                <div class="payment-price">
                  {{ formatPriceVND(dataBooking.totalDiscount) }}
                </div>
              </div> -->
              <div class="payment-item">
                <div class="payment-label">
                  {{ $t("payment.payment_info.stamp") }}
                </div>
                <div class="payment-price">
                  {{ formatPriceVND(dataBooking.stamp) }}
                </div>
              </div>
              <div class="payment-item">
                <div class="payment-label">
                  {{ $t("payment.payment_info.point") }}
                </div>
                <div class="payment-price">
                  {{ formatPriceVND(dataBooking.point) }}
                </div>
              </div>
              <hr>
              <div class="payment-item">
                <div class="payment-total-label">
                  {{ $t("payment.payment_info.total") }}
                </div>
                <div class="payment-total-price">
                  {{ formatPriceVND(dataBooking.totalPrice) }}
                </div>
                <!-- <span class="payment-price">đ</span> -->
              </div>
              <button
                class="g2j-button-book-now"
                @click="clickBookNow()"
              >
                {{ $t("payment.book_now") }}
              </button>
            </div>
            <!-- end payment info -->
          </div>
          <!-- end payment block content -->
        </div>
      </div>
    </div>
    <!-- end payment section -->

    <modal-change-room
      ref="changeRoom"
      :custom-class="'modal-change-room'"
      @onChangeRoom="onChangeRoom"
    />
    <!-- end change room modal -->

    <modal-select-product
      v-if="!isEmpty(productListModal)"
      ref="select-product"
      :products.sync="productListModal"
      @countItem="countItemProduct"
    />
    <!-- end select product modal -->

    <modal-phone
      ref="modal-phone"
      @next="handleToNext"
    /><!-- end phone modal -->

    <modal-error
      ref="modal-error"
      :message="messageError"
    /><!-- end error modal -->

    <modal-coupon-rules
      ref="modal-coupon-rules"
      :custom-class="'modal-coupon-rules'"
    /><!-- end coupon rules modal -->

    <modal-pick-overnight
      ref="modal-pick-overnight"
      @pickOverNight="pickOverNight"
    /><!-- end pick overnight modal -->

    <modal-verify-code
      ref="modal-verify-code"
      :country-code="countryCode"
      :phone-number="mobile"
      :error-waiting-verifycode="errorWaitingVerifycode"
      :error-get-verify-code="errorGetVerifyCode"
      @getVerifyCode="getVerifyCodeGuest"
      @applyVerifyCode="checkVerifyCode"
    />
  </div>
</template>

<script>
  import TheGo2JoyToolTip from "~jsPartialPath/global/component/go2joy-tooltip/TheGo2JoyToolTip.vue";
  import TheGo2JoySlider from "~jsPartialPath/global/component/go2joy-slider/TheGo2JoySlider.vue";
  import ModalChangeRoom from "./component/ModalChangeRoom.vue";
  import PopoverDatePicker from "./component/PopoverDatePicker.vue";
  import ModalSelectProduct from "./component/ModalSelectProduct.vue";
  import ModalPhone from "./component/ModalPhone.vue";
  import ModalError from "./component/ModalError.vue";
  import ModalCouponRules from "./component/ModalCouponRules.vue";
  import ModalPickOvernight from "./component/ModalPickOvernight.vue";
  import ModalVerifyCode from "~jsPartialPath/global/component/modal-vetify-code/ModalVerifyCode.vue";

  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import {
    mapGetters,
    mapState,
    mapActions,
    _,
    numeric,
    minValue,
    maxValue,
  } from "~jsPath/lib/lib-manager";

  import { MODULE_NAME as HOTEL_INFO_MODULE_NAME } from "~jsPath/base/vuex/modules/hotel-info-module";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsPath/base/vuex/modules/page-info-module";
  import { MODULE_NAME as PAYMENT_INFO_MODULE_NAME } from "~jsPath/base/vuex/modules/payment-info-module";
  import {
    IMAGE_URL,
    IS_MOBILE,
    ASSETS_SERVICE_URL,
    getToken,
    HAS_MOITAI,
  } from "~jsDefinePath/general";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import { G2JDablenaTracking } from "~jsHelperPath/util/HandleTracking";
  import { DABLE_TRACKING } from "~jsDefinePath/tracking-define";
  import { getPromotionDetailPath } from "~jsHelperPath/util/HandleUrl";
  import {
    getNumberWithCommas,
    formatPriceVND,
  } from "~jsPath/helper/util/formatNumber";

  Vue.use(vuelidate.default);

  export default {
    name: "PaymentPage",

    components: {
      TheGo2JoyToolTip,
      TheGo2JoySlider,
      PopoverDatePicker,
      ModalChangeRoom,
      ModalSelectProduct,
      ModalPhone,
      ModalError,
      ModalCouponRules,
      ModalPickOvernight,
      VueContentLoading: window.VueContentLoading.VueContentLoading,
      ModalVerifyCode,
      "g2j-swiper-component": () =>
        import(
          "~jsPartialPath/global/component/g2j-swiper-base/Go2JoySwiper.vue"
        ),
    },

    data() {
      return {
        DABLE_TRACKING,
        IMAGE_URL,
        IS_MOBILE,
        ASSETS_SERVICE_URL,
        hotelSn: this.$route.query.hotelSn,
        roomSn: this.$route.query.roomSn,
        hotelData: {},
        promotionList: [],
        stampData: {},
        bookingType: 1,
        promotionType: 1,
        roomTypeList: [],
        roomData: null,
        productList: null,
        productListModal: null,
        productSelect: [],
        idProduct: null,
        startDate: new Date(),
        endDate: new Date(),
        startTimePick: "",
        endTimePick: "",
        mode: Number(this.$route.query.mode),
        objCheckIn: {},
        objCheckOut: {},
        dataBooking: null,
        messageError: "",
        pointUsed: 0,
        isShowSwiper: false, // wait until the loop end, then init swiper
        couponSn: null,
        percenValue: 0,
        // maxValue: 10,
        redeemStamp: 0,
        numStampActive: 0,
        pointPayment: 0,
        loadingCoupon: true,
        loadingStamp: true,
        loadingPoint: true,
        isSelectExtra: false,
        mobile: null,
        countryCode: null,
        errorWaitingVerifycode: [],
        objParams: null,
        errorGetVerifyCode: [],
        isShowInputPoint: false,
        isFocusPoint: false,
        numCouponUse: null,
      };
    },
    validations() {
      return {
        pointUsed: {
          numeric,
          minValue: minValue(50000),
          maxValue: maxValue(this.maxPointUser),
        },
      };
    },
    computed: {
      ...mapGetters(HOTEL_INFO_MODULE_NAME, {
        hotelInfo: "hotelInfo",
        roomActive: "roomActive",
      }),
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),
      ...mapGetters(PAGE_INFO_MODULE_NAME, {
        hasUserInfo: "hasUserInfo",
      }),

      maxPointUser() {
        return this.pointPayment?.totalPoint || 100000;
      },

      // ...mapGetters(PROFILE_INFO_MODULE_NAME, {
      //   pointUser: 'pointUser',
      // }),

      roomName: {
        get: function () {
          return this.roomData ? this.roomData.name : "";
        },
        set: function (data) {
          this.roomData.name = data;
        },
      },

      imgPromotion: {
        // eslint-disable-next-line vue/return-in-computed-property
        get: function () {
          switch (this.promotionType) {
            case 1:
              return "Promotion.png";
            case 2:
              return "Stamp.png";
            case 3:
              return "points.png";
          }
        },
        set: function (data) {
          this.promotionType = data;
        },
      },

      checkOverNight() {
        // if timeCheckIn > startOverNight => hidden button Hour
        let now = new Date();
        let hour = now.getHours();
        let minutes = now.getMinutes();
        let startOverNight = this.hotelData.startOvernight;
        hour = minutes >= 30 ? hour + 1 : hour;
        if (
          hour >= startOverNight ||
          hour + this.roomData.additionalHours >= startOverNight
        ) {
          return true;
        }
        return false;
      },

      isHasProductSelected() {
        let result = [];
        Object.values(this.productSelect).map(
          (el) => (result = [...result, ...el.data])
        );
        let check = result.some((el) => el.num > 0);
        //check has num > 0 ? show
        return check;
      },

      productsResult() {
        // data to call api
        return this.productSelect.reduce((arr, el) => {
          return (arr = [...arr, ...el.data]);
        }, []);
      },

      avatarRoom() {
        return this.roomData?.imagePath || "";
      },
    },

    watch: {
      $route(val) {},
      roomActive: {
        handler(val) {
          // TODO: update url, query parameters when change room
          if (!val) return;
          let params = { ...this.$route.params };
          params.roomName = GetSlug(val.name);
          params.hotelName = GetSlug(this.hotelInfo.name);
          let query = { ...this.$route.query };
          query.hotelSn = this.hotelInfo.sn;
          query.roomSn = val.sn;
          query.mode = val.mode;
          this.$router.replace({ query, params }).catch((err) => {}); //TODO: catch to avoid dup navigator
        },
        immediate: true,
      },

      isShowSwiper: function (val) {
        if (val == true) {
          const SwipesPromotion = new Swiper(".swiper-coupon-promotion", {
            slidesPerView: 3,
            spaceBetween: 20,
            breakpoints: {
              // for mobile
              375: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              // for pad
              758: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              // for desktop
              1280: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
            },
          });
        }
      }, // wait until loop done then init swiper
    },

    async created() {
      await this.getDataHotelDetail();
      EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
    },

    mounted() {
      const SwipesExtra = new Swiper(".swiper-extra-service", {
        loop: true,
        slidesPerView: 3,
      });
      setInterval(() => {
        this.timer -= 1;
      }, 1000);
    },

    methods: {
      dayjs: window.dayjs,
      isEmpty: _.isEmpty,
      G2JDablenaTracking,
      formatPriceVND,
      getNumberWithCommas,
      promotionDetailPath(promotion) {
        if (!promotion) return;
        return getPromotionDetailPath(
          {
            promotionName: GetSlug(promotion.promotionName),
          },
          {
            sn: promotion.promotionSn,
          }
        );
      }, // promotionDetailPath
      initDataRoom() {
        //TODO: find room with id and mode when reload page
        if (_.isEmpty(this.roomActive)) {
          let { mode, roomSn } = { ...this.$route.query };
          if (mode == 2 && HAS_MOITAI) {
            this.roomData = _.cloneDeep(
              this.hotelInfo.flashSaleList.find((x) => x.sn == roomSn)
            );
          }
          if (mode == 1) {
            this.roomData = _.cloneDeep(
              this.hotelInfo.roomTypeList.find((x) => x.sn == roomSn)
            );
          }
          if (this.isEmpty(this.roomData) && HAS_MOITAI) {
            this.roomData = !this.isEmpty(this.hotelInfo.flashSaleList)
              ? this.hotelInfo.flashSaleList[0]
              : this.hotelInfo.roomTypeList[0];
          }
          if (this.isEmpty(this.roomData) && !HAS_MOITAI) {
            this.roomData = this.hotelInfo.roomTypeList[0];
          }
          this.setRoomActive(this.roomData);
          return;
        }
        this.roomData = this.roomActive;
      },
      async getDataHotelDetail() {
        let id = this.$route.query.hotelSn;
        let query = {
          limit: this.pageSize || 10, //this.pageSize ???
          page: "1",
          hotelSn: id,
        };
        await this.getListProduct();
        if (_.isEmpty(this.hotelInfo) || this.hotelInfo.sn != id) {
          await this.getHotelInfo({ sn: id, query });
        }
        this.hotelData = this.hotelInfo;
        this.roomTypeList = HAS_MOITAI
          ? [...this.hotelData.flashSaleList, ...this.hotelData.roomTypeList]
          : [...this.hotelData.roomTypeList]; // merge room fl-sale and normal room
        this.initDataRoom();
        await this.onChangeTypeBooking(this.checkPriceTypeRoom(this.roomData)); // run when get data
      }, //getDataHotelDetail

      async getPromotion() {
        this.loadingCoupon = true;
        let date = new Date();
        let tmpStart;
        let tmpEnd;
        let { startOvernight, startHourlyTime } = this.hotelInfo;
        let { firstHours, additionalHours } = this.roomData;
        if (this.checkIsToday(this.startDate)) {
          if (Number(date.getHours()) < Number(startHourlyTime)) {
            // if minute < 30 => start = startHourlyTime:30
            if (Number(date.getMinutes()) <= 30) {
              tmpStart = `${startHourlyTime}:30`;
              tmpEnd = `${startHourlyTime + firstHours}:30`;
            }
            // if minutes > 30 => start = startHourlyTime+1 : 00
            else {
              tmpStart = `${Number(startHourlyTime) + 1}:00`;
              tmpEnd = `${Number(startHourlyTime) + 1 + firstHours}:00`;
            }
          }
          //Case 2: Time now > startHourlyTime
          else {
            if (Number(date.getMinutes()) <= 30) {
              tmpStart = `${date.getHours()}:30`;
              tmpEnd = `${Number(date.getHours()) + firstHours}:30`;
            } else {
              tmpStart = `${Number(date.getHours()) + 1}:00`;
              tmpEnd = `${Number(date.getHours()) + 1 + firstHours}:00`;
            }
          }
          //determind when hourly disabled
          // houryly disabled <=> time now >= max-time checkin hourly
          if (date.getHours() >= startOvernight - firstHours) {
            tmpStart = `${startOvernight - firstHours}:00`;
            tmpEnd = `${startOvernight}:00`;
          }
        }

        try {
          let query = {
            type: this.bookingType,
            checkInDatePlan: dayjs(this.startDate).format("YYYY-MM-DD"),
            startTime:
              Number(this.startTimePick.split(":")[0]) < 10
                ? `0${this.startTimePick}`
                : this.startTimePick,
            endTime:
              Number(this.endTimePick.split(":")[0]) < 10
                ? `0${this.endTimePick}`
                : this.endTimePick,
            roomTypeSn: this.roomSn,
            mode: this.mode,
            limit: 20,
            justHas: 0,
          };

          if (this.bookingType == 3) {
            query.endDate = dayjs(this.endDate).format("YYYY-MM-DD");
          }
          query.startTime =
            !query.startTime || query.startTime == 0 ? tmpStart : query.startTime;
          query.endTime =
            !query.endTime || query.endTime == 0 ? tmpEnd : query.endTime;
          const data = await apiCaller({
            metaUrl: AJAX_URL.payment.promotionList,
            type: "GET",
            data: query,
            headers: {
              Authorization: getToken(),
            },
          });
          if (data && data.data.length > 0) {
            data.data.forEach((val, index) => {
              val.status = index == this.numCouponUse ? 1 : 0;
              val.loading = 0;
            });
            this.promotionList = _.cloneDeep(data.data);
          }
        } catch (error) {
          console.log(error);
        }
        this.loadingCoupon = false;
      },

      async getStamp() {
        this.loadingStamp = true;
        try {
          const self = this;
          const data = await apiCaller({
            metaUrl: AJAX_URL.payment.stamp,
            method: "GET",
            contentType: "application/json; charset=utf-8",
            data: {
              hotelSn: self.hotelSn,
              withStampList: true,
            },
            headers: {
              Authorization: getToken(),
            },
          });
          if (data && data.data) {
            this.stampData = data.data;
            this.numStampActive = this.stampData.stampIssuedFormList
              ? this.stampData.stampIssuedFormList.filter(
                  (val) => val.status == 1
                ).length
              : 0;
          }
        } catch (error) {
          console.log(error);
        }
        this.loadingStamp = false;
      },

      async getPointPayment() {
        this.loadingPoint = true;
        try {
          let res = await apiCaller({
            metaUrl: AJAX_URL.myPoint.total,
            method: "GET",
            data: {
              limit: 10,
              page: 1,
            },
            headers: {
              Authorization: getToken(),
            },
            dataType: "json",
          });
          this.pointPayment = res.data;
          this.loadingPoint = false;
        } catch (error) {
          console.log("error :>> ", error);
        }
      },

      async getListProduct() {
        EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        let query = {
          hotelSn: this.hotelSn,
        };
        try {
          let res = await apiCaller({
            metaUrl: AJAX_URL.payment.productList,
            data: query,
            dataType: "json",
            method: "GET",
            contentType: "application/json; charset=utf-8",
          });
          this.productList = res?.data;
          // this.productList = [...res?.data, ...res?.data];

          EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
        } catch (error) {
          setTimeout(() => {
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          }, 3000);
          console.log("error :>> ", error);
        }
      },

      async getDetailProduct(idProduct) {
        this.idProduct = idProduct;
        let check = false;
        if (!this.isEmpty(this.productSelect)) {
          this.productSelect.forEach((el) => {
            if (el.idProduct == idProduct) {
              this.productListModal = el.data;
              check = true;
            }
          });
          if (check) return;
        }
        EventBus.emit("IS_SHOW_ROUTER_LOADING", true);

        let query = {
          hotelSn: this.hotelSn,
          productTypeSn: idProduct,
        };

        try {
          let res = await apiCaller({
            metaUrl: AJAX_URL.payment.detailProduct,
            dataType: "json",
            method: "GET",
            data: query,
            contentType: "application/json; charset=utf-8",
          });
          this.productListModal = [];
          this.productListModal = res?.data;
          if (!this.isEmpty(this.productListModal)) {
            this.productListModal.forEach((element) => (element.num = 0));
          }
          EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
        } catch (error) {
          setTimeout(() => {
            EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          }, 3000);
          console.log("error :>> ", error);
        }
      },

      onShow() {
        this.$refs.overlay.classList.add("is-show");
      },

      clickBookNow() {
        if (!this.hasUserInfo) {
          this.$refs["modal-phone"].openModal();
        } else {
          this.checkBeforeCreateNewBooking();
        }
      },

      handleToNext(phone, code) {
        // this.$refs['modal-phone'].closeModal()
        this.mobile = phone;
        this.countryCode = code;
        this.checkBeforeCreateNewBooking(phone, code);
        this.G2JDablenaTracking(
          this.DABLE_TRACKING.TRACKING_REGISTER_PHONE_NUMBER
        );
        // Call api beforeCalculator to check obj in here
        // if true =>redirect payment detail
        // if fail => open popup sho message error from api
      },

      goPaymentDetail() {
        this.$router.push({
          name: "payment-detail",
          params: { testParams: "123" },
        });
      },

      onChangeTypeBooking(type) {
        this.bookingType = type;
        if (type == 1) {
          this.startDate = this.endDate = new Date();
          // if check out time will pass start overnight
          if (this.checkOverNight) {
            this.startDate = new Date(
              new Date().setDate(new Date().getDate() + 1)
            );
            this.endDate = new Date(new Date().setDate(new Date().getDate() + 1));
          }
        } else {
          this.startDate = new Date();
          this.endDate = new Date(new Date().setDate(new Date().getDate() + 1));
        }
        this.onChangePromotion(1);
        this.setLimitTimeBooking(this.bookingType);
      },

      setLimitTimeBooking(type) {
        switch (type) {
          case 1:
            this.setTypeHourly();
            break;
          case 2:
            if (this.checkCurrentIsPassMidnight() == false) {
              this.setTypeOvernight(1);
            }
            break;
          case 3:
            this.setTypeDaily();
            break;
        }
        this.calculateBoooking();
      },

      setTypeHourly() {
        let { startOvernight, startHourlyTime } = this.hotelInfo;
        let { firstHours, additionalHours } = this.roomData;
        var objTime = {
          start: "00:00",
          end: "24:00",
          step: "00:30",
          minTime: this.changeFormatTime(startHourlyTime, true) || "07:00",
          maxTime: this.changeFormatTime(startOvernight) || "22:00",
        };
        let objCheckIn = { ...objTime };
        objCheckIn.start = `${startHourlyTime}:00`;
        objCheckIn.maxTime = `${startOvernight - firstHours}:30`;
        objCheckIn.end = `${startOvernight - firstHours}:00`;

        let objCheckOut = { ...objTime };
        objCheckOut.start = `${startHourlyTime + firstHours}:00`;
        objCheckOut.maxTime = `${startOvernight}:30`;
        objCheckOut.end = `${startOvernight}:00`;
        objCheckOut.step = `0${additionalHours}:00`;

        // check time checkin large than time start overnight
        let date = new Date();
        if (this.checkIsToday(this.startDate)) {
          if (Number(date.getHours()) < Number(startHourlyTime)) {
            // if minute < 30 => start = startHourlyTime:30
            if (Number(date.getMinutes()) <= 30) {
              objCheckIn.start = `${startHourlyTime}:30`;
              objCheckOut.start = `${startHourlyTime + firstHours}:30`;
            }
            // if minutes > 30 => start = startHourlyTime+1 : 00
            else {
              objCheckIn.start = `${Number(startHourlyTime) + 1}:00`;
              objCheckOut.start = `${
                Number(startHourlyTime) + 1 + firstHours
              }:00`;
            }
          }
          //Case 2: Time now > startHourlyTime
          else {
            if (Number(date.getMinutes()) <= 30) {
              objCheckIn.start = `${date.getHours()}:30`;
              objCheckOut.start = `${Number(date.getHours()) + firstHours}:30`;
            } else {
              objCheckIn.start = `${Number(date.getHours()) + 1}:00`;
              objCheckOut.start = `${
                Number(date.getHours()) + 1 + firstHours
              }:00`;
            }
          }
          //determind when hourly disabled
          // houryly disabled <=> time now >= max-time checkin hourly
          if (date.getHours() >= startOvernight - firstHours) {
            objCheckIn.start = `${startOvernight - firstHours}:00`;
            objCheckOut.start = `${startOvernight}:00`;
          }
        }

        this.startTimePick = objCheckIn.start;
        this.endTimePick = objCheckOut.start;
        this.objCheckIn = objCheckIn;
        this.objCheckOut = objCheckOut;
      },

      setTypeOvernight(cond) {
        let { startOvernight, endOvernight, startHourlyTime } = this.hotelInfo;
        var objTime = {
          start: "00:00",
          end: "24:00",
          step: "00:30",
          minTime: "07:00",
          maxTime: "22:00",
        };
        //set strat time
        let objCheckIn = { ...objTime };
        if (cond == 1) {
          objCheckIn.start = this.startTimePick = `${startOvernight}:00`;
        } else {
          objCheckIn.startTimeHour = startHourlyTime;
          objCheckIn.start = this.startTimePick = `${new Date().getHours()}:00`;
        }
        //set end time
        let objCheckOut = { ...objTime };
        objCheckOut.start = this.endTimePick = `${endOvernight}:00`;

        this.objCheckIn = objCheckIn;
        this.objCheckOut = objCheckOut;
      },

      setTypeDaily() {
        let { checkin, checkout } = this.hotelInfo;
        var objTime = {
          start: "00:00",
          end: "24:00",
          step: "00:30",
          minTime: "07:00",
          maxTime: "22:00",
        };
        //set strat time
        let objCheckIn = { ...objTime };
        objCheckIn.start = this.startTimePick = `${checkin}:00`;

        //set end time
        let objCheckOut = { ...objTime };
        objCheckOut.start = this.endTimePick = `${checkout}:00`;

        this.objCheckIn = objCheckIn;
        this.objCheckOut = objCheckOut;
      },

      changeFormatTime(time, min) {
        // Min => use for calculate minTime
        if (min) {
          if (time < 10) {
            let value = time - 1;
            if (value > 0 && value < 10) {
              return `0${value}:30`;
            } else {
              return `${value}:30`;
            }
          }
        } else {
          if (time < 10) {
            return `0${time}:00`;
          } else {
            return `${time}:00`;
          }
        }
      },

      async onChangePromotion(type) {
        this.imgPromotion = type;
        if (this.hasUserInfo) {
          switch (type) {
            case 1:
              this.isShowSwiper = false;
              await this.getPromotion();
              break;
            case 2:
              await this.getStamp();
              break;
            case 3:
              // !this.pointUser && await this.getPointUser()
              // this.loadingPoint = false
              await this.getPointPayment();
              break;
          }
        }
      },

      async onStampReedem() {
        this.redeemStamp = this.redeemStamp == 1 ? 0 : 1;
        await this.calculateBoooking();
      },

      async handleShowInputPoint() {
        this.isShowInputPoint = !this.isShowInputPoint;
        if (!this.isShowInputPoint) {
          this.pointUsed = 0;
          this.$v.pointUsed.$reset();
          await this.calculateBoooking();
          return;
        }
        await this.calculateBoooking();
      },

      handleUseAllPoint(data) {
        // if (data != 0) {
        //   this.pointUsed = 0;
        //   this.calculateBoooking();
        //   return;
        // }
        this.isShowInputPoint = true;
        this.pointUsed = this.pointPayment ? this.pointPayment.totalPoint : 0;
        this.calculateBoooking();
      },

      async onUseCoupon(val, idx) {
        val.loading = 1; // show loading icon
        this.numCouponUse = idx;
        if (val.status == 0) {
          this.promotionList.forEach((val) => {
            if (val.status == 1) {
              val.status = 0;
            }
          });
        } // remove all coupon has choosen before
        let checkCoupon = await this.applyPromotion(val, idx); //check is coupon apply \
        if (checkCoupon.status == true) {
          val.status = val.status == 1 ? 0 : 1;
          this.couponSn = val.status == 1 ? checkCoupon.sn : null;
          await this.calculateBoooking();
          val.loading = 0;
        }
      },

      onChangeStartDate(val) {
        if (this.bookingType == 1) {
          this.startDate = this.endDate = val;
          this.setLimitTimeBooking(this.bookingType);
        } else {
          this.startDate = val;
          this.endDate = new Date(
            new Date().setDate(new Date(val).getDate() + 1)
          );
          this.calculateBoooking();
        }
      },

      onChangeEndDate(val) {
        if (this.bookingType == 1) {
          this.startDate = this.endDate = val;
        } else if (this.bookingType == 2) {
          this.endDate = val;
          if (val.getDate() == 1) {
            // if first date of month, start date will get last date of month before
            this.startDate = new Date(val.getFullYear(), val.getMonth(), 0);
          } else {
            this.startDate = new Date(
              new Date().setDate(new Date(val).getDate() - 1)
            );
          }
        } else if (this.bookingType == 3) {
          this.endDate = val;
        }
        this.calculateBoooking();
      },

      setStartTime(time) {
        if (time) {
          let { firstHours, additionalHours } = this.roomData;
          let { startOvernight } = this.hotelInfo;
          let hour = Number(time.split(":")[0]);
          let min = time.split(":")[1];
          let checkOutTime = "";

          checkOutTime = `${hour + firstHours}:${min}`;
          let objCheckOut = {
            start: checkOutTime,
            end: `${startOvernight}:00`,
            step: `0${additionalHours}:00`,
            minTime: time || "07:00",
            maxTime: `${startOvernight + 1}:00` || "22:00",
          };
          if (min == "30") {
            objCheckOut.maxTime = `${startOvernight}:00`;
            objCheckOut.end = `${startOvernight}:00`;
          }
          this.objCheckOut = objCheckOut;
          this.startTimePick = time;
          this.endTimePick = checkOutTime;
          this.calculateBoooking();
        }
      }, // set time check in and re-render check out time range

      setEndTime(time) {
        this.endTimePick = time;
        this.calculateBoooking();
      },

      openModalChangeRoom() {
        this.$refs.changeRoom.openModal(this.roomTypeList);
      },

      onOpenRule(val) {
        this.$refs["modal-coupon-rules"].openModal(val);
      },

      async openModalExtraService(data) {
        this.G2JDablenaTracking(DABLE_TRACKING.TRACKING_VIEW_SPECICAL_PRODUCTS);
        await this.getDetailProduct(data.sn);
        this.$refs["select-product"].openModal();
      },

      onChangeRoom(data) {
        let dataRoom = _.cloneDeep(data);
        this.roomName = dataRoom.name;
        this.roomData = dataRoom; //TODO: set data to handle this page
        this.mode = Number(dataRoom.mode);
        this.objCheckIn = this.objCheckOut = {};
        this.onChangeTypeBooking(this.checkPriceTypeRoom(data));
        this.setRoomActive(dataRoom); //TODO: set room is acting => watch it
        this.onChangePromotion(1);
      },

      countItemProduct(data) {
        let val = Object.values(data);
        let check = this.productSelect.find(
          (el) => el.idProduct == this.idProduct
        );
        if (check) {
          this.productSelect.forEach((el) => {
            if (el.idProduct == this.idProduct) {
              el.data = val;
            }
          });
          this.calculateBoooking();
          this.$refs["select-product"].closeModal();
          return;
        }
        let obj = {
          data: val,
          idProduct: this.idProduct,
        };
        this.productSelect.push(obj);
        this.$refs["select-product"].closeModal();
        this.calculateBoooking();
      },

      changeItemSelect(data, index, type) {
        data.num =
          type == "plus"
            ? data.num + 1
            : type == "minus" && data.num != 0
            ? data.num - 1
            : 0;
        // this.calculateBoooking()
        this.calculateBoookingSelectProduct(this);
      },

      pickOverNight(option) {
        if (option == 0) {
          // over night pass date
          this.startDate = new Date(new Date().setDate(new Date().getDate() - 1));
          this.endDate = new Date();
        }
        this.setTypeOvernight(option);
      }, // show modal pick overnight if current time pass midnight

      checkPriceTypeRoom(data) {
        if (data.displayRule.firstHoursOrigin > 0 && !this.checkOverNight) {
          return 1;
        } else if (data.displayRule.overnightOrigin > 0) {
          return 2;
        } else if (data.displayRule.oneDayOrigin > 0) {
          return 3;
        }
      },

      checkCurrentIsPassMidnight() {
        let { startOvernight, endOvernight, startHourlyTime } = this.hotelInfo;
        //
        let date = new Date();
        let hour = date.getHours();
        if (0 >= Number(hour) || Number(hour) <= Number(startHourlyTime)) {
          hour = hour < 10 ? `0${hour}` : hour;
          let obj = {
            current: `${hour}:00`,
            startOvernight: `${startOvernight}:00`,
            endOvernight: `${endOvernight}:00`,
          };
          this.$refs["modal-pick-overnight"].openModal(obj);
          this.$refs["modal-pick-overnight"].closeModal();
          return true;
        } else {
          return false;
        }
      },

      calculateBoookingSelectProduct: _.debounce((vm) => {
        //TODO: Delay 500ms to call api
        vm.calculateBoooking();
      }, 500),

      async calculateBoooking() {
        let startTime =
          Number(this.startTimePick.split(":")[0]) < 10
            ? `0${this.startTimePick}`
            : this.startTimePick;
        let endTime =
          Number(this.endTimePick.split(":")[0]) < 10
            ? `0${this.endTimePick}`
            : this.endTimePick;
        this.objParams = {
          hotelSn: Number(this.hotelInfo.sn),
          roomTypeSn: Number(this.roomData.sn),
          mode: this.mode,
          checkInDatePlan: dayjs(this.startDate).format("YYYY-MM-DD"),
          startTime: startTime,
          endTime: endTime,
          couponIssuedSn: this.couponSn,
          clientip: "",
          type: Number(this.bookingType),
          redeemValue: Number(this.redeemStamp),
          paymentMethod: 3,
          mileagePoint: this.pointUsed,
          locale: "vn",
          productList: this.productsResult,
        };
        if (this.bookingType == 3) {
          this.objParams.endDate = dayjs(this.endDate).format("YYYY-MM-DD");
        }
        let dataBooking = await this.caculate(this.objParams);
        this.dataBooking = dataBooking.data;
      }, // calculate booking

      async checkBeforeCreateNewBooking(phoneNumber, countryCode) {
        EventBus.emit("IS_SHOW_ROUTER_LOADING", true);
        let objResult = {
          // ...this.dataBooking,
          ...this.objParams,
          countryCode: countryCode,
          mobile: phoneNumber,
        };
        try {
          const res = await apiCaller({
            metaUrl: AJAX_URL.payment.checkBeforeCreateBooking,
            dataType: "json",
            data: JSON.stringify(objResult),
            method: "POST",
            headers: {
              Authorization: getToken(),
              Localization: localStorage["g2j-translate-language"],
            },
            contentType: "application/json; charset=utf-8",
          });
          EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          if (res && res.code == 1) {
            if (!this.hasUserInfo) {
              this.$refs["modal-verify-code"].openModal();
              return;
            }
            this.handleDataToDetail();
          }
        } catch (error) {
          // handle modal show eror
          EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
          // this.messageError = error.responseJSON.message
          this.messageError = error.response.data?.error || "Error";
          this.$refs["modal-error"].openModal();
        }
      },

      handleDataToDetail() {
        let objResult = {
          ...this.objParams,
          ...this.dataBooking,
          countryCode: this.countryCode,
          mobile: this.mobile,
          paymentMethod: this.hotelInfo.paymentMethod,
          hotelName: this.hotelInfo.name,
          roomName: this.roomActive.name,
        };
        this.setPayment(objResult); // it test => need test
        let objPayment = JSON.stringify(objResult);
        sessionStorage.setItem("payment-info", objPayment);
        let params = {
          hotelName: GetSlug(this.hotelInfo.name),
          roomName: GetSlug(this.roomActive.name),
          stay:
            this.dataBooking.type == 1
              ? "hour"
              : this.dataBooking.type == 2
              ? "overnight"
              : "daily",
        };
        this.$router.push({ name: "payment-detail", params });
        setTimeout(() => {
          localStorage.removeItem("arrMobileVerify");
        }, 3000);
      },

      async getVerifyCodeGuest() {
        this.errorGetVerifyCode = [];
        let obj = {
          mobile: this.mobile,
          countryCode: this.countryCode,
        };
        try {
          let res = await apiCaller({
            metaUrl: AJAX_URL.payment.sendVerifyCodeForGuest,
            dataType: "json",
            data: JSON.stringify(obj),
            method: "POST",
            headers: {
              // Authorization: getToken(),
              Localization: localStorage["g2j-translate-language"],
            },
            contentType: "application/json; charset=utf-8",
          });
        } catch (error) {
          console.log("error :>> ", error);
          let checkError = error.responseJSON.error;
          this.errorGetVerifyCode = checkError[0];
          // this.errorWaitingVerifycode = checkError[0];
        }
      },
      async checkVerifyCode(code) {
        this.errorWaitingVerifycode = [];
        let obj = {
          mobile: this.mobile,
          countryCode: this.countryCode,
          verifyCode: code,
        };
        try {
          let res = await apiCaller({
            metaUrl: AJAX_URL.payment.verifyCodeForGuest,
            dataType: "json",
            data: JSON.stringify(obj),
            method: "POST",
            headers: {
              // Authorization: getToken(),
              Localization: localStorage["g2j-translate-language"],
            },
            contentType: "application/json; charset=utf-8",
          });
          if (res.data == true) {
            this.handleDataToDetail();
            return;
          }
          let checkError = res.error.filter((item) => item.code == 20);
          this.errorWaitingVerifycode = checkError[0];
        } catch (error) {
          console.log("error :>> ", error);
        }
      },

      async applyPromotion(val, idx) {
        let dataReturn = {};
        if (val.sn == null) {
          // if coupon has applied return value
          let queryParams = {
            promotionSn: Number(val.promotionSn),
          };
          await apiCaller({
            metaUrl: AJAX_URL.applyNowCoupon.applyCoupon,
            data: queryParams,
            method: "PUT",
            headers: {
              Authorization: getToken(),
            },
            dataType: "json",
          }).then(function (rep) {
            if (rep.data) {
              dataReturn = {
                status: true,
                sn: rep.data,
              };
            } else {
              // if in proccess apply coupon has error remove that coupon and show mess
              this.promotionList.splice(idx, 1);
              alert(this.$t("payment.promotion.apply_error"));
            }
          });
        } else {
          dataReturn = {
            status: true,
            sn: val.sn,
          };
        }
        return dataReturn;
      },

      getDiscountType(data) {
        let discount;
        switch (data.discountType) {
          case 1:
            discount =
              data && data.discount ? this.formatPriceVND(data.discount) : "N/A";
            break;
          case 2:
            discount = data && data.discount ? data.discount + "%" : "N/A";
            break;
          case 3:
            discount = `<img src="${IMAGE_URL}/giftbox.svg"  alt="giftbox"class="icon-tick h-20px w-20px">`;
            break;
          case 4:
            discount = `<img src="${IMAGE_URL}/clock.svg"  alt="clock"class="icon-tick h-20px w-20px">`;
            break;
          case 5:
            discount =
              data && data.discount
                ? '<span class="bold">ĐG</span> ' + data && data.discount
                : "N/A";
            break;
          default:
            return "N/A";
        }
        return discount;
      }, // return value follow type

      getStampType(data) {
        let discount;
        switch (data.redeemType) {
          case 1:
            discount =
              data && data.redeemValue
                ? this.formatPriceVND(data.redeemValue)
                : "N/A";
            break;
          case 2:
            discount = data && data.redeemValue ? data.redeemValue + "%" : "N/A";
            break;
          default:
            return "N/A";
        }
        return discount;
      }, // return value follow type

      checkIsToday(someDate) {
        const today = new Date();
        return (
          someDate.getDate() == today.getDate() &&
          someDate.getMonth() == today.getMonth() &&
          someDate.getFullYear() == today.getFullYear()
        );
      }, // check date input is today or not

      ...mapActions(HOTEL_INFO_MODULE_NAME, {
        getHotelInfo: "getHotelInfo",
        setRoomActive: "setRoomActive",
        caculate: "caculateBooking",
      }),
      ...mapActions(PAYMENT_INFO_MODULE_NAME, {
        setPayment: "setPayment",
      }),
      // ...mapActions(PROFILE_INFO_MODULE_NAME, {
      //   getPointUser: "getPointUser"
      // }),
    },
  };
</script>
<style src="./payment-page-style.css"></style>
