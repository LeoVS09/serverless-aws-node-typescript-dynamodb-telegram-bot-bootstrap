import db from '../lib/db'
import wrapLambda from '../lib/api'

export const list = wrapLambda(async (_event, _context) => {

    const items = [];

    for await (const todo of db.list()) {
        items.push(todo)
    }

    console.log('list items', items)

    return {
        statusCode: 200,
        body: JSON.stringify(items, null, 2)
    }

})
