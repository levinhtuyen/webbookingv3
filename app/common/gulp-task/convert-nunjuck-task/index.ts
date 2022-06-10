import { isEmpty as _isEmpty } from 'lodash';
import { EventBus } from '@common/lib/event-bus';

import modules from '@common/define/module-define';
import {
  EVENT_BUS_KEY,
} from '@common/define/event-bus';
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
// import { generateTmpDirItemConstruct } from '@common/enum/tmp-directory-enum';

export default class ConvertNunjuckTask {
  private ORIGIN_HTML_LANGUAGE : string = 'vi'; // ORIGIN_HTML_LANGUAGE

  constructor() {};

  getTmp() {
    const self = this;

    return {
      name: 'njkTmp',
      init:  function() {
        self.ORIGIN_HTML_LANGUAGE = self._generateRandomString();

        modules.gulp.task('njkTmp', function() {
          let _isError = false;

          let _curFilePath = null;

          // NOTE - Dùng để nạp tất cả files NJK đang và sẽ được compile trong lượt run task đó (value là đường path của file nên giá trị sẽ là unique)
          let _arrNJKCompileFile = [];

          // NOTE - Tính số lần hoàn thành compile để so sánh với số lượng file cần được compile
          let _totalComplete = 0;

          // NOTE - Define enviroment method for nunjucks render
          const _manageEnviroment = function(env) {
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
          };

          return modules.gulp.src(APP.src.njk + '/**/*.njk')
          .pipe(modules.cached('.njk'))
          .pipe(modules.tap(function(file) {
            const filePath = file.path.replace(/\\/g, '/');

            // NOTE split file.path và lấy tên file cùng tên folder để rename đúng tên cho file njk phía tmp
            const filename = filePath.split('/').slice(-2)[1];
            const foldername = filePath.split('/').slice(-2)[0];

            let filePathData = null;

            if(foldername === 'template') {
              // NOTE Khi một file index thay đổi thì nó sẽ tự build lại, nên trong xử lý dependent sẽ update lại các dependents file của file index đó
              filePathData = GulpTaskStore.get(STATE_KEYS.njk_dependents).generate({
                'folder-name': filename,
                'path': file.path,
                'file-name': 'index.njk',
                'content': file.contents,
              });
            } else {
              filePathData = GulpTaskStore.get(STATE_KEYS.njk_dependents).generate({
                'folder-name': foldername,
                'file-name': filename,
                'content': file.contents,
              });
            }

            // NOTE - this execute for update html docs cache
            if(!GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
              self.ORIGIN_HTML_LANGUAGE = self._generateRandomString();
            }

            if(
              GulpTaskStore.get(STATE_KEYS.is_first_compile_all) &&
              !(
                filename.includes('_layout') ||
                foldername === 'template'
              )
            ) {
              return;
            }

            if(
              filePathData &&
              filePathData.length > 0
            ) {
              filePathData.forEach(function(filePath) {
                filePath = filePath.replace(/\\/g, '/');

                // NOTE - Nạp file vào trong danh sách xử lý (danh sách này sẽ bao gồm tất cả file của task runner compile js chứ không riêng những file sau quá trình first compile)
                _arrNJKCompileFile.push(filePath);

                let filename = filePath.split('/').slice(-2)[1];

                filename = filename.replace('.njk', '');

                modules.gulp.src(filePath)
                .pipe(modules.print(
                  filepath => {
                    return modules.ansiColors.yellow(`convert njk: ${filepath}`);
                  }
                ))
                .pipe(modules.data((file) => {
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
                    _isError = true;

                    GulpTaskStore.get(STATE_KEYS.handler_error_util).handlerError(responseData, ARR_FILE_EXTENSION.JSON, GulpTaskStore.get(STATE_KEYS.is_first_compile_all));
                  } else {
                    GulpTaskStore.get(STATE_KEYS.handler_error_util).checkClearError(_isError, ARR_FILE_EXTENSION.JSON, dummyDataName + '.' + ARR_FILE_EXTENSION.JSON);
                  }

                  responseData = (_isError ? {} : responseData.data);

                  return {
                    file: filename,
                    namepage: filename,
                    data: responseData,
                    CACHE_VERSION: GulpTaskStore.get(STATE_KEYS.update_version) || RESOURCE.project_version,
                    ENV_APPLICATION: process.env.NODE_ENV,
                    ENV_API: (process.env.NODE_ENV === DEVELOPMENT ? RESOURCE.env_api : STAGING),
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
                      // 'imageUrl' : BASE_STATIC_URL + '/image', // NOTE - Vì image sử dụng trong layout config cho những file render numjuck sang html thường có dạng '{{ LAYOUT_CONFIG.imageUrl }}/fantasy-image08.jpg' nên để dev tự thêm / sẽ clear hơn khi sử dụng với nunjuck
                      // 'cssUrl' : BASE_STATIC_URL + '/tmp/css',
                      // 'jsUrl' : BASE_STATIC_URL + '/tmp/js',
                      // 'languageUrl': BASE_STATIC_URL + '/language',
                      'imageUrl' : BASE_STATIC_URL + '/image', // NOTE - Vì image sử dụng trong layout config cho những file render numjuck sang html thường có dạng '{{ LAYOUT_CONFIG.imageUrl }}/fantasy-image08.jpg' nên để dev tự thêm / sẽ clear hơn khi sử dụng với nunjuck
                      'cssUrl' : BASE_STATIC_URL + '/tmp/css',
                      'jsUrl' : BASE_STATIC_URL + '/tmp/js',
                      'languageUrl': '/language',
                    }
                  }
                }))
                .pipe(modules.nunjucksRender({
                  ext: '.html',
                  data: {
                    objGlobal: RESOURCE,
                    intRandomNumber : Math.random() * 10
                  },
                  manageEnv: _manageEnviroment,
                }))
                .on('error', function(err) {
                  _isError = true;
                  GulpTaskStore.get(STATE_KEYS.handler_error_util).handlerError(err, ARR_FILE_EXTENSION.NJK, GulpTaskStore.get(STATE_KEYS.is_first_compile_all));

                  this.emit('end');
                })
                .pipe(modules.rename(function(path) {
                  path.basename = filename;
                  // NOTE Nếu construct HTML đối với path file name hiện tại đang rỗng thì nạp vào
                  // GulpTaskStore.dispatch(ACTION_KEYS.generate_tmp_construct, generateTmpDirItemConstruct({
                  //   extension: ARR_FILE_EXTENSION.HTML,
                  //   file_name: path.basename,
                  //   file_path: APP.tmp.path + path.basename,
                  // }));

                  // if(!GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
                  //   modules.fs.writeFile(APP.log.path + '/tmp-construct/tmp-construct-log.json', JSON.stringify(GulpTaskStore.get(STATE_KEYS.tmp_construct)), (err) => {
                  //     if(err) throw err;

                  //     console.log('write file: "tmp-construct-log.json" finish.');
                  //   });
                  // }
                }))
                .pipe(modules.gulp.dest(APP.tmp.path))
                .on('end', function() {
                  _curFilePath = filePath;

                  if(_arrNJKCompileFile.indexOf(_curFilePath) !== -1) {
                    _totalComplete++;
                  }

                  if(_totalComplete === _arrNJKCompileFile.length) {
                    if(!GulpTaskStore.get(STATE_KEYS.is_njk_finish)) {
                      if(GulpTaskStore.get(STATE_KEYS.njk_dependents).isFirstCompile) {
                        GulpTaskStore.get(STATE_KEYS.njk_dependents).isFirstCompile = false;
                      }

                      GulpTaskStore.commit(MUTATION_KEYS.set_is_njk_finish, true);
                    } else {
                      // NOTE - Sau lần build đầu tiên sẽ tiến hành checkUpdateError
                      if(!GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
                        const strErrKey = filename + '.' + ARR_FILE_EXTENSION.NJK;
                        // NOTE - Sau lần build đầu tiên sẽ tiến hành checkUpdateError
                        GulpTaskStore.get(STATE_KEYS.handler_error_util).checkClearError(_isError, ARR_FILE_EXTENSION.NJK, strErrKey);

                        EventBus.emit(EVENT_BUS_KEY.RELOAD_PAGE_REQUEST, true);
                        // GulpTaskStore.get(STATE_KEYS.handler_error_util).reportError();
                        // GulpTaskStore.get(STATE_KEYS.handler_error_util).notifSuccess();

                        _isError = false;
                      }

                      // const curFileName = APP.tmp.path + '/' + filename + '.html';
                      // const clearCacheFileName = curFileName.replace('.html', Date.now() + '.html');

                      // NOTE - Xoá cache file bị trên window
                      // try {
                      //   fs.renameSync(curFileName, clearCacheFileName);
                      //   fs.renameSync(clearCacheFileName, curFileName);
                      // } catch(err) {}

                      // NOTE - Hiện tại đang sử dụng reload watch file change trực tiếp từ browsersync
                      // browserSync.reload(
                      //   { stream: false }
                      // );
                    }

                    _totalComplete = 0;
                    _arrNJKCompileFile = [];
                  }
                });
              });
            }
          }));
        });
      }
    }
  }; // getTmp()

  getDist() {
    const self = this;

    return {
      name: 'njkDist',
      init: function() {
        modules.gulp.task('njkDist', function() {
          const _manageEnviroment = function(env) {
            env.addFilter('json', function (value, spaces) {
              if (value instanceof modules.nunjucksRender.nunjucks.runtime.SafeString) {
                value = value.toString()
              }
              const jsonString = JSON.stringify(value, null, spaces).replace(/</g, '\\u003c')
              return modules.nunjucksRender.nunjucks.runtime.markSafe(jsonString)
            });

            env.addFilter('isString', function (val) {
              return typeof val === 'string';
            });

            env.addFilter('isEmpty', function (val) {
              return _isEmpty(val);
            });
          };

          const _NJK_COMPILE_FILE_LIST = [
            APP.src.njk + '/template/**/*.njk',
          ];

          return modules.gulp.src(_NJK_COMPILE_FILE_LIST)
          .pipe(modules.tap(function(file) {
            const filePath = file.path.replace(/\\/g, '/');

            let filename = filePath.split('/').slice(-2)[1];

            filename = filename.replace('.njk', '');

            modules.gulp.src(filePath)
            .pipe(modules.data(() => {
              let responseData:any = {};

              if(RESOURCE.resource[filename]?.dummy_data) {
                let dummyDataName = RESOURCE.resource[filename]?.dummy_data_name ?? null;

                responseData = GulpTaskStore.get(STATE_KEYS.dummy_data_manager).get(dummyDataName) || {};
              }

              responseData = (!responseData.success ? {} : responseData.data);

              return {
                file: filename,
                namepage: filename,
                data: responseData,
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
                  'languageUrl': BASE_STATIC_URL + '/language',
                }
              }
            }))
            .pipe(modules.nunjucksRender({
              ext: '.html',
              data: {
                objGlobal: RESOURCE,
                intRandomNumber : Math.random() * 10
              },
              manageEnv: _manageEnviroment,
            }))
            .pipe(modules.rename(function(path) {
                path.basename = filename;
              }
            ))
            // .pipe(modules.print(
            //   filepath => `built: ${filepath}`
            // ))
            .pipe(modules.gulp.dest(APP.dist.path));
          }));
        });
      }
    }
  }; // getDist()

  private _randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  }; // _randomIntFromInterval()

  private _generateRandomString() {
    const result = Math.random().toString(36).substring(2,7);

    return result.slice(0, this._randomIntFromInterval(0,5));
  }; // _generateRandomString()
};
