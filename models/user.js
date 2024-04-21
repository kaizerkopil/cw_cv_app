//user.js
function calculateAge(birthYear){
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
}

module.exports = {
    calculateAge,
}