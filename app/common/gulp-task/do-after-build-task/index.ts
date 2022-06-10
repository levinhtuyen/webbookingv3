import { isEmpty as _isEmpty } from 'lodash';

import {
  EventBus,
} from '@common/lib/event-bus';
import modules, {
  gulp,
  browserSync
} from '@common/define/module-define';
import {
  ARR_FILE_EXTENSION,
} from '@common/define/file-define';
import {
  EVENT_BUS_KEY,
} from '@common/define/event-bus';
import {
  RESOURCE,
  BASE_STATIC_URL
} from '@common/config/resource-config';
import APP from '@common/enum/source-enum';
import {
  STATE_KEYS,
  MUTATION_KEYS,
  GulpTaskStore,
} from '@common/gulp-task/store';

import {
  WatchTmpWithTemplateTask,
  WatchTmpWithTemplateAndFastModeTask,
} from '@common/watch-task/watch-task-manager';

const compress = require('compression');

export default class DoAfterBuildTask {
  private _validRouterList: { [key:string] : string } = {
    '/sitemap.xml': '/sitemap.xml',
    '/robots.txt': '/robots.txt',
    '/': '/tmp/index.html',
    '/style-guide': '/tmp/style-guide-page.html',
    '/4-buoc-ve-dem-cua-gioi-tre': '/tmp/4-buoc-ve-dem-cua-gioi-tre.html',
    '/bat-mi-diem-hen-ho-ly-tuong': '/tmp/bat-mi-diem-hen-ho-ly-tuong.html',
    '/article': '/tmp/article.html',
    '/article-category': '/tmp/article.html'
  };

  constructor() {};

  getTmp() {
    const self = this;

    return {
      name: 'doAfterBuildTask',
      init:  function() {
        modules.gulp.task('doAfterBuildTask', function(cb) {
          const _onTaskFinish = setInterval(function() {
            if(
              GulpTaskStore.get(STATE_KEYS.is_njk_finish) &&
              GulpTaskStore.get(STATE_KEYS.is_sass_finish) &&
              GulpTaskStore.get(STATE_KEYS.is_js_finish)
            ) {
              browserSync.init({
                // NOTE - Định nghĩa các files được lắng nghe và thực thi reload
                files: [
                  {
                    match: [
                      APP.lab.path + '/language/*.json',
                      APP.tmp.css + '/*.css',
                      APP.tmp.path + '/*.html',
                      APP.tmp.js + '/*.js',
                    ],

                    fn: function(event, file) {
                      browserSync.reload({
                        stream: false,
                      })
                    },
                  }
                ],
                // NOTE - Định nghĩa các file không cần lắng nghe khi reload
                watchOptions: {
                  ignored: [APP.src.js + '/partial/*.css']
                },
                reloadDelay: 0, // Fix htmlprocess watch not change
                reloadOnRestart: true,
                open: false, // Stop auto open browser
                cors: true,
                port: RESOURCE.port,
                host: RESOURCE.ip_address,
                injectChanges: false,
                // codeSync: false,
                notifier: {
                  styles: [
                    "display: none; ",
                    "padding: 5px 5px;",
                    "position: fixed;",
                    "font-size: 1.75rem;",
                    "line-height: 18px;",
                    "z-index: 999999;",
                    "left: 0;",
                    "top: 0;",
                    "width: auto;",
                    "max-width: 100%",
                    "color: #fff;",
                    "background-color: rgba(0,0,0,0.5);",
                    "box-shadow: 0 0 5px rgba(0,0,0,0.3);"
                  ]
                },
                server: {
                  proxy: RESOURCE.ip_address,
                  baseDir: APP.lab.path,
                  index: "/tmp/index.html",
                  // target: 'localhost:9000',

                  // NOTE - Dùng để config khi sử dụng SPA
                  middleware: function(req, res, next) {
                    // if(req.url.includes('-page.js')) {}
                    if(req.url.match(/\/image|\/font|\/language|\/js|\/css/img)) {
                      return next();
                    }

                    const urlSplitted = req.url.split('/');
                      const firstDispathcerParam = urlSplitted[1] ? '/' + urlSplitted[1] : '/';

                    if(self._validRouterList[firstDispathcerParam]) {
                      req.url = self._validRouterList[firstDispathcerParam];
                    } else {
                      req.url = self._validRouterList['/'];
                    }

                    return next();
                  },
                },

                callbacks: {
                  /**
                   * This 'ready' callback can be used
                   * to access the Browsersync instance
                   */
                  ready: function(err, bs) {
                    if(GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
                      browserSync.reload();

                      // NOTE Sau khi build xong lượt đầu thì forEach để in error ra nếu có
                      if(GulpTaskStore.get(STATE_KEYS.handler_error_util).arrError) {
                        GulpTaskStore.get(STATE_KEYS.handler_error_util).reportError();
                        GulpTaskStore.get(STATE_KEYS.handler_error_util).notifSuccess();
                      }

                      GulpTaskStore.commit(MUTATION_KEYS.set_is_browser_sync_finish, true);

                      // NOTE ghi nhận lượt buid đầu tiên đã xong
                      GulpTaskStore.commit(MUTATION_KEYS.set_is_first_compile_all, false);

                      modules.fs.writeFile(APP.log.path + '/tmp-construct/tmp-construct-log.json', JSON.stringify(GulpTaskStore.get(STATE_KEYS.tmp_construct)), (err) => {
                        if(err) throw err;

                        console.log('write file: "tmp-construct-log.json" finish.');
                      });

                      //! ANCHOR  - watchTask
                      // NOTE - watch tmp files change task (with template njk)
                      WatchTmpWithTemplateTask.init();

                      // NOTE - init server side render
                      // const ServerSideRenderTask = require('@common/gulp-task/server-side-render-task-manager');

                      // ServerSideRenderTask.ServerSideRenderTaskFormatted.tmp.init();

                      gulp.series(
                        WatchTmpWithTemplateTask.name,
                      )();
                    }
                  }
                }
              }); // end modules.browserSync

              // browserSync.watch([APP.lab.path + '/language/*.json']);

              clearInterval(_onTaskFinish);
            }
          }, 300);

          cb();
        });
      }
    }
  }; // getTmp()

  getTmpMode() {
    const self = this;

    return {
      fast: {
        name: 'doAfterBuildTaskFastMode',
        init:  function() {
          // NOTE - Define setting for browserSync in case setup proxy or server native
          const _settingCustomize : {
            server_field: string,
            basic_setup: {
              proxy?: string,
              baseDir?: string,
              index?: string,
              target?: string,
              proxyReq?: Array<Function>,
              proxyRes?: Array<Function>,
              proxyOptions?: {
                xfwd?: boolean,
                headers?: Object,
                changeOrigin?: boolean,
              }
            }
          } = {
            server_field: (process.env.ENABLE_SERVER ? 'proxy':'server'),
            basic_setup: (
              process.env.ENABLE_SERVER ?
                {
                  target: "localhost:9000",
                  proxyReq: [
                    async function(proxyReq, req) {
                      // NOTE - Setup header for handle multiple trailing slash after domain name when pass proxy
                      proxyReq.setHeader('raw-url', req.url);
                      proxyReq.setHeader('base_static_url', BASE_STATIC_URL);
                    }
                  ],
                } :
              {
                proxy: RESOURCE.ip_address,
                baseDir: APP.lab.path,
                index: "/tmp/index.html",
              }
            ),
          };

          const _settingHttps: {
            httpModule?: string,
            https?: boolean,
          } = (
            process.env.ENABLE_HTTPS ?
              {
                httpModule: 'spdy',
                https: true,
              } :
            {}
          );

          // NOTE - browsersync after connection to browser
          let _browserSyncConnection = null;

          // NOTE - Collect file compiled
          let _jsCompiledCollection = [];

          // NOTE - Save and waiting for ajax request confirm file if exist
          let _resConfirmFileIsCompile = null;

          // NOTE - Check asset is_newst is true or false
          const _isNewestAsset = (
            type,
            assetPageKey
          ) => {
            if(type === ARR_FILE_EXTENSION.JS) {
              if(!GulpTaskStore.get(STATE_KEYS.compile_js_list)[assetPageKey]) {
                return false;
              }

              return GulpTaskStore.get(STATE_KEYS.compile_js_list)[assetPageKey].is_newest;
            } else if(type === ARR_FILE_EXTENSION.CSS) {
              if(!GulpTaskStore.get(STATE_KEYS.convert_scss_list)[assetPageKey]) {
                return false;
              }

              return GulpTaskStore.get(STATE_KEYS.convert_scss_list)[assetPageKey].is_newest;
            }
          };

          // NOTE - generate object key value from a query string
          const _generateObjFromQueryString = (queryString) => {
            return JSON.parse('{"' + decodeURI(queryString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
          };

          // NOTE - listen EventBus to send information of compiled file to client
          EventBus.on(EVENT_BUS_KEY.SEND_COMPILE_LIST_TO_CLIENT_REQUEST, function(compileJsList) {
            browserSync.sockets.emit('updateStatusJSCompileList', compileJsList);
          });

          // NOTE - listen EventBus to turn on compile process loading
          EventBus.on(EVENT_BUS_KEY.TURN_ON_COMPILE_PROCESS_LOADING_REQUEST, function() {
            browserSync.sockets.emit('turnOnCompileProcessLoading',{
              compile_key: GulpTaskStore.get(STATE_KEYS.current_page_key),
            });
          });

          // NOTE - Page type config
          let _pageType = '';

          modules.gulp.task('doAfterBuildTaskFastMode', function(cb) {
            const _onTaskFinish = setInterval(function() {
              if(
                GulpTaskStore.get(STATE_KEYS.is_njk_finish)
                // GulpTaskStore.get(STATE_KEYS.is_sass_finish) &&
                // GulpTaskStore.get(STATE_KEYS.is_js_finish)
              ) {
                browserSync.init({
                  // NOTE - Định nghĩa các files được lắng nghe và thực thi reload
                  files: [
                    {
                      match: [
                        APP.lab.path + '/language/*.json',
                        // APP.tmp.css + '/*.css',
                        APP.tmp.path + '/*.html',
                      ],

                      fn: function(event, file) {
                        browserSync.reload()
                      },
                    }
                  ],
                  // NOTE - Định nghĩa các file không cần lắng nghe khi reload
                  watchOptions: {
                    ignored: [APP.src.js + '/partial/*.css']
                  },
                  reloadDelay: 0, // Fix htmlprocess watch not change
                  reloadOnRestart: true,
                  open: false, // Stop auto open browser
                  cors: true,
                  port: RESOURCE.port,
                  host: RESOURCE.ip_address,
                  injectChanges: false,
                  // codeSync: false,
                  notifier: {
                    styles: [
                      "display: none; ",
                      "padding: 5px 5px;",
                      "position: fixed;",
                      "font-size: 1.75rem;",
                      "line-height: 18px;",
                      "z-index: 999999;",
                      "left: 0;",
                      "top: 0;",
                      "width: auto;",
                      "max-width: 100%",
                      "color: #fff;",
                      "background-color: rgba(0,0,0,0.5);",
                      "box-shadow: 0 0 5px rgba(0,0,0,0.3);"
                    ]
                  },
                  [_settingCustomize.server_field]: {
                    ..._settingCustomize.basic_setup,

                    // NOTE - Dùng để config khi sử dụng SPA
                    middleware: [
                      compress(),
                      function(req, res, next) {
                        // NOTE - Regist the type of page SinglePAge or MultiplePAge
                        // if(req.url.includes('registPageType')) {
                        //   const objRequest = _generateObjFromQueryString(req._parsedUrl.query);

                        //   _pageType = objRequest.type;

                        //   res.write(Buffer.from(JSON.stringify({
                        //     'is_finish': true,
                        //   }), 'utf8'));
                        //   res.end();
                        //   return next();
                        // }

                        // NOTE - Handle request from client (confirm file is compiled)
                        if(req.url.indexOf('confirmFileIsCompiled') !== -1) {
                          const objRequest = _generateObjFromQueryString(req._parsedUrl.query);
                          const filename = objRequest.file_name.replace(/the-|.js/img, '');

                          // NOTE - keep global of resConfirmFileIsCompile
                          _resConfirmFileIsCompile = function() {
                            res.write(Buffer.from(JSON.stringify({
                              'is_finish': true,
                            }), 'utf8'));
                            res.end();
                            next();

                            _resConfirmFileIsCompile = null;
                          };

                          if(
                            !GulpTaskStore.get(STATE_KEYS.convert_scss_list)[filename].is_processing &&
                            !GulpTaskStore.get(STATE_KEYS.compile_js_list)[filename].is_processing
                          ) {
                            // GulpTaskStore.commit(MUTATION_KEYS.set_current_page_key, filename);

                            if(_isNewestAsset(ARR_FILE_EXTENSION.JS, filename)) {
                              if(_jsCompiledCollection.includes(filename)) {
                                _jsCompiledCollection = [];
                                EventBus.emit(EVENT_BUS_KEY.RELOAD_PAGE_REQUEST, true);
                              } else {
                                _jsCompiledCollection.push(filename);

                                if(_isNewestAsset(ARR_FILE_EXTENSION.CSS ,filename)) {
                                  EventBus.emit(EVENT_BUS_KEY.CONVERT_SCSS_REQUEST, filename);
                                } else {
                                  EventBus.emit(EVENT_BUS_KEY.COMPILE_JS_REQUEST, {
                                    key: filename,
                                    type: 'compile',
                                    from: 'browsersync'
                                  });
                                }

                                EventBus.once(EVENT_BUS_KEY.CONFIRM_FINISH_REQUEST, function() {
                                  EventBus.emit(EVENT_BUS_KEY.SEND_COMPILE_LIST_TO_CLIENT_REQUEST, GulpTaskStore.get(STATE_KEYS.compile_js_list));

                                  // NOTE - if _resConfirmFileIsCompile is exist, do it
                                  if(_resConfirmFileIsCompile) {
                                    _resConfirmFileIsCompile();
                                  }

                                  // NOTE - Check print error if has
                                  GulpTaskStore.get(STATE_KEYS.handler_error_util).reportError();
                                  GulpTaskStore.get(STATE_KEYS.handler_error_util).notifSuccess();
                                });
                              }

                              return;
                            } else if(
                              objRequest.is_push_state != 1 &&
                              _isNewestAsset(ARR_FILE_EXTENSION.CSS ,filename)
                            ) {
                              const convertScssList = GulpTaskStore.get(STATE_KEYS.convert_scss_list);

                              convertScssList[filename].is_newest = false;

                              GulpTaskStore.commit(MUTATION_KEYS.set_convert_scss_list, convertScssList);

                              EventBus.emit(EVENT_BUS_KEY.COMPILE_JS_REQUEST, {
                                key: filename,
                                type: 'recompile',
                                from: 'browsersync',
                                skip_check: true,
                              });

                              return;
                            } else {
                              // NOTE - if _resConfirmFileIsCompile is exist, do it
                              if(_resConfirmFileIsCompile) {
                                _resConfirmFileIsCompile();
                              }
                              return;
                            }
                          } else {
                            EventBus.once(EVENT_BUS_KEY.CONFIRM_FINISH_REQUEST, function() {
                              EventBus.emit(EVENT_BUS_KEY.SEND_COMPILE_LIST_TO_CLIENT_REQUEST, GulpTaskStore.get(STATE_KEYS.compile_js_list));

                              // NOTE - if _resConfirmFileIsCompile is exist, do it
                              if(_resConfirmFileIsCompile) {
                                _resConfirmFileIsCompile();
                              }

                              // NOTE - Check print error if has
                              GulpTaskStore.get(STATE_KEYS.handler_error_util).reportError();
                              GulpTaskStore.get(STATE_KEYS.handler_error_util).notifSuccess();
                            });

                            return;
                          }
                        }

                        // NOTE - handle js file compile when loading request
                        if(
                          req.url.indexOf('app.js') !== -1 ||
                          /vendor(|\-[0-9]+).js/.test(req.url)
                        ) {
                          const filename = req.url.split('/').slice(-2)[1].split('?')[0].replace('.js', '');

                          if(_isNewestAsset(ARR_FILE_EXTENSION.JS ,filename)) {
                            // if(req.url.includes('app.js')) {
                            //   GulpTaskStore.commit(MUTATION_KEYS.set_current_app_key, filename);
                            // } else if(req.url.includes('vendor.js')) {
                            //   GulpTaskStore.commit(MUTATION_KEYS.set_current_vendor_key, filename);
                            // }

                            EventBus.emit(EVENT_BUS_KEY.COMPILE_JS_REQUEST, {
                              key: filename,
                              type: 'compile',
                              from: 'browsersync'
                            });

                            EventBus.once(EVENT_BUS_KEY.LOAD_FILE_JS_REQUEST.replace('FILE', filename), function() {
                              // res.setHeader("Content-Encoding", "gzip");
                              // res.setHeader('Content-Type', 'text/javascript');
                              next();

                              // NOTE - This case is the page does not has -page.js file
                              // setTimeout(function() {

                              // }, 300);

                              if(
                                req.url.indexOf('app.js') !== -1 &&
                                _pageType === 'mpa'
                              ) {
                                GulpTaskStore.commit(MUTATION_KEYS.set_current_page_key, null);
                                browserSync.sockets.emit('isJsFilesOnLoadFinish', {
                                  is_finish: true,
                                });

                                // NOTE - Check print error if has
                                GulpTaskStore.get(STATE_KEYS.handler_error_util).reportError();
                                GulpTaskStore.get(STATE_KEYS.handler_error_util).notifSuccess();
                              }
                            });

                            return;
                          } else {
                            next();

                            // NOTE - This case is the page does not has -page.js file
                            // setTimeout(function() {

                            // }, 300);
                            if(
                              req.url.indexOf('app.js') !== -1 &&
                              _pageType === 'mpa'
                            ) {
                              GulpTaskStore.commit(MUTATION_KEYS.set_current_page_key, null);
                              browserSync.sockets.emit('isJsFilesOnLoadFinish', {
                                is_finish: true,
                              });
                            }

                            return;
                          }
                        }

                        if(
                          req.url.includes('-page.js') &&
                          req.headers.purpose !== 'prefetch'
                        ) {
                          // res.setHeader("Content-Encoding", "gzip");
                          // res.setHeader('Content-Type', 'text/javascript');
                          const filename = req.url.split('/').slice(-2)[1].split('?')[0].replace(/the-|.map|.js/img, '');

                          if(
                            GulpTaskStore.get(STATE_KEYS.convert_scss_list)[filename].is_processing ||
                            GulpTaskStore.get(STATE_KEYS.compile_js_list)[filename].is_processing
                          ) {
                            EventBus.once(EVENT_BUS_KEY.LOAD_FILE_JS_REQUEST.replace('FILE', filename), function() {
                              EventBus.emit(EVENT_BUS_KEY.CONFIRM_FINISH_REQUEST, true);
                              next();
                            });

                            return;
                          } else if(_isNewestAsset(ARR_FILE_EXTENSION.JS ,filename)) {
                            // NOTE - this condition valid when this webpage does not has router info, and it load -page.js inline script on page load
                            // GulpTaskStore.commit(MUTATION_KEYS.set_current_page_key, filename);

                            if(_isNewestAsset(ARR_FILE_EXTENSION.CSS ,filename)) {
                              EventBus.emit(EVENT_BUS_KEY.CONVERT_SCSS_REQUEST, filename);
                            } else {
                              EventBus.emit(EVENT_BUS_KEY.COMPILE_JS_REQUEST, {
                                key: filename,
                                type: 'compile',
                                from: 'browsersync'
                              });
                            }

                            EventBus.once(EVENT_BUS_KEY.LOAD_FILE_JS_REQUEST.replace('FILE', filename), function() {
                              next();

                              setTimeout(function() {
                                // NOTE - if _resConfirmFileIsCompile is exist, do it
                                if(_resConfirmFileIsCompile) {
                                  _resConfirmFileIsCompile();
                                } else {
                                  browserSync.sockets.emit('isJsFilesOnLoadFinish', {
                                    is_finish: true,
                                  });
                                }

                                // NOTE - Check print error if has
                                GulpTaskStore.get(STATE_KEYS.handler_error_util).reportError();
                                GulpTaskStore.get(STATE_KEYS.handler_error_util).notifSuccess();
                              }, 20);
                            });

                            return;
                          } else {
                            next();
                            return;
                          }
                        }

                        if(req.url.includes('vendor-style.css')) {
                          const filename = req.url.split('/').slice(-2)[1].split('?')[0].replace('-style.css', '');

                          if(_isNewestAsset(ARR_FILE_EXTENSION.CSS ,filename)) {
                            EventBus.emit(EVENT_BUS_KEY.CONVERT_SCSS_REQUEST, filename);
                            EventBus.once(EVENT_BUS_KEY.LOAD_FILE_CSS_REQUEST.replace('FILE', filename), function() {
                              next();
                            });
                            return;
                          } else {
                            return next();
                          }
                        }

                        if(
                          !req.url.includes('-page.js') &&
                          !req.url.includes('app.js') &&
                          !/vendor(|\-[0-9]+).js/.test(req.url) &&
                          !req.url.includes('vendor.css') &&
                          req.url.match(/\/image|\/font|\/language|\/js|\/css/img)
                        ) {
                          return next();
                        }

                        if(!process.env.ENABLE_SERVER) {
                          const urlSplitted = req.url.split('/');
                          const firstDispathcerParam = urlSplitted[1] ? '/' + urlSplitted[1] : '/';

                          if(self._validRouterList[firstDispathcerParam]) {
                            req.url = self._validRouterList[firstDispathcerParam];
                          } else {
                            req.url = self._validRouterList['/'];
                          }

                          if(
                            !req.url.includes('-page.js') &&
                            !req.url.includes('app.js') &&
                            !/vendor(|\-[0-9]+).js/.test(req.url) &&
                            !req.url.includes('vendor.css')
                          ) {
                            return next();
                          }
                        }

                        // if(/^\/\/+/.test(req.url)) {
                          // console.log('run');
                          // req.rawUrl = req.url;
                          // res.writeHead(302, {Location: '/'});
                        // }

                        return next();
                      },
                    ]
                  },

                  ..._settingHttps,

                  callbacks: {
                    /**
                     * This 'ready' callback can be used
                     * to access the Browsersync instance
                     */
                    ready: function(err, bs) {
                      if(GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
                        EventBus.on(EVENT_BUS_KEY.RELOAD_PAGE_REQUEST, function(objRequest) {
                          GulpTaskStore.get(STATE_KEYS.handler_error_util).notifSuccess();
                          // browserSync.reload();

                          if(objRequest.type === 'css') {
                            browserSync.sockets.compress(true).emit('readyToUpdate', {
                              type: objRequest.type,
                              file_path: objRequest.file_path || '',
                              page_style_key: objRequest.page_style_key || '',
                              regex_replacement: objRequest.regex_replacement ||'',
                              file_content: objRequest.file_content || '',
                              is_reload: false,
                              key: objRequest.key,
                            });
                          } else {
                            browserSync.sockets.compress(true).emit('readyToUpdate', {
                              compile_key: GulpTaskStore.get(STATE_KEYS.current_page_key),
                              is_reload: true,
                            });
                          }
                        });

                        // NOTE Sau khi build xong lượt đầu thì forEach để in error ra nếu có
                        // if(GulpTaskStore.get(STATE_KEYS.handler_error_util).arrError) {
                        //   GulpTaskStore.get(STATE_KEYS.handler_error_util).reportError();
                        //   GulpTaskStore.get(STATE_KEYS.handler_error_util).notifSuccess();
                        // }

                        GulpTaskStore.commit(MUTATION_KEYS.set_is_browser_sync_finish, true);

                        // NOTE ghi nhận lượt buid đầu tiên đã xong
                        GulpTaskStore.commit(MUTATION_KEYS.set_is_first_compile_all, false);

                        // modules.fs.writeFile(APP.log.path + '/tmp-construct/tmp-construct-log.json', JSON.stringify(GulpTaskStore.get(STATE_KEYS.tmp_construct)), (err) => {
                        //   if(err) throw err;

                        //   console.log('write file: "tmp-construct-log.json" finish.');
                        // });

                        //! ANCHOR  - watchTask
                        //-- watch tmp files change task (with template njk)
                        WatchTmpWithTemplateAndFastModeTask.init();

                        // NOTE - init server side render
                        // const ServerSideRenderTask = require('@common/gulp-task/server-side-render-task-manager');

                        // ServerSideRenderTask.ServerSideRenderTaskFormatted.tmp.init();
                        gulp.series(
                          WatchTmpWithTemplateAndFastModeTask.name
                        )();

                        setTimeout(function() {
                          browserSync.stream();
                        }, 300);
                      }
                    }
                  }
                },
                // NOTE - callback for connection sockets io to browser
                function(err, bs) {
                  bs.io.sockets.on('connection', function(socket) {
                    _browserSyncConnection = bs;

                    // NOTE - Regist page type 'mpa: multiple / spa: single'
                    socket.on('registPageType', function(pageType) {
                      _pageType = pageType;
                    });

                    // NOTE - Update current compile keys
                    socket.on('updateCompileKeys', function(data, cb = function() {}) {
                      GulpTaskStore.commit(MUTATION_KEYS.set_current_page_key, data.current_page_key);
                      GulpTaskStore.commit(MUTATION_KEYS.set_current_init_key, data.current_init_key);

                      cb();
                    });
                  });
                });

                // browserSync.watch([APP.lab.path + '/language/*.json']);

                clearInterval(_onTaskFinish);
              }
            }, 100);

            cb();
          });
        }
      }
    };
  }; // getTmpMode()
};
