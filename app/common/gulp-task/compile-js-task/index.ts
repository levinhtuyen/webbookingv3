import { isEmpty as _isEmpty, forIn as _forIn } from 'lodash';
import {
  EventBus
} from '@common/lib/event-bus';
import {
  Sha1
} from '@common/lib/encrypt';
import modules, {
  uglify,
  gSourceMaps,
} from '@common/define/module-define';
import {
  EVENT_BUS_KEY
} from '@common/define/event-bus';
import APP from '@common/enum/source-enum';
import {
  STATE_KEYS,
  MUTATION_KEYS,
  GulpTaskStore,
} from '@common/gulp-task/store';
import { ARR_FILE_EXTENSION } from '@common/define/file-define';
import {
  RESOURCE,
  BASE_LOCALHOST_STATIC_URL,
  BASE_STATIC_URL,
} from '@common/config/resource-config';
// import { generateTmpDirItemConstruct } from '@common/enum/tmp-directory-enum';

export default class CompileJsTask {
  constructor() {};

  getTmp() {
    const self = this;

    return {
      name: 'jsTmp',
      init:  function() {
        let _isError = false;

        let _maxBrowserifyProcess = 3;

        let _asyncFinalEndJsCompileTaskTimeout = null;

        let _browserifyProcessList = [];

        let _asyncBrowserifyProcessFinalTimeout = null;

        let _asyncBrowserifyProcessFinalTiming = 50;

        let _browserifyProcessCount = 0;

        let _browserifyProcessInActionCount = 0;

        let _browserifyProcessFinishCount = 0;

        const _splittingCodeFileNameList = [];

        const _timeStampCache = GulpTaskStore.get(STATE_KEYS.update_version);

        modules.gulp.task('jsTmp', function() {
          let _arrJsErrorFileList = [];

          return modules.gulp.src([
            APP.src.js + '/vendor*.js',
            APP.src.js + '/app.js',
            APP.src.js + '/landing/**/vendor*.js',
            APP.src.js + '/landing/**/app.js',
            APP.src.js + '/partial/**/*-page.js',
            APP.src.js + '/landing/**/partial/**/*-page.js',
          ])
          .pipe(gSourceMaps.init({ loadMaps: true }))
          .pipe(gSourceMaps.identityMap())
          .pipe(modules.plumber({
            'errorHandler': function(err) {
              console.log(err);
              _arrJsErrorFileList.push(err.fileName);
            },
          }))
          .pipe(modules.cached('.js'))
          // .pipe(modules.eslint())
          // .pipe(modules.eslint.result(function(result) {
          //   if(result.warningCount > 0 || result.errorCount > 0) {
          //     _isError = true;

          //     const errorMessage = result.messages[0];

          //     GulpTaskStore.get(STATE_KEYS.handler_error_util).handlerError({
          //       plugin: 'gulp-eslint',
          //       lineNumber: errorMessage.line,
          //       fileName: result.filePath,
          //       message: errorMessage.message
          //     }, ARR_FILE_EXTENSION.JS, GulpTaskStore.get(STATE_KEYS.is_first_compile_all));
          //   }
          // }))
          .pipe(modules.tap(function(file) {
            const filePath = file.path.replace(/\\/g, '/');

            // NOTE split file.path và lấy tên file cùng tên folder để rename đúng tên cho file js phía tmp
            let filename = filePath.split('/').slice(-2)[1];
            const foldername = filePath.split('/').slice(-2)[0];

            if(
              filename.includes('-page') &&
              !filename.includes(foldername)
            ) {
              filename = 'the-'+foldername+'.js';
            }

            let filePathData = null;

            // NOTE Khi một file index thay đổi thì nó sẽ tự build lại, nên trong xử lý dependent chỉ update lại các dependents file của file index đó, chứ hok return ra mảng index cần build lại
            filePathData = GulpTaskStore.get(STATE_KEYS.js_dependents).generate({
              'folder-name': foldername,
              'path': filePath,
              'file-name': filename,
              'content': file.contents,
              'main': true,
            });

            _compileLoop(filePathData);
          }))
        });

        function _compileLoop(filePathData) {
          filePathData.forEach(function(strFilePath) {
            strFilePath = strFilePath.replace(/\\/g, '/');

            let filename = strFilePath.split('/').slice(-2)[1];
            const foldername = strFilePath.split('/').slice(-2)[0];

            if(
              filename.includes('-page') &&
              !filename.includes(foldername)
            ) {
              filename = 'the-'+foldername+'.js';
            }

            // filename = self._generateOtherAppName(filename, foldername).replace('.js', '');

            _browserifyProcessCount++;

            if(_browserifyProcessList.length === _maxBrowserifyProcess) {
              if(_asyncBrowserifyProcessFinalTimeout) {
                clearTimeout(_asyncBrowserifyProcessFinalTimeout);

                _asyncBrowserifyProcessFinalTimeout = null;
              }

              modules.runParallel(_browserifyProcessList);

              _browserifyProcessInActionCount+=_browserifyProcessList.length;

              _browserifyProcessList = [];
            }

            _browserifyProcessList.push(function() {
              modules.browserify(
                {
                  debug: true,
                  entries: [strFilePath],
                  cache: {},
                  packageCache: {}
                }
              ) // path to your entry file here
              .transform(modules.vueifyBabel7, {
                sourceMaps: true,
              })
              .transform(modules.babelify, {
                presets: [
                  "@babel/preset-env",
                ],
                plugins: [
                  // ["module-resolver", {
                  //   "root": ["."],
                  //   "alias": {
                  //   "~jsPath": "./src/js",
                  //   "~jsBasePath": "./src/js/base",
                  //   "~jsLibPath": "./src/js/lib",
                  //   "~jsDefinePath": "./src/js/define",
                  //   "~jsHelperPath": "./src/js/helper",
                  //   "~jsPartialPath": "./src/js/partial",
                  //   "~jsLandingPath": "./src/js/landing"
                  //   }
                  // }],
                  // "dynamic-import-split-require",
                  "@babel/plugin-transform-runtime",
                ],
                sourceMaps: true,
              })
              .transform("aliasify")
              .external('vue') // remove vue from the bundle, if you omit this line whole vue will be bundled with your code
              .plugin('common-shakeify')
              .plugin('browser-pack-flat/plugin')
              .plugin(modules.splitRequire, {
                filename: function(entry) {
                  const bundleName = entry.file + '?main=' + filename + '&v=' + _timeStampCache;

                  return Sha1.hash(bundleName).slice(0, 10) + '.js';
                },
                output: function (bundleName) {
                  if(_splittingCodeFileNameList.includes(bundleName)) {
                    return modules.to(onwrite,onend);

                    function onwrite (chunk, enc, cb) {
                      cb();
                    }

                    function onend (cb) {
                      this.emit('name', BASE_LOCALHOST_STATIC_URL.replace('http://', 'http:\\\\') + '/tmp/js/' + bundleName);
                      cb();
                    }
                  } else {
                    _splittingCodeFileNameList.push(bundleName);

                    const stream = modules.fs.createWriteStream(APP.tmp.js + '/' + bundleName);

                    return modules.to(onwrite,onend);

                    function onwrite (chunk, enc, cb) {
                      stream.write(chunk, cb);
                    }

                    function onend (cb) {
                      stream.end();
                      this.emit('name', BASE_LOCALHOST_STATIC_URL.replace('http://', 'http:\\\\') + '/tmp/js/' + bundleName);

                      modules.gulp.src(APP.tmp.js + '/' + bundleName)
                      .pipe(
                        uglify({
                          compress: {
                            sequences: true,
                            properties: true,
                            dead_code: true,
                            drop_debugger: true,
                            comparisons: true,
                            conditionals: true,
                            evaluate: true,
                            booleans: true,
                            loops: true,
                            unused: true,
                            hoist_funs: true,
                            if_return: true,
                            join_vars: true,
                            negate_iife: true,
                            drop_console: true
                          }
                        })
                      )
                      .pipe(modules.gulp.dest(APP.tmp.js))
                      .on('end', function() {
                        cb();
                      })

                      // cb();
                    }
                  }
                },
              })
              .bundle()
              .pipe(modules.source(self._generateOtherAppName(filename, foldername)))
              .pipe(modules.buffer())
              .pipe(uglify({
                compress: {
                  sequences: true,
                  properties: true,
                  dead_code: true,
                  drop_debugger: true,
                  comparisons: true,
                  conditionals: true,
                  evaluate: true,
                  booleans: true,
                  loops: true,
                  unused: true,
                  hoist_funs: true,
                  if_return: true,
                  join_vars: true,
                  negate_iife: true,
                  drop_console: true
                }
              }))
              .pipe(modules.print(
                filepath => {
                  return modules.ansiColors.yellow(`compile js: ${filepath}`);
                }
              ))
              .pipe(modules.rename(function(path) {
                // NOTE Nếu construct JS đối với path file name hiện tại đang rỗng thì nạp vào
                // if(!GulpTaskStore.get(STATE_KEYS.tmp_construct)[ARR_FILE_EXTENSION.JS][filename]) {
                //   GulpTaskStore.dispatch(ACTION_KEYS.generate_tmp_construct, generateTmpDirItemConstruct({
                //     extension: ARR_FILE_EXTENSION.JS,
                //     file_name: filename,
                //     file_path: APP.tmp.js + '/' + filename,
                //   }));
                // }

                // if(!GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
                //   modules.fs.writeFile(APP.log.path + '/tmp-construct/tmp-construct-log.json', JSON.stringify(GulpTaskStore.get(STATE_KEYS.tmp_construct)), (err) => {
                //     if(err) throw err;
                //   });
                // }
              }))
              .pipe(modules.buffer())
              .on('error', function() {
                this.emit('end');
              })
              .pipe(gSourceMaps.write())
              .pipe(modules.gulp.dest(APP.tmp.js))
              .on('end', function() {
                _browserifyProcessFinishCount++;

                if(_browserifyProcessCount === _browserifyProcessFinishCount) {
                  if(GulpTaskStore.get(STATE_KEYS.js_dependents).isFirstCompile) {
                    // NOTE Đánh dấu lượt compile đầu tiên đã hoàn thành
                    GulpTaskStore.commit(MUTATION_KEYS.set_is_js_finish, true);
                    GulpTaskStore.get(STATE_KEYS.js_dependents).isFirstCompile = false;
                  } else if(GulpTaskStore.get(STATE_KEYS.is_js_finish)) {
                    if(_asyncFinalEndJsCompileTaskTimeout) {
                      clearTimeout(_asyncFinalEndJsCompileTaskTimeout);
                      _asyncFinalEndJsCompileTaskTimeout = null;
                    }

                    _asyncFinalEndJsCompileTaskTimeout = setTimeout(function() {
                      const strErrKey = (filename === 'index.js' ? foldername + '.js' : filename);

                      // NOTE - Sau lần build đầu tiên sẽ tiến hành checkUpdateError
                      GulpTaskStore.get(STATE_KEYS.handler_error_util).checkClearError(_isError, ARR_FILE_EXTENSION.JS, strErrKey);
                      GulpTaskStore.get(STATE_KEYS.handler_error_util).reportError();
                      GulpTaskStore.get(STATE_KEYS.handler_error_util).notifSuccess();

                      _isError = false;

                      // const curFileName = APP.tmp.js + '/' + filename + '.js';
                      // const clearCacheFileName = curFileName.replace('.js', Date.now() + '.js');

                      // NOTE - Xoá cache file bị trên window
                      // try {
                      //   fs.renameSync(curFileName, clearCacheFileName);
                      //   fs.renameSync(clearCacheFileName, curFileName);
                      // } catch(err) {}

                      // console.log('write file: "tmp-construct-log.json" finish.');

                      // NOTE - Hiện tại đang sử dụng reload watch file change trực tiếp từ browsersync
                      // browserSync.reload(
                      //   { stream: true }
                      // );

                      clearTimeout(_asyncFinalEndJsCompileTaskTimeout);
                    }, 25);
                  }

                  _browserifyProcessCount = 0;
                  _browserifyProcessInActionCount= 0;
                  _browserifyProcessFinishCount = 0;

                  // _asyncBrowserifyProcessFinalTiming = 0;
                }
              });
            });

            if(
              (
                GulpTaskStore.get(STATE_KEYS.is_js_finish) ||
                _browserifyProcessInActionCount !== 0
              ) &&
              _browserifyProcessCount - _browserifyProcessInActionCount <= _maxBrowserifyProcess
            ) {
              if(_asyncBrowserifyProcessFinalTimeout) {
                clearTimeout(_asyncBrowserifyProcessFinalTimeout);

                _asyncBrowserifyProcessFinalTimeout = null;
              }

              _asyncBrowserifyProcessFinalTimeout = setTimeout(function() {
                modules.runParallel(_browserifyProcessList);

                _browserifyProcessInActionCount+=_browserifyProcessList.length;

                _browserifyProcessList = [];

                clearTimeout(_asyncBrowserifyProcessFinalTimeout);
                _asyncBrowserifyProcessFinalTimeout = null;
              }, _asyncBrowserifyProcessFinalTiming);
            }
          });
        } // _compileLoop()
      }
    }
  }; // getTmp()

  getTmpMode() {
    const self = this;

    const _generateCompileJsKey = (
      filePath: string,
      fileName: string,
    ) => {
      fileName = fileName.replace(/the-|.js/img,'');
      const arrFilePathSplitted = filePath.split('/');
      let strLandingDirName = '';

      if(
        filePath.indexOf('/landing') !== -1 &&
        (
          filePath.indexOf('/app.js') !== -1 ||
          /vendor(|\-[0-9]+).js/.test(filePath)
        )
      ) {
        const landingIdx = arrFilePathSplitted.indexOf('landing');
        strLandingDirName = arrFilePathSplitted[landingIdx + 1] + '-';
      }

      return strLandingDirName + fileName;
    }; // _generateCompileJsKey()

    return {
      fast: {
        name: 'jsTmpFast',
        init:  function() {
          const _compileJSList = {};

          // NOTE - Save name of newest JS need to compile processing
          let _compileJSKeyNewest = '';

          // NOTE - Listen when browersync nee d to compile some js file
          EventBus.on(EVENT_BUS_KEY.COMPILE_JS_REQUEST, function(objRequest) {
            const compileJsKey = objRequest.key;

            if(objRequest.type === 'compile') {
              if(
                _compileJSList[compileJsKey] &&
                GulpTaskStore.get(STATE_KEYS.compile_js_list)[compileJsKey].is_newest &&
                typeof _compileJSList[compileJsKey].process === 'function'
              ) {
                _compileJSKeyNewest = compileJsKey;
                _compileJSList[compileJsKey].process();
                _compileJSList[compileJsKey].is_newest = false;

                GulpTaskStore.commit(MUTATION_KEYS.set_compile_js_list, _compileJSList);
              } else if(!GulpTaskStore.get(STATE_KEYS.compile_js_list)[compileJsKey].is_newest) {
                _compileJSKeyNewest = '';
                EventBus.emit(EVENT_BUS_KEY.LOAD_FILE_JS_REQUEST.replace('FILE', compileJsKey), true);
              }
            } else if(objRequest.type === 'recompile') {
              _compileJSKeyNewest = compileJsKey;
              _compileJSList[compileJsKey].process(true);

              if(_compileJSList[compileJsKey].is_newest) {
                _compileJSList[compileJsKey].is_newest = false;
                GulpTaskStore.commit(MUTATION_KEYS.set_compile_js_list, _compileJSList);
              }
            }
          });

          // NOTE - Listen when only update js status
          EventBus.on(EVENT_BUS_KEY.UPDATE_STATUS_JS_REQUEST, function(compileJsKey) {
            if(
              _compileJSList[compileJsKey] &&
              !_compileJSList[compileJsKey].is_newest
            ) {
              _compileJSList[compileJsKey].is_newest = true;
              GulpTaskStore.commit(MUTATION_KEYS.set_compile_js_list, _compileJSList);
            }
          });

          modules.gulp.task('jsTmpFast', function() {
            let _arrJsErrorFileList = [];

            return modules.gulp.src([
              APP.src.js + '/vendor*.js',
              APP.src.js + '/app.js',
              APP.src.js + '/landing/**/vendor*.js',
              APP.src.js + '/landing/**/app.js',
              APP.src.js + '/partial/**/*-page.js',
              APP.src.js + '/landing/**/partial/**/*-page.js',
            ])
            .pipe(gSourceMaps.init({ loadMaps: true }))
            .pipe(gSourceMaps.identityMap())
            .pipe(modules.plumber({
              'errorHandler': function(err) {
                console.log(err);
                _arrJsErrorFileList.push(err.fileName);
              },
            }))
            .pipe(modules.cached('.js'))
            .pipe(
              modules.tap(function(file) {
                const filePath = file.path.replace(/\\/g, '/');

                // NOTE split file.path và lấy tên file cùng tên folder để rename đúng tên cho file js phía tmp
                let filename = filePath.split('/').slice(-2)[1];
                const foldername = filePath.split('/').slice(-2)[0];

                if(
                  filename.indexOf('-page') !== -1 &&
                  filename.indexOf(foldername) === -1
                ) {
                  filename = 'the-'+foldername+'.js';
                }

                const compileJsKey = _generateCompileJsKey(
                  filePath,
                  filename,
                );

                // NOTE Khi một file index thay đổi thì nó sẽ tự build lại, nên trong xử lý dependent chỉ update lại các dependents file của file index đó, chứ hok return ra mảng index cần build lại
                GulpTaskStore.get(STATE_KEYS.js_dependents).generate({
                  'folder-name': foldername,
                  'path': filePath,
                  'file-name': filename,
                  'content': file.contents,
                  'main': true,
                });

                // NOTE - Store compile list process each main js file
                if(!_compileJSList[compileJsKey]) {
                  _compileJSList[compileJsKey] = {
                    is_newest: true,
                    is_first_compile: true,
                    is_processing: false,

                    process: function(isRebuild: boolean = false) {
                      this.is_processing = true;

                      modules.browserify(
                        {
                          debug: true,
                          entries: [filePath],
                          // fullPaths : true,
                          cache : {}, // <---- here is important things for optimization
                          packageCache : {}, // <----  and here
                        }
                      ) // path to your entry file here
                      .transform(modules.vueifyBabel7
                        // .option('babel', {
                        //   stage: 0, // use all the fancy stage 0 features!
                        //   optional: ['runtime'],
                        //   loose: 'all',
                        //   nonStandard: false
                        // })
                      )
                      .transform(modules.babelify, {
                        presets: [
                          "@babel/preset-env",
                        ],
                        plugins: [
                          '@babel/plugin-transform-runtime',
                        ],
                        sourceMaps: true,
                      })
                      .transform("aliasify")
                      .external('vue') // remove vue from the bundle, if you omit this line whole vue will be bundled with your code
                      .bundle()
                      .pipe(modules.source(self._generateOtherAppName(filename, foldername)))
                      .pipe(modules.print(
                        filepath => {
                          return modules.ansiColors.yellow(`compile js: ${filepath}`);
                        }
                      ))
                      .pipe(modules.buffer())
                      .on('error', function() {
                        this.emit('end');
                      })
                      .pipe(modules.buffer())
                      .pipe(gSourceMaps.write())
                      .pipe(modules.gulp.dest(APP.tmp.js))
                      .on('end', function() {
                        _compileJSList[compileJsKey].is_processing = false;

                        if(
                          isRebuild
                          && compileJsKey === _compileJSKeyNewest
                        ) {
                          EventBus.emit(EVENT_BUS_KEY.RELOAD_PAGE_REQUEST, true);
                        } else {
                          EventBus.emit(EVENT_BUS_KEY.LOAD_FILE_JS_REQUEST.replace('FILE', compileJsKey), true);

                          _compileJSList[compileJsKey].is_first_compile = false;
                        }

                        GulpTaskStore.commit(MUTATION_KEYS.set_compile_js_list, _compileJSList);
                      });

                      GulpTaskStore.commit(MUTATION_KEYS.set_compile_js_list, _compileJSList);
                    }
                  }

                  GulpTaskStore.commit(MUTATION_KEYS.set_compile_js_list, _compileJSList);
                } else {
                  const currentPageKey = GulpTaskStore.get(STATE_KEYS.current_page_key);
                  const currentInitKey = GulpTaskStore.get(STATE_KEYS.current_init_key);

                  if(
                    compileJsKey === currentPageKey ||
                    currentInitKey.includes(compileJsKey)
                  ) {
                    EventBus.emit(EVENT_BUS_KEY.TURN_ON_COMPILE_PROCESS_LOADING_REQUEST, true);
                    _compileJSKeyNewest = compileJsKey;
                    _compileJSList[compileJsKey].process(true);
                  } else {
                    _compileJSList[compileJsKey].is_newest = true;
                    GulpTaskStore.commit(MUTATION_KEYS.set_compile_js_list, _compileJSList);
                  }
                }
              })
              .on('end', function() {
                // NOTE Đánh dấu lượt compile đầu tiên đã hoàn thành
                GulpTaskStore.commit(MUTATION_KEYS.set_is_js_finish, true);
                GulpTaskStore.get(STATE_KEYS.js_dependents).isFirstCompile = false;
              })
            )
          });
        }
      },

      esbuild: {
        name: 'jsTmpEsBuild',
        init:  function() {
          const _compileJSList = {};
          let _isError = false;

          // NOTE - Save name of newest JS need to compile processing
          let _compileJSKeyNewest = '';

          // NOTE - custom plugin for setup external libs
          const namespace = 'external-global-plugin';
          const externalGlobalPlugin = (externals) => {
            return {
              name: namespace,
              setup(build) {
                build.onResolve({
                  filter: new RegExp("^(" + Object.keys(externals).join("|") + ")$")
                }, (args) => ({
                  path: args.path,
                  namespace
                }));
                build.onLoad({
                  filter: /.*/,
                  namespace
                }, (args) => {
                  const contents = `module.exports = ${externals[args.path]}`;
                  return {
                    contents
                  };
                });
              }
            };
          };

          // NOTE - Listen when browersync nee d to compile some js file
          EventBus.on(EVENT_BUS_KEY.COMPILE_JS_REQUEST, function(objRequest) {
            // NOTE - Debug Compile JS Request
            // console.log(objRequest);
            //-- Debug Compile JS Request

            const compileJsKey = objRequest.key;

            if(objRequest.type === 'compile') {
              if(
                _compileJSList[compileJsKey] &&
                GulpTaskStore.get(STATE_KEYS.compile_js_list)[compileJsKey].is_newest &&
                typeof _compileJSList[compileJsKey].process === 'function'
              ) {
                _compileJSKeyNewest = compileJsKey;
                _compileJSList[compileJsKey].process();
                _compileJSList[compileJsKey].is_newest = false;

                GulpTaskStore.commit(MUTATION_KEYS.set_compile_js_list, _compileJSList);
              } else if(!GulpTaskStore.get(STATE_KEYS.compile_js_list)[compileJsKey].is_newest) {
                _compileJSKeyNewest = '';
                EventBus.emit(EVENT_BUS_KEY.LOAD_FILE_JS_REQUEST.replace('FILE', compileJsKey), true);
              }
            } else if(objRequest.type === 'recompile') {
              _compileJSKeyNewest = compileJsKey;
              _compileJSList[compileJsKey].process(true);

              if(
                _compileJSList[compileJsKey].is_newest ||
                objRequest.skip_check
              ) {
                _compileJSList[compileJsKey].is_newest = false;
                GulpTaskStore.commit(MUTATION_KEYS.set_compile_js_list, _compileJSList);
              }
            }
          });

          // NOTE - Listen when only update js status
          EventBus.on(EVENT_BUS_KEY.UPDATE_STATUS_JS_REQUEST, function(compileJsKey) {
            if(
              _compileJSList[compileJsKey] &&
              !_compileJSList[compileJsKey].is_newest
            ) {
              _compileJSList[compileJsKey].is_newest = true;
              GulpTaskStore.commit(MUTATION_KEYS.set_compile_js_list, _compileJSList);
            }
          });

          modules.gulp.task('jsTmpEsBuild', function() {
            let _arrJsErrorFileList = [];

            return modules.gulp.src([
              APP.src.js + '/vendor*.js',
              APP.src.js + '/app.js',
              APP.src.js + '/landing/**/vendor*.js',
              APP.src.js + '/landing/**/app.js',
              APP.src.js + '/partial/**/*-page.js',
              APP.src.js + '/landing/**/partial/**/*-page.js',
            ])
            .pipe(modules.plumber({
              'errorHandler': function(err) {
                console.log(err);
                _arrJsErrorFileList.push(err.fileName);
              },
            }))
            .pipe(modules.cached('.js'))
            .pipe(
              modules.tap(function(file) {
                const filePath = file.path.replace(/\\/g, '/');

                // NOTE split file.path và lấy tên file cùng tên folder để rename đúng tên cho file js phía tmp
                const originFileName = filePath.split('/').slice(-2)[1];
                let filename = originFileName;
                const foldername = filePath.split('/').slice(-2)[0];

                if(
                  filename.indexOf('-page') !== -1 &&
                  filename.indexOf(foldername) === -1
                ) {
                  filename = 'the-'+foldername+'.js';
                }

                const compileJsKey = _generateCompileJsKey(
                  filePath,
                  filename,
                );

                // NOTE Khi một file index thay đổi thì nó sẽ tự build lại, nên trong xử lý dependent chỉ update lại các dependents file của file index đó, chứ hok return ra mảng index cần build lại
                GulpTaskStore.get(STATE_KEYS.js_dependents).generate({
                  'folder-name': foldername,
                  'path': filePath,
                  'file-name': filename,
                  'content': file.contents,
                  'main': true,
                });

                // NOTE - Store compile list process each main js file
                if(!_compileJSList[compileJsKey]) {
                  _compileJSList[compileJsKey] = {
                    is_newest: true,
                    is_first_compile: true,
                    is_processing: false,

                    process: function(isRebuild: boolean = false) {
                      this.is_processing = true;

                      modules.gulp.src(filePath)
                      .pipe(modules.plumber({
                        'errorHandler': function(err) {
                          _isError = true;
                          _compileJSList[compileJsKey].is_newest = true;
                          GulpTaskStore.commit(MUTATION_KEYS.set_compile_js_list, _compileJSList);

                          this.emit('end');
                        },
                      }))
                      .pipe(
                        modules.gulpEsbuild({
                          bundle: true,
                          minify: true,
                          target: 'es2020',
                          sourcemap: true,
                          format: 'iife',
                          plugins: [
                            modules.vuePlugin({
                              workers: false,
                              // workers: 4,
                              production: true,
                            }),
                            externalGlobalPlugin({
                              axios: 'axios',
                              EventBus: 'EventBus',
                            }),
                          ],
                          logLevel: 'warning',
                          outfile: self._generateOtherAppName(filename, foldername),
                        })
                      )
                      .pipe(modules.print(
                        filepath => {
                          return modules.ansiColors.yellow(`compile js: ${filepath}`);
                        }
                      ))
                      // .pipe(gSourceMaps.write())
                      // .pipe(modules.rename(self._generateOtherAppName(filename, foldername)))
                      // .pipe(modules.buffer())
                      .pipe(modules.gulp.dest(APP.tmp.js))
                      .on('end', function() {
                        _compileJSList[compileJsKey].is_processing = false;

                        if(_isError) {
                          _isError = false;
                        } else {
                          if(originFileName.indexOf('-page') !== -1) {
                            const styleTagClass = (originFileName.replace('the-','')).replace('.js','-style-tag');

                            const content = (modules.fs.readFileSync(APP.tmp.js + '/' + self._generateOtherAppName(filename, foldername), "utf8"));

                            const createStyleScript = content.match(/[a-zA-Z]+=[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+.element=document.createElement\(\"style\"\)/);

                            if(createStyleScript) {
                              const styleInitVariable = createStyleScript[0].split('=')[0];

                              modules.fs.writeFileSync(APP.tmp.js + '/' + self._generateOtherAppName(filename, foldername), String(content).replace(
                                /element=document.createElement\(\"style\"\)/img,
                                'element=document.createElement("style");'+ styleInitVariable +'.setAttribute("class", "'+ styleTagClass +'")'
                              ));
                            }
                          }

                          if(
                            isRebuild
                            && compileJsKey === _compileJSKeyNewest
                          ) {
                            EventBus.emit(EVENT_BUS_KEY.RELOAD_PAGE_REQUEST, true);
                          } else {
                            EventBus.emit(EVENT_BUS_KEY.LOAD_FILE_JS_REQUEST.replace('FILE', compileJsKey), true);

                            _compileJSList[compileJsKey].is_first_compile = false;
                          }
                        }

                        GulpTaskStore.commit(MUTATION_KEYS.set_compile_js_list, _compileJSList);
                      });

                      GulpTaskStore.commit(MUTATION_KEYS.set_compile_js_list, _compileJSList);
                    }
                  }

                  GulpTaskStore.commit(MUTATION_KEYS.set_compile_js_list, _compileJSList);
                } else {
                  const currentPageKey = GulpTaskStore.get(STATE_KEYS.current_page_key);
                  const currentInitKey = GulpTaskStore.get(STATE_KEYS.current_init_key);

                  if(
                    compileJsKey === currentPageKey ||
                    currentInitKey.indexOf(compileJsKey) !== -1
                  ) {
                    EventBus.emit(EVENT_BUS_KEY.TURN_ON_COMPILE_PROCESS_LOADING_REQUEST, true);
                    _compileJSKeyNewest = compileJsKey;
                    _compileJSList[compileJsKey].process(true);
                  } else {
                    _compileJSList[compileJsKey].is_newest = true;
                    GulpTaskStore.commit(MUTATION_KEYS.set_compile_js_list, _compileJSList);
                  }
                }
              })
              .on('end', function() {
                // NOTE Đánh dấu lượt compile đầu tiên đã hoàn thành
                GulpTaskStore.commit(MUTATION_KEYS.set_is_js_finish, true);
                GulpTaskStore.get(STATE_KEYS.js_dependents).isFirstCompile = false;
              })
            )
          });
        }
      },
    }
  }; // getTmpMode()

  getDistStaging() {
    const self = this;
    return {
      name: 'jsDistStaging',
      init: function() {
        let _browserifyProcessList = [];
        const _splittingCodeFileNameList = [];
        const _timeStampCache = GulpTaskStore.get(STATE_KEYS.update_version);

        const _BASE_STATIC_URL = (process.env.STATIC_URL || BASE_STATIC_URL);

        modules.gulp.task('jsDistStaging', function() {
          const _JS_COMPILE_FILE_LIST = [
            APP.src.js + '/vendor*.js',
            APP.src.js + '/app.js',
            APP.src.js + '/landing/**/vendor*.js',
            APP.src.js + '/landing/**/app.js',
            APP.src.js + '/partial/**/*-page.js',
            APP.src.js + '/landing/**/partial/**/*-page.js',
          ];

          return modules.gulp.src(_JS_COMPILE_FILE_LIST)
          .pipe(
            modules.tap(function(file) {
              const filePath = file.path.replace(/\\/g, '/');
              // NOTE split file.path và lấy tên file cùng tên folder để rename đúng tên cho file js phía tmp
              let filename = filePath.split('/').slice(-2)[1];
              const foldername = filePath.split('/').slice(-2)[0];

              if(
                filename.indexOf('-page') !== -1 &&
                filename.indexOf(foldername) == -1
              ) {
                filename = 'the-'+foldername+'.js';
              }

              _browserifyProcessList.push(
                function() {
                  modules.browserify(
                    {
                      debug: false,
                      entries: [filePath],
                      cache: {},
                      packageCache: {}
                    }
                  ) // path to your entry file here
                  .transform(modules.vueifyBabel7)
                  .transform(modules.babelify, {
                    "presets": ["@babel/preset-env"],
                    plugins: [
                      '@babel/plugin-transform-runtime',
                    ],
                  })
                  .transform("aliasify")
                  .external('vue') // remove vue from the bundle, if you omit this line whole vue will be bundled with your code
                  .plugin(modules.splitRequire, {
                    filename: function(entry) {
                      const bundleName = entry.file + '?main=' + filename + '&v=' + _timeStampCache;

                      return Sha1.hash(bundleName).slice(0, 10) + '.js';
                    },
                    output: function (bundleName) {
                      if(_splittingCodeFileNameList.includes(bundleName)) {
                        return modules.to(onwrite,onend);

                        function onwrite (chunk, enc, cb) {
                          cb();
                        }

                        function onend (cb) {
                          this.emit('name', _BASE_STATIC_URL.replace('https://', 'https:\\\\') + '/js/' + bundleName);
                          cb();
                        }
                      } else {
                        _splittingCodeFileNameList.push(bundleName);

                        const stream = modules.fs.createWriteStream(APP.dist.js + '/' + bundleName);

                        return modules.to(onwrite,onend);

                        function onwrite (chunk, enc, cb) {
                          stream.write(chunk, cb);
                        }

                        function onend (cb) {
                          stream.end();
                          this.emit('name', _BASE_STATIC_URL.replace('https://', 'https:\\\\') + '/js/' + bundleName);

                          cb();
                        }
                      }
                    },
                  })
                  .bundle()
                  .pipe(modules.source(self._generateOtherAppName(filename, foldername)))
                  .pipe(modules.buffer())
                  .pipe(
                    modules.gulp.dest(APP.dist.js)
                  )
                }
              );
            })
            .on('end', function() {
              modules.runParallel(_browserifyProcessList);
            })
          );
        });
      }
    }
  }; // getDistStaging()

  getDist() {
    const self = this;
    return {
      name: 'jsDist',
      init: function() {
        let _browserifyProcessList = [];
        const _splittingCodeFileNameList = [];

        const _timeStampCache = GulpTaskStore.get(STATE_KEYS.update_version) || RESOURCE.project_version;

        modules.gulp.task('jsDist', function() {
          const _JS_COMPILE_FILE_LIST = [
            APP.src.js + '/vendor*.js',
            APP.src.js + '/app.js',
            APP.src.js + '/landing/**/vendor*.js',
            APP.src.js + '/landing/**/app.js',
            APP.src.js + '/partial/**/*-page.js',
            APP.src.js + '/landing/**/partial/**/*-page.js',
          ];

          return modules.gulp.src(_JS_COMPILE_FILE_LIST)
          .pipe(
            modules.tap(function(file) {
              const filePath = file.path.replace(/\\/g, '/');
              // NOTE split file.path và lấy tên file cùng tên folder để rename đúng tên cho file js phía tmp
              let filename = filePath.split('/').slice(-2)[1];
              const foldername = filePath.split('/').slice(-2)[0];

              if(
                filename.indexOf('-page') !== -1 &&
                filename.indexOf(foldername) === -1
              ) {
                filename = 'the-'+foldername+'.js';
              }

              _browserifyProcessList.push(
                function() {
                  modules.browserify(
                    {
                      debug: false,
                      entries: [filePath],
                      cache: {},
                      packageCache: {}
                    }
                  ) // path to your entry file here
                  .transform(modules.vueifyBabel7)
                  .transform(modules.babelify, {
                    "presets": ["@babel/preset-env"],
                    plugins: [
                      '@babel/plugin-transform-runtime',
                    ],
                  })
                  .transform("aliasify")
                  .external('vue') // remove vue from the bundle, if you omit this line whole vue will be bundled with your code
                  .plugin('common-shakeify')
                  .plugin('browser-pack-flat/plugin')
                  .plugin(modules.splitRequire, {
                    filename: function(entry) {
                      const bundleName = entry.file + '?main=' + filename + '&v=' + _timeStampCache;

                      return Sha1.hash(bundleName).slice(0, 10) + '.js';
                    },
                    output: function (bundleName) {
                      if(_splittingCodeFileNameList.includes(bundleName)) {
                        return modules.to(onwrite,onend);

                        function onwrite (chunk, enc, cb) {
                          cb();
                        }

                        function onend (cb) {
                          this.emit('name', BASE_STATIC_URL.replace('https://', 'https:\\\\') + '/js/' + bundleName);
                          cb();
                        }
                      } else {
                        _splittingCodeFileNameList.push(bundleName);

                        const stream = modules.fs.createWriteStream(APP.dist.js + '/' + bundleName);

                        return modules.to(onwrite,onend);

                        function onwrite (chunk, enc, cb) {
                          stream.write(chunk, cb);
                        }

                        function onend (cb) {
                          stream.end();
                          this.emit('name', BASE_STATIC_URL.replace('https://', 'https:\\\\') + '/js/' + bundleName);

                          modules.gulp.src(APP.dist.js + '/' + bundleName)
                          .pipe(
                            uglify({
                              compress: {
                                sequences: true,
                                properties: true,
                                dead_code: true,
                                drop_debugger: true,
                                comparisons: true,
                                conditionals: true,
                                evaluate: true,
                                booleans: true,
                                loops: true,
                                unused: true,
                                hoist_funs: true,
                                if_return: true,
                                join_vars: true,
                                negate_iife: true,
                                drop_console: true
                              }
                            })
                          )
                          .pipe(modules.gulp.dest(APP.dist.js))
                          .on('end', function() {
                            cb();
                          })
                        }
                      }
                    },
                  })
                  .bundle()
                  .pipe(modules.source(self._generateOtherAppName(filename, foldername)))
                  .pipe(modules.buffer())
                  .pipe(uglify({
                    compress: {
                      sequences: true,
                      properties: true,
                      dead_code: true,
                      drop_debugger: true,
                      comparisons: true,
                      conditionals: true,
                      evaluate: true,
                      booleans: true,
                      loops: true,
                      unused: true,
                      hoist_funs: true,
                      if_return: true,
                      join_vars: true,
                      negate_iife: true,
                      drop_console: true
                    }
                  }))
                  .pipe(
                    modules.gulp.dest(APP.dist.js)
                  )
                }
              );
            })
            .on('end', function() {
              modules.runParallel(_browserifyProcessList);
            })
          )
        });
      }
    }
  }; // getDist()

  private _generateOtherAppName(filename, foldername) {
    if(filename.includes('-page')) {
      return filename;
    }

    return (
      foldername === 'js' ?
        filename :
        foldername + '-' + filename
    );
  } // _generateOtherAppName()
};
