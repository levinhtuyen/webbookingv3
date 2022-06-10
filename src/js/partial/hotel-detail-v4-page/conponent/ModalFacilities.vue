<template>
  <modal
    ref="facility-modal"
    :visible.sync="visible"
    class="facility-modal"
    :isClose="ui.isHidenButton"
  >
    <!-- :disableClickBackground="ui.disableClickBackground" -->
    <template slot="header">
      <div class="facility-modal__header">
        <i v-show="!ui.isHidenButton" @click="closeModal" class="fas fa-chevron-left"></i>
        <h2>{{ $t("hotel_detail.detail_v4.facilities") }}</h2>
      </div>
    </template>
    <template slot="body">
      <div class="facility-modal__body">
        <div class="facility-modal__body--heading">
            <div class="sub-title">
                {{ $t('hotel_detail.detail_v4.facilities_might_be_different_depending_on_rooms') }}
            </div>
        </div>

        <div class="facility-modal__body--content">
            <div class="block" v-for="(item, index) in facilities" :key="index">
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
      <div class="facility-modal__footer btn"></div>
    </template>
  </modal>
</template>

<script>
import Go2joyFlagSection from "~jsPartialPath/global/component/go2joy-flags/Go2joyFlagsSection.vue";
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
        facilityFormList: [Array, Object]
    },
    components: {
        'modal': () => import('~jsPartialPath/global/component/modal/ModalComponent.vue'),
        Go2joyFlagSection
    },
    data () {
        return {
            IMAGE_URL,
            ASSETS_SERVICE_URL,
            visible: false,
            ui: {
                disableClickBackground: true,
                isHidenButton: false
            },
        }
    },

    computed: {
        ...mapState(PAGE_INFO_MODULE_NAME, {
            language: 'language',
        }),
        facilities() {
            // console.log("listFacilities :", this.facilityFormList)
            return this.facilityFormList
        },
    },

    created() {
      if(window.outerWidth > 640) {
        this.ui.isHidenButton = true
      } else {
        this.ui.isHidenButton = false
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
