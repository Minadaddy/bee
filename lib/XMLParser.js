/**
@module bee
**/
var fs = require('fs');
var util = require('util');
var path = require('path');

var bee = require('./bee');
var task = require('./task');
var Target = require('./Target');
var Project = require('./Project');
var beeutil = require('./util');
/*
@class XMLParser
@internal
@static
*/

/*
解析xml配置文件，生成一个Project
@method parse
@param {String} file xml配置文件
@param {String} encoding 编码
@static
@return {Project} 
*/
exports.parse = function(file, encoding) {

  var jsxml = require('node-jsxml');
  var xml = new jsxml.XML(fs.readFileSync(file, encoding || 'utf-8'));

  //xml util
  var xu = {
    /*
    获取xml节点的文本
    */
    text: function(node) {
      return node.text().toString();
    },
    /*
    获取xml节点的属性
    */
    attr: function(node, name) {
      return node.attribute(name).toString();
    },
    /*
    先从文本获取值，如果没有，则从指定的属性获取值
    */
    textOrAttr: function(node, name) {
      return this.text(node) || this.attr(node, name);
    },
    /*
    先从某个子节点的文本获取值，如果没有，则从指定的属性获取值
    */
    childOrAttr: function(node, name) {
      return this.textOrAttr(node.child(name), name);
    },
    /*
    xml转换成json
    */
    xml2json: function(xml) {
      var obj = {
        childNodes: []
      };
      xml.attributes("*").each(function(attr) {
        obj[attr.localName()] = attr.toString();
      });
      if (xml.hasComplexContent()) {

        xml.children().each(function(child) {
          obj.childNodes.push({
            name: child.localName(),
            value: xu.xml2json(child)
          })
        });
      } else {
        if (!obj.value) {
          obj.value = this.text(xml);
        }
      }
      return obj;
    }
  }

  var basedir = xu.attr(xml, 'basedir') || '.';
  basedir = path.normalize(path.dirname(file) + path.sep + basedir);

  var level = xu.attr(xml, 'level').toLowerCase() || 'debug';
  var levelMap = ['log', 'info', 'debug', 'warn', 'error'];
  level = levelMap.indexOf(level);
  level = level == -1 ? 2 : level;
  //初始化project
  var project = new Project({
    name: xu.attr(xml, 'name'),
    description: xu.childOrAttr(xml, 'description'),
    basedir: basedir,
    'default': xu.attr(xml, 'build') || 'build',
    level: level
  });


  //解析property
  var properties = {};
  xml.child('property').each(function(item) {
    var name = xu.attr(item, 'name');
    var value = xu.textOrAttr(item, 'value');
    var file = xu.attr(item, 'file');
    if (file) {
      file = path.resolve(basedir + path.sep + file);
      var charset = xu.attr(item, 'charset') || 'utf-8';
      var content = fs.readFileSync(file, charset);
      var obj = require("node-properties-parser").parse(content);
      for (var i in obj) {
        properties[i] = obj[i];
      }
    } else {
      properties[name] = value;
    }
  });

  //替换变量中的变量
  Object.keys(properties).forEach(function(p) {
    project.setProperty(p, beeutil.substitute(properties[p], properties));
  });
  
  
  //安装依赖的npm包
  xml.child('npm').each(function(item){
    var name = xu.attr(item, 'name') || xu.text(item);
    name = name.split(',');
    name.forEach(function(item, index){
      name[index] = item.trim();
    });
    project.npms = project.npms.concat(name);
  });
  
  //解析taskdef
  xml.child('taskdef').each(function(item) {
    var module;
    var npmname = xu.attr(item, 'npm');
    var file = xu.attr(item, 'file');
    if(npmname){
      project.npms = project.npms.concat(npmname);
      module = npmname;
    }else if(file){
      module = path.resolve(basedir + path.sep + xu.attr(item, 'file'));
    }
    if(module){
      project.plugins = project.plugins.concat(module);
    }
    try {
      //require(module)(bee);
    } catch (err) {}
  });

  //解析target
  var targets = {};
  xml.child('target').each(function(item) {
    var options = {
      name: xu.attr(item, 'name'),
      tasks: []
    };
    var depends = xu.attr(item, 'depends');
    if (depends) {
      options.depends = depends.split(',');
    }
    item.children().each(function(child) {
      var json = xu.xml2json(child);
      options.tasks.push([child.localName(), json]);
    })

    targets[options.name] = options;
  });

  //添加target
  Object.keys(targets).forEach(function(name) {

    var tasks = targets[name].tasks;
    var depends = targets[name].depends;
    var target = new Target(name);
    if (depends) {
      target.depends = depends;
    }

    tasks.forEach(function(value) {
      target.addTask(value[0], value[1]);
    });

    project.addTarget(name, target);
  });

  return project;
}