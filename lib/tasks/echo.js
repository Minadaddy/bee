'use strict';
/**
@module bee
**/

/**
echo任务
-------------
控制台输出

### 用法

    <echo>the project build successful</echo>

@class echo
**/

module.exports = function(bee) {

  bee.register('echo', function(options) {
    console.log(options.value);
  });

}