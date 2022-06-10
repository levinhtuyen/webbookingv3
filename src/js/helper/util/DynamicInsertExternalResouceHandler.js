Object.defineProperty(
  window,
  'G2J_EXTERNAL_RESOURCE_ON_PAGE', {
    value: [],
    writable: false
  }
);

export const DynamicInsertExternalResouceHandler = (resourceInfo) => {
  const BOT_INFO = window.PAGE_INFO?.bot_info ?? [];

  if(!resourceInfo.name) {
    console.error("The 'name' param need be set!");
    return;
  } else if(
    typeof window.G2J_EXTERNAL_RESOURCE_ON_PAGE === 'object' &&
    !window.G2J_EXTERNAL_RESOURCE_ON_PAGE[resourceInfo.name]
  ) {
    window.G2J_EXTERNAL_RESOURCE_ON_PAGE[resourceInfo.name] = {
      css: !(
        resourceInfo.css &&
        typeof resourceInfo.css === 'object' &&
        resourceInfo.css.href &&
        typeof resourceInfo.css.href === 'string' &&
        resourceInfo.css.href.includes('http')
      ),
      js: !(
        resourceInfo.js &&
        typeof resourceInfo.js === 'object' &&
        resourceInfo.js.src &&
        typeof resourceInfo.js.src === 'string' &&
        resourceInfo.js.src.includes('http')
      ),
    };
  }

  const arrPromiseList = {
    css: new Promise((res) => {
      res();
    }),
    js: new Promise((res) => {
      res();
    }),
  };

  if(
    window.G2J_EXTERNAL_RESOURCE_ON_PAGE[resourceInfo.name].css &&
    window.G2J_EXTERNAL_RESOURCE_ON_PAGE[resourceInfo.name].js
  ) {
    return arrPromiseList;
  }

  let elOnPageStyle = null;
  let elOnPageScript = null;

  if(!window.G2J_EXTERNAL_RESOURCE_ON_PAGE[resourceInfo.name].css) {
    elOnPageStyle = document.head.querySelector(`[href="${ resourceInfo.css.href }"]`);

    if(elOnPageStyle) {
      arrPromiseList.css = new Promise((res, rej) => {
        window.G2J_EXTERNAL_RESOURCE_ON_PAGE[resourceInfo.name].css = true;
        res();
      });
    } else {
      elOnPageStyle = document.createElement('link');
      elOnPageStyle.rel = "stylesheet";
      elOnPageStyle.href = resourceInfo.css.href;

      if(
        resourceInfo.css.integrity &&
        !BOT_INFO.isBot
      ) {
        elOnPageStyle.setAttribute('integrity', resourceInfo.css.integrity);
      }

      if(
        resourceInfo.css.crossorigin &&
        resourceInfo.css.crossorigin.show
      ) {
        elOnPageStyle.setAttribute('crossorigin', resourceInfo.css.crossorigin.value);
      }

      document.head.appendChild(elOnPageStyle);

      arrPromiseList.css = new Promise((res, rej) => {
        elOnPageStyle.onload = function() {
          window.G2J_EXTERNAL_RESOURCE_ON_PAGE[resourceInfo.name].css = true;
          res();
        }
        elOnPageStyle.onerror = function () {
          rej();
        }
      });
    }
  }

  if(!window.G2J_EXTERNAL_RESOURCE_ON_PAGE[resourceInfo.name].js) {
    elOnPageScript = document.head.querySelector(`[src="${ resourceInfo.js.src }"]`);

    if(elOnPageScript) {
      arrPromiseList.js = new Promise((res, rej) => {
        window.G2J_EXTERNAL_RESOURCE_ON_PAGE[resourceInfo.name].js = true;
        res();
      });
    } else {
      elOnPageScript = document.createElement('script');
      elOnPageScript.setAttribute('src', resourceInfo.js.src);
      elOnPageScript.setAttribute('type', 'text/javascript');
      // elOnPageScript.src = resourceInfo.js.src;

      if(
        resourceInfo.js.integrity &&
        !BOT_INFO.isBot
      ) {
        elOnPageScript.setAttribute('integrity', resourceInfo.js.integrity);
      }

      if(
        resourceInfo.js.crossorigin &&
        resourceInfo.js.crossorigin.show &&
        !BOT_INFO.isBot
      ) {
        elOnPageScript.setAttribute('crossorigin', resourceInfo.js.crossorigin.value);
      }

      document.head.appendChild(elOnPageScript);

      arrPromiseList.js = new Promise((res, rej) => {
        elOnPageScript.onload = function() {
          window.G2J_EXTERNAL_RESOURCE_ON_PAGE[resourceInfo.name].js = true;
          res();
        }
        elOnPageScript.onerror = function () {
          rej();
        }
      });
    }
  }

  return arrPromiseList;
}; // DynamicInsertExternalResouceHandler()
