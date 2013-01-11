var util = require('util');

module.exports = function(aida){
   var fileutil = aida.fileutil;
    
    aida.register('condition', function(options){
    
      var property = options.property;
      if(!property && !options.if && !options.unless){
        throw new Error('property or if or unless is required in condition task')
      }
      var addToCompareList = function(obj, key, list){
        if(util.isArray(key)){
          key.forEach(function(item){
            addToCompareList(obj, item, list);
          });
          return;
        }
        if(obj[key] !== undefined){
          list[key] = obj[key];
        }
      }

      var parser = {
        'os': function(obj){
          var os = require('os');
          var keys = {};
          addToCompareList(obj, ['platform', 'arch', 'hostname', 'type'], keys);
          return Object.keys(keys).every(function(item){
            return keys[item] == os[item]();
          });
        },
        'available': function(obj){
          var file = obj.file;
          if(obj.type == 'dir'){
            return fileutil.isDirectory(file);
          }
          return fileutil.isFile(file);
        },
        'equals': function(obj){
          return obj.arg1 == obj.arg2;
        },
        'and': function(obj){
          return obj.childNodes.every(function(item){
            return parser[item.name](item.value);
          });
        },
        'not': function(obj){
          return !obj.childNodes.every(function(item){
            return parser[item.name](item.value);
          });
        },
        'or': function(obj){
          return obj.childNodes.some(function(item){
            return parser[item.name](item.value);
          });
        },
        'xor': function(obj){
          var nodes = obj.childNodes;
          if(nodes.length != 2){
            return false;
          }
          var v1 = parser[nodes[0].name](nodes[0].value);
          var v2 = parser[nodes[1].name](nodes[1].value);
          return v1 ^ v2;
        }
      };

      var value = parser.and(options);
      var result = {};
      if(property){
        result.setProperty = {
          name: property,
          value: value
        }
      }
      if(options.if && value){
        result.executeTarget = {
          name: options.if
        }
      }else if(options.unless && !value){
        result.executeTarget = {
          name: options.unless
        }
      }
      return result;
    });
}
   