import {
  G2J_KEY_CODE,
} from '~jsDefinePath/general';

const _g2jEncrypt = window.Go2JoyEncrypt.call({
  key: G2J_KEY_CODE,
  no_encrypt: true,
});

// NOTE - G2JVueTemplate
let G2JVueTemplate = null;

if(window.Go2JoyVueTemplate) {
  G2JVueTemplate = (() => {
    return window.Go2JoyVueTemplate.call({key: _g2jEncrypt(G2J_KEY_CODE)});
  })();
}

export {
  G2JVueTemplate,
}
