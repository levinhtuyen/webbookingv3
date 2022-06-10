<template>
  <section
    v-if="hasCurProvinceInfo"
    class="location-selection-section"
  >
    <div class="container">
      <div class="location-selection-block">
        <div
          class="location-selection-field"
          @click="$emit('open', $options.name)"
        >
          <span class="icon-shape">
            <i class="fas fa-map-marker-alt"></i>
          </span> <!-- .icon-shape -->

          <span class="title-col">
            {{ curProvinceName }}
          </span> <!-- .label-col -->

          <span class="arrow-icon-shape">
            <i class="fas fa-sort-down"></i>
          </span> <!-- .arrow-icon-shape -->
        </div> <!-- .location-selection-label-col -->
      </div> <!-- .location-selection-block -->
    </div> <!-- .container -->
  </section> <!-- location-selection-section -->
</template>

<script>
import { mapGetters } from '~jsLibPath/lib-manager';
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME
} from '~jsBasePath/vuex/modules/page-info-module';

export default {
  name: 'TheLocationSelectionSection',

  computed: {
    ...mapGetters(PAGE_INFO_MODULE_NAME, [
      'hasCurProvinceInfo',
      'curProviceSn',
      'curProvinceName',
    ]),
  },

  created() {},

  methods: {},
}
</script>
