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

  bee.register('node', function(options) {
    var content = options.value;
    var vm = require('vm');
    try{
      vm.runInNewContext(content, { bee: bee});
    }catch(err){
      bee.error(err);
    }
  });
}