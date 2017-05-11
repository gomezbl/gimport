'use strict';

var assert = require('chai').assert;
var gimport = require("../gimport");


/* Initialize gimport before tests */
before( function() {
	gimport.init( __dirname );
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

	describe('#Check error conditions', function() {
		it( 'gimport.init() called twice', function() {
			try {
				/* .init has been called in before() function above */
				gimport.init(__dirname);
				assert.fail();
			} catch(e) {}
		});
	});

	describe('#Check reload of modules', function() {
		it( 'reload() basic call', function() {
			gimport.reload(__dirname);
		});

		it( 'reload() with new mappings', function() {
			gimport.reload(__dirname, 'gimport.mappings2.json');
		});

		it( 'reload() with new mappings and check module count', function() {
			gimport.reload(__dirname, 'gimport.mappings2.json');

			assert.equal(1, gimport.modulesLoadedCount());
		});


		it( 'reload() with new mappings and check module invocation', function() {
			gimport.reload(__dirname, 'gimport.mappings2.json');

			var module_average = global.gimport('module_average');
			
			assert.equal( 'object', typeof module_average )
			assert.equal( 4, module_average.average( [2,4,6]) )
		});


		it( 'reload() with new mappings and try to load wrong module name', function() {
			gimport.reload(__dirname, 'gimport.mappings2.json');

			assert.equal(1, gimport.modulesLoadedCount());

			var module_average = global.gimport('module_average');
			
			assert.equal( 'object', typeof module_average )
			assert.equal( 4, module_average.average( [2,4,6]) )

			try {
				global.gimport('foomodule');
				assert.fail();
			} catch(e) {}
		});

		it( 'reload() with bad mapping json file', function() {
			try {
				gimport.reload(__dirname, 'gimport.badmappings.json');
				assert.fail();
			} catch(e) {
				// If error thown, test success
			}
		})
	});

	describe('#Check initm()', function() {
		it( 'gimport.initm()', function() {
			gimport.initm( __dirname );

			assert.equal(3, gimport.modulesLoadedCount());
		});

		it( 'gimport.initm() called twice', function() {
			gimport.initm( __dirname );
			gimport.initm( __dirname );

			assert.equal(3, gimport.modulesLoadedCount());
		})
	});
});