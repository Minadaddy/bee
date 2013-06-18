var bee = process.env.JSCOV ? require('../lib-cov/bee') : require('../lib/bee');

describe('bee is a static utility class', function(){
  

  it('bee has async,fileutil, util property', function(){
    bee.should.have.property('async');
    bee.should.have.property('fileutil');
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

});