require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/databsae");
const errorHandler = require("./src/middlewares/errorHandler");
const routes = require("./src/routes/routes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1", routes);

//Error Handling Global Middleware
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
startServer();

module.exports = app;
