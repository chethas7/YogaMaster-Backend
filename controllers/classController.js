const { connectToMongoDB, client, ObjectId } = require("../config/mongodb");

const database = client.db("YogaMaster");
const classCollection = database.collection("classes");
const appliedCollection = database.collection("applied");
module.exports = {
  classCollection: classCollection,
  appliedCollection: appliedCollection,
  //Get Status By Approved Status
  getallCLasses: async (req, res) => {
    const result = await classCollection.find().toArray();
    res.json(result);
    res.end();
  },

  //Post New Class
  postNewClass: async (req, res) => {
    try {
      const newClass = req.body;
      const result = await classCollection.insertOne(newClass);
      res.send(result); // Sending the result as JSON response
    } catch (error) {
      console.error("Error in post request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  //get classes by instructor Email
  getinstructorMail: async (req, res) => {
    const email = req.params.email;
    const result = await classCollection
      .find({ InstructorEmail: email })
      .toArray();
    console.log(result, "query");
    res.json(result);
  },

  //get all classes
  manageClasses: async (req, res) => {
    const result = await classCollection.find().toArray();
    res.send(result);
  },

  //Update Class status
  updateClassStatus: async (req, res) => {
    const id = req.params.id;
    const status = req.body.status;
    const reason = req.body.reason;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        status: status,
        reason: reason,
      },
    };
    const result = await classCollection.updateOne(filter, updateDoc, options);
    res.send(result);
  },

  //get Approved Classes
  approvedClasses: async (req, res) => {
    const query = { status: "approved" };
    const result = await classCollection.find(query).toArray();
    res.send(result);
  },

  //get single Class Details
  singleClassDetails: async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await classCollection.findOne(query);
    res.send(result);
  },

  //update class details
  updateClassDetails: async (req, res) => {
    const id = req.params.id;
    const updateClass = req.body;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        name: updateClass.name,
        description: updateClass.description,
        instructorEmail: updateClass.instructorEmail,
        price: updateClass.price,
        availableSeats: parseInt(updateClass.availableSeats),
        videLink: updateClass.videLink,
        status: updateClass.status,
        reason: updateClass.reason,
      },
    };
    const result = await classCollection.updateOne(filter, updateDoc, options);
    res.send(result);
  },
};
