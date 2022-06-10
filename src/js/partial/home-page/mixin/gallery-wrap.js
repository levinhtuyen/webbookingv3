const PROPS_CONFIG = {
  itemList: {
    default: () => [],
    type: Array,
  },
  assetsServiceUrl: {
    default: '',
    type: String,
  }
};

const DATA_CONFIG = {
  itemListFormatted: [],
  minItemsToScrollEachBreakPoint: {},
  curBreakPoint: null,
  isFormatting: true,
  itemRemovedCounter: 0,
};

const COMPUTED_CONFIG = {
  // NOTE - minimum of items required to make scroll horizontal
  curMinItemsToScroll() {
    if(!this.curBreakPoint) {
      return null;
    }

    return this.minItemsToScrollEachBreakPoint[this.curBreakPoint];
  }, // curMinItemsToScroll

  // NOTE - fit of items required to make full view horizontal
  fitItemsInView() {
    if(!this.curMinItemsToScroll) {
      return 1;
    }

    return (this.curMinItemsToScroll - 1);
  }, // fitItemsInView

  // NOTE - total of item
  totalItemsFormatted() {
    return (this.itemListFormatted.length - this.itemRemovedCounter);
  }, // totalItemsFormatted

  // NOTE - items is exist
  hasItems() {
    return (
      this.itemList &&
      typeof this.itemList === 'object' &&
      this.itemList.length >= 1
    );
  }, // hasItems

  // NOTE - items formatted is exist
  hasItemsFormatted() {
    return (this.totalItemsFormatted >= 1);
  }, // hasItemsFormatted

  // NOTE - know about amount of item at moment is valid to scroll or not
  isValidToMakeScroll() {
    if(
      !this.curMinItemsToScroll ||
      !this.hasItemsFormatted
    ) {
      return false;
    }

    return (this.totalItemsFormatted >= this.curMinItemsToScroll);
  }, // isValidToMakeScroll

  // NOTE - hotel collection lazyload class list
  itemLazyloadClassList() {
    if(
      !this.curMinItemsToScroll ||
      !this.hasItemsFormatted
    ) {
      return [];
    }

    const self = this;

    return self.itemListFormatted.map(function(item ,idx) {
      if(idx < self.fitItemsInView) {
        return 'lazyload';
      }

      return 'swiper-lazy';
    })
  }, // itemLazyloadClassList

  isShowItemListSection() {
    return (
      this.isFormatting ||
      this.hasItemsFormatted
    );
  }, // isShowBannerSection
};

const WATCH_CONFIG = {};

const METHODS_CONFIG = {
  onRemoveCard() {
    this.itemRemovedCounter++;
  }, // onRemoveCard()
};

const MIXIN_CONFIG = {
  props: PROPS_CONFIG,

  data() {
    return DATA_CONFIG;
  },

  computed: COMPUTED_CONFIG,

  watch: WATCH_CONFIG,

  methods: METHODS_CONFIG,
};

export {
  PROPS_CONFIG,
  DATA_CONFIG,
  COMPUTED_CONFIG,
  WATCH_CONFIG,
  METHODS_CONFIG,

  MIXIN_CONFIG,
};
