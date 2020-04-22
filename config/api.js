import MinRequest from './MinRequest'

const minRequest = new MinRequest()

// 请求拦截器
minRequest.interceptors.request((request) => {
	// let refreshToken = Vue.prototype.$cache.get(common.RERRESH_TOKEN);
	// let remainTime = Vue.prototype.$cache.getCacheRemainTime(common.RERRESH_TOKEN);
	// console.log("remainTime", remainTime)
	// if(remainTime == 5) {
	// 	console.log("执行换取token的操作")
	//     uniapp_post(Vue.prototype.$base_api.refreshToken, {"refreshToken": refreshToken, "unitNo": Vue.prototype.$base_api.UNIT_NO}).then(res => {
	// 		if (res.success) {
	// 			Vue.prototype.$cache.set(common.RERRESH_TOKEN, res.data.refreshToken, 7200)
	// 			//小程序登陆有效期设置为7天
	// 			Vue.prototype.$cache.set(common.AUTHORIZATION, res.data.token, 3600);
	// 		}
	// 	});
	// }
	return request
})

// 响应拦截器
minRequest.interceptors.response((response) => {
	let result = response.data;
	//未登录，无权限
	if (!result.success && result.code == 401) {
		Vue.prototype.$openPage('Auth');
		return response.data;
	} 
	//参数校验失败
	if (!result.success && result.code == 400) {
		Vue.prototype.$msg("参数校验失败,请检查{}" + response.data.msg, 3000);
		return response.data;
	}
	return response.data
})

// 设置默认配置
minRequest.setConfig((config) => {
	return config
})
import common from '../pages/Common.vue'
import Vue from 'vue'
export default {
	// 这里统一管理api请求
	apis: {
		uniapp_get(url, data) {
			let header = {header: {'token': Vue.prototype.$cache.get(common.AUTHORIZATION)}}
			return minRequest.get(url, data, header)
		},
		uniapp_post(url, data, type, token) {
			let header = {header: {'content-type': 'application/json', 'token' : Vue.prototype.$cache.get(common.AUTHORIZATION)}}
			let options = {header: {'token' : Vue.prototype.$cache.get(common.AUTHORIZATION)}};
			if (type == 'json') {
				return minRequest.post(url, data, header)
			}
			return minRequest.post(url, data, options);
			
		},
	}
}
