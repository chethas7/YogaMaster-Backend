const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 3000;
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { connectToMongoDB } = require("./config/mongodb");

app.use(cors());
app.use(express.json());
connectToMongoDB();

// Use your routes
app.use("/", userRoutes);
app.use("/admin", adminRoutes);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
