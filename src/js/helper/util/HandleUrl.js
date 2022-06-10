import {
  LANGUAGE_DEFAULT,
  LANGUAGE_VALID,
  IP_INFO,
  // ENV,
  // ARR_ENV,
  // IS_UAT,
} from '~jsDefinePath/general';
import {
  _
} from '~jsLibPath/lib-manager';
import {
  ROUTER_NAME,
  ROUTER_PATH,
} from '~jsBasePath/vue-router/router-define';
import {
  ROUTER_NAME as ARTICLE_ROUTER_NAME,
  ROUTER_PATH as ARTICLE_ROUTER_PATH,
} from '~jsLandingPath/article/base/vue-router/router-define';
import {
    DISPATCHER_PARAMS_ID,
} from '~jsPath/define/dispatcher-params-id';
const _generatePathWithLanguage = (
  path, // string
  params, // { key: value }
  query, // string
) => {
  let pathFormatted = path.replace('/:language?','');
  const pathWithLanguageList = {};

  // const regexRouteParamKey = new RegExp('/:' + paramKey + '|[?]','g');
  const regexRouteParamKey = /\/:[a-zA-Z0-9]*[\w*?]/g;

  if(!_.isEmpty(params)) {
    for( const paramKey in params ) {
      if(
        !params[paramKey] ||
        params[paramKey] === 'null' ||
        params[paramKey] === 'undefined'
      ) {
        pathFormatted = pathFormatted.replace(regexRouteParamKey, '');
      } else {
        const routeParamKey = ':' + paramKey;
        pathFormatted = pathFormatted.replace(routeParamKey, params[paramKey]);
        pathFormatted = pathFormatted.replace('?','');
      }
    }
  }

  pathFormatted = pathFormatted.replace(regexRouteParamKey, '');

  if(query) {
    if(pathFormatted === '/') {
      pathFormatted = '';
    }

    pathFormatted+='?'+query;
  }

  // NOTE - For only language param
  // _.forIn(LANGUAGE_VALID, function(language) {
  //   pathWithLanguageList[language] = (
  //     language === LANGUAGE_DEFAULT ?
  //     pathFormatted :
  //     (
  //       pathFormatted === '/' ?
  //       '/' + language :
  //       '/' + language + pathFormatted
  //     )
  //   );
  // })

  // NOTE - For locale code ID param
  _.forIn(LANGUAGE_VALID, function(language) {
    pathWithLanguageList[language] = (
      pathFormatted === '/' ?
        '/' + language + '-' + IP_INFO.country.toLowerCase() :
      '/' + language + '-' + IP_INFO.country.toLowerCase() + pathFormatted
    );
  })

  // NOTE - Default path with non language param
  pathWithLanguageList.default = pathFormatted;

  return pathWithLanguageList;
}; // _generatePathWithLanguage()

const getUrlQueryString = (data, allowNULL = true) => {
  if(_.isEmpty(data)) {
    return null;
  }

  return Object.keys(data)
  .map(function(key) {
    if (
      !allowNULL &&
      (
        (
          typeof data[key] !== 'number' &&
          !data[key]
        ) ||
        data[key] === 'null' ||
        data[key] === 'undefined'
      )
    ) {
      return false;
    }
    return [key, data[key]].map(encodeURIComponent).join("=");
  })
  .filter(val => val)
  .join("&");
}; //TODO: return title='title'&id='1'

// NOTE - Get home path
const getHomePath = () => {
  if(
    !ROUTER_NAME ||
    !ROUTER_PATH
  ) {
    return null;
  }

  return _generatePathWithLanguage(ROUTER_PATH[ROUTER_NAME['home-page']]);
}; // getHomePath()

// NOTE - Get home path
const getLoginPath = () => {
  if(
    !ROUTER_NAME ||
    !ROUTER_PATH
  ) {
    return null;
  }

  return _generatePathWithLanguage(ROUTER_PATH[ROUTER_NAME['login-page']]);
}; // getLoginPath()

// NOTE - Generate promotion page path with dispatcher param
const getPromotionPath = (queryStringParams) => {
  if(
    !ROUTER_NAME ||
    !ROUTER_PATH
  ) {
    return null;
  }

  const queryString = getUrlQueryString(queryStringParams);

  return _generatePathWithLanguage(ROUTER_PATH[ROUTER_NAME['promotion-page']], null, queryString);
}; // getPromotionPath()

const getPromotionDetailPath = (
  dispatcherParams,
  queryStringParams,
) => {
  if(
    !ROUTER_NAME ||
    !ROUTER_PATH
  ) {
    return null;
  }

  const queryString = getUrlQueryString(queryStringParams);

  return _generatePathWithLanguage(
    ROUTER_PATH[ROUTER_NAME['detail-promotion-page']],
    dispatcherParams,
    queryString
  );
}; // getPromotionDetailPath()

const getArticlePath = () => {
  if(
    !ARTICLE_ROUTER_NAME ||
    !ARTICLE_ROUTER_PATH
  ) {
    return null;
  }

  return _generatePathWithLanguage(
    ARTICLE_ROUTER_PATH[ARTICLE_ROUTER_NAME['article-page']],
  );
}; // getArticlePath()

const getArticleDetailPath = (
  dispatcherParams,
  // queryStringParams,
) => {
  if(
    !ARTICLE_ROUTER_NAME ||
    !ARTICLE_ROUTER_PATH
  ) {
    return null;
  }

  // const queryString = getUrlQueryString(queryStringParams);

  return _generatePathWithLanguage(
    ARTICLE_ROUTER_PATH[ARTICLE_ROUTER_NAME['article-detail-page']],
    dispatcherParams,
    // queryString
  );
}; // getArticleDetailPath()

const getArticleCategoryPath = (
  dispatcherParams,
  queryStringParams,
) => {
  if(
    !ARTICLE_ROUTER_NAME ||
    !ARTICLE_ROUTER_PATH
  ) {
    return null;
  }

  const queryString = getUrlQueryString(queryStringParams);

  return _generatePathWithLanguage(
    ARTICLE_ROUTER_PATH[ARTICLE_ROUTER_NAME['article-category-page']],
    dispatcherParams,
    queryString
  );
}; // getArticleCategoryPath()

// NOTE - getHotelListPath
const getHotelListPath = (
  dispatcherParams,
  queryStringParams,
) => {
  if(
    !ROUTER_NAME ||
    !ROUTER_PATH ||
    !dispatcherParams
  ) {
    return null;
  }

  if(
    !_.isEmpty(queryStringParams) &&
    queryStringParams.nearBy
  ) {
    queryStringParams = {};
  }

  const queryString = (
    queryStringParams ?
    getUrlQueryString(queryStringParams) :
    null
  );

  return _generatePathWithLanguage(
    ROUTER_PATH[ROUTER_NAME['hotel-list-v4-page']],
    dispatcherParams,
    queryString
  );
}; // getHotelListPath()

// NOTE - getLocationPagePath
const getLocationPagePath = (dispatcherParams) => {
  if(
    !ROUTER_NAME ||
    !ROUTER_PATH
  ) {
    return null;
  }

  dispatcherParams.categoryName = dispatcherParams.provinceName;
  dispatcherParams.subCategoryName = dispatcherParams.districtName;

  return _generatePathWithLanguage(
    ROUTER_PATH[ROUTER_NAME['hotel-list-v4-page']],
    dispatcherParams,
  );
}; // getLocationPagePath()

// NOTE - Get list landing page path
const getHotelDetailPagePath = (
  dispatcherParams,
  queryStringParams
) => {

  if(
    !ROUTER_NAME ||
    !ROUTER_PATH ||
    !dispatcherParams
  ) {
    return null;
  }

  //cheat cai qq gi ne
  if (dispatcherParams.hotelName){
    dispatcherParams.hotelName = dispatcherParams.hotelName+'-'+DISPATCHER_PARAMS_ID.G2J_HOTEL_SN_ID + queryStringParams.hotelSn

    delete queryStringParams.hotelSn // xoa property hotelSn trong queryStringParams
  }


  const queryString = (
    queryStringParams ?
    getUrlQueryString(queryStringParams) :
    null
  );
  return _generatePathWithLanguage(
    ROUTER_PATH[ROUTER_NAME['hotel-detail-page']],
    dispatcherParams,
    queryString,
  )
}; // getHotelDetailPagePath()

// NOTE - Get list landing page path
const getRoomDetailPagePath = (
  dispatcherParams,
  queryStringParams
) => {
  if(
    !ROUTER_NAME ||
    !ROUTER_PATH ||
    !dispatcherParams
  ) {
    return null;
  }
  const queryString = (
    queryStringParams ?
    getUrlQueryString(queryStringParams) :
    null
  );

  return _generatePathWithLanguage(
    ROUTER_PATH[ROUTER_NAME['room-detail-page']],
    dispatcherParams,
    queryString,
  )
}; // getRoomDetailPagePath()

// NOTE - Get list landing page path
const getBlogDetailPagePath = (
  dispatcherParams,
  queryStringParams
) => {
  if(
    !ROUTER_NAME ||
    !ROUTER_PATH ||
    !dispatcherParams
  ) {
    return null;
  }

  const queryString = (
    queryStringParams ?
    getUrlQueryString(queryStringParams) :
    null
  );

  return _generatePathWithLanguage(
    ROUTER_PATH[ROUTER_NAME['blog-detail-page']],
    dispatcherParams,
    queryString,
  )
}; // getBlogDetailPagePath()

// NOTE - Get list page path
const getBlogListPagePath = (dispatcherParams) => {
  if(
    !ROUTER_NAME ||
    !ROUTER_PATH ||
    !dispatcherParams
  ) {
    return null;
  }

  return _generatePathWithLanguage(
    ROUTER_PATH[ROUTER_NAME['blog-list-page']],
    dispatcherParams,
  )
}; // getBlogListPagePath()

// NOTE - Get vision page path
const getVisionPagePath = () => {
  if(
    !ROUTER_NAME ||
    !ROUTER_PATH
  ) {
    return null;
  }

  return _generatePathWithLanguage(ROUTER_PATH[ROUTER_NAME['vision-page']]);
}; // getVisionPagePath()

// NOTE - Get payment page path
const getPaymentPagePath = (
  dispatcherParams,
  queryStringParams
) => {
  if(
    !ROUTER_NAME ||
    !ROUTER_PATH ||
    !dispatcherParams
  ) {
    return null;
  }

  dispatcherParams = {
    hotelName: GetSlug(dispatcherParams.hotelName),
    roomName: GetSlug(dispatcherParams.roomName)
  };

  const queryString = (
    queryStringParams ?
    getUrlQueryString(queryStringParams) :
    null
  );

  return _generatePathWithLanguage(
    ROUTER_PATH[ROUTER_NAME.payment],
    dispatcherParams,
    queryString,
  )
}; // getPaymentPagePath()

const getSearchPagePath = () => {
  if(
    !ROUTER_NAME ||
    !ROUTER_PATH
  ) {
    return null;
  }

  return _generatePathWithLanguage(ROUTER_PATH[ROUTER_NAME['search-page']]);
}; // getSearchPagePath()

const getAccountPagePath = () => {
  if(
    !ROUTER_NAME ||
    !ROUTER_PATH
  ) {
    return null;
  }

  return _generatePathWithLanguage(ROUTER_PATH[ROUTER_NAME['account-page']]);
}; // getAccountPagePath()

const getPolicyPagePath = () => {
  if(
    !ROUTER_NAME ||
    !ROUTER_PATH
  ) {
    return null;
  }

  return _generatePathWithLanguage(ROUTER_PATH[ROUTER_NAME['term-condition-page']]);
}; // getPolicyPagePath()

const getSignupPagePath = () => {
  if(
    !ROUTER_NAME ||
    !ROUTER_PATH
  ) {
    return null;
  }

  return _generatePathWithLanguage(ROUTER_PATH[ROUTER_NAME['sign-up-page']]);
}; // getSignupPagePath()

const getAboutUsPagePath = () => {
  if(
    !ROUTER_NAME ||
    !ROUTER_PATH
  ) {
    return null;
  }

  return _generatePathWithLanguage(ROUTER_PATH[ROUTER_NAME['about-us-page']]);
}; // getAboutUsPagePath()

const getTermConditionPagePath = () => {
  if(
    !ROUTER_NAME ||
    !ROUTER_PATH
  ) {
    return null;
  }

  return _generatePathWithLanguage(ROUTER_PATH[ROUTER_NAME['term-condition-page']]);
}; // getTermConditionPagePath()

const getProfilePagePath = () => {
  if(
    !ROUTER_NAME ||
    !ROUTER_PATH
  ) {
    return null;
  }

  return _generatePathWithLanguage(ROUTER_PATH[ROUTER_NAME['profile-page']]);
}; // getProfilePagePath()

// NOTE - get comment page path with hotelSn param
const getCommentPagePath = (
  dispatcherParams,
) => {
  if(
    !ROUTER_NAME ||
    !ROUTER_PATH ||
    !dispatcherParams
  ) {
    return null;
  }

  return _generatePathWithLanguage(
    ROUTER_PATH[ROUTER_NAME['comment-page']],
    dispatcherParams,
  )
}; // getCommentPagePath()

// NOTE - Get list landing page path
const getMapsPagePath = (
  queryStringParams
) => {
  if(
    !ROUTER_NAME ||
    !ROUTER_PATH
  ) {
    return null;
  }

  const queryString = (
    queryStringParams ?
    getUrlQueryString(queryStringParams) :
    null
  );

  return _generatePathWithLanguage(
    ROUTER_PATH[ROUTER_NAME['maps-page']],
    null,
    queryString,
  )
}; // getMapsPagePath()

const getPointPagePath = () => {
  if(
    !ROUTER_NAME ||
    !ROUTER_PATH
  ) {
    return null;
  }

  return _generatePathWithLanguage(ROUTER_PATH[ROUTER_NAME['point-page']]);
}; // getPointPagePath()

const getCouponPagePath = () => {
  if(
    !ROUTER_NAME ||
    !ROUTER_PATH
  ) {
    return null;
  }

  return _generatePathWithLanguage(ROUTER_PATH[ROUTER_NAME['coupon-page']]);
}; // getCouponPagePath()

const getNotFoundPagePath = () => {
  if(
    !ROUTER_NAME ||
    !ROUTER_PATH
  ) {
    return null;
  }

  return _generatePathWithLanguage(ROUTER_PATH[ROUTER_NAME['not-found-page']]);
}; // getNotFoundPagePath()

export {
  getHomePath,
  getLoginPath,
  getUrlQueryString,
  getPromotionDetailPath,
  getPromotionPath,
  getHotelDetailPagePath,
  getRoomDetailPagePath,
  getBlogListPagePath,
  getVisionPagePath,
  getBlogDetailPagePath,
  getPaymentPagePath,
  getSearchPagePath,
  getAccountPagePath,
  getHotelListPath,
  getLocationPagePath,
  getPolicyPagePath,
  getSignupPagePath,
  getAboutUsPagePath,
  getTermConditionPagePath,
  getProfilePagePath,
  getCommentPagePath,
  getMapsPagePath,
  getPointPagePath,
  getCouponPagePath,
  getArticlePath,
  getArticleDetailPath,
  getArticleCategoryPath,
  getNotFoundPagePath,
};
