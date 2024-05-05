// dummyAgency.js

const agency = {
  name: "ABC Recruitment Agency",
  email: "abc@example.com",
  number: "1234567890",
  location: "New York",
  companyName: "ABC Recruitment Agency",
  address: "123 Main St, New York",
  companyDescription: "ABC Recruitment Agency is a leading recruitment firm...",
  jobPostings: [
    {
      id: 1,
      title: "Web Developer",
      pay: "$60,000 - $80,000 per year",
      location: "New York",
      skills: "JavaScript, HTML, CSS",
      description:
        "We are looking for a talented web developer to join our team...",
    },
    {
      id: 2,
      title: "Data Scientist",
      pay: "$70,000 - $90,000 per year",
      location: "San Francisco",
      skills: "Python, Machine Learning, Statistics",
      description:
        "We are seeking a skilled data scientist to analyze large datasets...",
    },
  ],
};

module.exports = agency;
