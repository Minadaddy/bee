/**
@module bee
**/

/**
concat任务
-------------
合并多个文件

### 用法

    <concat file='src/file1.js,src/file2.js' destfile='dest/combo.js'/>

    <concat dir='src' file='file1.js,file2.js' destfile='dest/combo.js'/>


@class concat
**/
module.exports = function(bee) {

  var path = require('path');
  var util = bee.util;
  var fileutil = bee.fileutil;

  bee.register('concat', function(options) {
    var streams = [];
    var encoding = options.encoding;

    var sep = options.sep || "\r\n";
    var dir = options.dir || "";

    var files = util.getFiles(options);

    var destfile = options.destfile || options.dest;
    if (!destfile) {
      throw new Error('the destfile is required in concat task');
    }

    bee.log('concat start');
    files.forEach(function(item) {
      if (fileutil.isFile(item)) {
        bee.log(' + ' + item);
        streams.push(fileutil.read(item, encoding));
      }
    });

    fileutil.mkdir(path.dirname(destfile));
    bee.log('concat to ' + destfile);
    fileutil.write(destfile, streams.join(sep), encoding);

  });
}