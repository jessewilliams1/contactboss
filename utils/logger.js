var defaultModule = 'Logger';

exports.info = function(content, module) {
	if (typeof module === 'undefined') {
		module = defaultModule;
	}
	console.log('# INFO: ' + module + ' # '+ content)
}

exports.debug = function(content, widget) {
	if (typeof module === 'undefined') {
		module = defaultModule;
	}
	console.log('# DEBUG: ' + module + ' # '+ content)
}

exports.error = function(content, widget) {
	if (typeof module === 'undefined') {
		module = defaultModule;
	}
	console.log('# ERROR: ' + module + ' # '+ content)
}


exports.object = function(object, module) {
	if (typeof module === 'undefined') {
		module = defaultModule;
	}
	this.info('#### OBJECT: ' + module);
	for (var property in object) {
		this.info('      {"' + property + '": "' + object[property] + '"}');
	}
}