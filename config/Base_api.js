const API_BASE_URL = "http://192.168.100.117:8093/tanker-api";
// const API_BASE_URL = "https://www.cool-srv.com/test/tanker-api";
export default {
  //获取验证码
  getAuthCode: API_BASE_URL + "/app/auth/getAuthCode",
  //登录
  login: API_BASE_URL + "/app/auth/login",
  //加油站列表查询
  queryPetrols: API_BASE_URL + "/app/driver/petrols",
  // 加油明细查询
  queryTradingRecords: API_BASE_URL + "/app/driver/trading/records",
  //加油交易
  addTransaction: API_BASE_URL + "/app/driver/transaction"

}
