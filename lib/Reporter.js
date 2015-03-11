'use strict';
/**
@module bee
**/
var util = require('util');
var EOL = require('os').EOL;
require('colors');

/*
Project的运行结果报告器
@class Reporter
@constructor
*/
var Reporter = function(project) {
  this.project = project;
  this.initialize();
};

/*
初始化Reporter
@method initialize
*/
Reporter.prototype.initialize = function() {

  var project = this.project;
  var startTime;

  var timeCost = function() {
    var diff = new Date() - startTime;
    return diff / 1000 + " second(s)";
  };
  
  var log = function(str) {
    console.log(str.green);
  }
  var error = function(str) {
    console.log(str.red);
  };
  project.on("start", function() {
    startTime = Date.now();
    var name = project.name || "<missing project name>";
    var description = project.description || "<missing project description>";
    log("start build " + name + ": " + description);
    log("================================================================");
  });

  project.on("finish", function(e) {
    if (e) {
      var message = e.message || e.toString();
      error( EOL + "Error: " + message + EOL);
    } else {
      log("================================================================");
    }
    var info = e ? "failed" : "successful";
    log("build " + info + ", elapsed Time: " + timeCost() + ".");
  });

  project.on("targetStart", function(target) {
    console.log(("#task " + target.name + ":" + EOL).magenta);
  });
  project.on("targetFinish", function(target) {
    console.log("");
  });

};

module.exports = Reporter;