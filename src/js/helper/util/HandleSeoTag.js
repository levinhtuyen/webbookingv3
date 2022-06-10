import {
  G2J_KEY_CODE,
} from '~jsDefinePath/general';

const _g2jEncrypt = window.Go2JoyEncrypt.call({
  key: G2J_KEY_CODE,
  no_encrypt: true,
});

// NOTE - firebase
let HandleSeoTag = {
  setup() {},
  remove() {},
  setupRobots() {},
  removeRobots() {},
  setupCanonical() {},
  removeCanonical() {},
};

if(window.SeoTagHandler) {
  if(typeof window.SeoTagHandler === 'function') {
    HandleSeoTag = window.SeoTagHandler.call({
      key: _g2jEncrypt(G2J_KEY_CODE),
    });
  } else {
    HandleSeoTag = window.SeoTagHandler;
  }
}

export {
  HandleSeoTag,
};
