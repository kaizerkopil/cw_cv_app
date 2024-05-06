//loading environment variables
//require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');

// Initialize the Sequelize instance for SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database/database.sqlite', // Ensure the path to the storage file is correct
  logging : process.env.SEQUELIZE_LOGGING === 'true'
});

// Import model definition functions from model files
const defineJobSeeker = require('../models/jobseeker');
const defineJob = require('../models/job');
const defineAgency = require('../models/agency');
const defineApplication = require('../models/application');

// Instantiate models using the imported functions
const JobSeeker = defineJobSeeker(sequelize, DataTypes);
const Job = defineJob(sequelize, DataTypes);
const Agency = defineAgency(sequelize, DataTypes);
const Application = defineApplication(sequelize, DataTypes);

// Define relationships between models
JobSeeker.belongsToMany(Job, { through: Application });
Job.belongsToMany(JobSeeker, { through: Application });

JobSeeker.hasMany(Application);
Application.belongsTo(JobSeeker);

Job.hasMany(Application);
Application.belongsTo(Job);

Agency.hasMany(Job);
Job.belongsTo(Agency);

// // Synchronize all defined models with the database
// sequelize.sync({ force: true }) // `force: true` will drop existing tables and recreate them
//   .then(() => {
//     console.log("Database tables created successfully!");
//   })
//   .catch((error) => {
//     console.error("Error synchronizing the database:", error);
//   });

// Export the sequelize instance and models for use elsewhere in the application
module.exports = {
  sequelize,
  JobSeeker,
  Job,
  Agency,
  Application
};
