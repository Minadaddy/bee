
   var path = require('path');
       var fs = require('fs');

module.exports = function(aida){
    var fileutil = aida.fileutil;
    
    aida.register('unzip', function(options){
   
      var crc32 = true;
      if(options.crc32 === false){
        crc32 = options.crc32;
      }
     
      var dest = options.dest;
      var data = fs.readFileSync(options.src, 'binary');
      var REG_DIR = /\/$/;
      var zip = new require('node-zip')(data, {base64: options.base64, checkCRC32: crc32});
      Object.keys(zip.files).forEach(function(key){
        if(key.match(REG_DIR)){
          var dir = path.normalize(dest + '/' + key.replace(REG_DIR, ''));
          fileutil.mkdir(dir);
        }else{
          var filepath = path.normalize(dest + '/' + key);
          fileutil.mkdir(path.dirname(filepath));
          fileutil.write(filepath, zip.files[key].data);
        }
      });
    });
}
   