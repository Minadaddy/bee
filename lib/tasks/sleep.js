

module.exports = function(aida){

      aida.register('sleep', function(options, callback){
      setTimeout(callback, options.value);
    });
}
   