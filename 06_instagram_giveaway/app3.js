const fs = require("fs");
const path = require("path");

function readFiles() {
  const uniqueUsernames = new Set();
  const usernameOccurrences = new Map();
  const files = Array.from({ length: 20 }, (_, i) => `out${i}.txt`);

  return Promise.all(
    files.map((file) =>
      fs.promises
        .readFile(path.join(__dirname, "files", file), "utf8")
        .then((content) => content.trim().split("\n"))
        .then((lines) => {
          lines.forEach((username) => {
            if (!uniqueUsernames.has(username)) {
              uniqueUsernames.add(username);
              usernameOccurrences.set(username, new Set([file]));
            } else {
              usernameOccurrences.get(username).add(file);
            }
          });
        })
    )
  ).then(() => ({ uniqueUsernames, usernameOccurrences }));
}

async function processFiles() {
  console.time("Execution time");

  const { uniqueUsernames, usernameOccurrences } = await readFiles();

  let countInAllFiles = 0;
  let countInAtLeastTenFiles = 0;

  for (const set of usernameOccurrences.values()) {
    if (set.size === 20) {
      countInAllFiles++;
    }

    if (set.size >= 10) {
      countInAtLeastTenFiles++;
    }
  }

  console.log("Unique usernames:", uniqueUsernames.size);
  console.log("Usernames occurring in all files:", countInAllFiles);
  console.log(
    "Usernames occurring in at least 10 files:",
    countInAtLeastTenFiles
  );

  console.timeEnd("Execution time");
}

processFiles();
