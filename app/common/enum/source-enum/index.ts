const _DIR_PATH = __dirname.replace(/\\/g, '/');
const _LAB_PATH = _DIR_PATH.split('/app')[0];

// NOTE - generate previous path of lab
const labPathSplitted = _LAB_PATH.split('/');
const _OUT_LAB_PATH = (labPathSplitted.slice(0,-1)).join('/');

const _APP_LAB_PATH: string = _LAB_PATH + '/'; // url của lab directory

const _OUT_APP_LAB_PATH: string = _OUT_LAB_PATH  + '/';

const _APP_SRC_PATH: string = _LAB_PATH + '/src/'; // url của source directory (nơi để dev)

const _APP_CACHE_PATH: string = _LAB_PATH + '/app/cache/'; // url của temp directory (nơi để built source deploy)

const _APP_TMP_PATH: string = _LAB_PATH + '/tmp/'; // url của temp directory (nơi để built source deploy)

const _APP_DIST_PATH: string = _LAB_PATH + '/dist/'; // url của dist directory (nơi chứa source production live)

interface AppItemConstruct {
  path: string,
  scss?: string,
  css?: string,
  js: string,
  image: string,
  font: string,
  language: string,
  njk?: string,
  data?: string,
  dummy_data?: string,
  urlConfig?: string,
};

interface AppConstruct {
  lab: {path: string},
  out_lab: {path: string},
  app: {path: string},
  common: {path: string},
  log: {path: string},

  cache: AppItemConstruct,
  src: AppItemConstruct,
  tmp: AppItemConstruct,
  dist: AppItemConstruct,
};

const APP: AppConstruct = {
  lab: {
    path: _APP_LAB_PATH,
  },
  out_lab: {
    path: _OUT_APP_LAB_PATH,
  },
  app: {
    path: _APP_LAB_PATH + 'app',
  },
  common: {
    path: _APP_LAB_PATH + 'app/common',
  },
  log: {
    path: _APP_LAB_PATH + 'app/log',
  },

  cache: {
    path : _APP_CACHE_PATH,
    css : _APP_CACHE_PATH + 'css',
    js : _APP_CACHE_PATH + 'js',
    image : _APP_CACHE_PATH + 'image',
    font : _APP_CACHE_PATH + 'font',
    language : _APP_CACHE_PATH + 'language',
  },

  src: {
    path : _APP_SRC_PATH,
    scss : _APP_SRC_PATH + 'scss',
    js : _APP_SRC_PATH + 'js',
    image : _APP_LAB_PATH + 'image',
    font : _APP_LAB_PATH + 'font',
    language: _APP_LAB_PATH + 'language',
    njk : _APP_SRC_PATH + 'njk',
    data : _APP_SRC_PATH + 'data',
    dummy_data : _APP_SRC_PATH + 'dummy-data',
    urlConfig : _APP_SRC_PATH + 'urlConfig',
  },

  tmp: {
    path : _APP_TMP_PATH,
    css : _APP_TMP_PATH + 'css',
    js : _APP_TMP_PATH + 'js',
    image : _APP_LAB_PATH + 'image',
    font : _APP_LAB_PATH + 'font',
    language : _APP_LAB_PATH + 'language',
  },

  dist: {
    path : _APP_DIST_PATH,
    css : _APP_DIST_PATH + 'css',
    js : _APP_DIST_PATH + 'js',
    image : _APP_DIST_PATH + 'image',
    font : _APP_DIST_PATH + 'font',
    language : _APP_DIST_PATH + 'language',
  }
};

export default APP;
