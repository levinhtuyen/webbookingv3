<template>
  <div class="empty-category">
    <div class="empty-category__img">
      <g2j-image :urlImg="IMAGE_URL+'/no_hotel.png'"></g2j-image>
    </div>
    <div class="empty-category__content">
      <p> {{ $t('category.note_empty_1') }} </p>
      <p>{{$t('category.note_empty_2')}}</p>
    </div>
  </div>
</template>

<script>
  import { IMAGE_URL, CACHE_VERSION, ASSETS_SERVICE_URL, } from '~jsDefinePath/general';
  export default {
    data () {
      return {
        IMAGE_URL
      }
    },
  }
</script>
