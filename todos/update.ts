import db from '../lib/db'
import wrapLambda from '../lib/api'

export const update = wrapLambda(async (event, _context) => {

    const { id } = event.pathParameters
    const { text, checked } = JSON.parse(event.body)

    // validation
    if (typeof text !== 'string' || typeof checked !== 'boolean') {
        console.error('Validation Failed');

        return {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t update the todo item.',
        }
    }

    const item = await db.update(id, text, checked)

    return {
        statusCode: 200,
        body: JSON.stringify(item, null, 2)
    }

})
