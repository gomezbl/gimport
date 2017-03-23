'use strict';

var assert = require('chai').assert;
var gimport = require("../gimport");


/* Initialize gimport before tests */
before( function() {
	gimport.withVerbose().use( __dirname );
});

describe('Basic tests', function() {
	describe('#Check if modules are loaded', function() {
		it('modulesLoadedCount()', function() {
			assert.equal(3, gimport.modulesLoadedCount());
		});
	});

	describe('#Check sample modules', function() {
		it( 'module_average loads', function() {
			var module_average = global.gimport('module_average');
			
			assert.equal( 'object', typeof module_average )
		});

		it( 'module_average multiply', function() {
			var module_multiply = global.gimport('module_multiply');
			
			assert.equal( 'object', typeof module_multiply )
		});

		it( 'module_average sum', function() {
			var module_sum = global.gimport('module_sum');
			
			assert.equal( 'object', typeof module_sum )
		});
	});

	describe('#Check sample modules work and methods can be invoked', function() {
		it( 'module_average loads', function() {
			var module_average = global.gimport('module_average');
			
			assert.equal( 4, module_average.average( [2,4,6]) )
		});

		it( 'module_average multiply', function() {
			var module_multiply = global.gimport('module_multiply');
			
			assert.equal( 18, module_multiply.multiply(6,3) )
		});

		it( 'module_average sum', function() {
			var module_sum = global.gimport('module_sum');
			
			assert.equal( 9, module_sum.sum(6,3) )
		});
	});
});