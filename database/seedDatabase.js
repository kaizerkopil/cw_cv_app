const { Agency, Application, Job, JobSeeker, sequelize } = require('./database');

// Seed function
async function seedDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.log("Database tables dropped and re-created.");

    // Creating Agencies
    const creativeSolutions = await Agency.create({
      name: "Creative Solutions",
      email: "info@creativesol.com",
      number: "1234567890",
      location: "New York",
      companyName: "Creative Solutions Inc.",
      address: "123 Baker Street",
      companyDescription: "A creative agency focusing on innovative marketing solutions."
    });

    const techInnovators = await Agency.create({
      name: "Tech Innovators",
      email: "contact@techinnov.com",
      number: "0987654321",
      location: "San Francisco",
      address: "456 Elm Street",
      companyDescription: "Leading tech solutions provider specializing in AI and machine learning."
    });

    // Creating Job Seekers
    const johnDoe = await JobSeeker.create({
      name: "John Doe",
      email: "john.doe@example.com",
      location: "New York",
      occupation: "Software Developer",
      skills: "JavaScript, React",
      CV: "john-resume.pdf"
    });

    const janeSmith = await JobSeeker.create({
      name: "Jane Smith",
      email: "jane.smith@example.com",
      location: "San Francisco",
      occupation: "Data Scientist",
      skills: "Python, SQL",
      CV: "jane-resume.pdf"
    });

    // Creating Jobs
    const frontendDev = await Job.create({
      title: "Frontend Developer",
      companyName: "Google",
      pay: 90000,
      description: "Develop cutting-edge front-end applications using React.",
      AgencyId: creativeSolutions.id // ForeignKey relation
    });

    const projectManager = await Job.create({
      title: "Frontend Developer",
      companyName: "Google",
      pay: 125000,
      description: "A project manager who is disciplined, reliable, sourceful and deliver projects efficiently",
      AgencyId: creativeSolutions.id // ForeignKey relation
    });

    const backendDev = await Job.create({
      title: "Backend Developer",
      companyName: "Microsoft",
      pay: 95000,
      description: "Create scalable back-end services using Node.js and Express.",
      AgencyId: techInnovators.id // ForeignKey relation
    });

    const systemDesigner = await Job.create({
      title: "Senior System Designer",
      companyName: "Microsoft",
      pay: 150000,
      description: "Create robust and architectural System designs which works flawlessly",
      AgencyId: techInnovators.id // ForeignKey relation
    });

    // Creating Applications
    await Application.create({
      JobSeekerId: johnDoe.id, // ForeignKey relation
      JobId: frontendDev.id, // ForeignKey relation
      applicationDate: new Date(),
      statusOfApplication: "Pending"
    });

    await Application.create({
      JobSeekerId: johnDoe.id, // ForeignKey relation
      JobId: projectManager.id, // ForeignKey relation
      applicationDate: new Date(),
      statusOfApplication: "Pending"
    });

    await Application.create({
      JobSeekerId: janeSmith.id, // ForeignKey relation
      JobId: systemDesigner.id, // ForeignKey relation
      applicationDate: new Date(),
      statusOfApplication: "Pending"
    });

    await Application.create({
      JobSeekerId: janeSmith.id, // ForeignKey relation
      JobId: backendDev.id, // ForeignKey relation
      applicationDate: new Date(),
      statusOfApplication: "Accepted"
    });

    console.log("Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

module.exports = seedDatabase;
