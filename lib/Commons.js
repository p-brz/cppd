module.exports = {

forwardCallback : function(callback, err, data){
    if(typeof(callback) === "function"){
        callback(err, data);
    }
}

}//module
