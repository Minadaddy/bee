/**
@module bee
**/

/**
move任务
-------------
移动文件或文件夹

### 用法

    <move dir='src' todir='bin/lib'/>

@class move
**/
module.exports = function(bee) {
  
  var path = require('path');
  var fileutil = bee.fileutil;
  var util = bee.util;

  bee.register('move', function(options) {

    var file = options.file || options.dir || options.src;
    var todir = path.normalize(options.todir);

    if (file) {
      fileutil.move(file, todir);

    } else {

      var filesetNode = options.childNodes[0];

      if (filesetNode.name == 'fileset') {
        var data = filesetNode.value;
        var dir = data.dir;
        var files = util.getFileSet(data);
        files.forEach(function(item) {
          var relativeDir = path.dirname(path.relative(dir, item));
          var innerDir = path.normalize(todir + path.sep + relativeDir);
          fileutil.move(item, innerDir);
        });
      }
    }
  });
}