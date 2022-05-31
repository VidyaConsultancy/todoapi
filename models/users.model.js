const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) =>
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value),
      message: `Please enter a valid email address`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    street: { type: String },
    city: String,
    pincode: Number
  },
});

module.exports = mongoose.model("User", userSchema);