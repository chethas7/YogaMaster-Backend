const { query } = require("express");
const { connectToMongoDB, client, ObjectId } = require("../config/mongodb");
const { classCollection } = require("./classController");
const { cartCollection } = require("./cartController");
const { enrolledCollection, paymentCollection } = require("../config/stripe");

module.exports = {
  //create Payment Intent
  createPaymentIntent: async (req, res) => {
    const { price } = req.body;
    const amount = parseInt(price) * 100;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "inr",
      payment_method_types: ["card"],
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  },
  //post Payment Intent
  postPaymentIntent: async (req, res) => {
    const paymentInfo = req.body;
    const classId = paymentInfo.userId;
    const userEmail = paymentInfo.userEmail;
    const singleClassId = req.query.classId;
    if (singleClassId) {
      query = { classId: singleClassId, userEmail: userEmail };
    } else {
      query = { classId: { $in: classId } };
    }
    const classQuery = { _id: { $in: classId.map((id) => new ObjectId(id)) } };
    const classes = await classCollection.find(classQuery).toArray();
    const newEnrollmentData = {
      userMail: userEmail,
      classId: singleClassId.map((id) => new ObjectId(id)),
      transactionId: paymentInfo.transactionId,
    };
    const updateDoc = {
      $set: {
        totalEnrolled:
          classes.reduce((total, current) => total + current, 0) + 1 || 0,
        availableSeats:
          classes.reduce(
            (total, current) => total + current.availableSeats,
            0
          ) + 1 || 0,
      },
    };
    const updatedResult = await classCollection.updateMany(
      classQuery,
      updateDoc,
      { upsert: true }
    );
    const enrolledResult = await enrolledCollection.insertOne(
      newEnrollmentData
    );
    const deletedResult = await cartCollection.deleteMany(query);
    const paymentResult = await paymentCollection.insertOne(paymentInfo);
    res.send(paymentResult, deletedResult, enrolledResult, updatedResult);
  },

  //get Payment History
  getPaymentHistory: async (req, res) => {
    const email = req.params.id;
    const query = { userEmail: email };
    const result = await paymentCollection
      .find(query)
      .sort({ date: -1 })
      .toArray();
    res.send(result);
  },

  //get Payment History Length
  PaymentHistoryLength: async (req, res) => {
    const email = req.params.id;
    const query = { userEmail: email };
    const total = await paymentCollection.countDocuments(query);
    res.send({ total });
  },
};
