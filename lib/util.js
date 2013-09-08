/**
@module bee
**/
var path = require('path');
var util = require('util');

var fileutil = require('fileutil');
var minimatch = require('minimatch');
var npm = require('npm');
var async = require('async');

/**
bee的工具类
@class util
@static
@namespace bee
**/
module.exports = {
  
  /**
  将字符串转换成布尔值，如果是1, true, ok, yes, y等字符串则返回true, 否则返回false
  @method toBoolean
  @param {String} b 被判断的字符串
  @static
  **/
  toBoolean: function(b) {
    if (!b) {
      return false;
    }
    if (typeof b == 'boolean') {
      return b;
    }
    if (typeof b != 'string') {
      b = b.toString();
    }
    b = b.toLowerCase();
    if (b == "1" || b == "true" || b == "ok" || b == "yes" || b == 'y') {
      return true;
    }
    return false;
  },
  /**
  根据传递的参数逐个合并
  @method merge
  @static
  @param {Object} ...rest 任意个参数
  @return {Object} 合并后的对象
  @example
        
        var a = { a: 1 }
        var b = { a: 2, b: 2}
        var c = { c: 3}
        var r = this.merge(a, b, c); // { a: 2, b: 2, c: 3}
  **/
  merge: function(s1, s2) {
    var i = 0;
    var len = arguments.length;
    var result = {};
    var key, obj;

    for (; i < len; ++i) {
      obj = arguments[i];
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          result[key] = obj[key];
        }
      }
    }
    return result;
  },

  /**
  根据字典替代字符串中的自定义变量
  @method sustitute
  @static
  @param {String} str 某个string
  @param {Object} dict 字典对象
  @return {String} 使用变量替换过后的新字符串
  @example

      var attutil = att.util;
      util.substitute('hello, ${name}', {name: 'att'}); //hello, att

  **/
  substitute: function(str, dict) {

    if (typeof str !== "string") {
      var v = JSON.stringify(str);
      v = this.substitute(v, dict);
      return JSON.parse(v);
    }

    var getValue = function(key) {
      if (util.isArray(dict)) {
        for (var i = 0, l = dict.length; i < l; i++) {
          if (getValue(dict[i]) !== undefined) {
            return getValue(dict[i]);
          }
        }
        return undefined;
      } else {
        return dict[key];
      }
    };
    str = str.replace(/\$\{([a-zA-Z0-9\-\._]+)\}/g, function(match, key) {
      var s = getValue(key);
      if (s === undefined) {
        return match;
      }
      return s;
    });
    return str;
  },

  /**
  根据options获取文件数组
  @method getFiles
  @static
  @param {Object} options 配置参数
  @return {Array} 文件数组
  @example
        
        var options = {
            dir: 'src',
            files: 'a.js,b.js,c.js'
        }
        var files = this.getFiles(options); // [src/a.js, src/b.js, src/c.js]
  **/
  getFiles: function(options) {
    if (options.file) {
      return [options.file];
    }
    var files = options.files;
    var dir = options.dir;
    if (files) {
      if (!util.isArray(files)) {
        files = files.split(',');
      }
      files.forEach(function(item, index) {
        var p = dir ? (dir + path.sep + item) : item;
        files[index] = p;
      })
    } else {
      files = [];
    }
    var childNodes = options.childNodes;

    childNodes.forEach(function(item) {
      if (item.name == 'fileset') {
        files = files.concat(this.getFileSet(item.value).files);
      } else if (item.name == 'filelist') {
        files = files.concat(this.getFileList(item.value).files);
      } else if (item.name == 'file') {
        var file = item.value.name;
        if (dir) {
          file = dir + path.sep + file;
        }
        files.push(file);
      }
    }.bind(this));

    return files;
  },

  /**
  根据options获取文件数组
  @method getFileSet
  @static
  @param {Object} options 配置参数
  @return {Array} 文件数组
  @example
        
        var options = {
            dir: 'src',
            childNodes: [
              {name: 'include', value: {type: 'glob', value: '*.js'}}
            ]
        }
        var files = this.getFileSet(options); // [src/a.js, src/b.js, src/c.js, ...]
  **/
  getFileSet: function(options) {
    var files = [];
    var dir = options.dir || '.';
    var getList = function(options) {
      var includeList = [];
      var excludeList = [];
      options.childNodes.forEach(function(item) {
        var data = item.value;
        if (item.name == 'include') {
          includeList.push({
            type: data.type,
            value: data.value || data.name,
            matchbase: data.matchbase
          });
        } else if (item.name == 'exclude') {
          excludeList.push({
            type: data.type,
            value: data.value || data.name,
            matchbase: data.matchbase
          });
        } else if (item.name == 'filename') {
          includeList.push({
            type: 'file',
            value: data.value || data.name,
            matchbase: data.matchbase
          });
        } else if (item.name == 'not') {
          var subList = getList(data);
          excludeList = includeList.concat(subList.includeList);
          includeList = excludeList.concat(subList.excludeList);
        }
      });
      return {
        includeList: includeList,
        excludeList: excludeList
      }
    }

    var matchItem = function(item, name) {

      if (!item.type || item.type == 'glob') {
        m = minimatch(name, item.value, {
          matchBase: true,
          dot: true
        });
      } else if (item.type == 'regexp') {
        m = new RegExp(item.value, options.casesensitive ? "i" : undefined);
        m = m.test(name);
      } else if (item.type == 'file') {
        m = path.relative(item.value) == path.relative(name);
      }
      return m;
    }.bind(this);

    var inAndExList = getList(options);
    var includeList = inAndExList.includeList;
    var excludeList = inAndExList.excludeList;

    var matchFunction = function(item) {
      var i, l;
      var name = path.normalize(item.name);
      for (i = 0, l = excludeList.length; i < l; i++) {
        if (matchItem(excludeList[i], name)) {
          return false;
        }
      }
      if (includeList.length == 0) {
        return true;
      }
      for (i = 0, l = includeList.length; i < l; i++) {
        if (matchItem(includeList[i], name)) {
          return true;
        }
      }
    }
    fileutil.each(dir, function(item) {
      return files.push(item.name);
    }, {
      matchFunction: matchFunction,
      preventRecursiveFunction: function(info) {
        return !matchFunction(info)
      }
    });

    return {
      dir: dir,
      files: files
    }
  },

  /**
  根据options获取文件数组
  @method getFileSet
  @static
  @param {Object} options 配置参数
  @return {Array} 文件数组
  @example
        
        var options = {
            dir: 'src',
            childNodes: [
              {name: 'file', value: {name: 'a.js'}},
              {name: 'file', value: {name: 'b.js'}},
              {name: 'file', value: {name: 'c.js'}}
            ]
        }
        var files = this.getFileList(options); // [src/a.js, src/b.js, src/c.js, ...]
  **/
  getFileList: function(options) {
    var files = [];
    var dir = options.dir || '.';
    var childNodes = options.childNodes;
    childNodes.forEach(function(item) {
      if (item.name == 'file' || item.name == 'filename') {
        var file = item.value.name || item.value.value;
        if (dir) {
          file = dir + path.sep + file;
        }
        files.push(path.normalize(file));
      }
    }.bind(this));
    return {
      dir: dir,
      files: files
    };
  },
  
  
  /**
  安装某个插件
  @method install
  @static
  @param {Array} pkg 插件名称
  @param {Function} callback 安装的回调函数
  **/
  install: function(pkg, callback, where, registry){
  
    var self = this;

    var cfg = {
      prefix: where
    }
    if(registry && registry !== true){
      cfg.registry = registry;
    }
    npm.load(cfg, function(e){
      if(e){
        return callback(e);
      }
      if(where){
        return npm.commands.install(where, pkg, callback);
      }else{
        return npm.commands.install(pkg, callback);
      }
    
    });
  },
  
  /**
  卸载某个插件
  @method uninstall
  @static
  @param {String|Array} pkg 插件名称
  @param {Function} callback 卸载后的回调函数
  **/
  uninstall: function(pkg, callback){
    npm.load({
    }, function(e){
      if(e){
        return callback(e);
      }
      npm.commands.uninstall(pkg, callback);
    });
  }
}









