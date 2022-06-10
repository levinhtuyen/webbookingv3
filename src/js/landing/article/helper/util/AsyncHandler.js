class handleTimeout {
  constructor() {
    this.asyncDefaultWaitingTime = 10;
    this.timeoutHandlerList = [];
  };

  init(
    asyncTimeoutName,
    asyncTime,
    asyncTimeoutFunc
  ) {
    if(!asyncTimeoutName) {
      console.error('asyncTimeoutName is must!');
      return;
    } else if(this.timeoutHandlerList.length) {
      let isExist = false;

      this.timeoutHandlerList.some(function(asyncHandlerItem) {
        if(asyncHandlerItem.name === asyncTimeoutName) {
          isExist = true;

          return isExist;
        }
      });

      if(isExist) {
        console.error('asyncTimeoutName is exist!');
        return;
      }
    } else if(!asyncTimeoutFunc) {
      console.error('asyncTimeoutFunc is must!');
      return;
    } else if(typeof asyncTimeoutFunc !== 'function') {
      console.error('asyncTimeoutFunc must be a function!');
      return;
    }

    asyncTime = (asyncTime >= 10 ? asyncTime : this.asyncDefaultWaitingTime);

    const asyncTimeoutIdx = this.timeoutHandlerList.length;

    this.timeoutHandlerList[asyncTimeoutIdx] = {
      name: asyncTimeoutName,
      asyncTime,
      timeout: null,
    };

    return {
      handle: this.__handle(
        asyncTimeoutIdx,
        asyncTimeoutFunc
      ),

      clear: this.__clear(asyncTimeoutIdx),

      destroy: this.__destroy(asyncTimeoutIdx),
    };
  }; // init()

  __handle(
    asyncTimeoutQuery,
    asyncTimeoutFunc
  ) {
    if(typeof asyncTimeoutQuery !== 'number') {
      console.error('asyncTimeoutQuery must be number!');
      return;
    } else if(!this.timeoutHandlerList.length) {
      console.error('timeoutHandlerList is empty!');
      return;
    } else if(!this.timeoutHandlerList[asyncTimeoutQuery]) {
      console.error('timeoutHandlerList does not exist!');
      return;
    }

    const thisTimeoutHandler = this.timeoutHandlerList[asyncTimeoutQuery];

    return () => {
      if(thisTimeoutHandler.timeout) {
        clearTimeout(thisTimeoutHandler.timeout);

        thisTimeoutHandler.timeout = null;
      }

      thisTimeoutHandler.timeout =  setTimeout(function() {
        asyncTimeoutFunc();
      }, thisTimeoutHandler.asyncTime);
    };
  }; // __handle()

  __clear(asyncTimeoutQuery) {
    if(typeof asyncTimeoutQuery !== 'number') {
      console.error('asyncTimeoutQuery must be number!');
      return;
    } else if(!this.timeoutHandlerList.length) {
      console.error('timeoutHandlerList is empty!');
      return;
    } else if(!this.timeoutHandlerList[asyncTimeoutQuery]) {
      console.error('timeoutHandlerList does not exist!');
      return;
    }

    const thisTimeoutHandler = this.timeoutHandlerList[asyncTimeoutQuery];

    return () => {
      if(thisTimeoutHandler.timeout) {
        clearTimeout(thisTimeoutHandler.timeout);

        thisTimeoutHandler.timeout = null;
      }
    };
  }

  __destroy(asyncTimeoutQuery) {
    if(typeof asyncTimeoutQuery !== 'number') {
      console.error('asyncTimeoutQuery must be number!');
      return;
    } else if(!this.timeoutHandlerList.length) {
      console.error('timeoutHandlerList is empty!');
      return;
    } else if(!this.timeoutHandlerList[asyncTimeoutQuery]) {
      console.error('timeoutHandlerList does not exist!');
      return;
    }

    return () => {
      this.timeoutHandlerList[asyncTimeoutQuery].timeout = undefined;
      this.timeoutHandlerList[asyncTimeoutQuery] = undefined;
    };
  }; // __destroy()
}; // handleTimeout

export {
  handleTimeout,
};
