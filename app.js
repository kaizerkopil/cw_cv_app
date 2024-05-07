//loading environment variables to be used across all the files in the project
require("dotenv").config();

//#region Requiring NPM Packages
const express = require("express");
const { body, validationResult } = require("express-validator");
const path = require("path");
const multer = require("multer");
const session = require("express-session");
const flash = require("connect-flash");
const { Op } = require("sequelize");

//#region requiring local files
const custom_bs = require("./utils/browserSync");
const seedDatabase = require("./database/seedDatabase");
const {
  sequelize,
  User,
  JobSeeker,
  Job,
  Agency,
  Application,
} = require("./database/database");

const upload = multer(); // for simplicity, storing files in memory
//#endregion
const app = express();

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

//configuring session
app.use(
  session({
    secret: "cv_app_kopil_haider_0101", // secret key to sign the session ID cookie
    saveUninitialized: true,
    resave: false,
    cookie : { maxAge : 30 * 60 * 1000 } // 30 min
  })
);
app.use(flash());

//setting the view engine
app.set("view engine", "ejs");

//global variables
let currentUserId;

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
  res.redirect('/login');
});

//agency home page route
app.get("/agency", async (req, res) => {
  //assigning currentUserId from session storage stored at login page
  if(req.session.currentUserId){
    currentUserId = req.session.currentUserId;
  }

  let getUser = await User.findOne({
    where : {
      id : currentUserId
    },
    include : [Agency]
  })

  console.log(`fetchedAgency: ${JSON.stringify(getUser, null, 2)}`);
  res.render("home_agency", { item : getUser });
});

//jobseeker home page route
app.get("/jobseeker", async (req, res) => {
  //assigning currentUserId from session storage stored at login page
  if(req.session.currentUserId){
    currentUserId = req.session.currentUserId;
  }

  let getUser = await User.findOne({
    where : {
      id : currentUserId
    },
    include : [JobSeeker]
  })

  console.log(`fetchedJobSeeker: ${JSON.stringify(getUser, null, 2)}`);
  res.render("home_jobseeker", { item : getUser });
});

//getJobPosts for jobSeekers
app.get("/getJobPosts", (req, res) => {
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
      console.error(JSON.stringify({ errorMessages: errorMessages }, null, 2));
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
  let loginErrorMessage = req.flash("loginErrorMessage");
  let regMessage = req.flash("success");
  console.log("redirected from register page: " + regMessage);
  res.render("login", {
    registrationMessage: regMessage,
    loginErrorMessage: loginErrorMessage,
  });
});

app.post("/login", async (req, res) => {
  let email = String(req.body.email).trim();
  let password = String(req.body.password).trim();
  console.log(`email: ${email}, pass: ${password}`);

  console.log("Performing User.findAll");
  let validUser = await User.findOne({
    where: {
      [Op.and]: [{ email: email }, { password: password }],
    },
  });
  console.log(`validUser: ${JSON.stringify(validUser, null, 2)}`);
  console.log(`Printed the value of validUser done.........`)
  if (validUser) {
    //login success redirect to home_jobseeker
    console.log("user with email:" + email + ", password: " + password + " is found and is valid")
    req.session.currentUserId = validUser.id;
    if(validUser.userType === 'jobseeker')  {
      console.log("redirecting to '/jobseeker'");
      res.redirect('/jobseeker');
    }  
    else if (validUser.userType === 'agency'){
      console.log("redirecting to '/agency'");
      res.redirect('/agency');
    };
  } else {
    //give error message
    req.flash("loginErrorMessage", "");
    req.flash(
      "loginErrorMessage",                                                          666676
      `User with emai: ${email} and  password: ${password} have not been found`
    );
    res.redirect("login")
  }
});

// #region Register Page for JobSeeker
app.get("/registerJobSeeker", (req, res) => {
  let initialFormData = {
    userType: "jobseeker",
    email: "",
    password: "",
    name: "",
    location: "",
    occupation: "",
  };

  res.render("registerJobSeeker", {
    showValidation: false,
    formData: initialFormData,
  });
});

app.post("/registerJobSeeker", upload.single("cv"), async (req, res) => {
  let { userType, name, email, password, jobtitle, occupation, location } =
    req.body;

  let cv = req.file; // multer provides the file info in req.file
  let skills = "";

  if (Array.isArray(req.body.skills)) {
    skills = req.body.skills.join(",");
  } else {
    skills = String(req.body.skills);
  }

  let savedFormData = {
    userType: userType,
    name: name,
    email: email,
    password: "",
    location: location,
    occupation: occupation,
  };

  //capturing user data
  let userData = {
    userType: userType,
    email: email,
    password: password,
  };

  let emailExist = await User.findOne({
    where: {
      email: userData.email,
    },
  });

  if (emailExist) {
    let msg = "Email has been taken. Please choose a different email";
    res.render("registerJobSeeker", {
      showValidation: true,
      emailErrorMsg: msg,
      formData: savedFormData,
    });
  } else {
    //saving user data to database to get generated id
    let savedUser = await User.create(userData);

    //creating jobseeker object to save
    let jobseeker = {
      name: name,
      location: location,
      occupation: occupation,
      cv: cv ? cv.originalname : "No file uploaded",
      skills: skills,
      UserId: savedUser.id,
    };

    // saving jobseeker to database
    await JobSeeker.create(jobseeker);
    console.log(`${jobseeker.name} have been saved to the database`);
    // Render login view and pass the messages (empty if none)
    req.flash(
      "success",
      "Your registration has been successful. Please try to log in now"
    );
    res.redirect("login");
  }
});

// #endregion

// #region RegisterPage for Agency
app.get("/registerAgency", (req, res) => {
  let initialFormData = {
    userType: "agency",
    email: "",
    password: "",
    name: "",
    phonenum: "",
    address: "",
    description: "",
    location: "",
  };
  res.render("registerAgency", {
    showValidation: false,
    formData: initialFormData,
  });
});

app.post("/registerAgency", upload.none(), async (req, res) => {
  let {
    userType,
    name,
    email,
    password,
    phonenum,
    address,
    description,
    location,
  } = req.body;

  let savedFormData = {
    userType: "agency",
    email: email,
    password: password,
    name: name,
    phonenum: phonenum,
    address: address,
    description: description,
    location: location,
  };

  //capturing userdata
  let userData = {
    userType: userType,
    email: email,
    password: password,
  };

  let emailExist = await User.findOne({
    where: {
      email: email,
    },
  });

  if (emailExist) {
    let msg = "Email has been taken. Please choose a different email";
    res.render("registerJobSeeker", {
      showValidation: true,
      emailErrorMsg: msg,
      formData: savedFormData,
    });
  } else {
    //saving userdata to database to generate primaryKey id
    let savedUser = await User.create(userData);
    console.log(`savedUserAgency: ${JSON.stringify(savedUser, null, 2)}`);

    //creating agency object to be saved to database
    let agency = {
      name: name,
      phonenum: phonenum,
      address: address,
      description: description,
      location: location,
      UserId: savedUser.id,
    };

    // saving agency to database
    await Agency.create(agency);
    console.log(`${agency.name} have been saved to the database`);
    // Render login view and pass the messages (empty if none)
    req.flash("success", "");
    req.flash(
      "success",
      "Registration for Agency has been successful. Please try to log in now"
    );
    res.redirect("login");
  }
});
// #endregion

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
app.get("/agencies", async (req, res) => {
  try {
    const agencies = await Agency.findAll({
      include: [Job],
    });
    res.json(agencies);
  } catch (error) {
    res.status(500).send("Error retrieving agencies");
  }
});

// Route to get all job seekers
app.get("/jobseekers", async (req, res) => {
  try {
    const jobSeekers = await JobSeeker.findAll();
    res.json(jobSeekers);
  } catch (error) {
    res.status(500).send("Error retrieving job seekers");
  }
});

// Route to get all jobs
app.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.findAll({
      include: [
        {
          model: Agency,
          attributes: ["id", "name", "email", "number"],
        },
      ],
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).send("Error retrieving jobs");
  }
});

// Route to get all applications
app.get("/applications", async (req, res) => {
  try {
    const applications = await Application.findAll({
      include: [JobSeeker, Job], // This will include JobSeeker and Job data in the results
    });
    res.json(applications);
  } catch (error) {
    res.status(500).send("Error retrieving applications");
  }
});

// #endregion

app.get('/logout', (req, res) => {
  const sessionId = req.sessionID;
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Failed to destroy session');
    }
    console.log('session has been destroyed: ' + sessionId);
    res.redirect('login');
  });
})

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  //Environment check whether to sync and seed
  console.log(
    `process.env.SEED_SYNC_DATABASE: ${process.env.SEED_SYNC_DATABASE}`
  );
  if (process.env.SEED_SYNC_DATABASE === "true") {
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
  console.log("App is fully initialized and ready to accept requests");
});
