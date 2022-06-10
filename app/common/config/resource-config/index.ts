import APP from '@common/enum/source-enum';
import {
  DEVELOPMENT,
  PRODUCTION,
  STAGING,
} from '@common/define/enviroment-define';
import './resource-config-interface';

const { existsSync } = require('fs');

export let BASE_URL:string;
export let BASE_STATIC_URL:string;
export let BASE_LOCALHOST_STATIC_URL:string;
export let BASE_RESOURCE_URL:string;
export let BASE_DEV_API_URL: string;
export let BASE_STAGING_API_URL: string;
export let BASE_API_URL: string;
export let BASE_ASSETS_SERVICE_URL: string;

export const RESOURCE: ResourceConstruct = {
  'project': 'gulp',
  'port': process.env.PORT || 3000,
  'ip_address': 'localhost' || null,
  'env_api': STAGING,
  'staging_base_url': 'staging-home.go2joy.vn',
  'staging_static_url': 'staging-home.go2joy.vn',

  'project_version': '4.2.0.30',

  'base_url': 'go2joy.vn',
  'static_url': 'go2joy.vn',
  // 'base_url': 'staging-home.go2joy.vn',
  // 'static_url': 'staging-home.go2joy.vn',

  // NOTE - trên công ty
  // 'base_dev_api_url': '192.168.0.230/api',

  // NOTE - ngoài công ty
  'base_dev_api_url': 'dev-api.go2joy.vn/api',

  // 'base_staging_api_url': 'uat-api.go2joy.vn/api',
  'base_staging_api_url': 'staging-api.go2joy.vn/api',
  // 'base_staging_api_url': 'webbooking-api.go2joy.vn/api',
  'base_api_url': 'webbooking-api.go2joy.vn/api',

  'api_version': {
    'v1': 'v1',
    'v2': 'v2',
    'v3': 'v3',
    'v4': 'v4',
  },

  'local': 'localhost',

  'path': {
    'src': APP.src.path,
    'dummy_data': APP.src.dummy_data,
    'njk': APP.src.njk,
    'global': APP.src.njk + '/global',
    'layout': APP.src.njk + '/_layout.njk',
  },

  'resource': {
    "libs" : {
      "arrCssFile": [],
      "arrJsFile": []
    },

    "common" : {
      "arrCssFile": [
        {
          'preconnect': 'https://fonts.gstatic.com',
          'href': 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&family=Oswald:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap',
        },
        {
          'href': 'https://cdn.jsdelivr.net/npm/singularity-element-theme-chalk/lib/index.min.css',
          'preconnect': 'https://pro.fontawesome.com',
        },
        {
          'preconnect': 'https://pro.fontawesome.com',
          'href': 'https://pro.fontawesome.com/releases/v5.2.0/css/all.css',
        },
        {
          'href': 'https://cdnjs.cloudflare.com/ajax/libs/vue-select/3.12.2/vue-select.min.css',
        }
      ],
      "arrJsFile": [
        {
          'preconnect': 'https://cdnjs.cloudflare.com',
          'dns-prefetch': 'https://cdnjs.cloudflare.com',
          'crossorigin': {
            show: true,
            value: 'anonymous',
          },
          'src': 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js',
          'integrity': 'sha512-WFN04846sdKMIP5LKNphMaWzU7YpMyCU245etK3g/2ARYbPK9Ub18eG+ljU96qKRCWh+quCY7yefSmlkQw1ANQ==',
        },
        {
          'src': 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js',
          'integrity': 'sha512-XdUZ5nrNkVySQBnnM5vzDqHai823Spoq1W3pJoQwomQja+o4Nw0Ew1ppxo5bhF2vMug6sfibhKWcNJsG8Vj9tg==',
          'crossorigin': {
            show: true,
            value: 'anonymous',
          },
        },
        {
          'src': 'https://cdnjs.cloudflare.com/ajax/libs/vuex/3.6.2/vuex.min.js',
          'integrity': 'sha512-Tkxwo8dZEZTmje5QT9uodCqe2XGbZdBXU8uC4nskBt0kwR99Anzkz8JCSMByfoqjLTHcTuIB8fsmED3b9Ljp3g==',
          'crossorigin': {
            show: true,
            value: 'anonymous',
          },
        },
        {
          'src': 'https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.5.1/vue-router.min.js',
          'integrity': 'sha512-c5QVsHf336TmWncPySsNK2ncFiVsPEWOiJGDH/Le/5U6q1hU6F5B7ziAgRwCokxjmu4HZBkfWsQg/D/+X3hFww==',
          'crossorigin': {
            show: true,
            value: 'anonymous',
          },
        },
        {
          'src': 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js',
          'integrity': 'sha512-q583ppKrCRc7N5O0n2nzUiJ+suUv7Et1JGels4bXOaMFQcamPk9HjdUknZuuFjBNs7tsMuadge5k9RzdmO+1GQ==',
          'crossorigin': {
            show: true,
            value: 'anonymous',
          },
          "ignore_bot": ['G2JBot']
        },
        {
          'src': 'https://cdnjs.cloudflare.com/ajax/libs/he/1.2.0/he.min.js',
          'integrity': 'sha512-PEsccDx9jqX6Dh4wZDCnWMaIO3gAaU0j46W//sSqQhUQxky6/eHZyeB3NrXD2xsyugAKd4KPiDANkcuoEa2JuA==',
          'crossorigin': {
            show: true,
            value: 'anonymous',
          },
        },
        {
          'src': 'https://cdnjs.cloudflare.com/ajax/libs/vue-i18n/8.25.0/vue-i18n.min.js',
          'integrity': 'sha512-SvacYdYlKKdwVJG9Vgq3S8FUBkuQVNk+RB9xyOMdeJflfUIClzLTpZTcGd06Z1q4krS7zKz4AD5KqUl+4CqmRA==',
          'crossorigin': {
            show: true,
            value: 'anonymous',
          },
        },

        {
          'src': 'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.4/dayjs.min.js',
          'integrity': 'sha512-0fcCRl828lBlrSCa8QJY51mtNqTcHxabaXVLPgw/jPA5Nutujh6CbTdDgRzl9aSPYW/uuE7c4SffFUQFBAy6lg==',
          'crossorigin': {
            show: true,
            value: 'anonymous',
          },
        },

        {
          'src': 'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.7/locale/vi.min.js',
          'integrity': 'sha512-5ss9vr30Awo4c1A37n90cdvPdeg5cdAcjh/PxaxZyEt4Qu41UAK1rPz4Z/Zotf1bEW6OcLluEBHOO4rjDyyJLg==',
          'crossorigin': {
            show: true,
            value: 'anonymous',
          },
        },

        {
          'src': 'https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuidv1.min.js',
          'integrity': 'sha512-4hJwRX3o1o5dU3A+ffhCQpLzOT7U0wDoR9Ha7McoxXez011iFJ6RMB08BrzE23G+gB3gNriotihq7TPIf7x/NA==',
          'crossorigin': {
            show: true,
            value: 'anonymous',
          },
        },

        // NOTE - firebase-app
        {
          'src': 'https://cdnjs.cloudflare.com/ajax/libs/firebase/8.7.1/firebase-app.min.js',
          'integrity': 'sha512-zX/hiKDbDRO+ZKGf3rxddTEYXarb5PKRIAQNba2c9zHFtyeT/NmbBt7CMdyl+3I+eNis0t1n5Jtsv7+35SYAsA==',
          'crossorigin': {
            show: true,
            value: 'anonymous',
          },
        },

        // NOTE - firebase-auth
        {
          'src': 'https://cdnjs.cloudflare.com/ajax/libs/firebase/8.7.1/firebase-auth.min.js',
          'integrity': 'sha512-GAEvFso2oksY5JFkHlrfLhZgAV6aL48qxnbxPnbKnNLeG/XsU/c0lh/g9gocZ2RtbRx6VDTqspPEy9ixWvbfzw==',
          'crossorigin': {
            show: true,
            value: 'anonymous',
          },
        },


        // NOTE - firebase-analytics
        {
          'src': 'https://cdnjs.cloudflare.com/ajax/libs/firebase/8.7.1/firebase-analytics.min.js',
          'integrity': 'sha512-oTLQLbtDKafe+IRNH6Mj37IgWBD8DM13U6pagVpggGBVh2t0spiYQh29VGmC4UsuvoVeNaDQfMFItyjiG1H03Q==',
          'crossorigin': {
            show: true,
            value: 'anonymous',
          },
        },

        // NOTE - axios
        {
          'src': 'https://cdnjs.cloudflare.com/ajax/libs/axios/0.24.0/axios.min.js',
          'integrity': 'sha512-u9akINsQsAkG9xjc1cnGF4zw5TFDwkxuc9vUp5dltDWYCSmyd0meygbvgXrlc/z7/o4a19Fb5V0OUE58J7dcyw==',
          'crossorigin': {
            show: true,
            value: 'anonymous',
          },
        },

        // NOTE - vue-select
        {
          'src': 'https://cdnjs.cloudflare.com/ajax/libs/vue-select/3.12.2/vue-select.min.js',
          'integrity': 'sha512-WCT9aK0DQkbKnOj1pAHSTkg5Y3vYGFACNP/QvAfM0GfFZkuPfrxyRgOg4yrAxBEBBGfuf9kC6/SMuV6qDyFJjA==',
          'crossorigin': {
            show: true,
            value: 'anonymous',
          },
        },
      ]
    },

    "index" : {
      'name': 'index',
      "arrCssFile" : [
        'vendor-style'
      ],
      "arrJsFile" : {
        "common": [],

        "main": {
          "header": [
            "vendor",
          ],
          "body": [
            "vendor-01",
            "vendor-02",
            "app",
          ],
        }
      },

      'arrPreconnect': [
        () => BASE_STATIC_URL,
        () => BASE_ASSETS_SERVICE_URL,
        () => BASE_API_URL.replace('/api',''),
      ],

      'arrPreload': [
        {
          'getHref': () => BASE_STATIC_URL + '/css/vendor-style.css',
          'as': 'style',
        },
        {
          'getHref': () => BASE_STATIC_URL + '/js/vendor-01.js',
          'as': 'script',
        },
        {
          'getHref': () => BASE_STATIC_URL + '/js/vendor-02.js',
          'as': 'script',
        },
        {
          'getHref': () => BASE_STATIC_URL + '/js/vendor.js',
          'as': 'script',
        },
        {
          'getHref': () => BASE_STATIC_URL + '/js/app.js',
          'as': 'script',
        },
      ],

      'arrPrefetch': [
        // {
        //   'getHref': () => BASE_STATIC_URL + '/image/svg/notification-logo.svg',
        //   'as': 'image',
        // },
        // {
        //   'getHref': () => BASE_STATIC_URL + '/js/the-home-page.js',
        //   'as': 'script',
        // },
        // {
        //   'getHref': () => BASE_STATIC_URL + '/language/the-home-language.json',
        //   'as': 'fetch',
        // },
        {
          'getHref': () => BASE_STATIC_URL + '/image/g2j-lazy-loading.png',
          'as': 'image',
        },
        {
          'getHref': () => BASE_STATIC_URL + '/image/g2j-lazy-loading--xs.png',
          'as': 'image',
        },
        {
          'getHref': () => BASE_STATIC_URL + '/image/g2j-lazy-loading--sm.png',
          'as': 'image',
        },
        {
          'getHref': () => BASE_STATIC_URL + '/image/g2j-lazy-loading--sm.png',
          'as': 'image',
        },
        {
          'getHref': () => BASE_STATIC_URL + '/image/apple-download-btn.png',
          'as': 'image',
        },
        {
          'getHref': () => BASE_STATIC_URL + '/image/android-download-btn.png',
          'as': 'image',
        },
        // {
        //   'getHref': () => BASE_STATIC_URL + '/image/svg/vn-circle--flag.svg',
        //   'as': 'image',
        // },
      ],

      'dummy_data': true,
      'dummy_data_name': 'app'
    },

    // NOTE - style-guide-page
    'style-guide-page': {
      'arrCssFile': [],
      'arrJsFile': {
        'common': [
          {
            'src': 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js',
            'integrity': 'sha256-KSlsysqp7TXtFo/FHjb1T9b425x3hrvzjMWaJyKbpcI=',
          },
          {
            'src': 'https://cdn.jsdelivr.net/npm/vue-router@3.5.1/dist/vue-router.min.js',
            'integrity': 'sha256-eZzOaXKNUwCBbixtwh69SAgFtFqGT6028WLW01MNPKA=',
          },
        ],
        'main': [
          "style-guide-app"
        ],
      },
      'dummy_data': false,
    },
    // End - style-guide-page

    // NOTE - 4-buoc-ve-dem-cua-gioi-tre
    '4-buoc-ve-dem-cua-gioi-tre': {
      'arrCssFile': {
        'common': [
          {
            'preconnect': 'https://fonts.gstatic.com',
            'href': 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&family=Oswald:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap',
          },
          {
            'href': 'https://cdn.jsdelivr.net/npm/singularity-element-theme-chalk@0.0.21/lib/index.min.css',
            'preconnect': 'https://pro.fontawesome.com',
          },
          {
            'href': 'https://pro.fontawesome.com/releases/v5.2.0/css/all.css',
          },
          {
            'href': 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css',
          }
        ],
        'main': [
          '4-buoc-ve-dem-cua-gioi-tre-vendor-style',
        ]
      },
      'arrJsFile': {
        'common': [
          {
            'src': 'https://code.jquery.com/jquery-3.2.1.slim.min.js',
            'integrity': 'sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN',
            'crossorigin': {
              show: true,
              value: 'anonymous',
            },
          },
          {
            'src': 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js',
            'integrity': 'sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q',
            'crossorigin': {
              show: true,
              value: 'anonymous',
            },
          },
          {
            'src': 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js',
          },
          {
            'src': 'https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js',
            'integrity': 'sha512-Eak/29OTpb36LLo2r47IpVzPBLXnAMPAVypbSZiZ4Qkf8p/7S/XRG5xp7OKWPPYfJT6metI+IORkR5G8F900+g==',
            'crossorigin': {
              show: true,
              value: 'anonymous',
            },
          },
        ],
        'main': {
          "header": [
            "4-buoc-ve-dem-cua-gioi-tre-vendor",
          ],
          "body": [
            "4-buoc-ve-dem-cua-gioi-tre-app",
          ],
        },
      },
      'dummy_data': false,
    },
    // End 4-buoc-ve-dem-cua-gioi-tre

    // NOTE - bat-mi-diem-hen-ho-ly-tuong
    'bat-mi-diem-hen-ho-ly-tuong': {
      'arrCssFile': {
        'common': [
          {
            'preconnect': 'https://fonts.gstatic.com',
            'href': 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&family=Oswald:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap',
          },
          {
            'href': 'https://cdn.jsdelivr.net/npm/singularity-element-theme-chalk@0.0.21/lib/index.min.css',
            'preconnect': 'https://pro.fontawesome.com',
          },
          {
            'href': 'https://pro.fontawesome.com/releases/v5.2.0/css/all.css',
          },
          {
            'href': 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css',
          }
        ],
        'main': [
          'bat-mi-diem-hen-ho-ly-tuong-vendor-style',
        ]
      },
      'arrJsFile': {
        'common': [
          {
            'src': 'https://code.jquery.com/jquery-3.2.1.slim.min.js',
            'integrity': 'sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN',
            'crossorigin': {
              show: true,
              value: 'anonymous',
            },
          },
          {
            'src': 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js',
            'integrity': 'sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q',
            'crossorigin': {
              show: true,
              value: 'anonymous',
            },
          },
          {
            'src': 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js',
          },
          {
            'src': 'https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js',
            'integrity': 'sha512-Eak/29OTpb36LLo2r47IpVzPBLXnAMPAVypbSZiZ4Qkf8p/7S/XRG5xp7OKWPPYfJT6metI+IORkR5G8F900+g==',
            'crossorigin': {
              show: true,
              value: 'anonymous',
            },
          },
        ],
        'main': [],
      },
      'dummy_data': false,
    },

    // NOTE - article
    'article': {
      'arrCssFile': {
        'common': [
          {
            'preconnect': 'https://fonts.gstatic.com',
            'href': 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&family=Oswald:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap',
          },
          {
            'preconnect': 'https://pro.fontawesome.com',
            'href': 'https://pro.fontawesome.com/releases/v5.2.0/css/all.css',
          },
          {
            'preconnect': 'https://cdnjs.cloudflare.com',
            'href': 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/6.5.8/swiper-bundle.min.css',
          },
        ],
        'main': [
          'article-vendor-style',
        ]
      },
      'arrJsFile': {
        'common': [
          {
            'preconnect': 'https://cdnjs.cloudflare.com',
            'dns-prefetch': 'https://cdnjs.cloudflare.com',
            'crossorigin': {
              show: true,
              value: 'anonymous',
            },
            'src': 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js',
            'integrity': 'sha512-WFN04846sdKMIP5LKNphMaWzU7YpMyCU245etK3g/2ARYbPK9Ub18eG+ljU96qKRCWh+quCY7yefSmlkQw1ANQ==',
          },
          {
            'src': 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js',
            'integrity': 'sha512-XdUZ5nrNkVySQBnnM5vzDqHai823Spoq1W3pJoQwomQja+o4Nw0Ew1ppxo5bhF2vMug6sfibhKWcNJsG8Vj9tg==',
            'crossorigin': {
              show: true,
              value: 'anonymous',
            },
          },
          {
            'src': 'https://cdnjs.cloudflare.com/ajax/libs/vuex/3.6.2/vuex.min.js',
            'integrity': 'sha512-Tkxwo8dZEZTmje5QT9uodCqe2XGbZdBXU8uC4nskBt0kwR99Anzkz8JCSMByfoqjLTHcTuIB8fsmED3b9Ljp3g==',
            'crossorigin': {
              show: true,
              value: 'anonymous',
            },
          },
          {
            'src': 'https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.5.1/vue-router.min.js',
            'integrity': 'sha512-c5QVsHf336TmWncPySsNK2ncFiVsPEWOiJGDH/Le/5U6q1hU6F5B7ziAgRwCokxjmu4HZBkfWsQg/D/+X3hFww==',
            'crossorigin': {
              show: true,
              value: 'anonymous',
            },
          },
          {
            'src': 'https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuidv1.min.js',
            'integrity': 'sha512-4hJwRX3o1o5dU3A+ffhCQpLzOT7U0wDoR9Ha7McoxXez011iFJ6RMB08BrzE23G+gB3gNriotihq7TPIf7x/NA==',
            'crossorigin': {
              show: true,
              value: 'anonymous',
            },
          },
          {
            'src': 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js',
            'integrity': 'sha512-q583ppKrCRc7N5O0n2nzUiJ+suUv7Et1JGels4bXOaMFQcamPk9HjdUknZuuFjBNs7tsMuadge5k9RzdmO+1GQ==',
            'crossorigin': {
              show: true,
              value: 'anonymous',
            },
            "ignore_bot": ['G2JBot']
          },
          {
            'src': 'https://cdnjs.cloudflare.com/ajax/libs/he/1.2.0/he.min.js',
            'integrity': 'sha512-PEsccDx9jqX6Dh4wZDCnWMaIO3gAaU0j46W//sSqQhUQxky6/eHZyeB3NrXD2xsyugAKd4KPiDANkcuoEa2JuA==',
            'crossorigin': {
              show: true,
              value: 'anonymous',
            },
          },
          {
            'src': 'https://cdnjs.cloudflare.com/ajax/libs/vue-i18n/8.25.0/vue-i18n.min.js',
            'integrity': 'sha512-SvacYdYlKKdwVJG9Vgq3S8FUBkuQVNk+RB9xyOMdeJflfUIClzLTpZTcGd06Z1q4krS7zKz4AD5KqUl+4CqmRA==',
            'crossorigin': {
              show: true,
              value: 'anonymous',
            },
          },
          {
            'src': 'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.4/dayjs.min.js',
            'integrity': 'sha512-0fcCRl828lBlrSCa8QJY51mtNqTcHxabaXVLPgw/jPA5Nutujh6CbTdDgRzl9aSPYW/uuE7c4SffFUQFBAy6lg==',
            'crossorigin': {
              show: true,
              value: 'anonymous',
            },
          },
          // NOTE - axios
          {
            'src': 'https://cdnjs.cloudflare.com/ajax/libs/axios/0.24.0/axios.min.js',
            'integrity': 'sha512-u9akINsQsAkG9xjc1cnGF4zw5TFDwkxuc9vUp5dltDWYCSmyd0meygbvgXrlc/z7/o4a19Fb5V0OUE58J7dcyw==',
            'crossorigin': {
              show: true,
              value: 'anonymous',
            },
          },
          {
            'src': 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/6.5.8/swiper-bundle.min.js',
            'integrity': 'sha512-sAHYBRXSgMOV2axInO6rUzuKKM5SkItFLlLHQ8YjRD+FBwowtATOs4njP9oim3/MzyAGrB52SLDjpAOLcOT9TA==',
            'crossorigin': {
              show: true,
              value: 'anonymous',
            },
          },
        ],
        'main': {
          "header": [
            "article-vendor",
          ],
          "body": [
            "article-app",
          ],
        },
      },
      'dummy_data': true,
      'dummy_data_name': 'article'
    },
    // End article
  },

  'dummy_data_name_map': {
    'app': 'index'
  },
};

//=======================================
// NOTE - generate External IP
//=======================================
const os = require('os');
const OSNetworkInterfaces = os.networkInterfaces();
const Ethernet = OSNetworkInterfaces.Ethernet || Object.values(OSNetworkInterfaces);

if(Ethernet) {
  let ethernetFormatted = Ethernet;

  if(ethernetFormatted[0].length) {
    let tmpEthernetFormatted = [];

    ethernetFormatted.forEach(function(EthernetItem) {
      tmpEthernetFormatted = tmpEthernetFormatted.concat(EthernetItem);
    });

    ethernetFormatted = tmpEthernetFormatted;
  }

  ethernetFormatted.some(function(ethernetItem) {
    const ethernetItemInfo = ((
      ethernetItem.family &&
      ethernetItem.family.toLowerCase() === 'ipv4'
    ) ? ethernetItem : null);

    if(
      ethernetItemInfo &&
      ethernetItemInfo.address !== '127.0.0.1' &&
      (
        ethernetItemInfo.address.includes('192') ||
        ethernetItemInfo.address.includes('172')
      )
    ) {
      RESOURCE.ip_address = ethernetItemInfo.address;
      return true;
    }
  });
}

BASE_DEV_API_URL = (process.env.BASE_API || 'http://' + RESOURCE.base_dev_api_url);
BASE_STAGING_API_URL = (process.env.BASE_API || 'https://' + RESOURCE.base_staging_api_url);
BASE_LOCALHOST_STATIC_URL = "http://localhost:" + RESOURCE.port;
BASE_API_URL = (process.env.BASE_API || 'https://' + RESOURCE.base_api_url);

if(process.env.NODE_ENV === DEVELOPMENT) {
  BASE_URL = (process.env.BASE_URL || 'http://' + RESOURCE.ip_address + ':' + RESOURCE.port);
  // BASE_STATIC_URL = (process.env.STATIC_URL || '');
  // BASE_RESOURCE_URL = '/tmp';
  // BASE_STATIC_URL = (process.env.STATIC_URL || 'https://localhost:'+RESOURCE.port);
  BASE_STATIC_URL = (
    process.env.STATIC_URL ||
    (
      process.env.ENABLE_SERVER &&
      existsSync(APP.lab.path+'server.key') &&
      existsSync(APP.lab.path+'server.crt') ?
        process.env.ENABLE_HTTPS ?
          'https://'+RESOURCE.ip_address+':'+RESOURCE.port :
        'https://'+RESOURCE.ip_address+':3112' :
      'http://'+RESOURCE.ip_address+':'+RESOURCE.port
    )
  );

  BASE_RESOURCE_URL = 'http://'+RESOURCE.ip_address+':'+RESOURCE.port+'/tmp';
  BASE_ASSETS_SERVICE_URL = (
    process.env.BASE_ASSETS_SERVICE_URL ||
    (
      RESOURCE.env_api === DEVELOPMENT ||
      RESOURCE.env_api === STAGING ?
        'https://go2joylocal.s3-ap-southeast-1.amazonaws.com' :
      'https://go2joy.s3-ap-southeast-1.amazonaws.com'
    )
  );
} else if (process.env.NODE_ENV === STAGING) {
  BASE_URL = (process.env.BASE_URL || 'https://' + RESOURCE.staging_base_url);
  BASE_STATIC_URL = (process.env.STATIC_URL || 'https://' + RESOURCE.staging_static_url);
  BASE_RESOURCE_URL = (process.env.STATIC_URL || 'https://' + RESOURCE.staging_static_url);
  BASE_DEV_API_URL = BASE_STAGING_API_URL;
  BASE_API_URL = BASE_STAGING_API_URL;
  BASE_ASSETS_SERVICE_URL = (process.env.BASE_ASSETS_SERVICE_URL || 'https://go2joylocal.s3-ap-southeast-1.amazonaws.com');
} else if (process.env.NODE_ENV === PRODUCTION) {
  BASE_URL = (process.env.BASE_URL || 'https://' + RESOURCE.base_url);
  BASE_STATIC_URL = (process.env.STATIC_URL || 'https://' + RESOURCE.static_url);
  BASE_RESOURCE_URL = (process.env.STATIC_URL || 'https://' + RESOURCE.static_url);
  BASE_DEV_API_URL = BASE_API_URL;
  BASE_STAGING_API_URL = BASE_API_URL;
  BASE_ASSETS_SERVICE_URL = (process.env.BASE_ASSETS_SERVICE_URL || 'https://go2joy.s3-ap-southeast-1.amazonaws.com');
}
