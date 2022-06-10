import {
  gulp,
  clean,
} from '@common/define/module-define';
import APP from '@common/enum/source-enum';

export default class CleanTask {
  constructor() {};

  getTmp() {
    return {
      name: 'cleanCSSTmp',
      init: function() {
        gulp.task('cleanCSSTmp', function() {
          return gulp.src([
            APP.src.path + '/**/*.css',
          ], {read: true, allowEmpty: true})
          .pipe(clean({ force: true }));
        });
      }
    }
  }; // getTmp()

  getDist() {}; // getDist()
};
