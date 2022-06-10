<template>
  <div
    v-if="!isEmpty(managementTaskList)"
    class="task-item"
    :class="{
      ['task-item--' + managementType]: managementType
    }"
  >
    <div class="item-head">
      <span class="head-title">
        {{ managementTitle }}
      </span>
    </div> <!-- .item-head -->

    <div class="item-body">
      <div class="task-tag-wrap">
        <div class="task-tag-slider">
          <template v-for="(managementTaskItem, idx) in managementTaskList">
            <div
              :key="idx"
              class="task-tag-outer"
            >
              <div
                class="task-tag"
                @click="openModal(idx)"
              >
                {{ managementTaskItem.title }}
              </div>
            </div> <!-- .task-tag-outer -->
          </template>
        </div>
      </div> <!-- .task-tag-wrap -->
    </div> <!-- .item-body -->

    <G2jBasicModal
      v-if="isShowModal"
      :customModalClass="'task-modal'"
      @close="closeModal"
    >
      <template #head-title>
        {{ managementTitle }}
      </template>

      <template #body-content>
        <div class="task-modal__body__title">
          {{ managementTaskSelected.title }}
        </div>

        <div class="task-modal__body__content">
          {{ managementTaskSelected.desc }}
        </div>
      </template>
    </G2jBasicModal>
  </div> <!-- .task-item -->
</template>

<script>
import { _ } from '~jsPath/lib/lib-manager';
import G2jBasicModal from  '~jsPath/partial/global/component/g2j-basic-modal/G2jBasicModal.vue';
import {test} from '../page-module';

export default {
  components: {
    G2jBasicModal
  },

  props: {
    managementType: {
      type: String,
      default: '',
    },

    managementTitle: {
      type: String,
      default: '',
    }, // managementTitle

    managementTaskList: {
      type: Array,
      default() {
        return [];
      },
    }, // managementTaskList
  },

  data() {
    return {
      isShowModal: false,
      managementTaskSelected: {},
    };
  },

  computed: {
  },

  created() {
    console.log(test);
  },

  methods: {
    isEmpty: _.isEmpty,

    openModal(idx) {
      this.managementTaskSelected = this.managementTaskList[idx];
      this.isShowModal = true;
    }, // openModal()

    closeModal() {
      this.managementTaskSelected = {};
      this.isShowModal = false;
    }, // closeModal()
  },
}
</script>
