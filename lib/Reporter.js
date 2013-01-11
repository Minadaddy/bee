var util = require('util');
var colors = require('colors');

var Reporter = function (project) {
    this.project = project;
    this.initialize();
};

/**
 * Reporter has an interface named initialized
 * while the task running, the reporter can display the in-time info.
 */
Reporter.prototype.initialize = function () {

    var project = this.project;
    var startTime;

    var timeCost = function () {
      var diff = new Date() - startTime;
      return diff / 1000 + " second(s)";
    };
    
    var log = function(str){
      util.puts(str.green);
    }
    var error = function(str){
      util.puts(str.red);
    };
    project.on("start", function () {
      startTime = Date.now();
      var name = project.name || "<missing project name>";
      var description = project.description || "<missing project description>";
      log("adia start build " + name + ": " + description);
      log("================================================================");
    });

    project.on("finish", function (e) {
      if(e){
        var message = e.message || e.toString();
        error("\nError: " +  message + "\n");
      }else{
        log("================================================================");
      }
      var info = e ? "failed" : "successful";
      log("adia build " + info + ", elapsed Time: " + timeCost() + ".");
    });

    project.on("targetStart", function (target) {
      util.puts((" \f task " + target.name + ":\n").magenta);
    });
    project.on("targetFinish", function (target) {
      util.puts("");
    });

};

module.exports = Reporter;