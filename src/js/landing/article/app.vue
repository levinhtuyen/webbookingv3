<template>
  <div class="app main-container">
    <TheHeaderStickySection></TheHeaderStickySection>

    <router-view />

    <TheFooterStickySection />

    <!-- NOTE - Nếu đặt thêm 1 component có update ở dưới router-view -> router view sẽ tự update khi component default/other change -->
    <!-- <transition :name="(isShowLoading ? '' : 'fade')"> -->
    <TheG2jLoading
      v-show="isShowLoading"
      :key="routerViewCacheVersion"
      :extend-class="extendLoadingClass"
    />
    <!-- </transition> -->
  </div>
  <!-- .vue-app -->
</template>

<script>
import {
  EVENT_BUS_KEY,
} from '~jsDefinePath/event-bus';
import TheG2jLoading from '~jsPartialPath/global/component/go2joy-loading/TheG2jLoading.vue';
import TheHeaderStickySection from '~jsPath/landing/article/partial/global/component/header-sticky/TheHeaderStickySection.vue';
import TheFooterStickySection from '~jsPath/landing/article/partial/global/component/footer-sticky/TheFooterStickySection.vue';

export default {
  name: 'App',

  components: {
    TheHeaderStickySection,
    TheFooterStickySection,
    TheG2jLoading,
  },

  data () {
    return {
      TimeoutHandler: new TimeoutHandler(),

      routerViewCacheVersion: Date.now(),
      isFirstLoading: true,
      isShowLoading: true,
      extendLoadingClass: 'is-fill',
    };
  },

  computed: {},

  created () {
    const self = this;

    self.handleEventBusListender();
  },

  methods: {
    handleEventBusListender () {
      const self = this;

      EventBus.on('UPDATE_ROUTER_VIEW', function (cache) {
        self.routerViewCacheVersion = cache;
      });

      // NOTE - Handle is_show_router_loading
      const hideRouterLoadingTimeout = self.TimeoutHandler.init(
        'hideRouterLoading',
        150,
        function() {
          self.isShowLoading = false;
        }
      );

      EventBus.on(EVENT_BUS_KEY.IS_SHOW_ROUTER_LOADING, function (requestLoadingInfo) {
        let isShowLoading = false;

        if (self.isFirstLoading) {
          self.isFirstLoading = false;
        }

        if (typeof requestLoadingInfo === 'boolean') {
          isShowLoading = requestLoadingInfo;
          self.extendLoadingClass = '';
        } else if (typeof requestLoadingInfo === 'object') {
          isShowLoading = requestLoadingInfo.is_show;
          self.extendLoadingClass = requestLoadingInfo.extend_class;
        }

        if(isShowLoading) {
          hideRouterLoadingTimeout.clear();
          self.isShowLoading = isShowLoading;
        } else {
          hideRouterLoadingTimeout.handle();
        }
      });

      // NOTE - redirect 404 page
      EventBus.on('REDIRECT-404-PAGE', () => {
        this.$router.push({ name: '404-not-found' })
      });
    }, // handleEventBusListender()
  },
}
</script>
