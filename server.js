const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
  path: "./config.env",
});

const app = require("./app");
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB !"))
  .catch((err) => console.log("MongoDB Connection Failed!"));

const port = process.env.PORT || 3006;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
