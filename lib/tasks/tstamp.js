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

    var property = options.property;

    if (!property) {
      return bee.error('the property is required in tstamp task.');
    }

    bee.project.setProperty(property, new Date());

  });
}