###Welcome to use MarkDown
#name
name: {string}，用来描述应用的名称，会显示在各类提示的标题位置和启动画面中。

#short_name
short_name: {string}，用来描述应用的短名字。当应用的名字过长，在桌面图标上无法全部显示时，会用short_name中定义的来显示。

#start_url
start_url: {string}，用来描述当用户从设备的主屏幕点击图标进入时，出现的第一个画面。

##如果设置为空字符串，则会以manifest.js的地址做为URL
##如果设置的URL打开失败，则和正常显示的网页打开错误的样式一下（可以通过后面讲的ServiceWorker改善）
##如果设置的URL与当前的项目不在一个域下，也不能正常显示
##start_url 必须在scope的作用域范围内
##如果 start_url 是相对地址，那么根路径基于manifest的路径
##如果 start_url 为绝对地址，则该地址将永远以 / 作为根路径

#scope
scope : {string}，用来设置manifest对于网站的作用范围。 
下面列一下，scope的作用范围及对start_url的影响：

manifest的文件位置		start_url			scope配置			计算好的scope	计算好的start_url			是否有效
/inner/manifest.json	./index.html		undefined			/inner/			/index.html					有效
/inner/manifest.json	./index.html		../					/				/index.html					有效 - 但作用域泄露到了更高层级
/inner/manifest.json	/					/					/				/index.html					有效 - 但作用域泄露到了更高层级
/inner/manifest.json	/					undefined			/inner/			/							无效 - start url不在作用域范围内
/inner/manifest.json	./inner/index.html	undefined			/inner/			/inner/inner/index.html		有效 - 但start url明显不符合预期
/manifest.json	        ./inner/index.html	undefined			/				/inner/index.html			有效 - 广作用域
/manifest.json			./inner/index.html	inner				/inner/			/inner/index.html			有效 - 窄作用域

#icons
icons: {Array.<ImageObject>}，用来设置Web App的图标集合。

ImageObject 包含属性：
##src: {string}，图标的地址
##type {string}，图标的 mime 类型，可以不填写。这个字段会让浏览器不使用定义类型外的图标
##sizes {string}，图标的大小，用来表示width x height，单位为px，如果图标要适配多个尺寸，则第n个尺寸间用空格分割，如12x12 24x24 100x100。

sizes适配规则：
###在PWA添加到桌面的时候，浏览器会适配最合适尺寸的图标。浏览器首先会去找与显示密度相匹配且尺寸调整到 48dp 屏幕密度的图标，例如它会在 2 倍像素的设备上使用 96px，在 3 倍像素的设备上使用 144px。。
###如果没有找到任何符合的图标，则会查找与设备特性匹配度最高的图标。
###如果匹配到的图标路径错误，将会显示浏览器默认 icon。
###需要注意的是，图标中必须要有一张尺寸为144x144的，图标的 mime 类型为 image/png的。

#background_color
background_color: {Color}，值为CSS的颜色值，用来设置Web App启动画面的背景颜色。
可以像正常写CSS颜色那样定义
其他的定义rgba、hsl、hsla等颜色定义方式浏览器不支持，未设置时，背景色均显示白色。

#theme_color
theme_color: {Color}，定义和background_color一样的CSS颜色值，用于显示Web App的主题色，显示在banner位置。

#display
display: {string}，用来指定 Web App 从主屏幕点击启动后的显示类型

显示类型			描述																					降级显示类型
fullscreen		应用的显示界面将占满整个屏幕															standalone
standalone		浏览器相关UI（如导航栏、工具栏等）将会被隐藏											minimal-ui
minimal-ui		显示形式与standalone类似，浏览器相关UI会最小化为一个按钮，不同浏览器在实现上略有不同		browser
browser			浏览器模式，与普通网页在浏览器中打开的显示一致											(None)
对于不同的显示样式，可以通过CSS的媒体查询进行设置：
```
@media all and (display-mode: fullscreen) {
    div {
        padding: 0;
    }
}
@media all and (display-mode: standalone) {
    div {
        padding: 1px;
    }
}
@media all and (display-mode: minimal-ui) {
    div {
        padding: 2px;
    }
}
@media all and (display-mode: browser) {
    div {
        padding: 3px;
    }
}
```

#orientation
orientation: {string}，Web App的在屏幕上的显示方向。

##landscape-primary，当视窗宽度大于高度时，当前应用处于“横屏”状态
##landscape-secondary，landscape-primary的180°方向
##landscape，根据屏幕的方向，自动横屏幕180°切换
##portrait-primary，当视窗宽度小于高度时，当前应用处于“竖屏”状态
##portrait-secondary，portrait-primary的180°方向
##portrait，根据屏幕方向，自动竖屏180°切换
##natural， 根据不同平台的规则，显示为当前平台的0°方向
##any，任意方向切换

#dir
dir: {string}，设置文字的显示方向。 
##- ltr，文本显示方向，左到右 
##- rtl，文本显示方向，右到左 
##- auto，根据系统的方向显示

#related_applications
related_applications: {Array.<AppInfo>}，用于定义对应的原生应用，类似应用安装横幅的形式去推广、引流。

AppInfo结构： 
- platform: {string}， 应用平台 
- id: {string} 应用id

如安卓可以这么定义：
```
"related_applications": [
    {
        "platform": "play",
        "id": "com.app.xxx"
    }
]
```

#prefer_related_applications
prefer_related_applications:{Boolean}，用于设置只允许用户安装原生应用。
--------------------- 
作者：王乐平 
来源：CSDN 
原文：https://blog.csdn.net/lecepin/article/details/78911091 
版权声明：本文为博主原创文章，转载请附上博文链接！