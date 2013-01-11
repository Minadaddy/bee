

module.exports = function(aida){
    var fileutil = aida.fileutil;
  aida.register('delete', function(options){
      var file = options.file || options.dir;
      if(file){
        fileutil.delete(file);
      }else{
        var files = attutil.getFiles(options);
        files.forEach(function(item){
          fileutil.delete(item);
        });
      }
    });
}
   