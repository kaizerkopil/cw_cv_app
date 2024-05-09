const user = require('../models/testModels/tstUser.js');
const error = require('../utils/AppValidationError.js');

describe('createUser', () =>{
    test('ALL PARAMETERS PASSED VALID, Should return true', () => {
        //Arrange
        let email = 'jackson@gmail.com';
        let password = '12345';
        let userType = 'JobSeeler';
     
        let expectedResult = true;
        //Act
        let actualResult = user.createUser(email, password, userType)
        //Assert
        expect(actualResult).toBe(expectedResult);
    });

    test('email is invalid it should throw AppValidation Error', () => {
        let email = '';
        let password = '12345';
        let userType = 'INFO SOLUTIONS LIMITED';
      
        expect(() => user.createUser(email, password, userType)).toThrow(error.AppValidationError);
        expect(() => user.createUser(email, password, userType)).toThrow("Invalid email");
    });


    test('password is invalid it should throw AppValidation Error', () => {
        let email = 'user@gmail.com';
        let password = '';
        let userType = 'INFO SOLUTIONS LIMITED';
      
        expect(() => user.createUser(email, password, userType)).toThrow(error.AppValidationError);
        expect(() => user.createUser(email, password, userType)).toThrow("Invalid password");
    });

    
    test('userType is invalid it should throw AppValidation Error', () => {
        let email = 'great@gmail.com';
        let password = '12345';
        let userType = '';
      
        expect(() => user.createUser(email, password, userType)).toThrow(error.AppValidationError);
        expect(() => user.createUser(email, password, userType)).toThrow("Invalid userType");
    });
})