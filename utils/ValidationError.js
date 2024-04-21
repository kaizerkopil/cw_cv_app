class ValidationError extends Error{
    constructor(message){
        super(message);
        this.name = "ValidationError";
    }
}

function validateName(name){
    if(name == null || name.trim().length == 0){
        throw new ValidationError("Invalid name");
    }
}

module.exports = {
    validateName,
}

export { validateName }