// server.js

// Import necessary libraries
let express = require("express");
let mongoose = require("mongoose");
let dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Initialize the express app
let app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Connect to MongoDB using the URI from the .env file
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB"); // Success message if connected
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err); // Error message if connection fails
  });

// Import the User model
let User = require("./models/User");

// Route to get all users
app.get("/users", async (req, res) => {
  try {
    // Fetch all users from the database
    let users = await User.find();
    // Return the list of users as a JSON response
    res.json(users);
  } catch (err) {
    // Return error message if something goes wrong
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Route to add a new user
app.post("/users", async (req, res) => {
  let { name, email } = req.body; // Extract name and email from request body
  try {
    // Create a new user object
    let newUser = new User({ name, email });
    // Save the new user to the database
    await newUser.save();
    // Return the new user object as a response
    res.status(201).json(newUser);
  } catch (err) {
    // Return error message if something goes wrong
    res.status(400).json({ message: "Error adding user" });
  }
});

// Route to update a user by ID
app.put("/users/:id", async (req, res) => {
  let { id } = req.params; // Get the user ID from the URL
  let { name, email } = req.body; // Extract name and email from the request body
  try {
    // Find and update the user by ID
    let updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );
    if (!updatedUser) {
      // Return error if the user is not found
      return res.status(404).json({ message: "User not found" });
    }
    // Return the updated user object
    res.json(updatedUser);
  } catch (err) {
    // Return error message if something goes wrong
    res.status(400).json({ message: "Error updating user" });
  }
});

// Route to delete a user by ID
app.delete("/users/:id", async (req, res) => {
  let { id } = req.params; // Get the user ID from the URL
  try {
    // Find and delete the user by ID
    let deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      // Return error if the user is not found
      return res.status(404).json({ message: "User not found" });
    }
    // Return success message after deletion
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    // Return error message if something goes wrong
    res.status(500).json({ message: "Error deleting user" });
  }
});

// Start the server and listen on port 3000
let PORT = process.env.PORT || 3000; // Use the port from environment or default to 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
