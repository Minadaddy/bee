/**
@module bee
**/

/**
input任务
-------------
与用户交互在控制台中输入

### 用法

    <input property='username' message='please type your username?' defaultvalue='default-user'/>

    <input property='password' password='true' message='please type your password?'/>

@class input
**/
module.exports = function(bee) {

  bee.register('input', function(options, callback) {

    var property = options.setproperty || options.property;

    if (!property) {
      return bee.error('setproperty or property is required in input task')
    }

    require('read')({
      prompt: options.message,
      silent: options.password,
      replace: options.password ? '*' : null
    }, function(err, pass) {
      if(!err){
        bee.project.setProperty(property, pass || options.defaultvalue);
      }
      callback(err);
    });

  });
}