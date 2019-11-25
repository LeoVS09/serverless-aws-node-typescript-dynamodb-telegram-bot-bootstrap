import * as uuid from 'uuid'
import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

const tableName = process.env.DYNAMODB_TABLE

export const create: APIGatewayProxyHandler = async (event, _context) => {
    console.log('using table', tableName)
    
    const timestamp = new Date().getTime()
    const data = JSON.parse(event.body)

    if (typeof data.text !== 'string') {
    console.error('Validation Failed')
    throw new Error('Couldn\'t create the todo item.')
    return
    }

    await createInDynamoDB(data, timestamp)

    const todos = await list()

    return {
        statusCode: 200,
        body: JSON.stringify(todos, null, 2)
    }
}

const createInDynamoDB = (data: any, timestamp: number) => {
    const params = {
        TableName: tableName,
        Item: {
          id: uuid.v1(),
          text: data.text,
          checked: false,
          createdAt: timestamp,
          updatedAt: timestamp
        }
      }

    return new Promise((resolve, reject) => {
        // write the todo to the database
        dynamoDb.put(params, (error, result) => {
            // handle potential errors
            if (error) {
            console.error(error)
            reject(new Error('Couldn\'t create the todo item.'))
            return
            }

            resolve(result.Item)
        })
    })
}


const list = () => {
    const params = {
        TableName: tableName,
    };

    return new Promise((resolve, reject) => {
        dynamoDb.scan(params, (error, result) => {
            // handle potential errors
            if (error) {
              console.error(error);
              reject({
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t fetch the todos.',
              });
              return;
            }    
            resolve(result.Items);
          });
    })
}