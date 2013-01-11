

module.exports = function(aida){
    var fileutil = aida.fileutil;
   aida.register('rename', function(options){
      var src = options.src;
      var dest = options.dest;
      if(!src || !dest){
        throw new Error('the src and dest are required in rename task');
      }
      fileutil.rename(src, dest);
    });
}
   