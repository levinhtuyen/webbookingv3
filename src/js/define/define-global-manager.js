import { LOCAL_STORAGE_KEY } from "~jsDefinePath/local-storage";

const DefineGlobalManager = (() => {
  const __generateReadOnlyObject = (obj) => {
    if(typeof obj === 'object') {
      for(const key in obj) {
        Object.defineProperty(
          obj,
          key, {
            value: obj[key],
            writable: false
          }
        );
      }
    } // endfor
  }; // _generateReadOnlyObject()

  const _defineGeneral = () => {
    const BASE_URL = window.PAGE_INFO?.base_url ?? "";

    const LANGUAGE_VALID = {
      vi: "vi",
      en: "en",
    };

    const LANGUAGE_CODE_LIST = ["ab","aa","af","ak","sq","am","ar","an","hy","as","av","ae","ay","az","bm","ba","eu","be","bn","bh","bi","bs","br","bg","my","ca","ch","ce","ny","zh","zh-Hans","zh-Hant","cv","kw","co","cr","hr","cs","da","dv","nl","dz","en","eo","et","ee","fo","fj","fi","fr","ff","gl","gd","gv","ka","de","el","kl","gn","gu","ht","ha","he","hz","hi","ho","hu","is","io","ig","id,in","ia","ie","iu","ik","ga","it","ja","jv","kl","kn","kr","ks","kk","km","ki","rw","rn","ky","kv","kg","ko","ku","kj","lo","la","lv","li","ln","lt","lu","lg","lb","gv","mk","mg","ms","ml","mt","mi","mr","mh","mo","mn","na","nv","ng","nd","ne","no","nb","nn","ii","oc","oj","cu","or","om","os","pi","ps","fa","pl","pt","pa","qu","rm","ro","ru","se","sm","sg","sa","sr","sh","st","tn","sn","ii","sd","si","ss","sk","sl","so","nr","es","su","sw","ss","sv","tl","ty","tg","ta","tt","te","th","bo","ti","to","ts","tr","tk","tw","ug","uk","ur","uz","ve","vi","vo","wa","cy","wo","fy","xh","yi,ji","yo","za","zu"];

    // NOTE - get IP infomation
    const IP_INFO = window.PAGE_INFO?.ip_info ?? {
      range: [ 1984292864, 1984294911 ],
      country: 'VN',
      region: '',
      eu: '0',
      timezone: 'Asia/Ho_Chi_Minh',
      city: '',
      ll: [ 16, 106 ],
      metro: 0,
      area: 50,
    };

    const COUNTRY_CODE_LIST = ["AF","AL","DZ","AS","AD","AO","AQ","AG","AR","AM","AW","AU","AT","AZ","BS","BH","BD","BB","BY","BE","BZ","BJ","BM","BT","BO","BA","BW","BV","BR","IO","BN","BG","BF","BI","KH","CM","CA","CV","KY","CF","TD","CL","CN","CX","CC","CO","KM","CG","CD","CK","CR","CI","HR","CU","CY","CZ","DK","DJ","DM","DO","EC","EG","SV","GQ","ER","EE","ET","FK","FO","FJ","FI","FR","GF","PF","TF","GA","GM","GE","DE","GH","GI","GR","GL","GD","GP","GU","GT","GN","GW","GY","HT","HM","HN","HK","HU","IS","IN","ID","IR","IQ","IE","IL","IT","JM","JP","JO","KZ","KE","KI","KP","KR","KW","KG","LA","LV","LB","LS","LR","LY","LI","LT","LU","MO","MK","MG","MW","MY","MV","ML","MT","MH","MQ","MR","MU","YT","MX","FM","MD","MC","MN","ME","MS","MA","MZ","MM","NA","NR","NP","NL","AN","NC","NZ","NI","NE","NG","NU","NF","MP","NO","OM","PK","PW","PS","PA","PG","PY","PE","PH","PN","PL","PT","PR","QA","RE","RO","RU","RW","SH","KN","LC","PM","VC","WS","SM","ST","SA","SN","RS","SC","SL","SG","SK","SI","SB","SO","ZA","GS","SS","ES","LK","SD","SR","SJ","SZ","SE","CH","SY","TW","TJ","TZ","TH","TL","TG","TK","TO","TT","TN","TR","TM","TC","TV","UG","UA","AE","GB","US","UM","UY","UZ","VU","VE","VN","VG","VI","WF","EH","YE","ZM","ZW"];

    const ARR_ENV = {
      development: "development",
      staging: "staging",
      production: "production",
    };

    const ARR_TYPE = {
      normal: "normal",
      uat: "uat",
    };

    const ENV = PAGE_INFO.env || ARR_ENV.development;

    const ENV_API = PAGE_INFO.env_api || ARR_ENV.development;

    const TYPE = PAGE_INFO.type || ARR_TYPE.normal;

    const _tmpAssetsServiceUrl = window.PAGE_INFO?.assets_service_url;

    const ASSETS_SERVICE_URL_LIST_WITH_ENV = {
      [ARR_ENV.development]: (_tmpAssetsServiceUrl || "https://go2joylocal.s3-ap-southeast-1.amazonaws.com"),
      [ARR_ENV.staging]: (_tmpAssetsServiceUrl || "https://go2joylocal.s3-ap-southeast-1.amazonaws.com"),
      [ARR_ENV.production]: (_tmpAssetsServiceUrl || "https://go2joy.s3-ap-southeast-1.amazonaws.com"),
    };

    const getApiUrl = PAGE_INFO?.get_api_url ?? null;

    const getToken = function () {
      return localStorage.getItem(LOCAL_STORAGE_KEY.G2J_TOKEN)
        ? "Bearer " + localStorage.getItem(LOCAL_STORAGE_KEY.G2J_TOKEN)
        : "";
    };

    // NOTE - Detect Mobile / Desktop device, iOS , safari, chrome
    const ua = window.navigator.userAgent;

    // NOTE - IS_MOBILE
    let IS_MOBILE = false;

    // device detection
    // resource : https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
        ua
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        ua.substr(0, 4)
      )
    ) {
      IS_MOBILE = true;
    }

    const IS_CHROME_BROWSER =
      !!window.chrome &&
      (!!window.chrome.webstore ||
        !!window.chrome.runtime ||
        ua.includes("Chrome"));

    const IS_SAFARI_BROWSER = ua.includes("Safari");

    const IS_ANDROID = /android/i.test(ua);

    const IS_IOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;

    // NOTE - Swiper freemode configuation
    const SWIPER_FREEMODE_CONFIG = (function () {
      if (IS_MOBILE) {
        return {
          freeMode: true,
          freeModeMomentumBounce: false,
          freeModeMinimumVelocity: 0.03,
          freeModeMomentumVelocityRatio: 1,
          freeModeMomentumRatio: 0.7,
        };
      }

      return {
        freeMode: true,
        freeModeMomentumBounce: false,
        freeModeMinimumVelocity: 0.4,
        freeModeMomentumVelocityRatio: 0.4,
        // freeModeMomentumRatio: 0.8,
      };
    })(); // SWIPER_FREEMODE_CONFIG

    // NOTE - Encrypt code
    const _g2jEncrypt = window.Go2JoyEncrypt.call();

    const isEncryptParamValid = (key, noEncrypt = false) => {
      if(ENV === ARR_ENV.development) {
        return true;
      } else if (noEncrypt) {
        return key === String("Go2Joy_" + Date.now()).slice(0, -7);
      }

      return key === _g2jEncrypt(String("Go2Joy_" + Date.now()).slice(0, -7));
    };

    // NOTE - Define list environment to detect register web device encode
    const ARR_UUID_INFO = {
      [ARR_ENV.development]: {
        base_url: getApiUrl(
          'v3',
          ARR_ENV.development
        ),

        key: null,
      },
      [ARR_ENV.staging]: {
        base_url: getApiUrl(
          'v3',
          ARR_ENV.staging
        ),

        key: null,
      },
      [ARR_ENV.production]: {
        base_url: getApiUrl(
          'v3',
          ARR_ENV.production
        ),

        key: null,
      },
    };

    // NOTE - local storage uuid key for development
    if(ARR_UUID_INFO[ARR_ENV.development]) {
      ARR_UUID_INFO[ARR_ENV.development].key =
      ARR_UUID_INFO[ARR_ENV.development].base_url.replace('/v3', '') +
      ARR_UUID_INFO[ARR_ENV.staging].base_url.replace('/v3', '') +
      ARR_UUID_INFO[ARR_ENV.production].base_url.replace('/v3', '');
      ARR_UUID_INFO[ARR_ENV.development].key = _g2jEncrypt(ARR_UUID_INFO[ARR_ENV.development].key);
    }

    // NOTE - local storage uuid key for staging
    if(ARR_UUID_INFO[ARR_ENV.staging]) {
      ARR_UUID_INFO[ARR_ENV.staging].key = ARR_UUID_INFO[ARR_ENV.staging].base_url.replace('/v3', '');

      ARR_UUID_INFO[ARR_ENV.staging].key = _g2jEncrypt(ARR_UUID_INFO[ARR_ENV.staging].key);
    }

    // NOTE - local storage uuid key for production
    if(ARR_UUID_INFO[ARR_ENV.production]) {
      ARR_UUID_INFO[ARR_ENV.production].key = ARR_UUID_INFO[ARR_ENV.production].base_url.replace('/v3', '');

      ARR_UUID_INFO[ARR_ENV.production].key = _g2jEncrypt(ARR_UUID_INFO[ARR_ENV.production].key);
    }

    // NOTE - detect if need update device encode for api
    const MUST_UPDATE_DEVICE_ENCODE = (
      // NOTE - current eviroment is development and least in uuid info key of (development, staging, production) changed
      (
        ENV_API === ARR_ENV.development &&
        (
          ARR_UUID_INFO[ARR_ENV.development] &&
          !localStorage[ARR_UUID_INFO[ARR_ENV.development].key]
        )
      ) ||
      // NOTE - current eviroment is staging and uuid info key of staging changed
      (
        ENV_API === ARR_ENV.staging &&
        !localStorage[(ARR_UUID_INFO[ARR_ENV.staging].key)]
      ) ||
      // NOTE - current eviroment is staging and uuid info key of staging changed
      (
        ENV_API === ARR_ENV.production &&
        !localStorage[(ARR_UUID_INFO[ARR_ENV.production].key)]
      )
    );

    // NOTE - get bot infomation
    const BOT_INFO = window.PAGE_INFO?.bot_info ?? {};

    let Go2JoyDefineGeneralTmp = {
      BASE_URL,
      LANGUAGE_VALID,
      LANGUAGE_CODE_LIST,
      IP_INFO,
      COUNTRY_CODE_LIST,
      IS_MOBILE,
      IS_CHROME_BROWSER,
      IS_SAFARI_BROWSER,
      IS_IOS,
      IS_ANDROID,
      //================
      PAGE_INFO,
      ENV,
      ENV_API,
      TYPE,
      getApiUrl,
      getToken,
      ASSETS_SERVICE_URL_LIST_WITH_ENV,
      //================
      SWIPER_FREEMODE_CONFIG,
      isEncryptParamValid,
      ARR_UUID_INFO,
      MUST_UPDATE_DEVICE_ENCODE,
      BOT_INFO,
    };

    __generateReadOnlyObject(Go2JoyDefineGeneralTmp);

    Object.defineProperty(
      window,
      'Go2JoyDefineGeneral', {
        value: Go2JoyDefineGeneralTmp,
        writable: false,
      }
    )
  }; // _defineGeneral()

  return {
    init() {
      _defineGeneral();
    },
  };
})();

export {
  DefineGlobalManager,
};
