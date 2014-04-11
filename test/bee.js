var bee = process.env.JSCOV ? require('../lib-cov/bee') : require('../lib/bee');

describe('bee is a static utility class', function(){
  

  it('bee has async,fileutil, util property', function(){
    bee.should.have.property('async');
    bee.should.have.property('file');
    bee.should.have.property('request');
    bee.should.have.property('util');
  });
  
  it('bee has task, Target, Project, project property', function(){
    bee.should.have.property('task');
    bee.should.have.property('Target');
    bee.should.have.property('Project');
  });
  
  it('bee has log, info, debug, warn, error method', function(){
    bee.should.have.property('log');
    bee.should.have.property('info');
    bee.should.have.property('debug');
    bee.should.have.property('warn');
    bee.should.have.property('error');
  });

  it('bee version should be the version defined in package.json', function(){
    var current = bee.version;
    var version = JSON.parse(bee.file.read(__dirname + '/../package.json')).version;
    current.should.equal(version);
  });

  it('bee can register and unregister task', function(){
    bee.register('__test', function(){});
    bee.task.getTask('__test').should.be.a('function');
    bee.unregister('__test');
    (bee.task.getTask('__test') == null).should.be.true;
  });

  it('bee can create Project', function(){
    bee.createProject(__dirname + '/project.xml').should.be.an.instanceof(bee.Project);
  });

});