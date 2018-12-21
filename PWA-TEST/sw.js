// 用于标注创建的缓存，也可以根据它来建立版本规范
const CACHE_NAME = "_cache_v1.0.0";
// 列举要默认缓存的静态资源，一般用于离线使用
const urlsToCache = [
    'offline.html',
    'res/img/404.png'
];
const prePath="/PWA-TEST/"
// 联网状态下执行
function onlineRequest(fetchRequest) {
    // 使用 fecth API 获取资源，以实现对资源请求控制
    return fetch(fetchRequest).then(response => {
        // 在资源请求成功后，将 image、js、css 资源加入缓存列表
        if (
            !response
            || response.status !== 200
            || !response.headers.get('Content-type').match(/image|javascript|test\/css/i)
        ) {
            return response;
        }

//      const responseToCache = response.clone();
//      caches.open(CACHE_NAME)
//          .then(function (cache) {
//              cache.put(fetchRequest, responseToCache);
//          });

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
        return caches.match('/images/offline.png');
    }

    // 使用离线页面
    if (request.url.match(/\.html$/)) {
        return caches.match('/test/offline.html');
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
        .then(hit => {
            // 返回缓存中命中的文件
            if (hit) {
            	console.log("缓存中：",hit);
                return hit;
            }

            const fetchRequest = event.request.clone();
			console.log(fetchRequest);
			var mc=fetchRequest.url.match(/\/api\/(.+)/);
			if(mc){
				var apiLast=mc[1];//getList/get
				if(apiLast){
					apiLast=apiLast.replace(/\//gi,"-");
					return fetch(prePath+"api/"+apiLast+".json");
				}
			}
            if (navigator.onLine) {
                // 如果为联网状态
                return onlineRequest(fetchRequest);
            } else {
                // 如果为离线状态
                return offlineRequest(fetchRequest);
            }
        })
    );
});


self.addEventListener('push', function(event) {
    // 读取 event.data 获取传递过来的数据，根据该数据做进一步的逻辑处理
    const obj = event.data.json();

    // 逻辑处理示例
    if(Notification.permission === 'granted' && obj.action === 'subscribe') {
        self.registration.showNotification("Hi：", {
            body: '订阅成功 ~',
            icon: '//lzw.me/images/avatar/lzwme-80x80.png',
            tag: 'push'
        });
    }
});
