module.exports = function(aida){

  var fileutil = aida.fileutil;
  var async = aida.async;
  
  aida.register('get', function(options, callback){

    var fs = require('fs');
    var path = require('path');
    var request = require('request');
    
    var dest = options.dest || options.destfile;
    var urls = [];
    var src = options.src || options.url;

    var parseURL = function(url){
      var pathname = require('url').parse(url).pathname;
      var slashIndex = pathname.lastIndexOf('/');
      if(slashIndex != -1){
        pathname = pathname.substring(slashIndex + 1);
      }
      return pathname;
    }

    options.childNodes.forEach(function(item){
      if(item.name == 'url'){
        urls.push(item.value.url);
      }
    });

    var toFile = function(item, dest){
      var file = parseURL(item);
      if(file == ''){
        file = 'index.html';
      }
      if(dest){
        file = dest + path.sep + file;
      }
      return path.normalize(file);
    }

    var download = function(src, dest, callback){
      console.log('download: %s -> %s', src, dest);
      fileutil.mkdir(path.dirname(dest));
      var stream = fs.createWriteStream(dest);

      stream.once('error', function(e, data){
        callback(e);
      });
      stream.once('close', function(e, data){
        callback()
      });
      
      request(src).pipe(stream, {end: true});
    }

    if(src){
      download(src, (dest ? dest : toFile(src)), callback);
    }else{
      var queue = [];
      async.forEach(urls, function(item, cb){
        download(item, toFile(item, dest), cb);
      }, callback);
    }


  });

}
   