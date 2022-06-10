import { VRouter } from '~jsLibPath/lib-manager';
import {
  ROUTER_NAME,
  ROUTER_INFO,
} from '~jsLandingPath/style-guide/base/vue-router/router-enum';

const router = new VRouter({
  mode: 'history',
  routes: [
    {
      path: ROUTER_INFO[ROUTER_NAME['style-guide']].path,
      name: ROUTER_NAME['style-guide'],
      meta: { reuse: false },
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['g2y-rating-star-page']].path,
      name: ROUTER_NAME['g2y-rating-star-page'],
      meta: { reuse: false },
    },
  ],
});

router.beforeEach((to,from,next) => {
  if(
    !to.matched[0].components.default &&
    ROUTER_INFO[to.name].path
  ) {
    const elScript = document.createElement('script');
    elScript.setAttribute('src', ROUTER_INFO[to.name].component_path);
    document.head.append(elScript);

    elScript.onload = function() {
      to.matched[0].components.default = ROUTER_INFO[to.name].component();
      next();
    };
  } else {
    next();
  }
});

export {
  router
};
