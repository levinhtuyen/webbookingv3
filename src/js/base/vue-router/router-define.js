const BASE_PATH = "/:language?/";

// NOTE - Định nghĩa danh sách tên của router (chú ý: tên của router nên là tên của component router_view đó hoặc là kiểu snack của component name.)
// NOTE - VD: component có name: TheHomePage / HomePage / home-page thì router name sẽ đặt là "home-page", nên đặt cùng ý nghĩa, vì sẽ có những trường hợp cần so sánh router name và component name để thực hiện một action nào đó
const ROUTER_NAME = {
  'home-page': 'home-page',
  'home-v4-page': 'home-v4-page',
  'list-task-page': 'list-task-page',
  'list-task-detail': 'list-task-detail',
  // 'payment': 'payment',
  // 'payment-detail': 'payment-detail',
  'payment-success': "payment-success",
  'hotel-display': 'hotel-display',
  'common-hotel-display-page': 'common-hotel-display-page',
  'login-page': 'login-page',
  'login-v4-page': 'login-v4-page',
  'account-page': 'account-page',
  'linked-page': 'linked-page',
  'sign-up-page': 'sign-up-page',
  'sign-up-v4-page': 'sign-up-v4-page',
  'forget-password-page': 'forget-password-page',
  'forget-password-v4-page': 'forget-password-v4-page',
  'stamp-page': 'stamp-page',
  'stamp-detail-page': 'stamp-detail-page',
  'point-page': 'point-page',
  'booking-page': 'booking-page',
  'booking-detail-page': 'booking-detail-page',
  'booking-detail-v4-page': 'booking-detail-v4-page',
  'coupon-page': 'coupon-page',
  //=================== Group ==================>
  'category-page': 'category-page',
  //================= end Group ================>
  'contact-page': 'contact-page',
  'promotion-page': 'promotion-page',
  'detail-promotion-page': 'detail-promotion-page',
  'hotel-detail-page': 'hotel-detail-page',
  'hotel-detail-v4-page': 'hotel-detail-v4-page',

  'comment-page': 'comment-page',
  'search-page': 'search-page',
  'maps-page': 'maps-page',
  'room-detail-page': 'room-detail-page',
  'list-landing-page': 'list-landing-page',
  'vision-page': 'vision-page',
  'blog-list-page': 'blog-list-page',
  'blog-detail-page': 'blog-detail-page',
  'profile-page': 'profile-page',
  'term-condition-page': 'term-condition-page',
  'payment-v4-page': 'payment-v4-page',
  'about-us-page': 'about-us-page',
  'not-found-page': 'not-found-page',
  'payoo-page': 'payoo-page',
  'hotel-list-v4-page': 'hotel-list-v4-page',
};

// NOTE - Định nghĩa danh sách path của router, hiện tại home-page sẽ là path default "/", tức là BASE_PATH. đặt tên cho path không cần phải giống với router name (VD: router_name: list-task-page)
const ROUTER_PATH = {
  // NOTE - home page group
  [ROUTER_NAME["home-page"]]: BASE_PATH,

  // NOTE - list task group
  [ROUTER_NAME['list-task-page']]: BASE_PATH + 'list-task',
  [ROUTER_NAME['list-task-detail']]: BASE_PATH + 'list-task/:id',
  [ROUTER_NAME['category-page']]: BASE_PATH + 'hotelcategory/:categoryName',
  [ROUTER_NAME['contact-page']]: BASE_PATH + 'contact',

  // NOTE - promotion-page
  [ROUTER_NAME['promotion-page']]: BASE_PATH + 'promotionlist',

  // NOTE - detail-promotion-page
  [ROUTER_NAME['detail-promotion-page']]: BASE_PATH + 'promotionlist/:promotionName',
  // NOTE - hotel-detail
  [ROUTER_NAME["hotel-detail-page"]]: BASE_PATH + "hoteldetail/:hotelName",
  // NOTE - hotel-detail-v4
  [ROUTER_NAME["hotel-detail-v4-page"]]: BASE_PATH + "hoteldetailv4",
  // NOTE - room-detail
  [ROUTER_NAME['room-detail-page']]: BASE_PATH + 'hoteldetail/:hotelName/:roomName',
  [ROUTER_NAME['comment-page']]: BASE_PATH + 'comment/:hotelSn',
  [ROUTER_NAME['maps-page']]: BASE_PATH + 'maps',

  // NOTE - payment
  // [ROUTER_NAME["payment"]]: BASE_PATH + "payment/:hotelName?/:roomName?",

  // NOTE - payment detail
  // [ROUTER_NAME['payment-detail']]: BASE_PATH + 'payment-detail/:hotelName?/:roomName?/:stay?',
  // NOTE - payment success
  [ROUTER_NAME['payment-success']]: BASE_PATH + 'payment-success/:bookingNo',

  // NOTE - hotel display group
  [ROUTER_NAME["hotel-display"]]: BASE_PATH + "hotel-display",
  [ROUTER_NAME["common-hotel-display-page"]]:
    BASE_PATH + "common-hotel-display/:type",

  // NOTE - login
  [ROUTER_NAME["login-page"]]: BASE_PATH + "login",

  // NOTE - account
  [ROUTER_NAME["account-page"]]: BASE_PATH + "account",

    // NOTE - linked
  [ROUTER_NAME["linked-page"]]: BASE_PATH + "linked",

  // NOTE - sign-up
  [ROUTER_NAME["sign-up-page"]]: BASE_PATH + "sign-up",

  // NOTE - forget-password
  [ROUTER_NAME["forget-password-page"]]: BASE_PATH + "forget-password",

  // NOTE - stamp
  [ROUTER_NAME["stamp-page"]]: BASE_PATH + "stamp",

  // NOTE - stamp detail
  [ROUTER_NAME["stamp-detail-page"]]: BASE_PATH + "stamp-detail/:id",

  // NOTE - point
  [ROUTER_NAME["point-page"]]: BASE_PATH + "point",

  // NOTE - booking
  [ROUTER_NAME["booking-page"]]: BASE_PATH + "booking",

  // NOTE - booking detail
  [ROUTER_NAME["booking-detail-page"]]: BASE_PATH + "booking-detail/:id",

  // NOTE - coupon
  [ROUTER_NAME['coupon-page']]: BASE_PATH + 'coupon',

  // NOTE - Search page
  [ROUTER_NAME['search-page']]: BASE_PATH + 'search',

  // NOTE - blog-list-page
  [ROUTER_NAME['blog-list-page']]: BASE_PATH + 'bloglist/:query?',

  // NOTE - blog-detail
  [ROUTER_NAME['blog-detail-page']]: BASE_PATH + 'blog/:blogName',

  // NOTE - vision-page
  [ROUTER_NAME['vision-page']]: BASE_PATH + 'vision',

  // NOTE - profile-page
  [ROUTER_NAME['profile-page']]: BASE_PATH + 'profile',

  // NOTE - about-us-page
  [ROUTER_NAME['about-us-page']]: BASE_PATH + 'about-us',

  // NOTE - term-condition-page
  [ROUTER_NAME['term-condition-page']]: BASE_PATH + 'term-condition',

  // NOTE - payment-v4-page
  [ROUTER_NAME['payment-v4-page']]: BASE_PATH + 'payment-v4/:step?',

  // NOTE - not found page
  [ROUTER_NAME['not-found-page']]: BASE_PATH + '404-not-found',

  // NOTE - payoo page
  [ROUTER_NAME['payoo-page']]: BASE_PATH + 'payoo-page',

  // NOTE - hotel list page
  [ROUTER_NAME['hotel-list-v4-page']]: BASE_PATH + 'hotellist/:categoryName/:subCategoryName?',
};

export {
  ROUTER_NAME,
  ROUTER_PATH
};
