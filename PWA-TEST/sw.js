// 用于标注创建的缓存，也可以根据它来建立版本规范
const CACHE_NAME = "_cache_v1.1.2";
// 列举要默认缓存的静态资源，一般用于离线使用
const urlsToCache = [
    'offline.html',
    'res/img/404.png'
];//默认必须缓存的内容

const urlsToCache1 = [
    'app.js',
    'lib/indexdb.js',
    'lib/regular.js'
];//在线请求之后缓存

function isInUrlsToCache1(url){
	for(var a=0;a<urlsToCache1.length;a++){//22334433,33
		if(url.lastIndexOf(urlsToCache1[a])==url.length-urlsToCache1[a].length){
			return true;
		}
	}
};
const prePath="/PWA-TEST/"
// 联网状态下执行
function onlineRequest(fetchRequest) {
    // 使用 fecth API 获取资源，以实现对资源请求控制
    return fetch(fetchRequest).then(response => {
        // 在资源请求成功后，将 image、js、css 资源加入缓存列表
        if (
            !response
            || response.status !== 200
            || response.url.match(/\/res|\/css/i)
        ) {
            return response;
        }
		if(isInUrlsToCache1(response.url)){
			
			const responseToCache = response.clone();console.log("cache-to:"+response.url);
			caches.open(CACHE_NAME)
            .then(function (cache) {
                cache.put(fetchRequest, responseToCache);
            });
		}
        return response;
    }).catch(() => {
        // 获取失败，离线资源降级替换
        offlineRequest(fetchRequest);
    });
}
// 离线状态下执行，降级替换
function offlineRequest(request) {
    // 使用离线图片
    if (request.url.match(/\.(png|gif|jpg)/i)) {
        return caches.match('res/img/404.png');
    }

    // 使用离线页面
    if (request.url.match(/\.html$/)) {
        return caches.match('offline.html');
    }
}
// self 为当前 scope 内的上下文
self.addEventListener('install', event => {
    // event.waitUtil 用于在安装成功之前执行一些预装逻辑
    // 但是建议只做一些轻量级和非常重要资源的缓存，减少安装失败的概率
    // 安装成功后 ServiceWorker 状态会从 installing 变为 installed
    event.waitUntil(
        // 使用 cache API 打开指定的 cache 文件
        caches.open(CACHE_NAME).then(cache => {
            console.log(cache);
            // 添加要缓存的资源列表
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            // 返回缓存中命中的文件
            if (response) {
            	console.log("缓存中："+response.url);
                return response;
            }
            
            const fetchRequest = event.request.clone();
			var mc=fetchRequest.url.match(/\/api\/(.+)/);
			if(mc){
				console.log(fetchRequest.url);
				var apiLast=mc[1];//getList/get
				if(apiLast){
					apiLast=apiLast.replace(/\//gi,"-");
					if (navigator.onLine) {
						return fetch(prePath+"api/"+apiLast+".json");
					}else{
						return new Promise(function(resolve,reject){
							var _json={
								"code":200,
								"message":"",
								"result": [
								    { "name": "离线1111-cam1111111111", "content": "离线-It's good idea!", "timeStr": "2015-05-01" },
								    { "name": "离线2222222-arcthur", "content": "离线-Not bad.", "timeStr": "2015-05-01" }
								]
							};
							var _blob = new Blob([JSON.stringify(_json, null, 2)],{type : 'application/json'});
							 var _p=new Response(_blob, {
							    headers: {
							    	"Content-Type" : "text/plain",
							    },
							    ok: true,
								redirected: false,
								status: 200,
								statusText: "OK",
								type: "json",
								url: prePath+"api/"+apiLast+".json"
							 });
							 
							 resolve(_p);
						});
					}
					
				}
			}
            if (navigator.onLine) {
            	console.log("联网中："+fetchRequest.url);
                // 如果为联网状态
                return onlineRequest(fetchRequest);
            } else {
            	console.log("离线中："+fetchRequest.url);
                // 如果为离线状态
                return offlineRequest(fetchRequest);
            }
        })
    );
});


self.addEventListener('activate', event => {
	event.waitUntil(clients.claim().then(function(){
		console.log("可以马上监控发送请求了");
	}));
	console.log('activate');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        // 遍历当前的缓存，删除除 `CACHE_NAME` 之外的所有缓存
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (cacheWhitelist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );

});

self.addEventListener('push', function(event) {
    // 读取 event.data 获取传递过来的数据，根据该数据做进一步的逻辑处理
    const obj = event.data.text();
	console.log(obj);
	self.clients.matchAll().then(clientList => {
	    clientList.forEach(client => {
	        client.postMessage("1111111111111");
	    })
	});
    // 逻辑处理示例
    if(Notification.permission === 'granted'){//&& obj.action === 'subscribe') {
        self.registration.showNotification("Hi：", {
            body: obj,
            icon: '/PWA-TEST/res/img/icon-144x144.png',
            tag: 'push'
        });
    }
});

self.addEventListener('message', function(event) {
	console.log(event.data);
    self.clients.matchAll().then(clientList => {
	    clientList.forEach(client => {
	        client.postMessage({sw:22222222222});
	    })
	});
});


self.addEventListener('notificationclick', function(event) {
	console.log("notificationclick");
});