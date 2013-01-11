/**
**/

module.exports = function(aida){

    var fileutil = aida.fileutil;

    aida.register('loadfile', function(options){

      var property = options.property;
      var file = options.file || options.src;
      var encoding = options.encoding;

      if(!property || !file){
        return callback(new Error('the property and file/src is required in loadfile task'));
      }
      
      if(!fileutil.isFile(file)){
        return {
            error: new Error('the file not found')
        }
      }
      
      return {
         setProperty: {
            name: property,
            value: fileutil.read(file, encoding)
         }
      }
      
    });
}