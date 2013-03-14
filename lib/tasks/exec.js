/**
@module bee
**/

/**
exec任务
-------------
exec方式执行命令

### 用法

    <exec value='adb logcat *:D'/>
    <exec>node -v</exec>

@class exec
**/
module.exports = function(bee) {

  bee.register('exec', function(options, callback) {

    var exec = require('child_process').exec;

    exec(options.value, callback);

  });
}