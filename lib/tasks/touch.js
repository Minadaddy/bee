

module.exports = function(aida){
    var fileutil = aida.fileutil;
   aida.register('touch', function(options){
      fileutil.touch(options.file, options.permission, options.value);
    });
}
   