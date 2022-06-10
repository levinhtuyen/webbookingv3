import { isEmpty as _isEmpty } from 'lodash';

import modules, { fs } from '@common/define/module-define';
import APP from '@common/enum/source-enum';
import {
  STATE_KEYS,
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

export default class DummyDataTask {
  private ORIGIN_HTML_LANGUAGE : string = 'vi'; // ORIGIN_HTML_LANGUAGE

  constructor() {};

  getTmp() {
    const self = this;

    return {
      name: 'dummyData',
      init:  function() {
        modules.gulp.task('dummyData', function() {
          let _isError = false;

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
          };

          const _DUMMY_FILE_PATH = [
            APP.src.dummy_data + '/data-store/*.json'
          ];

          return modules.gulp.src(_DUMMY_FILE_PATH)
          .pipe(modules.cached('.json'))
          .pipe(modules.tap(function(file) {
            if(GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
              return;
            }

            self.ORIGIN_HTML_LANGUAGE = self._generateRandomString();

            let filePath = file.path.replace(/\\/g, '/');

            // NOTE split file.path và lấy tên file cùng tên folder để rename đúng tên cho file njk phía tmp
            const filename = filePath.split('/').slice(-2)[1].replace('.json','');

            const njkFilename = RESOURCE?.dummy_data_name_map?.[filename] ?? filename;

            filePath = APP.src.njk + '/template/' + njkFilename + '.' + ARR_FILE_EXTENSION.NJK;

            modules.gulp.src(filePath)
            .pipe(modules.print(
              filepath => {
                return modules.ansiColors.yellow(`convert njk: ${filepath}`);
              }
            ))
            .pipe(modules.data(() => {
              let responseData:any = {};

              if(RESOURCE.resource[njkFilename]?.dummy_data) {
                responseData = GulpTaskStore.get(STATE_KEYS.dummy_data_manager).get(filename) || {};
              }

              if(
                !_isEmpty(responseData) &&
                !responseData.success
              ) {
                _isError = true;

                GulpTaskStore.get(STATE_KEYS.handler_error_util).handlerError(responseData, ARR_FILE_EXTENSION.JSON, GulpTaskStore.get(STATE_KEYS.is_first_compile_all));
              } else {
                GulpTaskStore.get(STATE_KEYS.handler_error_util).checkClearError(_isError, ARR_FILE_EXTENSION.JSON, filename + '.' + ARR_FILE_EXTENSION.JSON);
              }

              responseData = (_isError ? {} : responseData.data);

              return {
                file: njkFilename,
                namepage: njkFilename,
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
                  'imageUrl' : '/image', // NOTE - Vì image sử dụng trong layout config cho những file render numjuck sang html thường có dạng '{{ LAYOUT_CONFIG.imageUrl }}/fantasy-image08.jpg' nên để dev tự thêm / sẽ clear hơn khi sử dụng với nunjuck
                  'cssUrl' : '/tmp/css',
                  'jsUrl' : '/tmp/js',
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
              this.emit('end');
            })
            .pipe(modules.rename(function(path) {
              path.basename = njkFilename;
            }))
            .pipe(modules.gulp.dest(APP.tmp.path))
            .on('end', function() {
              if(!GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
                // NOTE - Sau lần build đầu tiên sẽ tiến hành checkUpdateError
                const strErrKey = njkFilename + '.' + ARR_FILE_EXTENSION.NJK;

                GulpTaskStore.get(STATE_KEYS.handler_error_util).checkClearError(_isError, ARR_FILE_EXTENSION.NJK, strErrKey);
                GulpTaskStore.get(STATE_KEYS.handler_error_util).reportError();
                GulpTaskStore.get(STATE_KEYS.handler_error_util).notifSuccess();

                _isError = false;

                const curFileName = APP.tmp.path + '/' + njkFilename + '.html';
                const clearCacheFileName = curFileName.replace('.html', Date.now() + '.html');

                // NOTE - Xoá cache file bị trên window
                try {
                  fs.renameSync(curFileName, clearCacheFileName);
                  fs.renameSync(clearCacheFileName, curFileName);
                } catch(err) {}

                // NOTE - Hiện tại đang sử dụng reload watch file change trực tiếp từ browsersync
                // browserSync.reload(
                //   { stream: false }
                // );
              }
            })
          }));
        })
      }
    }
  }; // getTmp()

  private _randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  }; // _randomIntFromInterval()

  private _generateRandomString() {
    const result = Math.random().toString(36).substring(2,7);

    return result.slice(0, this._randomIntFromInterval(0,5));
  }; // _generateRandomString()
};
