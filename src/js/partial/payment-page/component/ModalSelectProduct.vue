<template>
  <modal
    v-show="visible"
    ref="select-product"
    class="select-product-modal"
    :visible.sync="visible"
  >
    <template slot="header">
      <div class="select-product-modal__header">
        <h1> {{$t("payment.SPECIAL_PRODUCTS") }} </h1>
      </div>
    </template>
    <template slot="body">
      <div class="select-product-modal__body">
        <div
          v-for="(v,k) in productModal"
          :key="k"
          class="select-product-modal-card-item"
        >
          <div class="select-product-modal-card-item__container-img">
            <g2j-image
              :key="k+v.imagePath"
              :url-img="`${ASSETS_SERVICE_URL}/${v.imagePath}`"
            />
          </div>
          <div class="select-product-modal-card-item__content">
            <div class="select-product-modal-card-item__content--item card-item">
              <p class="card-item__name">
                {{ v.name }}
              </p>
              <p>{{ $formatPrice(v.price) }}</p>
              <div class="card-item__action">
                <i
                  class="fas fa-minus-circle"
                  @click="countItem(v,k,'minus')"
                />
                <p class="card-item__action--number">
                  {{ v.num }}
                </p>
                <i
                  class="fas fa-plus-circle"
                  @click="countItem(v,k,'plus')"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <div class="select-product-modal__footer">
        <button
          class="select-product-modal__footer--btn-apply btn-payment"
          @click="$emit('countItem', productModal)"
        >
          {{$t("payment.confirm") }} ({{$t("payment.selected") }} {{ totalItem }}   {{$t("payment.items") }})
        </button>
      </div>
    </template>
  </modal>
</template>

<script>
  import {
    IMAGE_URL,
    CACHE_VERSION,
    ASSETS_SERVICE_URL,
  } from '~jsDefinePath/general';
  import modal from '~jsPartialPath/global/component/modal/ModalComponent.vue'
  export default {
    components: {
      // 'modal': () => import('~jsPartialPath/global/component/modal/ModalComponent.vue'),
      modal
    },
    props: {
      products: {
        type: [Object, Array],
      },
    },
    data () {
      return {
        ASSETS_SERVICE_URL,
        visible: false,
        selectList: [],
        // productModal: []
      }
    },
    computed: {
      totalItem () {
        return Object.values(this.productModal).reduce((total, val) => {
          return total + val.num
        }, 0)
      },
      productModal () {
        return { ...this.products }
      }
    },

    created () {
      // this.productModal = { ...this.products };
    },


    updated () {
    },

    methods: {
      openModal () {
        this.visible = true
      },
      closeModal () {
        this.visible = false
      },
      countItem (data, index, type) {
        let obj = { ...data }
        obj.num = type == 'plus' ? obj.num + 1 : type == 'minus' && obj.num != 0 ? obj.num - 1 : 0
        this.productModal[index] = obj
        this.$emit('update:products', this.productModal)
      }
    },
  }
</script>
