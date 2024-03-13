const express = require("express");
const router = express.Router();
const { MongoClient, ServerApiVersion } = require("mongodb");
const {
  connectToMongoDB,
  client,
  classesCollection,
  userCollection,
  cartCollection,
  paymentCollection,
} = require("../mongoDBconfig");
console.log("classesCollection: ", classesCollection);

// Define user routes
router.get("/", async (req, res) => {
  console.log("useroute");
  res.send("User route");
});

router.post("/new-class", async (req, res) => {
  const newClass = req.body;
  // newClass.availableSeats = parseInt(newClass.availableSeats);
  try {
    await connectToMongoDB();
    const result = await classesCollection.insertOne(newClass);
    res.send(result);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).send("Error connecting to MongoDB");
  }
});

router.get("/class", async (req, res) => {
  try {
    await connectToMongoDB();
    const data = { name: "Progressive" };
    const result = await classesCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).send("Error connecting to MongoDB");
  }
});

module.exports = router;
