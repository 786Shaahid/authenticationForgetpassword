
//   mongoose.connect('mongodb://127.0.0.1:27017/myUserDB');
//  const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error: "));
// db.once("open", function () {
  //   console.log("Connected successfully to database!");
  // });
  const mongoose=require("mongoose");
  const url= `mongodb+srv://shahidraza02qwert:${process.env.MONGODB_PASSWORD}@cluster0.mqrfg6o.mongodb.net/${process.env.MONGODB_DATABASENAME}?retryWrites=true&w=majority`

  mongoose.connect(url);
 const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully to database!");
});


module.exports=db;
