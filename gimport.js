'use strict';

/*
 * Module for simple requiring other modules based on mappings
 */

var _mappings = {};
var GIMPORT_MAPPING_JSON_FILENAME = "gimport.mappings.json";
var _verbose = false;
var path = require('path');
var _basepath;

function loadModule(modulename) {
	if ( _mappings[modulename] == undefined ) throw new Error('Module not defined in gimport.mappings.json : ' + modulename);

	return require( path.join(_basepath, _mappings[modulename]) )
}			

function checkModules(basepath, mappings) {
	var fs = require('fs');
	var allmodulesexist = true;

	/* Check if all module exists */
	for( var modulename in mappings ) {
		var pathtomodule = path.join( basepath, mappings[modulename]);

		if ( fs.existsSync( pathtomodule ) == false ) {
			if ( _verbose == true ) console.log( "gimport: Unable to locate " + modulename + " module in " + pathtomodule );
			allmodulesexist = false;
		} else if ( _verbose == true ) {
			console.log( "gimport: module mapped with success: " + modulename );
		}		
	}	

	return allmodulesexist;
}
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
	 * An exception is thown if:
	 *   . The format of the file is not a valid json document
	 *   . The method has been called previously. If new mappings file should be load, call reload() instead.
	 *   . One or more modules in mappings files don't exist
	 * Sample usage:
	 * 	global.init()
	 *      loads in current path the file with the default name "gimport.mappings.json"	 
	 *  global.init( '<path>' )
	 *      loads in <path> folder the mapping files with de default name "gimport.mappings.json"
	 *  global.init( '<path>', 'mymappingfile.json' )
	 *      loads "<path>/mymappingfile.json" mapping file
	 */
gimport.init = function(basepath, mappingFilename) {
	var fs = require('fs');
	var jf = require('jsonfile');	
	var allmodulesexist = true;
	_basepath = basepath;

	if ( global.gimport != null ) {
		throw new Error( 'gimport.init() called more than once' );
	}

	if ( basepath == null )	 {
		_basepath = __dirname;
	}

	if ( mappingFilename == null ) {
		mappingFilename = GIMPORT_MAPPING_JSON_FILENAME;
	}

	try {
		_mappings = jf.readFileSync( path.join(basepath, mappingFilename) );
	} catch(e) {
		throw new Error("Exception when loading json file: " + e);
	}
	
	/* Check if all module exists */
	allmodulesexist = checkModules( _basepath, _mappings );

	if ( allmodulesexist == true && _verbose == true ) { console.log( "gimport: all modules mapped with success!"); }

	if ( !allmodulesexist ) { throw new Error("gimport unable to locate one or more modules. Check config file '" + GREQUIRE_MAPPING_JSON_FILENAME + "'."); }

	global.gimport = loadModule;
};

/*
 * Loads the defintion of modules again clearing previous information loaded in init() call.
 * Params, throws and usage: same than init()
 */
gimport.reload = function( basepath, mappingFilename ) {
	if ( global.gimport == null ) { throw new Error("init() function not called."); }

	_mappings = {};
	global.gimport = null;

	gimport.init( basepath, mappingFilename )
}

/*
 * Returns the number of modules loaded into global.gimport
 */
gimport.modulesLoadedCount = function() {
	return Object.keys(_mappings).length;
}

/*
 * Indicates if the module should show log messages to console when loading mappings.
 * Useful in debug mode.
 */
gimport.withVerbose = function() {
	_verbose = true;
	return this;
}

module.exports = gimport;