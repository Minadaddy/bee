
 var path = require('path');
module.exports = function(aida){
    
     aida.register('basename', function(options){
        
      var file = options.file;
      var property = options.property;
      if(!file || !property){
        throw new Error('file and property are required in basename task')
      }
      return {
        setProperty: {
          name: property,
          value: path.basename(file, options.suffix)
        }
      };
    });
}
   