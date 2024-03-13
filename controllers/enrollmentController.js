const { query } = require("express");
const { connectToMongoDB, client, ObjectId } = require("../config/mongodb");
const { classCollection } = require("./classController");
const { cartCollection } = require("./cartController");
const { enrolledCollection, paymentCollection } = require("../config/stripe");

module.exports = {
  //classes Based on Popularity
  popularClasses: async (req, res) => {
    const result = await classCollection
      .find()
      .sort({ totalEnrolled: -1 })
      .limit(6)
      .toArray();
    res.send(result);
  },
  //instructor Based On Popularity
  popularInstructor: async (req, res) => {
    const pipeline = [
      {
        $group: {
          _id: "$instructorEmail",
          totalEnrolled: { $sum: "$totalEnrolled" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
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
          totalEnrolled: 1,
        },
      },
      {
        $sort: {
          totalEnrolled: -1,
        },
      },
      {
        $limit: 6,
      },
    ];
    const results = await classCollection.aggregate(pipeline).toArray();
    res.send(results);
  },
};
