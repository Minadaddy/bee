module.exports = function(bee){
  bee.register('greeting', function(options){
    bee.debug('greeting: ' + options.value);
  });
}