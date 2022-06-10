<template>
  <modal
    ref="modal-changed-password"
    :visible.sync="visible"
    :disableClickBackground="ui.disableClickBackground"
    class="modal-changed-password"
  >
    <template slot="header">
      <div class="modal-changed-password-header">
          <i class="fas fa-check-circle"></i>
          {{ $t('forget_password.you_ve_changed_your_password_successfully') }}
      </div>
    </template>
    <template slot="body">
      <div class="modal-changed-password__body">
        <p v-show="language === 'en'">
            Go back to 
            <span class="text-orange">Sign In </span>
            page to continue
          </p>
          <p v-show="language === 'vi'">
            Trở lại Trang 
            <span class="text-orange">đăng nhập</span>
            để tiếp tục 
          </p>
      </div>
    </template>
    <template slot="footer">
      <div class="modal-changed-password__footer btn">
        <button
          class="modal-btn-apply"
          @click="onDirect"
        >
        {{ $t('forget_password.sign_in') }}
        </button>
      </div>
    </template>
  </modal>
</template>

<script>
import {
  _,
  mapState
} from "~jsLibPath/lib-manager";
import {
    MODULE_NAME as PAGE_INFO_MODULE_NAME,
  } from '~jsBasePath/vuex/modules/page-info-module';
import {
  ROUTER_NAME,
} from '~jsBasePath/vue-router/router-define';
import {
  G2JRouter,
} from '~jsHelperPath/util/HandleRouterGlobal';

export default {
    props: {
        filter: [Object, Array],
        errorList: [Object, Array],
    },
    components: {
        'modal': () => import('~jsPartialPath/global/component/modal/ModalComponent.vue')
    },
    data () {
        return {
            visible: false,
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
      onDirect() {
        G2JRouter.replace({ name: ROUTER_NAME['login-page'] });
      },
      showModal () {
          this.visible = true
      },
      closeModal () {
          this.visible = false
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