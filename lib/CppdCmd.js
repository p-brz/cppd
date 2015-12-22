path        = require('path')
envObject   = require('env-object')
CppDeps     = require('./CppDeps.js')

/** CppdCmd - module to handle cppd commands
*/
function CppdCmd() {
    this.cppDeps = CppDeps();

    /** Export dependencies variables found on project as env variables*/
    this.run = function(options, callback){
        const projectDir = options.cwd;

        this.cppDeps.findDependenciesPaths(projectDir, function(err, deps){
            if(err){
                callback(err, null);
                return;
            }
            deps = cppDeps.resolveDependencies(deps, path.join(projectDir, 'node_modules'));
            flatDeps = cppDeps.flattenDependencies(deps);

            envObject.write(path.join(options.cwd, CppdCmd.DEFAULT_FILENAME), flatDeps, {})
                 .then(callback);
        });
    }

	return this;
} //CppdCmd

CppdCmd.DEFAULT_FILENAME = 'cppd_vars'

module.exports = CppdCmd;
