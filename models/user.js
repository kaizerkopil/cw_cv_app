/**
 * Represents a user with name, age, and adult status.
 */
class User {
    /**
     * Create a User.
     * @param {string} name - The name of the user.
     * @param {number} age - The age of the user.
     * @param {boolean} isADult - the check to see if the user is an adult
     */
    constructor(name, age) {
        this.name = name;
        this.age = age;
        this.isAdult = age >= 18;
    }

    /**
     * 
     * @param {Date} birthYear - the year from the date
     * @returns {Date} - in year
     */
    static calculateAge(birthYear){
        const currentYear = new Date().getFullYear();
        return currentYear - birthYear;
    }
}

//user.js
function calculateAge(birthYear){
    
}

module.exports = {
    calculateAge,
    User
}