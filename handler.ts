import 'source-map-support/register'
import wrapLambda from './lib/api'
import Telegraf  from 'telegraf'
import Extra from  'telegraf/extra'
import Markup from 'telegraf/markup'
import db from './lib/db'

const token = process.env.TELEGRAM_TOKEN
const bot = new Telegraf(token);

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

  reply('Successfully added!')
})

bot.hears('List', async ({reply, chat}) => {
  reply('TODO:')

  for await (const todo of db.list()) {
    if(todo.chatId === chat.id)
      reply(todo.text)
  }
})

bot.hears(/Done (.+)/, async ({match, reply, chat}) => {
  const text = match[1]

  for await (const todo of db.list()) {

    if(todo.chatId !== chat.id || todo.text !== text) 
      continue

    await db.delete(todo.id)

    reply(`Todo: ${todo.text} completed!`)
  }

})

bot.help((ctx) => ctx.reply('Help message'))
bot.action('ping', ctx => ctx.reply('pong'))

export const webhook = wrapLambda(async (event, _context) => {
  
  const tmp = JSON.parse(event.body)
  await bot.handleUpdate(tmp)

  return {
    statusCode: 200,
    body: JSON.stringify({
      input: event,
    }, null, 2),
  };
})

