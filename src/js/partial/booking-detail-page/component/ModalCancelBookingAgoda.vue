<template>
  <div>
      <modal
        ref="modal-cancel-booking-agoda"
        :visible.sync="visible"
        class="modal-cancel-booking-agoda"
        :isClose="false"
        :disableClickBackground="ui.disableClickBackground"
    >
        <template slot="header">
        <div class="modal-header">
            <h1>{{ $t('modal_cancel.cancel_booking') }}</h1>
        </div>
        </template>
        <template slot="body">
        <div class="modal-cancel-booking-agoda__body">
            <div class="modal-cancel-booking-agoda__body--sort">
                <div class="modal-info-basic">
                    <p v-if="!isFee">{{ $t('my_booking_detail_page.are_you_sure_you_want_to_cancel_this_booking') }}</p>
                    <p v-else>
                        <span class="text-g2j bold">
                            {{ $t('my_booking_detail_page.you_will_be_charged') }}
                            {{ data.cancelDescription && data.cancelDescription.cancelWithFeeAmount ? $formatlowestPrice(data.cancelDescription.cancelWithFeeAmount) : 0 }}đ
                            {{ $t('my_booking_detail_page.for_cancellation_fee_to_cancel_this_booking') }}
                        </span>
                        {{ $t('my_booking_detail_page.are_you_sure_you_want_to_cancel_this_booking') }}
                    </p>
                </div>
            </div>
        </div>
        </template>

        <template slot="footer">
            <div class="modal-cancel-booking-agoda__footer">
                <button
                class="modal-btn-yes"
                :disabled="ui.isSubmitting"
                @click="onCancelBooking()"
                >
                {{ $t('my_booking_detail_page.yes_cancel') }}
                </button>
                <button
                class="modal-btn-no"
                @click="closeModal()"
                >
                {{ $t('my_booking_detail_page.keep_a_reservation') }}
                </button>
            </div>
        </template>
    </modal>

    <modal-wrong
        ref="modal-wrong"
    />
  </div>
</template>

<script>
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import { getToken } from "~jsDefinePath/general";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import ModalWrong from "./ModalWrong.vue";

export default {
    props: {
        filter: [Object, Array],
        isFee: Boolean,
        data: [Object, Array]
    },
    components: {
        'modal': () => import('~jsPartialPath/global/component/modal/ModalComponent.vue'),
        ModalWrong
    },
    data () {
        return {
            visible: false,
            ui: {
                disableClickBackground: true,
                isSubmitting: false
            }
        }
    },
    methods: {
        showModal () {
            this.visible = true
        },
        closeModal () {
            this.visible = false
        },
        onCancelBooking () {
            // this.$emit('apply')
            const self = this;
            self.ui.isSubmitting = true
            apiCaller({
                metaUrl: AJAX_URL.myBooking.cancelBookingV4,
                data: {
                    userBookingSn: self.$route.params.id,
                    cancelStatus: self.data.cancelDescription && self.data.cancelDescription.cancelStatus ? self.data.cancelDescription.cancelStatus : ''
                },
                type: "GET",
                headers: {
                    Authorization: getToken(),
                },
                dataType: "json",
                error() {
                    self.closeModal();
                    setTimeout(() => {
                        self.$refs["modal-wrong"].showModal();
                    }, 500);
                },

                success(objResponse) {
                    if (
                    _.isEmpty(objResponse) ||
                    objResponse.error
                    ) {
                        self.closeModal();
                        setTimeout(() => {
                            self.$refs["modal-wrong"].showModal();
                        }, 500);
                        return;
                    }
                    // let data = objResponse?.data ?? [];
                    self.$router.go(0);
                },

                complete() {
                    self.ui.isSubmitting = false
                },
            });
        }
    },
    watch: {
        visible (val) {
            this.$emit('update:visible', val)
        }
    }
}
</script>
