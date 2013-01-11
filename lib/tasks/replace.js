

module.exports = function(aida){

   var aidautil = aida.util;
   var fileutil = aida.fileutil;

   aida.register('replace', function(options){
      var files = aidautil.getFiles(options);
      var replacePairs = [];
      var charset = options.charset || 'utf-8';
      var getReplacePair = function(options){
        var replaceToken = options.token;
        var replaceValue = options.value;
        options.childNodes.forEach(function(item){
          if(item.name == 'replacetoken'){
            replaceToken = item.value.value;
          }else if(item.name == 'replacevalue'){
            replaceValue = item.value.value;
          }
        })
        if(replaceToken && replaceValue){
          return [replaceToken, replaceValue];
        }
        return null;
      }
      var pairs = getReplacePair(options);
      pairs && replacePairs.push(pairs);
      options.childNodes.forEach(function(item){
        if(item.name == 'replacefilter'){
           var pairs = getReplacePair(item.value);
           pairs && replacePairs.push(pairs);
        }
      });
      var replaceContent = function(content){
        replacePairs.forEach(function(item){
          var reg = new RegExp(item[0], 'g');
          content = content.replace(reg, item[1]);
         
        });
        return content;
      }
      files.forEach(function(file){
        if(fileutil.isFile(file)){
          var content = fileutil.read(file, charset);
          fileutil.write(file, replaceContent(content), charset);
        }
      });
    });
}
   