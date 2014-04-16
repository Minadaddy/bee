console.log("exec.js start executing...");
require('fs').readFile('greeting.js', function(err, data){
  console.error(data.toString());
});