/**
@module bee
**/
module.exports = function(bee){
    bee.register('tstamp', function(options){
		var property = options.property;
		if(!property){
			return;
		}
		bee.project.setProperty(property, new Date());
    });
}