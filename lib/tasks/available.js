

module.exports = function(aida){
   var fileutil = aida.fileutil;
    aida.register('available', function(options){
      var file = options.file;
      var dir = options.dir;
      var property = options.property;
      if((!file && !dir) || !property){
        throw new Error('file/dir and property are required in available task')
      }
      var exist = dir ? fileutil.isDirectory(file) : fileutil.isFile(file);
      return {
        setProperty: {
          name: property,
          value: exist
        }
      };
    });
}
