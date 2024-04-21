const animal = require('../models/animal.js');
const error = require('../utils/AppValidationError.js');

describe('registerAnimal', () =>{
    it('value name and location input results successful registration', () => {
        //Arrange
        let name = 'jackson';
        let location = 'colliers wood'
        let expectedResult = true;
        //Act
        let actualResult = animal.registerAnimal(name, location);
        //Assert
        expect(actualResult).toBe(expectedResult);
    });

    it('throws AppValidationError if the name is empty', () => {
        let name = "";
        let location = "valid_location_passed";
        expect(() => animal.registerAnimal(name, location)).toThrow(error.AppValidationError);
        expect(() => animal.registerAnimal(name, location)).toThrow("Invalid name");
    });

    it('throws AppValidationError if the location is empty', () => {
        let name = "valid_name_passed";
        let location = "";
        expect(() => animal.registerAnimal(name, location)).toThrow(error.AppValidationError);
        expect(() => animal.registerAnimal(name, location)).toThrow("Invalid location");

    });
})