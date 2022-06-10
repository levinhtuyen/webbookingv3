<template>
  <div class="home-select-autocomplete-field">
    <div class="home-select-autocomplete-field__input">
      <input
        v-model="value"
        type="text"
        class="home-select-autocomplete-field__input-item"
        placeholder=""
      >
    </div> <!-- .ome-select-autocomplete-field__input -->

    <div class="home-select-autocomplete-field__result-list">
      <template v-for="item, key in itemListFiltered">
        <div
          :key="key"
          class="home-select-autocomplete-field__result-item"
        >
        </div> <!-- .home-select-autocomplete-field__result-item -->
      </template>
    </div>
  </div> <!-- .home-select-autocomplete-field -->
</template>

<script>
import {
  _,
} from '~jsLibPath/lib-manager';

export default {
  name: 'HomeSelectAutocompleteField',

  props: {
    itemList: {
      default: () => [],
      type: Array,
    },

    valueKey: {
      default: '',
      type: String,
    },
  },

  computed: {
    hasItemList() {
      return (
        itemList &&
        !_.isEmpty(itemList)
      );
    }, // hasItemList
  },

  data() {
    return {
      itemListFiltered: [],
      value: '',
    };
  },

  created() {},

  methods: {
    formatItemList() {
      if(this.) {

      }
    }, // formatItemList
  },
};
</script>
