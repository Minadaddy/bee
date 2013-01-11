/**
**/

module.exports = function(aida){
    var path = require('path');
    var fileutil = aida.fileutil;
    var aidautil = aida.util;

    aida.register('zip', function(options, callback){
      var zip = new require('node-zip')();
      var fs = require('fs');
      var destfile = options.destfile || options.dest;
      var files = aidautil.getFiles(options);

      console.log(files);

      if(!destfile){
        return callback(new Error('the destfile is required in zip task'));
      }

      files.forEach(function(item){
         var relativeDir = path.dirname(path.relative(options.basedir, item));
         var name = path.join(relativeDir, path.basename(item));
        if(fileutil.isFile(item)){
          zip.file(name, fileutil.read(item));
        }else{
          zip.folder(name);
        }
      });
      var compression = options.compression || 'DEFLATE';
      var base64 = false;
      if(options.base64 === true){
        base64 = true;
      }
      var data = zip.generate({base64:base64, compression:compression});
      fs.writeFile(options.destfile, data, 'binary', callback);
    });
}
   