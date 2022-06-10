export function InitCustomInfo(req, res, next) {
  const url = req.headers['raw-url'] || req.url;
  const urlSplitted = url.split('?');

  // NOTE - Init default value for available key
  req.query = req.query || {};

  // NOTE - Customize Info
  req.customizeInfo = {
    url,
    urlSplitted,
    //-- ANCHOR - Enable to check valid url (default: true)
    enableRedirectChecking: true,
    //-- ANCHOR - Has redirect request flag (default: false)
    hasRedirectRequest: false,
    //-- ANCHOR - Redirect status (null: 200)
    status: null,
  };

  next();
}; // InitCustomInfo()
