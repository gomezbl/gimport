'use strict';

/*
 * Module for simple requiring other modules based on mappings
 */

var mappings = {};
var GIMPORT_MAPPING_JSON_FILENAME = "gimport.mappings.json";
var verbose = false;

/*
 * The constructor function receives a json file with the mappings
 */
var gimport = {};
	/*
	 * Prepares the module to run
	 * Params:
	 *   basepath (optional): base path or root of the solution. Inside that root should exist GREQUIRE_MAPPING_JSON_FILENAME file
	 *      with the mappings.
	 *   mappingFileName (optional): file name with the modules mappings. If not set, then default "gimport.mappings.json" file will be loaded
	 * 
	 * This method creates global.gimport function to load modules given its mapping name
	 *
	 */
gimport.init = function(basepath, mappingFilename) {
	var fs = require('fs');
	var jf = require('jsonfile');
	var path = require('path');
	var allmodulesexist = true;
	var basepath = basepath;

	if ( global.gimport != null ) {
		throw new Error( 'gimport.init() called more than once' );
	}

	if ( basepath == null )	 {
		basepath = __dirname;
	}

	if ( mappingFilename == null ) {
		mappingFilename = GIMPORT_MAPPING_JSON_FILENAME;
	}

	try {
		mappings = jf.readFileSync( path.join(basepath, mappingFilename) );
	} catch(e) {
		throw new Error("Exception when loading json file: " + e);
	}
	
	/* Check if all module exists */
	for( var modulename in mappings ) {
		var pathtomodule = path.join( basepath, mappings[modulename]);

		if ( fs.existsSync( pathtomodule ) == false ) {
			if ( verbose == true ) console.log( "gimport: Unable to locate " + modulename + " module in " + pathtomodule );
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
 * Loads the defintion of modules again clearing previous information loaded in init() call.
 * Params: same than init()
 */
gimport.reload = function( basepath, mappingFilename ) {
	if ( global.gimport == null ) { throw new Error("init() function not called."); }

	mappings = {};
	global.gimport = null;

	gimport.init( basepath, mappingFilename )
}

/*
 * Returns the number of modules loaded into global.gimport
 */
gimport.modulesLoadedCount = function() {
	return Object.keys(mappings).length;
}

/*
 * Indicates if the module should show log messages to concole when loading mappings
 */
gimport.withVerbose = function() {
	verbose = true;
	return this;
}

module.exports = gimport;