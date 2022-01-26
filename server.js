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
          "Add an employee",
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
        addRole();
      } else if (answer.choices === "Add an employee") {
        addEmployee();
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
    return continueApp();
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

const addRole = () => {
  db.query(`SELECT * FROM department;`, (err, res) => {
    if (err) throw err;
    let departmentsList = res.map((department) => ({
      value: department.id,
      name: department.department_name,
    }));
    console.table(departmentsList);
    inquirer
      .prompt([
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
        {
          type: "list",
          name: "department",
          message: "Please select the department.",
          choices: departmentsList,
        },
      ])
      .then((answers) => {
        db.query(
          `INSERT INTO roles SET ?`,
          {
            title: answers.nameOfRole,
            salary: answers.salaryOfRole,
            department_id: answers.department,
          },
          function (err) {
            if (err) console.error(err);
            console.log("New role added:");
            return viewAllRoles();
          }
        );
      });
  });
};

const addEmployee = () => {
  db.query(`SELECT * FROM roles;`, (err, res) => {
    if (err) throw err;
    let roles = res.map((role) => ({ value: role.id, name: role.title }));
    console.log(roles);
    inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: "What is their first name?",
        },
        {
          type: "input",
          name: "lastName",
          message: "What is their last name?",
        },
        {
          type: "list",
          name: "employeeRole",
          message: "What is their role?",
          choices: roles,
        },
        {
          type: "list",
          name: "employeeManager",
          message: "Who is their manager?",
          choices: roles,
        },
      ])
      .then((answers) => {
        db.query(
          `INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES("${answers.firstName}", "${answers.lastName}", "${answers.employeeRole}")`,
          function (err) {
            if (err) console.error(err);
            console.log("New employee added:");
            return viewAllEmployees();
          }
        );
      });
  });
};

startApp();
