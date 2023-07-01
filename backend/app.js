const express = require("express");
// const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();

//error global importing
const errorMiddleware = require("./middleware/error")

//middleware used here
app.use(express.json());
app.use(cookieParser());

//route importing 
const product  = require("./routes/productRoute");
const user = require("./routes/userRoutes");
const order = require("./routes/orderRoute")


app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);

///global error middleware
app.use(errorMiddleware);

module.exports = app;