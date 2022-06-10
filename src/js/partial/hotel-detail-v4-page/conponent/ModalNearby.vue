<template>
  <modal
    ref="select-modal-nearby"
    :visible.sync="visible"
    class="select-modal-nearby"
    :disableClickBackground="ui.disableClickBackground"
    :isClose="isHidenButton"
  >
    <template slot="header">
      <div class="select-modal-nearby__header">
        <i @click="closeModal" class="fas fa-chevron-left"></i>
      </div>
    </template>
    <template slot="body">
      <div class="select-modal-nearby__body">
        <div class="select-modal-nearby__body--heading">
            <h2>{{ $t("hotel_detail.detail_v4.nearby_places") }}</h2>
        </div>

        <div>
          <div class="select-modal-nearby__body--content" v-if="language == 'en'">
            <div class="block" v-for="(item, index) in dataNearByEn" :key="index">
                <div class="is-nearby-name">
                    {{ item.name }}
                </div>
                <div class="is-nearby-distance">
                    {{ roudingMathNumber(item.distance) }}{{ item.distanceUnit }}
                </div>
            </div>
        </div>
        <div class="select-modal-nearby__body--content" v-else>
            <div class="block" v-for="(item, index) in dataNearByVi" :key="index">
                <div class="is-nearby-name">
                    {{ item.name }}
                </div>
                <div class="is-nearby-distance">
                    {{ roudingMathNumber(item.distance) }}{{ item.distanceUnit }}
                </div>
            </div>
        </div>
        </div>

      </div>
    </template>
    <template slot="footer">
      <div class="select-modal-nearby__footer btn"></div>
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
import { apiCaller } from '~jsHelperPath/service/ApiHandler';
import { AJAX_URL } from '~jsDefinePath/ajax-url';
import { getToken } from "~jsDefinePath/general";
import {
  _,
  mapState,
} from "~jsLibPath/lib-manager";
Vue.use(vuelidate.default);

export default {
    props: {
        dataNearBy: [Array, Object],
        hotelSn: [String,Number]
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
                isListReview: true
            },
            isHidenButton: false,
            errorList: [],
            dataNearByEn: null,
            dataNearByVi: null
        }
    },

    computed: {
        ...mapState(PAGE_INFO_MODULE_NAME, {
            language: 'language',
        }),
        hotelSnAgoda(){
          return this.hotelSn
        }
    },

    created() {
      if(window.outerWidth > 640) {
        this.isHidenButton = true
      } else {
        this.isHidenButton = false
      }
      this.getListNearBy()
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
        async getListNearBy () {
            const self = this;
            apiCaller({
                metaUrl: AJAX_URL.hotel_v4.getNearBy,
                data: {
                    hotelSn     : self.hotelSnAgoda,
                    limit       : 10,
                    page        : 1
                },
                method: 'GET',
                headers: {
                    Authorization: getToken(),
                },
                dataType: 'json',
                error(err) {
                    self.errorList = err.response?.data.error || []
                },
                success(objResponse) {
                if(
                    _.isEmpty(objResponse) ||
                    objResponse.error
                ) {
                    self.errorList = objResponse.error;
                    return;
                }

                let data = objResponse?.data ?? [];
                self.dataNearByEn = data.en;
                self.dataNearByVi = data.vi;
                },
                complete() {
                    self.ui.isListReview = true;
                },
            });
        },
        roudingMathNumber(number) {
          return (Math.round(number * 10) / 10).toFixed(1);
        },
    },
    watch: {
        visible (val) {
            this.$emit('update:visible', val)
        }
    }
}
</script>
