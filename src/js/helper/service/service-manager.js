import EventBusSetup from '~jsHelperPath/service/setup/EventBusSetup';
import {
  ApiSetup,
  ApiCaller,
} from '~jsHelperPath/service/SetupApiHandler';

export const GlobalService = (() => {
  return {
    init() {
      window.EventBus = EventBusSetup;
      window.ApiHandler = {
        apiSetup: ApiSetup,
        apiCaller: ApiCaller,
      };
    },
  };
})(); // GlobalService()
