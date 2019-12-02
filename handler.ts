import 'source-map-support/register'
import wrapLambda from './lib/api'
import botHandler from './bot'



export const telegram = wrapLambda(async (event, _context) => {
  
  const tmp = JSON.parse(event.body)
  await botHandler(tmp)

  return {
    statusCode: 200,
    body: JSON.stringify({
      input: event,
    }, null, 2),
  };
})

