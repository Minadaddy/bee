
var path = require('path');
module.exports = function(aida){
    
    aida.register('extname', function(options){
        
      var file = options.file;
      var property = options.property;
      if(!file || !property){
        throw new Error('file and property are required in extname task')
      }
      return {
        setProperty: {
          name: property,
          value: path.extname(file)
        }
      };
    });
}
   