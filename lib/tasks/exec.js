

module.exports = function(aida){

   aida.register('exec', function(options, callback){
      var exec = require('child_process').exec;
      exec(options.value, callback);
    });
}
   