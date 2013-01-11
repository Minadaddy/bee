/**
@module aida
**/
var path = require('path');
var util = require('util');

var async = require('async');
var fileutil = require('fileutil');

var aidautil = require('./util');
var task = require('./task');
var Target = require('./Target');
var Project = require('./Project');


var aida = {
  
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
  util: aidautil,
  
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
  }
}

fileutil.each(__dirname + '/tasks', function(item){
    require(path.resolve(item.name))(aida);
});

module.exports = aida;