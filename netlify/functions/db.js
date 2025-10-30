// db.js - establish connection once
import { MongoClient } from "mongodb";

let collection;
console.log("from db.js");

export async function connectToDb(uri, dbName, collectionName) {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  collection = db.collection(collectionName);
  console.log(`Connected to database: ${dbName}, collection: ${collectionName}`);
  return collection;
}
