const _getTypeLabel =  (item) => {
      if (!item.displayRule) return
      let typeDisplay = item.displayRule.typeDisplay
      typeDisplay.forEach(room => {
        if (room == 1) {
            item.hasPromotion = true
            return
          } //hasPromotion
         if (room == 2) {
            item.hasSamePrice = true
            return
          } // hasSamePrice
         if (room == 3) {
            item.hasDirectDiscount = true
            return
          } // hasDirectDiscount
         if (room == 4) {
            item.hasExtraFee = true
            return
          } // hasExtraFree
         if (room == 5) {
            item.hasGift = true
            return
          } // hasGift
         if (room == 6) {
            item.hasExtraHours = true
            return
        } //hasExtraHours

      });
      return item
};
const _getRemain = (data,type) =>{
  let label= type=='day'? {vi:'ngày', en: 'day(s)'}:  {vi:'phòng', en: 'room(s)'}
  if (localStorage['g2j-translate-language'] == 'en') {
    return `${data} ${label.en} left`
  } else {
    return `Còn lại ${data} ${label.vi}`
  }


}
export {
  _getTypeLabel,_getRemain
};
