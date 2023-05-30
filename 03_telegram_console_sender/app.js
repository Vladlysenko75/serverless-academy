const fs = require("fs");
const { program } = require("commander");
const TelegramBot = require("node-telegram-bot-api");

const token = "";
const chatId = "";

const bot = new TelegramBot(token, { polling: true });

program
  .command("send-message <message>")
  .description("Send a message to the Telegram bot")
  .action((message) => {
    bot
      .sendMessage(chatId, message)
      .then(() => process.exit())
      .catch((error) => console.error("Error sending message:", error));
  });

program
  .command("send-photo <path>")
  .description("Send a photo to the Telegram bot")
  .action((path) => {
    const photo = fs.createReadStream(path);
    bot
      .sendPhoto(chatId, photo)
      .then(() => process.exit())
      .catch((error) => console.error("Error sending photo:", error));
  });

program.parse(process.argv);
