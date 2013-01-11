

module.exports = function(aida){

    aida.register('node', function(options, callback){
      var file = options.value || options.file;
      var spawn = require('child_process').spawn;
      spawn('node', [file], callback);
    });
}
   