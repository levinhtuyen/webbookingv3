<template>
  <div
    v-if="!isEmpty(managementItem)"
    class="management-item"
    @click="openModal"
  >
    <div
      class="item-head"
      :class="'item-head--' + managementItem.type"
    >
      <div class="head-icon-shape">
        <img
          class="head-icon-img"
          :src="imageUrl + '/icon/' + managementItem.icon"
          alt=""
          width="64"
          height="64"
        >
      </div>
    </div>

    <G2JBasicModal
      v-if="isShowModal"

      :custom-modal-class="'management-modal'"

      @close="closeModal"
    >
      <template #head-title>
        {{ managementItem.title }}
      </template>

      <template #body-content>
          <form
            class="management-modal__form"
            @submit="onSubmit($event, $v)"
            @keyup.enter="onSubmit($event, $v)"
          >
            <div class="management-modal__input-group">
              <div class="management-modal__input-title">
                Tiêu đề
              </div> <!-- .management-modal__input-title -->
              <div class="management-modal__input-field">
                <input
                  v-model="$v.title.$model"
                  type="text"
                  class="management-modal__input-item"
                  :class="{ 'is-error' : $v.title.$error }"
                  placeholder="tiêu đề"
                >

                <div
                  v-if="$v.title.$error"
                  class="management-modal__input-error"
                >
                  Vui lòng nhập tiêu đề
                </div>
              </div> <!-- .management-modal__input-field -->
            </div> <!-- .management-modal__input-group -->

            <div class="management-modal__input-group">
              <div class="management-modal__input-title">
                Nội dung
              </div> <!-- .management-modal__input-title -->

              <div class="management-modal__input-field">
                <textarea
                  v-model="$v.desc.$model"
                  class="management-modal__input-item"
                  :class="{ 'is-error' : $v.desc.$error }"
                  placeholder="nội dung"
                ></textarea>

                <div
                  v-if="$v.desc.$error"
                  class="management-modal__input-error"
                >
                  <template v-if="!$v.desc.required">
                    Vui lòng nhập tiêu đề
                  </template>

                  <template v-else-if="!$v.desc.minLength">
                    Tối thiểu 20 ký tự
                  </template>
                </div>
              </div> <!-- .management-modal__input-field -->
            </div> <!-- .management-modal__input-group -->

            <div class="management-modal__control-group">
              <button
                class="management-modal__btn"
                @click.stop="closeModal"
              >
                Đóng
              </button>

              <button class="management-modal__btn" type="submit">
                Lưu
              </button>
            </div>
          </form> <!-- .management-modal__form -->
      </template>
    </G2JBasicModal>
  </div> <!-- .management-wrap-item -->
</template>

<script>
import {
  _,
  Vue,
  mapState,
  required,
  minLength,
} from '~jsLibPath/lib-manager';
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
  COMMIT_KEY as PAGE_INFO_COMMIT_KEY
} from '~jsPath/base/vuex/modules/page-info-module';
import G2JBasicModal from '~jsPath/partial/global/component/g2j-basic-modal/G2jBasicModal.vue';

Vue.use(window.vuelidate.default);

export default {
  components: {
    G2JBasicModal,
  },

  props: {
    idx: {
      type: Number,
      default: 0,
    },

    managementItem: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      isShowModal: false,

      title: '',
      desc: '',
    }
  },

  validations: {
    title: {
      required,
      minLength: minLength(0)
    },
    desc: {
      required,
      minLength: minLength(20)
    },
  },

  computed: {
    ...mapState(PAGE_INFO_MODULE_NAME, {
      imageUrl: 'imageUrl',
      resManagementData: 'resManagementData',
    }),
  },

  created() {},

  methods: {
    isEmpty: _.isEmpty,

    openModal() {
      console.log(this.$store);
      this.isShowModal = true;
    }, // openModal()

    closeModal() {
      this.isShowModal = false;
      this.resetModal();
    }, // closeModal()

    resetModal() {
      const self = this;

      self.title = '';
      self.desc = '';

      self.$v.$reset();
    }, // resetModal()

    onSubmit($ev, $v) {
      $ev.preventDefault();

      if(!$v.$invalid) {
        const self = this;
        const resManagementDataDataClone = _.cloneDeep(self.resManagementData);

        resManagementDataDataClone.management_list[self.idx].management_task.unshift({
          title: self.title,
          desc: self.desc,
        });

        self.$store.commit(PAGE_INFO_COMMIT_KEY.setResManagementData, resManagementDataDataClone);

        self.closeModal();
      }
    }, // onSubmit()
  },
};
</script>
