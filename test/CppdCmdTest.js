var should  = require('should')
var path    = require('path')
var fs      = require('fs')
envObject   = require('env-object')
CppdCmd     = require('../lib/CppdCmd.js')

describe("CppdCmd", function() {
    var cppdCmd = CppdCmd();
	describe("#run", function() {

		context("given an installed c++ npm project with dependencies", function() {
            const TESTPROJECT_DIR = "./test/data/installed_pkg"

        context("when setting the cwd option to that project root", function(){
            options = {cwd : TESTPROJECT_DIR}
            it("should create an variables file at that dir with the directories of the project dependencies", function(done){
                expectedFilepath = path.join(TESTPROJECT_DIR, CppdCmd.DEFAULT_FILENAME)

                subprojs_dirs = {
                    other   : path.join(TESTPROJECT_DIR, "node_modules", "other"),
                    subpkg1 : path.join(TESTPROJECT_DIR, "node_modules", "subpkg1")
                }

                expectedVariables = {
                    other_include : path.resolve(subprojs_dirs.other, "include"),
                    other_src     : path.resolve(subprojs_dirs.other, "src"),
                    subpkg1_include : path.resolve(subprojs_dirs.subpkg1, "incdir"),
                    subpkg1_src     : path.resolve(subprojs_dirs.subpkg1, "srcdir"),
                    subpkg1_lib     : path.resolve(subprojs_dirs.subpkg1, "libdir")
                }

                cppdCmd.run(options, function(err){
                    should.not.exist(err);

                    fileStats = fs.statSync(expectedFilepath);

                    fileStats.isFile().should.be.true();

                    envObject.read(expectedFilepath).then(function(varData){
                        varData.should.be.eql(expectedVariables);
                        done();
                    })
                    .catch(done);
                })
            });
        });
		});
	});
});
