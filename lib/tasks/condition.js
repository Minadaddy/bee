/**
@module bee
**/

/**
condition任务
-------------
条件判断

### 用法

    <condition property="result">
      <os platform='win32'/>
      <equals arg1='${arg1}' arg2='${arg2}'/>
      <or>
        <available file='myfile'/>
      </or>
    </condition>

    <condition property='result' if='target-if' unless='target-unless'>
      <os platform='win32'/>
      <equals arg1='${arg1}' arg2='${arg2}'/>
      <or>
        <available file='myfile'/>
      </or>
    </condition>


@class condition
**/
module.exports = function(bee) {
  
  var util = require('util');

  bee.register('condition', function(options, callback) {

    var property = options.property;

    if (!property && !options['if'] && !options.unless) {
      bee.error('property or if or unless is required in condition task.');
      return callback();
    }

    var addToCompareList = function(obj, key, list) {
      if (util.isArray(key)) {
        key.forEach(function(item) {
          addToCompareList(obj, item, list);
        });
        return;
      }
      if (obj[key] !== undefined) {
        list[key] = obj[key];
      }
    }

    var parser = {

      /*
      解析os
      */
      'os': function(obj) {
        var os = require('os');
        var keys = {};
        addToCompareList(obj, ['platform', 'arch', 'hostname', 'type'], keys);
        return Object.keys(keys).every(function(item) {
          return keys[item] == os[item]();
        });
      },
      /*
      解析available
      */
      'available': function(obj) {
        if (obj.file ) {
          return bee.file.isFile(obj.file);
        }else if(obj.dir){
          return bee.file.isDirectory(obj.dir)
        }else if(obj.target){
          return bee.file.exist(obj.target);
        }
        return true;
      },
      /*
      解析equals
      */
      'equals': function(obj) {
        return obj.arg1 == obj.arg2;
      },
      /*
      解析and
      */
      'and': function(obj) {
        return obj.childNodes.every(function(item) {
          return parser[item.name](item.value);
        });
      },
      /*
      解析not
      */
      'not': function(obj) {
        return !obj.childNodes.every(function(item) {
          return parser[item.name](item.value);
        });
      },
      /*
      解析or
      */
      'or': function(obj) {
        return obj.childNodes.some(function(item) {
          return parser[item.name](item.value);
        });
      },
      /*
      解析xor
      */
      'xor': function(obj) {
        var nodes = obj.childNodes;
        if (nodes.length != 2) {
          return false;
        }
        var v1 = parser[nodes[0].name](nodes[0].value);
        var v2 = parser[nodes[1].name](nodes[1].value);
        return v1 ^ v2;
      }
    };

    //执行and解析
    var value = parser.and(options);

    if (property) {
      bee.project.setProperty(property, value);
    }

    if (options['if'] && value) {
      bee.project.executeTarget(options['if'], callback);
    } else if (options.unless && !value) {
      bee.project.executeTarget(options.unless, callback);
    }else{
      callback();
    }

  });
}