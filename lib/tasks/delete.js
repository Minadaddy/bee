/**
@task delete
**/
module.exports = function (aida) {

  var fileutil = aida.fileutil;
  var util = aida.util;

  aida.register('delete', function (options) {
    var file = options.file || options.dir;
    if (file) {
      aida.log('delete: ' + file);
      fileutil.delete(file);
    } else {
      var files = util.getFiles(options);
      files.forEach(function (item) {
        aida.log('delete: ' + item);
        fileutil.delete(item);
      });
    }
  });
}