// NOTE - lib css thường đi cùng lib js, nếu đi riêng thì dùng common chứ không dùng priate
// NOTE - Tồng hợp những lib onpage được sử dụng kèm khi khai báo router cho page
/**
 * {
 *    css: {
 *      [key:string]: {
 *        name: string,
 *        is_loaded: boolean,
 *        crossorigin?: {
 *          show: boolean,
 *          value?: string,
 *        },
 *
 *        href: string,
 *        env?: Array<string>,
 *      }
 *    },
 *
 *    js: {
 *      [key:string]: {
 *        name: string,
 *        is_loaded: boolean,
 *        crossorigin?: {
 *          show: boolean,
 *          value?: string,
 *        },
 *        integrity?: string,
 *
 *        src: string,
 *        env?: Array<string>,
 *      }
 *    },
 * }
 */
export const EXTERNAL_LIB_MANAGER = {
  css: {
    'swiper-slider': {
      name: 'swiper-slider',
      is_loaded: false,
      href: 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/6.5.8/swiper-bundle.min.css',
    },
    'element-ui': {
      name: 'element-ui',
      is_loaded: false,
      href: 'https://unpkg.com/element-ui/lib/theme-chalk/index.css',
    },
    'vue-select': {
      name: 'vue-select',
      is_load: false,
      href: 'https://cdnjs.cloudflare.com/ajax/libs/vue-select/3.12.2/vue-select.min.css',

      crossorigin: {
        show: true,
        value: 'anonymous',
      },

      integrity: 'sha512-p1n2ZxNP0mD9WVdirzIZ8OKFirQ9p8vz0V+DBD2rl2ZbCwWw8020b9nO7DLaCAb14LW8AiRsJTvG6f0PyIK30w==',
    },

    // NOTE - vue-slider-component
    'vue-slider-component': {
      name: 'vue-slider-component',
      is_load: false,
      href: 'https://cdn.jsdelivr.net/npm/vue-slider-component@3.2.15/theme/default.css',

      crossorigin: {
        show: true,
        value: 'anonymous',
      },

      integrity: 'sha256-GcXSoUxLScXHrsI4TSH5zU/uuZ24fTr/2tkwPFzLLus=',
    },
  },

  js: {
    'swiper-slider': {
      name: 'swiper-slider',
      is_loaded: false,
      src: 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/6.5.8/swiper-bundle.min.js',
    }, // swiper-slider
    'vue2-google-maps': {
      name: 'vue2-google-maps',
      is_loaded: false,
      src: 'https://cdn.jsdelivr.net/npm/vue2-google-maps@0.10.6/dist/vue-google-maps.js',
    }, // swiper-slider
    'payment-script': {
      name: 'payment-script',
      is_loaded: false,
      src : "https://sandbox.megapay.vn:2810/pg_was/js/payment/layer/paymentClient.js"
    },

    'vuejs-datepicker': {
      name: 'vuejs-datepicker',
      is_loaded: false,
      src: 'https://unpkg.com/vuejs-datepicker',
    }, // vuejs-datepicker
    'dayjs': {
      name: 'dayjs',
      is_loaded: false,
      src: 'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.5/dayjs.min.js',
    },
    'dayjs-relative-time': {
      name: 'dayjs-relative-time',
      is_load: false,
      src: 'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.5/plugin/relativeTime.min.js',
    }, // dayjs-relative-time
    'vue-google-login': {
      name: 'vue-google-login',
      is_loaded: false,
      'src': 'https://cdn.jsdelivr.net/npm/vue-google-login@2.0.5/dist/vue-google-login.min.js',
    }, // vue-google-login

    'vue-facebook-signin-button': {
      name: 'vue-facebook-signin-button',
      is_loaded: false,
      'src': 'https://cdn.jsdelivr.net/npm/vue-facebook-signin-button@1.0.1/dist/vue-facebook-signin-button.min.js'
    }, // vue-facebook-signin-button


    'vuelidate': {
      name: 'vuelidate',
      is_loaded: false,
      'src': 'https://cdn.jsdelivr.net/npm/vuelidate@0.7.6/dist/vuelidate.min.js'
    }, // vuelidate

    'validators': {
      name: 'validators',
      is_loaded: false,
      'src': 'https://cdn.jsdelivr.net/npm/vuelidate@0.7.6/dist/validators.min.js'
    }, // validators

    'InfiniteLoading': {
      name: 'InfiniteLoading',
      is_loaded: false,
      'src': 'https://unpkg.com/vue-infinite-loading@^2/dist/vue-infinite-loading.js'
    }, // InfiniteLoading

    "vue-infinite-loading":{
      name:"vue-infinite-loading",
      src:'https://cdn.jsdelivr.net/npm/vue-infinite-loading@2.4.5/dist/vue-infinite-loading.js',
      crossorigin: {
        show: true,
        value: 'anonymous',
      },
      integrity: 'sha256-LeHcz1zWvKf24EwRSFVC1p86x2PRrJARpXzRFSnxQOc=',
    },

    'popper': {
      name: 'popper',
      is_loaded: false,
      src: 'https://unpkg.com/@popperjs/core@2',
    }, // popper

    'md5': {
      name: 'md5',
      is_loaded: false,
      src: 'https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.18.0/js/md5.min.js',
    }, // md5

    'i18n-element-ui': {
      name: 'i18n-element-ui',
      is_loaded: false,
      src: 'https://unpkg.com/vue-i18n@8.24.4/dist/vue-i18n.js',
    }, // i18n-element-ui

    'element-ui': {
      name: 'element-ui',
      is_loaded: false,
      src:'https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.2/index.js'

    }, // element-ui

    'language-en-element-ui': {
      name: 'language-en-element-ui',
      is_loaded: false,
      src: '//unpkg.com/element-ui/lib/umd/locale/en.js',
    }, // language-en-element-ui

    'language-vi-element-ui': {
      name: 'language-vi-element-ui',
      is_loaded: false,
      src:'//unpkg.com/element-ui/lib/umd/locale/vi.js',
    }, // language-vi-element-ui

    'vue-observe-visibility': {
      name: 'vue-observe-visibility',
      is_loaded: false,
      src:'//unpkg.com/vue-observe-visibility/dist/vue-observe-visibility.min.js',
    }, // vue-observe-visibility

    'vue-content-loading' : {
      name : 'vue-content-loading',
      is_loaded: false,
      src:'https://cdn.jsdelivr.net/npm/vue-content-loading@1.6.0/dist/vuecontentloading.min.js',
    },

    "jquery":{
      name:"jquery",
      src:'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js',
      crossorigin: {
        show: true,
        value: 'anonymous',
      },
      integrity: 'sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==',
    },

    // NOTE - vue-slider-component
    "vue-slider-component": {
      name:"vue-slider-component",
      src:'https://cdn.jsdelivr.net/npm/vue-slider-component@3.2.15/dist/vue-slider-component.umd.min.js',
      crossorigin: {
        show: true,
        value: 'anonymous',
      },
      integrity: 'sha256-mROSPEkmGyy7rJk2WH9Uo8NtxwbiBtiOBEKDw5OpVGU=',
    },

    // NOTE - headroom
    "headroom": {
      name:"headroom",
      src:'https://cdnjs.cloudflare.com/ajax/libs/headroom/0.12.0/headroom.min.js',
      crossorigin: {
        show: true,
        value: 'anonymous',
      },
      integrity: 'sha512-9UsrKTYzS9smDm2E58MLs0ACtOki+UC4bBq4iK5wi7lJycwqcaiHxr1bdEsIVoK0l5STEzLUdYyDdFQ5OEjczw==',
    },
    "dmca_protection": {
      name:"dmca_protection",
      src:'https://images.dmca.com/Badges/DMCABadgeHelper.min.js',
      crossorigin: {
        show: true,
        value: 'anonymous',
      },

    },
  },
};
