// If you want change cloud in easy way you must write abstraction on database
import * as DynamoDB from 'aws-sdk/clients/dynamodb'
import initializeDatabase from "./init"
import { TodoModel } from './model';
import * as uuid from 'uuid';

export class TodoDatabase {
    instance: DynamoDB.DocumentClient;
    tableName: string;

    constructor(){
        this.instance = initializeDatabase();
        this.tableName = process.env.DYNAMODB_TABLE;
        
        console.log('using table', this.tableName)
    }

    get baseParams() {
        return {
            TableName: this.tableName
        }
    }


    create(text: string, checked = false): Promise<TodoModel> {
        const timestamp = getCurrentTimestamp();

        const item: TodoModel = {
            id: uuid.v1(),
            text,
            checked,
            createdAt: timestamp,
            updatedAt: timestamp
        }

        const params = {
            ...this.baseParams,
            Item: item
        }

        return new Promise((resolve, reject) => 
            this.instance.put(params, err => {
                if(err) {
                    reject(err)
                    return
                }

                resolve(params.Item)
            })
        )
    }

    get(id: string): Promise<TodoModel> {

        const params = {
            ...this.baseParams,
            Key: {
                id
            }
        }

        return new Promise<TodoModel>((resolve, reject) => {
            this.instance.get(params, (err, result) => {
                if(err) {
                    reject(err)
                    return
                }

                resolve(result.Item as TodoModel)
            })
        })

    }

    list(): Promise<Array<TodoModel>> {
        const params = this.baseParams

        return new Promise<Array<TodoModel>>((resolve, reject) => {
            this.instance.scan(params, (err, result) => {
                if(err) {
                    reject(err)
                    return
                }

                console.log('list items', result)

                resolve(result.Items as Array<TodoModel>)
            })
        })
    }

    update(id: string, text: string, checked: boolean): Promise<TodoModel> {
        const timestamp = getCurrentTimestamp()

        const params = {
            ...this.baseParams,
            Key: {
                id
            }, 
            ExpressionAttributeNames: {
                '#todo_text': 'text',
            },
            ExpressionAttributeValues: {
                ':text': text,
                ':checked': checked,
                ':updatedAt': timestamp,
            },
            UpdateExpression: 'SET #todo_text = :text, checked = :checked, updatedAt = :updatedAt',
            ReturnValues: 'ALL_NEW',
        }

        return new Promise((resolve, reject) => {
            this.instance.update(params, (error, result) => {
                if(error) {
                    reject(error)
                    return
                }

                resolve(result.Attributes as TodoModel)
            })
        })
    }

    delete(id: string): Promise<void> {
        const params = {
            ...this.baseParams,
            Key: {
                id
            }
        }

        return new Promise((resolve, reject) => {
            this.instance.delete(params, (error) => {
                if (error) {
                    reject(error)
                    return
                }
    
                resolve()
            })
        })
    }

}


const getCurrentTimestamp = () => new Date().getTime()

export const defaultDb = new TodoDatabase()

export default defaultDb