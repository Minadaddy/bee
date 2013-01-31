

module.exports = function(aida){

    var path = require('path');
    var fileutil = aida.fileutil;
    
   aida.register('datauri', function(options){
       var minifier = require('node-minifier');
       var charset = options.charset || 'utf-8';
       if(!options.src){
        callback(new Error('the src option is required in datauri'));
       }
       var filecontent = fileutil.read(options.src, charset);
      aida.log('datauri ' + options.src);
      filecontent = minifier.datauri(filecontent, path.dirname(options.src), {
          ieSupport: options.ieSupport != false,
          maxSize: options.maxSize
       });
      fileutil.write(options.dest, filecontent, charset);
    });
}
   