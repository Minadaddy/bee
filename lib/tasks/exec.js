'use strict';
/**
@module bee
**/

/**
exec任务
-------------
exec方式执行命令

### 用法

    <exec value='adb logcat *:D'/>
    <exec stdout="true">node -v</exec>

@class exec
**/
module.exports = function(bee) {

  bee.register('exec', function(options, callback) {

    var exec = require('child_process').exec;

    exec(options.value, function(err, stdout, stderr){
      if(options.stdout){
        console.log(stdout.toString());
      }
      if(options.stderr){
        console.log(stderr.toString());
      }
      if(options.error === 'ignore'){
        return callback();
      }
      callback(err);
    });

  });
}