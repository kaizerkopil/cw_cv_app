const error = require('../utils/AppValidationError');

exports.registerAnimal = function (name, location){
    if(name == null || name == undefined || name.length == 0){
        throw new error.AppValidationError("Invalid name");
    }else if(location == null || location == undefined || location.length == 0){
        throw new error.AppValidationError("Invalid location");
    }
    else{
        console.log("new Animal created()");
        return true;
    }
}