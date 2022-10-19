import { Markup, Scenes, Context } from "telegraf";
import { MyContext } from "./types";

type TDictionary = Record<string, string>;

const dictionary: TDictionary = {
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

const button = (name: string) => {
  const text = dictionary[name as string];
  return Markup.button.callback(text, name);
};

const keyboard = () => {
  const arr = Object.keys(dictionary);

  const splitter = (arr: any[], chunkSize: number) => {
    const res: any[] = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      if (chunk) {
        res.push(chunk);
      }
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

export const sellScene = new Scenes.BaseScene<MyContext>("sellScene");

sellScene.enter((ctx) => {
  ctx.reply(
    "Что будем продавать?   ",
    // keyboard()
    Markup.inlineKeyboard(keyboard())
  );
});

sellScene.on("callback_query", (ctx) => {
  if (ctx?.update?.callback_query?.data) {
    const name: string = ctx?.update?.callback_query?.data;
    const text = dictionary[name];
    ctx.editMessageText(`Отлично, ты выбрал ${text}\nТеперь пришли фотку`); //Empty markup
  }
});
