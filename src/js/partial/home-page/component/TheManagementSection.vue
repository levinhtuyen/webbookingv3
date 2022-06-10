<template>
  <section
    class="management-section"
  >
    <div class="container">
      <div class="management-block">
        <template v-if="!isEmpty(managementList)">
          <div class="management-wrap">
            <template v-for="(managementItem,idx) in managementList">
              <ManagementItem
                :key="managementItem.type"
                :idx="idx"
                :management-item="managementItem"
              ></ManagementItem>
            </template>
          </div> <!-- .management-wrap -->
        </template>
      </div> <!-- .management-block -->
    </div>
  </section> <!-- .management-section -->
</template>

<script>
import {
  _,
  mapState,
  mapGetters
} from '~jsLibPath/lib-manager';
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
} from '~jsPath/base/vuex/modules/page-info-module';
// import ManagementItem from './ManagementItem.vue';

export default {
  name: 'the-management-section',

  components: {
    ManagementItem: () => import('./ManagementItem.vue'),
  },

  data() {
    return {
      isShow: false,
      curManagementIdx: null,
    }
  },

  computed: Object.assign(
    {
      isShowModal() {
        return (
          this.isShow &&
          !_.isEmpty(this.managementList[this.curManagementIdx])
        );
      },
    },

    mapState(PAGE_INFO_MODULE_NAME,
      {
        imageUrl: 'imageUrl'
      }
    ),

    mapGetters(PAGE_INFO_MODULE_NAME,
      {
        managementList: 'managementList'
      }
    ),
  ),

  created() {
    console.log('management section is created');
  },

  methods: {
    isEmpty: _.isEmpty,

    openModal(idx) {
      this.curManagementIdx = idx;
      this.isShow = true;
    }, // openModal()

    closeModal() {
      this.curManagementIdx = null;
      this.isShow = false;
    }, // closeModal()
  },

  destroyed() {
    console.log('management section is destroyed');
  },
};
</script>
