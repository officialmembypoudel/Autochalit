import { Client, Account, Databases, Storage } from 'appwrite'

export const client = new Client().setEndpoint('https://playground.itsoch.com/v1') // Your API Endpoint
    .setProject('autochalit');

export const account = new Account(client);
export const database = new Databases(client)
export const storage = new Storage(client)

