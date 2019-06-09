(function (win) {
    var winHeight = $(win).height();
    var winWidth = $(win).width();
    //全局变量
    var isMobile = win.navigator.userAgent.toLowerCase().indexOf("mobile") != -1;
    var mouseUpName = isMobile ? "touchend" : "mouseup";
    var mouseDownName = isMobile ? "touchstart" : "mousedown";
    var mouseMoveName = isMobile ? "touchmove" : "mousemove";
    
    var str2Json = function (str) {
        var re = {};
        if (str) {
            try {
                re = eval('(' + str + ')');
            } catch (e) { re = {}; }
        }
        return re;
    }

    //把对象{"transform-translateX":20,opacity:100}转化为CSS对象{"transform":"translateX(20px)",opacity:1}
    //把样式关键字对象转化为对应的样式语法对象
    var cssObj2CodeObj = function (valObj) {
        var cssObj = {};
        var x, y;
        if (valObj["transform"] != undefined) {
            y = valObj["transform"];
        }
        if (valObj["transform-translateY"] != undefined) {
            y = valObj["transform-translateY"];
        }
        if (valObj["transform-translateX"] != undefined) {
            x = valObj["transform-translateX"];
        }
        var vvv = "";
        if (x != undefined && y != undefined) {
            vvv = " translate(" +x + "px," + y + "px)";
        } else if (y != undefined) {
            vvv = "translateY(" + y + "px)";
        } else if (x != undefined) {
            vvv = "translateX(" + x+ "px)";
        }
        if (vvv != undefined) {
            cssObj["-webkit-transform"] = vvv;
            cssObj["-o-transform"] = vvv;
            cssObj["-moz-transform"] = vvv;
            cssObj["-ms-transform"] = vvv;
            cssObj["transform"] = vvv;
        }
        if (valObj["opacity"]>=0) {
            cssObj["opacity"] = valObj["opacity"] / 100;
        }

       
        return cssObj;
    };
   
    //缓动算法：t当前时间，b开始值，c变化量,d经过多少时间（t-d经过多少次变化）
    var Tween = {
        Linear: function (t, b, c, d) { return c * t / d + b; },
        Quart: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            }
        },
        Back: {
            easeIn: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            },
            easeOut: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },
            easeInOut: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            }
        },
        Bounce: {
            easeIn: function (t, b, c, d) {
                return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
            },
            easeOut: function (t, b, c, d) {
                if ((t /= d) < (1 / 2.75)) {
                    return c * (7.5625 * t * t) + b;
                } else if (t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                } else if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                } else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                }
            },
            easeInOut: function (t, b, c, d) {
                if (t < d / 2) return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
                else return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            }
        }
    };
    //指定时间总长度里值的变化来改变DOM的属性，实现动画，值得改变不是线性的
    //from动画属性开始值，to动画属性结束值,chgnum动画总共多少帧（每帧默认为10毫秒）,chgFn函数（用于改变DOM属性以实现动画），chgnumMS：动画每帧多少毫秒,completeFn动画完成回调函数
    function myAnimate(from, to, chgnum, chgFn, moreOptions) {
        var moreOpts = moreOptions || {};//忘记用var 定义moreOpts导致 完成函数不能正确执行，真悲催**************
        var _chgnumMS = moreOpts.chgnumMS || 10;
        var _stepLen = moreOpts.steo || 1;
        var isOneNumber = typeof from != "object" && typeof to != "object";
        if (isOneNumber) {
            from = parseInt(from); to = parseInt(to);
        }
        var t = 0, tween;

        if (moreOpts.tween) {
            if (moreOpts.tween.indexOf(".") == -1) {
                tween = Tween.Quart[moreOpts.tween];
            } else {
                var tnames = moreOpts.tween.split(".");
                tween = Tween[tnames[0]][tnames[1]];
            }
        }
        if (typeof tween != "function") {
            tween = Tween.Linear;//默认为线性动画
        }

        (function __myAnimate() {

            moreOpts.target._actTimer = window.setTimeout(function () {
                if ((Stage.__isinchanging&&moreOpts.target.name=="Actor")||(moreOpts.target.name=="Actor"&&moreOpts.target.scene.showed==false)) {
                    window.clearTimeout(moreOpts.target._actTimer);
                    moreOpts.target._actTimer = null;
                    return;//特殊处理，如果场景正在隐藏，则不做动画处理
                }
                var vObj = {};
                if (isOneNumber) {
                    vObj.val = Math.ceil(tween(t, from, to - from, chgnum));
                    chgFn(vObj.val);
                } else {
                    var key = "", oneFrom = 0, oneTo = 0;
                    for (var a in from) {
                        key = a.toLocaleString();
                        oneFrom = parseInt(from[key]);
                        oneTo = parseInt(to[key]);
                        vObj[key] = Math.ceil(tween(t, oneFrom, oneTo - oneFrom, chgnum));
                    }
                    chgFn(vObj,to);
                }
                if (t < chgnum) {
                    t += _stepLen;
                    __myAnimate();

                } else {
                	window.clearTimeout(moreOpts.target._actTimer);
                    moreOpts.target._actTimer = null;
                    if (moreOpts.completeFn) {
                        moreOpts.completeFn(moreOpts.target, isOneNumber ? vObj.val : vObj);
                    }
                }

            }, _chgnumMS);
        })();
    }
    
    function ActorBase() {
        //表演路径属性
        //var point = {
        //   dir:'b2t'//默认从底部向上移动，none不做移动处理，b2t,l2r,r2l,t2b
        //    ,top: 0//移动到的距离顶部位置
        //    , left: 0//移动到的距离左边位置
        //    , during: 0//移动持续多少时间，毫秒
        //    , tween: ""//移动缓动动画类型
        //    , delay: 0//开始本次移动前延迟多少毫秒
        //    , opacity: 0//大于0表示 渐显到指定的值,0-100
        //};
    	this.name="Actor";
    	this.pathPoints = [];//用户配置的移动路径节点，每个节点包含top,left opacity delay等信息，辅助cssLines实现轨迹动画Lines，将转化为line两个节点的样式属性
    	this.cssLines = [];//根据用户配置的路径节点渲染过后的轨迹线路，包含开始和结束两个节点，此两个节点记录开始和结束的样式相关信息，用于动画
    	this.lineIndex = 0;//当前正在执行的路径索引
    }
    //演员
    function Actor(wrap, scene) {
        this.scene = scene;
        if (wrap) {
            if (wrap.length) {
                this.actorDiv = wrap;
            } else {
                this.actorDiv = $(wrap);
            }
        }
        ActorBase.call(this);

    }
    Actor.prototype = new ActorBase();

    //原始的锚点转化为运动轨迹直线
    var point2Line = function (pathInit, pathObj) {
        var line = { begin: {}, end: {} };
        if (pathInit.top != pathObj.top && pathObj.top != undefined) {
            line.begin.transform = pathInit.top||0;
            line.end.transform = pathObj.top;
        }
        if (pathInit.left != pathObj.left && pathObj.left != undefined) {
            line.begin["transform-translateX"] = pathInit.left||0;
            line.end["transform-translateX"] = pathObj.left;
        }


        if (pathObj.opacity) {
            line.begin.opacity =pathInit.opacity|| 0;
            line.end.opacity = pathObj.opacity;
        }
        return line;
    };

    //合并轨迹线的节点样式对象到另一个轨迹线节点，
    //用到次方法的目的是：是的每个运动轨迹点都保留上个轨迹结束节点的样式，否则运动可能出现跳跃不连贯。
    var merginLinePointToOther = function (begin,end) {
        for (var k in end) {
            if(!begin[k.toString()]){
                begin[k.toString()] = end[k.toString()];
            }
        }
        return begin;
    };

    Actor.prototype.act = function (lineIndex) {
       
        if (lineIndex == undefined) {
            lineIndex = this.lineIndex;
        }
        if (this.cssLines.length > 0) {
            var beginEnd = this.cssLines[lineIndex];
            var that = this;
            var sceneObj = this.scene;
            var pathObj = this.pathPoints[lineIndex+1];
            var during = pathObj.during || 1000;
            var duringMS = 10;//每次变化间隔10毫秒
            var duringNum = during / duringMS;//总共经过多少次变化
            var tween = pathObj.tween || "easeInOut";

            if (pathObj.delay) {
                var ddd = parseInt(pathObj.delay);
                this._delayTimer = window.setTimeout(function () {
                    if (Stage.__isinchanging || sceneObj.showed == false) {
                        window.clearTimeout(that._delayTimer);
                        that._delayTimer = null; return;
                    }

                    myAnimate(beginEnd.begin, beginEnd.end, duringNum, function (valObj) {

                        that.actorDiv.css(cssObj2CodeObj(valObj));
                        
                    }, {
                        duringMS: duringMS, completeFn: function (actor) {
                            that.lineIndex++;
                            if (actor.cssLines.length > actor.lineIndex) {
                                actor.act(actor.lineIndex);
                            } else {
                                sceneObj.actIndex++;
                                if (sceneObj.actIndex >= sceneObj.actorsNum) {
                                    sceneObj.onacted();
                                }
                            }
                        }, tween: tween, target: that
                    });

                }, ddd);
            } else {
                myAnimate(beginEnd.begin, beginEnd.end, duringNum, function (valObj) {
                    that.actorDiv.css(cssObj2CodeObj(valObj));
                }, {
                    duringMS: duringMS, completeFn: function (actor) {
                        that.lineIndex++;
                        if (actor.cssLines.length > actor.lineIndex) {
                            actor.act(actor.lineIndex);
                        } else {
                            sceneObj.actIndex++;
                            if (sceneObj.actIndex >= sceneObj.actorsNum) {
                                sceneObj.onacted();
                            }
                        }

                    }, tween: tween, target: that
                });
            }

        }

    };
    //场景类基类
    function SceneBase() {
    	this.name="Scene";
        this.acted = false;//场景里的演员全部表演完成
        this.showed = false;//场景已经拉开显示

        this.childs = [];//子场景
        this.actors = [];//某一个场景里所有演员数组
        this.actIndex = -1;//当前待表演的演员索引，这个只在手动按顺序表演时有用
        this.actorsNum = 0;

        this.onbeginshow=function () {
            this.sceneDiv.show();

            this.preAct();
            if (this.childs.length) {
                this.crtChild.preAct();
                //以下代码可使每次显示主场景时，重新显示第一次子场景
                //this.crtChild = this.childs[0];
                //for (var a = 0; a < this.childs.length; a++) {
                //    this.childs[a].sceneDiv.hide();
                //}
                //this.crtChild.sceneDiv.show();
                //this.crtChild.sceneDiv.css(cssObj2CodeObj({ "transform-translateX": 0 }));

            }
        };
       
        this.onshowed=function () {
            this.showed = true;
            if (this.isChild) {
                this.parent.crtChild= this;
            } else {
                this.stage.crtScene = this;
            }
        	
            //场景切换完后执行的业务代码,判断是否由用户操作逐个表演
            if (this.stage.opts.userAct != true) {
            	if (this.opts.react==false&&this.acted==true) {
                    return;//
            	}
            	if (this.childs.length) {
            	    this.crtChild.onshowed();
            	} else {
            	    var actors = this.actors;
            	    if (actors && actors.length) {
            	        this.actIndex = 0;
            	        for (var a = 0; a < actors.length; a++) {
            	            actors[a].act();
            	        }
            	    }
            	}
                
            }
        };
        this.onbeginhide=function () {
        	
        };
        this.onhided=function () {
        	this.showed = false;
            if (this.isLoadScene) {
                this.sceneDiv.remove();
            } else {
            	
                this.sceneDiv.hide();
            }
        };
        //场景里面的演员表演完毕
        this.onacted=function () { 
        	this.acted=true;
        };
        
       
    }

    //场景，场次
    function Scene(wrap,options,stage){
        
        if (typeof wrap == "object") {
            if (wrap.length) {
                this.sceneDiv = wrap;
            } else {
                this.sceneDiv = $(wrap);
            }
        } else {
            this.sceneDiv = $("#" + wrap);
        }
        if (!this.sceneDiv) {
            return;
        }
        this.stage = stage;
        SceneBase.call(this, options);
        var that = this;
        this.opts = $.extend({
        	react:true//是否在现实完场景后重新表演
        	,asynInit:false//是否在现实完场景后异步加载数据，如果TRUE在舞台初始化时不对候场演员做初始化处理（化妆）
        	,swipeChg:true//是否允许滑动切换场景
        	,swipeNext:true//是否下滑显示下一个场景
        	,swipePrev:true//是否上滑显示上一个场景
        	,dir:""//如果是 lr或rl,表示左右动画切换场景
        }, options);
    }
    Scene.prototype = new SceneBase();

    //初始化场景信息和演员的初始数据
    Scene.prototype.init = function () {
    	this.acted=false;
        var actosdiv = this.sceneDiv.find("section");
        var sOff = this.sceneDiv.offset();
        var sceneOffTop = sOff.top;
        var sceneOffLeft = sOff.left;
        this.actorsNum=actosdiv.length;
        this.actIndex=-1;
        var that = this;
        //把用户设置的关于演员的参数（JSON字符串）转化为元素的属性参数，便于动画执行数据获取
        actosdiv.each(function (i) {
           
            var actorDiv = $(this);
            actorDiv.addClass("p-stage-actor");
            //此时读到的信息为用户最初设置的信息（导演设置的演员表演时最终到达什么位置和状态信息）
            var _top = actorDiv.offset().top - sceneOffTop;
            var _left = actorDiv.offset().left - sceneOffLeft;
            var actor = new Actor(actorDiv,that);
            actor.index = i;
            var moreOff = (actorDiv.height() || 50) + 30;//默认偏移顶部的距离，避免演员露出裙摆 :)

            var actInit = {  };
            var initDD = actorDiv.attr("data-init");
            if (initDD) {
                actInit = $.extend(actInit, str2Json(initDD));
            }
            var actPath={dir: "none"};
            var pathDD = actorDiv.attr("data-path");
            if (pathDD) {
            	actPath = $.extend(actPath, str2Json(pathDD));
            }
            if (actInit.top == undefined) {
                if (actPath.dir == "b2t") {
                    if (actInit.offTag != undefined) {
                        actInit.top = _top + actInit.offTag;
                    } else {
                        actInit.top = ($(window).height() + moreOff);
                    }
                }
                if (actPath.dir == "t2b") {
                    if (actInit.offTag != undefined) {
                        actInit.top = _top - actInit.offTag;
                    } else {
                        actInit.top = -moreOff;
                    }
                }
            }
            if (actInit.left == undefined) {
                if (actPath.dir == "l2r") {
                	 if (actInit.offTag != undefined) {
                		 actInit.left =  _left + actInit.offTag;
                     } else {
                    	 actInit.left = -($(window).width() + moreOff);
                     }
                }
                if (actPath.dir == "r2l") {
                	 if (actInit.offTag != undefined) {
                		 actInit.left =_left - actInit.offTag;
                     } else {
                    	 actInit.left = ($(window).width() + moreOff);
                     }
                }
            }
            if (actInit.top == undefined) {
                actInit.top = _top;
            }
            if (actInit.left == undefined) {
                actInit.left = _left;
            }
            actor.pathPoints.push(actInit);//********路径的第一个节点为初始状态

            if (actPath.top == undefined) {
                actPath.top = _top;//演员最终距离左边位置
            }
            if (actPath._left == undefined) {
                actPath.left = _left;//演员的索引值
            }
            actor.pathPoints.push(actPath);//*********根据演员初始位置计算出来的第一个移动路径
            actor.cssLines.push(point2Line(actInit, actPath));
            for (var x = 1; x < 11; x++) {
                var xDD = actorDiv.data("path-" + x);
                if (xDD) {
                    var xPath = str2Json(xDD);
                    if (xPath) {
                        if (!xPath.delay) {
                            xPath.delay = 100;
                        }
                        actor.pathPoints.push(xPath);
                        var newLine = point2Line(actor.pathPoints[actor.pathPoints.length - 2], xPath);
                        newLine.begin = merginLinePointToOther(newLine.begin, actor.cssLines[actor.cssLines.length - 1].end);
                        newLine.end = merginLinePointToOther(newLine.end, actor.cssLines[actor.cssLines.length - 1].end);
                        actor.cssLines.push(newLine);
                    }
                }
                
            }

            that.actors.push(actor);
        });
    };

    //表演准备，演员回到初始位置候场
    Scene.prototype.preAct = function () {

        this.acted = false;
        this.showed = false;
        this.actIndex = -1;//当前待表演的演员索引，这个只在手动按顺序表演时有用
        if (!this.actors || !this.actors.length) {
            return;
        }

        for (var a = 0; a < this.actors.length; a++) {
            var actor = this.actors[a];
            var actInit = actor.pathPoints[0];
            var actPath = actor.pathPoints[1];
            actor.lineIndex = 0;//开始表演或重新表演 需要设置为0
            var _opacity = -1;
            var cssObj = {};

            if (actPath.opacity) {
                _opacity =actInit.opacity||0;
            }

            if (actInit.top != actPath.top) {
                cssObj.transform = actInit.top;
            }
            if (actInit.left != actPath.left) {
                cssObj["transform-translateX"] = actInit.left;
            }
            if (_opacity >= 0) {
                cssObj.opacity = _opacity;
            }
            actor.actorDiv.css(cssObj2CodeObj(cssObj));
            //console.log(actor.cssLines);
        }

    };

    Scene.prototype.next = function () {
        if (this.isChild) {//有parent属性 说明是子场景
            if (this.parent.childs.length - 1 > this.index) {
                var nextScene = this.parent.childs[this.index + 1];
                return nextScene;
            }
        } else {
            if (this.stage.scenes && this.stage.scenes.length - 1 > this.index) {
                var nextScene = this.stage.scenes[this.index + 1];
                return nextScene;
            }
        }
        
        return null;
    };

    Scene.prototype.prev = function () {
        if (this.isChild) {//有parent属性 说明是子场景
            if (this.parent.childs && this.index > 0) {
                var prevScene = this.parent.childs[this.index - 1];
                return prevScene;
            }
        }
        else {
            if (this.stage.scenes && this.index > 0) {
                var prevScene = this.stage.scenes[this.index - 1];
                return prevScene;
            }
        }
       
        return null;
    };
   
    Scene.prototype.show = function (isShowNext) {
    	//这个显示的处理有点绕
    	//显示当前场景时，同时隐藏上一个或下一个场景，由参数isShowNext决定，
    	//isShowNext=true,表示在已经显示的场景基础上获取下个要显示的场景并显示，因此同时隐藏获取到的场景的上一个场景
    	//isShowNext!=true,表示在已经显示的场景基础上获取上个要显示的场景并显示，因此同时隐藏获取到的场景的下一个场景
        if (this.isloadScene) {
            return;
        }
        var tagScene = null;
        if (isShowNext) {
            oldScene = this.prev();
        } else {
            oldScene = this.next();

        } console.log(this);
        if (oldScene == null) {
        	Stage.__isinchanging = false;
            return;
        } 
        Stage.__isinchanging = true;
        var chgLong = winHeight;
        var isLR = this.opts.dir == "lr" || this.opts.dir == "rl";
        if(!isShowNext){
        	isLR = oldScene.opts.dir == "lr" || oldScene.opts.dir == "rl";
        }
        if (isLR) {
            chgLong = winWidth;
            if(isShowNext){
            	this.sceneDiv.css(cssObj2CodeObj({ "transform-translateX": chgLong }));
            }else{
            	this.sceneDiv.css(cssObj2CodeObj({ "transform-translateX": -chgLong }));
            }
        } else {
        	if(isShowNext){
        		this.sceneDiv.css(cssObj2CodeObj({ transform: chgLong }));
        	}else{
        		this.sceneDiv.css(cssObj2CodeObj({ transform: -chgLong }));
        	}
        }

        var tween = this.opts.tween || "easeInOut";
      
        this.onbeginshow(); 
        oldScene.onbeginhide();
        var that = this; 
        myAnimate(0, chgLong, 60, function (val) {
        	if(isShowNext){
        		 if (isLR) {
                     that.sceneDiv.css(cssObj2CodeObj({ "transform-translateX": chgLong-val }));
                     oldScene.sceneDiv.css(cssObj2CodeObj({ "transform-translateX": - val }));
                 } else {
                     that.sceneDiv.css(cssObj2CodeObj({ transform: chgLong - val }));
                     oldScene.sceneDiv.css(cssObj2CodeObj({ transform: - val }));
                 }
        	}else{
        		 if (isLR) {
                     that.sceneDiv.css(cssObj2CodeObj({ "transform-translateX": val-chgLong }));
                     oldScene.sceneDiv.css(cssObj2CodeObj({ "transform-translateX": val }));
                 } else {
                     that.sceneDiv.css(cssObj2CodeObj({ transform: val-chgLong }));
                     oldScene.sceneDiv.css(cssObj2CodeObj({ transform: val }));
                 }
        	}
           

        }, {
            completeFn: function () {
            	Stage.__isinchanging = false;
                that.onshowed();
                oldScene.onhided();
                if(that.stage.opts.sceneChanged){
                	that.stage.opts.sceneChanged(that,oldScene);
                }
                if (isLR) {
                    oldScene.sceneDiv.css(cssObj2CodeObj({ "transform-translateX": 0 }));
                } else {
                    oldScene.sceneDiv.css(cssObj2CodeObj({ transform: 0 }));
                }
            }, tween: tween,target:that
        });
    };

    Scene.prototype.showPrev = function () {
    	 if (Stage.__isinchanging == true||this.opts.swipeChg == false||this.opts.swipePrev == false) {
             return;
    	 }
    	 if (this.crtChild && this.crtChild.index > 0) {
    	     this.crtChild.showPrev(); return;
    	 }
    	var prevS=this.prev();
    	if (prevS && !prevS.isLoadScene) {
    		prevS.show(false);
    	}else{
    		Stage.__isinchanging = false;
    	}
        
    };
    Scene.prototype.showNext = function () {
    	if (Stage.__isinchanging == true||this.opts.swipeChg == false||this.opts.swipeNext == false) {
            return;
    	}
    	if (this.crtChild && this.crtChild.index < this.childs.length - 1) {
    	    this.crtChild.showNext(); return;
    	}


    	var nextS = this.next();
    	
    	if (nextS) {
    		nextS.show(true);
    	}else{
    		Stage.__isinchanging = false;
    	}

    };

    //舞台
    //对象属性：
    //stageDiv:包装元素对象
    //isLoadScene:是否是加载提示场景
    //scenes:场景对象列表数组
    //opts:舞台的配置信息
    //crtScene:0;
    //临时状态静态属性：
    //Stage.__isinchanging:场景正在切换，不允许其他切换
    //Stage.__hadMouseDown=true;//按下了鼠标活手指接触屏幕
	//Stage.moveLength=0; //鼠标移动或手指滑动了多少距离
    function Stage(wrap, options) {
    	this.name="Stage";
    	this.crtScene=null;
        this.stageDiv = null;//包装元素
        var _options = options||{};
        if (wrap) {
            if (typeof wrap == "string") {
                this.stageDiv = $("#" + wrap);
            } else {
                if (wrap.tagName) {
                    this.stageDiv = $(wrap);
                } else if (wrap.length) {
                    this.stageDiv = wrap;
                } else {
                	_options = wrap;
                }
            }
        }
        if (this.stageDiv == null || arguments.length == 0) {
            var _wrapObj = $("div.p-stage-act");
            if (_wrapObj.length > 0) {
                this.stageDiv = _wrapObj;
                if (_wrapObj.length > 1) {
                    this.stageDiv = $(_wrapObj[0]);
                }
            } else {
                console.log("包装元素为空");
                return;
            }

        }
        this.stageDiv.addClass("p-stage-actting");
        this.opts = $.extend({}, _options);//舞台的配置信息

        var $scenes = this.stageDiv.children();

        this.scenes = [];
        var hadUserLoad=true;//用户是否
        for (var a = 0; a < $scenes.length; a++) {
            var $sceneObj = $($scenes[a]);
            $sceneObj.addClass("p-stage-scene");

            var optDD = $sceneObj.attr("data-opt");
            var options = str2Json(optDD);
            var index = a;
            if (a == 0) {
                if (!options.isLoading) {
                    var newLoad = $('<div class="p-stage-scene p-stage-load"><div><a class="p-stage-loading"></a><h1 id="loadingTxt">正在加载......</h1></div></div>');
                    this.stageDiv.prepend(newLoad);
                    newLoad.height(winHeight);
                    newLoad.show();
                    var lodS = new Scene(newLoad);
                    lodS.stage = this;
                    lodS.isLoadScene = true;
                    lodS.index = 0;
                    this.scenes.push(lodS);
                    this.loadScene = lodS;
                    hadUserLoad=false;
                }
            }
            $sceneObj.height(winHeight);
            var newScene = new Scene($sceneObj, options, this);
            newScene.index = hadUserLoad ? a : (a + 1);

            var childsDiv = $sceneObj.find("article");
            if (childsDiv.length > 1) {
                var stageObj = this;
               
                childsDiv.each(function (i) {
                    $(this).addClass("p-stage-scene-chld");
                    
                    var child_optDD = $(this).attr("data-opt");
                    var child_options = str2Json(child_optDD);
                    child_options.dir = "lr";
                    var childScene = new Scene(this, child_options, stageObj);
                    childScene.parent = newScene;
                    childScene.index = i;
                    childScene.isChild = true;
                    if (i == 0) {
                        $(this).addClass("p-stage-scene-chld-show");
                        newScene.crtChild = childScene;
                    }
                    if (child_options.asynInit != true) {
                        childScene.init();
                    }
                    newScene.childs.push(childScene);
                });

            } else {
                if (options.asynInit != true) {
                    newScene.init();
                }
               
            }
            this.scenes.push(newScene);

        }
        var that = this;
        var scrollFunc = function (e) {
            var vvv = e.wheelDelta ? e.wheelDelta / 120 : e.detail / 3;//滚轮滚动方向标志，-1下，1上
            if (vvv < 0) {
                that.crtScene.showNext();

            } else {
                that.crtScene.showPrev();
            }
        };
        var _playMusic=function(musicPlayer){
            try{
                musicPlayer.play();
            }catch(e){
                console.log(e.message);
            }
        };
        var initAudio=function(){
        	/*以下都是音乐播放相关*/
            if (that.opts.musicUrl||that.opts.musicPlayer) {
            	var musicPlayer=null;
            	that.stageDiv.append('<div class="p-stage-music" id="ico_music"></div>');
            	var audioWrap = that.stageDiv.find("div.p-stage-music");
            	if(!that.opts.musicPlayer){
            		audioWrap.append('<audio src="'+that.opts.musicUrl+'" loop></audio>');
            		musicPlayer = audioWrap.find("audio")[0];
            	}else{
            		musicPlayer = that.opts.musicPlayer;
                }
                _playMusic(musicPlayer);
            	musicPlayer._isPaused=false;
            	that.musicPlayer=musicPlayer;
                musicPlayer.addEventListener("pause", function (e) {
                    audioWrap.removeClass("p-stage-music-play");
                    musicPlayer.__playing = false;
                });

                musicPlayer.addEventListener("timeupdate", function (e) {
                    //开始播放后，音乐按钮改变
                    if (!musicPlayer.paused && musicPlayer.currentTime > 1 && !audioWrap.hasClass("p-stage-music-play")) {
                        _playMusic(musicPlayer);
                        audioWrap.addClass("p-stage-music-play");
                        musicPlayer.__playing = true;
                    }
                    if(musicPlayer.currentTime==0){
                    	audioWrap.removeClass("p-stage-music-play");
                    	musicPlayer.__playing = false;
                    }
                });

                audioWrap.bind(mouseDownName, function (e) {
                    if (musicPlayer.__playing != true) {
                        musicPlayer.__playing = true;
                        _playMusic(musicPlayer);
                        musicPlayer._isPaused=false;
                    } else {
                        $(this).removeClass("p-stage-music-play");
                        musicPlayer.__playing = false;
                        musicPlayer.pause();
                        musicPlayer._isPaused=true;
                    }
                    e.preventDefault();
                });

                if (isMobile) {
                    //移动端不能自动播放，当触碰到屏幕 马上播放
                    $(function () {
                        $('body').one('touchend', function (e) {
                            if (musicPlayer.__playing == true || e.target.id == "ico_music") {
                                return;
                            }
                            musicPlayer.__playing = true;
                            //audioWrap.addClass("p-stage-music-play");
                            _playMusic(musicPlayer);
                            musicPlayer._isPaused=false;

                        });
                    });
                }
            }
            /*以上都是音乐播放相关*/
        };
        //表演开始啦，安静！！！
        this.start = function () {
            Stage.__hadMouseDown = false;
            var moveDD = { start: {}, end: {}, moveY: 0, moveX: 0, toTop: true, toRight: true, _canMove: false };
            that.stageDiv[0].addEventListener(mouseMoveName, function (event) {
                if (Stage.__hadMouseDown == false) { return; }
                var e = event;
                if (isMobile) {
                    if (event.targetTouches.length == 1) {
                        e = event.targetTouches[0];
                    } else { return; }

                }
                moveDD.end.x = e.pageX;
                moveDD.end.y = e.pageY;
                var a1 = Math.abs(moveDD.end.y - moveDD.start.y);
                var a2 = Math.abs(moveDD.end.x - moveDD.start.x);
                Stage.moveLength = a1 > a2 ? a1 : a2;
            }, false);
            if (!isMobile) {
                if (document.addEventListener) {
                    document.addEventListener('DOMMouseScroll', scrollFunc, false);
                } else {
                    document.attachEvent('onmousewheel', scrollFunc);
                }
                window.onmousewheel = document.onmousewheel = scrollFunc;
            }

            if (isMobile && that.stageDiv.swipeUp) {
                that.stageDiv[0].addEventListener(mouseDownName, function (event) {
                    Stage.__hadMouseDown = true;
                    Stage.moveLength = 0;
                    var e = event;
                    if (event.targetTouches.length == 1) {
                        e = event.targetTouches[0];
                    } else { return; }

                    moveDD.start.x = e.pageX;
                    moveDD.start.y = e.pageY;

                }, false);
                that.stageDiv.swipeUp(function () {
                    Stage.__hadMouseDown = false;
                    that.crtScene.showNext();
                });
                that.stageDiv.swipeDown(function () {
                    Stage.__hadMouseDown = false;

                    that.crtScene.showPrev();
                });
            } else {
                that.stageDiv[0].addEventListener(mouseDownName, function (event) {
                    Stage.__hadMouseDown = true; Stage.moveLength = 0;
                    var e = event;
                    if (isMobile) {
                        if (event.targetTouches.length == 1) {
                            e = event.targetTouches[0];
                        } else { return; }

                    }
                    moveDD._canMove = true;
                    moveDD.start.x = e.pageX;
                    moveDD.start.y = e.pageY;
                    if (Stage.__isinchanging == true || that.crtScene.opts.swipeChg == false) {
                        return;
                    }
                    if (isMobile) {
                        event.preventDefault();
                    }
                }, false);
                that.stageDiv[0].addEventListener(mouseUpName, function (event) {
                    Stage.__hadMouseDown = false;
                    if (that.crtScene.opts.swipeChg == false) {
                        return;
                    }
                    if (Stage.__isinchanging == true) {
                        return;
                    }
                    var e = event;
                    if (isMobile) {
                        if (event.changedTouches.length == 1) {
                            e = event.changedTouches[0];
                        } else { return; }

                    }

                    moveDD._canMove = false;
                    moveDD.end.x = e.pageX;
                    moveDD.end.y = e.pageY;
                    moveDD.moveX = moveDD.end.x - moveDD.start.x;
                    moveDD.moveY = moveDD.end.y - moveDD.start.y;
                    moveDD.toTop = moveDD.moveY < 0;
                    moveDD.toRight = moveDD.moveY > 0;
                    moveDD.moveX = Math.abs(moveDD.moveX);
                    moveDD.moveY = Math.abs(moveDD.moveY);

                    if (moveDD.moveY > 40) {

                        if (moveDD.toTop) {
                            that.crtScene.showNext();

                        } else {
                            that.crtScene.showPrev();
                        }
                    }

                    if (isMobile) {
                        event.preventDefault();
                    }
                }, false);
            }
            initAudio();
            this.stageDiv.append("<div class='p-stage-navicon'></div>");
            this.loadScene.showNext();
        };
        //start()-end

        this.view = function () {
            this.stageDiv.addClass("p-stage-view");
        };
    }

    win.Stage = Stage;//开放舞台类到全局环境
    //开放一个开始舞台表演的快捷方法到全局对象
    win.stageStart = function (wrap,options) {
        var __=(new Stage(wrap, options));
        __.start();
        return __;
    }
})(this);