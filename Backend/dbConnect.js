const mongoose = require('mongoose')

  // const URL ='mongodb+srv://ritu6713:Rajesh2001@cluster0.znmrnnt.mongodb.net/my-garage?retryWrites=true&w=majority'


  const URL = 'mongodb+srv://nandkamal2:96rJjB2osYIQrMT0@cluster0.d1yztsl.mongodb.net/abc?retryWrites=true&w=majority&appName=Cluster0'
  // const URL = `${process.env.MONGO_URI}/abc`;
  // Password: 96rJjB2osYIQrMT0
  mongoose.connect(URL);

let connectionObj = mongoose.connection;

connectionObj.on("connected", () => {
  console.log("Mongo DB Connection Successful");
});

connectionObj.on("error", () => {
  console.log("Mongo DB Connection Failed");
});