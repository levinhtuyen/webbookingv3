<template>
  <modal
    ref="modal-wrong"
    :visible.sync="visible"
    class="modal-wrong"
    :isClose="false"
    :disableClickBackground="ui.disableClickBackground"
  >
    <template slot="header">
      <div class="modal-header">
        <div class="image">
            <img class="custom-img" :src="IMAGE_URL + '/logo/attention-logo.png'" width="20%" height="20%">
        </div>
      </div>
    </template>
    <template slot="body">
      <div class="modal-wrong__body">
        <div class="modal-wrong__body--sort">
            <h2 class="text-uppercase">
                {{ $t('my_booking_detail_page.something_went_wrong') }}
            </h2>
            <div class="modal-info-basic">
                <p>
                  {{ $t('my_booking_detail_page.sub_wrong') }}
                </p>
            </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <div class="modal-wrong__footer btn">
        <button
            class="modal-btn-apply btn-active"
            @click="closeModal"
        >
        {{ $t('my_booking_detail_page.back') }}
        </button>
      </div>
    </template>
  </modal>
</template>

<script>
import {
IMAGE_URL
} from '~jsDefinePath/general';

export default {
  props: {
      filter: [Object, Array],
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

  methods: {
    isEmpty: _.isEmpty,
    showModal () {
      this.visible = true
    }, // showModal

    closeModal () {
      this.visible = false
    } // closeModal
  },
  watch: {
    visible (val) {
      this.$emit('update:visible', val)
    }
  }
}
</script>
