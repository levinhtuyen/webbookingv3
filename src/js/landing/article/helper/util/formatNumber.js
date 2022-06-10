const  getFormattedCurrency = (num)=> {
    if (num == 0) {
      return num
    } else {
      num = (num / 1000).toFixed(3).replace('.', '.')
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }

}
const getNumberWithCommas = (num) =>{
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

}
const formatPriceVND = (value) => {
    if (value || value == 0) {
    // return parseInt(value).toLocaleString("en-US", {
    //   style: "currency",
    //   currency: "VND",
    // });

    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  }
}
export {
  getFormattedCurrency,
  getNumberWithCommas,
  formatPriceVND
};
