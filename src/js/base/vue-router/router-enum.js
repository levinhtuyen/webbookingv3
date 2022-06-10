import {
  JS_URL,
  CACHE_VERSION,

  // NOTE - 'development', 'staging', 'production'
  ENV,
  ARR_ENV,

  // NOTE - 'normal', 'uat'
  IS_UAT,

  BOT_INFO,
} from "~jsDefinePath/general";
import { LANGUAGE_NAME, LANGUAGE_INFO } from "~jsDefinePath/language";
import { ROUTER_NAME, ROUTER_PATH } from "./router-define";
import {
  EXTERNAL_LIB_MANAGER,
} from '~jsLibPath/external-lib-manager';
import {
  getHomePath,
} from "~jsHelperPath/util/HandleUrl";

const ONLY_DEV = (ENV === ARR_ENV.development && !IS_UAT);

const ENABLE_STAGING = (ENV === ARR_ENV.development || (ENV === ARR_ENV.staging && !IS_UAT));

const ENABLE_UAT = (ENV === ARR_ENV.development || ENV === ARR_ENV.staging || IS_UAT);

const _generateComponentPath = (strFileName) => {
  return {
    file_name: strFileName,
    file_path: JS_URL + "/" + strFileName + "?v=" + CACHE_VERSION,
  };
}; // _generateComponentPath()

// NOTE - Xây dựng tham chiếu đến window.router_view_component_list
const ROUTER_VIEW_COMPONENT_LIST = {
  TheHomePage: null,
  TheHomeV4Page: null,
  TheListTaskPage: null,
  TheListTaskDetailPage: null,
  //==============Group========>
  TheCategoryPage: null,
  //===========end Group=======>
  TheContactPage: null,
  ThePromotionPage: null,
  TheDetailPromotionPage: null,
  TheHotelDetailPage: null,
  TheHotelDetailV4Page: null,
  // ThePaymentPage: null,
  ThePaymentDetailPage: null,
  ThePaymentSuccessPage: null,
  TheHotelDisplayPage: null,
  TheCommonHotelDisplayPage: null,
  TheLoginPage: null,
  TheLoginV4Page: null,
  TheAccountPage: null,
  TheSignUpPage: null,
  TheSignUpV4Page: null,
  TheForgetPasswordPage: null,
  TheForgetPasswordV4Page: null,
  TheStampPage: null,
  TheStampDetailPage: null,
  ThePointPage: null,
  TheBookingPage: null,
  TheBookingDetailPage: null,
  TheBookingDetailV4Page: null,
  TheCouponPage: null,
  TheLinkedPage: null,
  SearchPage: null,
  TheMapsPage: null,
  TheRoomDetailPage: null,
  TheRoomDetailV4Page: null,
  TheVisionPage: null,
  TheProfilePage: null,
  TheNotFoundPage: null,
  ThePayooPage: null,
  TheConfirmInformationPage: null,
  TheHotelListv4Page: null
};

// NOTE - Định nghĩa object router_view

window.router_view = ROUTER_VIEW_COMPONENT_LIST;

// NOTE - Định nghĩa danh sách component file name cho từng router, vì những file này đã được tách ra khỏi app.js file (tối ưu dung lượng các resource onpage loading - không cho phép 1 resource có dung lượng từ 200kb được onpage loading) nên cần được định nghĩa vào đây thay vì import trực tiếp vào, khi router được kích hoạt sẽ có phần tiền xử lý để kiểm tra router đã được đăng ký hay chưa để append tài nguyên của router đó vào
const ROUTER_COMPONENT_FILE_NAME = {
  // NOTE - home page group
  [ROUTER_NAME["home-page"]]: "the-home-page.js",
  [ROUTER_NAME["home-v4-page"]]: "the-home-v4-page.js",

  // NOTE - list task group
  [ROUTER_NAME["list-task-page"]]: "the-list-task-page.js",
  [ROUTER_NAME["list-task-detail"]]: "the-list-task-detail-page.js",

  //=================== Group ==================>
  // NOTE - /location/:provinceName/:districtName? , /hotelcategory/:typeName
  [ROUTER_NAME["category-page"]]: "the-category-page.js",
  //================= end Group ================>

  [ROUTER_NAME["contact-page"]]: "the-contact-page.js",

  // NOTE - promotion-page
  [ROUTER_NAME["promotion-page"]]: "the-promotion-page.js",

  // NOTE - detail-promotion-page
  [ROUTER_NAME["detail-promotion-page"]]: "the-detail-promotion-page.js",

  // NOTE - hotel-detail-page
  [ROUTER_NAME["hotel-detail-page"]]: "the-hotel-detail-page.js",

  // NOTE - hotel-detail-v4-page
  [ROUTER_NAME["hotel-detail-v4-page"]]: "the-hotel-detail-v4-page.js",

  [ROUTER_NAME["maps-page"]]: "the-maps-page.js",

  // NOTE - payment
  [ROUTER_NAME["payment"]]: "the-payment-page.js",

  [ROUTER_NAME["payment-success"]]: "payment-success-page.js",

  [ROUTER_NAME["payment-detail"]]: "payment-detail-page.js",

  // NOTE - hotel display group
  [ROUTER_NAME["hotel-display"]]: "the-hotel-display-page.js",
  [ROUTER_NAME["common-hotel-display-page"]]:
    "the-common-hotel-display-page.js",

  // NOTE - login
  [ROUTER_NAME["login-page"]]: "the-login-page.js",
  [ROUTER_NAME["login-v4-page"]]: "the-login-v4-page.js",

  // NOTE - account
  [ROUTER_NAME["account-page"]]: "the-account-page.js",

  // NOTE - sign-up
  [ROUTER_NAME["sign-up-page"]]: "the-sign-up-page.js",
  [ROUTER_NAME["sign-up-v4-page"]]: "the-sign-up-v4-page.js",

  // NOTE - forget-password
  [ROUTER_NAME["forget-password-page"]]: "the-forget-password-page.js",
  [ROUTER_NAME["forget-password-v4-page"]]: "the-forget-password-v4-page.js",

  // NOTE - stamp
  [ROUTER_NAME["stamp-page"]]: "the-stamp-page.js",

  // NOTE - stamp detail
  [ROUTER_NAME["stamp-detail-page"]]: "the-stamp-detail-page.js",

  // NOTE - point
  [ROUTER_NAME["point-page"]]: "the-point-page.js",

  // NOTE - booking
  [ROUTER_NAME["booking-page"]]: "the-booking-page.js",

  // NOTE - booking detail
  [ROUTER_NAME["booking-detail-page"]]: "the-booking-detail-page.js",
  [ROUTER_NAME["booking-detail-v4-page"]]: "the-booking-detail-v4-page.js",

  // NOTE - coupon
  [ROUTER_NAME["coupon-page"]]: "the-coupon-page.js",
  [ROUTER_NAME["linked-page"]]: "the-linked-page.js",
  [ROUTER_NAME["search-page"]]: "search-page.js",

  // NOTE - blog-list-page
  // [ROUTER_NAME["blog-list-page"]]: "the-blog-list-page.js",

  // NOTE - blog
  // [ROUTER_NAME["blog-detail-page"]]: "the-blog-detail-page.js",

  //NOTE - room-detail-page
  [ROUTER_NAME["room-detail-page"]]: "room-detail-page.js",
  [ROUTER_NAME["room-detail-v4-page"]]: "the-room-detail-v4-page.js",

  //NOTE - vision-page
  [ROUTER_NAME["vision-page"]]: "the-vision-page.js",

  //NOTE - profile-page
  [ROUTER_NAME["profile-page"]]: "the-profile-page.js",

  //NOTE - about-us-page
  [ROUTER_NAME["about-us-page"]]: "the-about-us-page.js",

  //NOTE - term-condition-page
  [ROUTER_NAME["term-condition-page"]]: "the-term-condition-page.js",

  //NOTE - payment-v4-page
  [ROUTER_NAME["payment-v4-page"]]: "the-payment-v4-page.js",

  //NOTE - not-found-page
  [ROUTER_NAME["not-found-page"]]: "the-not-found-page.js",

  [ROUTER_NAME["payoo-page"]]: "the-payoo-page.js",

  [ROUTER_NAME["hotel-list-v4-page"]]: "the-hotel-list-v4-page.js",
};

// NOTE - Định nghĩa danh sách toàn bộ thông tin của mỗi router, bao gồm
/**
 * {
 *  name: string,
 *  path: string,
 *  component_path: string,
 *  component: Function,
 *
 *  no_style?: boolean,
 *
 *
 *  js?: Array<string>,
 *
 *  language?: Object, // NOTE - Path of language on page
 *
 *  valid?: function():boolean {
 *    return boolean;
 *  }, // NOTE - Url validation (If router has this field -> the router-util will auto check )
 *
 *  permisson?: {
 *    valid: function(loginInfo) { this { to: ..., from: ... } }, // NOTE - Phải sử dụng traditional function vì yêu cầu context this từ router-util
 *    redirect: string,
 *  },
 *
 *  history_step?: true,
 *
 *  redirect_list?: Array<string>
 *
 *  tracking?: {
 *    firebase?: Array<string | { name: string, options... }>,
 *    dable?: Array<string | { name: string, options... }>,
 *  }
 *
 *  has_meta_tag?: boolean,
 *  robots_meta_tag?: {
 *    index: boolean,
 *    follow: boolean,
 *  }
 * }
 */
const ROUTER_INFO = {
  // NOTE - home page group
  [ROUTER_NAME["home-page"]]: {
    name: ROUTER_NAME["home-page"],
    path: ROUTER_PATH[ROUTER_NAME["home-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["home-v4-page"]]
    ),
    component: () => (ROUTER_VIEW_COMPONENT_LIST.TheHomeV4Page || null),

    css: [EXTERNAL_LIB_MANAGER.css["swiper-slider"].name],

    js: [
      EXTERNAL_LIB_MANAGER.js["swiper-slider"].name,
      EXTERNAL_LIB_MANAGER.js["vue-content-loading"].name,
    ],

    language: LANGUAGE_INFO[LANGUAGE_NAME["the-home-language"]],

    has_meta_tag: true,

    robots_meta_tag: {
      index: true,
      follow: true,
    },

    valid: function() {
      return (
        !BOT_INFO.isBot ||
        !/\?+(|[A-Za-z-0-9\=\&]+)(?:$)/.test(this.to.fullPath)
      );
    },
  },

  [ROUTER_NAME["payment-success"]]: {
    name: ROUTER_NAME["payment-success"],
    path: ROUTER_PATH[ROUTER_NAME["payment-success"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["payment-success"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.ThePaymentSuccessPage || null,
    css: [],

    js: [
      // EXTERNAL_LIB_MANAGER.js['dayjs'].name,
    ],
    language: LANGUAGE_INFO[LANGUAGE_NAME["payment-success-language"]],

    robots_meta_tag: {
      index: false,
      follow: true,
    },
  },

  // NOTE - login
  [ROUTER_NAME["login-page"]]: {
    name: ROUTER_NAME["login-page"],
    path: ROUTER_PATH[ROUTER_NAME["login-page"]],
    component_path: _generateComponentPath(ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["login-v4-page"]]),
    component: () => (ROUTER_VIEW_COMPONENT_LIST.TheLoginV4Page || null),

    permisson: {
      valid: function () {
        const token = localStorage.getItem("token");

        return !token;
      },
      redirect: getHomePath(),
    },
    css: [EXTERNAL_LIB_MANAGER.css["element-ui"].name],
    js: [
      EXTERNAL_LIB_MANAGER.js["md5"].name,
      EXTERNAL_LIB_MANAGER.js["element-ui"].name,
      EXTERNAL_LIB_MANAGER.js["vue-google-login"].name,
      EXTERNAL_LIB_MANAGER.js["vue-facebook-signin-button"].name,
      EXTERNAL_LIB_MANAGER.js["vuelidate"].name,
      EXTERNAL_LIB_MANAGER.js["validators"].name,
    ],
    redirect_list: [
      ROUTER_NAME["hotel-detail-page"],
      ROUTER_NAME["room-detail-page"],
      ROUTER_NAME["category-page"],
      ROUTER_NAME["payment"],
      ROUTER_NAME["payment-v4-page"],
      ROUTER_NAME["promotion-page"],
    ],
    language: LANGUAGE_INFO[LANGUAGE_NAME["the-sign-in-language"]],

    has_meta_tag: true,

    robots_meta_tag: {
      index: false,
      follow: true,
    },
  },

  // NOTE - account
  [ROUTER_NAME["account-page"]]: {
    name: ROUTER_NAME["account-page"],
    path: ROUTER_PATH[ROUTER_NAME["account-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["account-page"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.TheAccountPage || null,
    css: [],
    js: [],
    permisson: {
      valid: function () {
        const token = localStorage.getItem("token");
        return !!token;
      },
      redirect: getHomePath(),
    },
    language: LANGUAGE_INFO[LANGUAGE_NAME["the-account-language"]],

    robots_meta_tag: {
      index: false,
      follow: true,
    },
  },

  // NOTE - sign-up
  [ROUTER_NAME["sign-up-page"]]: {
    name: ROUTER_NAME["sign-up-page"],
    path: ROUTER_PATH[ROUTER_NAME["sign-up-page"]],
    component_path: _generateComponentPath(ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["sign-up-v4-page"]]),
    component: () => (ROUTER_VIEW_COMPONENT_LIST.TheSignUpV4Page || null),
    permisson: {
      valid: function () {
        const token = localStorage.getItem("token");

        return !token;
      },
      redirect: getHomePath(),
    },
    css: [EXTERNAL_LIB_MANAGER.css["element-ui"].name],
    js: [
      EXTERNAL_LIB_MANAGER.js["md5"].name,
      EXTERNAL_LIB_MANAGER.js["vue-google-login"].name,
      EXTERNAL_LIB_MANAGER.js["vue-facebook-signin-button"].name,
      EXTERNAL_LIB_MANAGER.js["vuelidate"].name,
      EXTERNAL_LIB_MANAGER.js["validators"].name,
      EXTERNAL_LIB_MANAGER.js["element-ui"].name,
    ],
    redirect_list: [
      ROUTER_NAME["hotel-detail-page"],
      ROUTER_NAME["room-detail-page"],
      ROUTER_NAME["category-page"],
      ROUTER_NAME["payment"],
    ],
    language: LANGUAGE_INFO[LANGUAGE_NAME["the-sign-up-language"]],

    has_meta_tag: true,

    robots_meta_tag: {
      index: false,
      follow: true,
    },
  },

  // NOTE - forget-password
  [ROUTER_NAME["forget-password-page"]]: {
    name: ROUTER_NAME["forget-password-page"],
    path: ROUTER_PATH[ROUTER_NAME["forget-password-page"]],
    component_path: _generateComponentPath(ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["forget-password-v4-page"]]),
    component: () => (ROUTER_VIEW_COMPONENT_LIST.TheForgetPasswordV4Page || null),
    permisson: {
      valid: function () {
        const token = localStorage.getItem("token");

        return !token;
      },
      redirect: getHomePath(),
    },
    css: [EXTERNAL_LIB_MANAGER.css["element-ui"].name],
    js: [
      EXTERNAL_LIB_MANAGER.js["md5"].name,
      EXTERNAL_LIB_MANAGER.js["element-ui"].name,
      EXTERNAL_LIB_MANAGER.js["vue-google-login"].name,
      EXTERNAL_LIB_MANAGER.js["vue-facebook-signin-button"].name,
      EXTERNAL_LIB_MANAGER.js["vuelidate"].name,
      EXTERNAL_LIB_MANAGER.js["validators"].name,
    ],
    language: LANGUAGE_INFO[LANGUAGE_NAME["the-forget-password-language"]],

    has_meta_tag: true,

    robots_meta_tag: {
      index: false,
      follow: true,
    },
  },

  // NOTE - stamp
  [ROUTER_NAME["stamp-page"]]: {
    name: ROUTER_NAME["stamp-page"],
    path: ROUTER_PATH[ROUTER_NAME["stamp-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["stamp-page"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.TheStampPage || null,
    css: [],
    js: [EXTERNAL_LIB_MANAGER.js["vue-observe-visibility"].name],

    has_meta_tag: true,

    robots_meta_tag: {
      index: false,
      follow: true,
    },
  },

  // NOTE - stamp detail
  [ROUTER_NAME["stamp-detail-page"]]: {
    name: ROUTER_NAME["stamp-detail-page"],
    path: ROUTER_PATH[ROUTER_NAME["stamp-detail-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["stamp-detail-page"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.TheStampDetailPage || null,

    has_meta_tag: true,

    robots_meta_tag: {
      index: false,
      follow: true,
    },
  },

  // NOTE - point
  [ROUTER_NAME["point-page"]]: {
    name: ROUTER_NAME["point-page"],
    path: ROUTER_PATH[ROUTER_NAME["point-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["point-page"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.ThePointPage || null,

    permisson: {
      valid: function () {
        const token = localStorage.getItem("token");

        return !!token;
      },
      redirect: getHomePath(),
    },

    has_meta_tag: true,

    robots_meta_tag: {
      index: false,
      follow: true,
    },
  },

  // NOTE - booking
  [ROUTER_NAME["booking-page"]]: {
    name: ROUTER_NAME["booking-page"],
    path: ROUTER_PATH[ROUTER_NAME["booking-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["booking-page"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.TheBookingPage || null,
    css: [],
    js: [EXTERNAL_LIB_MANAGER.js["vue-observe-visibility"].name],
    language: LANGUAGE_INFO[LANGUAGE_NAME["the-booking-language"]],

    has_meta_tag: true,

    robots_meta_tag: {
      index: false,
      follow: true,
    },
  },

  // NOTE - booking detail
  [ROUTER_NAME["booking-detail-page"]]: {
    name: ROUTER_NAME["booking-detail-page"],
    path: ROUTER_PATH[ROUTER_NAME["booking-detail-page"]],
    component_path: _generateComponentPath(
      // ONLY_DEV ?
        // ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["booking-detail-v4-page"]] :
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["booking-detail-page"]]
    ),
    // component: () => (ONLY_DEV ? ROUTER_VIEW_COMPONENT_LIST.TheBookingDetailV4Page : (ROUTER_VIEW_COMPONENT_LIST.TheBookingDetailPage || null)),
    component: () => (ROUTER_VIEW_COMPONENT_LIST.TheBookingDetailPage || null),
    language: LANGUAGE_INFO[LANGUAGE_NAME["the-booking-detail-language"]],

    has_meta_tag: true,

    robots_meta_tag: {
      index: false,
      follow: true,
    },
  },

  // NOTE - coupon
  [ROUTER_NAME["coupon-page"]]: {
    name: ROUTER_NAME["coupon-page"],
    path: ROUTER_PATH[ROUTER_NAME["coupon-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["coupon-page"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.TheCouponPage || null,
    css: [],
    js: [EXTERNAL_LIB_MANAGER.js["vue-observe-visibility"].name, EXTERNAL_LIB_MANAGER.js["vue-content-loading"].name],

    permisson: {
      valid: function () {
        const token = localStorage.getItem("token");

        return !!token;
      },
      redirect: getHomePath(),
    },

    has_meta_tag: true,

    robots_meta_tag: {
      index: false,
      follow: true,
    },
  },

  //NOTE - linked page
    [ROUTER_NAME["linked-page"]]: {
    name: ROUTER_NAME["linked-page"],
    path: ROUTER_PATH[ROUTER_NAME["linked-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["linked-page"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.TheLinkedPage || null,
    css: [],
    js: [
      EXTERNAL_LIB_MANAGER.js["vue-google-login"].name,
      EXTERNAL_LIB_MANAGER.js["vue-facebook-signin-button"].name,
    ],

    // permisson: {
    //   valid: function () {
    //     const token = localStorage.getItem("token");
    //     return !!token;
    //   },
    //   redirect: getHomePath(),
    // },

    has_meta_tag: true,

    robots_meta_tag: {
      index: false,
      follow: true,
    },
  },

  // NOTE - Category page [ delete ]
  [ROUTER_NAME["category-page"]]: {
    name: ROUTER_NAME["category-page"],
    path: ROUTER_PATH[ROUTER_NAME["category-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["category-page"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.TheCategoryPage || null,
    language: LANGUAGE_INFO[LANGUAGE_NAME["category-language"]],

    history: {
      enable: true,
      max: 3,
    },
  },

  // NOTE - Contact page [ delete ]
  [ROUTER_NAME["contact-page"]]: {
    name: ROUTER_NAME["contact-page"],
    path: ROUTER_PATH[ROUTER_NAME["contact-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["contact-page"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.TheContactPage || null,
  },

  // NOTE - promotion-page
  [ROUTER_NAME["promotion-page"]]: {
    name: ROUTER_NAME["promotion-page"],
    path: ROUTER_PATH[ROUTER_NAME["promotion-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["promotion-page"]]
    ),
    history_step: true,
    component: () => ROUTER_VIEW_COMPONENT_LIST.ThePromotionPage || null,
    js: [EXTERNAL_LIB_MANAGER.js["vue-content-loading"].name],
    language: LANGUAGE_INFO[LANGUAGE_NAME["the-promotion-language"]],

    has_meta_tag: true,

    robots_meta_tag: {
      index: true,
      follow: true,
    },
  },

  // NOTE - detail-promotion-page
  [ROUTER_NAME["detail-promotion-page"]]: {
    name: ROUTER_NAME["detail-promotion-page"],
    path: ROUTER_PATH[ROUTER_NAME["detail-promotion-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["detail-promotion-page"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.TheDetailPromotionPage || null,
    js: [EXTERNAL_LIB_MANAGER.js["vue-content-loading"].name],
    language: LANGUAGE_INFO[LANGUAGE_NAME["the-promotion-language"]],

    has_meta_tag: true,

    robots_meta_tag: {
      index: false,
      follow: true,
    },
  },

  // NOTE - hotel-detail-page
  [ROUTER_NAME["hotel-detail-page"]]: {
    name: ROUTER_NAME["hotel-detail-page"],
    path: ROUTER_PATH[ROUTER_NAME["hotel-detail-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["hotel-detail-v4-page"]]
    ),
    component: () => (ROUTER_VIEW_COMPONENT_LIST.TheHotelDetailV4Page || null),
    language: LANGUAGE_INFO[LANGUAGE_NAME["the-hotel-detail-language"]],
    css: [EXTERNAL_LIB_MANAGER.css["swiper-slider"].name],

    js: [
      EXTERNAL_LIB_MANAGER.js["swiper-slider"].name,
      EXTERNAL_LIB_MANAGER.js["vuelidate"].name,
      EXTERNAL_LIB_MANAGER.js["validators"].name,
      EXTERNAL_LIB_MANAGER.js["InfiniteLoading"].name,
      EXTERNAL_LIB_MANAGER.js["vue-content-loading"].name,
    ],

    history_step: true,

    tracking: {
      firebase: [],

      dable: [],
    },

    has_meta_tag: true,

    robots_meta_tag: {
      index: true,
      follow: true,
    },
  },

  // NOTE - search page [ delete ]
  [ROUTER_NAME["search-page"]]: {
    name: ROUTER_NAME["search-page"],
    path: ROUTER_PATH[ROUTER_NAME["search-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["search-page"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.SearchPage || null,
    language: LANGUAGE_INFO[LANGUAGE_NAME["search-language"]],
  },

  // NOTE - map page [ delete ]
  [ROUTER_NAME["maps-page"]]: {
    name: ROUTER_NAME["maps-page"],
    path: ROUTER_PATH[ROUTER_NAME["maps-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["maps-page"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.TheMapsPage || null,

    js: [EXTERNAL_LIB_MANAGER.js["vue2-google-maps"].name],
  },

  // NOTE - room detail page
  [ROUTER_NAME["room-detail-page"]]: {
    name: ROUTER_NAME["room-detail-page"],
    path: ROUTER_PATH[ROUTER_NAME["room-detail-page"]],

    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["room-detail-v4-page"]]
    ),
    component: () => (ROUTER_VIEW_COMPONENT_LIST.TheRoomDetailV4Page || null),

    language: LANGUAGE_INFO[LANGUAGE_NAME["room-language"]],
    css: [EXTERNAL_LIB_MANAGER.css["swiper-slider"].name],

    js: [
      EXTERNAL_LIB_MANAGER.js["swiper-slider"].name,
      EXTERNAL_LIB_MANAGER.js["element-ui"].name,
      EXTERNAL_LIB_MANAGER.js["vuelidate"].name,
      EXTERNAL_LIB_MANAGER.js["validators"].name,
    ],

    history_step: true,

    robots_meta_tag: {
      index: false,
      follow: true,
    },
  },


  // NOTE - vision-page [ long time no use ]
  [ROUTER_NAME["vision-page"]]: {
    name: ROUTER_NAME["vision-page"],
    path: ROUTER_PATH[ROUTER_NAME["vision-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["vision-page"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.TheVisionPage || null,
    language: LANGUAGE_INFO[LANGUAGE_NAME["the-vision-page-language"]],
  },

  // NOTE - profile-page
  [ROUTER_NAME["profile-page"]]: {
    name: ROUTER_NAME["profile-page"],
    path: ROUTER_PATH[ROUTER_NAME["profile-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["profile-page"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.TheProfilePage || null,
    css: [EXTERNAL_LIB_MANAGER.css["element-ui"].name],
    js: [
      EXTERNAL_LIB_MANAGER.js["md5"].name,
      EXTERNAL_LIB_MANAGER.js["i18n-element-ui"].name,
      EXTERNAL_LIB_MANAGER.js["dayjs"].name,
      EXTERNAL_LIB_MANAGER.js["element-ui"].name,
      EXTERNAL_LIB_MANAGER.js["language-en-element-ui"].name,
    ],
    language: LANGUAGE_INFO[LANGUAGE_NAME["the-profile-language"]],

    has_meta_tag: true,

    robots_meta_tag: {
      index: false,
      follow: true,
    },
  },

  // NOTE - about-us-page
  [ROUTER_NAME["about-us-page"]]: {
    name: ROUTER_NAME["about-us-page"],
    path: ROUTER_PATH[ROUTER_NAME["about-us-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["about-us-page"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.TheAboutUsPage || null,
    language: LANGUAGE_INFO[LANGUAGE_NAME["about-us-language"]],

    robots_meta_tag: {
      index: false,
      follow: true,
    },
  },

  // NOTE - term-condition-page
  [ROUTER_NAME["term-condition-page"]]: {
    name: ROUTER_NAME["term-condition-page"],
    path: ROUTER_PATH[ROUTER_NAME["term-condition-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["term-condition-page"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.TheTermConditionPage || null,
    language: LANGUAGE_INFO[LANGUAGE_NAME["the-term-condition-language"]],

    robots_meta_tag: {
      index: false,
      follow: true,
    },
  },

   // NOTE - payment-v4-page
  [ROUTER_NAME["payment-v4-page"]]: {
    name: ROUTER_NAME["payment-v4-page"],
    path: ROUTER_PATH[ROUTER_NAME["payment-v4-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["payment-v4-page"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.ThePaymentV4Page || null,
    language: LANGUAGE_INFO[LANGUAGE_NAME["the-payment-v4-language"]],
    js: [
      EXTERNAL_LIB_MANAGER.js["payment-script"].name, EXTERNAL_LIB_MANAGER.js["jquery"].name,
      EXTERNAL_LIB_MANAGER.js["vuelidate"].name,
      EXTERNAL_LIB_MANAGER.js["validators"].name,
      EXTERNAL_LIB_MANAGER.js["vue-content-loading"].name,
    ],
    history_step: true,

    has_meta_tag: true,

    robots_meta_tag: {
      index: false,
      follow: true,
    },
  },

  // NOTE - not-found-page
  [ROUTER_NAME["not-found-page"]]: {
    name: ROUTER_NAME["not-found-page"],
    path: ROUTER_PATH[ROUTER_NAME["not-found-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["not-found-page"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.TheNotFoundPage || null,

    robots_meta_tag: {
      index: false,
      follow: true,
    },
  },

  // NOTE - payoo-page
  [ROUTER_NAME["payoo-page"]]: {
    name: ROUTER_NAME["payoo-page"],
    path: ROUTER_PATH[ROUTER_NAME["payoo-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["payoo-page"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.ThePayooPage || null,
    no_style: true,
    js: [EXTERNAL_LIB_MANAGER.js["dayjs"].name],
    language: LANGUAGE_INFO[LANGUAGE_NAME["payoo-language"]],
  },

  [ROUTER_NAME["hotel-list-v4-page"]]: {
    name: ROUTER_NAME["hotel-list-v4-page"],
    path: ROUTER_PATH[ROUTER_NAME["hotel-list-v4-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["hotel-list-v4-page"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.TheHotelListv4Page || null,

    css: [
      EXTERNAL_LIB_MANAGER.css["swiper-slider"].name,
      EXTERNAL_LIB_MANAGER.css["vue-slider-component"].name
    ],

    js: [
      EXTERNAL_LIB_MANAGER.js["dayjs"].name,
      EXTERNAL_LIB_MANAGER.js["swiper-slider"].name,
      EXTERNAL_LIB_MANAGER.js["vue-slider-component"].name,
      EXTERNAL_LIB_MANAGER.js["vue-infinite-loading"].name,
    ],

    has_meta_tag: true,

    robots_meta_tag: {
      index: true,
      follow: true,
    },
  },
};

if (ENV === ARR_ENV.development) {
  window.RouterName = ROUTER_NAME;
  window.RouterComponentFileName = ROUTER_COMPONENT_FILE_NAME;
  window.RouterInfo = ROUTER_INFO;
}

export { ROUTER_NAME, ROUTER_PATH, ROUTER_INFO, ROUTER_VIEW_COMPONENT_LIST };
