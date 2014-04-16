'use strict';
/**
@module bee
**/

/**
replace任务
-------------
对文件进行字符串查找替换

### 用法

    <replace token='@version@' value='4.0.1' file='combo.js'/>

@class replace
**/
module.exports = function(bee) {

  var util = bee.util;

  bee.register('replace', function(options) {

    var files = util.getFiles(options);
    var replacePairs = [];
    var charset = options.charset || 'utf-8';

    //获得replace对
    var getReplacePair = function(options) {
      var replaceToken = options.token;
      var replaceValue = options.value;
      options.childNodes.forEach(function(item) {
        if (item.name == 'replacetoken') {
          replaceToken = item.value.value;
        } else if (item.name == 'replacevalue') {
          replaceValue = item.value.value;
        }
      })
      if (replaceToken && replaceValue) {
        return [replaceToken, replaceValue];
      }
      return null;
    }

    var pairs = getReplacePair(options);
    pairs && replacePairs.push(pairs);

    options.childNodes.forEach(function(item) {
      if (item.name == 'replacefilter') {
        var pairs = getReplacePair(item.value);
        pairs && replacePairs.push(pairs);
      }
    });

    var replaceContent = function(content) {
      replacePairs.forEach(function(item) {
        var reg = new RegExp(item[0], 'g');
        content = content.replace(reg, item[1]);
      });
      return content;
    }

    files.forEach(function(file) {
      if (bee.file.isFile(file)) {
        var content = bee.file.read(file, charset);
        bee.file.write(file, replaceContent(content), charset);
      }
    });

  });
}