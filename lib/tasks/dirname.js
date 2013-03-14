/**
@module bee
**/

/**
dirname任务
-------------
获得某个路径的dirname

### 用法

    <dirname file='src/myfile.js' property='file-dirname'/>

    <dirname property='file-dirname'>src/myfile.js</dirname>

@class dirname
**/
var path = require('path');

module.exports = function(bee) {

  bee.register('dirname', function(options) {

    var file = options.file || options.value
    var property = options.property;

    if (!file || !property) {
      throw new Error('file and property are required in dirname task.');
    }

    bee.project.setProperty(property, path.dirname(file));
   
  });
}