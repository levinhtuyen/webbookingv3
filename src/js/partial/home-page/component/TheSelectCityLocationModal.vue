<template>
  <G2jBasicModal
    v-if="isShowSelectCityModal"
    :custom-modal-class="'city-selection-modal'"
    :disable-user-close-modal="true"
    :disable-window-scroll="true"
    :is-zindex-top="true"
  >
    <template #head-title>
      {{ $t('home.select_your_favourite_location') }}
    </template> <!-- slot: #head-title -->

    <template #body-content>
      <v-select
        :class="'city-selection-modal__select-item'"
        :filter="fuseCitySearch"
        :options="arrCityList"
        :reduce="(cityItem) => cityItem.sn"
        :placeholder="$t('home.district_or_city')"
        @input="onSelectDefaultProvinceSn"
        label="name"
      >
        <template #no-options>
          {{ $t('home.no_result') }}
        </template>
      </v-select>

      <!-- <label for="city-selection-modal__check-box-item" class="city-selection-modal__check-box-field">
        <input
          v-model="disableShowCitySelectionModal"
          type="checkbox"
          id="city-selection-modal__check-box-item"
          class="city-selection-modal__check-box-item"
        >
        <span class="city-selection-modal__check-box-fake">
          <i
            v-if="disableShowCitySelectionModal"
            class="far fa-check"
          />
        </span>
        <span class="city-selection-modal__check-box-label">
          {{ $t('home.never_show_again') }}
        </span>
      </label> -->
    </template> <!-- slot: #body-content -->
  </G2jBasicModal>
</template>

<script>
import {
  _,
  mapState,
  mapGetters,
} from '~jsLibPath/lib-manager';
import { apiCaller } from '~jsHelperPath/service/ApiHandler';
import {
  VueSelect,
} from '~jsPath/lib/vue-select-lib';
import {
  Fuse,
} from '~jsLibPath/fuse-lib';
import {
  AJAX_URL
} from '~jsDefinePath/ajax-url';
import {
  LOCAL_STORAGE_KEY,
} from '~jsDefinePath/local-storage';
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME
} from '~jsBasePath/vuex/modules/page-info-module';
import {
  MODULE_NAME as HOME_PAGE_MODULE_NAME,
  COMMIT_KEY as HOME_PAGE_COMMIT_KEY,
} from '../page-module';
import G2jBasicModal from '~jsPartialPath/global/component/g2j-basic-modal/G2jBasicModal.vue';

export default {
  components: {
    G2jBasicModal,
  },

  data() {
    return {
      get defaultProvinceSn() {
        return localStorage[LOCAL_STORAGE_KEY.G2J_DEFAULT_PROVINCE_SN];
      },

      set defaultProvinceSn(val) {
        localStorage.setItem(LOCAL_STORAGE_KEY.G2J_DEFAULT_PROVINCE_SN, val);
      },

      isSelected: false,

      arrCityList: [],

      fuseCityInit: null,

      // disableShowCitySelectionModal: true,
    };
  },

  computed: {
    ...mapGetters(HOME_PAGE_MODULE_NAME, {
      hasCityList: 'hasCityList',
    }),

    ...mapState(PAGE_INFO_MODULE_NAME, {
        personalLocationInfo: 'personalLocationInfo',
      }),

    ...mapState(HOME_PAGE_MODULE_NAME, {
      cityList: 'cityList',
    }),

    isShowSelectCityModal() {
      return (
        !this.isSelected &&
        !_.isEmpty(this.cityList)
      );
    }, // isShowSelectCityModal
  },

  created() {
    const self = this;

    Promise.all([
      VueSelect.js,
      Fuse.js
    ]).then(function() {
      if(
        window.Fuse &&
        window.VueSelect
      ) {
        self.getAjaxFindAllProvinceCity();
        Vue.component('v-select', window.VueSelect.VueSelect)
      }
    });
  },

  methods: {
    getAjaxFindAllProvinceCity () {
      if (!this.hasCityList) {
        const self = this;

        apiCaller({
          metaUrl: AJAX_URL.location.city_list,
          type: 'GET',
          dataType: 'json',
          data: {
            latitude: self.personalLocationInfo.latitude,
            longitude: self.personalLocationInfo.longitude,
          },

          error (err) { },

          success (objResponse) {
            if (
              _.isEmpty(objResponse) ||
              objResponse.error ||
              _.isEmpty(objResponse.data)
            ) {
              return;
            }

            self.arrCityList = objResponse.data;

            self.fuseCityInit = new window.Fuse(
              self.arrCityList,
              {
                keys: ['name'],
              }
            );

            const tmpCityListFormatted = {};

            self.arrCityList.forEach(function(cityItemInfo) {
              tmpCityListFormatted[cityItemInfo.sn] = cityItemInfo;
            });

            self.$store.commit(HOME_PAGE_COMMIT_KEY.setCityList, tmpCityListFormatted);
          },
        });
      }
    }, // getAjaxFindAllProvinceCity()

    onSelectDefaultProvinceSn(defaultProvinceSn) {
      this.defaultProvinceSn = defaultProvinceSn;

      // if(this.disableShowCitySelectionModal) {
      //   localStorage.setItem(LOCAL_STORAGE_KEY.G2J_DISABLE_SHOW_CITY_SELECTION_MODAL, this.disableShowCitySelectionModal);
      // } else {
      //   localStorage.removeItem(LOCAL_STORAGE_KEY.G2J_DISABLE_SHOW_CITY_SELECTION_MODAL);
      // }

      this.$emit('select', defaultProvinceSn);

      this.isSelected = true;
    }, // onSelectDefaultProvinceSn()

    fuseCitySearch(options, search) {
      if(!this.fuseCityInit) {
        return {}; // NOTE - :filter props của vselect yêu cầu callback trả về object type
      }

      return search.length ? this.fuseCityInit.search(search).map((result) => result.item) : this.fuseCityInit.list;
    }, // fuseCitySearch()
  },
};
</script>
