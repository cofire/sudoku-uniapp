import Vue from 'vue'
import App from './App'

import Json from './Json' //测试用数据

import base_api from 'config/Base_api' // 统一请求URI
import MinRequest from './config/MinRequest'
import minRequest from './config/api'
import MinCache from './config/MinCache'
import MinRouter from './config/MinRouter'
import BaseUtils from './config/BaseUtils'
import minRouter from './router'
import Common from './pages/Common.vue'
/**
 *  因工具函数属于公司资产, 所以直接在Vue实例挂载几个常用的函数
 *  所有测试用数据均存放于根目录json.js
 *  
 *  css部分使用了App.vue下的全局样式和iconfont图标，有需要图标库的可以留言。
 *  示例使用了uni.scss下的变量, 除变量外已尽量移除特有语法,可直接替换为其他预处理器使用
 */
const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
const json = type=>{
	//模拟异步请求数据
	return new Promise(resolve=>{
		setTimeout(()=>{
			resolve(Json[type]);
		}, 500)
	})
}

const prePage = ()=>{
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}


Vue.config.productionTip = false
Vue.prototype.$fire = new Vue();
Vue.prototype.$msg = msg;
Vue.prototype.$base_api = base_api;
Vue.prototype.$json = json;
Vue.prototype.$prePage = prePage;
Vue.prototype.global = Common
Vue.use(MinRequest)
Vue.use(MinCache)
Vue.use(MinRouter)
Vue.use(BaseUtils)
App.mpType = 'app'

const app = new Vue({
    ...App,
	minRequest,
	minRouter,
})
app.$mount()