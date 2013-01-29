/**
@module bee
**/
var path = require('path');
var util = require('util');

var async = require('async');
var fileutil = require('fileutil');
require('colors');

var beeutil = require('./util');
var task = require('./task');
var Target = require('./Target');
var Project = require('./Project');


var bee = {
  
  /**
  异步辅助工具
  @property async
  @static
  @type async
  @see async
  **/
  async: async,
  
  /**
  文件操作工具
  @property fileutil
  @static
  @type fileutil
  @see fileutil
  **/
  fileutil: fileutil,

  /**
  辅助工具
  @property util
  @static
  @type util
  @see util
  **/
  util: beeutil,
  
  /**
  任务模块
  @property task
  @static
  @type task
  @see task
  **/
  task: task,

  /**
  Target类
  @property Target
  @static
  @type Target
  @see Target
  **/
  Target: Target,

  /**
  Project类
  @property Project
  @static
  @type Project
  @see Project
  **/
  Project: Project,
  
  /**
  注册一个任务
  @method register
  @static
  **/
  register: function(name, module){
    task.register(name, module);
  },
  
  /**
  注销一个任务
  @method unregister
  @static
  **/
  unregister: function(name){
    task.unregister(name);
  },
  
  /**
  根据文件和编码创建一个工程
  @method createProject
  @static
  @return {Project}
  **/
  createProject: function(file, encoding){
    var parser = require('./XMLParser');
    var project = parser.parse(file, encoding);
    return project;
  },
  
  /**
  `LOG`等级
  @property LOG
  @final
  @static
  @type int
  **/
  LOG: 0,

  /**
  `INFO`等级
  @property INFO
  @final
  @static
  @type int
  **/
  INFO: 1,

  /**
  `DEBUG`等级
  @property DEBUG
  @final
  @static
  @type int
  **/
  DEBUG: 2,

  /**
  `WARN`等级
  @property WARN
  @final
  @static
  @type int
  **/
  WARN: 3,

  /**
  `ERROR`等级
  @property ERROR
  @final
  @static
  @type int
  **/
  ERROR: 4,

  /**
  level等级
  @property level
  @static
  @type int
  **/
  level: 2,

  _log: function(level, message){
    var l = this.project ? this.project.level : this.level;
    if(l > level){
       return;
    }
    var cate = ['LOG', 'INFO', 'DEBUG', 'WARN', 'ERROR'];
    var colorMap = ['white', 'cyan', 'green', 'magenta', 'red'];
    var msg = ('[' + cate[level] + '] ' + message)[colorMap[level]];
    util.puts(msg);
  },

  log: function(message){
     this._log(this.LOG, message);
  },

  debug: function(message){
     this._log(this.DEBUG, message);
  },

  info: function(message){
    this._log(this.INFO, message);
  },
  
  warn: function(message){
     this._log(this.WARN, message);
  },

  error: function(message){
    this._log(this.ERROR, message);
  }

}
Object.defineProperty(bee, "project", {
    get : function() { 
       return Project.project;
    },  
    enumerable : true
});


fileutil.each(__dirname + '/tasks', function(item){
    require(path.resolve(item.name))(bee);
});

module.exports = bee;