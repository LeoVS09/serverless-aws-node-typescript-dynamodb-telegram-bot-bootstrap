import db from '../lib/db'
import wrapLambda  from '../lib/api'

export const list = wrapLambda(async (_event, _context) => {

  const items = await db.list()

  return {
    statusCode: 200,
    body: JSON.stringify(items)
  }

})
