'use strict';
/**
@module bee
**/

/**
rename任务
-------------
重命名一个文件或文件夹

### 用法

    <rename file='myfile.js' destfile='my-file.js'/>

@class sleep
**/
module.exports = function(bee) {

  bee.register('rename', function(options) {

    var src = options.src || options.file || options.dir;

    var dest = options.dest || options.destfile || options.target;

    if (!src || !dest) {
      return bee.error('the src/dir/file and dest/destfile/target are required in rename task');
    }

    bee.file.rename(src, dest);
  });
}