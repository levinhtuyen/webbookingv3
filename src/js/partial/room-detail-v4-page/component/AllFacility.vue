<template>
  <div class="all-facilities">
      <div class="all-facilities__heading">
        <i @click="onBackFaci" class="fas fa-chevron-left"></i>
        <h2 class="mt-mb-1em">{{ $t('room.facilities') }}</h2>
      </div>

      <p class="sub-heading">{{ $t('room.sub_facilities') }}</p>
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
</template>

<script>
import {
  IMAGE_URL,
  ASSETS_SERVICE_URL,
} from "~jsDefinePath/general";
import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/page-info-module";
import { _, mapState } from "~jsLibPath/lib-manager";

export default {
  props: {
    onBack: Boolean,
    listFacilities: [Array, Object]
  },
  data() {
    return {
      IMAGE_URL,
      ASSETS_SERVICE_URL
    }
  },
  computed: {
    facilities() {
      return this.listFacilities
    },
    ...mapState(PAGE_INFO_MODULE_NAME, {
      language: "language",
    }),
  },
  methods: {
    onBackFaci() {
      this.$emit('onBack');
    }
  },
}
</script>

<style>

</style>