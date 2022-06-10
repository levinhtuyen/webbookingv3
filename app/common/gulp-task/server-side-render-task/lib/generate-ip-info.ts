import { lookup } from 'geoip-lite';
import { isWhitePath } from '../util/gateway-handler';

const IP_INFO_DEFAULT = {
  range: [ 1984292864, 1984294911 ],
  country: 'VN',
  region: '',
  eu: '0',
  timezone: 'Asia/Ho_Chi_Minh',
  city: '',
  ll: [ 16, 106 ],
  metro: 0,
  area: 50,
};

export default function generateIPInfo(req, res, next) {
  if(!isWhitePath(req.customizeInfo.url)) {
    req.ipInfo = IP_INFO_DEFAULT;

    next();
    return;
  }

  const clientIp = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').toString().replace(/::ffff:|::1/, '');

  console.log(clientIp);

  req.ipInfo = lookup(clientIp) || IP_INFO_DEFAULT;

  next();
}
