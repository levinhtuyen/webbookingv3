import modules from '@common/define/module-define';
import APP from '@common/enum/source-enum';

export default class MinifierHtmlTask {
  constructor() {};

  getTmp() {}; // getTmp()

  getDist() {
    return {
      name: 'minifierHtmlDist',
      init: function() {
        modules.gulp.task('minifierHtmlDist', function() {
          return modules.gulp.src(APP.dist.path + '*.html')
          .pipe(modules.htmlMinifer(
            {
              collapseWhitespace: true,
              collapseInlineTagWhitespace: true,
              conservativeCollapse: true,
              minifyJS: true,
              removeComments: true,
              removeEmptyAttributes: true,
            }
          ))
          .pipe(modules.gulp.dest(APP.dist.path))
        });
      }
    }
  }; // getDist()
};
