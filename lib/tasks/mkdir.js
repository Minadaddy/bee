

module.exports = function(aida){
    var fileutil = aida.fileutil;
  aida.register('mkdir', function(options){
      fileutil.mkdir(options.dir);
    });
}
   