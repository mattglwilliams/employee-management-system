// Requiring the dependencies
require("dotenv").config();
const inquirer = require("inquirer");
const mysql = require("mysql2");

// Connecting to the MySQL database and storing it in a variable
const db = mysql.createConnection(
  {
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
  console.log("Connected to the employee database")
);

// Initial function to prompt the user with a list of options
const init = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choices",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "View employees by manager",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employees role",
          "Update an employees manager",
          "QUIT",
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
      } else if (answer.choices === "View employees by manager") {
        viewEmployeesByManager();
      } else if (answer.choices === "Add a department") {
        addDepartment();
      } else if (answer.choices === "Add a role") {
        addRole();
      } else if (answer.choices === "Add an employee") {
        addEmployee();
      } else if (answer.choices === "Update an employees role") {
        updateEmployeeRole();
      } else if (answer.choices === "Update an employees manager") {
        updateEmployeeManager();
      } else if (answer.choices === "QUIT") {
        process.exit(0);
      }
    });
};

// Function to view all departments
const viewAllDepartments = () => {
  db.query("SELECT * from department", function (err, res) {
    if (err) console.error(err);
    console.table(res);
    return init();
  });
};

// Function to view all roles
const viewAllRoles = () => {
  db.query("SELECT * from roles", function (err, res) {
    if (err) console.error(err);
    console.table(res);
    return init();
  });
};

// Function to view all employees
const viewAllEmployees = () => {
  db.query("SELECT * from employees", function (err, res) {
    if (err) console.error(err);
    console.table(res);
    return init();
  });
};

// Function to view the what employees sit under a certain manager
const viewEmployeesByManager = () => {
  db.query("SELECT * from employees", function (err, res) {
    if (err) throw err;
    // Storing the data we get back from the employees table in a variable &
    // mapping the id, first name and last name to value and name which inquirer
    // recognises
    let employees = res.map((employee) => ({
      value: employee.id,
      name: employee.first_name + " " + employee.last_name,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "managers",
          message:
            "Please select the manager you would like to see the employees of.",
          choices: employees,
        },
      ])
      .then((answer) => {
        db.query(
          `SELECT first_name, last_name from employees WHERE manager_id = ${answer.managers}`,
          function (err, res) {
            if (err) console.error(err);
            console.log("Here are their employees:");
            console.table(res);
            return init();
          }
        );
      });
  });
};

// Function to add a brand new department
const addDepartment = () => {
  inquirer
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

// Function to add a brand new role
const addRole = () => {
  db.query(`SELECT * FROM department;`, (err, res) => {
    if (err) throw err;
    let departmentsList = res.map((department) => ({
      value: department.id,
      name: department.department_name,
    }));
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

// Function to add a brand new employee
const addEmployee = () => {
  db.query(`SELECT * FROM roles;`, (err, res) => {
    if (err) throw err;
    let roles = res.map((role) => ({ value: role.id, name: role.title }));
    db.query(`SELECT * FROM employees;`, (err, res) => {
      if (err) throw err;
      let employees = res.map((employee) => ({
        value: employee.id,
        name: employee.first_name + " " + employee.last_name,
      }));
      inquirer
        .prompt([
          {
            type: "input",
            name: "employeeFirstName",
            message: "What is their first name?",
          },
          {
            type: "input",
            name: "employeeLastName",
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
            choices: employees,
          },
        ])
        .then((answers) => {
          db.query(
            `INSERT INTO employees SET ?`,
            {
              first_name: answers.employeeFirstName,
              last_name: answers.employeeLastName,
              role_id: answers.employeeRole,
              manager_id: answers.employeeManager,
            },
            function (err) {
              if (err) console.error(err);
              console.log("New employee added:");
              return viewAllEmployees();
            }
          );
        });
    });
  });
};

// Function to update a current employee
const updateEmployeeRole = () => {
  db.query(`SELECT * FROM roles;`, (err, res) => {
    if (err) throw err;
    let roles = res.map((role) => ({ value: role.id, name: role.title }));
    db.query(`SELECT * FROM employees;`, (err, res) => {
      if (err) throw err;
      let employees = res.map((employee) => ({
        value: employee.id,
        name: employee.first_name + " " + employee.last_name,
      }));
      inquirer
        .prompt([
          {
            type: "list",
            name: "employeeList",
            message: "Which employee would you like to update?",
            choices: employees,
          },
          {
            type: "list",
            name: "rolesList",
            message: "What is their new role?",
            choices: roles,
          },
        ])
        .then((answers) => {
          db.query(
            `UPDATE employees SET ? WHERE ?`,
            [
              {
                role_id: answers.rolesList,
              },
              {
                id: answers.employeeList,
              },
            ],
            function (err) {
              if (err) console.error(err);
              console.log("Employee Updated:");
              return viewAllEmployees();
            }
          );
        });
    });
  });
};

// Function to update an employee with a new manager
const updateEmployeeManager = () => {
  db.query(`SELECT * FROM employees;`, (err, res) => {
    if (err) throw err;
    let employees = res.map((employee) => ({
      value: employee.id,
      name: employee.first_name + " " + employee.last_name,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "employees",
          message: "For which employee would you like to change the manager?",
          choices: employees,
        },
        {
          type: "list",
          name: "managers",
          message: "Who is their new manager?",
          choices: employees,
        },
      ])
      .then((answers) => {
        db.query(
          `UPDATE employees SET ? WHERE ?`,
          [
            {
              manager_id: answers.managers,
            },
            {
              id: answers.employees,
            },
          ],
          function (err) {
            if (err) console.error(err);
            console.log("Employee Updated:");
            return viewAllEmployees();
          }
        );
      });
  });
};

// Calling the first function to start the app and prompt the user with the options
init();
