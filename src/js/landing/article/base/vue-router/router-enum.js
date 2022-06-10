import {
  JS_URL,
  CACHE_VERSION,

  // NOTE - 'development', 'staging', 'production'
  ENV,
  ARR_ENV,

  // NOTE - 'normal', 'uat'
  IS_UAT,
} from "~jsDefinePath/general";
import { ROUTER_NAME, ROUTER_PATH } from "./router-define";
import {
  EXTERNAL_LIB_MANAGER,
} from '~jsLibPath/external-lib-manager';
import { getHomePath } from "~jsHelperPath/util/HandleUrl";

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
  TheArticlePage: null,
  TheArticleDetailPage: null,
  TheArticleCategoryPage: null,
};

// NOTE - Định nghĩa object router_view

window.router_view = ROUTER_VIEW_COMPONENT_LIST;

// NOTE - Định nghĩa danh sách component file name cho từng router, vì những file này đã được tách ra khỏi app.js file (tối ưu dung lượng các resource onpage loading - không cho phép 1 resource có dung lượng từ 200kb được onpage loading) nên cần được định nghĩa vào đây thay vì import trực tiếp vào, khi router được kích hoạt sẽ có phần tiền xử lý để kiểm tra router đã được đăng ký hay chưa để append tài nguyên của router đó vào
const ROUTER_COMPONENT_FILE_NAME = {
  [ROUTER_NAME["article-page"]]: 'the-article-page.js',
  [ROUTER_NAME["article-detail-page"]]: 'the-article-detail-page.js',
  [ROUTER_NAME["article-category-page"]]: 'the-article-category-page.js',
    //NOTE - not-found-page
    [ROUTER_NAME["not-found-page"]]: "the-not-found-page.js",

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
 * }
 */
const ROUTER_INFO = {
  // NOTE - article page
  [ROUTER_NAME["article-page"]]: {
    name: ROUTER_NAME["article-page"],
    path: ROUTER_PATH[ROUTER_NAME["article-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["article-page"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.TheArticlePage || null,
    // permisson: {
    //   valid: function () {
    //     return ENABLE_UAT;
    //   },
    //   redirect: getHomePath(),
    // },
    css: [EXTERNAL_LIB_MANAGER.css["swiper-slider"].name],

    js: [
      EXTERNAL_LIB_MANAGER.js["swiper-slider"].name,
    ],

    has_meta_tag: true,

    robots_meta_tag: {
      index: true,
      follow: true,
    },
  },

  // NOTE - article detail page
  [ROUTER_NAME["article-detail-page"]]: {
    name: ROUTER_NAME["article-detail-page"],
    path: ROUTER_PATH[ROUTER_NAME["article-detail-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["article-detail-page"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.TheArticleDetailPage || null,
    // permisson: {
    //   valid: function () {
    //     return ENABLE_UAT;
    //   },
    //   redirect: getHomePath(),
    // },
    css: [EXTERNAL_LIB_MANAGER.css["swiper-slider"].name],
    js: [
      EXTERNAL_LIB_MANAGER.js["swiper-slider"].name,
    ],

    has_meta_tag: true,

    robots_meta_tag: {
      index: true,
      follow: true,
    },
  },

  // NOTE - article category page
  [ROUTER_NAME["article-category-page"]]: {
    name: ROUTER_NAME["article-category-page"],
    path: ROUTER_PATH[ROUTER_NAME["article-category-page"]],
    component_path: _generateComponentPath(
      ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME["article-category-page"]]
    ),
    component: () => ROUTER_VIEW_COMPONENT_LIST.TheArticleCategoryPage || null,
    // css: [EXTERNAL_LIB_MANAGER.css["swiper-slider"].name],
    // permisson: {
    //   valid: function () {
    //     return ENABLE_UAT;
    //   },
    //   redirect: getHomePath(),
    // },
    js: [
      EXTERNAL_LIB_MANAGER.js["vue-infinite-loading"].name,
    ],

    robots_meta_tag: {
      index: true,
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
};

if (ENV === ARR_ENV.development) {
  window.RouterName = ROUTER_NAME;
  window.RouterComponentFileName = ROUTER_COMPONENT_FILE_NAME;
  window.RouterInfo = ROUTER_INFO;
}

export {
  ROUTER_NAME,
  ROUTER_PATH,
  ROUTER_INFO,
  ROUTER_VIEW_COMPONENT_LIST
};
