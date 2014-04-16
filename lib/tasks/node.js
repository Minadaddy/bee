'use strict';
/**
@module bee
**/

/**
node任务
-------------
用node环境执行某段脚本

### 用法

    <node>
    //具有bee对象
    console.log(bee);
    console.log("hello");
    </node>

@class node
**/  
module.exports = function(bee) {
  
  var path = require('path');

  bee.register('node', function(options) {
    var content = options.value;
    var vm = require('vm');
    var Module = require('module');
    
    var filename = path.join(process.cwd(), 'eval.js');
    var mod = new Module(filename);

    try{
      vm.runInNewContext(content, {
        console: console,
        require: function(p){
          return mod.require(p);
        },
        __dirname: path.dirname(filename), 
        __filename: filename,
        process: process,
        setTimeout: setTimeout,
        clearTimeout: clearTimeout,
        setInterval: setInterval,
        clearInterval: clearInterval,
        setImmediate: setImmediate,
        clearImmediate: clearImmediate,
        bee: bee
      });
    }catch(err){
      bee.error(err);
    }
  });
}