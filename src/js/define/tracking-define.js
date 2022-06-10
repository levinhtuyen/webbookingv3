// NOTE - Firebase tracking
const FIREBASE_TRACKING = {
  TRACKING_SEARCH: 'trackingSearch',
  TRACKING_GOOGLE_PLAY_DOWNLOAD: 'trackingGooglePlayDownload',
  TRACKING_APPLE_STORE_DOWNLOAD: 'trackingAppleStoreDownload',
  TRACKING_DETAIL_HOTEL: 'trackingDetailHotel',
  TRACKING_REVIEW_HOTEL: 'trackingReviewHotel',
  TRACKING_LOCATION_HOTEL: 'trackingLocationHotel',
  TRACKING_BOOK_NOW_DETAIL_HOTEL: 'trackingBookNowDetailHotel',
  TRACKING_PREFIX: 'tracking',
  TRACKING_PROMOTION_HOME: 'trackingPromotionHome',
  TRACKING_HOT_REVIEW: 'trackingHotReview',
  TRACKING_VISIT_HOME_PAGE: 'trackingVisitHomePage',
  TRACKING_FILTER: 'trackingFilter',
  TRACKING_NEAR_YOU: 'trackingNearYou',
  TRACKING_ADDRESS: 'trackingAddress',
  TRACKING_FLASH_SALE: 'trackingFlashSale',
  TRACKING_PROMOTION_DETAIL: 'trackingPromotionItem'
};

// NOTE - Dablena tracking
const DABLE_TRACKING = {
  TRACKING_VISIT_HOME_PAGE: 'HomePage',
  TRACKING_SEARCH: 'Search',
  TRACKING_VIEW_BOOK_NOW: 'Book_now',
  TRACKING_VIEW_SPECICAL_PRODUCTS: "Special_products",
  TRACKING_VIEW_BOOK_HOURLY: "Book_hourly",
  TRACKING_VIEW_BOOK_OVERNIGHT: "Book_overnight",
  TRACKING_VIEW_BOOK_DAILY: "Book_daily",
  TRACKING_REGISTER_PHONE_NUMBER:'PhoneNumber',
  TRACKING_VIEW_PROMOTION:'view_promotion',
  TRACKING_APPLY_NOW_PROMOTION: "apply_promotion", // item promotion and detail promotion
  TRACKING_VIEW_CHOOSE_LOCATION: 'choose_location', // home page location click open modal
  TRACKING_VIEW_CHOOSE_PROVINCE:  'choose_province', // choose province in location modal
  TRACKING_VIEW_DOWNLOAD_IOS: 'download_IOS',
  TRACKING_VIEW_DOWNLOAD_ANDROID: 'download_ANDROID',
  TRACKING_CLICK_ICON_CHOOSE_LOCATION: 'Choose_',
  TRACKING_SEE_ALL_PREFIX: 'See_',
  TRACKING_VIEW_FACEBOOK_PAGE: 'View_FacebookPage',
  TRACKING_VIEW_YOUTUBE_CHANNEL: 'View_YoutubeChannel',
  TRACKING_CONTACT_US: 'ContactUs',
};

// NOTE - Adjust tracking
const ADJUST_TRACKING = {
  TRACKING_SIGNUP: 'tnmx0k',
};

export {
  FIREBASE_TRACKING,
  DABLE_TRACKING,
  ADJUST_TRACKING,
};
