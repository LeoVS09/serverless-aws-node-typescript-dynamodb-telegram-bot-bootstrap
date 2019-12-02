import db from '../lib/db'
import wrapLambda  from '../lib/api'

export const create = wrapLambda(async (event, _context) => {
  const { chat_id } = event.pathParameters

  const chatId = +chat_id || -1 // try parse parametr or use default

  const data = JSON.parse(event.body)

  if (typeof data.text !== 'string') {
    console.error('Validation Failed')
    throw new Error('Couldn\'t create the todo item.')
    return
  }

  const item = await db.create(chatId, data.text)

  return {
    statusCode: 200,
    body: JSON.stringify(item, null, 2)
  }

})
