import {
  BASE_URL,
} from '@common/config/resource-config';
import {
  isWhitePath,
} from './gateway-handler';

interface SSRMetaContentInterface {
  title?: string,
  description?: string,

  robots?: string,

  canonical?: string,
  alternate_list?: Object,
};

const GenerateSSRMetaContent = ((req) => {
  let tmpSSRMetaContent : SSRMetaContentInterface = {};

  if(
    req.customizeInfo.hasRedirectRequest
    || !isWhitePath(req.customizeInfo.url)
  ) {
    return tmpSSRMetaContent;
  }

  const alternate_list : Array<{
    href_lang: string,
    href: string
  }> = [
    {
      href: BASE_URL + req.customizeInfo.url.replace(/^[|\/](|[A-Za-z])+(|-)+(|[A-Za-z])+/, '/' + 'vi-' + req.ipInfo.country.toLowerCase()),
      href_lang: 'vi-' + req.ipInfo.country,
    },
    {
      href: BASE_URL + req.customizeInfo.url.replace(/^[|\/](|[A-Za-z])+(|-)+(|[A-Za-z])+/, '/' + 'en-' + req.ipInfo.country.toLowerCase()),
      href_lang: 'en-' + req.ipInfo.country,
    },
  ];

  if(/^[|\/](|[A-Za-z])+(|-)+(|[A-Za-\z])+\/login/g.test(req.customizeInfo.urlSplitted[0])) {
    tmpSSRMetaContent = {
      title: 'Đăng nhập tài khoản Go2Joy!',
      description: 'Đăng nhập ngay để xem những chương trình ưu đãi mới nhất từ Go2Joy nhé.',

      robots: 'noindex, follow',
    };
  } else if(/^[|\/](|[A-Za-z])+(|-)+(|[A-Za-z])+\/sign-up/g.test(req.customizeInfo.urlSplitted[0])) {
    tmpSSRMetaContent = {
      title: 'Đăng ký thành viên Go2Joy!',
      description: 'Đăng ký làm thành viên của Go2Joy để có cơ hội nhận được những ưu đãi vô cùng hấp dẫn.',

      robots: 'noindex, follow',
    };
  } else if(/^[|\/](|[A-Za-z])+(|-)+(|[A-Za-z])+\/forget-password/g.test(req.customizeInfo.urlSplitted[0])) {
    tmpSSRMetaContent = {
      title: 'Quên mật khẩu - Go2Joy',
      description: 'Trang lấy lại mật khẩu tài khoản',

      robots: 'noindex, follow',
    };
  } else if(/^[|\/](|[A-Za-z])+(|-)+(|[A-Za-z])+\/profile/g.test(req.customizeInfo.urlSplitted[0])) {
    tmpSSRMetaContent = {
      title: 'Tài khoản của tôi - Go2Joy',
      description: 'Trang thông tin tài khoản',

      robots: 'noindex, follow',
    };
  } else if(/^[|\/](|[A-Za-z])+(|-)+(|[A-Za-z])+\/booking(?:\/)?$/g.test(req.customizeInfo.urlSplitted[0])) {
    tmpSSRMetaContent = {
      title: 'Lịch sử đặt phòng của tôi - Go2Joy',
      description: 'Xem lịch sử đặt phòng',

      robots: 'noindex, follow',
    };
  } else if(/^[|\/](|[A-Za-z])+(|-)+(|[A-Za-z])+\/booking-detail\/[0-9]+(?:\/)?$/g.test(req.customizeInfo.urlSplitted[0])) {
    let tmpRoomId = req.customizeInfo.urlSplitted[0].match(/[0-9]+?$/g);
    tmpRoomId=(tmpRoomId ? ' '+tmpRoomId[0] : '');

    tmpSSRMetaContent = {
      title: 'Chi tiết đặt phòng' + tmpRoomId + ' - Go2Joy',
      description: 'Xem chi tiết đặt phòng' + tmpRoomId,

      robots: 'noindex, follow',
    };
  } else if(/^[|\/](|[A-Za-z])+(|-)+(|[A-Za-z])+\/stamp(?:\/)?$/g.test(req.customizeInfo.urlSplitted[0])) {
    tmpSSRMetaContent = {
      title: 'Tem thưởng của tôi - Go2Joy',
      description: 'Xem danh sách tem thưởng',

      robots: 'noindex, follow',
    };
  } else if(/^[|\/](|[A-Za-z])+(|-)+(|[A-Za-z])+\/stamp-detail\/[0-9]+(?:\/)?$/g.test(req.customizeInfo.urlSplitted[0])) {
    let tmpStampId = req.customizeInfo.urlSplitted[0].match(/[0-9]+?$/g);
    tmpStampId=(tmpStampId ? ' '+tmpStampId[0] : '');

    tmpSSRMetaContent = {
      title: 'Chi tiết tem thưởng'+tmpStampId+' - Go2Joy',
      description: 'Xem chi tiết tem thưởng'+tmpStampId,

      robots: 'noindex, follow',
    };
  } else if(/^[|\/](|[A-Za-z])+(|-)+(|[A-Za-z])+\/point/g.test(req.customizeInfo.urlSplitted[0])) {
    tmpSSRMetaContent = {
      title: 'Điểm tích lũy của tôi - Go2Joy',
      description: 'Xem điểm tích lũy',

      robots: 'noindex, follow',
    };
  } else if(/^[|\/](|[A-Za-z])+(|-)+(|[A-Za-z])+\/coupon/g.test(req.customizeInfo.urlSplitted[0])) {
    tmpSSRMetaContent = {
      title: 'Mã giảm giá của tôi - Go2Joy',
      description: 'Xem danh sách mã giảm giá',

      robots: 'noindex, follow',
    };
  } else if(/^[|\/](|[A-Za-z])+(|-)+(|[A-Za-z])+\/payment-v4/g.test(req.customizeInfo.urlSplitted[0])) {
    let tmpPaymentStep = req.customizeInfo.urlSplitted[0].match(/[0-9]+?$/g);
    tmpPaymentStep=(tmpPaymentStep ? tmpPaymentStep[0] : 1);

    tmpSSRMetaContent = {
      ...(
        tmpPaymentStep == 1 ?
          {
            title: 'Xác nhận thông tin',
            description: 'Xác nhận thông tin đặt phòng',
          } :
        tmpPaymentStep == 2 ?
          {
            title: 'Tiến hành thanh toán',
            description: 'Tiến hành thanh toán đặt phòng',
          } :
        tmpPaymentStep == 3 ?
          {
            title: 'Đặt phòng thành công',
            description: 'Đặt phòng thành công tại Go2Joy',
          } :
        {
          title: '',
          description: '',
        }
      ),

      robots: 'noindex, follow',
    };
  }

  tmpSSRMetaContent.canonical = (
    tmpSSRMetaContent.canonical ?
      tmpSSRMetaContent.canonical :
    BASE_URL + req.customizeInfo.url
  );

  tmpSSRMetaContent.alternate_list = alternate_list;

  return tmpSSRMetaContent;
});

export {
  GenerateSSRMetaContent,
};
