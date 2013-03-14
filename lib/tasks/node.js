/**
@module bee
**/

/**
node任务
-------------
用node环境执行某个文件

### 用法

    <node value='node.js'/>

    <node file='node.js'/>

    <node>node.js</node>

@class exec
**/  
module.exports = function(bee) {

  bee.register('node', function(options, callback) {
    var file = options.value || options.file;
    var spawn = require('child_process').spawn;
    spawn('node', [file], callback);
  });
}