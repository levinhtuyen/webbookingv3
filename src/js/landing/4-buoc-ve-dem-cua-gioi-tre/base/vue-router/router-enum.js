import {
  JS_URL,
  CACHE_VERSION
} from '~jsDefinePath/general';

const _generateComponentPath = (strFileName) => {
  return JS_URL + strFileName + '?v=' + CACHE_VERSION;
}; // _generateComponentPath()

// NOTE - Xây dựng tham chiếu đến window.router_view_component_list
const ROUTER_VIEW_COMPONENT_LIST = {
  TheStyleGuidePage: null,
  TheG2YRatingStarPage: null,
};

// NOTE - Định nghĩa object router_view_components
window.router_view_component_list = ROUTER_VIEW_COMPONENT_LIST;

const BASE_PATH = '/style-guide/';

// NOTE - Định nghĩa danh sách tên của router (chú ý: tên của router nên là tên của component router_view đó hoặc là kiểu snack của component name.)
// NOTE - VD: component có name: TheHomePage / HomePage / home-page thì router name sẽ đặt là "home-page", nên đặt cùng ý nghĩa, vì sẽ có những trường hợp cần so sánh router name và component name để thực hiện một action nào đó
const ROUTER_NAME = {
  'style-guide': 'style-guide',
  'g2y-rating-star-page': 'g2y-rating-star-page',
};

// NOTE - Định nghĩa danh sách path của router, hiện tại home-page sẽ là path default "/", tức là BASE_PATH. đặt tên cho path không cần phải giống với router name (VD: router_name: list-task-page)
const ROUTER_PATH = {
  [ROUTER_NAME['style-guide']]: BASE_PATH,
  [ROUTER_NAME['g2y-rating-star-page']]: BASE_PATH + 'rating-star',
};

// NOTE - Định nghĩa danh sách component file name cho từng router, vì những file này đã được tách ra khỏi app.js file (tối ưu dung lượng các resource onpage loading - không cho phép 1 resource có dung lượng từ 200kb được onpage loading) nên cần được định nghĩa vào đây thay vì import trực tiếp vào, khi router được kích hoạt sẽ có phần tiền xử lý để kiểm tra router đã được đăng ký hay chưa để append tài nguyên của router đó vào
const ROUTER_COMPONENT_FILE_NAME = {
  [ROUTER_NAME['style-guide']]: 'the-style-guide-page.js',
  [ROUTER_NAME['g2y-rating-star-page']]: 'the-g2y-rating-star-page.js',
};

// NOTE - Định nghĩa danh sách toàn bộ thông tin của mỗi router, bao gồm (name: ..., path: ..., component_path: ..., component: ...,)
const ROUTER_INFO = {
  [ROUTER_NAME['style-guide']]: {
    name: ROUTER_NAME['style-guide'],
    path: ROUTER_PATH[ROUTER_NAME['style-guide']],
    component_path: _generateComponentPath(ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME['style-guide']]),
    component: () => (ROUTER_VIEW_COMPONENT_LIST.TheStyleGuidePage || null),
  },

  [ROUTER_NAME['g2y-rating-star-page']]: {
    name: ROUTER_NAME['g2y-rating-star-page'],
    path: ROUTER_PATH[ROUTER_NAME['g2y-rating-star-page']],
    component_path: _generateComponentPath(ROUTER_COMPONENT_FILE_NAME[ROUTER_NAME['g2y-rating-star-page']]),
    component: () => (ROUTER_VIEW_COMPONENT_LIST.TheG2YRatingStarPage || null),
  },
};

export {
  ROUTER_NAME,
  ROUTER_PATH,
  ROUTER_INFO,
  ROUTER_VIEW_COMPONENT_LIST,
};
