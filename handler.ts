import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

export const hello: APIGatewayProxyHandler = async (event, _context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Serverless Webpack (Typescript) v0.1.0 Bootstrap! Your function executed successfully!',
      input: event,
    }, null, 2),
  };
}
