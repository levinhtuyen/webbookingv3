import gulp = require('gulp');
import APP from '@common/enum/source-enum';
import {
  ConvertSassTaskFormatted as ConvertSassTask,
  // BrowserSyncReloadTaskFormatted as BrowserSyncReloadTask
} from '@common/gulp-task/gulp-task-manager';

// NOTE - Khởi tạo BrowserSyncReloadTask
// BrowserSyncReloadTask.tmp.init();

export default class WatchSassTask {
  constructor() {};

  get() {
    return {
      name: 'watchSassFastMode',
      init:  function() {
        gulp.watch(APP.src.scss + '/**/*.scss', gulp.series(
          ConvertSassTask.tmp_mode.fast.name,
        ));
      }
    }
  }; // get()
};
