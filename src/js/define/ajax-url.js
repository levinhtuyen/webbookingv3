import {
  ENV,
  ARR_ENV,
  API_VERSION,
  BASE_DEV_API_INFO,
  BASE_STAGING_API_INFO,
  BASE_API_INFO
} from "./api-define";

const AJAX_URL = {
  // NOTE - user / personal information API
  user: {
    getUserProfile: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: "/web-booking/user/getUserProfile",
    },

    find_user_location:
      BASE_DEV_API_INFO[API_VERSION.v2].base_url +
      "/web-booking/home/findUserLocation",
  },
  //==== End user / personal API ====

  // NOTE - home page API
  home: {
    all: {
      ...BASE_DEV_API_INFO[(ENV === ARR_ENV.production ? API_VERSION.v1 : API_VERSION.v3)],
      path: "/web-booking/home/getHomePage",
    },
    icon_collection_list: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: '/web-booking/home/getIconCollectionList',
    },
    banner_list: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: '/web-booking/home/getBannerList',
    },
    display_collection_list: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: '/web-booking/home/getDisplayCollectionList',
    },
    article_list: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: '/web-booking/home/getArticleList',
    },
    display_collection_detail: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: '/web-booking/home/getHotelOfCollectionList',
    },
  },

  // NOTE - home page API
  home_v4: {
    all: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: "/web-booking/home/getHomePage",
    },
  },

  // NOTE - location API
  location: {
    city_list: {
      ...BASE_DEV_API_INFO[API_VERSION.v2],
      path: "/web-booking/chooseArea/findAllProvinceCity",
    },

    district_list: {
      ...BASE_DEV_API_INFO[API_VERSION.v2],
      path: "/web-booking/chooseArea/findAllDistrictByProvinceSn",
    },
  },

  gallery: {
    article: {
      ...BASE_DEV_API_INFO[(ENV === ARR_ENV.production ? API_VERSION.v1 : API_VERSION.v3)],
      path: "/web-booking/home/getLimitArticles",
    },
  },
  search: {
    searchHotel: {
      ...BASE_DEV_API_INFO[(ENV === ARR_ENV.production ? API_VERSION.v1 : API_VERSION.v3)],
      path: "/web-booking/home/getHotelSearchList",
    },
    searchHeader:{
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: "/web-booking/home/getHotelSearchListByKeyword",
    },
    searchRecent: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: "/web-booking/home/insertRecentHotelSearchHistory",
    }
  },
  hotel: {
    info: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: '/web-booking/hotel/getHotelDetail',
    },
    infoV4: {
        ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: '/web-booking/hotel/getHotelDetail',
    },
    favorite: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: '/web-booking/hotel/updateFavoriteHotelForUser',
    },
    suggestionForHotel: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: '/web-booking/hotel/getHotelSuggestionForHotelDetail',
    },
    roomTypeList: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: '/web-booking/hotel/getRoomTypeList',
    },

    facilityList: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: '/web-booking/hotel/getFacilityList',
    },
  },

  // Start Room type detail v4
  hotel_v4: {
    getRoomTypeDetail: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: '/web-booking/hotel/getRoomTypeDetail',
    },

    checkOverlapBooking: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: '/web-booking/booking/checkOverlapBooking',
    },

    getFacilityList: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: '/web-booking/hotel/getFacilityList',
    },

    getReviewList: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: '/web-booking/hotel/getReviewList',
    },

    updateReview: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: '/web-booking/review/updateReview',
    },

    updateLikeUserReview: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: '/web-booking/review/updateLikeUserReview',
    },

    getDisplayRule: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: '/web-booking/hotel/getDisplayRule',
    },

    favorite: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: '/web-booking/hotel/updateFavoriteHotelForUser',
    },

    getNearBy: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: '/web-booking/hotel/getNearbyList',
    },

    getLanguageSpokenList: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: '/web-booking/hotel/getLanguageSpokenList',
    }
  },
  // End Room type detail v4

  category: {
    hotelListFilter: {
      ...BASE_DEV_API_INFO[(ENV === ARR_ENV.production ? API_VERSION.v1 : API_VERSION.v3)],
      path: '/web-booking/home/getHotelListFilter',
    },
    hotelNearBy: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: '/web-booking/home/getHotelListNearBy',
    },
    hotelCollectionDetail: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: '/web-booking/home/getHotelCollectionDetail',
    },
    hotelListByBookingType: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: '/web-booking/home/getHotelListByBookingType',
    },
    getHotelSearchList: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: '/web-booking/hotel/getHotelSearchList',
    },
  },
  payment_v4:{
    payment: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: "/web-booking/booking/createNewBooking",
    },
    promotionList: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: "/web-booking/reward/getCouponCanUseList",
    },
    getRewardForNewBooking :{
        ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: "/web-booking/booking/getRewardForNewBooking",
    },
    calculateBookingAmount: {
    ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: "/web-booking/booking/calculateBookingAmount",
    },

  },
  // payment
  payment: {
    productList: {
      ...BASE_DEV_API_INFO[(ENV === ARR_ENV.production ? API_VERSION.v1 : API_VERSION.v3)],
      path: '/web-booking/hotel/getAllProductTypeList',
    },
    detailProduct: {
      ...BASE_DEV_API_INFO[(ENV === ARR_ENV.production ? API_VERSION.v1 : API_VERSION.v3)],
      path: '/web-booking/hotel/getAllProductListByProductType',
    },
    calculateBooking: {
      ...BASE_DEV_API_INFO[(ENV === ARR_ENV.production ? API_VERSION.v1 : API_VERSION.v3)],
      version: API_VERSION.v3,
      path: "/web-booking/user-bookings/calculateBookingAmount",
    },
    beforeCreateBooking: {
      ...BASE_DEV_API_INFO[(ENV === ARR_ENV.production ? API_VERSION.v1 : API_VERSION.v3)],
      version: API_VERSION.v3,
      path: '/web-booking/user-bookings/checkBeforeCreateNewBooking',
    },
    checkBeforeCreateBooking: {
      ...BASE_DEV_API_INFO[API_VERSION.v1],
      version: API_VERSION.v3,
      path: "/web-booking/user-bookings/checkBeforeCreateNewBooking",
    },
    promotionList: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/reward/getCouponCanUseList",
    },
    stamp: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/reward/getStampCanUseList",
    },
    sendVerifyCodeForGuest: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user-bookings/sendVerifyCodeForGuestBooking",
    },
    verifyCodeForGuest: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user-bookings/verifyCodeForGuestBooking",
    },
  },
  paymentDetail: {
    payment: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user-bookings/createNewUserBooking",
    },
    paymentResult: {
      ...BASE_DEV_API_INFO[API_VERSION.v2],
      version: API_VERSION.v3,
      path: "/payment/getPaymentResult",
    },
  },
  paymentSuccess: {
    info: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user-bookings/getUserBookingByBookingNo",
    },
  },
  // NOTE - update web device uuid
  webDevice: {
    updateWebDevice:
      BASE_DEV_API_INFO[API_VERSION.v3].base_url +
      "/web-booking/device/updateWebDevice",
  },

  // NOTE - my stamp page API
  myStamp: {
    all: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/reward/getStamps",
    },
    detail: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/reward/getStampDetail",
    },
  },

  // NOTE - my point page API
  myPoint: {
    total: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/reward/getPointsTotal",
    },
  },


  // NOTE - my booking page API
  myBooking: {
    all: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user/getBookings",
    },
    detail: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user/getBookingDetail",
    },
    detailV4: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: "/web-booking/booking/getBookingDetail",
    },
    cancelBooking: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user/cancelBooking",
    },

    cancelBookingV4: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: "/web-booking/booking/cancelBooking",
    },

    getBookingListV4: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: "/web-booking/booking/getBookingList",
    },
  },

  // NOTE - my coupon page API
  myCoupon: {
    all: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/reward/getCoupons",
    },
  },

  // NOTE -login page API
  login: {
    signIn: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user/signIn",
    },
    signup: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user/signUp",
    },
    fieldChecking: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user/fieldChecking",
    },
    sendVerifyCodeSignUp: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user/sendVerifyCodeSignUp",
    },
    // forget password
    forgotPasswordByEmail: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user/forgotPasswordByEmail",
    },
    sendVerifyCodeForgotPassword: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user/sendVerifyCodeForgotPassword",
    },
    verifyCodeForgotPassword: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user/verifyCodeForgotPassword",
    },
    updatePasswordForgotPassword: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user/updatePasswordForgotPassword",
    },

  },

  // NOTE -login page API
  login_v4: {
    signIn: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user/signIn",
    },
    signup: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user/signUp",
    },
    fieldChecking: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user/fieldChecking",
    },
    sendVerifyCodeSignUp: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user/sendVerifyCodeSignUp",
    },

    verifyCodeBeforeSignUp: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user/verifyCodeBeforeSignUp",
    },

    // forget password
    forgotPasswordByEmail: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user/forgotPasswordByEmail",
    },
    sendVerifyCodeForgotPassword: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user/sendVerifyCodeForgotPassword",
    },
    verifyCodeForgotPassword: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user/verifyCodeForgotPassword",
    },
    updatePasswordForgotPassword: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user/updatePasswordForgotPassword",
    },
     //from phudnd with love v-v
    sendVerifyCode :{
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: "/web-booking/user/sendVerifyCode",
    },
    checkFieldV4 :{
     ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: "/web-booking/user/checkFieldBeforeSignInSignUp",
    },
    signInV4: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: "/web-booking/user/signIn",
    },
     signUpV4: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: "/web-booking/user/signUp",
    }
  },


  //NOTE - profile page API
  profile: {
    profile: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user/getUserProfile",
    },
    updateProfile: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: "/web-booking/user/updateUserProfile",
    },
    fieldCheckingProfile: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user/fieldCheckingProfile",
    },
    sendVerifyCodeSignUp: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: "/web-booking/user/sendVerifyCode",
    },
    updateUserPassword: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/user/updateUserPassword",
    },
    getLinkedAccount: {
          ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: "/web-booking/user/getLinkedAccount",
    },
    updateLinkAccountSocial: {
        ...BASE_DEV_API_INFO[API_VERSION.v4],
    path: "/web-booking/user/updateLinkAccountSocial",
    }
  },

  //NOTE - promotion page API
  promotion: {
    promotionGroup: {
      ...BASE_DEV_API_INFO[(ENV === ARR_ENV.production ? API_VERSION.v1 : API_VERSION.v3)],
      path: "/web-booking/promotion/getPromotionGroup",
    },

    promotionList: {
      ...BASE_DEV_API_INFO[(ENV === ARR_ENV.production ? API_VERSION.v1 : API_VERSION.v3)],
      path: "/web-booking/promotion/getPromotion",
    },
    promotionTab: {
      ...BASE_DEV_API_INFO[(ENV === ARR_ENV.production ? API_VERSION.v1 : API_VERSION.v3)],
      path: "/web-booking/promotion/getPromotion",
    },
    promotionDetail: {
      ...BASE_DEV_API_INFO[(ENV === ARR_ENV.production ? API_VERSION.v1 : API_VERSION.v3)],
      path: "/web-booking/promotion/getPromotionDetail",
    },
    listHotelPromotion: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      // version: API_VERSION.v3,
      path: "/web-booking/hotel/getHotelSearch",
    },
  },

  //NOTE - term & condition page API
  terCondition: {
    terCondition:
      BASE_DEV_API_INFO[API_VERSION.v2].base_url +
      "/web-booking/users/getPolicies",
  },

  //NOTE - applyCoupon
  applyNowCoupon: {
    applyCoupon: {
      ...BASE_DEV_API_INFO[API_VERSION.v3],
      path: "/web-booking/reward/applyPromotion",
    },
  },

  //NOTE - blog
  blog: {
    blogDetail: {
      ...BASE_DEV_API_INFO[(ENV === ARR_ENV.production ? API_VERSION.v1 : API_VERSION.v3)],
      path: "/web-booking/home/getArticleDetail",
    },
  },

  //NOTE - ListLimit

  article: {
    home: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: "/web-booking/articleHome/getDisplayTypeArticleList",
    },
    detail: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: "/web-booking/articleHome/getDisplayTypeArticleInfo",
    },
    limit: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: "/web-booking/articleHome/getDisplayTypeArticleRelated",
    },
    category: {
      ...BASE_DEV_API_INFO[API_VERSION.v4],
      path: "/web-booking/category/getArticleList",
    }
  },
}

// NOTE - the bottom syntax use for print all api with specify version
// let arrAjaxUrl = [];

// for(const objAjaxItemKey in AJAX_URL) {
//   for(const ajaxItemInfoKey in AJAX_URL[objAjaxItemKey]) {
//     if(
//       typeof AJAX_URL[objAjaxItemKey][ajaxItemInfoKey] === 'string' &&
//       AJAX_URL[objAjaxItemKey][ajaxItemInfoKey].includes(API_VERSION.v3)
//     ) {
//       const path = AJAX_URL[objAjaxItemKey][ajaxItemInfoKey].split(API_VERSION.v3)[1];

//       if(path) {
//         arrAjaxUrl.push(path.replace('?',''));
//       }
//     } else if(
//       typeof AJAX_URL[objAjaxItemKey][ajaxItemInfoKey] === 'object' &&
//       AJAX_URL[objAjaxItemKey][ajaxItemInfoKey].base_url.includes(API_VERSION.v3)
//     ) {
//       arrAjaxUrl.push(AJAX_URL[objAjaxItemKey][ajaxItemInfoKey].path.replace('?',''));
//     }
//   }
// }

// console.log(arrAjaxUrl);

export {
  AJAX_URL,
};
