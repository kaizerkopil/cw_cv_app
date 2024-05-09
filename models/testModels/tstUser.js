const error = require('../../utils/AppValidationError');

exports.createUser = function (email, password, userType){
    if(email == null || email == undefined || email.length == 0 || email.length > 50){
        throw new error.AppValidationError("Invalid email");
    }else if(password == null || password == undefined || password.length == 0 || password.length > 50){
        throw new error.AppValidationError("Invalid password");
    }else if(userType == null || userType == undefined || userType.length == 0 || userType.length > 50){
        throw new error.AppValidationError("Invalid userType");
    }
    else{
        console.log("new User Created");
        return true;
    }
}