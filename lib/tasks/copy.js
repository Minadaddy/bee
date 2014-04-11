/**
@module bee
**/

/**
copy任务
-------------
复制文件或文件夹

### 用法

    <copy file='src/myfile.js' tofile='build/myfile.js'/>
    <copy dir='src/lib' todir='dest'/>
    
    <copy todir='dest'>
      <fileset src='src'>
        <exclude file='.svn'/>
      </fileset>
    </copy>

@class copy
**/
var path = require('path');

module.exports = function(bee) {

  bee.register('copy', function(options) {

    var file = options.file || options.dir;
    var todir = options.todir;

    if (file) {
      var tofile = options.tofile;
      if(!tofile || !todir){
        return bee.error("the tofile or todir is required in copy task.");
      }
      var newname;
      if(tofile){
        todir = path.dirname(tofile);
        newname = path.basename(tofile);
      }
      try {
        bee.file.copy(file, todir, newname);
      } catch (err) {
        return bee.error(err);
      }
    } else {
      if (!todir) {
        return bee.error("the todir are required in copy task.");
      }
      var copyFileset = function(options) {
        var fileset = bee.util.getFileSet(options);
        var dir = fileset.dir;
        var files = fileset.files;

        return files.every(function(item) {

          var relativeDir = path.dirname(path.relative(dir, item));
          var innerDir = path.normalize(todir + path.sep + relativeDir);

          if (bee.file.isDirectory(item)) {
            bee.file.mkdir(item);
            return true;
          }
          try {
            bee.file.copy(item, innerDir);
          } catch (err) {
            bee.error(err);
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