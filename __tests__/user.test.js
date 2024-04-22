//user.test.js
const {User} = require('../models/user')

describe('calculateAge', () =>{
    test('calculates the correct age based on the birth year', 
    () => {
        //Arrange
        const birthYear = 1990;
        const expectedAge = new Date().getFullYear() - birthYear;

        //Act
        const age = User.calculateAge(birthYear);

        //Assert
        expect(age).toBe(expectedAge);
    });

    test('returns 0 when the current year is given as birth year', 
    () => {
        const currentYear = new Date().getFullYear();
        const age = User.calculateAge(currentYear);
        expect(age).toBe(0);
    });
});

