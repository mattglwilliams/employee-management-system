INSERT INTO department (department_name)
VALUES ("Sales"),
       ("Finance"),
       ("HR"),
       ("Production");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Manager", 40000, 1),
       ("Salesman", 25000, 1),
       ("Head of Finance", 50000, 2),
       ("Accountant", 30000, 2),
       ("HR Manager", 32000, 3),
       ("HR Coordinator", 23000, 3),
       ("Senior Software Engineer", 50000, 4),
       ("Software Engineer", 35000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("John", "Smith", 1, NULL),
       ("Taylor", "Johnson", 2, 1),
       ("Sarah", "Dixon", 3, NULL),
       ("Alex", "Jones", 4, 3),
       ("Lisa", "Matthews", 5, NULL),
       ("Tom", "Thompson", 6, 5),
       ("James", "Douglas", 7, NULL),
       ("David", "East", 8, 7);