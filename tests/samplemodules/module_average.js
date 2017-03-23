'use strict';

/* 
 * Sample module for testing gimport
 */

var fncs = {};

fncs.average = function( values ) {
	var sum;

	for( var i = 0; i < values.length; i++ ) {
		sum += values[i];
	}

	return sum / values.length;
}

module.exports = fncs;