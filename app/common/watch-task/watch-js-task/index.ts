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
  CompileJsTaskFormatted as CompileJsTask,
} from '@common/gulp-task/gulp-task-manager';
export default class WatchJsTask {
  constructor() {};

  get() {
    return {
      name: 'watchJs',
      init:  function() {
        gulp.watch([
          APP.src.js + '/vendor*.js',
          APP.src.js + '/app.js',
          APP.src.js + '/landing/**/vendor*.js',
          APP.src.js + '/landing/**/app.js',
          APP.src.js + '/partial/**/*-page.js',
          APP.src.js + '/landing/**/partial/**/*-page.js',
        ], gulp.series(
          CompileJsTask.tmp.name,
        ));

        WatchTaskStore.get(WATCH_TASK_STATE_KEYS.group_watch_file)({
          'source_path_url': [
            APP.src.js + '/vendor*.js',
            APP.src.js + '/app.js',
            APP.src.js + '/landing/**/vendor*.js',
            APP.src.js + '/landing/**/app.js',
            APP.src.js + '/partial/**/*-page.js',
            APP.src.js + '/landing/**/partial/**/*-page.js',
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
