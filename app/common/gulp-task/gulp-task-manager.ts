import { isEmpty as _isEmpty } from 'lodash';

import './store-init';
import CleanTask from '@common/gulp-task/clean-task';
import CleanCSSTask from '@common/gulp-task/clean-css-task';
import CopyImageTask from '@common/gulp-task/copy-image-task';
import CopyFontTask from '@common/gulp-task/copy-font-task';
import CopyLanguageTask from '@common/gulp-task/copy-language-task';
import ConvertSassTask from '@common/gulp-task/convert-sass-task';
import PrettierCssTask from '@common/gulp-task/prettier-css-task';
import CompileJsTask from '@common/gulp-task/compile-js-task';
import CompileSubJsTask from '@common/gulp-task/compile-sub-js-task';
import ConvertNunjuckTask from '@common/gulp-task/convert-nunjuck-task';
import PrettierHtmlTask from '@common/gulp-task/prettier-html-task';
import MinifierHtmlTask from '@common/gulp-task/minifier-html-task';
import DummyDataTask from '@common/gulp-task/dummy-data-task';
import DoAfterBuildTask from '@common/gulp-task/do-after-build-task';

const GulpTaskFormatted = (task) => {
  let gulpTaskFormatted = {
    tmp: null,
    tmp_mode: null,
    end_tmp: null,
    dist_staging: null,
    dist_staging_mode: null,
    dist: null,
  };

  // NOTE - getTmp
  if(
    typeof task.getTmp === 'function' &&
    !_isEmpty(task.getTmp())
  ) {
    gulpTaskFormatted.tmp = task.getTmp();
  }

  // NOTE - getTmpMode
  if(
    typeof task.getTmpMode === 'function' &&
    !_isEmpty(task.getTmpMode())
  ) {
    gulpTaskFormatted.tmp_mode = task.getTmpMode();
  }

  // NOTE - getDistStaging
  if(
    typeof task.getDistStaging === 'function' &&
    !_isEmpty(task.getDistStaging())
  ) {
    gulpTaskFormatted.dist_staging = task.getDistStaging();
  }

  // NOTE - getDistStagingMode
  if(
    typeof task.getDistStagingMode === 'function' &&
    !_isEmpty(task.getDistStagingMode())
  ) {
    gulpTaskFormatted.dist_staging_mode = task.getDistStagingMode();
  }

  // NOTE - getEndTmp
  if(
    typeof task.getEndTmp === 'function' &&
    !_isEmpty(task.getEndTmp())
  ) {
    gulpTaskFormatted.end_tmp = task.getEndTmp();
  }

  // NOTE - getDist
  if(
    typeof task.getDist === 'function' &&
    !_isEmpty(task.getDist())
  ) {
    gulpTaskFormatted.dist = task.getDist();
  }

  return gulpTaskFormatted;
}; // GulpTaskFormatted()

// NOTE - format CleanTask
export const CleanTaskFormatted = GulpTaskFormatted(new CleanTask());

// NOTE - format CleanTask
export const CleanCSSTaskFormatted = GulpTaskFormatted(new CleanCSSTask());

// NOTE - format CopyImageTask
export const CopyImageTaskFormatted = GulpTaskFormatted(new CopyImageTask());

// NOTE - format CopyFontTask
export const CopyFontTaskFormatted = GulpTaskFormatted(new CopyFontTask());

// NOTE - format CopyLanguageTask
export const CopyLanguageTaskFormatted = GulpTaskFormatted(new CopyLanguageTask());

// NOTE - format ConvertSassTask
export const ConvertSassTaskFormatted = GulpTaskFormatted(new ConvertSassTask());

// NOTE - format PrettierCssTask
export const PrettierCssTaskFormatted = GulpTaskFormatted(new PrettierCssTask());

// NOTE - format CompileJsTask
export const CompileJsTaskFormatted = GulpTaskFormatted(new CompileJsTask());

// NOTE - format CompileJsTask
export const CompileSubJsTaskFormatted = GulpTaskFormatted(new CompileSubJsTask());

// NOTE - format ConvertNunjuckTask
export const ConvertNunjuckTaskFormatted = GulpTaskFormatted(new ConvertNunjuckTask());

// NOTE - format PrettierHtmlTask
export const PrettierHtmlTaskFormatted = GulpTaskFormatted(new PrettierHtmlTask());

// NOTE - format MinifierHtmlTask
export const MinifierHtmlTaskFormatted = GulpTaskFormatted(new MinifierHtmlTask());

// NOTE - format DummyDataTask
export const DummyDataTaskFormatted = GulpTaskFormatted(new DummyDataTask());

// NOTE - format DoAfterBuildTask
export const DoAfterBuildTaskFormatted = GulpTaskFormatted(new DoAfterBuildTask());
