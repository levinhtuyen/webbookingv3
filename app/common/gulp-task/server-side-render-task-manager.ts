import { isEmpty as _isEmpty } from 'lodash';
import ServerSideRenderTask from '@common/gulp-task/server-side-render-task';

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

// NOTE - format ServerSideRenderTask
export const ServerSideRenderTaskFormatted = GulpTaskFormatted(new ServerSideRenderTask());
