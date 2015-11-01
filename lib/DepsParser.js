var readJson = require('read-package-json')
var fs = require('fs')
var path = require('path')

DEFAULT_DIRS = {
    include : 'include', 
    src : 'src', 
    lib : 'lib'
}

function DepsParser(){
    this.extractDirs = function(packageJson, callback){

        readJson(packageJson, null, false, function (er, data) {
            directories = (data && data.directories) ? data.directories : {};
            
            if(typeof(callback) === "function"){
                callback(er, directories);
            }
        });
    }
    
    this.parseToVars = function(projName, dirName, callback){
        parse(projName, dirName, function(err, dirs){
            vars = null;
            if(!err){
                vars = generateVars(projName, dirs);
            }
            else{
            }
            _forwardCallback(callback, err, vars);
        });
    };
    
    this.parse = function(projectName, dirName, callback){
        if(typeof(callback) === "undefined" && typeof(dirName) === "function"){
            callback = dirName;
            dirName = null;
        }
        
        dirName = dirName ? dirName : "node_modules";
        projectDir = path.join(dirName, projectName);
        pckgJson =  path.join(projectDir, "package.json");
        
        extractDirs(pckgJson, function(err, dirs){
            _lookDirsConventions(projectDir, dirs, callback);
        });
    };
    
    this.generateVars = function(projName, dirs){
        vars = {};
        for(dirProp in DEFAULT_DIRS){
            if(dirProp in dirs){
                key = projName + "_" + dirProp;
                vars[key] = dirs[dirProp] 
            }
        }
        return vars;
    };
    
    this._lookDirsConventions= function(projectDir, dirs, callback){
        for (var d in DEFAULT_DIRS){
            if(! (d in dirs)){
                dir = DEFAULT_DIRS[d];
                
                dirPath = path.join(projectDir, dir)
                if(_dirExist(dirPath)){
                    dirs[d] = dir
                }
            }
        }         
        _forwardCallback(callback, null, dirs);
    }
    
    this._forwardCallback = function(callback, err, data){
        if(typeof(callback) === "function"){
            callback(err, data);
        }
    }
    
    this._dirExist = function(path){
        try {
            stats = fs.statSync(path);
            return stats.isDirectory();
        }
        catch (e) {
            if(e.code === "ENOENT"){
                return false;
            }
            throw e;
        }
    }
    
    return this;
}//DepsParser

module.exports = DepsParser;
