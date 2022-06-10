import {
  isWhitePath,
} from './gateway-handler';
const querystring = require('querystring');

export function HandleRedirectUrl(req, res, next) {
  // NOTE - If url is static then next()
  if(
    !req.customizeInfo.enableRedirectChecking
    || !isWhitePath(req.customizeInfo.url)
  ) {
    next();
    return;
  }

  if(/\/hotellist\/[A-Za-z-0-9]+(?:$|\?)/.test(req.customizeInfo.url)) {
    // ANCHOR - Handle format url for hotellist
    // ANCHOR - Format query string
    const tmpObjCorrectQueryString = {};

    if(typeof req.query === 'object') {
      const queryStringValidList = ['bookingType', 'checkInDatePlan', 'endDate', 'hashtagSn', 'nearBy', 'bedType', 'facility', 'maxPrice', 'minPrice', 'paymentMethod', 'roomView', 'promotion', 'hasProgramBar', 'hasFilter', 'sort', 'limit'];

      for(const key in req.query) {
        if(queryStringValidList.includes(key)) {
          tmpObjCorrectQueryString[key] = decodeURIComponent(req.query[key]);
        }
      }
    }

    // ANCHOR - Correct dispatcher url
    let tmpCorrectDispatcherUrl = req.customizeInfo.urlSplitted[0].replace(/-[A-Za-z]+(?:$)/, '');

    if(!/(1001|1002|1003)(|[A-Za-z-0-9]+)(?:$)/.test(tmpCorrectDispatcherUrl)) {
      let tmpDispatcherId = (
        req.query.hotelCollectionSn ?
          '1003'+req.query.hotelCollectionSn :
        (
          req.query.provinceSn ?
            '1001'+req.query.provinceSn :
          ''
        ) +
        (
          req.query.districtSn ?
            '1002'+req.query.districtSn :
          ''
        )
      );

      tmpCorrectDispatcherUrl+=(tmpDispatcherId ? '-'+tmpDispatcherId : '');
    }

    //-- ANCHOR - Correct hotel collection sn if exist
    // replace -1003[A-Za-z]+(?:$) to valid if hotelCollectionSn exist
    if(
      /-1003(|[A-Za-z]+)(?:$)/.test(tmpCorrectDispatcherUrl) &&
      req.query.hotelCollectionSn &&
      /^[0-9]+$/.test(req.query.hotelCollectionSn)
    ) {
      tmpCorrectDispatcherUrl=tmpCorrectDispatcherUrl.replace(/-1003(|[A-Za-z]+)(?:$)/, '-1003'+req.query.hotelCollectionSn);
    }

    //-- ANCHOR - Correct province sn exist
    // replace -1001(|[A-Za-z])+(?:$) to valid if provinceSn exist
    if(
      /-1001(|[A-Za-z]+)1002[A-Za-z-0-9]+(?:$)/.test(tmpCorrectDispatcherUrl) &&
      req.query.provinceSn &&
      /^[0-9]+$/.test(req.query.provinceSn)
    ) {
      tmpCorrectDispatcherUrl=tmpCorrectDispatcherUrl.replace(/-1001([A-Za-z]+|)/, '-1001'+req.query.provinceSn);
    }

    //-- ANCHOR - Correct district sn exist
    // replace -[0-9]+1002(|[0-9]+)(?:$) to valid if districtSn exist
    if(
      /-(|[0-9]+)1002(|[A-Za-z]+)(?:$)/.test(tmpCorrectDispatcherUrl) &&
      req.query.districtSn &&
      /^[0-9]+$/.test(req.query.districtSn)
    ) {
      tmpCorrectDispatcherUrl=tmpCorrectDispatcherUrl.replace(/1002(|[A-Za-z]+)(?:$)/, '1002'+req.query.districtSn);
    }

    let tmpCorrectUrl = tmpCorrectDispatcherUrl + (
      JSON.stringify(tmpObjCorrectQueryString) === '{}' ?
        '' :
      '?'+querystring.stringify(tmpObjCorrectQueryString)
    );

    if(decodeURIComponent(tmpCorrectUrl) !== decodeURIComponent(req.customizeInfo.url)) {
      req.query = tmpObjCorrectQueryString;
      req.customizeInfo = {
        url: tmpCorrectUrl,
        urlSplitted: tmpCorrectUrl.split('?'),
        enableRedirectChecking: true,
        hasRedirectRequest: true,
        status: '302',
      };
    }
  } else if(/\/hoteldetail\/[A-Za-z-0-9]+(?:$|\?)/.test(req.customizeInfo.url)) {
    // ANCHOR - Handle format url for hotellist
    // ANCHOR - Format query string
    const tmpObjCorrectQueryString = {};

    if(req.query.bookingType) {
      tmpObjCorrectQueryString['bookingType'] = (['1','2','3'].indexOf(req.query.bookingType) ? req.query.bookingType : '1');
    }

    if(
      req.query.startDate &&
      /^[2-9]{1}[0-9]{3}-[0-1]{1}[1-9]{1}-[0-3]{1}[0-9]{1}/.test(req.query.startDate)
    ) {
      tmpObjCorrectQueryString['startDate'] = decodeURIComponent(req.query.startDate);
    }

    if(
      req.query.endDate &&
      /^[2-9]{1}[0-9]{3}-[0-1]{1}[1-9]{1}-[0-3]{1}[0-9]{1}/.test(req.query.endDate)
    ) {
      tmpObjCorrectQueryString['endDate'] = decodeURIComponent(req.query.endDate);
    }

    if(
      req.query.startTime &&
      /^[0-9]{2}\:[0-9]{2}(?:$)/.test(req.query.startTime)
    ) {
      tmpObjCorrectQueryString['startTime'] = decodeURIComponent(req.query.startTime);
    }

    if(
      req.query.endTime &&
      /^[0-9]{2}\:[0-9]{2}(?:$)/.test(req.query.endTime)
    ) {
      tmpObjCorrectQueryString['endTime'] = decodeURIComponent(req.query.endTime);
    }

    if(req.query.mode) {
      tmpObjCorrectQueryString['mode'] = req.query.mode;
    }

    // ANCHOR - Correct dispatcher url
    let tmpCorrectDispatcherUrl = req.customizeInfo.urlSplitted[0]
    .replace(/-[A-Za-z]+(?:$)/, '')
    .replace('-0004', '-100004');

    if(!/100004(|[A-Za-z-0-9]+)(?:$)/.test(tmpCorrectDispatcherUrl)) {
      let tmpDispatcherId = (
        req.query.hotelSn ?
          '100004'+req.query.hotelSn :
        ''
      );

      tmpCorrectDispatcherUrl+=(tmpDispatcherId ? '-'+tmpDispatcherId : '');
    }

    //-- ANCHOR - Correct hotel sn exist
    // replace -100004(|[A-Za-z])+(?:$) to valid if hotelSn exist
    if(
      /-100004([A-Za-z]+|)(?:$)/.test(tmpCorrectDispatcherUrl) &&
      req.query.hotelSn &&
      /^[0-9]+$/.test(req.query.hotelSn)
    ) {
      tmpCorrectDispatcherUrl=tmpCorrectDispatcherUrl.replace(/-100004([A-Za-z]+|)/, '-100004'+req.query.hotelSn);
    }

    let tmpCorrectUrl = tmpCorrectDispatcherUrl + (
      JSON.stringify(tmpObjCorrectQueryString) === '{}' ?
        '' :
      '?'+querystring.stringify(tmpObjCorrectQueryString)
    );

    if(decodeURIComponent(tmpCorrectUrl) !== decodeURIComponent(req.customizeInfo.url)) {
      req.query = tmpObjCorrectQueryString;
      req.customizeInfo = {
        url: tmpCorrectUrl,
        urlSplitted: tmpCorrectUrl.split('?'),
        enableRedirectChecking: true,
        hasRedirectRequest: true,
        status: '302',
      };
    }
  }

  next();
}; // HandleRedirectUrl()
