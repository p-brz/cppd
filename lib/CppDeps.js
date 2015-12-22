var gatherDependencies = require('gather-dependencies');
var path = require('path');
var async = require("async");

var DepsParser = require('./DepsParser.js')
var commons = require('./Commons.js')

function CppDeps() {

	this.parser = DepsParser();

	findDependenciesPaths = function(pkgDir, callback) {

		gatherDependencies(pkgDir, function(err, data) {
			if (!err) {
				_onGetDependencies(pkgDir, data, callback);
			}
            else{
                callback(err, null);
            }
		})
	};

    /** Process the dependencies object, resolving the dependencies directories into absolute paths.
        @param relativeTo - (optional) indicates an directory used as base to build the paths.
                Defaults to ${current dir}/node_modules
    */
    resolveDependencies = function(dependencies, relativeTo){
        if(! relativeTo){
            relativeTo = './node_modules';
        }

        for(pkg in dependencies){
            for(dirKey in dependencies[pkg]){
                dir = dependencies[pkg][dirKey];
                resolvedPath = path.resolve(relativeTo, pkg, dir);

                dependencies[pkg][dirKey] = resolvedPath;
            }
        }

        return dependencies;
    };

    /** Turn dependencies structure into a flat key-values dictionary*/
    flattenDependencies = function(dependencies){
        flatDependencies = {};

        for(subproj in dependencies){
                // flatDependencies
            for(dep in dependencies[subproj]){
                flatKey = subproj + "_" + dep;
                flatDependencies[flatKey] = dependencies[subproj][dep];
            }
        }
        return flatDependencies;
    };

	_onGetDependencies = function(pkgDir, data, callback) {
		modulesDir = path.join(pkgDir, 'node_modules')

		dependencies = Object.keys(data.dependencies)

		parseDep = function(dep, cb) {
			parser.parse(dep, modulesDir, function(err, dirs) {
				depDirs = {};
				depDirs[dep] = dirs;

				commons.forwardCallback(cb, err, depDirs);
			});
		}

        //Asynchronously parses the dependencies into the array 'results'
		async.map(dependencies, parseDep, function(err, results) {
			resultsObj = {}

            //Join the parsed dependencies into one object (resultsObj)
			for (i = 0; i < results.length; ++i) {
				for (key in results[i]) {
					resultsObj[key] = results[i][key]
				}
			}

			callback(err, resultsObj);
		});
	}

	return this;

} //CppDeps

module.exports = CppDeps;
