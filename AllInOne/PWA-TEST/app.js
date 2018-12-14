var TodoMVC = Regular.extend({
    template: "#todomvc",
    config:function(data){
    	fetch("/api/getList").then(function(obj){
    		console.log(obj);
    	},function(err){
    		console.log(err);
    	});
    },
    initWS:function(){
    	if ('serviceWorker' in navigator) {
		    navigator.serviceWorker
		        .register('/sw.js', {scope: '/PWA-TEST/'})
		        .then(registration => console.log('ServiceWorker 注册成功！作用域为: ', registration.scope))
		        .catch(err => console.log('ServiceWorker 注册失败: ', err));
		}
    }
});
var app = new TodoMVC({
  data: {}
}).$inject('#todoapp');