interface ResourceItemDataConstruct {
  'name'?: string,

  // NOTE - Định nghĩa interface của arrCssFile
  'arrCssFile': Array<
    string |
    {
      'preconnect'?: string,
      'dns-prefetch'?: string,
      'crossorigin'?: {
        'show': boolean,
        'value'?: string,
      },
      'referrerpolicy'?: {
        'show': boolean,
        'value'?: string,
      },
      'integrity'?: string,
      'href': string,
      'env'?: Array<string>,
      'ignore_bot'?: boolean | Array<string>,
    }
  > | {
    'common': Array<
      string |
      {
        'preconnect'?: string,
        'dns-prefetch'?: string,
        'crossorigin'?: {
          'show': boolean,
          'value'?: string,
        },
        'referrerpolicy'?: {
          'show': boolean,
          'value'?: string,
        },
        'integrity'?: string,
        'href': string,
        'env'?: Array<string>,
        'ignore_bot'?: boolean | Array<string>,
      }
    >,
    'main': Array<
      string |
      {
        'preconnect'?: string,
        'dns-prefetch'?: string,
        'crossorigin'?: {
          'show': boolean,
          'value'?: string,
        },
        'referrerpolicy'?: {
          'show': boolean,
          'value'?: string,
        },
        'env'?: Array<string>,
        'ignore_bot'?: boolean | Array<string>,
      }
    >
  },

  // NOTE - Định nghĩa interface của arrJsFile
  'arrJsFile': Array<
    string |
    {
      'preconnect'?: string,
      'dns-prefetch'?: string,
      'crossorigin'?: {
        'show': boolean,
        'value'?: string,
      },
      'referrerpolicy'?: {
        'show': boolean,
        'value'?: string,
      },
      'src': string,
      'integrity'?: string,
      'env'?: Array<string>,
      'ignore_bot'?: boolean | Array<string>,
    }
  > | {
    'common': Array<
      string |
      {
        'preconnect'?: string,
        'dns-prefetch'?: string,
        'crossorigin'?: {
          'show': boolean,
          'value'?: string,
        },
        'referrerpolicy'?: {
          'show': boolean,
          'value'?: string,
        },
        'src': string,
        'integrity'?: string,
        'env'?: Array<string>,
        'ignore_bot'?: boolean | Array<string>,
      }
    >,
    'main': Array<
      string |
      {
        'preconnect'?: string,
        'dns-prefetch'?: string,
        'crossorigin'?: {
          'show': boolean,
          'value'?: string,
        },
        'referrerpolicy'?: {
          'show': boolean,
          'value'?: string,
        },
        'src': string,
        'integrity'?: string,
        'env'?: Array<string>,
        'ignore_bot'?: boolean | Array<string>,
      }
    > | {
      "header": Array<
        string |
        {
          'preconnect'?: string,
          'dns-prefetch'?: string,
          'crossorigin'?: {
            'show': boolean,
            'value'?: string,
          },
          'referrerpolicy'?: {
            'show': boolean,
            'value'?: string,
          },
          'src': string,
          'integrity'?: string,
          'env'?: Array<string>,
          'ignore_bot'?: boolean | Array<string>,
        }
      >,
      "body": Array<
        string |
        {
          'preconnect'?: string,
          'dns-prefetch'?: string,
          'crossorigin'?: {
            'show': boolean,
            'value'?: string,
          },
          'referrerpolicy'?: {
            'show': boolean,
            'value'?: string,
          },
          'src': string,
          'integrity'?: string,
          'env'?: Array<string>,
          'ignore_bot'?: boolean | Array<string>,
        }
      >,
    }
  },

  'arrPreconnect'?: Array<Object>,

  // NOTE - Định nghĩa danh sách preload
  'arrPreload'?: Array<
    {
      'getHref'?: Object,
      'path'?: string,
      'href'?: string,
      'as': string,
      'type'?: string,
    }
  >,

  // NOTE - Định nghĩa danh sách prefetch
  'arrPrefetch'?: Array<
    {
      'getHref'?: Object,
      'path'?: string,
      'href'?: string,
      'as': string,
      'type'?: string,
    }
  >,

  'dummy_data'?: boolean,
  'dummy_data_name'?: string,
};

interface ResourceItemConstruct {
  [key:string]: ResourceItemDataConstruct,
};

interface PathListItemDataConstruct {
  'src': string,
  'dummy_data': string,
  'njk': string,
  'global': string,
  'layout': string,
};

interface ResourceConstruct {
  'project': string,
  'port': any, // NOTE - Lưu ý những thông tin này cần được config trong file host trước
  'ip_address': string, // NOTE - Lưu ý những thông tin này cần được config trong file host trước
  'env_api': string, // NOTE - Lưu ý những thông tin này cần được config trong file host trước
  'staging_base_url': string, // NOTE - Lưu ý những thông tin này cần được config trong file host trước
  'staging_static_url': string, // NOTE - Lưu ý những thông tin này cần được config trong file host trước
  'base_url': string, // NOTE - Lưu ý những thông tin này cần được config trong file host trước
  'static_url': string, // NOTE - Lưu ý những thông tin này cần được config trong file host trước
  'base_dev_api_url': string, // NOTE - Lưu ý những thông tin này cần được config trong file host trước
  'base_staging_api_url': string, // NOTE - Lưu ý những thông tin này cần được config trong file host trước
  'base_api_url': string, // NOTE - Lưu ý những thông tin này cần được config trong file host trước
  'assets_service_url': string, // NOTE - Lưu ý những thông tin này cần được config trong file host trước
  'api_version': {
    [key: string]: string,
  },
  'local': string,
  'path': PathListItemDataConstruct,
  'resource': ResourceItemConstruct,
  'dummy_data_name_map': {
    [key:string]: string,
  },
  'project_version': string,
};
