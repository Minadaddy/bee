'use strict';
/**
@module bee
**/

/**
sleep任务
-------------
sleep一段时间

### 用法

    <sleep value='1000'/>
    <sleep>1000</sleep>

@class sleep
**/
module.exports = function(bee) {

  bee.register('sleep', function(options, callback) {
    var value = Number(options.value);
    if(isNaN(value)){
      value = 0;
    }
    setTimeout(callback, value);
  });
}