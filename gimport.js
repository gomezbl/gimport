'use strict';

(function() {
	/*
	 * Module for simple requiring other modules based on mappings
	 */

	var jf = require('jsonfile');
	var path = require('path');
	var mappings = {};
	var basepath = {};
	var GIMPORT_MAPPING_JSON_FILENAME = "gimport.mappings.json";
	var verbose = false;

	/*
	 * The constructor function receives a json file with the mappings
	 */
	var gimport = module.exports = {};
		/*
		 * Prepares the module to run
		 * Params:
		 *   basepath: base path or root of the solution. Inside that root should exist GREQUIRE_MAPPING_JSON_FILENAME file
		 *      with the mappings.
		 * 
		 * This method creates global.gimport function to load modules given its mapping name
		 *
		 */
	gimport.use = function(basepath) {
		basepath = basepath;
		mappings = jf.readFileSync( path.join(basepath, GIMPORT_MAPPING_JSON_FILENAME) );
		var fs = require('fs'),
			allmodulesexist = true;

		for( var modulename in mappings ) {
			var pathtomodule = path.join( basepath, mappings[modulename]);

			if ( fs.existsSync( pathtomodule ) == false ) {
				console.log( "gimport: Unable to locate " + modulename + " module in " + pathtomodule );
				allmodulesexist = false;
			} else if ( verbose == true ) {
				console.log( "gimport: module mapped with success: " + modulename );
			}		
		}

		if ( allmodulesexist == true && verbose == true ) { console.log( "gimport: all modules mapped with success!"); }

		if ( !allmodulesexist ) { throw new Error("gimport unable to locate one or more modules. Check config file '" + GREQUIRE_MAPPING_JSON_FILENAME + "'."); }

		global.gimport = function(modulename) {
			if ( mappings[modulename] == undefined ) throw new Error('Module not defined in gimport.mappings.json : ' + modulename);
			
			return require( path.join(basepath, mappings[modulename]) )
		}			
	};

	/*
	 * Indicates if the module should show log messages to concole when loading mappings
	 */
	gimport.withVerbose = function() {
		verbose = true;
		return this;
	}
})()
