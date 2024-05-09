const agency = require('../models/testModels/tstAgency.js');
const error = require('../utils/AppValidationError.js');

describe('createJobPost', () =>{
    test('ALL PARAMETERS PASSED VALID, Should return true', () => {
        //Arrange
        let title = 'Software Developer';
        let pay = 99999;
        let companyName = 'INFO SOLUTIONS LIMITED';
        let description = '2 years skills experience is required. Relocation is expected';
        let skillsRequired = 'javaScript, python, CSharp';
        let jobLocation = 'New York';

        let expectedResult = true;
        //Act
        let actualResult = agency.createJobPost(title, pay, companyName, description, skillsRequired, jobLocation)
        //Assert
        expect(actualResult).toBe(expectedResult);
    });

    test('title is invalid it should throw AppValidation Error', () => {
        let title = '';
        let pay = 99999;
        let companyName = 'INFO SOLUTIONS LIMITED';
        let description = '2 years skills experience is required. Relocation is expected';
        let skillsRequired = 'javaScript, python, CSharp';
        let jobLocation = 'New York';
        expect(() => agency.createJobPost(title, pay, companyName, description, skillsRequired, jobLocation)).toThrow(error.AppValidationError);
        expect(() => agency.createJobPost(title, pay, companyName, description, skillsRequired, jobLocation)).toThrow("Invalid title");
    });

    test('pay is invalid it should throw AppValidation Error', () => {
        let title = 'Software Developer';
        let pay = 'string passed';
        let companyName = 'INFO SOLUTIONS LIMITED';
        let description = '2 years skills experience is required. Relocation is expected';
        let skillsRequired = 'javaScript, python, CSharp';
        let jobLocation = 'New York';
        expect(() => agency.createJobPost(title, pay, companyName, description, skillsRequired, jobLocation)).toThrow(error.AppValidationError);
        expect(() => agency.createJobPost(title, pay, companyName, description, skillsRequired, jobLocation)).toThrow("Invalid pay");
    });

    test('companyName is invalid it should throw AppValidation Error', () => {
        let title = 'Software Developer';
        let pay = 99999;
        let companyName = '';
        let description = '2 years skills experience is required. Relocation is expected';
        let skillsRequired = 'javaScript, python, CSharp';
        let jobLocation = 'New York';
        expect(() => agency.createJobPost(title, pay, companyName, description, skillsRequired, jobLocation)).toThrow(error.AppValidationError);
        expect(() => agency.createJobPost(title, pay, companyName, description, skillsRequired, jobLocation)).toThrow("Invalid companyName");
    });

    test('description is invalid it should throw AppValidation Error', () => {
        let title = 'Software Developer';
        let pay = 99999;
        let companyName = 'INFO SOLUTIONS LIMITED';
        let description = '';
        let skillsRequired = 'javaScript, python, CSharp';
        let jobLocation = 'New York';
        expect(() => agency.createJobPost(title, pay, companyName, description, skillsRequired, jobLocation)).toThrow(error.AppValidationError);
        expect(() => agency.createJobPost(title, pay, companyName, description, skillsRequired, jobLocation)).toThrow("Invalid description");
    });

    test('skillsRequired is invalid it should throw AppValidation Error', () => {
        let title = 'Software Developer';
        let pay = 99999;
        let companyName = 'INFO SOLUTIONS LIMITED';
        let description = '2 years skills experience is required. Relocation is expected';
        let skillsRequired = '';
        let jobLocation = 'New York';
        expect(() => agency.createJobPost(title, pay, companyName, description, skillsRequired, jobLocation)).toThrow(error.AppValidationError);
        expect(() => agency.createJobPost(title, pay, companyName, description, skillsRequired, jobLocation)).toThrow("Invalid skillsRequired");
    });

    test('jobLocation is invalid it should throw AppValidation Error', () => {
        let title = 'Software Developer';
        let pay = 99999;
        let companyName = 'INFO SOLUTIONS LIMITED';
        let description = '2 years skills experience is required. Relocation is expected';
        let skillsRequired = 'javaScript, python, CSharp';
        let jobLocation = '';
        expect(() => agency.createJobPost(title, pay, companyName, description, skillsRequired, jobLocation)).toThrow(error.AppValidationError);
        expect(() => agency.createJobPost(title, pay, companyName, description, skillsRequired, jobLocation)).toThrow("Invalid jobLocation");
    });
})