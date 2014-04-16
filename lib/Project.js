'use strict';
/**
@module bee
**/
var events = require('events');
var util = require('util');
var path = require('path');

var async = require('async');
var semver = require('semver');
var beeutil = require('./util');

/**
代表一个bee工程
@class Project
@namespace bee
**/
var Project = function(options) {
  options = options || {};

  /**
  工程的名称
  @property name
  @type String
  **/
  this.name = options.name;

  /**
  工程的描述
  @property description
  @type String
  **/
  this.description = options.description;
  
  /**
  定义需要全局安装的npm依赖
  @property npms
  @type Array
  **/
  this.npmsGlobal = [];

  /**
  定义的npm依赖
  @property npms
  @type Array
  **/
  this.npms = [];
  
  /**
  定义的插件
  @property plugins
  @type Array
  **/
  this.plugins = [];
  
  /**
  工程的执行路径
  @property basedir
  @type String
  **/
  this.basedir = options.basedir;

  /**
  工程默认执行的任务名称
  @property default
  @type String
  **/
  this['default'] = options['default'];
  
  /**
  工程定义的任务Hash列表
  @property targets
  @type {}
  @protected
  **/
  this.targets = options.targets || {};

  /**
  工程定义的属性列表
  @property properties
  @type {}
  @protected
  **/
  this.properties = options.properties || {};

  /**
  工程定义的log级别
  @property level
  @type int
  @default 1
  **/
  if (options.level !== undefined) {
    this.level = options.level;
  } else {
    this.level = require('./bee').DEBUG;
  }

};

util.inherits(Project, events.EventEmitter);


/**
设置一个属性值
@method setProperty
@param {String} name 属性名称
@param {String|Object} value 属性值
**/
Project.prototype.setProperty = function(name, value) {
  this.properties[name] = value;
};

/**
获取一个属性
@method getProperty
@param {String} name 属性名称
@return {String|Object} 属性的返回值
**/
Project.prototype.getProperty = function(name) {
  return this.properties[name];
};

/**
添加一个任务到Project中
@method addTarget
@param {String} name 任务名称
@param {Function} target 任务对象
**/
Project.prototype.addTarget = function(name, target) {
  this.targets[name] = target;
};

/**
根据任务名称执行某个工程
@method execute
@param {String} name 任务名称
@param {Function} callback 执行完成的回调函数
**/
Project.prototype.execute = function(name, callback) {
  if(Project.project){
    return callback('the project ' + Project.project.name + ' is running.');
  }
  
  this.prepare(function(){
    name = name || this['default'];
    var cwd = process.cwd();
    this.properties.basedir = this.basedir || '.';
    if (this.basedir) {
      process.chdir(this.basedir);
    }
    Project.project = this;
    this.emit('start');
    this.executeTarget(name, function(e, data) {
      process.chdir(cwd);
      callback && callback(e, data);
      this.emit('finish', e, data);
      Project.project = null;
    }.bind(this));
  
  }.bind(this));
};

/**
初始化project，下载npm包，载入plugins
@method prepare
@param {Function} callback 初始化后的回调函数
**/
Project.prototype.prepare = function(callback){
  var bee = require('./bee');
  var loadPlugins = function(){
    this.plugins.forEach(function(item){
      var module;
      try{
        module = require(item);
      }catch(err){
        try{
          module = require('./' + item);
        }catch(err2){
          try{
            module = require(path.join(process.cwd(), this.basedir + '/node_modules/' + item));
          }catch(err3){}
        }
      }
      if(module){
        module(bee);
      }else{
        bee.warn('the module ' + item + ' was not found.');
      }
    }.bind(this));
  }.bind(this);
  
  //global npms
  if(this.npmsGlobal.length){
    var npmsGlobal = [];
    this.npmsGlobal.forEach(function(item){
      console.log("install global npm package: " + item);
      try{
        require(item);
      }catch(err){
        npmsGlobal.push(item);
      }
    });
    this.npmsGlobal = npmsGlobal;
  }

  //local npms;
  if(this.npms.length){
    var tmp = [];
    this.npms.forEach(function(item){
       try{
          if(item.indexOf('@') !== -1){
            var name = item.split('@')[0];
            var json;
            try{
              json = require(name + '/package.json');
            }catch(err11){
              try{
                json = require('./' + name + '/package.json');
              }catch(err12){
                json = require(path.join(process.cwd(), this.basedir + '/node_modules/' + name + '/package.json'));
              }
            }
            var version = json.version;
            var expectVersion = item.split('@')[1];
            if(!semver.satisfies(version, expectVersion)){
              throw 'the version ' + version + ' of ' + name + ' not matched';
            }
          }else{
            require(path.join(process.cwd(), this.basedir + '/node_modules/' + item));
          }
       }catch(err){
          tmp.push(item);
       }
    }.bind(this));
    this.npms = tmp;
  }

  beeutil.install(this.npmsGlobal, function(){
    beeutil.install(this.npms, function(){
      loadPlugins();
      callback();
    }, this.basedir);
  }.bind(this), undefined, undefined, true);

}
/**
格式化配置，将${key}形式的参数解析出来
@method formatProperties
@param {String} value 需要被解析的带有${key}形式的字符串
**/
Project.prototype.formatProperties = function(value) {
  return beeutil.substitute(value, this.properties);
};
/**
根据工程中某个目标名称执行任务集合
@method executeTarget
@private
@param {String} name 任务名称
@param {Function} callback 执行完成的回调函数
**/
Project.prototype.executeTarget = function(name, callback) {
  var target = this.targets[name];
  if (!target) {
    return callback(new Error('The target named ' + name + ' was not defined'));
  }
  var depends = target.depends;
  target.project = this;
  //register events

  target.once('targetStart', function() {
    this.emit('targetStart', target);
  }.bind(this));

  target.on('taskStart', function(item) {
    this.emit('taskEnd', item);
  }.bind(this));

  target.on('taskFinish', function(item, data) {
    this.emit('taskFinish', item, data);
  }.bind(this));

  target.once('targetFinish', function() {
    this.emit('targetFinish', target);
    target.removeAllListeners('taskStart');
    target.removeAllListeners('taskFinish');
  }.bind(this));

  //执行依赖的任务
  async.eachSeries(depends, function(item, itemCallback) {
    this.executeTarget(item, itemCallback);
  }.bind(this), function(err) {
    if (err) {
      return callback(err);
    }
    target.execute(callback);
  }.bind(this));
};

module.exports = Project;