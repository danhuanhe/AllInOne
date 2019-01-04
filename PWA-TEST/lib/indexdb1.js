;(function(G){
  if(!window.indexedDB){return;}
  var IDB=window.indexedDB;EvtQ=[];
  var helper={
    add:function(objectStore,newItem){
      objectStore.add(newItem);
    },
    edit:function(objectStore,id,data,back){
        // 新建事务
        //var transaction = db.transaction(storeName, "readwrite");
        // 打开已经存储的数据对象
        //var objectStore = transaction.objectStore(storeName);
        // 获取存储的对应键的存储对象
        var objectStoreRequest = objectStore.get(id);
        // 获取成功后替换当前数据
        objectStoreRequest.onsuccess = function(event) {
            // 当前数据
            var myRecord = objectStoreRequest.result;
            // 遍历替换
            for (var key in data) {
                if (typeof myRecord[key] != 'undefined') {
                    myRecord[key] = data[key];
                }
            }
            // 更新数据库存储数据             
            objectStore.put(myRecord);
            if(typeof back=="function"){
              back(myRecord);
            }
        };
    },
    delete:function(objectStore,id){
      objectStore.delete(id);
    },
    findAll:function(objectStore,back){
      var data=[];
      objectStore.openCursor().onsuccess = function(event) {
         
          var cursor = event.target.result;
          if (cursor) {
              data.push(cursor.value);
              // cursor.value就是数据对象
              // 游标没有遍历完，继续
              cursor.continue();
          } else {
              // 如果全部遍历完毕...
              if(typeof back=="function"){
                back(data);
              }
          }
      };
    }
  };

  function DBRequest(dbName){
      var _this=this,dbRequest,
      _isDBReady=false,
      _k,_version,
      _dbName=dbName;
      _dbevts={
        _run:function(name,args){
          if(typeof this[name]=="function"){
            if(args&&args.length==undefined){
              this[name].apply(this,[args]);
            }else{
              this[name].apply(this,args);
            }
           
          }
        }
      };
      _this.stores={};
     
      this.on=function(name,fn){
        delete _dbevts[name];
        _dbevts[name]=fn;
      };
      var watingDBQ=[];
      var watingDBFNS={
        openStore:function(storeName,type,data,key){
          console.log("01--opendb-"+_version+" to openStore:"+storeName);console.log(IDB);
         dbRequest= IDB.open(_dbName);console.log(dbRequest);
          dbRequest.onsuccess=function(event){
               var db=event.target.result;console.log(db);
               _version=db.version;
               console.log("02--openStore:"+storeName+ " begin in onsuccess");
               try{
                  var _store=db.transaction(storeName,"readwrite").objectStore(storeName);
                  _this.stores[storeName]=_store;
                  console.log("03--openStore:"+storeName+" ok");
                  if(type=="add"){
                    _store.add(data);
                    console.log("04--openStore:"+storeName+" and add item");
                    _dbevts._run("oncomplete",{name:type,store:storeName,data:data});
                  }else if(type=="find"){
                    console.log("04--openStore:"+storeName+" and find");
                      helper.findAll(_store,function(data){
                        _dbevts._run("oncomplete",{name:type,store:storeName,data:data});
                      });
                  }else if(type=="delete"){
                      console.log("04--openStore:"+storeName+" and delete");
                      helper.delete(_store,data,{name:type,store:storeName,data:data});
                      _dbevts._run("oncomplete",{name:type,store:storeName,data:data});
                  }else if(type=="edit"){
                    console.log("04--openStore:"+storeName+" and edit");
                      helper.edit(_store,data.id,data,function(data){
                        _dbevts._run("oncomplete",{name:type,store:storeName,data:data});
                      });
                  }else{
                    _dbevts._run("oncomplete");
                  }
                  db.close();
               }catch(e){
                 console.error(e);
                 db.close();
                 //添加数据时，若存储对象不存在，则新建一个
                 if((data&&type=="add")){
                    console.log("05--openStore:"+storeName+" fail then to create inline");
                    watingDBFNS.createStore.call(_this,storeName,type,data,key||"id");
                 }else{
                  _dbevts._run("oncomplete");
                 }
               }
              
               
          };
        },
        createStore:function(storeName,type,data,key){
            var openv=_version+1;
            console.log("06--opendb-"+openv+" to createStore:"+storeName);
            dbRequest= IDB.open(_dbName,openv);
            dbRequest.onerror=function(event){
              console.error(event);
              //db.close();
            };
            dbRequest.onsuccess=function(event){
              var db=event.target.result;
              _version=db.version;
              db.close();
            };
            dbRequest.onupgradeneeded=function(event){
              console.log("07--createStore:"+storeName+" begin in onupgradeneeded");
              var db=event.target.result;
              _version=db.version;
              if(!storeName&&!key&&!data){return;}
              // 创建一个数据库存储对象
              objectStore = db.createObjectStore(storeName, { 
                  keyPath: key,
                  autoIncrement: true
              });
              // 定义存储对象的数据项
              objectStore.createIndex(key, key, {
                  unique: true    
              });
              delete data[key];
              for(_k in data){
                objectStore.createIndex(_k.toString(),_k.toString());
              }
              //只有添加数据时，创建存储对象后马上插入
              if(type=="find"||(data&&type=="add")){
                objectStore.add(data);
                console.log("08--openStore:"+storeName+" and add item");
                _dbevts._run("oncomplete",{name:"add",store:storeName,data:data});
              }else{
                _dbevts._run("oncomplete");
              }
              _this.stores[storeName]=objectStore;
            };
            
        }
      };
      this.openStore=function(storeName,type,data,key){
        watingDBFNS.openStore.apply(this,[storeName,type,data,key]);
      };
      this.createStore=function(storeName,data,key){
        watingDBFNS.createStore.apply(this,[storeName,0,data,key]);
      };
  }
  var IDBHelper=function(dbName){
      var logDB=new DBRequest(dbName);

      var isRequesting=false;
      var _Watings=[];
      var _this=this;
      _dbhevts={
        _run:function(name,args){
          if(typeof this[name]=="function"){
            if(args&&args.length==undefined){
              this[name].apply(this,[args]);
            }else{
              this[name].apply(this,args);
            }
           
          }
        }
      };

      this.on=function(name,fn){
        delete _dbhevts[name];
        _dbhevts[name]=fn;
      };
      logDB.on("oncomplete",function(event){
          isRequesting=false;
          if(_Watings.length){
            var evt=_Watings.pop();
            _this[evt.name].apply(_this,evt.args);//执行队列里的操作
            if(event&&event.name){
              _dbhevts._run("on"+event.name,event.data);//执行监听事件回调函数，通知用户处理了某个操作并返回操作结果，比如onfind onadd
            }
          }
          console.log(event);
         
      });
      this.add=function(storeName,data){
        if(isRequesting){
            _Watings.push({name:"add",args:[storeName,data]});
            return;
        }
        isRequesting=true;
        logDB.openStore(storeName,"add",data);
        _dbhevts._run("onadd",data);//执行监听事件回调函数，通知用户处理了某个操作
      };

      this.find=function(storeName,where){
          if(isRequesting){
            _Watings.push({name:"find",args:[storeName,where]});
            return;
          }
          isRequesting=true;
          logDB.openStore(storeName,"find",where);
          _dbhevts._run("onfind",data);//执行监听事件回调函数，通知用户处理了某个操作
      };

      this.delete=function(storeName,data){
          if(isRequesting){
            _Watings.push({name:"delete",args:[storeName,data]});
            return;
          }
          isRequesting=true;
          logDB.openStore(storeName,"delete",data);
          _dbhevts._run("ondelete",data);//执行监听事件回调函数，通知用户处理了某个操作
      };

      this.createStore=function(storeName,data,key){
        logDB.createStore(storeName,data,key);
      };
  };

  var LOG=function(){
      var dbName=window.location.pathname.length>1?window.location.pathname:"root";
      // var stores=[{
      //   name:"tasklogs",
      //   key:"id",
      //   columns:{
      //     module:"",user:"",time:"",oprname:"",name:"",data:"",note:""
      //   }
      // }];

      var dbhelper=new IDBHelper(dbName);
      
      dbhelper.on("onadd",function(data){
        console.log(data);
      });
      dbhelper.on("onfind",function(data){
        console.log(data);
      });
      dbhelper.on("ondelete",function(data){
        console.log(data);
      });
      this.addLog=function(data){
        dbhelper.add("testlog",data);
        //dbhelper.add("testlog1",data);
        //this.findLog();
      };

      this.findLog=function(data){
        dbhelper.find("testlog",{});
        dbhelper.find("testlog1",{});
      };

      this.deleteLog=function(data){
        dbhelper.delete("testlog",data);
      };
      this.createStore=function(storeName,data,key){
        dbhelper.createStore(storeName,data,key);
      };
     

  };
  G.ilog= new LOG();
})(window);