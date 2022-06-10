import {
  ROUTER_PATH,
} from '@source-js/base/vue-router/router-define';
import {
  isWhitePath,
} from './gateway-handler';

// NOTE - Setup and Generate ROUTER VALID LIST string
const ROUTER_VALID_LIST = JSON.stringify(ROUTER_PATH || {}).replace(/{|}|"[\w?:-]+":\"\/:language\?|\/\",|\/:[\w]+|\/|\?|"/g,'').split(',');
ROUTER_VALID_LIST.push('article');

// NOTE - Define Language ISO Code list
const LANGUAGE_CODE_LIST = ["ab","aa","af","ak","sq","am","ar","an","hy","as","av","ae","ay","az","bm","ba","eu","be","bn","bh","bi","bs","br","bg","my","ca","ch","ce","ny","zh","zh-Hans","zh-Hant","cv","kw","co","cr","hr","cs","da","dv","nl","dz","en","eo","et","ee","fo","fj","fi","fr","ff","gl","gd","gv","ka","de","el","kl","gn","gu","ht","ha","he","hz","hi","ho","hu","is","io","ig","id,in","ia","ie","iu","ik","ga","it","ja","jv","kl","kn","kr","ks","kk","km","ki","rw","rn","ky","kv","kg","ko","ku","kj","lo","la","lv","li","ln","lt","lu","lg","lb","gv","mk","mg","ms","ml","mt","mi","mr","mh","mo","mn","na","nv","ng","nd","ne","no","nb","nn","ii","oc","oj","cu","or","om","os","pi","ps","fa","pl","pt","pa","qu","rm","ro","ru","se","sm","sg","sa","sr","sh","st","tn","sn","ii","sd","si","ss","sk","sl","so","nr","es","su","sw","ss","sv","tl","ty","tg","ta","tt","te","th","bo","ti","to","ts","tr","tk","tw","ug","uk","ur","uz","ve","vi","vo","wa","cy","wo","fy","xh","yi,ji","yo","za","zu"];

// NOTE - Define Country ISO code list
const COUNTRY_CODE_LIST = ["AF","AL","DZ","AS","AD","AO","AQ","AG","AR","AM","AW","AU","AT","AZ","BS","BH","BD","BB","BY","BE","BZ","BJ","BM","BT","BO","BA","BW","BV","BR","IO","BN","BG","BF","BI","KH","CM","CA","CV","KY","CF","TD","CL","CN","CX","CC","CO","KM","CG","CD","CK","CR","CI","HR","CU","CY","CZ","DK","DJ","DM","DO","EC","EG","SV","GQ","ER","EE","ET","FK","FO","FJ","FI","FR","GF","PF","TF","GA","GM","GE","DE","GH","GI","GR","GL","GD","GP","GU","GT","GN","GW","GY","HT","HM","HN","HK","HU","IS","IN","ID","IR","IQ","IE","IL","IT","JM","JP","JO","KZ","KE","KI","KP","KR","KW","KG","LA","LV","LB","LS","LR","LY","LI","LT","LU","MO","MK","MG","MW","MY","MV","ML","MT","MH","MQ","MR","MU","YT","MX","FM","MD","MC","MN","ME","MS","MA","MZ","MM","NA","NR","NP","NL","AN","NC","NZ","NI","NE","NG","NU","NF","MP","NO","OM","PK","PW","PS","PA","PG","PY","PE","PH","PN","PL","PT","PR","QA","RE","RO","RU","RW","SH","KN","LC","PM","VC","WS","SM","ST","SA","SN","RS","SC","SL","SG","SK","SI","SB","SO","ZA","GS","SS","ES","LK","SD","SR","SJ","SZ","SE","CH","SY","TW","TJ","TZ","TH","TL","TG","TK","TO","TT","TN","TR","TM","TC","TV","UG","UA","AE","GB","US","UM","UY","UZ","VU","VE","VN","VG","VI","WF","EH","YE","ZM","ZW"];

export function HandleRedirectUrl(req, res, next) {
  if(
    !req.customizeInfo.enableRedirectChecking
    || !isWhitePath(req.url)
    || !req.botInfo.isBot
  ) {
    next();
    return;
  }

  const pathSplitted = req.customizeInfo.url.split('/');
  const firstDispatcherParam = pathSplitted[1].split('?')[0];

  // NOTE - Check valid locale code id format
  /**
   * ANCHOR - /^[a-z-0-9]{2}(|-[A-Za-z]{2})(?:$)/
   * ANCHOR - &  LANGUAGE_CODE_LIST.indexOf([A-Za-z]{2}.toLowerCase())
   * ANCHOR - || COUNTRY_CODE_LIST.indexOf([A-Za-z]{2}.toUpperCase())
   */
  const isLocaleCodeIdFormatValid = _checkLocaleCodeIdFormatValid(firstDispatcherParam);

  // NOTE - If isLocaleCodeIdFormatValid === false
  /**
   * ANCHOR - firstDispatcherParam is exist and invalid router
   * => next() and return
   */
  if(
    !isLocaleCodeIdFormatValid
    && firstDispatcherParam
    && !ROUTER_VALID_LIST.includes(firstDispatcherParam)
  ) {
    req.customizeInfo.enableRedirectChecking = false;
    req.customizeInfo.hasRedirectRequest = false;
    req.customizeInfo.status = '404';
    next();
    return;
  }

  // NOTE - Else => next step
  const curValidLanguage = _getCurLanguageValid(firstDispatcherParam);
  const urlRedirectWithLocaleCodeId = _getUrlRedirectWithLocaleCodeId(
    req,
    firstDispatcherParam,
    curValidLanguage,
    isLocaleCodeIdFormatValid
  );

  if(urlRedirectWithLocaleCodeId) {
    req.customizeInfo = {
      url: urlRedirectWithLocaleCodeId,
      urlSplitted: urlRedirectWithLocaleCodeId.split('?'),
      enableRedirectChecking: false,
      hasRedirectRequest: true,
      status: '302',
    };
  }

  next();
}

const _getCurLanguageValid = (firstDispatcherParam) => {
  if(
    !firstDispatcherParam ||
    ROUTER_VALID_LIST.includes(firstDispatcherParam)
  ) {
    return 'vi';
  }

  const firstDispatcherParamSplitted = firstDispatcherParam.split('-');

  return (
    ['vi','en'].includes(firstDispatcherParamSplitted[0]?.toLowerCase()) ?
      firstDispatcherParamSplitted[0]?.toLowerCase() :
    ['vi','en'].includes(firstDispatcherParamSplitted[1]?.toLowerCase()) ?
      firstDispatcherParamSplitted[1]?.toLowerCase() :
    'vi'
  );
}; // _getCurLanguageValid()

const _checkLocaleCodeIdFormatValid = (firstDispatcherParam) => {
  if(
    !firstDispatcherParam
    || typeof firstDispatcherParam !== 'string'
    || !/^[a-z-0-9]{2}(|-[A-Za-z]{2})(?:$)/.test(firstDispatcherParam)
  ) {
    return false;
  }

  const firstDispatcherParamSplitted = firstDispatcherParam.split('-');

  return (
    LANGUAGE_CODE_LIST.includes(firstDispatcherParamSplitted[0]?.toLowerCase()) ||
    COUNTRY_CODE_LIST.includes(firstDispatcherParamSplitted[0]?.toUpperCase()) ||
    LANGUAGE_CODE_LIST.includes(firstDispatcherParamSplitted[1]?.toLowerCase()) ||
    COUNTRY_CODE_LIST.includes(firstDispatcherParamSplitted[1]?.toUpperCase())
  );
}; // _checkLocaleCodeIdFormatValid()

const _getUrlRedirectWithLocaleCodeId = (
  req,
  firstDispatcherParam,
  language,
  isLocaleCodeIdFormatValid
) => {
  const curValidLocaleCodeId = language + '-' + req.ipInfo.country.toLowerCase();

  if(curValidLocaleCodeId === firstDispatcherParam) {
    return null;
  }

  return (
    isLocaleCodeIdFormatValid ?
      req.customizeInfo.url.replace(/^[|\/](|[A-Za-z])+(|-)+(|[A-Za-z])+/,'/' + curValidLocaleCodeId) :
    '/' + curValidLocaleCodeId + (req.customizeInfo.url !== '/' ? req.customizeInfo.url : '')
  );
}; // _getUrlRedirectWithLocaleCodeId()
