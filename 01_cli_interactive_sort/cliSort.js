const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const options = [
  "Sort words alphabetically",
  "Show numbers from lesser to greater",
  "Show numbers from bigger to smaller",
  "Display words in ascending order by number of letters in the word",
  "Show only unique words",
  "Display only unique values",
];

function processInput(input) {
  const wordsAndNumbers = input.trim().split(" ");

  displayOptions();
  rl.question("Select (1 - 6) and press ENTER: ", (option) => {
    const index = parseInt(option) - 1;

    if (option === "exit") {
      console.log("Goodbye! Come back again!");
      return rl.close();
    }

    if (index >= 0 && index < options.length) {
      switch (index) {
        case 0:
          const sortedWords = wordsAndNumbers
            .filter((word) => isNaN(word))
            .sort();
          console.log(sortedWords.join(" "));
          break;
        case 1:
          const numbersAscending = wordsAndNumbers
            .filter((word) => !isNaN(word))
            .map(Number)
            .sort((a, b) => a - b);
          console.log(numbersAscending.join(" "));
          break;
        case 2:
          const numbersDescending = wordsAndNumbers
            .filter((word) => !isNaN(word))
            .map(Number)
            .sort((a, b) => b - a);
          console.log(numbersDescending.join(" "));
          break;
        case 3:
          const wordsByLength = wordsAndNumbers
            .filter((word) => isNaN(word))
            .sort((a, b) => a.length - b.length);
          console.log(wordsByLength.join(" "));
          break;
        case 4:
          const uniqueWords = [
            ...new Set(wordsAndNumbers.filter((word) => isNaN(word))),
          ];
          console.log(uniqueWords.join(" "));
          break;
        case 5:
          const uniqueValues = [...new Set(wordsAndNumbers)];
          console.log(uniqueValues.join(" "));
          break;
      }
    } else {
      console.log("Invalid option! Please try again.");
    }

    processInput(input);
  });
}

function displayOptions() {
  console.log("Suggested options:");
  options.forEach((option, index) => {
    console.log(`${index + 1}. ${option}`);
  });
}

function startProgram() {
  rl.question(
    "Enter a few words or numbers separated by a space:\n",
    (input) => {
      processInput(input);
    }
  );
}

startProgram();
