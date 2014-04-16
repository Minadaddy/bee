'use strict';
/**
@module bee
**/

/**
available任务
-------------
判断某个文件或某个文件夹是否存在

### 用法


    <available file='myfile.js' property='file-exist'/>

    <available dir='mydir' property='dir-exist'/>

    <available target='file-or-dir' property='target-exist'/>

@class available
**/
module.exports = function(bee) {

  bee.register('available', function(options) {

    //某个文件是否存在
    var file = options.file;

    //某个目录是否存在
    var dir = options.dir;

    //某个文件或目录是否存在
    var target = options.target;

    var property = options.property;

    if ((!file && !dir && !target) || !property) {
      return bee.error('file/dir/target and property are required in available task.');
    }
    var exist;
    if(file){
      exist = bee.file.isFile(file);
    }else if(dir){
      exist = bee.file.isDirectory(dir);
    }else{
      exist = bee.file.exist(target);
    }
    bee.project.setProperty(property, exist);
  });
}