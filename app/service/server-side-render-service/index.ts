import gulp from 'gulp';

import '@common/gulp-task/store-init';
import {
  ServerSideRenderTaskFormatted,
} from '@common/gulp-task/server-side-render-task-manager';
import {
  DEVELOPMENT,
} from '@common/define/enviroment-define';

let ServerSideRenderTaskFormattedWithENV = null;

if(process.env.NODE_ENV === DEVELOPMENT) {
  ServerSideRenderTaskFormattedWithENV = ServerSideRenderTaskFormatted.tmp;
} else {
  ServerSideRenderTaskFormattedWithENV = ServerSideRenderTaskFormatted.dist;
}

ServerSideRenderTaskFormattedWithENV.init();

gulp.series(
  ServerSideRenderTaskFormattedWithENV.name,
)();
