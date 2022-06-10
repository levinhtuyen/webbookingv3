import { isEmpty as _isEmpty } from 'lodash';
import gulp = require('gulp');

import './store-init';
import WatchSassTask from '@common/watch-task/watch-scss-task';
import WatchSassFastTask from '@common/watch-task/watch-scss-fast-task';
import WatchJsTask from '@common/watch-task/watch-js-task';
import WatchJsFastTask from '@common/watch-task/watch-js-fast-task';
import WatchSubJsTask from '@common/watch-task/watch-sub-js-task';
import WatchSubJsFastTask from '@common/watch-task/watch-sub-js-fast-task';
import WatchNunjuckTask from '@common/watch-task/watch-nunjuck-task';
import WatchDummyDataTask from '@common/watch-task/watch-dummy-data-task';

const WatchTaskFormatted = (task) => {
  let gulpTaskFormatted = {
    name: null,
    init: null,
  };

  if(
    typeof task.get === 'function' &&
    !_isEmpty(task.get())
  ) {
    gulpTaskFormatted = task.get();
  }

  return gulpTaskFormatted;
}; // WatchTaskFormatted()

const WatchSassTaskFormatted = WatchTaskFormatted(new WatchSassTask());
const WatchSassFastTaskFormatted = WatchTaskFormatted(new WatchSassFastTask());
const WatchJsTaskFormatted = WatchTaskFormatted(new WatchJsTask());
const WatchJsFastTaskFormatted = WatchTaskFormatted(new WatchJsFastTask());
const WatchSubJsTaskFormatted = WatchTaskFormatted(new WatchSubJsTask());
const WatchSubJsFastTaskFormatted = WatchTaskFormatted(new WatchSubJsFastTask());
const WatchNunjuckTaskFormatted = WatchTaskFormatted(new WatchNunjuckTask());
const WatchDummyDataTaskFormatted = WatchTaskFormatted(new WatchDummyDataTask());

// NOTE - Group watch task with template case
const WatchTmpWithTemplateTask = {
  name: 'watch-tmp-with-template',
  init: function() {
    gulp.task('watch-tmp-with-template', function() {
      WatchSassTaskFormatted.init();
      WatchJsTaskFormatted.init();
      WatchSubJsTaskFormatted.init();
      WatchNunjuckTaskFormatted.init();
      WatchDummyDataTaskFormatted.init();
    });
  }
};

// NOTE - Group watch task with template case and fast mode
const WatchTmpWithTemplateAndFastModeTask = {
  name: 'watch-tmp-with-template-and-fast-mode',
  init: function() {
    gulp.task('watch-tmp-with-template-and-fast-mode', function() {
      WatchSassFastTaskFormatted.init();
      WatchJsFastTaskFormatted.init();
      WatchSubJsFastTaskFormatted.init();
      WatchNunjuckTaskFormatted.init();
      WatchDummyDataTaskFormatted.init();
    });
  }
};

// NOTE - Group watch task without template case
const WatchTmpWithoutTemplateTask = {
  name: 'watch-tmp-without-template',
  init: function() {
    gulp.task('watch-tmp-without-template', function() {
      WatchSassTaskFormatted.init();
      WatchJsTaskFormatted.init();
      WatchSubJsTaskFormatted.init();
    });
  }
};

export {
  WatchTmpWithTemplateTask,
  WatchTmpWithTemplateAndFastModeTask,
  WatchTmpWithoutTemplateTask,
};
