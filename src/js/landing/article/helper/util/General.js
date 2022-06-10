const formatToThounsands = (number) => {
  if(typeof number !== 'number') {
    console.error('formatToThounsands only give number type!');
  }

  return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
} // formatToThounsands()

export {
  formatToThounsands
};