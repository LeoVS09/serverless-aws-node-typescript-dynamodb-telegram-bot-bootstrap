import db from '../lib/db'
import wrapLambda from '../lib/api'

export const get = wrapLambda(async (event, _context) => {

    const { id } = event.pathParameters

    const item = await db.get(id)

    return {
        statusCode: 200,
        body: JSON.stringify(item)
    }

})
