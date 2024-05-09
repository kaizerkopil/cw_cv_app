const jobseeker = require('../models/testModels/tstJobseeker.js');
const error = require('../utils/AppValidationError.js');

describe('updateJobSeekerProfile', () =>{
    test('ALL PARAMETERS PASSED VALID, Should return true', () => {
        //Arrange
        let name = 'Rohit Verma';
        let location = 'London';
        let occupation = 'Software Developer';
        let skills = 'Java, CSharp';
        let cv = 'rohit_cv.pdf';

        let expectedResult = true;
        //Act
        let actualResult = jobseeker.updateProfile(name, location, occupation, skills, cv)
        //Assert
        expect(actualResult).toBe(expectedResult);
    });

    test('name is invalid it should throw AppValidation Error', () => {
        let name = '';
        let location = 'London';
        let occupation = 'Software Developer';
        let skills = 'Java, CSharp';
        let cv = 'rohit_cv.pdf';
        expect(() => jobseeker.updateProfile(name, location, occupation, skills, cv)).toThrow(error.AppValidationError);
        expect(() => jobseeker.updateProfile(name, location, occupation, skills, cv)).toThrow("Invalid name");
    });

    test('location is invalid it should throw AppValidation Error', () => {
        let name = 'Rohit Verma';
        let location = '';
        let occupation = 'Software Developer';
        let skills = 'Java, CSharp';
        let cv = 'rohit_cv.pdf';
        expect(() => jobseeker.updateProfile(name, location, occupation, skills, cv)).toThrow(error.AppValidationError);
        expect(() => jobseeker.updateProfile(name, location, occupation, skills, cv)).toThrow("Invalid location");
    });

    test('occupation is invalid it should throw AppValidation Error', () => {
        let name = 'Rohit Verma';
        let location = 'London';
        let occupation = '';
        let skills = 'Java, CSharp';
        let cv = 'rohit_cv.pdf';
        expect(() => jobseeker.updateProfile(name, location, occupation, skills, cv)).toThrow(error.AppValidationError);
        expect(() => jobseeker.updateProfile(name, location, occupation, skills, cv)).toThrow("Invalid occupation");
    });

    test('skills is invalid it should throw AppValidation Error', () => {
        let name = 'Rohit Verma';
        let location = 'London';
        let occupation = 'Software Developer';
        let skills = '';
        let cv = 'rohit_cv.pdf';
        expect(() => jobseeker.updateProfile(name, location, occupation, skills, cv)).toThrow(error.AppValidationError);
        expect(() => jobseeker.updateProfile(name, location, occupation, skills, cv)).toThrow("Invalid skills");
    });

    test('cv is invalid it should throw AppValidation Error', () => {
        let name = 'Rohit Verma';
        let location = 'London';
        let occupation = 'Software Developer';
        let skills = 'Java, CSharp';
        let cv = '';
        expect(() => jobseeker.updateProfile(name, location, occupation, skills, cv)).toThrow(error.AppValidationError);
        expect(() => jobseeker.updateProfile(name, location, occupation, skills, cv)).toThrow("Invalid cv");
    });
})