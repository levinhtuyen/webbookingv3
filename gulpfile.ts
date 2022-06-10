import 'tsconfig-paths/register';
import "sucrase/register";

import gulp = require('gulp');

import {
  DEVELOPMENT,
  PRODUCTION,
  STAGING,
} from '@common/define/enviroment-define';

import {
  CleanTaskFormatted as CleanTask,
  CleanCSSTaskFormatted as CleanCSSTask,
  CopyImageTaskFormatted as CopyImageTask,
  CopyFontTaskFormatted as CopyFontTask,
  CopyLanguageTaskFormatted as CopyLanguageTask,
  ConvertSassTaskFormatted as ConvertSassTask,
  PrettierCssTaskFormatted as PrettierCssTask,
  CompileJsTaskFormatted as CompileJsTask,
  CompileSubJsTaskFormatted as CompileSubJsTask,
  ConvertNunjuckTaskFormatted as ConvertNunjuckTask,
  MinifierHtmlTaskFormatted as MinifierHtmlTask,
  DummyDataTaskFormatted as DummyDataTask,
  DoAfterBuildTaskFormatted as DoAfterBuildTask,
} from '@common/gulp-task/gulp-task-manager';

const gulpMultiProcess = require('gulp-multi-process');

if(process.env.NODE_ENV === DEVELOPMENT) {
  // NOTE - development
  // NOTE - CleanTask
  //-- clean tmp task
  CleanTask.tmp.init();

  // NOTE - CleanCSSTask
  CleanCSSTask.tmp.init();

  // NOTE - PrettierCssTask
  //? chỉ sử dụng prettier css cho source css trong thư mục tmp
  PrettierCssTask.tmp.init();

  // NOTE - ConvertNunjuckTask
  ConvertNunjuckTask.tmp.init();

  // NOTE - PrettierHtmlTask
  // PrettierHtmlTask.tmp.init();

  // NOTE - DummyDataTask
  DummyDataTask.tmp.init();

  // NOTE - clean:css scripts
  gulp.task('clean:css', gulp.series(
    CleanCSSTask.tmp.name,
  ));

  if(process.env.TYPE === 'normal') {
    // NOTE - ConvertSassTask
    ConvertSassTask.tmp.init();

    // NOTE - CompileJsTask
    CompileJsTask.tmp.init();
    CompileSubJsTask.tmp.init();

    // NOTE - DoAfterBuildTask
    DoAfterBuildTask.tmp.init();

    // NOTE - dev scripts
    gulp.task('dev:template', gulp.series(
      CleanTask.tmp.name,

      gulp.parallel(
        ConvertSassTask.tmp.name,
        CompileSubJsTask.tmp.name,

        gulp.series(
          DummyDataTask.tmp.name,
          ConvertNunjuckTask.tmp.name,
        ),
      ),

      CompileJsTask.tmp.name,

      DoAfterBuildTask.tmp.name,
    ));
  } else if(process.env.TYPE === 'fast') {
    // NOTE - ConvertSassTask
    ConvertSassTask.tmp_mode.fast.init();

    // NOTE - CompileJsTask
    CompileJsTask.tmp_mode.fast.init();
    CompileSubJsTask.tmp_mode.fast.init();

    // NOTE - DoAfterBuildTask
    DoAfterBuildTask.tmp_mode.fast.init();

    // NOTE - dev:fast scripts
    gulp.task('dev:faster', gulp.series(
      CleanTask.tmp.name,

      gulp.parallel(
        DummyDataTask.tmp.name,
        ConvertNunjuckTask.tmp.name,
        ConvertSassTask.tmp_mode.fast.name,
        CompileSubJsTask.tmp_mode.fast.name,
        CompileJsTask.tmp_mode.fast.name,
      ),

      DoAfterBuildTask.tmp_mode.fast.name,
    ));
  } else if(process.env.TYPE === 'esbuild') {
    // NOTE - ConvertSassTask
    ConvertSassTask.tmp_mode.fast.init();

    // NOTE - CompileJsTask
    CompileJsTask.tmp_mode.esbuild.init();
    CompileSubJsTask.tmp_mode.fast.init();

    // NOTE - DoAfterBuildTask
    DoAfterBuildTask.tmp_mode.fast.init();

    // NOTE - dev:es scripts
    gulp.task('dev:esbuild', gulp.series(
      CleanTask.tmp.name,

      gulp.parallel(
        DummyDataTask.tmp.name,
        ConvertNunjuckTask.tmp.name,
        ConvertSassTask.tmp_mode.fast.name,
        CompileSubJsTask.tmp_mode.fast.name,
        CompileJsTask.tmp_mode.esbuild.name,
      ),

      DoAfterBuildTask.tmp_mode.fast.name,
    ));
  }
} else if(
  process.env.NODE_ENV === STAGING &&
  process.env.TYPE === 'normal'
) {
  // NOTE - staging
  // NOTE - clean dist task
  CleanTask.dist.init();

  // NOTE - ConvertSassTask
  ConvertSassTask.dist_staging.init();

  // NOTE - CompileJsTask
  CompileJsTask.dist_staging.init();

  // NOTE - CopyFontTask
  CopyFontTask.dist.init();

  // NOTE - ConvertNunjuckTask
  ConvertNunjuckTask.dist.init();

  // NOTE - CopyImageTask
  CopyImageTask.dist.init();

  // NOTE - CopyLanguageTask
  CopyLanguageTask.dist_staging.init();

  // NOTE - dev:stag scripts
  function multiGulpStagTask(done) {
    return gulpMultiProcess([
      CopyLanguageTask.dist_staging.name,
      ConvertNunjuckTask.dist.name,
      ConvertSassTask.dist_staging.name,
      CopyImageTask.dist.name,
    ], function() {
      gulp.series(
        CompileJsTask.dist_staging.name,
      )();

      done();
    }, true);
  }

  gulp.task('stag', gulp.series(
    gulp.parallel(
      CleanTask.dist.name,
    ),

    multiGulpStagTask,
  ));
} else if(
  process.env.NODE_ENV === PRODUCTION ||
  (
    process.env.NODE_ENV === STAGING &&
    process.env.TYPE === 'uat'
  )
) {
  // NOTE - staging
  // NOTE - clean dist task
  CleanTask.dist.init();

  // NOTE - ConvertSassTask
  ConvertSassTask.dist.init();

  // NOTE - CompileJsTask
  CompileJsTask.dist.init();

  // NOTE - CopyFontTask
  CopyFontTask.dist.init();

  // NOTE - ConvertNunjuckTask
  ConvertNunjuckTask.dist.init();

  // NOTE - PrettierHtmlTask
  // PrettierHtmlTask.dist.init();

  // NOTE - MinifierHtmlTask
  MinifierHtmlTask.dist.init();

  // NOTE - CopyImageTask
  CopyImageTask.dist.init();

  // NOTE - CopyLanguageTask
  CopyLanguageTask.dist.init();

  function multiGulpProdTaskSecond(done) {
    return gulpMultiProcess([
      MinifierHtmlTask.dist.name,
    ], done, true);
  }

  // NOTE - dev:prod scripts
  function multiGulpProdTaskFirst(done) {
    return gulpMultiProcess([
      CopyLanguageTask.dist.name,
      ConvertNunjuckTask.dist.name,
      ConvertSassTask.dist.name,
      CopyImageTask.dist.name,
    ], function() {
      gulp.parallel(
        CompileJsTask.dist.name,
        multiGulpProdTaskSecond,
      )(),

      done();
    }, true);
  }

  gulp.task('prod', gulp.series(
    gulp.parallel(
      CleanTask.dist.name,
    ),

    multiGulpProdTaskFirst,
  ));
}
