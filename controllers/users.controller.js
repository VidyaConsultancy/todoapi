const fs = require("fs");

const {
  DB_PATH,
  isValid,
  isValidString,
  isValidObject,
  isValidEmail,
} = require("../utils");
const UserModel = require("../models/users.model");

const getAllUsers = async (req, res) => {
  const response = {
    success: true,
    code: 200,
    message: "Users list",
    error: null,
    data: null,
    resource: req.originalUrl,
  };
  try {
    const users = await UserModel.find({});
    response.data = { users };
    return res.status(200).json(response);
  } catch (error) {
    response.error = error;
    response.message = error.message;
    response.code = error.code ? error.code : 500;
    return res.status(500).json(response);
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  const response = {
    success: true,
    code: 200,
    message: "User details",
    error: null,
    data: null,
    resource: req.originalUrl,
  };
  try {
    const user = await UserModel.findOne({ _id: userId });
    if (!user) throw new Error("User does not exist");
    response.data = { user };
    return res.status(200).json(response);
  } catch (error) {
    response.error = error;
    response.message = error.message;
    response.code = error.code ? error.code : 500;
    return res.status(500).json(response);
  }
};

const createUser = async (req, res) => {
  const user = req.body;
  const response = {
    success: true,
    code: 201,
    message: "user created successfully",
    data: null,
    error: null,
    resource: req.originalUrl,
  };
  if (!isValid(user) && !isValidObject(user)) {
    response.success = false;
    response.code = 400;
    response.message = "Invalid request data";
    response.error = "Invalid request data";
    return res.status(400).json(response);
  }
  if (
    !isValid(user.name) ||
    (isValid(user.name) && !isValidString(user.name))
  ) {
    response.success = false;
    response.code = 400;
    response.message = "Invalid request data. Name is required";
    response.error = "Invalid request data. Name is required";
    return res.status(400).json(response);
  }
  if (
    !isValid(user.email) ||
    (isValid(user.email) && !isValidEmail(user.email))
  ) {
    response.success = false;
    response.code = 400;
    response.message = "Invalid request data. Email is required";
    response.error = "Invalid request data. Email is required";
    return res.status(400).json(response);
  }
  if (
    !isValid(user.password) ||
    (isValid(user.password) && !isValidString(user.password))
  ) {
    response.success = false;
    response.code = 400;
    response.message = "Invalid request data. Email is required";
    response.error = "Invalid request data. Email is required";
    return res.status(400).json(response);
  }
  const cleanedUserData = {
    name: user.name.trim(),
    email: user.email.trim(),
    password: user.password.trim(),
  };
  if (user.address) {
    cleanedUserData.address = user.address;
  }
  try {
    const newUser = new UserModel(cleanedUserData);
    await newUser.save();
    response.data = { user: newUser };
    return res.status(201).json(response);
  } catch (error) {
    response.error = error;
    response.message = error.message;
    response.code = error.code ? error.code : 500;
    return res.status(500).json(response);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
};
