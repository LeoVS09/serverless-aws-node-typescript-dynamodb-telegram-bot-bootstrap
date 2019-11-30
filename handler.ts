import wrapLambda from './lib/api'
import request from 'request'
import 'source-map-support/register'

const token = process.env.TELEGRAM_TOKEN
const BASE_URL = `https://api.telegram.org/bot${token}/sendMessage`;

export const webhook = wrapLambda(async (event, _context) => {
  
  const body = JSON.parse(event.body)
  const message = body.message
  const chatId = message.chat.id

  request.post(BASE_URL).form({ text: message.text, chat_id: chatId });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message,
      input: event,
    }, null, 2),
  };
})

