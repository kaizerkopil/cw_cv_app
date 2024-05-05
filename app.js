//#region Require statements
const express = require("express");
const { body, validationResult } = require("express-validator");
const path = require("path");
const custom_bs = require("./utils/browserSync");
//#endregion

const app = express();
custom_bs.initialiseBrowserSync();

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

//#endregion

app.listen(5050, () => {
  console.log("App is listening on port 5050");
});
