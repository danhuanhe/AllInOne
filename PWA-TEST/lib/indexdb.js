function IndexDB(dbname,version){

	
}

IndexDB.prototype.dbVersion=function(dbName,version){
	var vvv=localStorage.getItem("indexdb_db_verson");
	if(!vvv){
		vvv={};
		if(version){
			vvv[dbName]=version;
			localStorage.setItem("indexdb_db_verson",JSON.stringify(vvv));
	    }else{
	    	vvv[dbName]=1;
	    	localStorage.setItem("indexdb_db_verson",JSON.stringify(vvv));
	    	return 1;
	    }
	}else{
		vvv=JSON.parse(vvv);
		if(version){
			vvv[dbName]=version;
			localStorage.setItem("indexdb_db_verson",JSON.stringify(vvv));
	    }else{
	    	return vvv[dbName];
	    }
	}
	
};
/*
 dbName:[string]打开的数据库名
 updateStructure:[bool]是否需要更新数据库架构
 * */
IndexDB.prototype.openDB=function(dbName,updateStructure){
	var openv=this.dbVersion(dbName);//获取版本号
	if(updateStructure){
		openv+=1;
		this.dbVersion(dbName,openv);
	}
	 var dbRequest= window.indexedDB.open(dbName,openv);
     return new Promise(function(resolve, reject){
     	var _this=this;
    	dbRequest.onerror=function(event){
	      console.error(event);
	      reject(event);
	    };
	    dbRequest.onsuccess=function(event){
	      var db=event.target.result;console.log("onsuccess",db);
	       //db.close();
	       _this.db=db;
	       if(!updateStructure){
	    	 	resolve(db);
	    	}
	    };
	    dbRequest.onupgradeneeded=function(event){
	    	 var db=event.target.result;console.log("onupgradeneeded",db);
	    	 _this.db=db;
	    	 if(updateStructure){
	    	 	resolve(db);
	    	 }
             
	    }
    }.bind(this));
};

IndexDB.prototype.openStore=function(dbInfo,storeName){
	var _dbName="";
	var _updateStructure=false;
	if(typeof dbName=="object"){
		_dbName=dbInfo.name;
		_updateStructure=dbInfo.update;
	}else{
		_dbName=dbInfo;
	}
	if(this.db){
		this.db.close();
	}
    return new Promise(function(resolve, reject){
    	var _this=this;
     	this.openDB(_dbName,_updateStructure).then(function(db){
     		  try{
				  var objectStore=db.transaction(storeName,"readwrite").objectStore(storeName);
				  if(objectStore){
				  	 resolve(objectStore);
				  }
		          
	          }catch(err){
			     db.close();
			     reject(err);
			  };
	    });
    	
    }.bind(this));
};

IndexDB.prototype.createStores=function(dbName,stores){
	var _this=this;
	if(_this.db){
		_this.db.close();
	}
    return new Promise(function(resolve, reject){
     	this.openDB(dbName,true).then(function(db){
     		  try{
     		  	 var objectStore=null;
     		  	 var storeName,obj,key;
     		  	 for(var a=0;a<stores.length;a++){
     		  	 	storeName=stores[a].storeName;
     		  	 	obj=stores[a].obj;
     		  	 	key=stores[a].key;
	     		  	 if (!db.objectStoreNames.contains(storeName)) {
		     		  	 // 创建一个数据库存储对象
				          var objectStore = db.createObjectStore(storeName, { 
				              keyPath: key,
				              autoIncrement: true
				          });
				          for(_k in obj){
				            objectStore.createIndex(_k.toString(),_k.toString());
				          }
			          }
			         
     		  	 }
		         resolve(stores);
     		  }catch(err){
     		  	  _this.db.close();
			      reject(err);
			  };
			  
	    });
    	
    }.bind(this));
};

IndexDB.prototype.createStore=function(dbName,storeName,obj,key){
	var _this=this;
	if(_this.db){
		_this.db.close();
	}
    return new Promise(function(resolve, reject){
     	this.openDB(dbName,true).then(function(db){
     		  try{
     		  	 var objectStore=null;
     		  	 if (!db.objectStoreNames.contains(storeName)) {
	     		  	 // 创建一个数据库存储对象
			          var objectStore = db.createObjectStore(storeName, { 
			              keyPath: key,
			              autoIncrement: true
			          });
			          for(_k in obj){
			            objectStore.createIndex(_k.toString(),_k.toString());
			          }
		          }
		         resolve(objectStore);
     		  }catch(err){
     		  	  _this.db.close();
			      reject(err);
			  };
			  
	    });
    	
    }.bind(this));
};


IndexDB.prototype.addRecord=function(dbName,storeName,data){
	var _this=this;
    this.openStore(dbName,storeName).then(store=>{
    	store.add(data);
    	_this.db.close();
    });
};
window.IDB=new IndexDB();
