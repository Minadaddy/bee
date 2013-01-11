var util = require('util');

module.exports = function(aida){
    
    aida.register('echo', function(options){
      util.puts(options.value);
    });
}
   