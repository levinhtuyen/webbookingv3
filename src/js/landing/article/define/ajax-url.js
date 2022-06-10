import {
  API_VERSION,
  BASE_DEV_API_INFO,
  BASE_STAGING_API_INFO,
  BASE_API_INFO
} from '~jsDefinePath/api-define';

/**
 * NOTE
 * AJAX_URL = {
 *    api_group_key: {
 *      api_key_01: {
          ...BASE_STAGING_API_INFO[API_VERSION.v3],
          path: String,
        },

        api_key_02:
          BASE_STAGING_API_INFO[API_VERSION.v2].base_url +
          path:String,
    *   }
 * }
 */
const AJAX_URL = {

};

// NOTE - the bottom syntax use for print all api with specify version
// let arrAjaxUrl = [];

// for(const objAjaxItemKey in AJAX_URL) {
//   for(const ajaxItemInfoKey in AJAX_URL[objAjaxItemKey]) {
//     if(
//       typeof AJAX_URL[objAjaxItemKey][ajaxItemInfoKey] === 'string' &&
//       AJAX_URL[objAjaxItemKey][ajaxItemInfoKey].includes(API_VERSION.v1)
//     ) {
//       const path = AJAX_URL[objAjaxItemKey][ajaxItemInfoKey].split(API_VERSION.v1)[1];

//       if(path) {
//         arrAjaxUrl.push(path.replace('?',''));
//       }
//     } else if(
//       typeof AJAX_URL[objAjaxItemKey][ajaxItemInfoKey] === 'object' &&
//       AJAX_URL[objAjaxItemKey][ajaxItemInfoKey].base_url.includes(API_VERSION.v1)
//     ) {
//       arrAjaxUrl.push(AJAX_URL[objAjaxItemKey][ajaxItemInfoKey].path.replace('?',''));
//     }
//   }
// }

// console.log(arrAjaxUrl);

export {
  AJAX_URL,
};
