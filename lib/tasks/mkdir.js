/**
@module bee
**/

/**
mkdir任务
-------------
创建文件夹

### 用法

    <mkdir dir='src/lib'/>

@class mkdir
**/
module.exports = function(bee) {

  bee.register('mkdir', function(options) {
    if(!options.dir){
      return bee.error('the dir options is required in mkdir task.');
    }
    bee.file.mkdir(options.dir);
  });
}