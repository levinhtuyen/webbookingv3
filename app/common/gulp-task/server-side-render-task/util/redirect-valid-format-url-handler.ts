import {
  isWhitePath,
} from './gateway-handler';
const querystring = require('querystring');

export function HandleRedirectUrl(req, res, next) {
  if(
    !req.customizeInfo.enableRedirectChecking
    || !isWhitePath(req.customizeInfo.url)
  ) {
    next();
    return;
  }

  let tmpCorrectDispatcherUrl = req.customizeInfo.urlSplitted[0] || '';
  const tmpObjCorrectQueryString = {};

  if(
    tmpCorrectDispatcherUrl &&
    /\/\/|\-\-|\-\/|\/\-|(\/|\-)$/.test(tmpCorrectDispatcherUrl)
  ) {
    tmpCorrectDispatcherUrl=tmpCorrectDispatcherUrl.replace(/--+/g, '-');
    tmpCorrectDispatcherUrl=tmpCorrectDispatcherUrl.replace(/\/\/+/g, '/');
    tmpCorrectDispatcherUrl=tmpCorrectDispatcherUrl.replace(/(\-+)?\/(\-+)?/g,'/');

    // NOTE - ignore case domain slash "/"
    if(tmpCorrectDispatcherUrl!== '/') {
      tmpCorrectDispatcherUrl=tmpCorrectDispatcherUrl.replace(/(\/|-|\/-)$/g,'');
    }
  }

  if(typeof req.query === 'object') {
    for(const queryStringKey in req.query) {
      if(req.query[queryStringKey]) {
        // tmpObjCorrectQueryString[queryStringKey] = decodeURIComponent(req.query[queryStringKey]);
        tmpObjCorrectQueryString[queryStringKey] = req.query[queryStringKey];
      }
    }
  }

  const correctUrl=tmpCorrectDispatcherUrl+(
    JSON.stringify(tmpObjCorrectQueryString) === '{}' ?
      '' :
    '?'+querystring.stringify(tmpObjCorrectQueryString)
  );

  if(decodeURIComponent(correctUrl) !== decodeURIComponent(req.customizeInfo.url)) {
    req.query = tmpObjCorrectQueryString;
    req.customizeInfo = {
      url: correctUrl,
      urlSplitted: correctUrl.split('?'),
      enableRedirectChecking: true,
      hasRedirectRequest: true,
      status: '302',
    };
  }

  next();
};
