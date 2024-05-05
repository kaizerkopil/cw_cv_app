//#region Require statements
const express = require("express");
const path = require("path");
const custom_bs = require("./utils/browserSync");
const { sequelize, JobSeeker, Job, Agency, Application } = require('./database/database');
const seedDatabase = require('./database/seedDatabase');
//#endregion
const app = express();

console.log('Seed Database Configuration:', process.env.npm_package_config_syncSeedDb);
const PORT = process.env.PORT || 5050;
custom_bs.initialiseBrowserSync();

//express.urlencoded middleware to parse URL-encoded bodies (from form submissions):
app.use(express.urlencoded({ extended: true }));
//#region Adding static files to app
app.use("/css", express.static("./public/css"));
app.use("/js", express.static("./public/js"));
app.use("/img", express.static("./public/img"));
app.use("/bootstrap", express.static("./node_modules/bootstrap/dist"));
app.use("/utils", express.static("./utils"));
//#endregion

//setting the view engine
app.set("view engine", "ejs");

// Define a dummy user object (replace with data from your database)
const user = {
  name: "John Doe",
  email: "john@example.com",
  skills: "JavaScript, HTML, CSS",
  number: "03203210",
  location: "london",
  occupation: "Web Developer",
  cv: "/img/CV.pdf", // Path to the uploaded CV file
};
const agency = require("./public/js/dummyDataAgency");
const jobPosts = require("./public/js/dummyJobPosts");

//#region Configuring the app routes

//home page route
app.get("/", (req, res) => {
  res.render("home", req.query);
});

//getJobSeekers for recruiters
app.get("/getJobSeekers", (req, res) => {
  let jobseekers = [
    "Stareo Mark",
    "Marshal Jorun",
    "Marko Patel",
    "Nisha Stuash",
  ];
  res.render("getJobSeekers", { items: jobseekers }, (error, ejsPage) => {
    if (error) {
      console.log(`The error thrown by page : ${error.message}`);
      res.status(500).send("An error occurred");
    } else {
      res.send(ejsPage);
    }
  });
});

//getJobPosts for jobSeekers
app.get("/getJobPosts", (req, res) => {
  let jobs = ["job1", "job2", "job3", "job4"];
  res.render("getJobPosts", { items: jobPosts });
});
// Route to show job post details
app.get("/job-post/:id", (req, res) => {
  const jobId = req.params.id;
  const job = jobPosts.find((job) => job.id === parseInt(jobId));
  if (!job) {
    res.status(404).send("Job post not found");
    return;
  }
  res.render("jobPostDetail", { job });
});

//contactUs Page
app.get("/contactUs", (req, res) => {
  res.render("contactUs");
});

//login Page
app.get("/login", (req, res) => {
  res.render("login");
});

//Register Page
app.get("/register", (req, res) => {
  res.render("register");
});

//Profile Page for job seekers
app.get("/profile", (req, res) => {
  res.render("profile", { user });
});

//Job Posting for recruitment Agency
app.get("/jobPosting", (req, res) => {
  res.render("jobPosting", { user });
});

//Recruitment Agency Profile
app.get("/recruitmentAgencyProfile", (req, res) => {
  res.render("recruitmentAgencyProfile", { agency });
});

// login page post route
app.post("/login", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body; // Extract email and password from form submission

  res.redirect("/");
});
// POST route for job posting form
app.post("/post-job", (req, res) => {
  const { title, pay, location, skills, description } = req.body;

  // Save job details to the database (Replace with your database logic)

  // Redirect to a confirmation page or dashboard
  res.redirect("/dashboard");
});
//#endregion

// #region test routes to check all the data is coming from the database correctly

// Route to get all agencies
app.get('/agencies', async (req, res) => {
    try {
        const agencies = await Agency.findAll({
          include: [Job]
        });
        res.json(agencies);
    } catch (error) {
        res.status(500).send('Error retrieving agencies');
    }
});

// Route to get all job seekers
app.get('/jobseekers', async (req, res) => {
    try {
        const jobSeekers = await JobSeeker.findAll();
        res.json(jobSeekers);
    } catch (error) {
        res.status(500).send('Error retrieving job seekers');
    }
});

// Route to get all jobs
app.get('/jobs', async (req, res) => {
  try {
      const jobs = await Job.findAll({
        include : [{
          model : Agency,
          attributes : ['name', 'email', 'number']
        }]
      });
      res.json(jobs);
  } catch (error) {
      res.status(500).send('Error retrieving jobs');
  }
});

// Route to get all applications
app.get('/applications', async (req, res) => {
  try {
      const applications = await Application.findAll({
          include: [JobSeeker, Job]  // This will include JobSeeker and Job data in the results
      });
      res.json(applications);
  } catch (error) {
      res.status(500).send('Error retrieving applications');
  }
});

// #endregion



app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  //Environment check whether to sync and seed
  if(process.env.npm_package_config_syncSeedDb){
  try {
    // Synchronize database
    await sequelize.sync({ force: true });
    console.log("Database tables created successfully!");

    // Seed the database
    await seedDatabase();
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
}
  console.log('App is fully initialized and ready to accept requests');
});
