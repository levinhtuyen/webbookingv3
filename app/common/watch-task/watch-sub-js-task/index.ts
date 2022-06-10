import {
  gulp,
} from '@common/define/module-define';
// import del = require('del');
// import path = require('path');

import APP from '@common/enum/source-enum';
import {
  STATE_KEYS as WATCH_TASK_STATE_KEYS,
  WatchTaskStore
} from '@common/watch-task/store';
import {
  STATE_KEYS as GULP_TASK_STATE_KEYS,
  GulpTaskStore,
} from '@common/gulp-task/store';
import {
  CompileSubJsTaskFormatted as CompileSubJsTask,
} from '@common/gulp-task/gulp-task-manager';
export default class WatchJsTask {
  constructor() {};

  get() {
    return {
      name: 'watchSubJs',
      init:  function() {
        gulp.watch([
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
        ], gulp.series(
          CompileSubJsTask.tmp.name,
        ));

        WatchTaskStore.get(WATCH_TASK_STATE_KEYS.group_watch_file)({
          'source_path_url': [
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
          ],
          'relative_task_list': {
            'remove': function(filePath) {
              let filename = filePath.split('\\').slice(-2)[1];
              // const foldername = filePath.split('\\').slice(-2)[0];

              // if(filename == 'index.js') {
              //   filename = foldername + '.js';
              //   const destFilePath = path.resolve(APP.tmp.path, 'js\\' + filename);

              //   del.sync(destFilePath);
              // }

              GulpTaskStore.get(GULP_TASK_STATE_KEYS.js_dependents).removeDependentFiles(filename);
            },
          },
        });
      }
    }
  }; // get()
};
