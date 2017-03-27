# gimport
## Global Import - simple mecanism to import node modules in a better way.

This NodeJS module is in progress.

This module tries to replace require() method in NodeJS to avoid nesting of local folders.

When we use require(), the path to module load depends on the path of the code calling that function().

For example, in this siple project structure:

/
|-folder-a/
|----------mymodule1.js
|-folder-b/folder-c/
|-------------------mymodule2.js
| mymodule.js

If mymodule1.js needs to refer to mymodule.js, it needs to call require('../mymodule.js').
Instead, if mymodule2.js needs to do the same, then it nees to call require('../..mymodule.js');

This shows two main problems that ofuscates the code and reduces it maintenability:
* Those calls to require() with relative paths should be changed if mymodule1.js or mymodule2.js locations changes.
* If mymodule.js location changes instead, then both requires() in mymodule1.js and mymodule2.js should change as well.

The problem gets worse within an application with a high number of modules and dependencies.

With **gimport**, once the mappings are define in a json file, mymodule1 and mymodule2 modules can call global.gimport('mymodule'), with no relative paths.

For doing that, a file like this one should be define (usually with the name of "gimport.mappings.json")

{
   "mymodule" : "/mymodule.js",
}

After calling gimport.init() just once in boot process of the project, global.grequire() method is defined and can be used throughout the whole application.

In general, is not a good idea to pollute 'global' scope, but gimport expects to improve de require logic in NodeJS applications.

On the other hand, this simple module can be used as DIY (dependency inyection) mecanism for the application, cause decouples the need of a client module to know the location of its dependencies.

# Module API
## gimport.init( basepath, mappingsfilename )
 (awaiting final version)

## gimport.withVerbose()
 (awaiting final version)

## gimport.reload( basepath, mappingsfilename )
 (awaiting final version)

