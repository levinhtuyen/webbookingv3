import {
  _,
  he,
  mapState,
} from '~jsLibPath/lib-manager';
import {
  IMAGE_URL,
  LANGUAGE_VALID,
} from "~jsDefinePath/general";
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
} from '~jsBasePath/vuex/modules/page-info-module';
import { getHotelDetailPagePath } from "~jsHelperPath/util/HandleUrl";
import { formatToThounsands } from "~jsHelperPath/util/General";

const MIXIN_CONFIG = {
  props: {
    isSlide: {
      default: false,
      type: Boolean,
    }, // isSlide

    isDisableInvalid: {
      default: true,
      type: Boolean,
    }, // isDisableInvalid

    info: {
      default: {},
      type: new Object,
    }, // info

    width: {
      default: 216,
      type: Number,
    }, // width
  },

  data() {
    return {
      IMAGE_URL,

      hasInfo: (
        !_.isEmpty(this.info) ||
        !_.isEmpty(this.info.displayRule)
      ),

      // NOTE - check for show / non disable card base on isDisableInvalid prop
      isValidToShow: false,

      // NOTE - exist status of data
      hasImageUrl: false,
      hasHashTagList: false,
      hasTitle: false,
      hasDetailPathList: false,
      hasBenefitListWithLocale: false,
      hasBenefitLabelWithLocale: false,

      hasCurPrice: false,
      hasOldPrice: false,

      hasRating: false,
      hasTotalReview: false,

      hasRooms: false,

      hasDistrictName: false,

      hasAddress: false,
      hasDistance: false,

      hasRoomLeftLabelWithLocale: false,

      // NOTE - data
      title: '',
      detailPathList: {},
      imageUrl: '',
      hashTag: [],
      benefitListWithLocale: [],
      benefitLabelWithLocale: {},

      curPrice: '',
      oldPrice: '',

      rating: 0,
      totalReview: 0,

      roomsLocaleList: {},

      districtName: '',

      address: '',
      distance: '',

      roomLeftLabelWithLocale: {},
    };
  },

  computed: {
    ...mapState(PAGE_INFO_MODULE_NAME, [
      'language',
    ]),

    bookingTypeLabel() {
      if(!this.hasInfo) {
        return '';
      }

      return (
        this.info.displayRule.bookingType === 1 ?
          {
            [LANGUAGE_VALID.vi]: this.info.firstHours + ' giờ đầu',
            [LANGUAGE_VALID.en]: this.info.firstHours + ' first hour(s)',
          }[this.language] :
        this.info.displayRule.bookingType === 2 ?
          this.$t('common.overnight') :
        this.info.displayRule.bookingType === 3 ?
          this.$t('common.daily') :
          ''
      );
    }, // bookingTypeLabel

    hasBookingTypeLabel() {
      return !_.isEmpty(this.bookingTypeLabel);
    }, // hasBookingTypeLabel
  },

  created() {
    this.setupData();
    this.checkDataExist();
    this.checkValidToShow();
  },

  mounted() {
    const self = this;

    self.$emit('mounted', {
      is_valid: self.isValidToShow,
      is_finish_render_list: (self.info.order === self.info.total),
      info: self.info,
    });
  },

  methods: {
    setupData() {
      this.detailPathList = this.generateDetailPathList();
      this.imageUrl = this.generateImageUrl();
      this.hashTagList = this.generateHashTagList();
      this.title = this.generateTitle();
      this.benefitListWithLocale = this.generateBenefitListWithLocale();
      this.benefitLabelWithLocale = this.generateBenefitLabelWithLocale();
      this.curPrice = this.generateCurPrice();
      this.oldPrice = this.generateOldPrice();
      this.rating = this.generateRating();
      this.totalReview = this.generateTotalReview();
      this.roomsLocaleList = this.generateRoomsLocaleList();
      this.districtName = this.generateDistrictName();
      this.address = this.generateAddress();
      this.distance = this.generateDistance();
      this.roomLeftLabelWithLocale = this.generateRoomLeftLabelWithLocale();
    }, // setupData()

    checkDataExist() {
      this.hasDetailPathList = !_.isEmpty(this.detailPathList);
      this.hasImageUrl = !_.isEmpty(this.imageUrl);
      this.hasHashTagList = !_.isEmpty(this.hashTagList);
      this.hasTitle = !_.isEmpty(this.title);
      this.hasBenefitListWithLocale = !_.isEmpty(this.benefitListWithLocale);
      this.hasBenefitLabelWithLocale = !_.isEmpty(this.benefitLabelWithLocale);
      this.hasCurPrice = !_.isEmpty(this.curPrice);
      this.hasOldPrice = !_.isEmpty(this.oldPrice);
      this.hasRating = !_.isEmpty(this.rating);
      this.hasTotalReview = (this.totalReview > 0);
      this.hasRooms = !_.isEmpty(this.roomsLocaleList);
      this.hasDistrictName = !_.isEmpty(this.districtName);
      this.hasAddress = !_.isEmpty(this.address);
      this.hasDistance = !_.isEmpty(this.distance);
      this.hasRoomLeftLabelWithLocale = !_.isEmpty(this.roomLeftLabelWithLocale);
    }, // checkDataExist()

    checkValidToShow() {
      this.isValidToShow = (
        this.hasInfo &&
        this.hasDetailPathList &&
        this.hasCurPrice
      );
    }, // checkValidToShow()

    generateImageUrl() {
      if(!this.hasInfo) {
        return '';
      }

      return (this.$assetsServiceUrl || '') + '/' + this.info.imagePath;
    }, // generateImageUrl()

    generateHashTagList() {
      if(
        !this.hasInfo ||
        typeof this.info.hashtag !== 'object' ||
        !this.info.hashtag.length
      ) {
        return [];
      }

      let _tmpHashTag = [];

      this.info.hashtag.forEach(function(hashTagLabel) {
        let _tmpHashTagLabel = he.decode(hashTagLabel).trim();

        if(!_.isEmpty(_tmpHashTagLabel)) {
          if(!_tmpHashTagLabel.includes('#')) {
            _tmpHashTagLabel=('#'+_tmpHashTagLabel);
          }

          _tmpHashTag.push(_tmpHashTagLabel);
        }
      });

      return _tmpHashTag;
    }, // generateHashTagList()

    generateTitle() {
      // NOTE - Case 1
      // NOTE - If the title is not string of type or if it's string of type and trim() of it is empty -> return {} empty
      if(
        !this.hasInfo ||
        typeof this.info.name !== 'string' ||
        !this.info.name.trim()
      ) {
        return '';
      }

      return he.decode(this.info.name.trim());
    }, // generateTitle()

    generateDetailPathList() {
      if(
        !this.hasInfo ||
        typeof this.info.sn !== 'number'
      ) {
        return {}
      }

      const _tmpObjQueryString = {hotelSn: this.info.sn};

      if(this.info.flashSale) {
        _tmpObjQueryString.bookingType = 2;
      }

      return getHotelDetailPagePath(
        {
          hotelName: GetSlug(this.info.name),
        },
        _tmpObjQueryString
      );
    }, // generateDetailPathList()

    generateBenefitListWithLocale() {
      if(
        !this.hasInfo ||
        _.isEmpty(this.info.displayRule.typeDisplayText)
      ) {
        return [];
      }

      const tmpBenefitList = [];

      this.info.displayRule.typeDisplayText.forEach(function(typeDisplayTextItem) {
        // NOTE - Case 1
        // NOTE - If the title is not string of type or if it's string of type and trim() of it is empty -> return {} empty
        if(
          typeof typeDisplayTextItem !== 'string' ||
          !typeDisplayTextItem.trim()
        ) {
          return {};
        }

        // NOTE - Case 2
        // NOTE - If pass case 1, we will split the title and check condition on it
        const typeDisplayTextSplitted = typeDisplayTextItem.split('|');

        // NOTE - Cause the typeDisplayText is string of type, so the split native method worked and the a string split a letter or word does not exist in typeDisplayText -> the result will give an array with length always = 1
        // NOTE - If length = 1 we will check the trim() of [0] word of 0 index else we will check words of 0 index and 1 index (if one of 2 group condition is true -> return {})
        if(
          (
            typeDisplayTextSplitted.length === 1 &&
            !typeDisplayTextSplitted[0].trim()
          ) ||
          (
            !typeDisplayTextSplitted[0].trim() &&
            !typeDisplayTextSplitted[1].trim()
          )
        ) {
          return;
        }

        if(
          typeDisplayTextSplitted.length === 1 &&
          typeDisplayTextSplitted[0].trim()
        ) {
          const finaltypeDisplayText = he.decode(typeDisplayTextSplitted[0].trim());

          tmpBenefitList.push({
            [LANGUAGE_VALID.vi]: finaltypeDisplayText,
            [LANGUAGE_VALID.en]: finaltypeDisplayText,
          });

          return;
        }

        const finaltypeDisplayTextVi = typeDisplayTextSplitted[0].trim();
        const finaltypeDisplayTextEn = typeDisplayTextSplitted[1].trim();

        tmpBenefitList.push({
          [LANGUAGE_VALID.vi]: (
            finaltypeDisplayTextVi ?
              he.decode(finaltypeDisplayTextVi) :
              he.decode(finaltypeDisplayTextEn)
          ),
          [LANGUAGE_VALID.en]: (
            finaltypeDisplayTextEn ?
              he.decode(finaltypeDisplayTextEn) :
              he.decode(finaltypeDisplayTextVi)
          ),
        });
      });

      if(!tmpBenefitList.length) {
        return [];
      }

      return tmpBenefitList;
    }, // generateBenefitListWithLocale()

    generateBenefitLabelWithLocale() {
      if(_.isEmpty(this.benefitListWithLocale)) {
        return {};
      }

      const self = this;
      let tmpBenefitLabelWithLocale = {};
      const benefitLabelWithLocaleFirstItem = self.benefitListWithLocale[0];

      for(const locale in benefitLabelWithLocaleFirstItem) {
        if(benefitLabelWithLocaleFirstItem[locale].includes('-')) {
          const tmpBenefitLabelWithLocaleItemSplitted = benefitLabelWithLocaleFirstItem[locale].split('-');

          tmpBenefitLabelWithLocaleItemSplitted.some(function(tmpBenefitLabelWithLocaleItemSplittedItem) {
            if(!_.isEmpty(tmpBenefitLabelWithLocaleItemSplittedItem)) {
              tmpBenefitLabelWithLocale[locale] = tmpBenefitLabelWithLocaleItemSplittedItem.trim();

              return true;
            }
          });
        } else {
          tmpBenefitLabelWithLocale[locale] = benefitLabelWithLocaleFirstItem[locale];
        }
      }

      return tmpBenefitLabelWithLocale;
    }, // generateBenefitLabelWithLocale()

    generateCurPrice() {
      if(!this.hasInfo) {
        return 0;
      }

      // const tmpCurPrice = (
      //   this.info.displayRule.discountPrice === 0 ?
      //     this.info.displayRule.originPrice :
      //   this.info.displayRule.originPrice < this.info.displayRule.discountPrice ?
      //     this.info.displayRule.originPrice :
      //     this.info.displayRule.discountPrice
      // );

      const tmpCurPrice = (
        this.info.displayRule.discountPrice > 0 ?
          this.info.displayRule.discountPrice :
        this.info.displayRule.originPrice
      );

      return (
        tmpCurPrice > 0 ?
          formatToThounsands(tmpCurPrice) + '<sup>đ</sup>' :
        ''
      );
    }, // generateCurPrice()

    generateOldPrice() {
      if(!this.hasInfo) {
        return 0;
      }

      // const tmpOldPrice = (
      //   this.info.displayRule.discountPrice === 0 ?
      //     0 :
      //   this.info.displayRule.originPrice <= this.info.displayRule.discountPrice ?
      //     0 :
      //     this.info.displayRule.originPrice
      // );

      const tmpOldPrice = (
        this.info.displayRule.originPrice > 0 ?
          (this.info.displayRule.originPrice > this.info.displayRule.discountPrice) ?
            this.info.displayRule.originPrice :
          0 :
        0
      );

      return (
        tmpOldPrice > 0 ?
          formatToThounsands(tmpOldPrice) + '<sup>đ</sup>' :
        ''
      )
    }, // generateOldPrice()

    generateRating() {
      if(
        !this.hasInfo ||
        typeof this.info.averageMark !== 'number'
      ) {
        return 0;
      }

      let tmpRating = String(this.info.averageMark);

      tmpRating = (
        tmpRating.length === 1 ? tmpRating + '.0' : tmpRating
      );

      return String(tmpRating);
    }, // generateRating()

    generateTotalReview() {
      if(!this.hasInfo) {
        return 0;
      }

      return this.info.totalReview;
    }, // generateTotalReview()

    generateRoomsLocaleList() {
      if(!this.hasInfo) {
        return {};
      }

      const tmpRooms = 0;

      return (
        tmpRooms > 0 ?
          {
            [LANGUAGE_VALID.vi]: `Còn ${tmpRooms} phòng`,
            [LANGUAGE_VALID.en]: `${tmpRooms} ${(tmpRooms > 1) ? 'rooms' : 'room'} left`,
          } :
          {}
      );
    }, // generateRoomsLocaleList()

    generateDistrictName() {
      if(!this.hasInfo) {
        return '';
      }

      return (
        _.isEmpty(this.info.districtName) ?
        '' : he.decode(this.info.districtName)
      );
    }, // generateDistrictName()

    generateAddress() {
      if(
        !this.hasInfo ||
        typeof this.info.address !== 'string'
      ) {
        return '';
      }

      return this.info.address;
    }, // generateAddress

    generateDistance() {
      if(
        !this.hasInfo ||
        typeof this.info.distance !== 'number'
      ) {
        return '';
      }

      let _distance = this.info.distance;

      if(_distance < 1) {
        _distance=_distance*1000+'m';
      } else {
        _distance=_distance.toFixed(1)+'km';
      }

      return _distance;
    }, // generateDistance()

    generateRoomLeftLabelWithLocale() {
      if(
        !this.hasInfo ||
        !(
          this.info.origin === 2 &&
          !this.info.roomAvailable
        ) ||
        typeof this.info.displayRule.roomsLeft !== 'number' ||
        this.info.displayRule.roomsLeft === 0
      ) {
        return {}
      }

      return {
        [LANGUAGE_VALID.vi]: 'Chỉ còn ' + this.info.displayRule.roomsLeft + ' phòng',
        [LANGUAGE_VALID.en]: 'Only ' + this.info.displayRule.roomsLeft + ' left',
      };
    }, // generateRoomLeftLabelWithLocale()

    onClickToRedirect(href) {
      if(
        this.isValidToShow &&
        href
      ) {
        this.$router.push(href);
      }
    }, // onClickToRedirect()
  },
};

export {
  MIXIN_CONFIG,
};
