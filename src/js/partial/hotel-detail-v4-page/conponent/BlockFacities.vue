<template>
  <div class="block-facilities">
    <div class="item-facilities" v-for="(item, index) in dataFacilities" :key="index">
      <div class="item-facilities__title">
        <p class="is-title" v-show="language === 'en'">{{ item.nameEn }}</p>
        <p class="is-title" v-show="language !== 'en'">{{ item.name }}</p>
      </div>
      <div class="item-facilities__image">
        <g2j-image
          :url-img="`${ASSETS_SERVICE_URL}/${item.imagePath}`"
        ></g2j-image>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapState
} from "~jsLibPath/lib-manager";
import { ASSETS_SERVICE_URL } from "~jsDefinePath/general";
import {
    MODULE_NAME as PAGE_INFO_MODULE_NAME,
  } from '~jsBasePath/vuex/modules/page-info-module';
export default {
  components: {
    "g2j-image": () =>
      import("~jsPartialPath/global/component/g2j-img/Go2JoyImages.vue"),
  },
  props: {
    facilityFormList: {
      type: [Array,Object],
      default: '[]'
    },
  },
  data() {
    return {
      ASSETS_SERVICE_URL
    }
  },
  computed: {
    dataFacilities(){
      return this.facilityFormList
    },
    ...mapState(PAGE_INFO_MODULE_NAME, {
      language: 'language',
    })
  },
}
</script>

<style>

</style>
