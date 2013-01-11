

module.exports = function(aida){

    aida.register('input', function(options, callback){
      var property = options.setproperty || options.property;
      if(!property){
        throw new Error('setproperty or property is required in input task')
      }
      require('read')({
        prompt: options.message,
        silent: options.password,
        replace: options.password ? '*' : null
      }, function(err, pass){
        callback(err, {
          setProperty: {
            name: property,
            value: pass || options.defaultvalue
          }
        });
      });
    });
}
   