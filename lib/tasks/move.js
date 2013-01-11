var path = require('path');

module.exports = function(aida){
    var fileutil = aida.fileutil;
    var aidautil = aida.util;
    
   aida.register('move', function(options){
       
      var file = options.file || options.dir || options.src;
      var todir = path.normalize(options.todir);
      console.log(todir);
      if(file){
        fileutil.move(file, todir);
      }else{
        var filesetNode = options.childNodes[0];
        if(filesetNode.name == 'fileset'){
          var data = filesetNode.value;
          var dir = data.dir;
          var files = aidautil.getFileSet(data);
          files.forEach(function(item){
            var relativeDir = path.dirname(path.relative(dir, item));
            var innerDir = path.normalize(todir + path.sep + relativeDir);
            fileutil.move(item, innerDir);
          });
        }
      }
    });
}
   