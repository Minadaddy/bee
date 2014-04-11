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

  bee.register('delete', function(options) {

    var file = options.file || options.dir || options.target;

    if (file) {
      bee.log('delete: ' + file);
      bee.file.delete(file);
    } else {
      var files = bee.util.getFiles(options);
      files.forEach(function(item) {
        bee.log('delete: ' + item);
        bee.file.delete(item);
      });
    }

  });
}