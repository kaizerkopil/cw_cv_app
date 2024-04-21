//user.test.js
const {calculateAge} = require('../models/user')

describe('calculateAge', () =>{
    it('calculates the correct age based on the birth year', 
    () => {
        const birthYear = 1990;
        const expectedAge = new Date().getFullYear() - birthYear;
        console.info(`user.test.describe.calculateAge.1 : ", ${expectedAge}`);
        const age = calculateAge(birthYear);
        expect(age).toBe(expectedAge);
    });

    it('returns 0 when the current year is given as birth year', 
    () => {
        const currentYear = new Date().getFullYear();
        const age = calculateAge(currentYear);
        expect(age).toBe(0);
    });
});
