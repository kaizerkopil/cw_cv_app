const error = require('../../utils/AppValidationError');

exports.updateProfile = function (name, location, occupation, skills, cv){
    if(name == null || name == undefined || name.length == 0 || name.length > 50){
        throw new error.AppValidationError("Invalid name");
    }else if(location == null || location == undefined || location.length == 0 || location.length > 50){
        throw new error.AppValidationError("Invalid location");
    }else if(occupation == null || occupation == undefined || occupation.length == 0 || occupation.length > 250){
        throw new error.AppValidationError("Invalid occupation");
    }else if(skills == null || skills == undefined || skills == 0 || skills.length > 250){
        throw new error.AppValidationError("Invalid skills");
    }else if(cv == null || cv == undefined || cv == 0 || cv.length > 50){
        throw new error.AppValidationError("Invalid cv");
    }
    else{
        console.log("Jobseeker Profile has been Updated successfully");
        return true;
    }
}