//#region Require statements
const express = require("express");
const { body, validationResult } = require("express-validator");
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
// Include URL-encoded Middleware -> This will parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
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
  let currentUser = 'jobseeker';
  if(currentUser === 'jobseeker'){
    res.redirect('/jobseeker')
  }else{
    res.redirect('/agency')
  }
  //res.render("home", req.query);
});

//agency home page route
app.get("/agency", (req, res) => {
  res.render("home_agency", req.query);
});

//jobseeker home page route
app.get("/jobseeker", (req, res) => {
  res.render("home_jobseeker", req.query);
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

// #region registerUser Page
let cust = {
  name: "",
  age: "",
  occupation: "",
  salary: "",
};

app.get("/registerUser", (req, res) => {
  console.log("registerUser getMethod triggered");
  res.render("registerUser", { showValidation: false, cust });
});

app.post(
  "/registerUser",
  // Name validation: must not be empty
  body("name_field")
    .isLength({ min: 3 })
    .withMessage("Name is required to be 3 characters long")
    .trim()
    .escape(),
  // Age validation: must be a positive integer
  body("age_field")
    .isInt({ gt: 0 })
    .withMessage("Age must be a positive integer"),
  // Occupation validation: must not be empty
  body("occupation_field")
    .not()
    .isEmpty()
    .withMessage("Occupation cannot be empty")
    .trim()
    .escape(),
  // Salary validation: must be a positive number
  body("salary_field")
    .isFloat({ gt: 0 })
    .withMessage("Salary must be positive and cannot be zero"),
  (req, res) => {
    cust.name = req.body.name_field;
    cust.age = req.body.age_field;
    cust.occupation = req.body.occupation_field;
    cust.salary = req.body.salary_field;

    //check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let errorMessages = {
        nameErrMsg: "",
        ageErrMsg: "",
        occupationErrMsg: "",
        salaryErrMsg: "",
      };
      let errorArray = errors.array();
      errorArray.forEach((error) => {
        switch (error.path) {
          case "name_field":
            errorMessages.nameErrMsg = error.msg;
            break;
          case "age_field":
            errorMessages.ageErrMsg = error.msg;
            break;
          case "occupation_field":
            errorMessages.occupationErrMsg = error.msg;
            break;
          case "salary_field":
            errorMessages.salaryErrMsg = error.msg;
            break;
          default:
            break;
        }
      });
      console.error(JSON.stringify({errorMessages : errorMessages}, null, 2))
      res.render("registerUser", { showValidation: true, errorMessages, cust });
    } else {
      //send status code OK with cust details
      return res.status(200).json({ statusCode: 200, cust: cust });
    }
  }
);

// #endregion registerUser Page

//login Page
app.get("/login", (req, res) => {
  res.render("login");
});

//Register Page
app.get("/register", (req, res) => {
  res.render("register");
});

//Profile Page for job seekers
app.get("/jobSeekerProfile", (req, res) => {
  res.render("jobSeekerProfile", { user });
});

//Upload Job Post for recruitment Agency
app.get("/uploadJobPost", (req, res) => {
  res.render("uploadJobPost", { user });
});

//Recruitment Agency Profile
app.get("/agencyProfile", (req, res) => {
  res.render("agencyProfile", { agency });
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
          attributes : ['id', 'name', 'email', 'number']
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
