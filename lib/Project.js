/**
@module bee
**/
var events = require('events');
var util = require('util');

var async = require('async');
var beeutil = require('./util');
var bee = require('./bee');
/**
代表一个bee工程
@class Project
@namespace bee.Project
**/
var Project = function(options){
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
  if(options.level !== undefined){
    this.level = options.level;
  }else{
    this.level = bee.DEBUG;
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
  name = name || this['default'];
  var cwd = process.cwd();
  if(this.basedir){
    process.chdir(this.basedir);
  }
  Project.project = this;
  this.emit('start');
  this.executeTarget(name, function(e, data){
    process.chdir(cwd);
    callback && callback(e, data);
    this.emit('finish', e, data);
    Project.project = null;
  }.bind(this));
};

Project.prototype.formatProperties = function(v){
  return beeutil.substitute(v, this.properties);
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
  if(!target){
    return callback(new Error('The target named ' + name + ' was not defined'));
  }
  var depends = target.depends;
  target.project = this;
  //register events

  target.once('targetStart', function(){
    this.emit('targetStart', target);
  }.bind(this));

  target.on('taskStart', function(item){
    this.emit('taskEnd', item);
  }.bind(this));

  target.on('taskFinish', function(item, data){
    this.emit('taskFinish', item, data);
  }.bind(this));

  target.once('targetFinish', function(){
    this.emit('targetFinish', target);
    target.removeAllListeners('taskStart');
    target.removeAllListeners('taskFinish');
  }.bind(this));

  //执行依赖的任务
  async.forEachSeries(depends, function(item, itemCallback){
    this.executeTarget(item, itemCallback);
  }.bind(this), function(err){
    if(err){
        return callback(err);
    }
    target.execute(callback);
  }.bind(this));
};

module.exports = Project;