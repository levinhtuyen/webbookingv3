<template>
  <modal
    ref="notice-modal"
    :visible.sync="visible"
    class="notice-modal"
  >
    <!-- :disableClickBackground="ui.disableClickBackground" -->
    <template slot="header">
      <h2 class="heading">{{ $t('my_coupon_page.coupon_policy') }}</h2>
    </template>
    <template slot="body">
      <div class="notice-modal__body">
        <div class="notice-modal__body--sort">
          <p class="bold">{{ $t('my_coupon_page.1_Program_period') }}</p>
          <div>
            <ul class='inside'>
              <li>{{ getDDMMYYYY(data.start) }} - {{ getDDMMYYYY(data.end) }}</li>
            </ul>
          </div>
          <div class="bold">{{ $t('my_coupon_page.2_application_for') }}</div>
          <div>
            <ul class='inside'>
              <li>{{ $t('my_coupon_page.individuals_who_are_citizens_living_and_working_in_vietnam_from_the_age_of_18_or_older_and_are_users_of_the_go2joy') }}</li>
            </ul>
          </div>
          <div class="bold">{{ $t('my_coupon_page.3_do_not_apply_for') }}</div>
          <div>
            <ul class='inside'>
              <li>{{ $t('my_coupon_page.groups_organizations_and_companies') }}</li>
              <li>{{ $t('my_coupon_page.go2Joy_employees_partner_companies_companies_that_advertise_for_go2joy_in_this_program') }}</li>
              <li>{{ $t('my_coupon_page.employees_of_hotel_partners_are_listed_in_the_go2joy_app') }}</li>
            </ul>
          </div>
          <div class="bold">{{ $t('my_coupon_page.4_terms_and_conditions_of_Coupon_application') }}</div>
          <div>
            <ul class='inside'>
              <li>{{ $t('my_coupon_page.application_for_users_registration_from') }} {{ getDDMMYYYY(data.start) }} - {{ getDDMMYYYY(data.end) }}</li>
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
      </div>
    </template>
    <template slot="footer"></template>
  </modal>
</template>

<script>
  import { _ } from "~jsLibPath/lib-manager";
  import { getDDMMYYYY } from "~jsPath/helper/util/formatDate";

  export default {
    props: {
      data: {
        type: [Object, Array],
        default: {},
      },
    },
    components: {
      modal: () =>
        import("~jsPartialPath/global/component/modal/ModalComponent.vue"),
    },
    data() {
      return {
        visible: false,
        ui: {
          disableClickBackground: true,
        },
      };
    },

    methods: {
      isEmpty: _.isEmpty,
      getDDMMYYYY,
      applyFilter() {},
      showModal() {
        this.visible = true;
      }, // showModal

      closeModal() {
        this.visible = false;
        this.$emit("resetModal");
      }, // closeModal
    },
    watch: {
      visible(val) {
        this.$emit("update:visible", val);
      },
    },
  };
</script>
