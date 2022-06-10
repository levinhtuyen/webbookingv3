<template>
  <modal
    ref="select-hotel-modal"
    class="select-hotel-modal"
    :visible.sync="visible"
  >
    <template slot="body">
      <div class="select-hotel-modal__body">
        <template v-if="hotelList == null">
          <VueContentLoading
            :width="300"
            :height="150"
            class="container-loading"
            v-for="n in 2"
          >
            <rect
              x="0"
              y="5"
              rx="4"
              ry="4"
              width="30%"
              height="150"
            />
            <rect
              x="100"
              y="5"
              rx="4"
              ry="4"
              width="60%"
              height="20"
            />
            <rect
              x="100"
              y="40"
              rx="4"
              ry="4"
              width="60%"
              height="15"
            />
            <rect
              x="100"
              y="70"
              rx="4"
              ry="4"
              width="30%"
              height="10"
            />
          </VueContentLoading>
        </template>

        <div v-if="hotelList && !!hotelList.length">
          <template v-for="(item, idx) in hotelList">
            <G2jHotelProductCardHorizontal
              :key="item.sn"
              :hotel-item-info="item"
              :is-slide="false"
              :assets-service-url="ASSETS_SERVICE_URL"
            />
          </template>
        </div>
        <div
          v-if="hotelList && hotelList.length==0"
          class="select-hotel-modal__body"
        >
          <empty-sate>
          </empty-sate>
        </div>
      </div>
    </template>
    <template slot="footer">
      <div class="select-hotel-modal__footer"></div>
    </template>
  </modal>
</template>

<script>
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import { getToken, ASSETS_SERVICE_URL } from "~jsDefinePath/general";
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";
  import G2jHotelProductCardHorizontal from "~jsPartialPath/global/component/g2j-hotel-product-card-horizontal/G2jHotelProductCardHorizontal.vue";
  import EmptySate from "~jsPath/partial/search-page/component/EmptySate.vue";

  export default {
    components: {
      modal: () =>
        import("~jsPartialPath/global/component/modal/ModalComponent.vue"),
      G2jHotelProductCardHorizontal,
      VueContentLoading: window.VueContentLoading.VueContentLoading,
      EmptySate,
      // EmptyState: () => import("./component/EmptySate.vue"),
    },
    data() {
      return {
        visible: false,
        promotionSn: null,
        hotelList: null,
        ASSETS_SERVICE_URL,
      };
    },

    methods: {
      onRemoveCard() {},
      openModal(id) {
        this.promotionSn = id;
        this.getHotelListPromotion();
        this.visible = true;
      },
      async getHotelListPromotion() {
        this.hotelList = null;
        try {
          let res = await apiCaller({
            metaUrl: AJAX_URL.promotion.listHotelPromotion,
            method: "POST",
            data: {
              limit: 10,
              promotionSn: this.promotionSn,
            },
            headers: {
              Authorization: getToken(),
            },
            dataType: "json",
          });
          this.hotelList = res.data?.hotelList || [];
        } catch (error) {
          console.log("error :>> ", error);
        }
      },
      closeModal() {
        this.visible = false;
      },
    },
  };
</script>
