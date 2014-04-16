'use strict';
/**
@module bee
**/

/**
extname任务
-------------
获得某个路径的extname

### 用法

    <extname file='src/myfile.js' property='file-extname'/>

@class extname
**/
module.exports = function(bee) {
  
  var path = require('path');

  bee.register('extname', function(options) {

    var file = options.file;
    var property = options.property;
    if (!file || !property) {
      return bee.error('file and property are required in extname task');
    }
    bee.project.setProperty(property, path.extname(file));
  });
}