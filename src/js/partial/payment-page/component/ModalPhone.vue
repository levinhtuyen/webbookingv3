<template>
  <modal
    ref="phone-modal"
    class="phone-modal"
    :visible.sync="visible"
    :has-header="false"
  >
    <template slot="body">
      <div class="phone-modal__body">
        <div class="phone-modal__body--title">
          {{ $t('payment.note_input_phone') }}
        </div>
        <div class="phone-modal__body--container-input">
          <Go2joyFlagsSection
            :code-country.sync="code"
            class="phone-modal-flats"
          />
          <div class="phone-modal-container-phone">
            <input
              v-model="$v.phone.$model"
              v-focus="isFocus"
              :class="{ 'is-error' : $v.phone.$error }"
              type="text"
              placeholder="Mobile"
              class="phone-modal-container-phone__number"
              @keyup.enter="onEnterInput($v.phone.$error)"
            >
            <div
              v-if="!$v.phone.numeric"
              class="phone-modal-container-phone__error"
            >
              {{ $t('payment.please_input') }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <div class="phone-modal__footer">
        <button
          :disabled="!$v.phone.minLength || !$v.phone.required"
          class="phone-modal__footer--btn-apply g2j-button-book-now"
          :class="{disable: $v.phone.$error || phone==''}"
          @click="clickNext()"
        >
          {{ $t('payment.next') }}
        </button>
      </div>
    </template>
  </modal>
</template>

<script>
  import Go2joyFlagsSection from '~jsPartialPath/global/component/go2joy-flags/Go2joyFlagsSection.vue'
  import {
    Vue,
    numeric,
    minLength,
    required
  } from '~jsLibPath/lib-manager';
  Vue.use(vuelidate.default);

  export default {
    components: {
      'modal': () => import('~jsPartialPath/global/component/modal/ModalComponent.vue'),
      Go2joyFlagsSection
    },
    data () {
      return {
        visible: false,
        phone: '',
        code: '84',
        isFocus: false
      }
    },
    validations: {
      phone: {
        numeric,
        minLength: minLength(9),
        required
      }
    },
    methods: {
      onEnterInput (check) {
        if (this.phone && !check) {
          this.clickNext()
        }
      },
      openModal () {
        this.phone = ''
        this.visible = true
        this.isFocus = true
      },
      closeModal () {
        this.visible = false
      },
      clickNext () {
        this.$emit('next', this.phone, this.code)
        this.closeModal()
      }
    },
  }
</script>
