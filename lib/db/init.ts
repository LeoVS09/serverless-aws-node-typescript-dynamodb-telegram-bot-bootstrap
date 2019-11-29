import * as DynamoDB from 'aws-sdk/clients/dynamodb'

const isDevelopment = process.env.NODE_ENV === 'development';

export default () => new DynamoDB.DocumentClient(isDevelopment && {

    // Setup local dynamo db if function run by `invoke`
    region: 'localhost',
    endpoint: 'http://dynamo:8000',
    
    // needed if you run dynamodb in another container
    accessKeyId: 'MOCK_ACCESS_KEY_ID',  
    secretAccessKey: 'MOCK_SECRET_ACCESS_KEY' 
  
    // set this if you run dynamodb in same container or machine
    // accessKeyId: 'DEFAULT_ACCESS_KEY',  
    // secretAccessKey: 'DEFAULT_SECRET' 
  
    // or use https://github.com/99xt/serverless-dynamodb-client 
  })

