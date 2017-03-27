'use strict';

/* 
 * Sample module for testing gimport
 */

var fncs = {};

fncs.average = function( values ) {
	var sum = 0;

	/*for( var i = 0; i < values.length; i++ ) {
		sum = sum + values[i];
	}*/
	values.map( function(value) {
		sum += value;
	});

	return sum / values.length;
}

module.exports = fncs;