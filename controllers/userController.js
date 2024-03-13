const { query } = require("express");
const { connectToMongoDB, client, ObjectId } = require("../config/mongodb");
const bcrypt = require("bcrypt");

const database = client.db("YogaMaster");
const userCollection = database.collection("user");
module.exports = {
  userCollection: userCollection,

  //Post New User
  postNewUser: async (req, res) => {
    const newUser = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);
    newUser.password = hashedPassword;
    const result = await userCollection.insertOne(newUser);
    res.send(result);
  },
  //get All Users
  getAllUsers: async (req, res) => {
    const result = await userCollection.findOne({}).toArray();
    res.send(result);
  },
  //get Users by Id
  getUsersByID: async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await userCollection.findOne(query).toArray();
    res.send(result);
  },
  //get User by Email
  getUsersByEmail: async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const result = await userCollection.findOne(query);
    res.send(result);
  },
  //delete User
  deleteUser: async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await userCollection.deleteOne(query);
  },
  //update User
  updateUser: async (req, res) => {
    const id = req.params.id;
    const updatedUser = req.body;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.option,
        address: updatedUser.address,
        about: updatedUser.about,
        photoUrl: updatedUser.photoUrl,
        skills: updatedUser.skills ? updatedUser.skills : null,
      },
    };
    const result = await userCollection.updateOne(filter, updateDoc, options);
    res.send(result);
  },
};
