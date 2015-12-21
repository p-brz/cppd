var should = require('should')
var path = require('path')

CppDeps = require('../lib/CppDeps.js')

PKG_REL_PATH = './test/data/installed_pkg';
PKG_ABSPATH  = path.resolve(PKG_REL_PATH),
SUBPKGS_PATH = path.join(PKG_REL_PATH, 'node_modules')

SUBPKGS = {
    'subpkg1' : ['incdir', 'libdir', 'srcdir'],
    'other'   : ['include', null, 'src']
}

PKG_DEPS = {}

for(subp in SUBPKGS){
    pkgDirs = {};

    pkgPath = path.join(SUBPKGS_PATH, subp);
    dirs = ['include', 'lib', 'src']

    for(i=0; i < dirs.length; ++i){
        if(SUBPKGS[subp][i]){
            pkgDirs[dirs[i]] = SUBPKGS[subp][i]; //path.join(pkgPath, SUBPKGS[subp][i])
        }
    }

    PKG_DEPS[subp] = pkgDirs;
}

describe("CppDeps", function(){
    cppdeps = CppDeps();

    describe("#findDependenciesPaths", function(){
        context("given some installed package", function(){
            installedPackage = './test/data/installed_pkg'

            it("it should travel the dependencies of that package and return a list of their cpp dirs"
            , function(done){
                cppdeps.findDependenciesPaths(installedPackage, function(err, depsPaths){
                    console.log("depsPaths:", depsPaths)
                    depsPaths.should.be.an.Object;
                    depsPaths.should.not.be.an.Array;

                    for(pkgDep in PKG_DEPS){
                        expected = PKG_DEPS[pkgDep]
                        dPath = depsPaths[pkgDep]
                        console.log("\"", dPath, "\" == ", PKG_DEPS[pkgDep] )
                        dPath.should.have.properties(expected);
                    }


                    done();
                });
            });
        });
    });
});
