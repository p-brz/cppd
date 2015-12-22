var should = require('should')
var child_process = require('child_process');
var path = require('path')

const TESTPROJECT_DIR = "./test/data/sample_project"

const CPPD = 'cppd.js'
const CPPD_PATH = path.relative(path.resolve(TESTPROJECT_DIR), path.resolve(CPPD))

describe("cppd command line", function() {
	describe("env command", function() {

		env_cmd = "node " + CPPD_PATH + " env"

		context("when running the command on a npm project root", function() {
			console.log("from ", TESTPROJECT_DIR, "exec: ", env_cmd);
			stdout = child_process.execSync(env_cmd, {
				cwd: TESTPROJECT_DIR
			});
			process.stdout.write(stdout);
		});
	});
});
