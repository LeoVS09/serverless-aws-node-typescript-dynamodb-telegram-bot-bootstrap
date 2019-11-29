// Simple API abstraction on lambda call interface
// You cannot just export async function 
// because AWS can shutdown function which already return value (Promise)
import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from "aws-lambda";

export interface AsyncLambda {
    (event: APIGatewayProxyEvent, context: Context): Promise<any>
}


export default function wrapAsyncLambda(lambda: AsyncLambda): APIGatewayProxyHandler {
    return (event, context, callback) => {
        lambda(event, context)
        .then(response => {
            callback(null, response)
        })
        .catch(err => callback(err))
    }
}

