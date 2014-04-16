'use strict';
/**
@module bee
**/

/**
loadfile任务
-------------
载入一个文件

### 用法

    <loadfile file='src/lib/myfile.js'/>

    <loadfile file='src/lib/myfile.js' encoding='utf-8'/>

@class loadfile
**/
module.exports = function(bee) {

  bee.register('loadfile', function(options) {

    var property = options.property;
    var file = options.file || options.src;
    var encoding = options.encoding;

    if (!property || !file) {
      return bee.error('the property option and file/src option is required in loadfile task.');
    }

    if (!bee.file.isFile(file)) {
      return bee.error('the file ' + file + ' not found.');
    }

    bee.project.setProperty(property, bee.file.read(file, encoding));

  });
}