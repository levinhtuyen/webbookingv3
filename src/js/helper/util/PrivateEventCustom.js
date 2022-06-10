const _addEvent = (ev) => {
  if(!ev) {
    console.error('The event should be undefined!');
    return;
  }

  return (function(el, fn) {
    if (el.addEventListener) {
      el.addEventListener(ev, fn, false);
    } else if (el.attachEvent) {
      el.attachEvent('on' + ev, fn);
    } else {
      el['on' + ev] = fn;
    }
  })
}; // _addEvent()

const _removeEvent = (ev) => {
  if(!ev) {
    console.error('The event should be undefined!');
    return;
  }

  return function(el, fn) {
    if (el.removeEventListener) {
      el.removeEventListener(ev, fn, false);
    } else if (el.detachEvent) {
        el.detachEvent('on' + ev, fn);
    } else {
        el['on' + ev] = null;
    }
  }
}; // _removeEvent()

const onloadEvent = _addEvent('load');
const removeOnloadEvent = _removeEvent('load');
const onResizeEvent = _addEvent('resize');
const removeOnResizeEvent = _removeEvent('resize');
const onClickEvent = _addEvent('click');
const removeOnClickEvent = _removeEvent('click');
const onTouchStartEvent = _addEvent('touchstart');
const removeOnTouchStartEvent = _removeEvent('touchstart');
const onPopStateEvent = _addEvent('popstate');
const removeOnPopStateEvent = _removeEvent('popstate');
const onVisibilityChange = _addEvent('visibilitychange');
const removeOnVisibilityChange = _removeEvent('visibilitychange');


export {
  onloadEvent,
  removeOnloadEvent,

  onResizeEvent,
  removeOnResizeEvent,

  onClickEvent,
  removeOnClickEvent,

  onTouchStartEvent,
  removeOnTouchStartEvent,

  onPopStateEvent,
  removeOnPopStateEvent,

  onVisibilityChange,
  removeOnVisibilityChange,
};
