import {
  ARR_ENV,
  ENV,
  getApiUrl,
} from './general';

// NOTE - Define API version list, same same resource config
const API_VERSION = {
  v1: 'v1',
  v2: 'v2',
  v3: 'v3',
  v4: 'v4',
};

/**
 * NOTE - Constructure of api infomation object
 * {
 *    [api_version]: {
 *      version: string,
 *      base_url: string,
 *    }
 * }
 */
// NOTE - Define base api infomation in development enviroment
const BASE_DEV_API_INFO = {
  [API_VERSION.v1]: {
    version: API_VERSION.v1,
    env: ARR_ENV.development,

    base_url: getApiUrl(
      API_VERSION.v1,
      ARR_ENV.development
    ),
  },

  [API_VERSION.v2]: {
    version: API_VERSION.v2,
    env: ARR_ENV.development,

    base_url: getApiUrl(
      API_VERSION.v2,
      ARR_ENV.development
    ),
  },

  [API_VERSION.v3]: {
    version: API_VERSION.v3,
    env: ARR_ENV.development,

    base_url: getApiUrl(
      API_VERSION.v3,
      ARR_ENV.development
    ),
  },
  [API_VERSION.v4]: {
    version: API_VERSION.v4,
    env: ARR_ENV.development,

    base_url: getApiUrl(
      API_VERSION.v4,
      ARR_ENV.development
    ),
  },
};

// NOTE - Define base api infomation in staging enviroment
const BASE_STAGING_API_INFO = {
  [API_VERSION.v1]: {
    version: API_VERSION.v1,
    env: ARR_ENV.staging,

    base_url: getApiUrl(
      API_VERSION.v1,
      ARR_ENV.staging
    ),
  },

  [API_VERSION.v2]: {
    version: API_VERSION.v2,
    env: ARR_ENV.staging,

    base_url: getApiUrl(
      API_VERSION.v2,
      ARR_ENV.staging
    ),
  },

  [API_VERSION.v3]: {
    version: API_VERSION.v3,
    env: ARR_ENV.staging,

    base_url: getApiUrl(
      API_VERSION.v3,
      ARR_ENV.staging
    ),
  },
  [API_VERSION.v4]: {
    version: API_VERSION.v4,
    env: ARR_ENV.staging,

    base_url: getApiUrl(
      API_VERSION.v4,
      ARR_ENV.staging
    ),
  },
};

// NOTE - Define base api infomation in production enviroment
const BASE_API_INFO = {
  [API_VERSION.v1]: {
    version: API_VERSION.v1,
    env: ARR_ENV.production,

    base_url: getApiUrl(
      API_VERSION.v1,
      ARR_ENV.production
    ),
  },

  [API_VERSION.v2]: {
    version: API_VERSION.v2,
    env: ARR_ENV.production,

    base_url: getApiUrl(
      API_VERSION.v2,
      ARR_ENV.production
    ),
  },

  [API_VERSION.v3]: {
    version: API_VERSION.v3,
    env: ARR_ENV.production,

    base_url: getApiUrl(
      API_VERSION.v3,
      ARR_ENV.production
    ),
  },
  [API_VERSION.v4]: {
    version: API_VERSION.v4,
    env: ARR_ENV.production,

    base_url: getApiUrl(
      API_VERSION.v4,
      ARR_ENV.production
    ),
  },
};

export {
  ARR_ENV,
  ENV,
  API_VERSION,
  BASE_DEV_API_INFO,
  BASE_STAGING_API_INFO,
  BASE_API_INFO,
};
