import { Bot, webhookCallback } from "https://deno.land/x/grammy@v1.18.1/mod.ts";
import { ILedgerRepository, VirtualLedgerRepository } from "./src/repository.ts";

Deno.env.set("DEBUG", "grammy*");
const port = 8080;
const ac = new AbortController();
const isLocal = Deno.env.get("BOT_LOCAL");

const bot = new Bot("xxx");

const repository: ILedgerRepository = new VirtualLedgerRepository();

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.on("message:text", (ctx) => {
  const message = ctx.message.text;
  const amount = parseFloat(message);
  repository.addRecord(amount);
  ctx.reply("Added");
});

if (isLocal) {
  bot.start();
} else {
  const server = Deno.serve({
    hostname: "0.0.0.0",
    port,
    signal: ac.signal,
    onError: (error) => {
      console.dir(error);
      return new Response();
    },
  }, webhookCallback(bot, "std/http"));
  await server.finished;
}
