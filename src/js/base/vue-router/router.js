import {
  isEncryptParamValid,
} from '~jsDefinePath/general';
import {
  ROUTER_NAME,
  ROUTER_INFO,
} from '~jsBasePath/vue-router/router-enum';

// NOTE - Khai báo router info, mỗi khi tạo 1 router mới thì cần đăng ký bên file router-enum và dùng thông tin đăng ký đó để khai báo cho phần router bên này
const router = new window.VueRouter({
  mode: 'history',
  routes: [
    {
      path: ROUTER_INFO[ROUTER_NAME['home-page']].path,
      name: ROUTER_NAME['home-page'],
    },

    {
      path: ROUTER_INFO[ROUTER_NAME['search-page']].path,
      name: ROUTER_NAME['search-page'],
    },

    //=================== Group ==================>
    {
      path: ROUTER_INFO[ROUTER_NAME['category-page']].path,
      name: ROUTER_NAME['category-page'],
    },

    //================= end Group ================>

    {
      path: ROUTER_INFO[ROUTER_NAME['contact-page']].path,
      name: ROUTER_NAME['contact-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['promotion-page']].path,
      name: ROUTER_NAME['promotion-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['detail-promotion-page']].path,
      name: ROUTER_NAME['detail-promotion-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['hotel-detail-page']].path,
      name: ROUTER_NAME['hotel-detail-page'],
    },

    // {
    //   path: ROUTER_INFO[ROUTER_NAME['payment']].path,
    //   name: ROUTER_NAME['payment'],
    // },
    // {
    //   path: ROUTER_INFO[ROUTER_NAME['payment-detail']].path,
    //   name: ROUTER_NAME['payment-detail'],
    // },
    {
      path: ROUTER_INFO[ROUTER_NAME['payment-success']].path,
      name: ROUTER_NAME['payment-success'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['login-page']].path,
      name: ROUTER_NAME['login-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['account-page']].path,
      name: ROUTER_NAME['account-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['sign-up-page']].path,
      name: ROUTER_NAME['sign-up-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['forget-password-page']].path,
      name: ROUTER_NAME['forget-password-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['stamp-page']].path,
      name: ROUTER_NAME['stamp-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['stamp-detail-page']].path,
      name: ROUTER_NAME['stamp-detail-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['point-page']].path,
      name: ROUTER_NAME['point-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['booking-page']].path,
      name: ROUTER_NAME['booking-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['booking-detail-page']].path,
      name: ROUTER_NAME['booking-detail-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['coupon-page']].path,
      name: ROUTER_NAME['coupon-page'],
    },
     {
      path: ROUTER_INFO[ROUTER_NAME['linked-page']].path,
      name: ROUTER_NAME['linked-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['maps-page']].path,
      name: ROUTER_NAME['maps-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['room-detail-page']].path,
      name: ROUTER_NAME['room-detail-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['profile-page']].path,
      name: ROUTER_NAME['profile-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['vision-page']].path,
      name: ROUTER_NAME['vision-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['about-us-page']].path,
      name: ROUTER_NAME['about-us-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['term-condition-page']].path,
      name: ROUTER_NAME['term-condition-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['payment-v4-page']].path,
      name: ROUTER_NAME['payment-v4-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['payoo-page']].path,
      name: ROUTER_NAME['payoo-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['hotel-list-v4-page']].path,
      name: ROUTER_NAME['hotel-list-v4-page'],
    },
    {
      path: ROUTER_INFO[ROUTER_NAME['not-found-page']].path,
      name: ROUTER_NAME['not-found-page'],
    },
  ],

  scrollBehavior (to, from) {
    if(
      to.name !== from.name
      // JSON.stringify(to.query) !== JSON.stringify(from.query)
    ) {
      return { x: 0, y: 0 }
    }
  }
});

window.Go2JoyRouter = function() {
  if(isEncryptParamValid(this?.key, this?.no_encrypt)) {
    return router;
  }
};

export {
  router
};
