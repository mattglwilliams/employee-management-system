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
          "Add a role",
        ],
      },
    ])
    .then((answer) => {
      if (answer.choices === "View all departments") {
        viewAllDepartments();
      } else if (answer.choices === "View all roles") {
        viewAllRoles();
      } else if (answer.choices === "View all employees") {
        viewAllEmployees();
      } else if (answer.choices === "Add a department") {
        addDepartment();
      } else if (answer.choices === "Add a role") {
        addRoleInit();
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

const viewAllDepartments = () => {
  db.query("SELECT * from department", function (err, results) {
    if (err) console.error(err);
    console.table(results);
    return continueApp();
  });
};

const viewAllRoles = () => {
  db.query("SELECT * from roles", function (err, results) {
    if (err) console.error(err);
    console.table(results);
  });
};

const viewAllEmployees = () => {
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
          return viewAllDepartments();
        }
      );
    });
};

const addRoleInit = () => {
  db.query("SELECT * from department", function (err, results) {
    if (err) console.error(err);
    console.table(results);
    return addRoleQuestions();
  });
};

const addRoleQuestions = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message:
          "Please see the table above and enter the ID of the department the role relates too.",
      },
      {
        type: "input",
        name: "nameOfRole",
        message: "What is the role?",
      },
      {
        type: "input",
        name: "salaryOfRole",
        message: "What is the salary of the role?",
      },
    ])
    .then((answers) => {
      db.query(
        `INSERT INTO roles(title, salary, department_id) VALUES("${answers.nameOfRole}", "${answers.salaryOfRole}", "${answers.department}")`,
        function (err) {
          if (err) console.error(err);
          console.log("New role added:");
          return getAllRoles();
        }
      );
    });
};

startApp();
