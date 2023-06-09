const fs = require("fs");
const path = require("path");

function readFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  return content.trim().split("\n");
}

function processFiles() {
  const uniqueUsernames = new Set();
  const usernameCounts = {};
  const usernameOccurrences = {};

  for (let i = 0; i < 20; i++) {
    const filePath = path.join(__dirname, "files", `out${i}.txt`);
    const lines = readFile(filePath);

    for (const line of lines) {
      uniqueUsernames.add(line);

      if (!usernameOccurrences[line]) {
        usernameOccurrences[line] = new Set();
      }

      if (!usernameOccurrences[line].has(i)) {
        usernameOccurrences[line].add(i);
        usernameCounts[line] = (usernameCounts[line] || 0) + 1;
      }
    }
  }

  let countInAllFiles = 0;
  let countInAtleastTenFiles = 0;

  for (const username in usernameCounts) {
    if (usernameCounts[username] === 20) {
      countInAllFiles++;
    }

    if (usernameCounts[username] >= 10) {
      countInAtleastTenFiles++;
    }
  }

  return {
    uniqueUsernames: uniqueUsernames.size,
    countInAllFiles,
    countInAtleastTenFiles,
  };
}

console.time("Execution time");

const result = processFiles();
console.log("Unique usernames:", result.uniqueUsernames);
console.log("Usernames occurring in all files:", result.countInAllFiles);
console.log(
  "Usernames occurring in at least 10 files:",
  result.countInAtleastTenFiles
);

console.timeEnd("Execution time");
