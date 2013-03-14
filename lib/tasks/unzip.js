/**
@module bee
**/

/**
unzip任务
-------------
解压缩文件

### 用法

    <unzip src='my.zip' dest='my'/>

@class unzip
**/
module.exports = function(bee) {

  var path = require('path');
  var fs = require('fs');
  var fileutil = bee.fileutil;

  bee.register('unzip', function(options) {

    var crc32 = true;
    if (options.crc32 === false) {
      crc32 = options.crc32;
    }
    var src = options.src || options.file;
    var dest = options.dest;
    if(!src || !dest){
      return bee.error('the src and dest options are required in unzip task.');
    }

    var data = fs.readFileSync(src, 'binary');
    var REG_DIR = /\/$/;

    var zip = new require('node-zip')(data, {
      base64: options.base64,
      checkCRC32: crc32
    });

    Object.keys(zip.files).forEach(function(key) {
      if (key.match(REG_DIR)) {
        var dir = path.normalize(dest + '/' + key.replace(REG_DIR, ''));
        fileutil.mkdir(dir);
      } else {
        var filepath = path.normalize(dest + '/' + key);
        fileutil.mkdir(path.dirname(filepath));
        fileutil.write(filepath, zip.files[key].data);
      }
    });
    
  });
}