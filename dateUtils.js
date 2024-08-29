const dayjs = require("dayjs");
//import dayjs from 'dayjs' // ES 2015
function getCurrentTime() {
  return dayjs().format("HH:mm:ss");
}

module.exports = {
  getCurrentTime,
};
