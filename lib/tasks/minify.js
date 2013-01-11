module.exports = function(aida){
  
  var fileutil = aida.fileutil;
  
  aida.register('minify', function(options, callback){

    var path = require('path');
    var minifier = require('node-minifier');

    var src = options.src;
    var destfile = options.destfile || options.dest;
    if(!src || !destfile){
      return callback(new Error('src and destfile are required in minify task.'));
    }
    
    var readWrite = function(transform, input, output, callback){
      var charset = options.charset || 'utf-8';
      var filecontent = fileutil.read(input, charset);
      filecontent = transform(filecontent, options);
      fileutil.mkdir(path.dirname(output));
      fileutil.write(output, filecontent, charset);
      callback();
    }

    var minifyJS = function(input, output, callback){
      var list = options.list ? options.list.split(',') : [];
      readWrite(function(filecontent){
        return minifier.minifyJS(filecontent, {
          logTargetList: list,
          copyright: options.copyright || true
        });
      }, input, output, callback);
    }

    var minifyCSS = function(input, output, callback){
      readWrite(function(filecontent){
          return minifier.minifyCSS(filecontent, {
            datauri: options.datauri
          });
      }, input, output, callback);
    }

    var minifyHTML = function(input, output, callback){
      readWrite(function(filecontent){
          return minifier.minifyCSS(filecontent, options);
      }, input, output, callback);
    }

    var minifyImage = function(input, output, callback){
       minifier.minifyImage(input, output, function(e, data){
          if(e){
            callback && callback(e);
          }else{
            callback(null);
          }
        }, {
          service: options.service
        })
    }

    var extname = fileutil.extname(src).toLowerCase();
    var method = 'minifyJS';

    if(extname == 'js'){
      method = minifyJS;
    }else if(extname == 'css'){
      method = minifyCSS;
    }else if(['html','htm'].indexOf(extname) >= 0){
      method = minifyHTML;
    }else if(['png','jpg','jpeg','gif'].indexOf(extname) >= 0){
      method =minifyImage;
    }

    method(src, destfile, callback);
    

  });
}