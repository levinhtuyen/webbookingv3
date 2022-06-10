import { isEmpty as _isEmpty, forIn as _forIn } from 'lodash';
import {
  EventBus,
} from '@common/lib/event-bus';
import {
  Sha1
} from '@common/lib/encrypt';
import modules, {
  gSourceMaps,
} from '@common/define/module-define';
import {
  EVENT_BUS_KEY,
} from '@common/define/event-bus';
import APP from '@common/enum/source-enum';
import {
  STATE_KEYS,
  MUTATION_KEYS,
  GulpTaskStore,
} from '@common/gulp-task/store';
import { ARR_FILE_EXTENSION } from '@common/define/file-define';
import {
  BASE_LOCALHOST_STATIC_URL,
} from '@common/config/resource-config';

export default class CompileJsTask {
  constructor() {};

  getTmp() {
    const self = this;

    return {
      name: 'jsSubTmp',
      init:  function() {
        let _isError = false;

        let _filePathDataCssChange = [];

        let _maxBrowserifyProcess = 3;

        let _asyncFinalEndJsCompileTaskTimeout = null;

        let _browserifyProcessList = [];

        let _asyncBrowserifyProcessFinalTimeout = null;

        let _browserifyProcessCount = 0;

        let _browserifyProcessInActionCount = 0;

        let _browserifyProcessFinishCount = 0;

        const _splittingCodeFileNameList = [];

        const _timeStampCache = GulpTaskStore.get(STATE_KEYS.update_version);

        modules.gulp.task('jsSubTmp', function() {
          let _arrJsErrorFileList = [];

          let _compileTimeout = null;

          return modules.gulp.src([
            APP.src.js + '/partial/**/page-module.js',
            APP.src.js + '/partial/**/mixin/*.js',
            APP.src.js + '/landing/**/partial/**/page-module.js',
            APP.src.js + '/landing/**/partial/**/mixin/*.js',

            APP.src.js + '/base/**/*.js',
            APP.src.js + '/define/**/*.js',
            APP.src.js + '/lib/**/*.js',
            APP.src.js + '/helper/**/*.js',
            APP.src.js + '/landing/**/base/**/*.js',
            APP.src.js + '/landing/**/define/**/*.js',
            APP.src.js + '/landing/**/lib/**/*.js',
            APP.src.js + '/landing/**/helper/**/*.js',
            APP.src.js + '/partial/**/*.vue',
            APP.src.js + '/app.vue',
            APP.src.js + '/landing/**/partial/**/*.vue',
            APP.src.js + '/landing/**/app.vue',
            APP.src.js + '/partial/**/*.css',
            APP.src.js + '/landing/**/*.css',
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
            const filename = filePath.split('/').slice(-2)[1];
            const foldername = filePath.split('/').slice(-2)[0];

            if(
              filename.indexOf(ARR_FILE_EXTENSION.CSS) !== -1 &&
              !GulpTaskStore.get(STATE_KEYS.is_js_finish)
            ) {
              return;
            }

            let filePathData = null;

            // NOTE - Nếu file được change không phải là css file thì thực hiện truy vấn graph dependencies bình thường
            if(filename.indexOf(ARR_FILE_EXTENSION.CSS) === -1) {
              filePathData = GulpTaskStore.get(STATE_KEYS.js_dependents).generate({
                'folder-name': foldername,
                'file-name': filename,
                'path': filePath,
                'content': file.contents,
              });
            } else if(!GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
              const targetJs = _generateJsTargetAfterCssChange(
                filePath,
                filename,
                foldername,
              );

              if(_filePathDataCssChange.indexOf(targetJs) === -1) {
                _filePathDataCssChange.push(targetJs);
              }

              if(_compileTimeout) {
                clearTimeout(_compileTimeout);
                _compileTimeout = null;
              }

              _compileTimeout = setTimeout(function() {
                _compileLoop(_filePathDataCssChange);

                _compileTimeout = null;
              }, 100);

              return;
            }

            if(GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
              return;
            }

            const awaitFilePathDataInterval = setInterval(function() {
              if(
                filePathData !== null &&
                filePathData !== undefined &&
                typeof filePathData === 'object' &&
                filePathData.length > 0
              ) {
                _compileLoop(filePathData);

                clearInterval(awaitFilePathDataInterval);
              }
            });
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
              modules.browserify({
                debug: true,
                entries: [strFilePath],
                cache: {},
                packageCache: {}
              }) // path to your entry file here
              .transform(modules.vueifyBabel7, {
                sourceMaps: true,
              })
              .transform(modules.babelify, {
                presets: [
                  "@babel/preset-env",
                ],
                sourceMaps: true,
              })
              .transform("aliasify")
              .external('vue') // remove vue from the bundle, if you omit this line whole vue will be bundled with your code
              // .plugin('common-shakeify')
              // .plugin('browser-pack-flat/plugin')
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

                      cb();
                    }
                  }
                },
              })
              .bundle()
              .pipe(modules.source(self._generateOtherAppName(filename, foldername)))
              .pipe(modules.buffer())
              // .pipe(uglify({
              //   compress: {
              //     sequences: true,
              //     properties: true,
              //     dead_code: true,
              //     drop_debugger: true,
              //     comparisons: true,
              //     conditionals: true,
              //     evaluate: true,
              //     booleans: true,
              //     loops: true,
              //     unused: true,
              //     hoist_funs: true,
              //     if_return: true,
              //     join_vars: true,
              //     negate_iife: true,
              //     drop_console: true
              //   }
              // }))
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
              .pipe(
                modules.gulp.dest(APP.tmp.js)
              )
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
                }
              });
            });

            if(
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
              }, 50);
            }
          });
        } // _compileLoop()

        function _generateJsTargetAfterCssChange(path, filename, foldername) {
          let jsTargetPath = path.split(filename)[0];

          if(jsTargetPath.indexOf('partial') === -1) {
            jsTargetPath+='index.js';
          } else {
            jsTargetPath+='the-'+filename.replace('-style.css','.js');
          }

          return jsTargetPath;
        } // _generateJsTargetAfterCssChange()
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
        filePath.includes('/landing') &&
        (
          filePath.includes('/app.js') ||
          filePath.includes('/vendor.js')
        )
      ) {
        const landingIdx = arrFilePathSplitted.indexOf('landing');
        strLandingDirName = arrFilePathSplitted[landingIdx + 1] + '-';
      }

      return strLandingDirName + fileName;
    }; // _generateCompileJsKey()

    return {
      fast: {
        name: 'jsSubTmpFastMode',
        init:  function() {
          modules.gulp.task('jsSubTmpFastMode', function() {
            let _arrJsErrorFileList = [];

            return modules.gulp.src([
              APP.src.js + '/partial/**/page-module.js',
              APP.src.js + '/partial/**/mixin/*.js',
              APP.src.js + '/landing/**/partial/**/page-module.js',
              APP.src.js + '/landing/**/partial/**/mixin/*.js',

              APP.src.js + '/base/**/*.js',
              APP.src.js + '/define/**/*.js',
              APP.src.js + '/lib/**/*.js',
              APP.src.js + '/helper/**/*.js',
              APP.src.js + '/landing/**/base/**/*.js',
              APP.src.js + '/landing/**/define/**/*.js',
              APP.src.js + '/landing/**/lib/**/*.js',
              APP.src.js + '/landing/**/helper/**/*.js',
              APP.src.js + '/partial/**/*.vue',
              APP.src.js + '/app.vue',
              APP.src.js + '/landing/**/partial/**/*.vue',
              APP.src.js + '/landing/**/app.vue',
            ], {allowEmpty: true})
            .pipe(gSourceMaps.init({ loadMaps: true }))
            .pipe(gSourceMaps.identityMap())
            .pipe(modules.plumber({
              'errorHandler': function(err) {
                console.log(err);
                _arrJsErrorFileList.push(err.fileName);
              },
            }))
            .pipe(modules.cached('.js'))
            .pipe(modules.tap(function(file) {
              const filePath = file.path.replace(/\\/g, '/');
              // NOTE split file.path và lấy tên file cùng tên folder để rename đúng tên cho file js phía tmp
              const filename = filePath.split('/').slice(-2)[1];
              const foldername = filePath.split('/').slice(-2)[0];

              if(
                filename.indexOf(ARR_FILE_EXTENSION.CSS) !== -1 &&
                !GulpTaskStore.get(STATE_KEYS.is_js_finish)
              ) {
                return;
              }

              let filePathData = null;

              filePathData = GulpTaskStore.get(STATE_KEYS.js_dependents).generate({
                'folder-name': foldername,
                'file-name': filename,
                'path': filePath,
                'content': file.contents,
              });

              if(GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
                return;
              }

              const currentPageKey = GulpTaskStore.get(STATE_KEYS.current_page_key);
              const currentInitKey = GulpTaskStore.get(STATE_KEYS.current_init_key);

              let compileJSList = GulpTaskStore.get(STATE_KEYS.compile_js_list);
              let hasReCompileJS = false;

              // NOTE - Debug dependent files
              // console.log('\n');
              // console.log('start get dependent files');
              // if(filePathData.length) {
              //   console.log((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString());
              //   console.log('filePathData:', filePathData);
              // }
              //-- end Debug dependent files

              filePathData.forEach(function(filePath) {
                // NOTE split file.path và lấy tên file cùng tên folder để rename đúng tên cho file js phía tmp
                let filename = filePath.split('/').slice(-2)[1];
                const foldername = filePath.split('/').slice(-2)[0];

                // NOTE - Debug dependent files
                // console.log('filename: '+filename);
                // console.log('foldername: '+foldername);
                //-- end Debug dependent files

                if(
                  filename.includes('-page') &&
                  !filename.includes(foldername)
                ) {
                  filename = 'the-'+foldername+'.js';
                }

                const compileJsKey = _generateCompileJsKey(filePath, filename);

                // NOTE - Debug dependent files
                // console.log('compileJsKey: '+compileJsKey);
                // console.log('currentPageKey: '+currentPageKey);
                // console.log('currentInitKey: '+currentInitKey);
                // console.log('\n');
                //-- end Debug dependent files

                if(
                  compileJsKey === currentPageKey ||
                  (
                    typeof currentInitKey === 'string' &&
                    currentInitKey.includes(compileJsKey)
                  )
                ) {
                  let compileType = 'recompile';

                  if(compileJSList[compileJsKey].is_first_compile) {
                    compileType = 'compile';
                  } else {
                    hasReCompileJS = true;
                  }

                  EventBus.emit(EVENT_BUS_KEY.TURN_ON_COMPILE_PROCESS_LOADING_REQUEST, true);

                  EventBus.emit(EVENT_BUS_KEY.COMPILE_JS_REQUEST, {
                    key: compileJsKey,
                    type: compileType,
                    from: ARR_FILE_EXTENSION.JS
                  });
                } else {
                  compileJSList[compileJsKey].is_newest = true;
                  GulpTaskStore.commit(MUTATION_KEYS.set_compile_js_list, compileJSList);
                }
              });

              if(!hasReCompileJS) {
                EventBus.emit(EVENT_BUS_KEY.SEND_COMPILE_LIST_TO_CLIENT_REQUEST, GulpTaskStore.get(STATE_KEYS.compile_js_list));
              }
            }))
          });
        }
      }
    }
  }; // getTmpMode()

  getDist() {}; // getDist()

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
