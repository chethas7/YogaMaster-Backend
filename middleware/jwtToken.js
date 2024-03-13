var jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

module.exports = {
  generateToken: async (req, res) => {
    const user = req.body;
    var token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: "24h" });
    res.send(token);
  },
  verifyJWT: async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).send({ message: "invalid authorization" });
    }
    const token = authorization?.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: "FOrbidden Access" });
      }
      req.decoded = decoded;
      next();
    });
  },
};
