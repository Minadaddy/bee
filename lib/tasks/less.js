
 var fs = require('fs');

module.exports = function(aida){

    aida.register('less', function(options, callback){

      var path = require('path');
      var util = require('util');
        
      var src = options.src;
      var dest = options.dest;
      
      if(!src || !dest){
        throw new Error('src and dest are required in less task');
      }

      var less = require('less');
      if(options.path){
          if(!util.isArray(options.path)){
            options.path = options.path.split(',');
          }
       }else{
        options.path = [];
       }
       options.path.push(path.dirname(src));
      options.filename = src;
      console.log(options);

      var parser = new (less.Parser)(options);
      var encoding = options.encoding || "utf-8";

      var fileContent = fs.readFileSync(src, encoding);
      var defaults = {
        compress: options.compress
      }
      parser.parse(fileContent, function (e, tree) {
        if(e){
          return callback(e);
        }
        fileContent = tree.toCSS(defaults); 
        try{
          fs.writeFileSync(dest, fileContent, encoding);
        }catch(e2){
          return callback(e2);
        }
        return callback();
      });
    });
}
   