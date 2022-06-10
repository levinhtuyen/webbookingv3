import axios from './custom-axios';

export const AJAX_URL = {
  hotelDisplay: {
    list(data) {
      return axios.get(`api/v1/web/sa/hotels?hotelStatus=[${data.hotelStatus}]&hotelSn=${data.hotelSn}&staffSn=${data.staffSn}&limit=${data.limit}&page=${data.page}`);
    },
    submit(data) {
      return axios.post('hotel-dislay', data);
    },
    show(id) {
      return axios.get(`api/v1/web/sa/hotels/${id}`);
    }
  }
};

// export const AJAX_URL = {
//   hotelDisplay: {
//     // submit: axios.post(AJAX_BASE_URL + '/hotel-dislay', data)
//     submit: AJAX_BASE_URL + '/hotel-dislay',
//   }
// };

// const BASE_URL = '';

// export const AJAX_BASE_URL = BASE_URL + '/ajax';

// export const AJAX_URL = {
//   sendpulse: {
//     addEmailToMailingList: AJAX_BASE_URL + '/sendpulse/addEmailToMailingList',
//     test:  AJAX_BASE_URL + '/sendpulse/test',
//   },
  // category: {
  //   getCategoryList: AJAX_BASE_URL + '/category/getCategoryList',
  //   getGroupGiftCategory: AJAX_BASE_URL + '/category/getGroupGiftCategory',
  //   getGiftCategory: AJAX_BASE_URL + '/category/getGiftCategory',
  // },
  // deal: {
  //   getAmazonDeal: AJAX_BASE_URL + '/deal/getAmazonDeal',
  //   getAllAmazonDealList: AJAX_BASE_URL + '/deal/getAllAmazonDealList',
  // },
  // product: {
  //   getProductList: AJAX_BASE_URL + '/product/getProductList',
  //   getFinalPriceList: AJAX_BASE_URL + '/product/getFinalPriceList',
  //   getCommentList: AJAX_BASE_URL + '/product/getCommentList',
  //   getPriceHistory: AJAX_BASE_URL + '/product/getPriceHistory',
  //   subscribeChangePrice: AJAX_BASE_URL + '/product/subscribeChangePrice',
  //   blockAsin: AJAX_BASE_URL + '/product/blockAsin',
  //   postProductCompare: AJAX_BASE_URL + '/product/postProductCompare', // POST
  //   getProductCompare: AJAX_BASE_URL + '/product/getProductCompare', // GET
  //   removeProductCompare: AJAX_BASE_URL + '/product/removeProductCompare', // GET
  // },
  // productNew: {
  //   getExtraInfo: AJAX_BASE_URL + '/productNew/getExtraInfo', // POST
  //   getDetail: AJAX_BASE_URL + '/productNew/getDetail', // POST
  //   search: AJAX_BASE_URL + '/productNew/search', // GET
  //   deal: AJAX_BASE_URL + '/productNew/deal', // GET
  //   searchAmazon: AJAX_BASE_URL + '/productNew/searchAmazon', // GET
  //   searchStore: AJAX_BASE_URL + '/productNew/searchStore', // GET
  //   getMerchantListAmazon: AJAX_BASE_URL + '/productNew/getMerchantListAmazon', // GET
  // },
  // customer: {
  //   updateCommentLike: AJAX_BASE_URL + '/customer/updateCommentLike',
  //   postComment: AJAX_BASE_URL + '/customer/postComment',
  //   postContact: AJAX_BASE_URL + '/customer/postContact',
  //   getQaList: AJAX_BASE_URL + '/customer/getQaList',
  //   getFeedbackList: AJAX_BASE_URL + '/customer/getFeedbackList',
  //   registerNewsletter: AJAX_BASE_URL + '/customer/registerNewsletter', // POST
  // },
  // userReview: {
  //   getReviewList: AJAX_BASE_URL + '/userReview/getReviewList',
  //   addReviewFado: AJAX_BASE_URL + '/userReview/addReviewFado',
  //   addLikeButton: AJAX_BASE_URL + '/userReview/addLikeButton',
  // },
  // advisory: {
  //   postPhoneToCallback: AJAX_BASE_URL + '/advisory/postPhoneToCallback',
  // },
  // global: {
  //   getGlobalPageInfo: AJAX_BASE_URL + '/global/getGlobalPageInfo',
  //   getGlobalByType: AJAX_BASE_URL + '/global/getGlobalByType',
  //   getGlobalMulti: AJAX_BASE_URL + '/global/getGlobalMulti',
  // },
  // user: {
  //   registerUserAgency: AJAX_BASE_URL + '/user/registerUserAgency', // GET
  //   postUserLogin: AJAX_BASE_URL + '/user/postUserLogin',
  //   postUserRegister: AJAX_BASE_URL + '/user/postUserRegister',
  //   postUserRequestPassword: AJAX_BASE_URL + '/user/postUserRequestPassword',
  //   getUserInfo: AJAX_BASE_URL + '/user/getUserInfo',
  //   changeUserPassword: AJAX_BASE_URL + '/user/changeUserPassword', // POST
  //   resetUserPassword: AJAX_BASE_URL + '/user/resetUserPassword', // POST
  //   updateUserInfo: AJAX_BASE_URL + '/user/updateUserInfo', // POST
  // },
  // captcha: {
  //   generateCaptcha: AJAX_BASE_URL + '/captcha/generateCaptcha',
  // },
  // favorite: {
  //   postFavorite: AJAX_BASE_URL + '/favorite/postFavorite',
  //   postUnFavorite: AJAX_BASE_URL + '/favorite/postUnFavorite',
  //   checkFavorite: AJAX_BASE_URL + '/favorite/checkFavorite',
  //   changeFavorite: AJAX_BASE_URL + '/favorite/changeFavorite',
  //   getFavoriteProductList: AJAX_BASE_URL + '/favorite/getFavoriteProductList',
  // },
  // search: {
  //   getKeywordsSuggestList: AJAX_BASE_URL + '/search/getKeywordsSuggestList',
  //   checkKeyword: AJAX_BASE_URL + '/search/checkKeyword',
  // },
  // cart: {
  //   addCart: AJAX_BASE_URL + '/cart/addCart',
  //   getCart: AJAX_BASE_URL + '/cart/getCart',
  //   updateCart: AJAX_BASE_URL + '/cart/updateCart',
  //   removeCart: AJAX_BASE_URL + '/cart/removeCart',
  //   checkCart: AJAX_BASE_URL + '/cart/checkCart',
  // },
  // order: {
  //   getPaymentMethodList: AJAX_BASE_URL + '/order/getPaymentMethodList',
  //   getPaymentMethodDetail: AJAX_BASE_URL + '/order/getPaymentMethodDetail',
  //   checkout: AJAX_BASE_URL + '/order/checkout',
  //   getOrderList: AJAX_BASE_URL + '/order/getOrderList',
  //   searchOrder: AJAX_BASE_URL + '/order/searchOrder',
  //   getPaymentMethodListOfOrder: AJAX_BASE_URL + '/order/getPaymentMethodListOfOrder',
  //   getPaymentMethodDetailOfOrder: AJAX_BASE_URL + '/order/getPaymentMethodDetailOfOrder',
  //   changePaymentMethodOfOrder: AJAX_BASE_URL + '/order/changePaymentMethodOfOrder',
  //   continuePaymentOfOrder: AJAX_BASE_URL + '/order/continuePaymentOfOrder',
  //   cancelOrder: AJAX_BASE_URL + '/order/cancelOrder',
  //   postSuggestPaymentMethod: AJAX_BASE_URL + '/order/postSuggestPaymentMethod',
  //   getInstallmentFee: AJAX_BASE_URL + '/order/getInstallmentFee',
  //   getCheckTransactionPayment: AJAX_BASE_URL + '/order/getCheckTransactionPayment',
  // },
  // discountCode: {
  //   getUserDiscountCode: AJAX_BASE_URL + '/discountCode/getUserDiscountCode',
  //   checkDiscountCode: AJAX_BASE_URL + '/discountCode/checkDiscountCode', // POST
  //   getDiscountCodeList: AJAX_BASE_URL + '/discountCode/getDiscountCodeList',
  //   getAllDiscountCodeList: AJAX_BASE_URL + '/discountCode/getAllDiscountCodeList',
  //   getProductDiscountList: AJAX_BASE_URL + '/discountCode/getProductDiscountList', // GET
  // },
  // agency: {
  //   registerUserAgency: AJAX_BASE_URL + '/user/registerUserAgency',
  //   checkAgencyCode: AJAX_BASE_URL + '/order/checkAgencyCode',
  // },
  // quotation: {
  //   updateUserQuotationQuanityList: AJAX_BASE_URL + '/quotation/updateUserQuotationQuanityList', // POST
  //   deleteUserQuotation: AJAX_BASE_URL + '/quotation/deleteUserQuotation', // POST
  //   requestUserQuotationToEmail: AJAX_BASE_URL + '/quotation/requestUserQuotationToEmail', // POST
  //   requestImmediatelyQuotation: AJAX_BASE_URL + '/quotation/requestImmediatelyQuotation', // POST
  //   addToQuotationList: AJAX_BASE_URL + '/quotation/addToQuotationList', // POST
  //   checkViewQuotation: AJAX_BASE_URL + '/quotation/checkViewQuotation', // POST
  // },
  // affiliate: {
  //   registerUserAffiliate: AJAX_BASE_URL + '/affiliate/registerUserAffiliate', //GET
  //   getUserAffiliateCrossCheckList: AJAX_BASE_URL + '/affiliate/getUserAffiliateCrossCheckList', // GET
  //   addUserAffiliatePayment: AJAX_BASE_URL + '/affiliate/addUserAffiliatePayment',
  //   updateUserAffiliatePayment: AJAX_BASE_URL + '/affiliate/updateUserAffiliatePayment',
  //   deleteUserAffiliatePayment: AJAX_BASE_URL + '/affiliate/deleteUserAffiliatePayment',
  //   setDefaultUserAffiliatePayment: AJAX_BASE_URL + '/affiliate/setDefaultUserAffiliatePayment',
  //   postUserAffiliateCreateLink: AJAX_BASE_URL + '/affiliate/postUserAffiliateCreateLink', //POST
  // },
  // other: {
  //   getCityList: AJAX_BASE_URL + '/other/getCityList', // GET
  //   getDistrictList: AJAX_BASE_URL + '/other/getDistrictList', // GET
  //   getWardList: AJAX_BASE_URL + '/other/getWardList', // GET
  // },
  // template: {
  //   getTemplateList: AJAX_BASE_URL + '/template/getTemplateList', // GET
  //   getPopupBner: AJAX_BASE_URL + '/template/getPopupBner', // GET
  // },
  // banner: {
  //   getList: AJAX_BASE_URL + '/banner/getList', // GET
  // },
  // store: {
  //   getSgpDealList: AJAX_BASE_URL + '/store/getSgpDealList',// GET
  //   getStoreCategory: AJAX_BASE_URL + '/store/getStoreCategory',// GET
  //   searchStoreProduct: AJAX_BASE_URL + '/store/searchStoreProduct',// GET
  // },
  // inventory: {
  //   getProductList: AJAX_BASE_URL + '/inventory/getProductList', // GET
  // },
  // voteService: {
  //   postVoteServiceInfo: AJAX_BASE_URL + '/voteService/postVoteServiceInfo', // POST
  // },
  // translate: {
  //   translateAmazonCategoryNodeId: AJAX_BASE_URL + '/translate/translateAmazonCategoryNodeId', // GET
  // },
  // blackfriday: {
  //   playEvent: AJAX_BASE_URL + '/blackfriday/playEvent',
  //   getEventInfo: AJAX_BASE_URL + '/blackfriday/getEventInfo',
  //   getEventTurn: AJAX_BASE_URL + '/blackfriday/getEventTurn',
  // },
  // techAwards: {
  //   registerLuckyDraw: AJAX_BASE_URL + '/techAwards/registerLuckyDraw', // GET
  //   getLuckyDrawResult: AJAX_BASE_URL + '/techAwards/getLuckyDrawResult', // GET
  //   playLuckyDraw: AJAX_BASE_URL + '/techAwards/playLuckyDraw', // GET
  //   getLuckyDrawInfo: AJAX_BASE_URL + '/techAwards/getLuckyDrawInfo', // GET
  //   getLuckyDrawTurn: AJAX_BASE_URL + '/techAwards/getLuckyDrawTurn', // GET
  // },
  // lunarNewYear: {
  //   registerLuckyDraw: AJAX_BASE_URL + '/lunarNewYear/registerLuckyDraw', // GET
  //   getLuckyDrawResult: AJAX_BASE_URL + '/lunarNewYear/getLuckyDrawResult', // GET
  //   playLuckyDraw: AJAX_BASE_URL + '/lunarNewYear/playLuckyDraw', // GET
  //   getLuckyDrawInfo: AJAX_BASE_URL + '/lunarNewYear/getLuckyDrawInfo', // GET
  //   getLuckyDrawTurn: AJAX_BASE_URL + '/lunarNewYear/getLuckyDrawTurn', // GET
  // },
  // primeDay: {
  //   registerLuckyDraw: AJAX_BASE_URL + '/primeDay/registerLuckyDraw', // GET
  //   getLuckyDrawResult: AJAX_BASE_URL + '/primeDay/getLuckyDrawResult', // GET
  //   playLuckyDraw: AJAX_BASE_URL + '/primeDay/playLuckyDraw', // GET
  //   getLuckyDrawInfo: AJAX_BASE_URL + '/primeDay/getLuckyDrawInfo', // GET
  //   getLuckyDrawTurn: AJAX_BASE_URL + '/primeDay/getLuckyDrawTurn', // GET
  // },
  // keyword: {
  //   getKeywordList: AJAX_BASE_URL + '/keyword/getKeywordList',
  // },
  // tracking: {
  //   pushDataToKeywordQueue: AJAX_BASE_URL + '/tracking/pushDataToKeywordQueue', // POST
  //   trackStatusProduct: AJAX_BASE_URL + '/tracking/trackStatusProduct', // POST
  // },
  // addressBook: {
  //   getDefaultAddressBook: AJAX_BASE_URL + '/addressBook/getDefaultAddressBook',
  //   getListAddressBook: AJAX_BASE_URL + '/addressBook/getListAddressBook',
  //   addAddressBook: AJAX_BASE_URL + '/addressBook/addAddressBook',
  //   editAddressBook: AJAX_BASE_URL + '/addressBook/editAddressBook',
  //   setDefaultAddressBook: AJAX_BASE_URL + '/addressBook/setDefaultAddressBook',
  //   getAddressBookDetail: AJAX_BASE_URL + '/addressBook/getAddressBookDetail',
  //   removeAddressBook: AJAX_BASE_URL + '/addressBook/removeAddressBook',
  // },
  // support: {
  //   getDetail: AJAX_BASE_URL + '/support/getDetail',
  //   search: AJAX_BASE_URL + '/support/search',
  //   requestAnswer: AJAX_BASE_URL + '/support/requestAnswer',
  // },
  // wallet: {
  //   addWalletRequest: AJAX_BASE_URL + '/wallet/addWalletRequest',
  //   cancelWalletRequest: AJAX_BASE_URL +'/wallet/cancelWalletRequest',
  //   getWalletInterestList: AJAX_BASE_URL +'/wallet/getWalletInterestList',
  //   changeWalletAutoPayment: AJAX_BASE_URL + '/user/changeWalletAutoPayment',
  //   getWalletRequestList: AJAX_BASE_URL + '/wallet/getWalletRequestList',
  //   checkEGiftCard: AJAX_BASE_URL + '/wallet/checkEGiftCard',
  // },
  // notification: {
  //   getCounter: AJAX_BASE_URL + '/notification/getCounter',
  //   ow_resetCounter: AJAX_BASE_URL + '/notification/ow_resetCounter',
  //   getItemList: AJAX_BASE_URL + '/notification/getItemList',
  //   ow_updateReadItem: AJAX_BASE_URL + '/notification/ow_updateReadItem',
  // },
  // trackingPrice: {
  //   listTrackingPrice: AJAX_BASE_URL + '/trackingPrice/listTrackingPrice',
  //   createTrackingPrice: AJAX_BASE_URL + '/trackingPrice/createTrackingPrice',
  //   validateTrackingPrice: AJAX_BASE_URL + '/trackingPrice/validateTrackingPrice',
  //   detailTrackingPrice: AJAX_BASE_URL + '/trackingPrice/detailTrackingPrice',
  //   updateTrackingPrice: AJAX_BASE_URL + '/trackingPrice/updateTrackingPrice',
  //   removeTrackingPrice: AJAX_BASE_URL + '/trackingPrice/removeTrackingPrice',
  //   updatePrice: AJAX_BASE_URL + '/trackingPrice/updatePrice',
  // },
  // campaign: {
  //   registEmailGetFadopay: AJAX_BASE_URL + '/campaign/registEmailGetFadopay',
  // },
  // trending: {
  //   getTrendingCategory: AJAX_BASE_URL + '/trending/getTrendingCategory',
  // },
  // silverNano: {
  //   sendBuyerData: AJAX_BASE_URL + '/silverNano/sendBuyerData',
  // },
  // iLogistics: {
  //   getILogistics: AJAX_BASE_URL + '/iLogistics/getILogistics',
  // },
// };