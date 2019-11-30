import Telegraf  from 'telegraf'
import Extra from  'telegraf/extra'
import Markup from 'telegraf/markup'
import db from './lib/db'

const token = process.env.TELEGRAM_TOKEN
const bot = new Telegraf(token);

const markup = Extra.markdown()
const keyboard = Markup.keyboard([
  ['List']
])    
  .oneTime()
  .resize();

bot.start((ctx) => ctx.reply('Hello'))
bot.hears('hi', ctx => ctx.reply('Hey there!', Extra.markup(keyboard)))

bot.hears(/Add (.+)/, async ({match, reply, chat}) => {
  const text = match[1]

  await db.create(chat.id, text)

  await reply(`${text} *successfully added!*`, markup)
})

bot.hears('List', async ({reply, chat}) => {
  await reply('*TODO*:', markup)

  for await (const todo of db.list()) {
    if(todo.chatId === chat.id)
      await reply(todo.text)
  }
})

bot.hears(/Done (.+)/, async ({match, reply, chat}) => {
  const text = match[1]

  for await (const todo of db.list()) {

    if(todo.chatId !== chat.id || todo.text !== text) 
      continue

    await db.delete(todo.id)

    await reply(`${todo.text} *completed!*`, markup)
  }

})

bot.help((ctx) => ctx.reply('Help message'))
bot.hears('ping', ctx => ctx.reply('pong'))

export default (body) => bot.handleUpdate(body)