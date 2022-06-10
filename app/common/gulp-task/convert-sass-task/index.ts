import {
  EventBus,
} from '@common/lib/event-bus';
import modules, {fs} from '@common/define/module-define';
import {
  EVENT_BUS_KEY,
} from '@common/define/event-bus';
import APP from '@common/enum/source-enum';
import {
  STATE_KEYS,
  ACTION_KEYS,
  MUTATION_KEYS,
  GulpTaskStore,
} from '@common/gulp-task/store';
import { ARR_FILE_EXTENSION } from '@common/define/file-define';
import { generateTmpDirItemConstruct } from '@common/enum/tmp-directory-enum';
import {
  BASE_STATIC_URL,
  BASE_RESOURCE_URL,
} from '@common/config/resource-config';

export default class ConvertSassTask {
  autoprefixConfig: object = {
    remove: false,
    browsersList: [
      'Chrome >= 35',
      'Firefox >= 38',
      'Edge >= 12',
      'Explorer >= 10',
      'iOS >= 8',
      'Safari >= 8',
      'Android 2.3',
      'Android >= 4',
      'Opera >= 12',
    ],
  };

  constructor() {};

  getTmp() {
    const self = this;

    return {
      name: 'sassTmp',
      init:  function() {
        modules.gulp.task('sassTmp', function() {
          let _isError = false;

          let _curFilePath = null;
          let _newestFilePath = null;

          return modules.gulp.src(APP.src.scss + '/**/*.{scss,css}')
          .pipe(modules.cached('scss'))
          .pipe(modules.dependents())
          .pipe(
            modules.tap(
              function(file) {
                const filePath = file.path.replace(/\\/g, '/');

                _newestFilePath = filePath;

                const filePathSplit = filePath.split('/');
                const filePathSplitSlice = filePathSplit.slice(-2);
                const foldername = filePathSplitSlice[0];

                const rootDirName = filePathSplit[
                  (
                    filePathSplit.includes('landing') ?
                    filePathSplit.indexOf('landing') + 1 :
                    null
                  )
                ] || 'scss';

                let selfDest = APP.tmp.css;

                if(foldername !== rootDirName) {
                  const filename = filePathSplitSlice[1];

                  if(
                    !filename.includes('vendor') &&
                    !/^_/.test(filename)
                  ) {
                    let target = filePath.split('/scss')[1].replace(filename,'');
                    selfDest = APP.src.js + target;
                  }
                }

                let fileNameFormatted = filePathSplitSlice[1];

                modules.gulp.src(filePath)
                .pipe(modules.sassVars({
                  '$g2j-cache-ver-suffix': '?v='+GulpTaskStore.get(STATE_KEYS.update_version),
                  '$g2j-image-url': BASE_STATIC_URL + '/image',
                  '$g2j-logo-url': BASE_STATIC_URL + '/image/logo',
                  '$g2j-bg-url': BASE_STATIC_URL + '/image/bg',
                  '$g2j-icon-url': BASE_STATIC_URL + '/image/icon',
                  '$g2j-svg-url': BASE_STATIC_URL + '/image/svg',
                  '$g2j-font-url': BASE_STATIC_URL + '/font',
                }))
                .pipe(modules.sass({
                  // fiber: modules.fibers,
                  includePaths: ['./node_modules/', __dirname + '/node_modules', 'node_modules', './src/scss/','src/scss', __dirname + '/src/scss'],
                }))
                .on('error', function(err) {
                  _isError = true;
                  GulpTaskStore.get(STATE_KEYS.handler_error_util).handlerError(
                    err,
                    ARR_FILE_EXTENSION.CSS,
                    GulpTaskStore.get(STATE_KEYS.is_first_compile_all)
                  );

                  this.emit('end');
                })
                .pipe(modules.postcss([modules.autoprefixer(
                  self.autoprefixConfig
                )]))
                .pipe(modules.print(
                  (filepath) => {
                    if(filepath.indexOf('_env.scss') !== -1) {
                      return modules.ansiColors.blueBright(`update new sass cache version: ${GulpTaskStore.get(STATE_KEYS.update_version)}`);
                    }

                    return modules.ansiColors.yellow(`compile sass: ${filepath}`);
                  }
                ))
                .pipe(modules.rename(function(path) {
                  // NOTE đưa tất cả các file về cấp folder root của nó (ở đây là css)
                  path.dirname = '';
                  path.basename+='-style';

                  if(
                    foldername === rootDirName &&
                    foldername !== 'scss'
                  ) {
                    path.basename = rootDirName + '-' + path.basename;
                  }

                  fileNameFormatted = path.basename;

                  // NOTE Nếu construct CSS đối với path file name hiện tại đang rỗng thì nạp vào
                  if(!GulpTaskStore.get(STATE_KEYS.tmp_construct)[ARR_FILE_EXTENSION.CSS][path.basename]) {
                    GulpTaskStore.dispatch(
                      ACTION_KEYS.generate_tmp_construct,
                      generateTmpDirItemConstruct({
                        extension: ARR_FILE_EXTENSION.CSS,
                        file_name: path.basename,
                        file_path: selfDest + '/' + path.basename,
                      })
                    )
                  }

                  if(!GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
                    modules.fs.writeFile(APP.log.path + '/tmp-construct/tmp-construct-log.json', JSON.stringify(GulpTaskStore.get(STATE_KEYS.tmp_construct)), (err) => {
                      if(err) throw err;

                      console.log('write file: "tmp-construct-log.json" finish.');
                    });
                  }
                }))
                .pipe(modules.gulp.dest(selfDest))
                .on('end', function() {
                  _curFilePath = filePath;

                  if(_curFilePath === _newestFilePath) {
                    if(!GulpTaskStore.get(STATE_KEYS.is_sass_finish)) {
                      GulpTaskStore.commit(MUTATION_KEYS.set_is_sass_finish, true);
                    } else {
                      if(!GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
                        // NOTE - Sau lần build đầu tiên sẽ tiến hành checkUpdateError
                        // NOTE - Hiện tại đối với SPA khi compile sass sẽ compile lại app.js, nên việc reportError & notifySuccess sẽ để phía JS xử lý
                        GulpTaskStore.get(STATE_KEYS.handler_error_util).checkClearError(_isError, ARR_FILE_EXTENSION.CSS);

                        if(
                          _isError ||
                          fileNameFormatted.includes('vendor')
                        ) {
                          GulpTaskStore.get(STATE_KEYS.handler_error_util).reportError();
                          GulpTaskStore.get(STATE_KEYS.handler_error_util).notifSuccess();
                        }

                        _isError = false;

                        const curFileName = selfDest + '/' + fileNameFormatted + '.css';
                        const clearCacheFileName = curFileName.replace('.css', Date.now() + '.css');

                        // NOTE - Xoá cache file bị trên window
                        // try {
                        //   fs.renameSync(curFileName, clearCacheFileName);
                        //   fs.renameSync(clearCacheFileName, curFileName);
                        // } catch(err) {}
                      }
                    }
                  }
                });
              }
            )
          )
        });
      }
    }
  }; // getTmp()

  getTmpMode() {
    const self = this;

    const _generateCompileSassKey = (
      filePath: string,
      fileName: string,
    ) => {
      fileName = fileName.replace(/.scss/img,'');
      const arrFilePathSplitted = filePath.split('/');
      let strLandingDirName = '';

      if(
        filePath.includes('/landing') &&
        (
          filePath.includes('app.scss') ||
          filePath.includes('vendor.scss')
        )
      ) {
        const landingIdx = arrFilePathSplitted.indexOf('landing');
        strLandingDirName = arrFilePathSplitted[landingIdx + 1] + '-';
      }

      return strLandingDirName + fileName;
    }; // _generateCompileSassKey()

    return {
      fast: {
        name: 'sassTmpFastMode',
        init:  function() {
          const _convertSassList = {};

          // NOTE - Listen when browersync nee d to compile some js file
          EventBus.on(EVENT_BUS_KEY.CONVERT_SCSS_REQUEST, function(convertSassKey) {
            if(
              _convertSassList[convertSassKey] &&
              _convertSassList[convertSassKey].is_newest &&
              typeof _convertSassList[convertSassKey].process === 'function'
            ) {
              _convertSassList[convertSassKey].is_newest = false;
              _convertSassList[convertSassKey].process();

              GulpTaskStore.commit(MUTATION_KEYS.set_convert_scss_list, _convertSassList);
            } else if(!_convertSassList[convertSassKey]) {
              EventBus.emit(EVENT_BUS_KEY.COMPILE_JS_REQUEST, convertSassKey);
            } else if(!_convertSassList[convertSassKey].is_newest) {
              EventBus.emit(EVENT_BUS_KEY.LOAD_FILE_CSS_REQUEST.replace('FILE', convertSassKey), true);
            }
          });

          modules.gulp.task('sassTmpFastMode', function() {
            let _isError = false;

            return modules.gulp.src(APP.src.scss + '/**/*.{scss,css}')
            .pipe(modules.cached('scss'))
            .pipe(modules.dependents())
            .pipe(
              modules.tap(
                function(file) {
                  const filePath = file.path.replace(/\\/g, '/');
                  let filename = filePath.split('/').slice(-2)[1];

                  if(
                    !filename.includes('_') &&
                    (
                      filename.includes('vendor') ||
                      filename.includes('-page')
                    )
                  ) {
                    // NOTE split file.path và lấy tên file cùng tên folder để rename đúng tên cho file js phía tmp
                    const foldername = filePath.split('/').slice(-2)[0];

                    const uniqueFilename = (
                      filePath.includes('partial') &&
                      !filename.includes(foldername) ?
                      foldername+'.scss' :
                      filename
                    );

                    const filePathSplit = filePath.split('/');
                    const filePathSplitSlice = filePathSplit.slice(-2);

                    const rootDirName = filePathSplit[
                      (
                        filePathSplit.includes('landing') ?
                        filePathSplit.indexOf('landing') + 1 :
                        null
                      )
                    ] || 'scss';

                    let selfDest = APP.tmp.css;

                    if(foldername !== rootDirName) {
                      if(
                        !filename.includes('vendor') &&
                        !/^_/.test(filename)
                      ) {
                        let target = filePath.split('/scss')[1].replace(filename,'');
                        selfDest = APP.src.js + target;
                      }
                    }

                    let fileNameFormatted = filePathSplitSlice[1];

                    const convertSassKey = _generateCompileSassKey(
                      filePath,
                      uniqueFilename,
                    );

                    if(!_convertSassList[convertSassKey]) {
                      const tmpInsertCssContent = uniqueFilename.replace('.scss','')+'{content:\"\"}';

                      _convertSassList[convertSassKey] = {
                        is_newest: true,
                        is_processing: false,

                        process: function(isRebuild:boolean = false) {
                          this.is_processing = true;

                          modules.gulp.src(filePath)
                          .pipe(modules.sassVars({
                            '$g2j-cache-ver-suffix': '?v='+GulpTaskStore.get(STATE_KEYS.update_version),
                            '$g2j-image-url': BASE_STATIC_URL + '/image',
                            '$g2j-logo-url': BASE_STATIC_URL + '/image/logo',
                            '$g2j-bg-url': BASE_STATIC_URL + '/image/bg',
                            '$g2j-icon-url': BASE_STATIC_URL + '/image/icon',
                            '$g2j-svg-url': BASE_STATIC_URL + '/image/svg',
                            '$g2j-font-url': BASE_STATIC_URL + '/font',
                          }))
                          .pipe(modules.sass({
                            // fiber: modules.fibers,
                            outputStyle: 'compressed',
                            includePaths: ['./node_modules/', __dirname + '/node_modules', 'node_modules', './src/scss/','src/scss', __dirname + '/src/scss'],
                          }))
                          .on('error', function(err) {
                            _isError = true;
                            GulpTaskStore.get(STATE_KEYS.handler_error_util).handlerError(
                              err,
                              ARR_FILE_EXTENSION.CSS,
                              GulpTaskStore.get(STATE_KEYS.is_first_compile_all)
                            );

                            this.emit('end');
                          })
                          .pipe(
                            modules.postcss(
                              [
                                modules.autoprefixer(self.autoprefixConfig),
                                function(css) {
                                  css.prepend(tmpInsertCssContent);
                                  css.append(tmpInsertCssContent);
                                },
                              ],
                            )
                          )
                          .pipe(modules.print(
                            (filepath) => {
                              if(filepath.indexOf('_env.scss') !== -1) {
                                return modules.ansiColors.blueBright(`update new sass cache version: ${GulpTaskStore.get(STATE_KEYS.update_version)}`);
                              }

                              return modules.ansiColors.yellow(`compile sass: ${filepath}`);
                            }
                          ))
                          .pipe(modules.rename(function(path) {
                            // NOTE đưa tất cả các file về cấp folder root của nó (ở đây là css)
                            path.dirname = '';
                            path.basename+='-style';

                            if(
                              foldername === rootDirName &&
                              foldername !== 'scss'
                            ) {
                              path.basename = rootDirName + '-' + path.basename;
                            }

                            fileNameFormatted = path.basename;
                          }))
                          .pipe(modules.gulp.dest(selfDest))
                          .on('end', function() {
                            _convertSassList[convertSassKey].is_processing = false;

                            if(
                              isRebuild &&
                              _isError
                            ) {
                              // NOTE - Check print error if has
                              GulpTaskStore.get(STATE_KEYS.handler_error_util).reportError();
                              GulpTaskStore.get(STATE_KEYS.handler_error_util).notifSuccess();

                              _isError = false;

                              return;
                            }

                            GulpTaskStore.get(STATE_KEYS.handler_error_util).checkClearError(_isError, ARR_FILE_EXTENSION.CSS);

                            if(filename.includes('vendor')) {
                              if(isRebuild) {
                                const fileContent = fs.readFileSync(selfDest+'/'+fileNameFormatted+'.css', "utf8");

                                EventBus.emit(EVENT_BUS_KEY.RELOAD_PAGE_REQUEST, {
                                  type: 'css',
                                  file_path: '/tmp/css/' + fileNameFormatted + '.css',
                                  file_content: Buffer.from(fileContent),
                                });
                              } else {
                                EventBus.emit(EVENT_BUS_KEY.LOAD_FILE_CSS_REQUEST.replace('FILE', convertSassKey), true);
                              }
                            } else {
                              if(isRebuild) {
                                const fileContent = fs.readFileSync(selfDest+'/'+fileNameFormatted+'.css', "utf8");

                                EventBus.emit(EVENT_BUS_KEY.RELOAD_PAGE_REQUEST, {
                                  type: 'css',
                                  file_path: '/tmp/css/' + fileNameFormatted + '.css',
                                  page_style_key: filename.replace('.scss', ''),
                                  regex_replacement: tmpInsertCssContent+".*"+tmpInsertCssContent,
                                  file_content: Buffer.from(fileContent),
                                  key: convertSassKey,
                                });

                                _convertSassList[convertSassKey].is_newest = true;
                              } else {
                                EventBus.emit(EVENT_BUS_KEY.COMPILE_JS_REQUEST, {
                                  key: convertSassKey,
                                  type: (isRebuild ? 'recompile' : 'compile'),
                                  from: ARR_FILE_EXTENSION.SCSS
                                });
                              }
                            }

                            GulpTaskStore.commit(MUTATION_KEYS.set_is_sass_finish, true);
                          });

                          GulpTaskStore.commit(MUTATION_KEYS.set_is_sass_finish, true);
                        },
                      };

                      GulpTaskStore.commit(MUTATION_KEYS.set_convert_scss_list, _convertSassList);
                    } else {
                      _convertSassList[convertSassKey].process(true);
                      // if(
                      //   convertSassKey === GulpTaskStore.get(STATE_KEYS.current_page_key) ||
                      //   GulpTaskStore.get(STATE_KEYS.current_init_key).includes(convertSassKey)
                      // ) {
                        // EventBus.emit(EVENT_BUS_KEY.TURN_ON_COMPILE_PROCESS_LOADING_REQUEST, true);
                        // _convertSassList[convertSassKey].process(true);
                      // } else {
                        // _convertSassList[convertSassKey].is_newest = true;
                        // GulpTaskStore.commit(MUTATION_KEYS.set_convert_scss_list, _convertSassList);
                        // EventBus.emit(EVENT_BUS_KEY.UPDATE_STATUS_JS_REQUEST, convertSassKey);
                      // }
                    }
                  } // end - condition for vendor and -page
                } // end - tap file
              )
              .on('end', function() {
                if(!GulpTaskStore.get(STATE_KEYS.is_sass_finish)) {
                  GulpTaskStore.commit(MUTATION_KEYS.set_is_sass_finish, true);
                }
              })
            )
          });
        }
      }
    }
  }; // getTmpMode()

  getDistStaging() {
    const self = this;

    return {
      name: 'sassDistStaging',
      init: function() {
        modules.gulp.task('sassDistStaging', function() {
          return modules.gulp.src(APP.src.scss + '/**/*.{scss,css}')
          .pipe(modules.plumber())
          .pipe(
            modules.tap(
              function(file) {
                const filePath = file.path.replace(/\\/g, '/');
                const filePathSplit = filePath.split('/');
                const filePathSplitSlice = filePathSplit.slice(-2);
                const foldername = filePathSplitSlice[0];

                const rootDirName = filePathSplit[
                  (
                    filePathSplit.includes('landing') ?
                    filePathSplit.indexOf('landing') + 1 :
                    null
                  )
                ] || 'scss';

                let selfDest = APP.dist.css;

                if(foldername !== rootDirName) {
                  const filename = filePathSplitSlice[1];

                  if(
                    !filename.includes('vendor') &&
                    !/^_/.test(filename)
                  ) {
                    let target = filePath.split('/scss')[1].replace(filename,'');
                    selfDest = APP.src.js + target;
                  }
                }

                modules.gulp.src(filePath, {
                  allowEmpty: true
                })
                .pipe(modules.sassVars({
                  '$g2j-cache-ver-suffix': '?v='+GulpTaskStore.get(STATE_KEYS.update_version),
                  '$g2j-image-url': BASE_STATIC_URL + '/image',
                  '$g2j-logo-url': BASE_STATIC_URL + '/image/logo',
                  '$g2j-bg-url': BASE_STATIC_URL + '/image/bg',
                  '$g2j-icon-url': BASE_STATIC_URL + '/image/icon',
                  '$g2j-svg-url': BASE_STATIC_URL + '/image/svg',
                  '$g2j-font-url': BASE_STATIC_URL + '/font',
                }))
                .pipe(modules.sass({
                  // fiber: modules.fibers,
                  includePaths: ['./node_modules/', __dirname + '/node_modules', 'node_modules', './src/scss/','src/scss', __dirname + '/src/scss'],
                }))
                .pipe(modules.postcss([
                  modules.autoprefixer(
                    self.autoprefixConfig,
                  ),
                ]))
                .pipe(modules.rename(function(path) {
                  // NOTE đưa tất cả các file về cấp folder root của nó (ở đây là css)
                  path.dirname = '';
                  path.basename+='-style';

                  if(
                    foldername === rootDirName &&
                    foldername !== 'scss'
                  ) {
                    path.basename = rootDirName + '-' + path.basename;
                  }
                }))
                .pipe(modules.gulp.dest(selfDest))
              }
            )
          )
        });
      }
    }
  }; // getDistStaging()

  getDist() {
    const self = this;

    return {
      name: 'sassDist',
      init: function() {
        modules.gulp.task('sassDist', function() {
          return modules.gulp.src(APP.src.scss + '/**/*.{scss,css}')
          .pipe(modules.plumber())
          .pipe(
            modules.tap(
              function(file) {
                const filePath = file.path.replace(/\\/g, '/');
                const filePathSplit = filePath.split('/');
                const filePathSplitSlice = filePathSplit.slice(-2);
                const foldername = filePathSplitSlice[0];

                const rootDirName = filePathSplit[
                  (
                    filePathSplit.includes('landing') ?
                    filePathSplit.indexOf('landing') + 1 :
                    null
                  )
                ] || 'scss';

                let selfDest = APP.dist.css;

                if(foldername !== rootDirName) {
                  const filename = filePathSplitSlice[1];

                  if(
                    !filename.includes('vendor') &&
                    !/^_/.test(filename)
                  ) {
                    let target = filePath.split('/scss')[1].replace(filename,'');
                    selfDest = APP.src.js + target;
                  }
                }

                modules.gulp.src(filePath, {
                  allowEmpty: true
                })
                .pipe(modules.sassVars({
                  '$g2j-cache-ver-suffix': '?v='+GulpTaskStore.get(STATE_KEYS.update_version),
                  '$g2j-image-url': BASE_STATIC_URL + '/image',
                  '$g2j-logo-url': BASE_STATIC_URL + '/image/logo',
                  '$g2j-bg-url': BASE_STATIC_URL + '/image/bg',
                  '$g2j-icon-url': BASE_STATIC_URL + '/image/icon',
                  '$g2j-svg-url': BASE_STATIC_URL + '/image/svg',
                  '$g2j-font-url': BASE_STATIC_URL + '/font',
                }))
                .pipe(modules.sass({
                  // fiber: modules.fibers,
                  includePaths: ['./node_modules/', __dirname + '/node_modules', 'node_modules', './src/scss/','src/scss', __dirname + '/src/scss'],
                }))
                .pipe(modules.postcss([
                  modules.autoprefixer(
                    self.autoprefixConfig,
                  ),
                  modules.cssnano
                ]))
                .pipe(modules.rename(function(path) {
                  // NOTE đưa tất cả các file về cấp folder root của nó (ở đây là css)
                  path.dirname = '';
                  path.basename+='-style';

                  if(
                    foldername === rootDirName &&
                    foldername !== 'scss'
                  ) {
                    path.basename = rootDirName + '-' + path.basename;
                  }
                }))
                .pipe(modules.gulp.dest(selfDest))
              }
            )
          )
        });
      }
    }
  }; // getDist()
};
