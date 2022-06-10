import { isEmpty as _isEmpty } from 'lodash';

import modules, { gulp } from '@common/define/module-define';
import APP from '@common/enum/source-enum';
import {
  STATE_KEYS,
  // ACTION_KEYS,
  MUTATION_KEYS,
  GulpTaskStore,
} from '@common/gulp-task/store';
import { ARR_FILE_EXTENSION } from '@common/define/file-define';
import {
  DEVELOPMENT,
  PRODUCTION,
  STAGING,
} from '@common/define/enviroment-define';
import {
  RESOURCE,
  BASE_URL,
  BASE_LOCALHOST_STATIC_URL,
  BASE_STATIC_URL,
  BASE_DEV_API_URL,
  BASE_STAGING_API_URL,
  BASE_API_URL,
  BASE_ASSETS_SERVICE_URL
} from '@common/config/resource-config';

import {
  InitCustomInfo,
} from './util/initial-custom-info';

import isBot from './lib/is-bot';
import generateIPInfo from './lib/generate-ip-info';

import {
  GenerateSSRMetaContent,
} from './util/generate-ssr-meta-content';
import {
  HandleRedirectUrl as HandleRedirectValidFormatUrl,
} from './util/redirect-valid-format-url-handler';
import {
  HandleRedirectUrl as HandleRedirectLanguageValidUrl,
} from './util/redirect-language-valid-handler';
import {
  HandleRedirectUrl as HandleRedirectCommonUrl,
} from './util/redirect-common-handler';
import {
  HandleRedirectUrl as HandleRedirectArticleBlogUrl,
} from './util/redirect-article-blog-handler';

import html from 'html';
const spdy = require('spdy');
const http = require('http');
const https = require('https');
const compression = require('compression');

const LOCALE_CODE_ID_PREFIX_REGEX = '^/(|(|[A-Za-z])+(|-)+(|[A-Za-z])+/)';

export default class ServerSideRenderTask {
  private ORIGIN_HTML_LANGUAGE : string = 'vi'; // ORIGIN_HTML_LANGUAGE
  private _expressServer : any = modules.express();
  private _expressServerStatic : any = modules.express();
  private _templates : string = APP.lab.path;
  private _prerenderServicePort : number = 3030;
  private _prerenderBlacklist : Array<string> = [
    LOCALE_CODE_ID_PREFIX_REGEX+'login(?:$)',
    LOCALE_CODE_ID_PREFIX_REGEX+'sign-up(?:$)',
    LOCALE_CODE_ID_PREFIX_REGEX+'forget-password(?:$)',
    LOCALE_CODE_ID_PREFIX_REGEX+'profile(?:$)',
    LOCALE_CODE_ID_PREFIX_REGEX+'booking(?:$)',
    LOCALE_CODE_ID_PREFIX_REGEX+'booking-detail(?:$)',
    LOCALE_CODE_ID_PREFIX_REGEX+'stamp(?:$)',
    LOCALE_CODE_ID_PREFIX_REGEX+'stamp-detail(?:$)',
    LOCALE_CODE_ID_PREFIX_REGEX+'point(?:$)',
    LOCALE_CODE_ID_PREFIX_REGEX+'coupon(?:$)',
    // NOTE - comment out room detail because we need call api to setup info for title and description meta tag
    // LOCALE_CODE_ID_PREFIX_REGEX+'hoteldetail+/[Aa-zZ|0-9-]+/[Aa-zZ|0-9-](?:$)',
    LOCALE_CODE_ID_PREFIX_REGEX+'payment-v4(|/[Aa-zZ|0-9-])(?:$)',
  ];

  // private _prerenderBlacklist : Array<string> = [];

  private _prerenderService : any = modules.prerender({
    port: this._prerenderServicePort,
    // pageDoneCheckInterval: 1000, // NOTE - timeout page load finish
    // chromeFlags: ['--no-sandbox', '--headless', '--disable-gpu', '--remote-debugging-port=9222', '--hide-scrollbars'],
    chromeFlags: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--headless',
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--disable-dev-shm-usage',
      '--remote-debugging-port=9222',
      '--hide-scrollbars',
      '--disable-translate',
      '--disable-extensions',
      '--verbose',
    ]
  });
  private _resourceTargetPath: string = (
    process.env.NODE_ENV === DEVELOPMENT ?
      APP.lab.path.slice(0,-1) :
    (
      process.env.NODE_ENV === STAGING ||
      process.env.TYPE === 'uat'
    ) ?
      APP.lab.path + '/dist/' :
    APP.out_lab.path + 'dist/'
  );

  constructor() {
    // NOTE - config and init prerender service
    this._prerenderService.use(modules.prerender.sendPrerenderHeader());
    this._prerenderService.use(modules.prerender.browserForceRestart());
    // this._prerenderService.use(modules.prerender.blockResources());
    this._prerenderService.use(modules.prerender.removeScriptTags());
    this._prerenderService.use(modules.prerender.httpHeaders());

    // NOTE - Config env for nunjucks render
    const env = modules.nunjucks.configure( this._templates, {
      autoescape: true,
      cache: false,
      express: this._expressServer,
    });

    this._createEnviromentFilter(env);

    // NOTE - define what template engine will owner server side render and type of view engine
    this._expressServer.engine('html', modules.nunjucks.render) ;
    this._expressServer.set('view engine', 'html') ;

    // NOTE - disable some information
    this._expressServer.disable('x-powered-by');
    this._expressServerStatic.disable('x-powered-by');

    // NOTE - setup express services
    //-- ANCHOR - First setup options for handle redirect url and more
    this._expressServer.use(InitCustomInfo);

    //-- ANCHOR - After that handle redirect with cases
    this._expressServer.use(HandleRedirectValidFormatUrl);
    this._expressServer.use(HandleRedirectArticleBlogUrl);
    this._expressServer.use(HandleRedirectCommonUrl);

    //---- ANCHOR - We need bot and ip information to check condition decide redirect or not in
    this._expressServer.use(isBot);
    this._expressServer.use(generateIPInfo);
    this._expressServer.use(HandleRedirectLanguageValidUrl);

    // NOTE - setup for prerender node service
    const currentUserAgents = modules.prerenderNode.crawlerUserAgents;
    let userAgentsCustomize = currentUserAgents.concat(['G2JBot', 'Trident', 'XML\-Sitemaps','PagePeeker', 'GTmetrix']);

    if(process.env.NODE_ENV === DEVELOPMENT) {
      userAgentsCustomize = userAgentsCustomize.concat(['Screaming Frog SEO Spider']);
    }

    modules.prerenderNode.set('crawlerUserAgents', currentUserAgents.concat(userAgentsCustomize));

    http.globalAgent.maxSockets = Infinity;
    https.globalAgent.maxSockets = Infinity;
  };

  getTmp() {
    const self = this;

    return {
      name: 'ServerSideRenderTmp',
      init: function() {
        modules.gulp.task('ServerSideRenderTmp', function(cb) {
          const port = 9000;
          const staticPort = 3112;

          self._expressServer.use('/tmp/js', modules.express.static(self._resourceTargetPath+'/tmp/js'));
          self._expressServer.use('/tmp/css', modules.express.static(self._resourceTargetPath+'/tmp/css'));
          self._expressServer.use('/image', modules.express.static(self._resourceTargetPath+'/image', {
            maxAge: 31557600000 // uses milliseconds per docs
          }));
          self._expressServer.use('/language', modules.express.static(self._resourceTargetPath+'/language'));
          self._expressServer.use('/robots.txt', modules.express.static(self._resourceTargetPath+'/robots.txt'));
          self._expressServer.use('/sitemap.xml', modules.express.static(self._resourceTargetPath+'/sitemap.xml'));

          self._expressServer.use(
            modules.prerenderNode
            .blacklisted(self._prerenderBlacklist)
            .set('prerenderServiceUrl', 'http://localhost:'+self._prerenderServicePort+'/')
            .set('afterRender', function(err, req, prerender_res) {
              // Don't cache responses that might be temporary like 500 or 504.
              // prerender_res.body = html.prettyPrint(prerender_res.body);

              // NOTE - If 404 route, send status 404
              if(prerender_res.body.includes('not-found-section__bg-img')) {
                prerender_res.statusCode = '404';
              }
            })
          );

          // NOTE - Before Express send
          self._expressServer.use(function (req, res, next) {
            var send = res.send;

            // NOTE - If 404 route, send status 404
            if(req.url.includes('404-not-found')) {
              res.status('404');
            }

            res.send = function (body) { // It might be a little tricky here, because send supports a variety of arguments, and you have to make sure you support all of them!
              // Do something with the body...
              // console.log(body.toString());
              send.call(this, body);
            };

            setTimeout(function() {
              next();
            })
          });

          self._expressServer.get('*', function(req, res, next) {
            if(req.customizeInfo.status) {
              res.status(req.customizeInfo.status);
            }

            if(
              req.customizeInfo.hasRedirectRequest
              && req.customizeInfo.url
            ) {
              res.redirect(req.customizeInfo.url);
              return;
            }

            // NOTE - this execute for update html docs cache
            if(!GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
              self.ORIGIN_HTML_LANGUAGE = self._generateRandomString();
            }

            const filename = self._generateFileNameFromUrl(req.url);

            let responseData:any = {};

            let dummyDataName = null;

            if(RESOURCE.resource[filename]?.dummy_data) {
              dummyDataName = RESOURCE.resource[filename]?.dummy_data_name ?? null;

              responseData = GulpTaskStore.get(STATE_KEYS.dummy_data_manager).get(dummyDataName) || {};

              // NOTE - Debug get responseData for dummy_data
              // console.log(responseData);
            }

            if(
              !_isEmpty(responseData) &&
              !responseData.success
            ) {
              GulpTaskStore.get(STATE_KEYS.handler_error_util).handlerError(responseData, ARR_FILE_EXTENSION.JSON, GulpTaskStore.get(STATE_KEYS.is_first_compile_all));
            }

            responseData = responseData.data;

            // NOTE - Generate ssr meta content
            const ssrMetaContent = GenerateSSRMetaContent(req);

            // NOTE - Define value for api environment when user is G2JBot
            const botApiEnv = (req.botInfo.nameBot === 'G2JBot' ? PRODUCTION : null);

            res.render('src/njk/template/'+filename+'.njk', {
              file: filename,
              namepage: filename,
              data: responseData,
              objGlobal: RESOURCE,
              intRandomNumber : Math.random() * 10,
              CACHE_VERSION: GulpTaskStore.get(STATE_KEYS.update_version) || RESOURCE.project_version,
              ENV_APPLICATION: process.env.NODE_ENV,
              ENV_API: (process.env.NODE_ENV === DEVELOPMENT ? botApiEnv || RESOURCE.env_api : STAGING),
              MODE_APPLICATION: process.env.MODE,
              TYPE_APPLICATION: process.env.TYPE,
              BASE_URL,
              BASE_LOCALHOST_STATIC_URL,
              ENV_DEFAULT: STAGING,
              DEVELOPMENT,
              STAGING,
              PRODUCTION,
              BASE_API_ENV: {
                [DEVELOPMENT]: BASE_DEV_API_URL,
                [STAGING]: BASE_STAGING_API_URL,
                [PRODUCTION]: BASE_API_URL,
              },
              HTML_LANGUAGE: self.ORIGIN_HTML_LANGUAGE,
              BASE_ASSETS_SERVICE_URL,
              API_VERSION: RESOURCE.api_version,
              LAYOUT_CONFIG: {
                'imageUrl' : (req.headers.base_static_url || BASE_STATIC_URL) + '/image', // NOTE - Vì image sử dụng trong layout config cho những file render numjuck sang html thường có dạng '{{ LAYOUT_CONFIG.imageUrl }}/fantasy-image08.jpg' nên để dev tự thêm / sẽ clear hơn khi sử dụng với nunjuck
                'cssUrl' : (req.headers.base_static_url || BASE_STATIC_URL) + '/tmp/css',
                'jsUrl' : (req.headers.base_static_url || BASE_STATIC_URL) + '/tmp/js',
                'languageUrl': '/language',
                // 'imageUrl' : '/image', // NOTE - Vì image sử dụng trong layout config cho những file render numjuck sang html thường có dạng '{{ LAYOUT_CONFIG.imageUrl }}/fantasy-image08.jpg' nên để dev tự thêm / sẽ clear hơn khi sử dụng với nunjuck
                // 'cssUrl' : '/tmp/css',
                // 'jsUrl' : '/tmp/js',
                // 'languageUrl': '/language',
              },

              metaContent: ssrMetaContent,
              BOT_INFO: req.botInfo,
              IP_INFO: req.ipInfo,
            });

            next();
          });

          // NOTE - setup port listening for express server
          self._expressServer.listen(port);

          if(
            modules.fs.existsSync(APP.lab.path+'server.key') &&
            modules.fs.existsSync(APP.lab.path+'server.crt')
          ) {
            self._expressServerStatic.use(compression());
            self._expressServerStatic.use('/image', modules.express.static(self._resourceTargetPath+'/image', {
              maxAge: 31557600000 // uses milliseconds per docs
            }));

            self._expressServerStatic.get('*', function(req,res) {
              self._checkFileStaticExistTimeout(
                req.url,
                1200
              ).then(function(result) {
                if(result.is_exist) {
                  // res.setHeader('Cache-Control', 'public, max-age=10000');
                  res.sendFile(result.path);
                } else {
                  res.sendStatus('404');
                }
              });
            });

            spdy
            .createServer(
              {
                key: modules.fs.readFileSync('./server.key'),
                cert: modules.fs.readFileSync('./server.crt'),
                allowHTTP1: true,
              },
              self._expressServerStatic,
            )
            .listen(staticPort);
          }

          self._prerenderService.start();
        });
      }
    }
  }; // getTmp()

  getDist() {
    const self = this;

    return {
      name: 'ServerSideRenderDist',
      init: function() {
        modules.gulp.task('ServerSideRenderDist', function(cb) {
          const port = 9000;

          self._expressServer.use('/js', modules.express.static(self._resourceTargetPath+'js', {
            maxAge: 31557600000 // uses milliseconds per docs
          }));
          self._expressServer.use('/css', modules.express.static(self._resourceTargetPath+'css', {
            maxAge: 31557600000 // uses milliseconds per docs
          }));
          self._expressServer.use('/image', modules.express.static(self._resourceTargetPath+'image', {
            maxAge: 31557600000 // uses milliseconds per docs
          }));
          self._expressServer.use('/language', modules.express.static(self._resourceTargetPath+'language', {
            maxAge: 31557600000 // uses milliseconds per docs
          }));
          self._expressServer.use('/robots.txt', modules.express.static(APP.lab.path+'robots.txt'));
          self._expressServer.use('/sitemap.xml', modules.express.static(APP.lab.path+'sitemap.xml'));

          self._expressServer.use(
            modules.prerenderNode
            .blacklisted(self._prerenderBlacklist)
            .set('prerenderServiceUrl', 'http://localhost:'+self._prerenderServicePort+'/')
            .set('afterRender', function(err, req, prerender_res) {
              // Don't cache responses that might be temporary like 500 or 504.
              prerender_res.body = html.prettyPrint(prerender_res.body);

              // NOTE - If 404 route, send status 404
              if(prerender_res.body.includes('not-found-section__bg-img')) {
                prerender_res.statusCode = '404';
              }
            })
          );

          // NOTE - Before Express send
          self._expressServer.use(function (req, res, next) {
            var send = res.send;

            // NOTE - If 404 route, send status 404
            if(req.url.includes('404-not-found')) {
              res.status('404');
            }

            res.send = function (body) { // It might be a little tricky here, because send supports a variety of arguments, and you have to make sure you support all of them!
              // Do something with the body...
              send.call(this, html.prettyPrint(body));
            };

            setTimeout(function() {
              next();
            })
          });

          self._expressServer.get('*', function(req, res) {
            if(req.customizeInfo.status) {
              res.status(req.customizeInfo.status);
            }

            if(
              req.customizeInfo.hasRedirectRequest
              && req.customizeInfo.url
            ) {
              res.redirect(req.customizeInfo.url);
              return;
            }

            const filename = self._generateFileNameFromUrl(req.url);

            let responseData:any = {};

            let dummyDataName = null;

            if(RESOURCE.resource[filename]?.dummy_data) {
              dummyDataName = RESOURCE.resource[filename]?.dummy_data_name ?? null;

              responseData = GulpTaskStore.get(STATE_KEYS.dummy_data_manager).get(dummyDataName) || {};
            }

            responseData = (!responseData.success ? {} : responseData.data);

            // NOTE - Generate ssr meta content
            const ssrMetaContent = GenerateSSRMetaContent(req);

            res.render('src/njk/template/'+filename+'.njk', {
              file: filename,
              namepage: filename,
              data: responseData,
              objGlobal: RESOURCE,
              intRandomNumber : Math.random() * 10,
              CACHE_VERSION: GulpTaskStore.get(STATE_KEYS.update_version) || RESOURCE.project_version,
              ENV_APPLICATION: process.env.NODE_ENV,
              ENV_API: PRODUCTION,
              MODE_APPLICATION: process.env.MODE,
              TYPE_APPLICATION: process.env.TYPE,
              BASE_URL,
              ENV_DEFAULT: STAGING,
              DEVELOPMENT,
              STAGING,
              PRODUCTION,
              BASE_API_ENV: {
                [DEVELOPMENT]: BASE_DEV_API_URL,
                [STAGING]: BASE_STAGING_API_URL,
                [PRODUCTION]: BASE_API_URL,
              },
              BASE_ASSETS_SERVICE_URL,
              HTML_LANGUAGE: self.ORIGIN_HTML_LANGUAGE,
              API_VERSION: RESOURCE.api_version,
              LAYOUT_CONFIG: {
                'imageUrl' : BASE_STATIC_URL + '/image', // NOTE - Vì image sử dụng trong layout config cho những file render numjuck sang html thường có dạng '{{ LAYOUT_CONFIG.imageUrl }}/fantasy-image08.jpg' nên để dev tự thêm / sẽ clear hơn khi sử dụng với nunjuck
                'cssUrl' : BASE_STATIC_URL + '/css',
                'jsUrl' : BASE_STATIC_URL + '/js',
                'languageUrl': '/language',
              },

              metaContent: ssrMetaContent,
              BOT_INFO: req.botInfo,
              IP_INFO: req.ipInfo,
            });
          });

          // NOTE - setup port listening for express server
          self._expressServer.listen(port);
          self._prerenderService.start();

          cb();
        });
      },
    }
  }; // getDist()

  private _createEnviromentFilter(env) {
    env.addFilter('json', function (value, spaces) {
      if (value instanceof modules.nunjucksRender.nunjucks.runtime.SafeString) {
        value = value.toString();
      }
      const jsonString = JSON.stringify(value, null, spaces).replace(/</g, '\\u003c');
      return modules.nunjucksRender.nunjucks.runtime.markSafe(jsonString);
    });

    env.addFilter('isString', function (val) {
      return typeof val === 'string';
    });

    env.addFilter('isEmpty', function (val) {
      return _isEmpty(val);
    });

    env.addFilter('isApp', function (text) {
      return text.includes('app');
    });

    env.addFilter('isVendor', function (text) {
      return text.includes('vendor');
    });
  }; // _createEnviromentFilter()

  private _generateFileNameFromUrl(url) {
    if(/[^(\/?en\/|\/)]?article?[^\/*]/.test(url)) {
      return 'article';
    }
    // else if(/[^(\/?en\/|\/)]?bat-mi-diem-hen-ho-ly-tuong?[^\/*]/.test(url)) {
    //   return 'bat-mi-diem-hen-ho-ly-tuong';
    // }
    else if(/[^(\/?en\/|\/)]?4-buoc-ve-dem-cua-gioi-tre?[^\/*]/.test(url)) {
      return '4-buoc-ve-dem-cua-gioi-tre';
    }

    return 'index';
  }; // _generateFileNameFromUrl()

  private _checkFileStaticExistTimeout(
    path: string,
    timeout: number,
  ) : any {
    const tmpPathForatted = this._resourceTargetPath + path.split('?')[0];

    return new Promise((resolve, reject) => {
      if(
        !tmpPathForatted ||
        !/\/(css|js)\//.test(tmpPathForatted)
      ) {
        resolve({
          is_exist: false,
        });

        return;
      }

      if(modules.fs.existsSync(tmpPathForatted)) {
        resolve({
          is_exist: true,
          path: tmpPathForatted,
        });

        return;
      }

      http.get(BASE_URL+path, (response) => {
        if (response.statusCode === 200) {
          let waitingTime = 0;
          const intervalTiming = 10;

          const checkFileStaticExistInterval = setInterval(function() {
            waitingTime+=intervalTiming;

            if(
              waitingTime <= timeout &&
              modules.fs.existsSync(tmpPathForatted)
            ) {
              resolve({
                is_exist: true,
                path: tmpPathForatted,
              });

              clearInterval(checkFileStaticExistInterval);
            } else if(waitingTime > timeout) {
              resolve({
                is_exist: false,
              });
            }
          }, intervalTiming);
        } else {
          resolve({
            is_exist: false,
            path: tmpPathForatted,
          });
        }
      });
    });
  }; // _checkFileStaticExistTimeout()

  // private _generateRouterNameFromUrl(url) {
  //   if(/[^(\/?en\/|\/)]?article?(\/*$)/.test(url)) {
  //     return 'article';
  //   } else if(/[^(\/?en\/|\/)]?bat-mi-diem-hen-ho-ly-tuong?[^\/*]/.test(url)) {
  //     return 'bat-mi-diem-hen-ho-ly-tuong';
  //   } else if(/[^(\/?en\/|\/)]?4-buoc-ve-dem-cua-gioi-tre?[^\/*]/.test(url)) {
  //     return '4-buoc-ve-dem-cua-gioi-tre';
  //   }

  //   return 'index';
  // };
  // _generateRouterNameFromUrl()

  private _randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  }; // _randomIntFromInterval()

  private _generateRandomString() {
    const result = Math.random().toString(36).substring(2,7);

    return result.slice(0, this._randomIntFromInterval(0,5));
  }; // _generateRandomString()
};
