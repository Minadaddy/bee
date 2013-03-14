/**
@module bee
**/

/**
copy任务
-------------
复制文件或文件夹

### 用法

    <copy file='src/myfile.js' todir='dest'/>
    <copy dir='src/lib' todir='dest'/>

@class copy
**/
var path = require('path');

module.exports = function(bee) {

  var fileutil = bee.fileutil;
  var aidautil = bee.util;

  bee.register('copy', function(options) {

    var file = options.file || options.dir;
    var todir = options.todir;

    if (!todir) {
      return bee.error("the file/dir and todir are required in copy task.");
    }

    if (file) {
      try {
        fileutil.copy(file, todir);
      } catch (err) {
        return bee.error(err);
      }
    } else {

      var copyFileset = function(options) {
        var fileset = aidautil.getFileSet(options);
        var dir = fileset.dir;
        var files = fileset.files;

        return files.every(function(item) {

          var relativeDir = path.dirname(path.relative(dir, item));
          var innerDir = path.normalize(todir + path.sep + relativeDir);

          if (fileutil.isDirectory(item)) {
            fileutil.mkdir(item);
            return true;
          }
          try {
            fileutil.copy(item, innerDir);
          } catch (err) {
            bee.error(error);
            return false;
          }
          return true;
        });
      }

      options.childNodes.every(function(item) {
        if (item.name == 'fileset') {
          return copyFileset(item.value);
        }
        return true;
      });
    }

  });
}