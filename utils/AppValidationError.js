class AppValidationError extends Error{
    constructor(message){
        super(message);
        this.name = "AppValidationError";
    }
}

function validateName(name){
    if(name == null || name.trim().length == 0){
        throw new AppValidationError("Invalid name");
    }
}

module.exports = {
    validateName,
    AppValidationError
}