import axios from "axios";
import { LOCAL_STORAGE_KEY } from "~jsDefinePath/local-storage";

// NOTE - create instance for axios
const AxiosInstance = axios.create({
  headers: {
    "Device-Encode": "device_for_web",
    "Secret-Code": "7bc79fa5139b8266e12993014bb68911",
    Localization: localStorage[LOCAL_STORAGE_KEY.G2J_TRANSLATE_LANGUAGE],
  },
});

// NOTE - create interface to make right config for axios
const AXIOS_SETUP_DEFAULT_INTERFACE = {
  method: function (objSetup) {
    const strMethod = String(objSetup.method).toUpperCase();
    return ["GET", "POST", "PUT"].includes(strMethod) ? strMethod : "GET";
  },
  headers: function (objSetup) {
    if (objSetup.headers && typeof objSetup.headers === "object") {
      return objSetup.headers;
    }
  },
  url: function (objSetup) {
    return objSetup.url;
  },
  params: function (objSetup) {
    if (
      objSetup.data &&
      (typeof objSetup.data === "object" ||
        typeof objSetup.data === "string") &&
      this.method(objSetup) === "GET"
    ) {
      return objSetup.data;
    }
  },
  data: function (objSetup) {
    if (
      objSetup.data &&
      (typeof objSetup.data === "object" ||
        typeof objSetup.data === "string") &&
      ["POST", "PUT"].includes(this.method(objSetup))
    ) {
      return objSetup.data;
    }
  },
};

let beforeSendCallbackGlobal = null;

export const ApiSetup = (objSetup) => {
  const syntaxErrorList = [];

  // NOTE - validate make sure 'beforeSend' exist and url is function of type
  if (objSetup.beforeSend && typeof objSetup.beforeSend !== "function") {
    syntaxErrorList.push("The 'beforeSend' param must be function type!");
  }

  if (syntaxErrorList.length) {
    syntaxErrorList.forEach(function (errMess) {
      console.error(errMess);
    });

    return;
  }

  beforeSendCallbackGlobal = objSetup.beforeSend;
}; // ApiSetup

export const ApiCaller = (
  objCaller = {
    method: "GET",
    url: "",
    queryString: {},
    data: {},
    headers: {},
    dataType: "",
    contentType: "",

    beforeSend: function () {},

    error: function () {},

    success: function () {},

    complete: function () {},
  }
) => {
  const syntaxErrorList = [];

  // NOTE - validate make sure 'url' exist or url is string of type
  if (!objCaller.url && !objCaller.metaUrl) {
    syntaxErrorList.push("The 'url' param must be set!");
  }

  // NOTE - validate make sure if 'headers' exist is object type
  if (!objCaller.headers) {
    objCaller.headers = {};
  } else if (typeof objCaller.headers !== "object") {
    syntaxErrorList.push("The 'headers' param must be object type!");
  }

  // NOTE - validate make sure if 'contentType' exist is string type
  if (typeof objCaller.contentType === "string") {
    objCaller.headers = {
      ...objCaller.headers,
      "Content-Type": objCaller.contentType,
    };
  }

  // NOTE - validate make sure 'error' exist and url is function of type
  if (!objCaller.error) {
    objCaller.error = function* () {};
  } else if (typeof objCaller.error !== "function") {
    syntaxErrorList.push("The 'error' param must be function type!");
  }

  // NOTE - validate make sure 'success' exist and url is function of type
  if (!objCaller.success) {
    objCaller.success = function () {};
  } else if (typeof objCaller.success !== "function") {
    syntaxErrorList.push("The 'success' param must be function type!");
  }

  // NOTE - validate make sure 'complete' exist and url is function of type
  if (!objCaller.complete) {
    objCaller.complete = function () {};
  } else if (typeof objCaller.complete !== "function") {
    syntaxErrorList.push("The 'complete' param must be function type!");
  }

  if (syntaxErrorList.length) {
    syntaxErrorList.forEach(function (errMess) {
      console.error(errMess);
    });

    return;
  }

  const configFormatted = {};

  for (const interfaceKey in AXIOS_SETUP_DEFAULT_INTERFACE) {
    const val = AXIOS_SETUP_DEFAULT_INTERFACE[interfaceKey](objCaller);

    if (val) {
      configFormatted[interfaceKey] = val;
    }
  }

  if (beforeSendCallbackGlobal) {
    beforeSendCallbackGlobal(objCaller, configFormatted);
  }

  if (objCaller.beforeSend && typeof objCaller.beforeSend === "function") {
    objCaller.beforeSend(objCaller, configFormatted);
  }

  if (
    typeof objCaller.queryString === "object" &&
    configFormatted.method === "POST"
  ) {
    // NOTE - generate query string
    // https://attacomsian.com/blog/javascript-convert-object-to-query-string-parameters#:~:text=The%20simplest%20way%20to%20convert,%5Bkey%5D%7D%60)%20.
    configFormatted.url +=
      "?" +
      Object.keys(objCaller.queryString)
        .map((key) => `${key}=${objCaller.queryString[key]}`)
        .join("&");
  }

  // NOTE - setup for abort event
  const controller = new AbortController();
  configFormatted.signal = controller.signal;

  // document.body.prepend(JSON.stringify(configFormatted));

  // NOTE - Cache api into localStorage for development environment
  if (window.PAGE_INFO?.env === "development") {
    const apiUrlPartialList =
      /^http(?:|s):\/\/(([Aa-zZ|0-9-]+[.|]{0,1}){0,2}vn|([0-9]+[.|]{0,1}){4})\/api\/(v1|v2|v3|v4)\/web-booking\/(home\/getIconCollectionList|home\/getBannerList|home\/getDisplayCollectionList|home\/getArticleList|home\/getHotelOfCollectionList|chooseArea\/findAllProvinceCity|hotel\/getFacilityList|hotel\/getRoomTypeList|hotel\/getRoomTypeDetail|hotel\/getHotelSuggestionForHotelDetail|articleHome\/getDisplayTypeArticleList|hotel\/getHotelDetail|hotel\/getHotelSearchList)/.exec(
        configFormatted.url
      ) || [];

    var apiKey = apiUrlPartialList[apiUrlPartialList.length - 1] || null;
    const apiPath = apiUrlPartialList[0] || null;

    const curQueryJsonFormatted =
      typeof objCaller.queryString === "object"
        ? JSON.stringify(objCaller.queryString)
        : "";
    const curParamsJsonFormatted =
      typeof objCaller.data === "object" ? JSON.stringify(objCaller.data) : "";

    var localStorageResponse = localStorage[apiKey]
      ? JSON.parse(localStorage[apiKey])
      : {};

    if (
      apiUrlPartialList.length &&
      localStorageResponse.response &&
      localStorageResponse.path === apiPath &&
      localStorageResponse.query === curQueryJsonFormatted &&
      localStorageResponse.params === curParamsJsonFormatted
    ) {
      return new Promise((res) => {
        res(localStorageResponse.response);
      }).then(function () {
        objCaller.success(localStorageResponse.response);
        objCaller.complete(localStorageResponse.response);
        return localStorageResponse.response;
      });
    } else {
      localStorageResponse = {
        path: apiPath,
        query: curQueryJsonFormatted,
        params: curParamsJsonFormatted,
        response: null,
      };
    }
  }
  //-- Cache api into localStorage for development environment

  const handleApiCaller = AxiosInstance(configFormatted);

  return handleApiCaller
    .then(function (res) {
      objCaller.success(res.data);

      // NOTE - Cache api into localStorage for development environment
      if (
        window.PAGE_INFO?.env === "development" &&
        res.data &&
        apiKey &&
        localStorageResponse &&
        !localStorageResponse.response
      ) {
        localStorageResponse.response = res.data;
        localStorage.setItem(apiKey, JSON.stringify(localStorageResponse));
      }
      //-- Cache api into localStorage for development environment

      return res.data;
    })
    .catch(function (error) {
      objCaller.error(error?.response);
      objCaller.success(error?.response?.data);
      return error;
    })
    .finally(function (res) {
      objCaller.complete(res);
      return res;
    });
}; // ApiCaller()
