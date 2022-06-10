// import dayjs from "dayjs";

const getDDMMYYYY =  (item) => {
  return dayjs((item)).format('DD-MM-YYYY')
}
const getDDMMYYYYHHmm = (item) => {
    return dayjs((item)).format('DD-MM-YYYY HH:mm')
}
const getHHmm = (item) => {
  return dayjs((item)).format('HH:mm');
}
export {
  getDDMMYYYY,getDDMMYYYYHHmm, getHHmm
};
