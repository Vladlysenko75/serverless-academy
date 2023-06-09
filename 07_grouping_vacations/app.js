const fs = require("fs");
const path = require("path");

function transformJSON(originalJSON) {
  const data = JSON.parse(originalJSON);

  const userVacationsMap = new Map();

  data.forEach((record) => {
    const { _id, user, startDate, endDate } = record;
    const { _id: userId, name: userName } = user;

    if (!userVacationsMap.has(userId)) {
      userVacationsMap.set(userId, {
        userId,
        userName,
        vacations: [],
      });
    }

    const userVacations = userVacationsMap.get(userId);
    userVacations.vacations.push({
      startDate,
      endDate,
    });
  });

  const transformedData = Array.from(userVacationsMap.values());

  return transformedData;
}

const filePath = path.join(__dirname, "vacations.json");

fs.readFile(filePath, (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  const transformedJSON = transformJSON(data);
  console.log(transformedJSON);
});
