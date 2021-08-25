const TelegramApi = require("node-telegram-bot-api");

const token = "1979516567:AAGw2A0AN0NTU8mvUMZwrsFz32tkEk1U3cM";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Btn 1', callback_data: '1'},{text: 'Btn 2', callback_data: '2'},{text: 'Btn 3', callback_data: '3'}],
            [{text: 'Btn 4', callback_data: '4'},{text: 'Btn 5', callback_data: '5'},{text: 'Btn 6', callback_data: '6'}],
            [{text: 'Btn 7', callback_data: '7'},{text: 'Btn 8', callback_data: '8'},{text: 'Btn 9', callback_data: '9'}],
            [{text: 'Btn 0', callback_data: '0'}],
            
        ]
    })
}

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Welcome" },
    { command: "/info", description: "User info" },
    { command: "/game", description: "Play game with bot" },
    { command: "/course", description: "Сurrency сourse" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/3ca/a76/3caa76fd-4741-445f-8e42-d86304568546/2.webp"
      );
      return bot.sendMessage(chatId, `Hello my friend! What can i help you`);
    }
    if (text === "/info") {
      return bot.sendMessage(chatId, `Your name is ${msg.from.first_name}`);
    }
    if (text === "/game") {
        await bot.sendMessage(chatId, `Let's play a game, I'll guess the number 0-9.`);
        const randomNumber = Math.floor(Math.random() * 10)
        chats[chatId] = randomNumber;
        return bot.sendMessage(chatId, `Guess!`, gameOptions)
    }
    if (text === "/course") {
      fetch('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5', {})
          .then ((res) => res.json())
          .then ((dataCouses) => (dataCouses).forEach((el) => {
            bot.sendMassage(id,(`Сurrency: ${el.ccy}, Code: ${el.base_ccy}, Purchase: ${el.buy}`))
          }))
          .catch((err) => {
            bot.sendMassage(id,(`Error: ${err}`))
          })
        
    }

    return bot.sendMessage(chatId, `Sorry, but I don't know this command`);
  });

  bot.on('callback_query', async (msg) => {
      // console.log(msg)
      const data = msg.data;
      console.log(data)
      const chatId = msg.message.chat.id
      if (data == chats[chatId]) {
        
        return bot.sendMessage(chatId, `You Guess! Victory!`);
      } else {
        return bot.sendMessage(chatId, `Sorry you lose. Bot choice ${chats[chatId]}`);
      }
      
  })
};

start();
