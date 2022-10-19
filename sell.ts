import { Markup, Scenes, Context } from "telegraf";

interface SessionData {
  heyCounter: number;
}

interface BotContext extends Context {
  session?: SessionData;
}

const dictionary = {
  coat: "Плащ",
  jacket: "Пуховик",
  blazer: "Пиджак",
  pants: "Брюки",
  vest: "Жилет",
  shirt: "Сорочка",
  bag: "Сумка",
  suitcase: "Чемодан",
  shoes: "Обувь",
  other: "Прочее",
};

const button = (name) => {
  let text = dictionary[name];
  return Markup.button.callback(text, name);
};

const keyboard = () => {
  const arr = Object.keys(dictionary);

  const splitter = (arr, chunkSize) => {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk: any[] = arr.slice(i, i + chunkSize);
      res.push(chunk);
    }
    return res;
  };

  return splitter(
    arr.map((key) => {
      return button(key);
    }),
    2
  );
};

export const sellScene = new Scenes.BaseScene("sellScene");

sellScene.enter((ctx) => {
  ctx.reply(
    "Что будем продавать?   ",
    // keyboard()
    Markup.inlineKeyboard(keyboard())
  );
});

sellScene.on("callback_query", (ctx) => {
  let type = dictionary[ctx.update.callback_query.data];

  ctx.editMessageText(`Отлично, ты выбрал ${type}\nТеперь пришли фотку`); //Empty markup
});

// sellScene.action("coat", (ctx) => {
//   // const type = ctx.callbackQuery;
//   ctx.reply(`Отлично ты выбрал Плащ`);
// });

// SellScene.action("THEATER_ACTION", (ctx) => {
//   ctx.reply("You choose theater");
//   ctx.session.myData.preferenceType = "Theater";
//   return ctx.scene.enter("SOME_OTHER_SCENE_ID"); // switch to some other scene
// });

// SellScene.action("MOVIE_ACTION", (ctx) => {
//   ctx.reply("You choose movie, your loss");
//   ctx.session.myData.preferenceType = "Movie";
//   return ctx.scene.leave(); // exit global namespace
// });

// SellScene.leave((ctx) => {
//   ctx.reply("Thank you for your time!");
// });

// // What to do if user entered a raw message or picked some other option?
// SellScene.use((ctx) =>
//   ctx.replyWithMarkdown("Please choose either Movie or Theater")
// );
