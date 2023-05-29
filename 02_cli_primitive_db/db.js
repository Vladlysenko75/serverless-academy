const fs = require("fs");
const inquirer = require("inquirer");

const databaseFile = "users.txt";

function createUser() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the user (or press ENTER to exit):",
      },
    ])
    .then((answers) => {
      const { name } = answers;

      if (name === "") {
        console.log("Exiting user creation mode.");
        searchUser();
        return;
      }

      inquirer
        .prompt([
          {
            type: "list",
            name: "gender",
            message: "Choose the gender:",
            choices: ["Male", "Female"],
          },
          {
            type: "number",
            name: "age",
            message: "Enter the age:",
            validate: (value) => {
              if (value < 0) {
                return "Age must be a positive number.";
              }
              return true;
            },
          },
        ])
        .then((answers) => {
          const { gender, age } = answers;
          const user = { name, gender, age };
          saveUser(user);
        });
    });
}

function saveUser(user) {
  fs.readFile(databaseFile, "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      console.error("Error reading the database:", err);
      return;
    }

    const users = data ? JSON.parse(data) : [];
    users.push(user);

    fs.writeFile(databaseFile, JSON.stringify(users), (err) => {
      if (err) {
        console.error("Error saving user:", err);
      } else {
        console.log("User saved successfully.");
      }

      createUser();
    });
  });
}

function searchUser() {
  fs.readFile(databaseFile, "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      console.error("Error reading the database:", err);
      return;
    }

    const users = data ? JSON.parse(data) : [];

    inquirer
      .prompt([
        {
          type: "confirm",
          name: "search",
          message: "Do you want to search for a user? (Y/N):",
          default: false,
        },
      ])
      .then((answers) => {
        const { search } = answers;

        if (search) {
          console.log("All users:", users);
          inquirer
            .prompt([
              {
                type: "input",
                name: "name",
                message: "Enter the name of the user to search:",
              },
            ])
            .then((answers) => {
              const { name } = answers;
              findUser(name, users);
            });
        } else {
          console.log("Exiting the program.");
        }
      });
  });
}

function findUser(name, users) {
  const foundUser = users.find(
    (user) => user.name.toUpperCase() === name.toUpperCase()
  );

  if (foundUser) {
    console.log("User found:", foundUser);
  } else {
    console.log("User not found.");
  }

  searchUser();
}

createUser();
