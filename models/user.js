// models/User.js

// Import mongoose to define the schema
let mongoose = require("mongoose");

// Define the schema for the user
let userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name is required for a user
  },
  email: {
    type: String,
    required: true, // Email is required
    unique: true, // Ensure no duplicate emails
  },
});

// Create a User model from the schema
let User = mongoose.model("User", userSchema);

// Export the User model for use in other files
module.exports = User;
