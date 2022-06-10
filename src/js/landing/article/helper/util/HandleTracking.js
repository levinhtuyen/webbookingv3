import {
  G2J_KEY_CODE,
} from '~jsDefinePath/general';

const _g2jEncrypt = window.Go2JoyEncrypt.call({
  key: G2J_KEY_CODE,
  no_encrypt: true,
});

// NOTE - firebase
let G2JFirebase = {
  analytics: () => {
    return {
      logEvent: () => {},
    }
  },
};

if(window.firebase) {
  if(typeof window.firebase === 'function') {
    G2JFirebase = window.firebase.call({
      key: _g2jEncrypt(G2J_KEY_CODE),
    });
  } else {
    G2JFirebase = window.firebase;
  }
}

// NOTE - dablena
let G2JDablena = () => {};
let G2JDablenaTracking = () => {};

if(window.dablena) {
  G2JDablena = window.dablena.call({
    key: _g2jEncrypt(G2J_KEY_CODE),
  });

  if(typeof G2JDablena === 'function') {
    G2JDablenaTracking = (trackingName) => {
      // G2JDablena('init', '005-002-983');
      G2JDablena('track', trackingName);
    };
  } else {
    G2JDablena = () => {};
  }
}

export {
  G2JFirebase,

  G2JDablena,
  G2JDablenaTracking,
};
