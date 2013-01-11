var path = require('path');

module.exports = function(aida){

    var fileutil = aida.fileutil;
    var aidautil = aida.util;

   aida.register('copy', function(options){
      var file = options.file || options.dir;
      var todir = options.todir;
      var error;

      if(!todir){
        return {
            error: new Error("the file/dir and todir are required in copy task.")
        }
      }

      if(file){
        try{
            fileutil.copy(file, todir);
        }catch(err){
            error = error;
        }
      }else{

        var copyFileset = function(options){
           var fileset = aidautil.getFileSet(options);
           var dir = fileset.dir;
           var files = fileset.files;

           return files.every(function(item){

              var relativeDir = path.dirname(path.relative(dir, item));
              var innerDir = path.normalize(todir + path.sep + relativeDir);
              if(fileutil.isDirectory(item)){
                fileutil.mkdir(item);
                return true;
              }
              try{
                fileutil.copy(item, innerDir);
              }catch(err){
                error = err;
                return false;
              }
              return true;
           });
        }
        
        options.childNodes.every(function(item){
            if(item.name == 'fileset'){
               return copyFileset(item.value);
            }
            return true;
        });
      }
        
      return {error: error}
    });
}
   