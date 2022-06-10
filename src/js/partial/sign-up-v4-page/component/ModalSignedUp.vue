<template>
  <modal
    ref="modal-signed-up"
    :visible.sync="visible"
    :disableClickBackground="ui.disableClickBackground"
    class="modal-signed-up"
    @beforeClose="beforeClose"
  >
    <template slot="header">
      <div class="modal-signed-up-header">
        <img :src="IMAGE_URL + '/svg/signed-up.svg'" width="100%" height="100%">
        <p class="text-center">{{ $t('sign_up.signed_up_successfully') }}</p>
      </div>
    </template>
    <template slot="body">
      <div class="modal-signed-up__body">
        <p class="sub-title">{{ $t('sign_up.signed_up_successfully_sub_title') }}</p>

        <div v-if="filter && filter.useCondition && filter.discount" class="modal-signed-up-wrapper">
          <div class="block1">
            <div class="block1-1">
              <h2> {{ filter.discountType === 2 ? `${filter.discount}%` : formatPriceVND(filter.discount) }}</h2>
              <div class="tag">
                <span v-if="filter.useCondition && filter.useCondition.hourly">{{ $t('sign_up.hourly') }}</span>
                <span v-if="filter.useCondition && filter.useCondition.overnight">{{ $t('sign_up.overnight') }}</span>
                <span v-if="filter.useCondition && filter.useCondition.daily">{{ $t('sign_up.daily') }}</span>
              </div>
              <div class="sub-coupon">
                <p>{{ formatDate(filter.start) }} ~ {{ formatDate(filter.end) }}</p>
                <p>{{ filter.couponMemo }}</p>
              </div>
            </div>
          </div>

          <div class="block2">
            <router-link :to="{name: 'coupon-page'}">
              {{ $t('sign_up.use') }}
            </router-link>
          </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <div class="modal-signed-up__footer btn">
        <button
          class="modal-btn-apply"
          @click="onDirect"
        >
        {{ $t('sign_up.let_start') }}
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
  _,
} from "~jsLibPath/lib-manager";
import { formatPriceVND } from "~jsPath/helper/util/formatNumber";
import {
  ROUTER_NAME,
} from '~jsBasePath/vue-router/router-define';
import {
  G2JRouter,
  getG2JRoute,
} from '~jsHelperPath/util/HandleRouterGlobal';

export default {
    props: {
        filter: [Object, Array],
    },
    components: {
        'modal': () => import('~jsPartialPath/global/component/modal/ModalComponent.vue')
    },
    data () {
        return {
          IMAGE_URL,
          visible: false,
          ui: {
            disableClickBackground: true
          }
      }
    },
    methods: {
        formatPriceVND,
        isEmpty: _.isEmpty,
        resendCode() {
          this.$emit('resendCode');
        },
        showModal () {
            this.visible = true
        },
        closeModal () {
            this.visible = false
        },
        beforeClose() {
          // let start => call api login & push đến trang hiện tại
          const g2jRoute = getG2JRoute();
          if(g2jRoute.params.redirect) {
            G2JRouter.replace(g2jRoute.params.redirect);
          } else {
            G2JRouter.replace({ name: ROUTER_NAME['home-page'] });
          }
        },
        onDirect() {
          // let start => call api login
          G2JRouter.replace({ name: ROUTER_NAME['home-page'] });
        },
        checkKeyUp($event){
          if($event.target){
            if (($event.which >= 48 && $event.which <= 57) || ($event.which >= 96 && $event.which <= 105)) {
              if( $event.target.tabIndex < 4){
                  setTimeout($event.target.nextElementSibling.focus(), 200);
              }
            }else if($event.which == 8){
              if($event.target.tabIndex > 1){
                  $event.target.previousElementSibling.focus()
              }
            }
          }
        }, //checkKeyUp

        formatDate (date) {
          let CDate = dayjs(date).format('DD/MM/YYYY')
          return CDate
        },// formatDate()
    },
    watch: {
      visible (val) {
          if(val == false) {
              this.$emit('saveInfoMobileOld', this.timerNumber);
          }
          this.$emit('update:visible', val)
      }
    }
}
</script>