/**
@module bee
**/

/**
move任务
-------------
移动文件或文件夹

### 用法

<move file='tmp/myfile.js' tofile='build/myfile.js'/>
<move dir='tmp/lib' todir='dest'/>

<move todir='dest'>
  <fileset src='tmp'>
    <exclude value='.svn'/>
  </fileset>
</move>
    

@class move
**/
module.exports = function(bee) {
  
  var path = require('path');

  bee.register('move', function(options) {

    var file = options.file || options.dir;
    var tofile = options.tofile;
    var todir = path.normalize(options.todir);

    if (file) {
      var tofile = options.tofile;
      if(!tofile || !todir){
        return bee.error("the tofile or todir is required in move task.");
      }
      var newname;
      if(tofile){
        todir = path.dirname(tofile);
        newname = path.basename(tofile);
      }
      try{
        bee.file.move(file, todir);
      }catch(err){
        return bee.error(err);
      }
    } else {
      if (!todir) {
        return bee.error("the todir are required in move task.");
      }
      var moveFileset = function(options) {
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
            bee.file.move(item, innerDir);
          } catch (err) {
            bee.error(err);
            return false;
          }
          return true;
        });
      }

      options.childNodes.every(function(item) {
        if (item.name == 'fileset') {
          return moveFileset(item.value);
        }
        return true;
      });

    }
  });
}