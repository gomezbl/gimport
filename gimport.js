(function() {
	/*
	 * Module for simple requiring other modules based on mappings
	 */

	var jf = require('jsonfile'),
	    path = require('path'),
		mappings = {},
		basepath = {},
		GIMPORT_MAPPING_JSON_FILENAME = "gimport.mappings.json",
		verbose = false;

	/*
	 * The constructor function receives a json file with the mappings
	 */
	var grequire = module.exports = {};
		/*
		 * Prepares the module to run
		 * Params:
		 *   basepath: base path or root of the solution. Inside that root should exist GREQUIRE_MAPPING_JSON_FILENAME file
		 *      with the mappings.
		 * 
		 * This method creates global.grequire function to load modules given its mapping name
		 *
		 */
	grequire.use = function(basepath) {
		basepath = basepath;
		mappings = jf.readFileSync( path.join(basepath, GIMPORT_MAPPING_JSON_FILENAME) );
		var fs = require('fs'),
			allmodulesexist = true;

		for( var modulename in mappings ) {
			var pathtomodule = path.join( basepath, mappings[modulename]);

			if ( fs.existsSync( pathtomodule ) == false ) {
				console.log( "grequired: Unable to locate " + modulename + " module in " + pathtomodule );
				allmodulesexist = false;
			} else if ( verbose == true ) {
				console.log( "grequired: module mapped with success: " + modulename );
			}		
		}

		if ( allmodulesexist == true && verbose == true ) { console.log( "grequired: all modules mapped with success!"); }

		if ( !allmodulesexist ) { throw new Error("grequire unable to locate one or more modules. Check config file '" + GREQUIRE_MAPPING_JSON_FILENAME + "'."); }

		global.gimport = function(modulename) {
			if ( mappings[modulename] == undefined ) throw new Error('Module not defined in grequire.mappings.json : ' + modulename)

			modulepath = path.join(basepath, mappings[modulename])
			
			return require( path.join(basepath, mappings[modulename]) )
		}			
	};

	/*
	 * Indicates if the module should show log messages to concole when loading mappings
	 */
	grequire.withVerbose = function() {
		verbose = true;
		return this;
	}
})()
