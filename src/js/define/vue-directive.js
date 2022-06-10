
import { Vue} from '~jsLibPath/lib-manager';

Vue.directive("click-outside", {
  bind: function(el, binding, vnode) {
    el.clickOutsideEvent = function(event) {
      // here I check that click was outside the el and his childrens
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);

  },
  unbind: function(el) {
      document.body.removeEventListener("click", el.clickOutsideEvent);
  }
});

Vue.directive('focus', {
  inserted: function (el) {
    // Focus the element
    el.focus()
  },
  update: function (el, binding) {
    var value = binding.value;
    if (value) {
      Vue.nextTick(function () {
        el.focus();
      });
    }
  }
})

