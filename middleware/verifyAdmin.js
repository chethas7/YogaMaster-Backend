const { userCollection } = require("../controllers/userController");

module.exports = {
  verifyAdmin: async (req, res, next) => {
    const email = req.decoded.email;
    const query = { email: email };
    const user = await userCollection.findOne(query);

    if (user.role === "admin") {
      next();
    } else {
      return res.status(401).send({ message: "Forbidden Access" });
    }
  },
};
