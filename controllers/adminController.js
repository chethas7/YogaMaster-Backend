const { query } = require("express");
const { connectToMongoDB, client, ObjectId } = require("../config/mongodb");
const { classCollection, appliedCollection } = require("./classController");
const { cartCollection } = require("./cartController");
const { userCollection } = require("./userController");
const { enrolledCollection, paymentCollection } = require("../config/stripe");
const userController = require("./userController");
module.exports = {
  //get Details for Admin Dashboard
  adminStatus: async (req, res) => {
    const approvedClass = await classCollection
      .find({ status: "approved" })
      .toArray().length;
    const pendingClass = await classCollection.find({ status: "pending" })
      .length;
    const instructors = (
      await userCollection.find({ role: "instructor" }).toArray()
    ).length;
    const totalCLasses = await classCollection.find().toArray().length;
    const enrolledClasses = (await enrolledCollection.find().toArray()).length;
    const result = {
      approvedClass,
      pendingClass,
      instructors,
      totalCLasses,
      enrolledClasses,
    };
    res.send(result);
  },

  //get all instructor
  getInstructorDetails: async (req, res) => {
    const result = await userCollection.find({ role: "instructor" }).toArray();
    res.send(result);
  },

  //get enrolled classes
  getEnrolledClasses: async (req, res) => {
    const email = req.params.email;
    const query = { userEmail: email };
    const pipeline = new [
      { $match: query },
      {
        $lookup: {
          from: "classes",
          localField: "classesId",
          foriegnField: "_id",
          as: "classes",
        },
      },
      {
        $unwind: "$classes",
      },
      {
        $lookup: {
          from: "users",
          localField: "classes.instructorEmail",
          foriegnField: "email",
          as: "instructor",
        },
      },
      {
        $project: {
          _id: 0,
          instructor: {
            $arrayElement: ["$instructor", 0],
          },
          classes: 1,
        },
      },
    ]();
    const result = await enrolledCollection.aggregate(pipeline).toArray();
    res.send(result);
  },
  //Post applied for instructor
  postAppliedInstructor: async (req, res) => {
    const data = req.body;
    const result = await appliedCollection.insertOne(data);
    res.send(result);
  },
  //Get Applied Instructor
  getAppliedInstructor: async (req, res) => {
    const email = req.params.email;
    const result = await appliedCollection.findOne(email).toArray();
    res.send(result);
  },
};
