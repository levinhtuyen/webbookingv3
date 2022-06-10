<template>
  <div class="empty-state">
    <span class="empty-state--container">
      <img
        :style="'height:' + height"
        :src="imageUrl + '/empty-states.svg'"
        alt=""
      >
      {{ description }}
    </span>
  </div>
</template>

<script>
import { IMAGE_URL } from "~jsDefinePath/general";

export default {
  props: {
    description: { type: String, default: "No data" },
    height: { type: String, default: "80px" }
  },

  computed: {
    imageUrl() {
      return IMAGE_URL;
    }
  }
};
</script>
