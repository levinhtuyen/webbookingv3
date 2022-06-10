<template>
  <div class="maps-page">
    <div class="container">
      <!-- <div class="maps-page__head">
        <back-button></back-button>
      </div> -->
      <GmapMap
        ref="mapRef"
        :center="center"
        :zoom="15"
        class="maps-page__map"
      >
        <GmapMarker
          :key="index"
          v-for="(m, index) in markers"
          :position="m.position"
          :clickable="true"
          @click="center=m.position"
        ></GmapMarker>
      </GmapMap>
    </div>
  </div>

</template>

<script>
  import { Vue } from "~jsPath/lib/lib-manager";
  import { ARR_ENV, ENV } from "~jsDefinePath/general";
  Vue.use(VueGoogleMaps, {
    load: {
      // key: "AIzaSyAfFi2Xploq0VEGFtWiWpwXL1zK-2OBI7M", //when testing
      key:
        ENV == ARR_ENV.production
          ? "AIzaSyCv6D2SxX8cWRQpeleEuidF6CElm2lPbg4"
          : "AIzaSyAfFi2Xploq0VEGFtWiWpwXL1zK-2OBI7M", //production
      libraries: "places",
    },
    installComponents: true,
  });

  export default {
    components: {},
    data() {
      return {
        center: {},
        markers: [],
      };
    },
    created() {
      this.initRoute();
    },
    mounted() {
      EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
    },
    methods: {
      initRoute() {
        let obj = JSON.parse(decodeURI(this.$route.query.maps));
        if (!obj) return this.$router.go(-1);
        let lat = Number(obj.lat);
        let lng = Number(obj.lng);
        this.center = { lat, lng };
        this.markers.push({
          position: this.center,
        });
      },
    },
    watch: {
      $route() {
        this.initRoute();
      },
    },
  };
</script>

<style src="./maps-page-style.css">
</style>
