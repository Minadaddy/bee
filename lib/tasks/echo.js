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
var util = require('util');

module.exports = function(bee) {

  bee.register('echo', function(options) {
    util.puts(options.value);
  });

}