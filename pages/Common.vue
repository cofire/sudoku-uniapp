<!-- 定义全局变量和全局方法 -->
<script type="text/javascript">
/* 缓存的userId前缀 */
const USER_ID_PREFIX = '_userId';

const USER_INFO = '_userInfo';

const USER_PHONE = '_phone';

/* 缓存的商城mallId */
const MALL_ID = '_mallId';

/*  认证的token信息 */
const AUTHORIZATION = '_token';

/* refreshToken，用于换取accessToken */
const RERRESH_TOKEN = '_refresh_token';

/** 未登录时购物车列表*/
const CART_LIST = '_cartList';

/** 未登录购物车过期时间*/
const timeOut = 7200;

var MD5Util = require('../config/md5.js');
import Vue from 'vue';

/**
 * @param String name multipart提交时，表单的项目名，默认为：file
 * 如果name的值不填或者填的 值相同，导致服务端读取文件时之后只能读取一个文件
 * @param String url 服务器地址
 */
function uploadFile(count, url) {
	uni.chooseImage({
		count: count, //最多可以选择的图片张数
		success(choose_res) {
			let files = choose_res.tempFiles;
			let filePaths = choose_res.tempFilePaths;
			console.log(JSON.stringify(choose_res));
			const uploadTask = uni.uploadFile({
				url: url,
				name: 'file',
				filePath: filePaths[0], //上传的文件列表，使用files时，name和filePath不生效
				success: function(upload_res) {
					let data = upload_res.data;
					let statusCode = upload_res.statusCode;
					let errMsg = upload_res.errMsg;
					return data;
				}
			});
			uploadTask.onProgressUpdate(res => {
				console.log('上传进度{}', res.progress);
				console.log('已上传的数据长度{}', res.totalBytesSent);
				console.log('需要上传的数据总长度{}', res.totalBytesExpectedToSend);
			});
		}
	});
}
// 调用微信支付接口
function wxPay(totalFee, orderId, that, type) {
	let code;
	uni.login({
		provider: 'weixin',
		success(login_res) {
			let unifiedOrderParam = new Object();
			unifiedOrderParam.orderId = orderId;
			unifiedOrderParam.code = login_res.code;
			that.$minApi.uniapp_get(that.$base_api.unifiedOrder, unifiedOrderParam).then(res => {
				if (res.success) {
					let prepayId = res.data.prepayId;
					let nonceStr = res.data.nonceStr;
					let appId = res.data.appId;
					let mchKey = res.data.mchKey;
					let timeStamp = String(Date.now());
					let payDataA = 'appId=' + appId + '&nonceStr=' + nonceStr + '&package=prepay_id=' + prepayId + '&signType=MD5&timeStamp=' + timeStamp;
					let payDataB = payDataA + '&key=' + mchKey;
					let paySign = MD5Util.MD5(payDataB).toUpperCase();
					let refundReason = '';
					console.log('签名的字符串', paySign);
					uni.requestPayment({
						provider: 'wxpay',
						timeStamp: timeStamp,
						nonceStr: nonceStr,
						package: 'prepay_id=' + prepayId,
						signType: 'MD5',
						paySign: paySign,
						success: function(res) {
							updatePayStatus(orderId, type, that, refundReason);
						},
						fail: function(err) {
							that.$msg('订单支付失败，请重新支付', JSON.stringify(err));
							that.$openPage('order');
						}
					});
				} else {
					that.$msg('调用统一下单接口失败{}', res.msg);
				}
			});
		}
	});
}

//封装登录参数
function prepareLoginParam(user_res) {
	let userInfo = user_res.userInfo;
	let paramObj = new Object();
	userInfo.iv = user_res.iv;
	userInfo.rawData = user_res.rawData;
	userInfo.errMsg = user_res.errMsg;
	userInfo.signature = user_res.signature;
	userInfo.encryptedData = user_res.encryptedData;
	paramObj.userInfo = userInfo;
	return paramObj;
}

//更新订单状态
function updatePayStatus(orderId, type, that, refundReason) {
	that.$minApi.uniapp_post(that.$base_api.updateOrder, {
			orderId: orderId,
			type: type,
			refundReason: refundReason
		}).then(res => {
			let orderStatus = 0;
			let tempPayStatus = 201; //201代表订单状态为支付成功
			let refundStatus = 401; //401代表订单状态为退款中
			orderStatus = type;
			if (res.success && type == tempPayStatus) {
				that.$openPage('paySuccess');
			} else if (res.success && type != tempPayStatus) {
				// that.$openPage('order');
				uni.navigateTo('/pages/order/order?orderStatus=999');
			} else {
				that.$msg('支付成功，更改订单状态失败{}');
				type = refundStatus;
				updatePayStatus(orderId, type, that, refundReason);
			}
	});
}

function isLogin(that) {
	let userId = that.$cache.get(USER_ID_PREFIX);
	return !(userId == null || userId == '' || userId == undefined);
}

function hasPhone(that) {
	let phone = that.$cache.get(USER_PHONE);
	return !(phone == null || phone == '' || phone == undefined);
}

//校验身份证号
function isCardNo(num) {
	if (isNaN(num)) {
		this.$msg('输入的身份证号不是数字！');
		return false;
	}
	var len = num.length;
	if (len < 15 || len > 18) {
		this.$msg('输入的身份证号码长度不正确定！应为15位或18位');
		return false;
	}
	var re15 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
	var re18 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/;
	var res = re15.test(num) || re18.test(num);
	if (res == false) {
		this.$msg('输入的身份证号格式不正确！');
		return false;
	}
	return res;
}

/**
 * 验证是否为手机号码（移动手机）
 *
 * @param {}
 *            source
 */
function isMobilePhone(source) {
	var regex = /^((\(\d{3}\))|(\d{3}\-))?1\d{10}/;
	return regex.test(source);
}

export default {
	USER_INFO, //用户信息缓存key
	USER_PHONE, //用户手机号缓存key
	USER_ID_PREFIX, //用户ID缓存key
	MALL_ID, //商城ID
	AUTHORIZATION, //小程序授权
	RERRESH_TOKEN, //刷新token
	uploadFile, //上传文件
	isLogin, //判断是否登录
	hasPhone, //判断是否有手机号
	isCardNo, //校验身份证号
	isMobilePhone, //校验手机号
	CART_LIST, // 未登录时购物车列表
	timeOut,
	wxPay,
	updatePayStatus,
	prepareLoginParam
};
</script>
