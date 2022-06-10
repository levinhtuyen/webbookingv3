import {
  PAGE_INFO,
  LANGUAGE_URL
} from './general';

const LANGUAGE_NAME = {
  'the-home-language'             : 'the-home-language',
  'the-promotion-language'        : 'the-promotion-language',
  'the-blog-list-language'        : 'the-blog-list-language',
  'the-blog-detail-language'      : 'the-blog-detail-language',
  'the-promotion-detail-language' : 'the-promotion-detail-language',
  'the-list-landingpage-language' : 'the-list-landingpage-language',
  'the-comment-language'          : 'the-comment-language',
  'the-hotel-detail-language'     : 'the-hotel-detail-language',
  'the-payment-v4-language'        : 'the-payment-v4-language',
  'payment-language'              : 'payment-language',
  'payment-detail-language'       : 'payment-detail-language',
  'payment-success-language'      : 'payment-success-language',
  'category-language'             : 'category-language',
  'search-language'               : 'search-language',
  "room-language"                 : "room-language",
  'the-profile-language'          : 'the-profile-language',
  'about-us-language'             : 'about-us-language',
  'payoo-language'                : 'payoo-language',
  'the-sign-up-language'          : 'the-sign-up-language',
  'the-sign-in-language'          : 'the-sign-in-language',
  'the-forget-password-language'  : 'the-forget-password-language',
  'the-account-language'          : 'the-account-language',
  'the-booking-language'          : 'the-booking-language',
  'the-booking-detail-language'   : 'the-booking-detail-language',
};

const LANGUAGE_PATH = {
  [LANGUAGE_NAME["the-home-language"]]: LANGUAGE_URL + '/the-home-language.json',
  [LANGUAGE_NAME["the-promotion-language"]]: LANGUAGE_URL + '/the-promotion-language.json',
  [LANGUAGE_NAME["the-blog-list-language"]]: LANGUAGE_URL + '/the-blog-list-language.json',
  [LANGUAGE_NAME["the-blog-detail-language"]]: LANGUAGE_URL + '/the-blog-detail-language.json',
  [LANGUAGE_NAME["the-promotion-detail-language"]]: LANGUAGE_URL + '/the-promotion-detail-language.json',
  [LANGUAGE_NAME["the-list-landingpage-language"]]: LANGUAGE_URL + '/the-list-landingpage-language.json',
  [LANGUAGE_NAME["the-comment-language"]]: LANGUAGE_URL + '/the-comment-language.json',
  [LANGUAGE_NAME["the-hotel-detail-language"]]: LANGUAGE_URL + '/the-hotel-detail-language.json',
  [LANGUAGE_NAME["the-payment-v4-language"]]: LANGUAGE_URL + '/the-payment-v4-language.json',
  [LANGUAGE_NAME["payment-language"]]: LANGUAGE_URL + '/payment-language.json',
  [LANGUAGE_NAME["payment-detail-language"]]: LANGUAGE_URL + '/payment-detail-language.json',
  [LANGUAGE_NAME["payment-success-language"]]: LANGUAGE_URL + '/payment-success-language.json',
  [LANGUAGE_NAME["category-language"]]: LANGUAGE_URL + '/category-language.json',
  [LANGUAGE_NAME["search-language"]]: LANGUAGE_URL + '/search-language.json',
  [LANGUAGE_NAME["room-language"]]: LANGUAGE_URL + '/room-language.json',
  [LANGUAGE_NAME["the-profile-language"]]: LANGUAGE_URL + '/the-profile-language.json',
  [LANGUAGE_NAME["about-us-language"]]: LANGUAGE_URL + '/about-us-language.json',
  [LANGUAGE_NAME["payoo-language"]]: LANGUAGE_URL + '/payoo-language.json',
  [LANGUAGE_NAME["the-sign-up-language"]]: LANGUAGE_URL + '/the-sign-up-language.json',
  [LANGUAGE_NAME["the-sign-in-language"]]: LANGUAGE_URL + '/the-sign-in-language.json',
  [LANGUAGE_NAME["the-forget-password-language"]]: LANGUAGE_URL + '/the-forget-password-language.json',
  [LANGUAGE_NAME["the-account-language"]]: LANGUAGE_URL + '/the-account-language.json',
  [LANGUAGE_NAME["the-booking-language"]]: LANGUAGE_URL + '/the-booking-language.json',
  [LANGUAGE_NAME["the-booking-detail-language"]]: LANGUAGE_URL + '/the-booking-detail-language.json',
};

const LANGUAGE_INFO = {
  [LANGUAGE_NAME['the-home-language']]: {
    key: 'home',
    name: LANGUAGE_NAME['the-home-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['the-home-language']],
  },
  [LANGUAGE_NAME['the-promotion-language']]: {
    key: 'promotion',
    name: LANGUAGE_NAME['the-promotion-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['the-promotion-language']],
  },
  [LANGUAGE_NAME['the-blog-list-language']]: {
    key: 'bloglist',
    name: LANGUAGE_NAME['the-blog-list-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['the-blog-list-language']],
  },
  [LANGUAGE_NAME['the-blog-detail-language']]: {
    key: 'blog-detail',
    name: LANGUAGE_NAME['the-blog-detail-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['the-blog-detail-language']],
  },
  [LANGUAGE_NAME['the-promotion-detail-language']]: {
    key: 'promotion_detail',
    name: LANGUAGE_NAME['the-promotion-detail-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['the-promotion-detail-language']],
  },
  [LANGUAGE_NAME['the-list-landingpage-language']]: {
    key: 'list-landingpage',
    name: LANGUAGE_NAME['the-list-landingpage-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['the-list-landingpage-language']],
  },
  [LANGUAGE_NAME['the-comment-language']]: {
    key: 'comment',
    name: LANGUAGE_NAME['the-comment-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['the-comment-language']],
  },
  [LANGUAGE_NAME['the-hotel-detail-language']]: {
    key: 'hotel_detail',
    name: LANGUAGE_NAME['the-hotel-detail-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['the-hotel-detail-language']],
  },
  [LANGUAGE_NAME['the-payment-v4-language']]: {
    key: 'payment_v4',
    name: LANGUAGE_NAME['the-payment-v4-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['the-payment-v4-language']],
  },
  [LANGUAGE_NAME['payment-language']]: {
    key: 'payment',
    name: LANGUAGE_NAME['payment-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['payment-language']],
  },
  [LANGUAGE_NAME['room-language']]: {
    key: 'room',
    name: LANGUAGE_NAME['room-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['room-language']],
  },
  [LANGUAGE_NAME['payment-detail-language']]: {
    key: 'payment-detail',
    name: LANGUAGE_NAME['payment-detail-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['payment-detail-language']],
  },
  [LANGUAGE_NAME['payment-success-language']]: {
    key: 'payment-success',
    name: LANGUAGE_NAME['payment-success-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['payment-success-language']],
  },
  [LANGUAGE_NAME['category-language']]: {
    key: 'category',
    name: LANGUAGE_NAME['category-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['category-language']],
  },
  [LANGUAGE_NAME['search-language']]: {
    key: 'search',
    name: LANGUAGE_NAME['search-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['search-language']],
  },

  [LANGUAGE_NAME['the-profile-language']]: {
    key: 'profile',
    name: LANGUAGE_NAME['the-profile-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['the-profile-language']],
  },

  [LANGUAGE_NAME['about-us-language']]: {
    key: 'about-us',
    name: LANGUAGE_NAME['about-us-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['about-us-language']],
  },
  [LANGUAGE_NAME['payoo-language']]: {
    key: 'payoo',
    name: LANGUAGE_NAME['payoo-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['payoo-language']],
  },
  [LANGUAGE_NAME['the-sign-up-language']]: {
    key: 'sign_up',
    name: LANGUAGE_NAME['the-sign-up-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['the-sign-up-language']],
  },
  [LANGUAGE_NAME['the-sign-in-language']]: {
    key: 'sign_in',
    name: LANGUAGE_NAME['the-sign-in-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['the-sign-in-language']],
  },
  [LANGUAGE_NAME['the-forget-password-language']]: {
    key: 'forget_password',
    name: LANGUAGE_NAME['the-forget-password-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['the-forget-password-language']],
  },
  [LANGUAGE_NAME['the-account-language']]: {
    key: 'account',
    name: LANGUAGE_NAME['the-account-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['the-account-language']],
  },
  [LANGUAGE_NAME['the-booking-language']]: {
    key: 'my_booking_page',
    name: LANGUAGE_NAME['the-booking-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['the-booking-language']],
  },
  [LANGUAGE_NAME['the-booking-detail-language']]: {
    key: 'my_booking_detail_page',
    name: LANGUAGE_NAME['the-booking-detail-language'],
    path: LANGUAGE_PATH[LANGUAGE_NAME['the-booking-detail-language']],
  },
};

const KEYPATH_CONFIG = PAGE_INFO?.resManagementData?.data?.language ?? {
  vi: {},
  en: {},
};

export {
  LANGUAGE_NAME,
  LANGUAGE_PATH,
  LANGUAGE_INFO,
  KEYPATH_CONFIG,
}
