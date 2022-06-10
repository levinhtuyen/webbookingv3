import gulp = require('gulp');
import del = require('del');
import path = require('path');

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
  ConvertNunjuckTaskFormatted as ConvertNunjuckTask,
} from '@common/gulp-task/gulp-task-manager';
export default class WatchNunjuckTask {
  constructor() {};

  get() {
    return {
      name: 'watchNunjuck',
      init:  function() {
        gulp.watch(APP.src.njk + '/**/*.njk', gulp.series(
          ConvertNunjuckTask.tmp.name,
        ));

        WatchTaskStore.get(WATCH_TASK_STATE_KEYS.group_watch_file)({
          'source_path_url': APP.src.njk + '/**/*.njk',
          'relative_task_list': {
            'remove': function(filePath) {
              let filename = filePath.split('\\').slice(-2)[1];

              const destFilePath = path.resolve(APP.tmp.path, filename);

              del.sync(destFilePath);

              GulpTaskStore.get(GULP_TASK_STATE_KEYS.njk_dependents).removeDependentFiles(filename);
            },
          },
        });
      }
    }
  }; // get()
};
