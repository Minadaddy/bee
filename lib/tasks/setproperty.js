'use strict';
/**
@module bee
**/

/**
setproperty任务
-------------
设置一个变量

### 用法

    <setproperty name="path" value='path/ofthis.txt'/>

@class sleep
**/
module.exports = function(bee) {

  bee.register('setproperty', function(options) {

    var name = options.name;
    var value = options.value;

    if (name === undefined || value === undefined) {
      return bee.error('the name and value are required in setproperty task');
    }

    bee.project.setProperty(name, value);
  });
}