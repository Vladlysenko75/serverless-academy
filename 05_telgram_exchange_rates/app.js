const TelegramBot = require("node-telegram-bot-api");
const NodeCache = require("node-cache");
const axios = require("axios");

const token = "";
const weatherToken = "";

const bot = new TelegramBot(token, { polling: true });
const cache = new NodeCache({ stdTTL: 60 });

const menuStack = [];
const city = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const message = "Choose a service:";
  const menu = {
    reply_markup: {
      keyboard: [["Weather forecast"], ["Exchange rates"]],
      one_time_keyboard: true,
    },
  };

  menuStack.push({ message, menu });

  bot.sendMessage(chatId, message, menu);
});

bot.onText(/Previous menu/, (msg, match) => {
  const chatId = msg.chat.id;
  menuStack.pop();

  const { message, menu } = menuStack[menuStack.length - 1];

  bot.sendMessage(chatId, message, menu);
});

bot.onText(/Weather forecast/, (msg, match) => {
  const chatId = msg.chat.id;

  const message = "Choose a city:";
  const menu = {
    reply_markup: {
      keyboard: [["Poltava", "Nice"], ["Previous menu"]],
      one_time_keyboard: true,
    },
  };

  menuStack.push({ message, menu });
  bot.sendMessage(chatId, message, menu);
});

bot.onText(/^(Poltava|Nice)$/, (msg, match) => {
  const chatId = msg.chat.id;
  const town = match[0];
  city.chatId = town;

  const message = `Please select the forecast interval for ${town}:`;
  const menu = {
    reply_markup: {
      keyboard: [
        ["At intervals of 3 hours", "At intervals of 6 hours"],
        ["Previous menu"],
      ],
      one_time_keyboard: false,
    },
  };

  menuStack.push({ message, menu });
  bot.sendMessage(chatId, message, menu);
});

bot.onText(/At intervals of (3|6) hours/, (msg, match) => {
  const chatId = msg.chat.id;
  const interval = match[1];

  getWeatherForecast(interval, city?.chatId || "Poltava", chatId);
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

bot.onText(/Exchange rates/, (msg, match) => {
  const chatId = msg.chat.id;

  const message = "Please choose a currency:";
  const menu = {
    reply_markup: {
      keyboard: [["USD", "EUR"], ["Previous menu"]],
      one_time_keyboard: false,
    },
  };

  menuStack.push({ message, menu });
  bot.sendMessage(chatId, message, menu);
});

bot.onText(/(USD|EUR)/, (msg, match) => {
  const chatId = msg.chat.id;
  const currency = match[1];

  const cachedRate = cache.get(currency);

  if (cachedRate) {
    bot.sendMessage(chatId, `Exchange rate for ${currency}: ${cachedRate}`);
  } else {
    fetchExchangeRate(currency)
      .then((rate) => {
        cache.set(currency, rate);
        bot.sendMessage(chatId, `Exchange rate for ${currency}: ${rate}`);
      })
      .catch((error) => {
        bot.sendMessage(
          chatId,
          "An error occurred while fetching the exchange rate."
        );
        console.error(error);
      });
  }
});

function fetchExchangeRate(currency) {
  return new Promise((resolve, reject) => {
    axios
      .get("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5")
      .then((response) => {
        const exchangeRate = response.data.find(
          (rate) => rate.ccy === currency
        );

        if (exchangeRate) {
          resolve(exchangeRate.sale);
        } else {
          reject(
            new Error("Exchange rate not found for the specified currency.")
          );
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
