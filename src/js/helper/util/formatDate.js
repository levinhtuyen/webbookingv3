// import dayjs from "dayjs";

const getDDMMYYYY =  (item) => {
  return dayjs((item)).format('DD/MM/YYYY')
}
const getDDMMYYYYHHmm = (item) => {
  return dayjs((item)).format('DD-MM-YYYY HH:mm')
}
const getHHmmDDMMYYYY = (item) => {
  return dayjs((item)).format('HH:mm DD/MM/YYYY')
}
const getHHmm = (item) => {
  return dayjs((item)).format('HH:mm');
}
const  compareTime = (time1, time2) => {
  // func để so sánh 2 thời gian với nhau
  //type HH:mm
  var t1 = new Date();
  var t2 = new Date();

  let part1 = time1.split(":");
  let part2 = time2.split(":");
  t1.setHours(part1[0], part1[1], "00", 0);
  t2.setHours(part2[0], part2[1], "00", 0);

  if (t1.getTime() > t2.getTime()) return 1;
  if (t1.getTime() < t2.getTime()) return -1;
  return 0;
}
const compare1Hour = (time1, time2) => {
  //type HH:mm
  let arr1 = time1.split(':')
  let arr2 = time2.split(':')
  // if (arr2[0] <= arr1[0]){
  //   return false
  // }
  if (arr2[1] != arr1[1] )
    return false

  return true
}
const handleFormatTime=(data) =>{
        //type HH:mm
        if (!data) return;
        let time = data.split(":");
        time[0] = Number(time[0]) < 10 ? "0" + Number(time[0]) : time[0];
        time[0] = time[0] == 24 ? "00" : time[0];
        time[1] = time[1] < 10 ? "0" + Number(time[1]) : time[1];
        //co thời gian thì cập nhật chỗ này xíu
        let result = time[0] + ":" + time[1];
        return result;
} // handleFormatTime
export {
  getDDMMYYYY,getDDMMYYYYHHmm, getHHmm, compareTime,compare1Hour, getHHmmDDMMYYYY, handleFormatTime
};
