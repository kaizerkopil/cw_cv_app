const animal = require('../models/animal.js');

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
})