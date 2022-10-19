import { Telegraf, Markup, Scenes, session, Context } from "telegraf";
import { SessionContext } from "telegraf/typings/session";

import { sellScene } from "./sell";

interface Session {
  foo: string;
}

type BaseBotContext = SessionContext<Session>;

interface BotContext extends BaseBotContext {
  // session: Session;
}

const bot = new Telegraf<BotContext>(
  "5733422116:AAFcCMIk7VejLmEnAlrhI-DHN1CIyprIsAM"
);

const stage = new Scenes.Stage<BotContext>([sellScene]);
bot.use(session()); // to  be precise, session is not a must have for Scenes to work, but it sure is lonely without one
bot.use(stage.middleware());

bot.start((ctx: Context) =>
  ctx.reply(
    "Привет!\nЯ помогу тебе продать или купить форму.\nЖми /go и погнали!"
  )
);
bot.help((ctx: Context) => ctx.reply("later"));

bot.command("go", async (ctx: Context) => {
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

bot.action("sell", async (ctx: Context) => {
  await ctx.scene.enter("sellScene");
});

bot.action("buy", async (ctx: Context) => {
  try {
    console.log(ctx);
  } catch (e) {
    console.error(e);
  }
});

bot.action("showroom", async (ctx: Context) => {
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
