<template>
  <modal
    ref="pay-attention-modal"
    :visible.sync="visible"
    class="pay-attention-modal"
    :isClose="false"
    :disableClickBackground="ui.disableClickBackground"
  >
    <template slot="header">
      <div class="modal-header">
        <div class="image">
            <img class="custom-img" :src="IMAGE_URL + '/svg/attention-popup.svg'" width="20%" height="20%">
        </div>
      </div>
    </template>
    <template slot="body">
      <div class="pay-attention-modal__body">
        <div class="pay-attention-modal__body--sort">
            <h2 class="text-uppercase">
                {{ $t('room.pay_attention') }}
            </h2>
            <div class="modal-info-basic">
                <p>{{ $t('room.please_pay_in_advance_to_keep_the_room') }}
                  <b v-if="isTypeInfo === 0">{{ $t('room.you_cannot_cancel_this_booking_if_you_book_as_guest') }}</b>

                  <b v-else-if="isTypeInfo === 1">{{ $t('room.you_will_be_charged_a_cancellation_fee_if_you_cancel_this_booking') }}</b>

                  <b v-else-if="isTypeInfo === 2">
                    <span v-show="language === 'en'">can cancel this booking for free until {{ dateTimeFree ? getHHmmDDMMYYYY(dateTimeFree) : '' }}, after that it may be charged.</span>
                    <span v-show="language !== 'en'">bạn chỉ có thể hủy phòng miễn phí cho đến {{ dateTimeFree ? getHHmmDDMMYYYY(dateTimeFree) : '' }}, hủy phòng sau thời gian này bạn có thể sẽ phải mất phí.</span>
                  </b>
                  {{ $t('room.are_you_sure_to_continue_booking') }}
                </p>
            </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <div class="pay-attention-modal__footer btn">
        <button
            class="modal-btn-apply btn-active"
            @click="applyFilter"
        >
        {{ $t('room.continue') }}
        </button>

        <button
            class="modal-btn-apply"
            @click="closeModal"
        >
        {{ $t('room.back') }}
        </button>
      </div>
    </template>
  </modal>
</template>

<script>
import {
IMAGE_URL
} from '~jsDefinePath/general';
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
} from '~jsBasePath/vuex/modules/page-info-module';
import { getHHmmDDMMYYYY } from "~jsPath/helper/util/formatDate";
import {
  _,
  mapState
} from "~jsLibPath/lib-manager";
Vue.use(vuelidate.default);

export default {
    props: {
        filter: [Object, Array],
        isTypeInfo: Number, // 0: isNotSignedIn, 1: isSignedIn, 2: isOverLap
        dateTimeFree: [String, Number, Date]
    },
    components: {
        'modal': () => import('~jsPartialPath/global/component/modal/ModalComponent.vue')
    },
    data () {
        return {
            visible: false,
            IMAGE_URL,
            ui: {
                disableClickBackground: true
            }
        }
    },

    computed: {
        ...mapState(PAGE_INFO_MODULE_NAME, {
            language: 'language',
        })
    },

    methods: {
        isEmpty: _.isEmpty,
        getHHmmDDMMYYYY,
        applyFilter () {
          let value = '';
          this.$emit('update:filter', value);
          this.$emit('apply', this.form);
        },
        showModal () {
            this.visible = true
        },
        closeModal () {
            this.visible = false
            this.$emit('resetModal')
        }
    },
    watch: {
        visible (val) {
            this.$emit('update:visible', val)
        }
    }
}
</script>
