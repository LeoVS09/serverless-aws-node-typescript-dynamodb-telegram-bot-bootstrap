import Telegraf, { ContextMessageUpdate }  from 'telegraf'
import Extra from  'telegraf/extra'
import Markup from 'telegraf/markup'
import db from './lib/db'

const token = process.env.TELEGRAM_TOKEN
const bot = new Telegraf(token);

const markup = Extra.markdown()
const keyboard = Markup.keyboard([
  ['List'],
  ['Help']
])    
  .oneTime()
  .resize();

const helpMessage = `
What bot can: 
- Add todo - just write "*Add* todo text"
- List all todo - write "*List*"
- Complete todo - write "*Done* existing todo text"
`

const helloMessage = `
Hi!
There simple Todo X bot,
Bot fully Open Source, you can find code [here](https://github.com/LeoVS09/serverless-aws-node-typescript-dynamodb-telegram-bot-bootstrap)
${helpMessage}
`

const replyWithHello = async (ctx: ContextMessageUpdate) => {
    await ctx.reply(helloMessage, markup)
    await ctx.reply('Menu', Extra.markup(keyboard))
}

bot.start(replyWithHello)

// Will send pong when someone send ping
bot.hears('ping', ctx => ctx.reply('pong'))

bot.hears('hi', replyWithHello)
bot.hears('Hi', replyWithHello)

bot.hears(/Add (.+)/, async ({match, reply, chat}) => {
  const text = match[1]

  await db.create(chat.id, text)

  await reply(`${text} *successfully added!*`, markup)
})

bot.hears('List', async ({reply, chat}) => {
  await reply('*TODO*:', markup)

    const todoReplies: Array<Promise<any>> = [];

  for await (const todo of db.list()) {
    if(todo.chatId === chat.id)
      todoReplies.push(reply(todo.text))
  }

  await Promise.all(todoReplies)
})

bot.hears(/Done (.+)/, async ({match, reply, chat}) => {
  const text = match[1]

  for await (const todo of db.list()) {

    if(todo.chatId !== chat.id || todo.text !== text) 
      continue

    await db.delete(todo.id)

    await reply(`${todo.text} *completed!*`, markup)
    return
  }

  reply(`*Cannot find todo:* ${text}`, markup)

})

const replyWithHelp = async (ctx: ContextMessageUpdate) => {
    await ctx.reply(helpMessage, markup)
    await ctx.reply('Menu', Extra.markup(keyboard))
}

bot.help(replyWithHelp)
bot.hears('help', replyWithHelp)
bot.hears('Help', replyWithHelp)


export default (body) => bot.handleUpdate(body)