/**
@module bee
**/

/**
basename任务
-------------
获得某个路径的basename

### 用法

    <basename file='src/myfile.js' property='file-basename'/>

@class basename
**/
var path = require('path');

module.exports = function(bee) {

  bee.register('basename', function(options) {

    var file = options.file;

    var property = options.property;

    if (!file || !property) {
      return bee.error('file and property are required in basename task.');
    }

    bee.project.setProperty(property, path.basename(file));
  });
}