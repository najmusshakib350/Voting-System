const express = require("express");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const AppError = require("./utils/appError");
const GlobalError = require("./controllers/errorcontroller");
const app = express();
const UserRouter = require("./routes/UserRouter");

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/evote/", UserRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this server`, 404));
});
//Second step we will implement global error handling middleware
app.use(GlobalError);

module.exports = app;
