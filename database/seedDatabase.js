const {
  User,
  Agency,
  Application,
  Job,
  JobSeeker,
  sequelize,
} = require("./database");

// Seed function
async function seedDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.log("Database tables dropped and re-created.");

    //creating users
    const userAgency1 = await User.create({
      userType: "agency",
      email: "info@creativesol.com",
      password: "abc123",
    });

    const userAgency2 = await User.create({
      userType: "agency",
      email: "contact@techinnov.com",
      password: "12345",
    });

    const userJobSeeker1 = await User.create({
      userType: "jobseeker",
      email: "john.doe@example.com",
      password: "john123",
    });

    const userJobSeeker2 = await User.create({
      userType: "jobseeker",
      email: "jane.smith@example.com",
      password: "jane123",
    });

    console.log(`SeedingDatabase_userAgency1.id: ${userAgency1.id}`);
    // Creating Agencies
    const creativeSolutions = await Agency.create({
      name: "Creative Solutions",
      phonenum: "1234567890",
      location: "New York",
      companyName: "Creative Solutions Inc.",
      address: "123 Baker Street",
      description:
        "A creative agency focusing on innovative marketing solutions.",
      UserId: userAgency1.id,
    });

    console.log(`SeedingDatabase_userAgency2.id: ${userAgency2.id}`);

    const techInnovators = await Agency.create({
      userType: "agency",
      name: "Tech Innovators",
      phonenum: "0987654321",
      location: "San Francisco",
      address: "456 Elm Street",
      description:
        "Leading tech solutions provider specializing in AI and machine learning.",
      UserId: userAgency2.id,
    });

    console.log(`SeedingDatabase_userJobSeeker1.id: ${userJobSeeker1.id}`);

    // Creating Job Seekers
    const johnDoe = await JobSeeker.create({
      userType: "jobseeker",
      name: "John Doe",
      location: "New York",
      occupation: "Software Developer",
      skills: "JavaScript, React",
      cv: "john-resume.pdf",
      UserId: userJobSeeker1.id,
    });

    console.log(`SeedingDatabase_userJobSeeker2.id: ${userJobSeeker2.id}`);

    const janeSmith = await JobSeeker.create({
      userType: "jobseeker",
      name: "Jane Smith",
      location: "San Francisco",
      occupation: "Data Scientist",
      skills: "Python, SQL",
      cv: "jane-resume.pdf",
      UserId: userJobSeeker2.id,
    });

    // Creating Jobs
    const frontendDev = await Job.create({
      title: "Frontend Developer",
      companyName: "Google",
      pay: 90000,
      description: "Develop cutting-edge front-end applications using React.",
      skillsRequired: "javaScript,Python",
      jobLocation: "London",
      AgencyId: creativeSolutions.id, // ForeignKey relation
    });

    const projectManager = await Job.create({
      title: "Frontend Developer",
      companyName: "Google",
      pay: 125000,
      description:
        "A project manager who is disciplined, reliable, sourceful and deliver projects efficiently",
      skillsRequired: "javaScript,Python",
      jobLocation: "London",
      AgencyId: creativeSolutions.id, // ForeignKey relation
    });

    const backendDev = await Job.create({
      title: "Backend Developer",
      companyName: "Microsoft",
      pay: 95000,
      description:
        "Create scalable back-end services using Node.js and Express.",
      skillsRequired: "javaScript,Python",
      jobLocation: "London",
      AgencyId: techInnovators.id, // ForeignKey relation
    });

    const systemDesigner = await Job.create({
      title: "Senior System Designer",
      companyName: "Microsoft",
      pay: 150000,
      description:
        "Create robust and architectural System designs which works flawlessly",
      skillsRequired: "javaScript,Python",
      jobLocation: "London",
      AgencyId: techInnovators.id, // ForeignKey relation
    });

    // Creating Applications
    await Application.create({
      JobSeekerId: johnDoe.id, // ForeignKey relation
      JobId: frontendDev.id, // ForeignKey relation
      applicationDate: new Date(),
      statusOfApplication: "Pending",
    });

    await Application.create({
      JobSeekerId: johnDoe.id, // ForeignKey relation
      JobId: projectManager.id, // ForeignKey relation
      applicationDate: new Date(),
      statusOfApplication: "Pending",
    });

    await Application.create({
      JobSeekerId: janeSmith.id, // ForeignKey relation
      JobId: systemDesigner.id, // ForeignKey relation
      applicationDate: new Date(),
      statusOfApplication: "Pending",
    });

    await Application.create({
      JobSeekerId: janeSmith.id, // ForeignKey relation
      JobId: backendDev.id, // ForeignKey relation
      applicationDate: new Date(),
      statusOfApplication: "Accepted",
    });

    console.log("Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

module.exports = seedDatabase;
