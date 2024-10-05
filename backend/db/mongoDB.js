import { MongoClient } from "mongodb";

let dbConnection = undefined;

export function fetchCollection(name) {
  return connect().collection(name);
}

function connect() {
  if (dbConnection != undefined) return dbConnection;

  try {
    const client = new MongoClient(process.env.MONGO_URI);
    dbConnection = client.db("POST-IT-RECOGNITION");
    console.log("Connected to MongoDB, POST-IT-RECOGNITION");
    return dbConnection;
  } catch (error) {
    console.error(error);
  }
}
