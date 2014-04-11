/**
@module bee
**/

/**
touch任务
-------------
touch一段时间

### 用法
  
    <touch file='readme.md'/>

    <touch file='readme.txt'>README</touch>

@class touch
**/
module.exports = function(bee) {

  bee.register('touch', function(options) {

    if(options.value == undefined){
      options.value = '';
    }

    bee.file.touch(options.file, options.permission, options.value);

  });
}