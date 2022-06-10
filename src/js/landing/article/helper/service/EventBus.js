let EventBus = {
  once: function(eventName='', eventHandler=function(){}) {},

  on: function(eventName='', eventHandler=function(){}) {},

  off: function(eventName='', eventId=0) {},

  emit: function(eventName='', arg) {},
};

if(window.EventBus) {
  EventBus = window.EventBus;
}

export {
  EventBus
};
