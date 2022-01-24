require("dotenv").config();
const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
  console.log("Connected to the employee database")
);

const startApp = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "choices",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
        ],
      },
    ])
    .then((answer) => {
      if (answer.choices === "View all departments") {
        getAllDepartments();
      } else if (answer.choices === "View all roles") {
        getAllRoles();
      } else if (answer.choices === "View all employees") {
        getAllEmployees();
      } else if (answer.choices === "Add a department") {
        addDepartment();
      }
    });
};

const continueApp = () => {
  return inquirer
    .prompt([
      {
        type: "confirm",
        name: "carryOn",
        message: "Would you like to do something else?",
      },
    ])
    .then((answer) => {
      if (answer === "y") {
        startApp();
      } else {
        process.exit(1);
      }
    });
};

const getAllDepartments = () => {
  db.query("SELECT * from department", function (err, results) {
    if (err) console.error(err);
    console.table(results);
    return continueApp();
  });
};

const getAllRoles = () => {
  db.query("SELECT * from roles", function (err, results) {
    if (err) console.error(err);
    console.table(results);
  });
};

const getAllEmployees = () => {
  db.query("SELECT * from employees", function (err, results) {
    if (err) console.error(err);
    console.table(results);
    return continueApp();
  });
};

const addDepartment = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "addedDepartment",
        message: "What is the name of the new department?",
      },
    ])
    .then((answer) => {
      db.query(
        `INSERT INTO department(department_name) VALUES("${answer.addedDepartment}")`,
        function (err) {
          if (err) console.error(err);
          console.log("New department added:");
          return getAllDepartments();
        }
      );
    });
};

startApp();
