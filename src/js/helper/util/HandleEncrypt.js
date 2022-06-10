import {
  G2J_KEY_CODE,
} from '~jsDefinePath/general';

let G2JEncrypt = function() {return null};

if(
  window.Go2JoyEncrypt &&
  !G2JEncrypt()
) {
  G2JEncrypt = window.Go2JoyEncrypt.call({
    key: G2J_KEY_CODE,
  });
}

export {
  G2JEncrypt,
};
