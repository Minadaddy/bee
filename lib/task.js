/**
@module aida
**/

/**
任务模块
@class task
@namespace aida
**/
var tasks = [];

/**
根据任务名称和模块执行函数注册一个任务
@method register
@static
@param {String} name 任务名称
@param {Function} module 任务的执行函数
**/
exports.register = function(name, module){
  tasks[name] = module;
}

/**
注销一个任务
@method unregister
@static
@param {String} name 任务名称
**/
exports.unregister = function(name){
  delete tasks[name];
}

/**
执行一个任务
@method execute
@static
@param {String} name 任务名称
@param {Object} options 任务的执行参数
@param {Function} callback 任务的执行回调
**/
exports.execute = function(name, options, callback){
  var task = tasks[name];
  if(!task){
    return callback(new Error("task " + name + " was not defined!"));
  }
  if(task.length <= 1){
    var result = task(options);
    if(result && result.error){
      callback(result.error);
    }else{
      callback(null, result);
    }
  }else{
    task(options, callback);
  }
}