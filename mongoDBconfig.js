const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv").config();

const uri = process.env.MONGODB;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let classesCollection;
let userCollection;
let cartCollection;
let paymentCollection;

async function connectToMongoDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    const database = client.db("YogaMaster");
    classesCollection = database.collection("classes");
    userCollection = database.collection("users");
    cartCollection = database.collection("carts");
    paymentCollection = database.collection("payments");

    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Throw an error if the connection fails
  }
}

function getCollection(collectionName) {
  if (!client.isConnected()) {
    throw new Error("Database not connected");
  }

  switch (collectionName) {
    case "classes":
      return classesCollection;
    case "users":
      return userCollection;
    case "carts":
      return cartCollection;
    case "payments":
      return paymentCollection;
    default:
      throw new Error(`Unknown collection: ${collectionName}`);
  }
}

module.exports = {
  connectToMongoDB,
  getCollection,
  classesCollection,
};
