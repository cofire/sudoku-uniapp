import MinRouter from './config/MinRouter'

// 配置路由
 // type必须是以下的值['navigateTo', 'switchTab', 'reLaunch', 'redirectTo']
		  // 跳转方式(默认跳转方式)
const router = new MinRouter({
	routes: [
    {
    	path: 'pages/index/index',
    	type: 'switchTab',
    	name: 'driveIndex'
    }
	]
})

export default router
