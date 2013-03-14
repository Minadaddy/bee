/**
@module bee
**/

/**
copy任务
-------------
删除文件或文件夹

### 用法

    <delete file='src/myfile.js'/>
    <delete dir='src/lib'/>
    <delete target='src/lib'/>

    <delete>
      <fileset dir="src">
        <exclude value='.svn'/>
      </fileset>
    </delete>

@class delete
**/
module.exports = function(bee) {

  var fileutil = bee.fileutil;
  var util = bee.util;

  bee.register('delete', function(options) {

    var file = options.file || options.dir || options.target;

    if (file) {
      bee.log('delete: ' + file);
      fileutil.delete(file);
    } else {
      var files = util.getFiles(options);
      files.forEach(function(item) {
        bee.log('delete: ' + item);
        fileutil.delete(item);
      });
    }

  });
}