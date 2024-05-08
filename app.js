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
    cookie: { maxAge: 30 * 60 * 1000 }, // 30 min
  })
);
app.use(flash());

//setting the view engine
app.set("view engine", "ejs");

//global variables
let currentUserId;

// Define a dummy user object (replace with data from your database)
// const user = {
//   name: "John Doe",
//   email: "john@example.com",
//   skills: "JavaScript, HTML, CSS",
//   number: "03203210",
//   location: "london",
//   occupation: "Web Developer",
//   cv: "/img/CV.pdf", // Path to the uploaded CV file
// };
const agency = require("./public/js/dummyDataAgency");
const jobPosts = require("./public/js/dummyJobPosts");

//#region Configuring the app routes

//home page route
app.get("/", (req, res) => {
  res.redirect("/login");
});

//agency home page route
app.get("/agency", async (req, res) => {
  //assigning currentUserId from session storage stored at login page
  if (req.session.currentUserId) {
    currentUserId = req.session.currentUserId;
  }
  console.log(`agency logged in with id: ${currentUserId}`);

  let getUser = await User.findOne({
    where: {
      id: currentUserId,
    },
    include: [Agency],
  });

  console.log(`fetchedAgency: ${JSON.stringify(getUser, null, 2)}`);
  res.render("home_agency", { item: getUser });
});

//jobseeker home page route
app.get("/jobseeker", async (req, res) => {
  //assigning currentUserId from session storage stored at login page
  if (req.session.currentUserId) {
    currentUserId = req.session.currentUserId;
  }
  console.log(`jobseeker logged in with id: ${currentUserId}`);

  let getUser = await User.findOne({
    where: {
      id: currentUserId,
    },
    include: [JobSeeker],
  });

  res.render("home_jobseeker", { item: getUser });
});

//getJobPosts for jobSeekers
app.get("/getJobPosts", async (req, res) => {
  const jobPosts = await Job.findAll();
  //console.log(jobPosts);
  res.render("getJobPosts", { items: jobPosts });
});

// showing each job post for JobSeeker in jobPostDetails page
// // Route to show job post details
app.get("/job-post/:id", async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findByPk(jobId);

    if (!job) {
      res.status(404).send("Job post not found");
      return;
    }

    let successMessage = req.flash("applicationSuccessMessage")[0] || "";
    let errorMessage = req.flash("applicationErrorMessage")[0] || "";

    res.render("jobPostDetail", {
      job,
      applicationSuccessMessage: successMessage || null,
      applicationErrorMessage: errorMessage || null,
    });
  } catch (error) {
    console.error("Error fetching job post:", error);
    res.status(500).send("Error fetching job post");
  }
});

//applying for job post by JobSeeker
app.get("/send-cv/:id", async (req, res) => {
  let userId = req.session.currentUserId;
  let currentUser = await User.findOne({
    where: {
      id: userId,
    },
    include: [JobSeeker],
  });

  let application = {
    JobId: Number(req.params.id),
    JobSeekerId: Number(currentUser.JobSeeker.id),
    applicationDate: Date.now(),
    statusOfApplication: "Pending",
  };

  try {
    let applicationExists = await Application.findOne({
      where: {
        [Op.and]: [
          { JobSeekerId: application.JobSeekerId },
          { JobId: application.JobId },
        ],
      },
    });

    if (applicationExists) {
      console.log(
        `application exists for JobSeekerId: ${application.JobSeekerId} and JobId: ${application.JobId}`
      );
      req.flash(
        "applicationErrorMessage",
        "You have already applied to this job"
      );
      res.redirect(`/job-post/${application.JobId}`);
    } else {
      console.log(
        `application doesn't exist for JobSeekerId: ${application.JobSeekerId} and JobId: ${application.JobId}`
      );
      let savedApplication = await Application.create(application);
      console.log(
        `Application have been successfully created : ${JSON.stringify(
          application,
          null,
          2
        )}`
      );
      req.flash(
        "applicationSuccessMessage",
        "Your appliction have been successfully submitted"
      );
      res.redirect(`/job-post/${application.JobId}`);
    }
  } catch (error) {
    console.error(
      `Error creating new application for jobId: ${application.JobId}`,
      error
    );
    res.status(500).send("Error fetching job post");
  }
});

//contactUs Page
app.get("/contactUs", (req, res) => {
  res.render("contactUs");
});

// #region [NOT BEING USED] registerUser Page
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
  console.log(`Printed the value of validUser done.........`);
  if (validUser) {
    //login success redirect to home_jobseeker
    console.log(
      `User with email: ${email} and password: ${password} have been found.`
    );
    req.session.currentUserId = validUser.id;
    if (validUser.userType === "jobseeker") {
      console.log("redirecting to '/jobseeker'");
      res.redirect("/jobseeker");
    } else if (validUser.userType === "agency") {
      console.log("redirecting to '/agency'");
      res.redirect("/agency");
    }
  } else {
    //give error message
    req.flash("loginErrorMessage", "");
    req.flash(
      "loginErrorMessage",
      `User with Email: ${email} and Password: ${password} have not been found`
    );
    res.redirect("/login");
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

// #region Register Page for Agency
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

// Get request for Job post page
app.get("/uploadJobPost", async (req, res) => {
  const successMessage = req.flash("successMessage")[0]; // Get the first success message if it exists

  res.render("uploadJobPost", { successMessage: successMessage || null });
});

// Profile Page for job seekers
app.get("/jobSeekerProfile", async (req, res) => {
  if (req.session.currentUserId) {
    currentUserId = req.session.currentUserId;
  }

  try {
    // Fetch user data including associated JobSeeker data
    let getUser = await User.findOne({
      where: {
        id: currentUserId,
      },
      include: [JobSeeker],
    });

    if (getUser) {
      // User found, render the page with user data
      res.render("jobSeekerProfile", { user: getUser });
    } else {
      // User not found, handle the error or redirect to an error page
      res.status(404).send("User not found");
    }
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

// Recruitment Agency Profile Route
app.get("/agencyProfile", async (req, res) => {
  try {
    // Assuming you have a way to retrieve the current user's ID from the session
    const currentUserId = req.session.currentUserId;

    // Fetch the user data along with their associated agency and job postings
    const user = await User.findOne({
      where: {
        id: currentUserId,
      },
      include: {
        model: Agency,
        include: Job, // Assuming you have a model named Job for job postings
      },
    });

    // If the user or agency is not found, handle appropriately

    // Pass the user data to the agencyProfile template
    const successMessage = req.flash("successMessage")[0]; // Get the first success message if it exists

    res.render("agencyProfile", {
      user,
      successMessage: successMessage || null,
    });
  } catch (error) {
    console.error("Error fetching agency profile:", error);
    // Render an error page or redirect to an appropriate route
    //res.render("errorPage", { errorMessage: "Error fetching agency profile" });
  }
});

//Upload Job Post for recruitment Agency
app.post("/post-job", async (req, res) => {
  try {
    // Extract job details from the form submission
    const { title, pay, jobLocation, skillsRequired, description } = req.body;
    console.log(req.body);

    // Get the user's information along with their associated agency
    const currentUserId = req.session.currentUserId;
    const getUser = await User.findOne({
      where: {
        id: currentUserId,
      },
      include: [Agency],
    });

    // Extract the agency's name from the user's information
    const companyName = getUser.Agency.name;
    const AgencyId = getUser.Agency.id;

    //Create the job in the database
    await Job.create({
      title,
      pay,
      jobLocation,
      skillsRequired,
      description,
      companyName, // Use the agency's name as the companyName
      AgencyId, // use the agency's id from the id table
    });

    // If job creation is successful, redirect back to the form page with a success message
    req.flash("successMessage", "Job posted successfully!");
    res.redirect("/uploadJobPost");
  } catch (error) {
    // If an error occurs, handle it appropriately
    console.error("Error posting job:", error);
    req.flash("errorMessage", "Error posting job. Please try again.");
    res.redirect("/uploadJobPost");
  }
});

//#endregion

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
    // Assuming you have access to the current agency's ID
    console.log(`req.session.currentUserId: ${req.session.currentUserId}`);
    const agencyId = req.session.currentUserId;

    const applications = await Application.findAll({
      include: [
        {
          model: JobSeeker,
          attributes: [
            "id",
            "name",
            "location",
            "occupation",
            "skills",
            "cv",
            "UserId",
          ],
        },
        {
          model: Job,
          where: { AgencyId: agencyId }, // Filter jobs by agencyId
          attributes: [
            "id",
            "title",
            "pay",
            "companyName",
            "description",
            "AgencyId",
          ],
        },
      ],
    });

    res.render("applications", { applications });
  } catch (error) {
    console.log("Error retrieving applications: " + error);
    res.status(500).send("Error retrieving applications");
  }
});

// Accepting application from 'applications' page
app.post("/accept-application/:jobId/:jobSeekerId", async (req, res) => {
  try {
    let jobId = req.params.jobId;
    let jobSeekerId = req.params.jobSeekerId;
    let application = await Application.findOne({
      where: {
        [Op.and]: [{ JobId: jobId }, { JobSeekerId: jobSeekerId }],
      },
    });

    let result = await Application.update(
      { statusOfApplication: "Accepted" },
      {
        where: {
          [Op.and]: [{ JobId: jobId }, { JobSeekerId: jobSeekerId }],
        },
      }
    );

    console.log(`Number of rows affected after updating application status to "Accepted": ${result}`);
    res.redirect("/applications");
  } catch (error) {
    console.log(`error accepting application by Agency: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});

// Rejecting application from 'applications' page
app.post("/reject-application/:jobId/:jobSeekerId", async (req, res) => {
  try {
    let jobId = req.params.jobId;
    let jobSeekerId = req.params.jobSeekerId;
    console.log(`jobId: ${jobId}, jobSeekerId: ${jobSeekerId}`);

    let application = await Application.findOne({
      where: {
        [Op.and]: [{ JobId: jobId }, { JobSeekerId: jobSeekerId }],
      },
    });
    let result = await Application.update(
      { statusOfApplication: "Rejected" },
      {
        where: {
          [Op.and]: [{ JobId: jobId }, { JobSeekerId: jobSeekerId }],
        },
      }
    );
    console.log(`Number of rows affected after updating application status to "Rejected": ${result}`);
    res.redirect("/applications");
  } catch (error) {
    console.log(`Error rejecting application by Agency: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});

// Server-side route to handle profile updates for job seekers
app.post("/edit-profile", async (req, res) => {
  try {
    const userId = req.session.currentUserId;
    const { name, location, occupation, skills } = req.body;

    // Update the job seeker's profile information in the database
    await JobSeeker.update(
      { name, location, occupation, skills },
      { where: { UserId: userId } }
    );

    res.redirect("/jobSeekerProfile"); // Redirect to the profile page after editing
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send("Error updating profile");
  }
});

// Server-side route to handle profile updates for agency
app.post("/edit-profile-agency", async (req, res) => {
  try {
    const userId = req.session.currentUserId;
    const { name, email, phonenum, address, description, location } = req.body;

    // Update the agency's profile information in the database
    await Agency.update(
      { name, email, phonenum, address, description, location },
      { where: { UserId: userId } }
    );
    req.flash("successMessage", "Profile updated successfully");
    res.redirect("/agencyProfile"); // Redirect to the profile page after editing
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send("Error updating profile");
  }
});

// Define a route to handle the POST request for editing job posts
app.post("/edit-job/:jobId", async (req, res) => {
  const jobId = req.params.id;

  try {
    // Find the job by ID and delete it
    const deletedJob = await Job.destroy({
      where: { id: jobId },
    });

    // Check if the job was successfully deleted
    if (deletedJob) {
      req.flash("successMessage", "Job deleted successfully");
      res.status(200).send("Job deleted successfully");
    } else {
      req.flash("errorMessage", "Job not found");
      res.status(404).send("Job not found");
    }
  } catch (error) {
    console.error("Error deleting job:", error);
    req.flash("errorMessage", "Error deleting job");
    res.status(500).send("Internal Server Error");
  }
});

// Assuming you have required necessary modules like express, sequelize, and models

// Define the route handler for deleting job posts
app.post("/delete-job/:jobId", async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Find the job in the database by its ID
    const job = await Job.findByPk(jobId);

    // If the job is not found, return an error response
    if (!job) {
      return res.status(404).send("Job not found");
    }

    // Delete the job from the database
    await job.destroy();

    // Flash success message and redirect
    req.flash("successMessage", "Job deleted successfully!");
    res.redirect("/agencyProfile"); // Redirect to the appropriate page
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).send("Error deleting job");
  }
});

app.get("/logout", (req, res) => {
  const sessionId = req.sessionID;
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Failed to destroy session");
    }
    console.log("session has been destroyed: " + sessionId);
    res.redirect("login");
  });
});

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
