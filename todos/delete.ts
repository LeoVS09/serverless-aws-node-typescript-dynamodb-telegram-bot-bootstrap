import db from '../lib/db'
import wrapLambda from '../lib/api'

// Typescipt not alllow `export const delete = ...`
export const deleteFn = wrapLambda(async (event, _context) => {

    const { id } = event.pathParameters

    await db.delete(id)

    return {
        statusCode: 200,
        body: JSON.stringify("Successfully deleted")
    }

})