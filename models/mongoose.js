const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/socialmedia", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("CONNECTED...");
  })
  .catch((err) => {
      console.log(err)
    console.log("ERROR...");
  });