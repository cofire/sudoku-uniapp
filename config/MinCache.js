/**
 * 缓存组件
 * name以下划线 '_' 命名的将缓存到storage中，同时map中也有缓存副本
 * name不以下划线开头的将不会缓存到storage中，在程序生命周期内并且在有效时间内有效
 */


let cacheMap = new Map()
//默认超时时间，单位： 秒
let timeoutDefault = 1200

//判断是否超时
function isTimeout(name) {
	const data = cacheMap.get(name);
	if (!data) return true;
	// 过期时间设置为0，表示永久缓存
	if (data.timeout === 0) return false;
	const currentTime = Date.now();
	const overTime = (currentTime - data.createTime) / 1000
	if (overTime > data.timeout) {
		cacheMap.delete(name);
		if (name.startsWith("_")) {
			try {
				uni.removeStorageSync(name);
			} catch (e) {
				console.log("清除过期的缓存失败{}", e);
			}
		}
		return true;
	}
	return false;
}

/**
 * 缓存的value对象
 */
class CacheCell {
	constructor(data, timeout) {
		this.data = data
		this.timeout = timeout
		this.createTime = Date.now()
	}
}

/**
 * 缓存组件对象
 */
class MinCache {
	constructor(timeout) {
		try {
			const res = uni.getStorageInfoSync()
			res.keys.forEach(name => {
				try {
					const value = uni.getStorageSync(name)
					cacheMap.set(name, value)
				} catch (e) {
					console.log("初始化map副本失败{}", e)
				}
			})
		} catch (e) {
			console.log("初始化storage缓存失败{}", e)
		}
		timeoutDefault = timeout
	}

	//设置缓存信息
	set(name, data, timeout = timeoutDefault) {
		const cachecell = new CacheCell(data, timeout)
		let cache = null
		console.log("APpVuwe缓存的key", name)
		if (name.startsWith('_')) {
			try {
				uni.setStorageSync(name, cachecell)
			} catch (e) {
				console.log("设置缓存失败{}", e)
			}
		}
		return cacheMap.set(name, cachecell)
	}

	//获取指定name对应的value值
	get(name) {
		return isTimeout(name) ? null : cacheMap.get(name).data
	}

	//删除缓存
	delete(name) {
		let value = false
		if (name.startsWith('_')) {
			try {
				uni.removeStorageSync(name)
			} catch (e) {
				console.log(e)
			}
		}
		return cacheMap.delete(name)
	}

	//判断缓存中是否有该name
	has(name) {
		return !isTimeout(name)
	}

	//清空缓存
	clear() {
		let value = false
		try {
			uni.clearStorageSync()
			cacheMap.clear()
			value = true
		} catch (e) {
			console.log(e)
		}
		return value
	}
}

MinCache.install = function(Vue, {timeout = 1200} = {}) {
	Vue.prototype.$cache = new MinCache(timeout)
}

export default MinCache
