# Employee Management System

## Contents

- [Description](#Description)
- [Installation](#Installation)
- [Usage](#Usage)
- [Questions](#Questions)

## Description

For this project, I have used MySQL2 and node.js to create a CLI employee database tracker. You can see a video of it in action here - https://watch.screencastify.com/v/2pJT9xWub2SYPpopS6x0

## Installation

To install this project, simple clone the repository, then run the below command to install all dependencies.

```
npm i
```

## Usage

Firstly, to use this app, make sure you have both node.js and MySQL installed. Once installed, follow the below steps:

- Firstly, in your terminal, navigate to the db folder and log into the MySQL CLI. The command for this is below. PLEASE NOTE: 'root' should be replaced by your username and once you run this command you will need to enter your MySQL password/

```
mysql -u root -p
```

- Once in the MySQL CLI, run the below to command to create the database and tables.

```
source schema.sql
```

- Once the above is done, go back to your normal terminal, navigate out of the db folder and run the below command and the app will start.

```
node server.js
```

## Questions

If you have any questions, you can contact me via GitHub or email me at mattwilliamsdev@gmail.com
