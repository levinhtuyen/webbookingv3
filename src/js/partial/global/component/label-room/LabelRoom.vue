<template>
  <div
    v-if="getName"
    class="label-room-component"
  >
    <template v-if="getName=='Same price'">
      <div class="label-room-component__item">
        <label-remaining-day :type="'promotion'">
          <template slot="title">
            <span>{{ getName }}</span>
          </template>
          <template slot="content">
            <span v-if="dataItem.displayRule.samePriceType == 1">
              {{ dataItem.displayRule.samePricePrice+`K/` + dataItem.displayRule.samePriceHours + `H` }}
            </span>
            <span v-if="dataItem.displayRule.samePriceType == 2">
              {{ dataItem.displayRule.samePricePrice+`K/` + dataItem.displayRule.samePriceHours + `O` }}
            </span>
            <span v-if="dataItem.displayRule.samePriceType == 3">
              {{ dataItem.displayRule.samePricePrice+`K/` + dataItem.displayRule.samePriceHours + `D` }}
            </span>
          </template>
        </label-remaining-day>
      </div>
      <!-- TODO: Test pls -->
    </template>
    <template v-else-if="typeLabel">
      <div
        class="label-room-component__item"
        :class="dataItem.hasPromotion ? 'promotion-label': dataItem.hasExtraFee ?'extra-fee-label': dataItem.hasGift ? 'gift-label' : dataItem.hasExtraHours? 'extra-hours-label': 'same-price-label' "
      >
        {{ getName }}
      </div>
      <img
        v-if="
          typeLabel &&
          typeLabel.hasExtraFee
        "
        class="label-room-component__icon"
        :src="IMAGE_URL + '/icon/demand.png'"
      >
    </template>
  </div>
</template>

<script>
  import {
    _
  } from '~jsLibPath/lib-manager';
  import { _getTypeLabel } from '~jsPath/helper/util/getLabel';
  import { IMAGE_URL } from '~jsDefinePath/general';
  export default {
    components: {
      'label-remaining-day': () => import("~jsPartialPath/global/component/label-remaining-day/LabelRemainingDay.vue"),
    },
    props: {
      dataItem: {
        type: [Object, Array],
      },
    },
    data () {
      return {
        IMAGE_URL
      }
    },

    computed: {
      typeLabel () {
        if (
          _.isEmpty(this.dataItem) ||
          _.isEmpty(this.dataItem.displayRule.typeDisplay) ||
          !this.dataItem.displayRule.typeDisplay.length
        ) {
          return null;
        }

        return _getTypeLabel(this.dataItem);
      }, // typeLabel

      getName () {
        if(!_.isEmpty(this.dataItem.displayRule.typeDisplayText)) {
          return this.dataItem.displayRule.typeDisplayText[0];
        }

        if (!this.typeLabel) {
          return null;
        }

        if (this.typeLabel.hasPromotion) return this.$t('hotel_info.promotion')
        if (this.typeLabel.hasExtraFee) return this.$t('hotel_info.extra_fee')
        if (this.typeLabel.hasGift) return this.$t('hotel_info.gift')
        if (this.typeLabel.hasExtraHours) return this.$t('hotel_info.extra_hour')
        if (this.typeLabel.hasSamePrice) return this.$t('hotel_info.same_price')
        return '';
      },
    },

    created () {
      // _getTypeLabel(dataItem);
    },
  }
</script>
