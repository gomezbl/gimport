# gimport (global import). Simple mecanism to import node modules in a better way

This module tries to replace require() method in NodeJS to avoid nesting of local folders.

When we use require() for loading a module, the path to that module depends on the path of the code calling that require(); in a complex application with many modules and a complex folder structure, we can have something like this:

	var r = require("../../../../core/lib/mymodule.js");

If mymodule.js location changes, then all its references along the application should be updated. This makes the applications rigid to changes its local and custom modules path.

What if we could write something like this instead?

	global.gimport("mymodule");

Given a json mappings file (described below), if mymodule location changes, then only one place should be updated in the whole application.

For example, in this simple project structure:

	folder-a
	|        module1.js
	folder-b/folder-c
	|               module2.js
	mainmodule.js
	
If module1.js needs to refer to module.js, it needs to call require('../mainmodule.js').

Instead, if module2.js needs to do the same, then it nees to call require('../../mainmodule.js');

This shows two main problems that ofuscates the code and reduces it maintenability:

- Those calls to require() with relative paths should be changed if module1.js or module2.js locations changes.
- If module.js location changes instead, then both requires() in module1.js and module2.js should change as well.
 
The problem gets worse within an application with a high number of custom modules and dependencies, as mentioned before.

With **gimport**, once the mappings are define in a json file, module1 and module2 modules can call global.gimport('mainmodule'), with no relative paths.

For doing that, a file like this one should be define (usually with the default name of "gimport.mappings.json"):

	{
	   "module1" : "/folder-a/module1.js",
	   "module2" : "/folder-b/folder-c/module2.js",
	}
	
After calling gimport.init() just once in boot process of the project, global.grequire() method is defined and can be used throughout the whole application.

So, global.gimport("module1") and global.gimport("module2") can be called throughout all application code.

In general, is not a good idea to pollute 'global' scope, but gimport expects to improve de require logic in NodeJS applications and reduce the complexity of "require" calls within the application.

On the other hand, this simple module can be used as a basic **dependency inyection** mecanism for the application, cause decouples the need of a client module to know the location of its dependencies.

#Mapping files structure

The mapping file is a simple json file with the information of the name of the module and its location:

	{
	   "[module 1 name]", "[relative location to module 1]",
	   "[module 2 name]", "[relative location to module 2]",
	   "[module 3 name]", "[relative location to module 3]",
	   ...  
	}
	
# Usage

Install the module in your application with:

	npm install grequire --save

Then define grequire.mapings.json file as shown above.

Initialize the module in the bootstrap process of your application with:

	require("gimport").init();

Then you can load your modules easily with (no paths needed):

	var m = global.gimport("[mymodulename]");

And enjoy!

# Module API and usage

## gimport.init( basepath, mappingsfilename )

Initializes the module. It should be called just once in the application lifecycle.

Params:

- basepath (optional): base path or root of the solution. Inside that root should exist gimport.mappings.json file with the mappings.
- mappingFileName (optional): file name with the modules mappings. If not set, then default "gimport.mappings.json" file will be loaded

This method creates global.gimport function to load modules given its mapping name. An exception is thown if:

- The format of the file is not a valid json document
- The method has been called previously. If new mappings file should be load, call reload() instead.
- One or more modules in mappings files don't exist

 Sample usage:
 
	require('gimport').init()

Loads in current path the file with the default name "gimport.mappings.json"

	require('gimport').init( '[path]' )

Loads in [path] folder the mapping file with de default name "gimport.mappings.json"
 
	require('gimport').init( '[path]', 'mymappingfile.json' )
	
Loads "[path]/mymappingfile.json" mapping file

## gimport.initm( basepath, mappingsfilename )

Same than init() but without the restriction that the method should only be called once. 

initm() allows multiple calls to initialize the module for loading mappings. This is useful for testing, when multiple test files may be called with no order and they need gimport to be initialized.

## gimport.withVerbose()

Indicates if the module should show log messages to console when loading mappings.
Useful in debug mode. Simple usage:

	require('gimport').withVerbose().init();

When calling this way, debug messages will be shown in console.

## gimport.reload( basepath, mappingsfilename )

Loads the defintion of modules again clearing previous information loaded in init() call. Useful for testing when modules mocks should be used.

Params, throws and usage: same than init()

# Tests

gimport uses [mocha](https://mochajs.org/) as a testing framework using [chai js library](http://chaijs.com/) assert library.

To test the module, just run:

	$ mocha

The module has been tested for LTS node versions: v0.12.18, v4.8.1 and v6.10.1.
