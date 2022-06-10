<template>
  <div
    class="list-task-page"
  >
    <section class="list-task-section">
      <div class="container">
        <div class="list-task-block">
          <div
            v-if="!isEmpty(managementList)"
            class="task-wrap"
          >
            <template v-for="managementListItem in managementList">
              <TaskItem
                :key="managementListItem.type"
                :management-type="managementListItem.type"
                :management-title="managementListItem.title"
                :management-task-list="managementListItem.management_task"
              />
            </template>
          </div> <!-- .list-task-wrap -->
        </div> <!-- .list-task-block -->
      </div>
    </section> <!-- .list-task-section -->
  </div>
</template>

<script>
import {
  _,
  Vue,
  mapGetters,
} from '~jsPath/lib/lib-manager';
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
} from '~jsPath/base/vuex/modules/page-info-module';
import TaskItem from '~jsPath/partial/list-task-page/component/TaskItem.vue';

export default {
  name: 'the-list-task-page',

  components: {
    TaskItem,
  },

  data() {
    return {
    };
  },

  computed: {
    ...mapGetters(PAGE_INFO_MODULE_NAME, {
      managementList: 'managementList',
    }),
  },

  created() {
    EventBus.emit('IS_SHOW_ROUTER_LOADING', false);
  },

  methods: {
    isEmpty: _.isEmpty,
  },

  destroyed() {
    console.log('the list-task page is destroyed');
  },
};
</script>

<style src="./list-task-page-style.css"></style>
