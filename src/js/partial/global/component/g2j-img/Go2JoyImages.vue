<template>
  <img
    :key="urlImg"
    :src="IMAGE_URL + '/g2j-lazy-loading--sm.png?v=' + CACHE_VERSION"
    :data-src="urlImg"
    class="lazyload"
    width="100%"
    height="100%"
    :onerror="`this.src='${IMAGE_URL}/g2j-lazy-loading--sm.png?v=${CACHE_VERSION}'`"
    :alt="altImg"
  >
</template>

<script>
  import {
    IMAGE_URL,
    CACHE_VERSION,
    ASSETS_SERVICE_URL,
  } from "~jsDefinePath/general";
  export default {
    props: {
      urlImg: {
        type: String,
        default: `${IMAGE_URL}/g2j-lazy-loading.png?v=${CACHE_VERSION}`,
      },
      altImg: {
        type: String,
        default: "image",
      },
    },
    data() {
      return {
        IMAGE_URL,
        CACHE_VERSION,
        ASSETS_SERVICE_URL,
      };
    },
  };
</script>
