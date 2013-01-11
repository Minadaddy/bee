var path = require('path');
module.exports = function(aida){
    
    aida.register('dirname', function(options){
        
      var file = options.file;
      var property = options.property;
      if(!file || !property){
        throw new Error('file and property are required in dirname task')
      }
      return {
        setProperty: {
          name: property,
          value: path.dirname(file)
        }
      };
    });
}
   