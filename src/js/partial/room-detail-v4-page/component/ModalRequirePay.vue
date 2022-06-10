<template>
  <modal
    ref="require-pay-modal"
    :visible.sync="visible"
    class="require-pay-modal"
    :disableClickBackground="ui.disableClickBackground"
  >
    <template slot="header">
      <div class="modal-header">
        <div class="image">
            <img class="custom-img" :src="IMAGE_URL + '/svg/phone-popup.svg'" width="20%" height="20%">
        </div>
      </div>
    </template>
    <template slot="body">
      <div class="require-pay-modal__body">
        <div class="require-pay-modal__body--sort">
            <h2>{{ $t('room.title_require_pay') }}</h2>
            <div class="modal-info-basic">
                <p>{{ $t('room.sub_title_require_pay') }}</p>
            </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <div class="require-pay-modal__button btn">
        <button
            class="btn-active"
            @click="applyFilter"
        >
        {{ $t('room.ok') }}
        </button>

        <button
            @click="closeModal"
        >
        {{ $t('vertify_code.cancel') }}
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
import Go2joyFlagSection from "~jsPartialPath/global/component/go2joy-flags/Go2joyFlagsSection.vue";

export default {
    props: {
        filter: [Object, Array]
    },
    components: {
        'modal': () => import('~jsPartialPath/global/component/modal/ModalComponent.vue'),
        Go2joyFlagSection
    },
    data () {
        return {
            visible: false,
            IMAGE_URL,
            ui: {
                disableClickBackground: true,
            }
        }
    },

    methods: {
        isEmpty: _.isEmpty,
        applyFilter () {
            this.$emit('update:filter');
            this.$emit('apply');
        },
        showModal () {
            this.visible = true
        },
        closeModal () {
            this.visible = false
            this.$emit('resetModal')
        },
        keyCountryCode(value){
            this.form.countryCode = value;
        }
    },
    watch: {
        visible (val) {
            this.$emit('update:visible', val)
        }
    }
}
</script>
