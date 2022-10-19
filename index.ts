import { Markup, Scenes, session, Telegraf } from "telegraf";
import { MyContext } from "./types";

import { sellScene } from "./sell";

const bot = new Telegraf<MyContext>(
  "5733422116:AAFcCMIk7VejLmEnAlrhI-DHN1CIyprIsAM"
);

const stage = new Scenes.Stage<MyContext>([sellScene]);
bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) =>
  ctx.reply(
    "Привет!\nЯ помогу тебе продать или купить форму.\nЖми /go и погнали!"
  )
);
bot.help((ctx) => ctx.reply("later"));

bot.command("go", async (ctx) => {
  try {
    await ctx.replyWithHTML(
      "Для начала определимся что нужно сделать...",
      Markup.inlineKeyboard([
        [
          Markup.button.callback("Купить", "buy"),
          Markup.button.callback("Продать", "sell"),
        ],
        [Markup.button.callback("Мои товары", "showroom")],
      ])
    );
  } catch (e) {
    console.error(e);
  }
});

bot.action("sell", async (ctx) => {
  await ctx?.scene.enter("sellScene");
});

bot.action("buy", async (ctx) => {
  try {
    console.log(ctx);
  } catch (e) {
    console.error(e);
  }
});

bot.action("showroom", async (ctx) => {
  try {
    await ctx.reply("У вас пока нет товаров =(");
  } catch (e) {
    console.error(e);
  }
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
