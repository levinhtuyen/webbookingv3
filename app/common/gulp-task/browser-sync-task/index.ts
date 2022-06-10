import modules from '@common/define/module-define';
import APP from '@common/enum/source-enum';
import {
  STATE_KEYS,
  MUTATION_KEYS,
  GulpTaskStore,
} from '@common/gulp-task/store';
import {
  RESOURCE,
} from '@common/config/resource-config';

export default class BrowserSyncTask {
  constructor() {};

  getTmp() {
    return {
      name: 'browserSync',
      init:  function() {
        modules.gulp.task("browserSync", function() {
          return modules.browserSync.init({
            reloadDelay: 50, // Fix htmlprocess watch not change
            open: false, // Stop auto open browser
            cors: false,
            port: RESOURCE.port,
            host: RESOURCE.ip_address,
            // server: {
            //   baseDir: APP.tmp.path,
            //   index: "index.html",
            //   listen: RESOURCE.ip_address + ':' + RESOURCE.port,
            //   name: RESOURCE.host,
            //   location: {
            //       proxy_pass: 'http://127.0.0.1:' + RESOURCE.port,
            //   }
            // },
            injectChanges: false,
            notifier: {
              styles: [
                "display: none; ",
                "padding: 5px 5px;",
                "position: fixed;",
                "font-size: 1.75rem;",
                "line-height: 18px;",
                "z-index: 999999;",
                "left: 0;",
                "top: 0;",
                "width: auto;",
                "max-width: 100%",
                "color: #fff;",
                "background-color: rgba(0,0,0,0.5);",
                "box-shadow: 0 0 5px rgba(0,0,0,0.3);"
              ]
            },
            server: {
              baseDir: APP.lab.path,
              index: "/tmp/home-page.html",
            },

            callbacks: {
              /**
               * This 'ready' callback can be used
               * to access the Browsersync instance
               */
              ready: function(err, bs) {
                if(!GulpTaskStore.get(STATE_KEYS.is_browser_sync_finish)) {
                  GulpTaskStore.commit(MUTATION_KEYS.set_is_browser_sync_finish, true);
                }
              }
            }
          }); // end modules.browserSync
        }); // end modules.gulp
      }
    }
  }; // getTmp()
};
