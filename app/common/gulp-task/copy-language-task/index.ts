import {
  gulp,
  compressJson
} from '@common/define/module-define';
import APP from '@common/enum/source-enum';
import {
  STATE_KEYS,
  GulpTaskStore,
} from '@common/gulp-task/store';
import { ARR_FILE_EXTENSION } from '@common/define/file-define';

export default class CopyLanguageTask {
  constructor() {};

  getTmp() {
    return {}
  }; // getTmp()

  getDistStaging() {
    return {
      name: 'copyLanguageDistStaging',
      init: function() {
        gulp.task('copyLanguageDistStaging', function() {
          return GulpTaskStore.get(STATE_KEYS.move_file)(
            {
              'sourcePathUrl': APP.lab.path + '/language/*.' + ARR_FILE_EXTENSION.JSON,
              'targetPathUrl': APP.dist.language,
            }
          );
        });
      }
    }
  }; // getDistStaging()

  getDist() {
    return {
      name: 'copyLanguageDist',
      init: function() {
        gulp.task('copyLanguageDist', function() {
          return GulpTaskStore.get(STATE_KEYS.move_file)(
            {
              'sourcePathUrl': APP.lab.path + '/language/*.' + ARR_FILE_EXTENSION.JSON,
              'targetPathUrl': APP.dist.language,
              'compressModule': compressJson(),
            }
          );
        });
      }
    }
  }; // getDist()
};
