function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')
  ;
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

var TodoMVC = Regular.extend({
    template: "#todomvc",
    config:function(data){
    	data.content="";
    	var _this=this;
    	this.initWS();
    	this.initDB();
			window.setTimeout(function(){
				this.getList();
			}.bind(this),1000);
    	
    },
    getApiData:function(data){
    	 if(data.code==200){
					this.data.list=data.result;
					this.$update();
				}else{
					console.log(data.message);
				}
    },
    getList:function(){
    	var _this=this;
	    	fetch("/PWA-TEST/api/getList").then(function(response){
					response.json().then(function(data){
						console.log(data);
						_this.getApiData(data);
						
					});
	    	},function(err){
	    		console.log(err);
	    	});
    },
    initWS:function(){
	    	var _this=this;
	    	if ('serviceWorker' in navigator) {
			    navigator.serviceWorker
			        .register('sw.js', {scope: '/PWA-TEST/'})
			        .then(registration => {
			        	console.log('ServiceWorker 注册成功！作用域为: ', registration.scope);
			        	//console.log(registration);
			        	_this.initPUSH(registration);
			        	window.addEventListener('message', function(ev) {
								    console.log(ev.data);
								});
			        })
			        .catch(err => console.log('ServiceWorker 注册失败: ', err));
			}
    },
    initPUSH:function(regSW){
	    //const applicationServerPrivateKey='70bn4no _hcA8AYrxcaZbFVaDngr30MJBB89JnecKifof1FY6Z8';
			const applicationServerPublicKey = 'BDK6t1I6iCrbZqr_moeYrI-ONOrkt0QsBDS9bXlK2XKkTrzAcoTI7GgkWJoe6iCUMBRlL6MaqkFfSwqNuHgrMww'; 
    	const applicationServerKey = urlBase64ToUint8Array(applicationServerPublicKey);// 应用服务器的公钥（base64 网址安全编码）
    	// 向用户申请通知权限，用户可以选择允许或禁止
			// Notification.requestPermission 只有在页面上才可执行，Service Worker 内部不可申请权限
			Notification.requestPermission().then(grant => {
			    console.log(grant); // 如果获得权限，会得到 granted
			    if (Notification.permission === 'denied') {
			        // 用户拒绝了通知权限
			        console.log('Permission for Notifications was denied');
			    }else{
			    	new Promise(function(resolve, reject) {
						    resolve(regSW.pushManager.getSubscription());
						})
						.then(subscription => {
						    // 获取的结果没有任何订阅，发起一个订阅
						    if (!subscription) {
						        return regSW.pushManager.subscribe({
						            userVisibleOnly: true,
						            applicationServerKey: applicationServerKey
						        });
						    } else {
						        // 每一个会话会有一个独立的端点(endpoint)，用于推送时后端识别
						        window.___K=subscription;
						        return console.log("已订阅 endpoint:", subscription);
						    }
						})
						.then(subscription => {
						    if (!subscription) {
						        return;
						    }
							  window.___K=subscription;
						    // 订阅成功
						    console.log('订阅成功！', subscription);
						    // 做更多的事情，如将订阅信息发送给后端，用于后端推送识别
						    // const key = subscription.getKey('p256dh');
						    // updateStatus(subscription.endpoint, key, 'subscribe');
						})
						.catch(function (e) {
						    // 订阅失败
						    console.log('Unable to subscribe to push.', e);
						});
			    }
			});
		

    },
    initDB:function(){
	    	  IDB.createStores("TextDB",[{
	    	  		storeName:"loginfo",
	    	  		obj:{
					    			time:0,
					    			content:""
					    },
					    key:"id"
	    	  },{
	    	  		storeName:"offlinelog",
	    	  		obj:{
					    			time:0,
					    			content:""
					    },
					    key:"id"
	    	  },{
	    	  		storeName:"lastList",
	    	  		obj:{
					    			list:[]
					    },
					    key:"id"
	    	  }]);
    	 
    },
    onSave:function(){
    	if (navigator.onLine) {
				IDB.addRecord("TextDB","loginfo",{
					content:this.data.content,
					time:(new Date()).getTime()
				});
			}else{
				IDB.addRecord("TextDB","offlinelog",{
					content:this.data.content,
					time:(new Date()).getTime()
				});
			}
    }
});
var app = new TodoMVC({
  data: {}
}).$inject('#todoapp');