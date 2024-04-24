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
  res.render("getJobPosts", { items: jobs }, (error, ejsPage) => {
    if (error) {
      console.log(`The error thrown by page : ${error.message}`);
      res.status(500).send("An error occurred");
    } else {
      res.send(ejsPage);
    }
  });
});

//contactUs Page
app.get("/contactUs", (req, res) => {
  res.render("contactUs");
});

//login Page
app.get("/login", (req, res) => {
  res.render("login");
});

// login page post route
app.post("/login", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body; // Extract email and password from form submission

  res.redirect("/");
});

//#endregion

app.listen(5050, () => {
  console.log("App is listening on port 5050");
});
