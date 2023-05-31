const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const botToken = "5923863923:AAHbV92Xg5SSA5uKjtve2E6c5nhqbXSlT4k";
const weatherToken = "9386d066fcb17000cc217a73d2328b1d";

const bot = new TelegramBot(botToken, { polling: true });

let city = "";

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Choose a city:", {
    reply_markup: {
      keyboard: [["Poltava"], ["Nice"]],
      one_time_keyboard: true,
    },
  });
});

bot.onText(/^(Poltava|Nice)$/, (msg, match) => {
  const chatId = msg.chat.id;
  const town = match[0];
  city = town;

  bot.sendMessage(chatId, `Please select the forecast interval for ${town}:`, {
    reply_markup: {
      keyboard: [["at intervals of 3 hours"], ["at intervals of 6 hours"]],
      one_time_keyboard: true,
    },
  });
});

bot.onText(/at intervals of (3|6) hours/, (msg, match) => {
  const chatId = msg.chat.id;
  const interval = match[1];

  getWeatherForecast(interval, city, chatId);
});

function getWeatherForecast(interval, city, chatId) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherToken}`;

  axios.get(url).then((response) => {
    const forecastData = response.data.list;

    const message = formatForecastMessage(forecastData, interval);

    bot.sendMessage(
      chatId,
      "Here is the weather forecast for " + city + ":" + message
    );
  });
}

function formatForecastMessage(forecast, interval) {
  let message = "\n\n";

  for (let i = 0; i < forecast.length; interval == 3 ? i++ : (i += 2)) {
    const { dt, main, weather } = forecast[i];

    const date = new Date(dt * 1000);
    const temperature = Math.round(main.temp - 273.15);

    message += `${date.toLocaleString()}\nTemperature: ${temperature}°C\nDescription: ${
      weather[0].description
    }\n\n`;
  }

  return message;
}
