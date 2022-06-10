<template>
  <modal
    ref="modal-signin-email"
    :visible.sync="visible"
    :disableClickBackground="ui.disableClickBackground"
    class="modal-signin-email"
    :isClose="false"
  >
    <template slot="header">
      <div class="modal-signin-email-header">
        {{ $t('sign_in.sigin_by_email') }}
      </div>
    </template>
    <template slot="body">
      <div class="modal-signin-email__body">
        <div class="w-100">
          {{ $t('sign_in.please_sigin_by_email') }}
        </div>
      </div>
    </template>
    <template slot="footer">
      <div class="modal-signin-email__footer btn">
        <button
          class="modal-btn-apply"
          @click="applyFilter()"
        >
        {{ $t('vertify_code.continue') }}
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
        applyFilter () {
            let value = false;
            this.$emit('update:filter', value);
            this.$emit('apply', value);
        },
        showModal () {
            this.visible = true
        },
        closeModal () {
            this.visible = false
        }
    },
    watch: {
        visible (val) {
          this.$emit('update:visible', val)
        }
    }
}
</script>