// If you want change cloud in easy way you must write abstraction on database
import * as DynamoDB from 'aws-sdk/clients/dynamodb'
import {DataMapper, ScanIterator} from '@aws/dynamodb-data-mapper';
import initializeDatabase from "./init"
import { Todo } from './model';
// Guide about AWS DynamoDB data mapper https://aws.amazon.com/ru/blogs/developer/introducing-the-amazon-dynamodb-datamapper-for-javascript-developer-preview/

export class TodoDatabase {
    instance: DynamoDB;
    tableName: string;
    mapper: DataMapper

    constructor(){
        this.instance = initializeDatabase();
        this.tableName = process.env.DYNAMODB_TABLE;
        this.mapper = new DataMapper({ client: this.instance })
        
        console.log('using table', this.tableName)
    }

    create(text: string, checked = false): Promise<Todo> {

        const todo = new Todo()

        const currentDate = new Date()

        todo.createdAt = currentDate
        todo.updatedAt = currentDate

        todo.text = text
        todo.checked = checked

        return this.mapper.put(todo)
            .then(() => todo)
    }

    get(id: string): Promise<Todo> {


        const toFetch = new Todo()

        toFetch.id = id

        return this.mapper.get(toFetch)
    }

    // Example async list iteration 
    // for await (const todo of db.list()) {
    //      Each post is an instance of the Post class
    // }

    list(): ScanIterator<Todo> {
        return this.mapper.scan<Todo>({valueConstructor: Todo})
    }

    update(id: string, text: string, checked: boolean): Promise<Todo> {
        const todo = new Todo()

        todo.id = id
        todo.text = text
        todo.checked = checked
        todo.updatedAt = new Date()

        return this.mapper.put(todo)
    }

    delete(id: string): Promise<Todo | undefined> {
        const todo = new Todo()
        todo.id = id

        return this.mapper.delete(todo)
    }

}

export const defaultDb = new TodoDatabase()

export default defaultDb