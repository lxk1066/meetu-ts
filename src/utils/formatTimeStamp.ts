/***
 * 将时间戳转换成 xx-xx-xx xx:xx:xx 格式的字符串
 * @param {Number} timeStamp 时间戳
 * @param {String} mode 可选值："full" || "auto"
 * @returns {string}
 */

function formatTimeStamp(timeStamp: string | number, mode: string): string {
  if (!mode) mode = "full";
  timeStamp = parseInt(<string>timeStamp);
  const time: Date = new Date(timeStamp);
  const year: number = time.getFullYear();
  let month: string | number = time.getMonth() + 1;
  let date: string | number = time.getDate();
  let hour: string | number = time.getHours();
  let minute: string | number = time.getMinutes();

  month = month < 10 ? "0" + month : month;
  date = date < 10 ? "0" + date : date;
  hour = hour < 10 ? "0" + hour : hour;
  minute = minute < 10 ? "0" + minute : minute;

  if (mode === "full") {
    return `${year}-${month}-${date} ${hour}:${minute}`;
  } else if (mode === "auto") {
    const nowStamp = +new Date(new Date().toLocaleDateString()).getTime();
    if (timeStamp >= nowStamp) {
      return `${hour}:${minute}`;
    } else if (nowStamp - timeStamp <= 86400000) {
      return `昨天 ${hour}:${minute}`;
    } else {
      return !parseInt(<string>hour) && !parseInt(<string>minute)
        ? `${year}/${month}/${date}`
        : `${year}/${month}/${date} ${hour}:${minute}`;
    }
  } else {
    return `${year}/${month}/${date} ${hour}:${minute}`;
  }
}

export default formatTimeStamp;
