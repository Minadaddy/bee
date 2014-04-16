'use strict';
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

  bee.register('concat', function(options) {
    var streams = [];
    var encoding = options.encoding;

    var sep = options.sep;
    if(!sep || sep.toLowerCase() === 'eol'){
      sep = require('os').EOL;
    }
    var dir = options.dir || "";
    var files = bee.util.getFiles(options);

    var destfile = options.destfile || options.dest;
    if (!destfile) {
      throw new Error('the destfile is required in concat task');
    }
    
    //header, footer;
    var header, footer;
    var EOL = require('os').EOL;
    var trimByOption = function(str, trimleading){
      if(trimleading){
        var trimmed = [];
        str.split(EOL).forEach(function (line) {
          var line = line.replace(/^\s+/, '');
          trimmed.push(line.replace(/^\s+/, ''));
        });
        return trimmed.join(EOL);
      }
      return str;
    }
    options.childNodes.forEach(function(item){
      if(item.name === 'banner' || item.name === 'header'){
        header = trimByOption(item.value.value, bee.util.toBoolean(item.value.trimleading));
      }else if(item.name === 'footer'){
        footer = trimByOption(item.value.value, bee.util.toBoolean(item.value.trimleading));
      }
    });

    bee.log('concat start');

    if(header){
      header = trimByOption(header);
      streams.push(header);
    }
    files.forEach(function(item) {
      if (bee.file.isFile(item)) {
        bee.log(' + ' + item);
        streams.push(bee.file.read(item, encoding));
      }else{
        bee.warn('concat ignore ' + item);
      }
    });
    if(footer){
      footer = trimByOption(footer);
      streams.push(footer);
    }

    bee.file.mkdir(path.dirname(destfile));
    bee.log('concat to ' + destfile);
    bee.file.write(destfile, streams.join(sep), encoding);

  });
}