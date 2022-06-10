import {
  G2J_KEY_CODE,
} from '~jsDefinePath/general';

const _g2jEncrypt = window.Go2JoyEncrypt.call({
  key: G2J_KEY_CODE,
  no_encrypt: true,
});

// NOTE - G2JRouter
let G2JRouter = {
  push: function() {},
  replace: function() {},
  go: function() {},
};

// NOTE - G2JRoute
let getG2JRoute = () => {
  return {
    fullPath: '',
    name: '',
    params: {},
    query: '',
  };
};

if(window.Go2JoyRouter) {
  G2JRouter = (() => {
    return window.Go2JoyRouter.call({key: _g2jEncrypt(G2J_KEY_CODE)});
  })();

  getG2JRoute = () => (G2JRouter.app?._route ?? getG2JRoute());
}

export {
  G2JRouter,
  getG2JRoute,
}
