import {
  isEncryptParamValid,
} from '~jsDefinePath/general';
import {
  ROUTER_NAME,
  ROUTER_INFO,
} from './router-enum';
import RouterUtil from './router-util';

// NOTE - Khai báo router info, mỗi khi tạo 1 router mới thì cần đăng ký bên file router-enum và dùng thông tin đăng ký đó để khai báo cho phần router bên này
const router = new window.VueRouter({
  mode: 'history',
  routes: [
    {
      path: ROUTER_INFO[ROUTER_NAME['article-page']].path,
      name: ROUTER_NAME['article-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['article-detail-page']].path,
      name: ROUTER_NAME['article-detail-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['article-category-page']].path,
      name: ROUTER_NAME['article-category-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['not-found-page']].path,
      name: ROUTER_NAME['not-found-page'],
    },
  ],

  scrollBehavior (to, from) {
    if(to.name !== from.name) {
      return { x: 0, y: 0 }
    }
  }
});

RouterUtil.init(router);

window.Go2JoyRouter = function() {
  if(isEncryptParamValid(this?.key, this?.no_encrypt)) {
    return router;
  }
};

export {
  router
};
