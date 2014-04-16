'use strict';
/**
@module bee
**/

/**
get任务
-------------
通过url下载文件

### 用法

    <get url="http://yunos.com"/>

    <get url="http://yunos.com" destfile='index.html'/>

@class get
**/
module.exports = function(bee) {

  var async = bee.async;

  bee.register('get', function(options, callback) {

    var fs = require('fs');
    var path = require('path');
    var request = require('request');

    var dest = options.dest || options.destfile;
    var urls = [];
    var src = options.src || options.url;

    var parseURL = function(url) {
      var pathname = require('url').parse(url).pathname;
      var slashIndex = pathname.lastIndexOf('/');
      if (slashIndex != -1) {
        pathname = pathname.substring(slashIndex + 1);
      }
      return pathname;
    }

    options.childNodes.forEach(function(item) {
      if (item.name == 'url') {
        urls.push(item.value.url);
      }
    });

    var toFile = function(item, dest) {
      var file = parseURL(item);
      if (file === '') {
        file = 'index.html';
      }
      if (dest) {
        file = dest + path.sep + file;
      }
      return path.normalize(file);
    }
    
    /*
    @param {String} src
    @param {String} dest
    @param {Function} callback
    */
    var download = function(src, dest, callback) {

      bee.debug('download ' + src + ' to ' + dest);
      bee.file.mkdir(path.dirname(dest));

      var stream = fs.createWriteStream(dest);
      stream.once('error', function(e, data) {
        bee.warn('download fail: ' + src);
        callback(e);
      });
      stream.once('close', function(e, data) {
        bee.info('download success: ' + src);
        callback()
      });

      request(src).pipe(stream, {
        end: true
      });
    }

    if (src) {
      download(src, (dest ? dest : toFile(src)), callback);
    } else {
      var queue = [];
      async.forEach(urls, function(item, cb) {
        download(item, toFile(item, dest), cb);
      }, callback);
    }


  });

}