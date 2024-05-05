//#region Require statements
const express = require("express");
const path = require("path");
const custom_bs = require("./utils/browserSync");
//#endregion

const app = express();
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

app.listen(5050, () => {
  console.log("App is listening on port 5050");
});
