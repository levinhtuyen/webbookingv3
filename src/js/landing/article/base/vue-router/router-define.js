const BASE_PATH = "/";

// NOTE - Định nghĩa danh sách tên của router (chú ý: tên của router nên là tên của component router_view đó hoặc là kiểu snack của component name.)
// NOTE - VD: component có name: TheHomePage / HomePage / home-page thì router name sẽ đặt là "home-page", nên đặt cùng ý nghĩa, vì sẽ có những trường hợp cần so sánh router name và component name để thực hiện một action nào đó
const ROUTER_NAME = {
  'article-page': 'article-page',
  'article-detail-page': 'article-detail-page',
  'article-category-page': 'article-category-page',
  'not-found-page': 'not-found-page',
};

// NOTE - Định nghĩa danh sách path của router, hiện tại home-page sẽ là path default "/", tức là BASE_PATH. đặt tên cho path không cần phải giống với router name (VD: router_name: list-task-page)
const ROUTER_PATH = {
  [ROUTER_NAME["article-page"]]: BASE_PATH + 'article',
  [ROUTER_NAME["article-detail-page"]]: BASE_PATH + 'article/:title',
  [ROUTER_NAME["article-category-page"]]: BASE_PATH + 'article-category/:categoryName',

    // NOTE - not found page
    [ROUTER_NAME['not-found-page']]: BASE_PATH + '404-not-found',
};

export {
  ROUTER_NAME,
  ROUTER_PATH
};
