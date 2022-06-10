import {
  G2J_KEY_CODE,
} from '~jsDefinePath/general';

const _g2jEncrypt = window.Go2JoyEncrypt.call({
  key: G2J_KEY_CODE,
  no_encrypt: true,
});

// NOTE - apiCaller
let apiSetup = (
  objCaller = {
    beforeSend: function() {},
  }
) => {};

// NOTE - apiCaller
let apiCaller = (
  objCaller = {
    method: '',
    url: '',
    data: {},
    headers: {},
    dataType: '',
    contentType: '',

    beforeSend: function() {},

    error: function() {},

    success: function() {},

    complete: function() {},
  }
) => {};

let ApiHandlerGlobal = null;

if(
  window.ApiHandler &&
  typeof window.ApiHandler === 'function'
) {
  ApiHandlerGlobal = window.ApiHandler.call({
    key: _g2jEncrypt(G2J_KEY_CODE),
  });
} else if(typeof window.ApiHandler !== 'function') {
  ApiHandlerGlobal = window.ApiHandler;
}

if(ApiHandlerGlobal) {
  apiSetup = ApiHandlerGlobal.apiSetup;
  apiCaller = ApiHandlerGlobal.apiCaller;
}

export {
  apiSetup,
  apiCaller,
};
