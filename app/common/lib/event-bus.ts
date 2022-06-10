const EventBus = (() => {
  let _subscriptionList = {},
    _arrCurrSubscription;
  let _lastEventId = 0;

  const _generateNextUniqueId = () => {
    _lastEventId += 1;
    return _lastEventId;
  };

  // subscript event handler information into eventbus
  const _subscript = (eventName, eventHandler, eventType) => {
    const newEventId = _generateNextUniqueId();

    try {
      if (typeof eventHandler !== 'function') throw 'the second parameter must be a function()';
    } catch (error) {
      console.error(error);
    }

    if (!_subscriptionList[eventName]) {
      _subscriptionList[eventName] = [];
    }

    _subscriptionList[eventName].push({
      eventId: newEventId,
      eventType: eventType,
      eventHandler: eventHandler,
    });

    // console.log(_subscriptionList);

    return newEventId;
  };

  // run event handler
  const _publish = (eventName, arg) => {
    if(!_subscriptionList[eventName] || !Array.isArray(_subscriptionList[eventName])) {
      return;
    }

    _arrCurrSubscription = _subscriptionList[eventName];
    _subscriptionList[eventName] = [];
    _arrCurrSubscription.forEach(function(objEventInfo) {
      objEventInfo['eventHandler'](arg);

      // if type of this handler is 'once' then remove it after run
      if(objEventInfo['eventType'] !== 'once') {
        _subscriptionList[eventName].push(objEventInfo);
      }
    });
  };

  // remove event handler with id for specifical event, if nothing id then remove all event handler of corresponds eventName
  const _unsubscript = (eventName, eventId) => {
    if(!_subscriptionList[eventName] || !Array.isArray(_subscriptionList[eventName])) {
      return;
    }

    if(eventId) {
      _subscriptionList[eventName].forEach(function(objEventItemInfo, index) {
        if (objEventItemInfo['eventId'] == eventId) {
          _subscriptionList[eventName].splice(index, 1);
          return;
        }
      });
    } else {
      _subscriptionList[eventName] = [];
    }
  };

  return {
    once: function(eventName, eventHandler) {
      _subscript(eventName, eventHandler, 'once');
    },

    on: function(eventName, eventHandler) {
      return _subscript(eventName, eventHandler, 'on');
    },

    off: function(eventName, eventId) {
      _unsubscript(eventName, eventId);
    },

    emit: function(eventName, arg) {
      _publish(eventName, arg);
    },
  };
})();

export {
  EventBus,
};
