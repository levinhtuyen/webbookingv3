import {
  isWhitePath,
} from './gateway-handler';

const ARTICLE_LIST = ["/article","/article-category/khach-san-2","/article-category/du-lich-5","/article-category/an-choi-3","/article-category/tin-go2joy-4","/article/top-19-khach-san-tinh-yeu-noi-tieng-tai-tphcm-khong-nen-bo-qua-41","/article/bat-mi-kinh-nghiem-di-nha-nghi-lan-dau-khong-nen-bo-qua-42","/article/top-10-khach-san-tinh-yeu-da-nang-cho-cac-cap-doi-43","/article/goi-y-10-xu-huong-staycation-nghi-duong-cho-ban-63","/article/homestay-ha-noi-theo-gio-83","/article/khach-san-con-nhong-84","/article/nha-nghi-co-ghe-tinh-yeu-o-ha-noi-86","/article/khach-san-dep-o-tphcm-90","/article/review-khach-san-ngan-le-mot-dem-91","/article/nha-nghi-khach-san-mo-xuyen-tet-o-sai-gon-103","/article/nha-nghi-khach-san-mo-xuyen-tet-o-ha-noi-104","/article/quan-an-ngon-quan-1-ho-chi-minh-38","/article/quan-an-ngon-sai-gon-noi-tieng-44","/article/cung-kham-pha-top-50-quan-an-ngon-quan-2-sieu-hap-dan-45","/article/top-30-quan-an-ngon-ha-noi-duoc-nhieu-tin-do-sanh-an-yeu-thich-46","/article/top-15-quan-an-ngon-cau-giay-cho-thuc-khach-thoa-man-dam-me-am-thuc-47","/article/top-18-quan-an-ngon-quan-hoan-kiem-khong-the-bo-qua-48","/article/quan-an-ngon-quan-3-81","/article/quan-an-ngon-quan-4-82","/article/mon-ngon-vung-tau-85","/article/quan-ngon-quan-7-87","/article/quan-ngon-quan-10-89","/article/quan-ngon-quan-8-88","/article/quan-an-ngon-quan-5-92","/article/dac-san-ha-long-95","/article/dac-san-da-lat-99","/article/dac-san-phu-quoc-100","/article/goi-y-hen-ho-dau-nam-105","/article/cac-dia-diem-du-lich-da-lat-37","/article/nhung-dia-diem-du-lich-da-nang-39","/article/cac-dia-diem-du-lich-can-tho-40","/article/kinh-nghiem-du-lich-nam-du-51","/article/kinh-nghiem-du-lich-mui-ke-ga-binh-thuan-52","/article/kinh-nghiem-du-lich-dao-binh-hung-53","/article/khu-du-lich-thuy-chau-54","/article/du-lich-dao-thanh-an-can-gio-55","/article/cac-dia-diem-du-lich-ha-long-56","/article/review-tham-quan-khu-du-lich-cu-lao-cham-57","/article/khu-du-lich-bau-trang-mui-ne-58","/article/khu-du-lich-bo-cap-vang-59","/article/dia-diem-du-lich-buon-me-thuot-co-gi-choi-60","/article/kinh-nghiem-du-lich-cu-lao-cau-61","/article/dia-diem-du-lich-cam-ranh-co-gi-choi-64","/article/khu-du-lich-ho-ta-dung-dak-nong-65","/article/khu-du-lich-suoi-mo-dong-nai-66","/article/kinh-nghiem-du-lich-dao-hai-tac-kien-giang-67","/article/kinh-nghiem-du-lich-ho-quan-son-68","/article/bai-dong-thanh-hoa-nghi-son-69","/article/dia-diem-cam-trai-da-lat-70","/article/dia-diem-cam-trai-gan-ha-noi-71","/article/nha-up-nguoc-vung-tau-72","/article/cong-vien-dep-nhat-tphcm-73","/article/cac-dia-diem-du-lich-gan-ha-noi-74","/article/dia-diem-san-may-da-lat-75","/article/khu-du-lich-zenna-pool-camp-vung-tau-76","/article/ho-da-xanh-vung-tau-77","/article/thac-ba-tanh-linh-binh-thuan-78","/article/ben-du-thuyen-marina-vung-tau-79","/article/phim-truong-secret-garden-da-lat-80","/article/que-garden-da-lat-93","/article/chua-kim-tien-an-giang-97","/article/nhung-dia-diem-du-lich-hai-phong-94","/article/khu-du-lich-sinh-thai-ngoc-hoa-trang-96","/article/cong-vien-thu-le-102","/article/bai-bien-nha-trang-101","/article/go2joy-con-duong-nhanh-chong-di-den-khach-san-20","/article/khach-san-ho-tro-luu-tru-dai-han-21","/article/book-phong-chat-cung-go2joy-49","/article/1-cham-kham-pha-van-phong-cuc-chat-62","/article/goi-y-cho-chill-sau-6h-chieu-108"];

const BLOG_LIST = ["/blog/","/blog/khach-san/","/blog/du-lich/","/blog/an-choi/","/blog/tin-tuc-go2joy/","/blog/khach-san-tinh-yeu-sai-gon/","/blog/kinh-nghiem-di-nha-nghi/","/blog/khach-san-tinh-yeu-da-nang/","/blog/staycation-la-gi/","/blog/homestay-ha-noi-theo-gio/","/blog/khach-san-con-nhong/","/blog/nha-nghi-co-ghe-tinh-yeu/","/blog/khach-san-dep-o-tphcm/","/blog/review-khach-san-ngan-le-mot-dem/","/blog/nha-nghi-khach-san-mo-xuyen-tet-o-sai-gon/","/blog/nha-nghi-khach-san-mo-xuyen-tet-o-ha-noi/","/blog/quan-an-ngon-quan-1/","/blog/mon-ngon-sai-gon/","/blog/quan-an-ngon-quan-2/","/blog/quan-an-ngon-ha-noi/","/blog/quan-an-ngon-cau-giay/","/blog/quan-an-ngon-quan-hoan-kiem/","/blog/quan-an-ngon-quan-3/","/blog/quan-an-ngon-quan-4/","/blog/mon-ngon-vung-tau/","/blog/quan-an-ngon-quan-7/","/blog/quan-an-ngon-quan-10/","/blog/quan-an-ngon-quan-8/","/blog/quan-an-ngon-quan-5/","/blog/dac-san-ha-long/","/blog/dac-san-da-lat/","/blog/dac-san-phu-quoc/","/blog/goi-y-hen-ho-dau-nam/","/blog/cac-dia-diem-du-lich-da-lat/","/blog/nhung-dia-diem-du-lich-da-nang/","/blog/cac-dia-diem-du-lich-can-tho/","/blog/kinh-nghiem-du-lich-nam-du/","/blog/kinh-nghiem-du-lich-mui-ke-ga-binh-thuan/","/blog/kinh-nghiem-du-lich-dao-binh-hung/","/blog/khu-du-lich-thuy-chau/","/blog/du-lich-dao-thanh-an-can-gio/","/blog/cac-dia-diem-du-lich-ha-long/","/blog/review-tham-quan-khu-du-lich-cu-lao-cham/","/blog/khu-du-lich-bau-trang-mui-ne/","/blog/khu-du-lich-bo-cap-vang/","/blog/dia-diem-du-lich-buon-me-thuot-co-gi-choi/","/blog/kinh-nghiem-du-lich-cu-lao-cau/","/blog/dia-diem-du-lich-cam-ranh-co-gi-choi/","/blog/khu-du-lich-ho-ta-dung-dak-nong/","/blog/khu-du-lich-suoi-mo-dong-nai/","/blog/kinh-nghiem-du-lich-dao-hai-tac-kien-giang/","/blog/kinh-nghiem-du-lich-ho-quan-son/","/blog/bai-dong-thanh-hoa-nghi-son/","/blog/dia-diem-cam-trai-da-lat/","/blog/dia-diem-cam-trai-gan-ha-noi/","/blog/nha-up-nguoc-vung-tau/","/blog/cong-vien-dep-nhat-tphcm/","/blog/cac-dia-diem-du-lich-gan-ha-noi/","/blog/dia-diem-san-may-da-lat/","/blog/khu-du-lich-zenna-pool-camp-vung-tau/","/blog/ho-da-xanh-vung-tau/","/blog/thac-ba-tanh-linh-binh-thuan/","/blog/ben-du-thuyen-marina-vung-tau/","/blog/phim-truong-secret-garden-da-lat/","/blog/que-garden-da-lat/","/blog/chua-kim-tien-an-giang/","/blog/nhung-dia-diem-du-lich-hai-phong/","/blog/khu-du-lich-sinh-thai-ngoc-hoa-trang/","/blog/cong-vien-thu-le/","/blog/bai-bien-nha-trang/","/blog/go2joy-con-duong-nhanh-chong-di-den-khach-san/","/blog/khach-san-ho-tro-luu-tru-dai-han/","/blog/book-phong-chat-cung-go2joy/","/blog/1-cham-kham-pha-van-phong-cuc-chat/","/blog/goi-y-cho-chill-sau-6h-chieu/"];

export function HandleRedirectUrl(req, res, next) {
  if(
    !req.customizeInfo.enableRedirectChecking
    || !isWhitePath(req.customizeInfo.url)
  ) {
    next();
    return;
  }

  let tmpUrl = req.customizeInfo.urlSplitted[0].replace(/(\/|\?\&|\/\?|\/\?\&)$/,'');

  if(
    ARTICLE_LIST.includes(tmpUrl) &&
    BLOG_LIST[ARTICLE_LIST.indexOf(tmpUrl)]
  ) {
    const tmpCorrectUrl = BLOG_LIST[ARTICLE_LIST.indexOf(tmpUrl)];

    req.customizeInfo = {
      url: tmpCorrectUrl,
      urlSplitted: tmpCorrectUrl.split('?'),
      enableRedirectChecking: false,
      hasRedirectRequest: true,
      status: '302',
    };
  }

  next();
}; // HandleRedirectUrl()
