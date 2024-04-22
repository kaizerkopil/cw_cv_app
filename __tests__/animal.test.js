const animal = require('../models/animal.js');
const error = require('../utils/AppValidationError.js');

describe('registerAnimal', () =>{
    test('value name and location input results successful registration', () => {
        //Arrange
        let name = 'jackson';
        let location = 'colliers wood'
        let expectedResult = true;
        //Act
        let actualResult = animal.registerAnimal(name, location);
        //Assert
        expect(actualResult).toBe(expectedResult);
    });

    test('throws AppValidationError if the name is empty', () => {
        let name = "";
        let location = "valid_location_passed";
        expect(() => animal.registerAnimal(name, location)).toThrow(error.AppValidationError);
        expect(() => animal.registerAnimal(name, location)).toThrow("Invalid name");
    });

    test('throws AppValidationError if the location is empty', () => {

        //Arrange
        let name = "valid_name_passed";
        let location = "";

        //Act and Assert
        expect(() => animal.registerAnimal(name, location)).toThrow(error.AppValidationError);
        expect(() => animal.registerAnimal(name, location)).toThrow("Invalid location");
    });
})