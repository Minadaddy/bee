/**
@module bee
**/

/**
zip任务
-------------
压缩文件

### 用法

    <zip basedir='.' destfile='my.zip'>
      <fileset dir='.'>
        <exclude value='.svn'/>
      </fileset>
    <zip>

@class zip
**/
module.exports = function(bee) {

  var path = require('path');
  var fileutil = bee.fileutil;
  var util = bee.util;

  bee.register('zip', function(options, callback) {

    var zip = new require('node-zip')();
    var fs = require('fs');
    var destfile = options.destfile || options.dest;
    var files = util.getFiles(options);

    if (!destfile) {
      return bee.error('the destfile is required in zip task');
      callback();
    }

    bee.debug('create ' + destfile);

    files.forEach(function(item) {

      var relativeDir = path.dirname(path.relative(options.basedir, item));
      var name = path.join(relativeDir, path.basename(item));
      //使用反斜杠
      name = name.replace(/\\/g, '/');
      if (fileutil.isFile(item)) {
        bee.log('add file ' + name);
        zip.file(name, fs.readFileSync(item, 'base64'), {
          base64: true
        });
      } else {
        bee.log('add folder ' + name);
        zip.folder(name);
      }
    });

    var compression = options.compression || 'DEFLATE';
    var base64 = false;
    if (options.base64 === true) {
      base64 = true;
    }

    var data = zip.generate({
      base64: base64,
      compression: compression
    });
    fs.writeFile(options.destfile, data, 'binary', callback);
  });
}