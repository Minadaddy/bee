module.exports = function(aida){

    var path = require('path');
    var aidautil =aida.util;
    var fileutil = aida.fileutil;

     aida.register('concat', function(options){
      var streams = [];
      var encoding = options.encoding;

      var sep = options.sep || "\r\n";
      var dir = options.dir || "";

      var files = aidautil.getFiles(options);

      var destfile = options.destfile || options.dest;
      if(!destfile){
        throw new Error('the destfile is required in concat task');
      }

      files.forEach(function(item){
        if(fileutil.isFile(item)){
          streams.push(fileutil.read(item, encoding));
        }
      });

      fileutil.mkdir(path.dirname(destfile));
      fileutil.write(destfile, streams.join(sep), encoding);

    });
}
   