const error = require('../../utils/AppValidationError');

exports.createJobPost = function (title, pay, companyName, description, skillsRequired, jobLocation){
    if(title == null || title == undefined || title.length == 0 || title.length > 50){
        throw new error.AppValidationError("Invalid title");
    }else if(pay == null || pay == undefined || isNaN(Number(pay)) || pay < 0){
        throw new error.AppValidationError("Invalid pay");
    }else if(companyName == null || companyName == undefined || companyName.length == 0 || companyName.length > 50){
        throw new error.AppValidationError("Invalid companyName");
    }else if(description == null || description == undefined || description.length == 0 || description.length > 250){
        throw new error.AppValidationError("Invalid description");
    }else if(skillsRequired == null || skillsRequired == undefined || skillsRequired == 0 || skillsRequired.length > 250){
        throw new error.AppValidationError("Invalid skillsRequired");
    }else if(jobLocation == null || jobLocation == undefined || jobLocation == 0 || jobLocation.length > 50){
        throw new error.AppValidationError("Invalid jobLocation");
    }
    else{
        console.log("new JobPost Created");
        return true;
    }
}