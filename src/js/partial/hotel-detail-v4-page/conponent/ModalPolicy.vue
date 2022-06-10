<template>
  <modal
    ref="select-modal-policy"
    :visible.sync="visible"
    class="select-modal-policy"
    :disableClickBackground="ui.disableClickBackground"
    :isClose="isHidenButton"
  >
    <template slot="header">
      <div :hidden="isHidenButton" class="select-modal-policy__header">
        <i @click="closeModal" class="fas fa-chevron-left"></i>
      </div>
    </template>
    <template slot="body">
      <div class="select-modal-policy__body">
        <div class="select-modal-policy__body--heading">
            <h2>{{ $t("hotel_detail.detail_v4.facilities") }}</h2>
            <div class="sub-title">
                {{ $t('hotel_detail.detail_v4.facilities_might_be_different_depending_on_rooms') }}
            </div>
        </div>

        <div class="select-modal-policy__body--content">
            <div class="block" v-for="(item, index) in nearBy" :key="index">
                <div>
                    {{ language == "vi" ? item.name : item.nameEn }}
                </div>
                <g2j-image
                    :url-img="`${ASSETS_SERVICE_URL}/${item.imagePath}`"
                    :alt-img="item.originalName || null"
                />
            </div>
        </div>

      </div>
    </template>
    <template slot="footer">
      <div class="select-modal-policy__footer btn"></div>
    </template>
  </modal>
</template>

<script>
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
} from '~jsBasePath/vuex/modules/page-info-module';
import {
  IMAGE_URL,
  ASSETS_SERVICE_URL,
} from "~jsDefinePath/general";

import {
  _,
  mapState,
} from "~jsLibPath/lib-manager";
Vue.use(vuelidate.default);

export default {
    props: {
    },
    components: {
        'modal': () => import('~jsPartialPath/global/component/modal/ModalComponent.vue')
    },
    data () {
        return {
            IMAGE_URL,
            ASSETS_SERVICE_URL,
            visible: false,
            ui: {
                disableClickBackground: true,
            },
            isHidenButton: false,
        }
    },

    computed: {
        ...mapState(PAGE_INFO_MODULE_NAME, {
            language: 'language',
        }),
    },

    created() {
      if(window.outerWidth > 640) {
        this.isHidenButton = true
      } else {
        this.isHidenButton = false
      }
    },

    methods: {
        isEmpty: _.isEmpty,
        showModal () {
            this.visible = true
        },
        closeModal () {
            this.visible = false
            this.$emit('resetModal')
        },
    },
    watch: {
        visible (val) {
            this.$emit('update:visible', val)
        }
    }
}
</script>
