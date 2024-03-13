const { query } = require("express");
const { connectToMongoDB, client, ObjectId } = require("../config/mongodb");
const { classCollection } = require("./classController");

const database = client.db("YogaMaster");
const cartCollection = database.collection("cart");

module.exports = {
  cartCollection: cartCollection,
  //Add To Cart
  addToCart: async (req, res) => {
    try {
      const newCartItem = req.body;
      const result = await cartCollection.insertOne(newCartItem);
      res.send(result); // Sending the result as JSON response
    } catch (error) {
      console.error("Error in post request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  //Get Cart items by Id
  getCartItemsbyId: async (req, res) => {
    const id = req.params.id;
    const email = req.body.email;
    const query = {
      classId: id,
      userMail: email,
    };
    const projection = {
      classId: 1,
    };
    const result = await cartCollection.findOne(query, {
      projection: projection,
    });
    console.log(result);
    res.send(result);
  },

  //Cart Info by ID
  cartinfobyID: async (req, res) => {
    const Email = req.body.email;
    const Query = { userMail: Email };
    const Projection = { classId: 1 };
    const cart = await cartCollection.findOne(Query, { Projection });
    const classIds = cart.map((cart) => new ObjectId(cart.classId));
    const query2 = { _id: { $in: classIds } };
    const result = await classCollection.find(query2).toArray();
    res.send(result);
  },

  //Delete Cart Item by ID
  deleteCartbyID: async (req, res) => {
    const id = req.params.id;
    const Query = { classId: id };
    const result = await cartCollection.deleteOne(Query);
    res.send(result);
  },
};
