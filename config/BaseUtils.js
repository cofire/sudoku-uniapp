export default {
  install(Vue) {
    /**
     * 日期格式格式化
     * 请求示例 formatDate('20190519101010')
     * 方法可根据实际情况扩展
     */
    Vue.prototype.formatDate = (timeString) => { //全局函数1
      let year = '';
      let month = '';
      let day = '';
      let hour = '';
      let min = '';
      let second = '';
      if (timeString === undefined || timeString === null) {
        return null;
      }
      if (timeString.length === 8) { // yyyyMMdd
        year = timeString.slice(0, 4);
        month = timeString.slice(4, 6);
        day = timeString.slice(6, 8);
        return year + '-' + month + '-' + day;
      } else if (timeString.length === 14) { // yyyyMMddHHmmss
        year = timeString.slice(0, 4);
        month = timeString.slice(4, 6);
        day = timeString.slice(6, 8);
        hour = timeString.slice(8, 10);
        min = timeString.slice(10, 12);
        second = timeString.slice(12, 14);
        return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + second;
      } else {
        return null;
      }
    };
    /**
     * 表格中时间格式化
     * 请求示例 :formatter="formatTableTime"
     */
    Vue.prototype.formatTableTime = (row, column) => {
      return Vue.prototype.formatDate(row[column.property]);
    }

    /**
     * 修改查询条件中的时间
     * queryTimeList 格式例如： ['20191017','20191018']
     */
    Vue.prototype.getQueryTimeBeginAndEnd = (queryTimeList) => {
      if (queryTimeList == undefined || queryTimeList == null || queryTimeList.length < 2) {
        return "";
      }
      return [queryTimeList[0] + "000000", queryTimeList[1] + "235959"]
    }

    /**
     * 获取传入时间所在周的开始时间和结束时间
     * beginTime,endTime 格式例如： ['20191017000000','20191018235959']
     */
    Vue.prototype.getWeekStartAndEndTimeDate = (beginTime, endTime) => {
      var beginTimeString = Vue.prototype.formatDate(beginTime);
      var endTimeString = Vue.prototype.formatDate(endTime);
      const BeginDate = new Date(Date.parse(beginTimeString.replace(/-/g, "/")));
      const EndDate = new Date(Date.parse(endTimeString.replace(/-/g, "/")));
      return [BeginDate, EndDate];
    }

    /**
     * 获取本周的开始和结束时间对象
     */
    Vue.prototype.getCurrentWeekStartAndEndTimeDate = () => {
      const now = new Date();
      const nowTime = now.getTime();
      const day = now.getDay();
      const oneDayTime = 24 * 60 * 60 * 1000;
      const MondayTime = nowTime - (day - 1) * oneDayTime; //显示周一
      const SundayTime = nowTime + (7 - day) * oneDayTime; //显示周日
      const beginDate = new Date(MondayTime);
      var beginYear = beginDate.getFullYear();
      var beginMonth = beginDate.getMonth() + 1;
      var beginDay = beginDate.getDate();
      if (beginMonth >= 1 && beginMonth <= 9) {
        beginMonth = "0" + beginMonth;
      }
      if (beginDay >= 0 && beginDay <= 9) {
        beginDay = "0" + beginDay;
      }
      const beginTimeString = beginYear + '-' + beginMonth + '-' + beginDay + ' ' + "00:00:00";
      const endDate = new Date(SundayTime);
      var endYear = endDate.getFullYear();
      var endMonth = endDate.getMonth() + 1;
      var endDay = endDate.getDate();
      if (endMonth >= 1 && endMonth <= 9) {
        endMonth = "0" + endMonth;
      }
      if (endDay >= 0 && endDay <= 9) {
        endDay = "0" + endDay;
      }
      const endTimeString = endYear + '-' + endMonth + '-' + endDay + ' ' + '23:59:59';
      const BeginDate = new Date(Date.parse(beginTimeString.replace(/-/g, "/")));
      const EndDate = new Date(Date.parse(endTimeString.replace(/-/g, "/")));
      return [BeginDate, EndDate];
    }

    /**
     *  获取当天的起始时间和结束时间
     * formate 值 类似于 yyyyMMdd yyyy-MM-dd 等常见的日期格式
     * 根据不同的格式 返回不同的值 可扩展
     * 请求示例 this.getCurrentDayStartAndEndTime("yyyyMMdd")
     * formate 为空时 默认为 yyyyMMdd
     */
    Vue.prototype.getCurrentDayStartAndEndTime = (formate) => {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var begin = "";
      var end = "";

      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (day >= 0 && day <= 9) {
        day = "0" + day;
      }
      if (formate === undefined || formate === null || formate == "") {
        formate = "yyyyMMdd";
      }

      switch (formate) {
        case "yyyyMMdd":
          begin = "" + year + month + day;
          end = "" + year + month + day;
          break;
        case "yyyy-MM-dd":
          begin = "" + year + "-" + month + "-" + day;
          end = "" + year + "-" + month + "-" + day;
          break;
        case "yyyyMMddHHmmss":
          begin = "" + year + month + day + "000000";
          end = "" + year + month + day + "235959";;
          break;
        case "yyyy-MM-dd HH:mm:ss":
          begin = "" + year + "-" + month + "-" + day + " " + "00:00:00";
          end = "" + year + "-" + month + "-" + day + " " + "23:59:59";;
          break;
        default:
          break;
      }
      return [begin, end]
    }

    /**
     *  参数值：时间对象
     *  返回值：时间对象所在日期的开始时间(以000000结尾)
     *  示例：return：20200112000000
     */
    Vue.prototype.dateConvertStartTimeString = (date) => {
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (day >= 0 && day <= 9) {
        day = "0" + day;
      }
      return "" + year + month + day + "000000";
    }

    /**
     *  参数值：时间对象
     *  返回值：时间对象所在日期的结束时间(以235959结尾)
     *  示例：return：20200112235959
     */
    Vue.prototype.dateConvertEndTimeString = (date) => {
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (day >= 0 && day <= 9) {
        day = "0" + day;
      }
      return "" + year + month + day + "235959";
    }

    /** js对象深度复制 */
    Vue.prototype.copyObject = (source, dest) => {
      Object.keys(dest).forEach(key => {
        if (source[key] !== undefined) {
          dest[key] = source[key];
        }
      })
      return dest;
    }

    /** 判断为空 */
    Vue.prototype.isBlank = (value) => {
      if (value == undefined || value == null || value == "" || value.length <= 0) {
        return true;
      }
      return false;
    }

    /** 格式化字符串  */
    Vue.prototype.formatStr = (value, args) => {
      let arr = args.split(",");
      let count = 0;
      return value.replace(/%s/g, function(s, i) {
        return arr[count++];
      })
    }

    /** 判断不为空 */
    Vue.prototype.isNotBlank = (value) => {
      return !Vue.prototype.isBlank(value);
    }

    Vue.prototype.isFalse = (value) => {
      if (Vue.prototype.isBlank(value)) {
        return true;
      }
      if (value == "0" || value == "false" || value == "no") {
        return true;
      }
      return false;
    }


    /**
     * 判断值是否为数字
     */
    Vue.prototype.isRealNum = (val) => {
      var regPos = /^\d+(\.\d+)?$/; //非负浮点数
      var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
      if(regPos.test(val) || regNeg.test(val)){
          return true;
      }else{
          return false;
      }
    }
  }
}
