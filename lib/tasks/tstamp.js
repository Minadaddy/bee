'use strict';
/**
@module bee
**/

/**
tstamp任务
-------------
生成一个时间戳

### 用法

    <tstamp property='tstamp'/>

@class tstamp
**/
module.exports = function(bee) {

  bee.register('tstamp', function(options) {
    
    var formatDate = function (date, format) { 
        var o = {
          "M+": date.getMonth() + 1,
          "d+": date.getDate(), 
          "H+": date.getHours(), 
          "h+": date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
          "m+": date.getMinutes(), 
          "s+": date.getSeconds(),  
          "q+": Math.floor((date.getMonth() + 3) / 3), 
          "S": date.getMilliseconds()
        };
        if (/(y+)/.test(format)){
          format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o){
          if (new RegExp("(" + k + ")").test(format)){
            format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          }
        }
        return format;
    }

    var property = options.property;
    var pattern = options.pattern || 'yyyy-MM-dd HH:mm:ss';

    if (!property) {
      return bee.error('the property option is required in tstamp task.');
    }

    bee.project.setProperty(property, formatDate(new Date(), pattern));

  });
}