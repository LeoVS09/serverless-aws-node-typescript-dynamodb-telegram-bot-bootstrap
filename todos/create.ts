import db from '../lib/db'
import wrapLambda  from '../lib/api'

export const create = wrapLambda(async (event, _context) => {
  const data = JSON.parse(event.body)

  if (typeof data.text !== 'string') {
    console.error('Validation Failed')
    throw new Error('Couldn\'t create the todo item.')
    return
  }

  const item = await db.create(data.text)

  return {
    statusCode: 200,
    body: JSON.stringify(item)
  }

})
