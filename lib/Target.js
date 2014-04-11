/**
@module bee
**/
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var async = require('async');

var task = require('./task');

/**
Target类表示一个bee任务集合
    
    var bee = require('bee');
    var Target = bee.Target;
    var target = new Target('default');
    target.addTask('concat', {
      files: ['jquery.js', 'underscore.js', 'yepnope.js', 'app.js'],
      dest: 'combo.js'
    });
    target.addTask('minify', {
      src: 'combo.js',
      dest: 'combo.min.js'
    });
    target.addTask('minify', {
      src: 'icon.png',
      dest: 'icon.png'
    });
    target.addTask('combo', {
      files: ['reset.css', 'common.css', 'color.css', 'app.css']
      dest: 'combo.css'
    });
    target.addTask('datauri', {
      src: 'combo.css',
      dest: 'combo.datauri.css'
    });
    target.addTask('minify', {
      src: 'combo.datauri.css',
      dest: 'combo.min.css'
    });
    target.execute(function(e, data){
      console.log('target completed.')
    });


@class Target
@extend EventEmitter
@namespace bee
**/
var Target = function(name, options) {

  /**
  @property name
  @type String
  **/
  this.name = name;
  /**
  @property depends
  @type Array
  **/
  this.depends = [];

  /**
  @property tasks
  @type Array
  **/
  this.tasks = [];
};

util.inherits(Target, EventEmitter);

/**
添加一个任务
@method addTask
@param {String} name 命令的名称
@param {Object} options 命令接受的配置参数
**/
Target.prototype.addTask = function(name, options) {
  this.tasks.push({
    name: name,
    options: options
  });
};

/**
执行该Target
@method execute
@param {Function} callback
**/
Target.prototype.execute = function(callback) {

  /**
  目标开始执行
  @event targetStart
  **/
  this.emit('targetStart');


  //执行依赖的任务
  async.eachSeries(this.tasks, function(item, itemCallback) {
    /**
    目标中的任务开始执行
    @event taskStart
    **/
    this.emit('taskStart', item);

    //任务执行过程前，替换变量。因为变量可能是运行过程中产生的。对于任务，可以通过设置ignoreBeeProperty为false来阻止变量替换。
    if (this.project && item.options.ignoreBeeProperty !== 'false') {
      item.options = this.project.formatProperties(item.options);
    }

    task.execute(item.name, item.options, function(e, data) {

      var completed = function(e, data) {
        /**
        目标中的任务执行完毕
        @event taskFinish
        **/
        if(!e){
          this.emit('taskFinish', item, data);
        }

        itemCallback(e, data);

      }.bind(this);

      //任务执行过程中可能产生property
      if (data && this.project) {
        var prop = data.setProperty;
        var executeTarget = data.executeTarget;
        if (prop) {
          this.project.setProperty(prop.name, prop.value);
        }
        if (executeTarget) {
          this.project.executeTarget(executeTarget.name, function() {
            completed(e, data);
          });
        } else {
          return completed(e, data);
        }
      } else {
        completed(e, data);
      }

    }.bind(this));

  }.bind(this), function(e, data) {

    /**
    目标中执行完毕
    @event targetFinish
    **/
    if(!e){
      this.emit('targetFinish', data);
    }

    callback(e, data);

  }.bind(this));



};

module.exports = Target;