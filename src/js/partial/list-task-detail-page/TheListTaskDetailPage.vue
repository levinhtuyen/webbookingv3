<template>
  <div class="list-task-detail-page">
    children router
  </div> <!-- .list-task-detail-page -->
</template>

<script>
import { test } from '~jsPartialPath/list-task-page/page-module';

export default {
  name: 'list-task-detail',

  data() {
    return {
      dispatchParam: null,
    };
  },

  created() {
    const self = this;

    console.log(test);

    EventBus.emit('IS_SHOW_ROUTER_LOADING', false);
  },

  methods: {},
}
</script>
