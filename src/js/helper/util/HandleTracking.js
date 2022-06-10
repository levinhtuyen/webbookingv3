import {
  G2J_KEY_CODE,
} from '~jsDefinePath/general';

const _g2jEncrypt = window.Go2JoyEncrypt.call({
  key: G2J_KEY_CODE,
  no_encrypt: true,
});

// NOTE - Firebase
if(!window.G2JFirebaseTrackingWaitingList) {
  window.G2JFirebaseTrackingWaitingList = {};
}

let G2JFirebase = {
  analytics: () => {
    if(typeof window.firebase?.call === 'function') {
      G2JFirebase = window.firebase.call({
        key: _g2jEncrypt(G2J_KEY_CODE),
      });

      return G2JFirebase.analytics();
    } else {
      return {
        logEvent: (trackingName, objMessage) => {
          window.G2JFirebaseTrackingWaitingList[trackingName] = objMessage;
          // console.log(trackingName);
        },
      }
    }
  },

  auth: window.firebase?.auth || {}
};

if(typeof window.firebase?.call === 'function') {
  G2JFirebase = window.firebase.call({
    key: _g2jEncrypt(G2J_KEY_CODE),
  })
}

// NOTE - Dablena
if(!window.G2JDablenaTrackingWaitingList) {
  window.G2JDablenaTrackingWaitingList = [];
}

let G2JDablena = (
  window.dablena?.is_locked === 'function' ?
    window.dablena.call({
      key: _g2jEncrypt(G2J_KEY_CODE),
    }) :
  null
);

const G2JDablenaTracking = (trackingName) => {
  if(typeof G2JDablena === 'function') {
    G2JDablena('track', trackingName);
  } else if(window.dablena?.is_locked) {
    G2JDablena = window.dablena.handler.call({
      key: _g2jEncrypt(G2J_KEY_CODE),
    });

    G2JDablena('track', trackingName);
  } else {
    window.G2JDablenaTrackingWaitingList.push(trackingName);
  }
};

// NOTE - Fbq
if(!window.G2JFbqTrackingWaitingList) {
  window.G2JFbqTrackingWaitingList = {};
}

let G2JFbq = (
  window.fbq?.is_locked ?
    window.fbq.handler.call({
      key: _g2jEncrypt(G2J_KEY_CODE),
    }) :
  null
);

const G2JFbqTracking = (trackingName, content) => {
  if(typeof G2JFbq === 'function') {
    G2JFbq('track', trackingName, content);
  } else if(window.fbq?.is_locked) {
    G2JFbq = window.fbq.handler.call({
      key: _g2jEncrypt(G2J_KEY_CODE),
    });

    G2JFbq('track', trackingName, content);
  } else {
    window.G2JFbqTrackingWaitingList[trackingName] = content;
  }
};

export {
  G2JFirebase,

  G2JDablenaTracking,
  G2JFbqTracking
};
