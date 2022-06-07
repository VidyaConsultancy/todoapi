const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const {
  isValid,
  isValidString,
  isValidObject,
  isValidEmail,
  SALT,
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
  try {
    const isEmailExist = await UserModel.findOne({
      email: user.email,
    });
    if (isEmailExist)
      throw new Error(`This email ${user.email} id is already registered.`);
  } catch (error) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: error.message,
      error: error,
      data: null,
      resource: req.originalUrl,
    });
  }
  const hashPassword = await bcrypt.hash(user.password.trim(), SALT);
  const cleanedUserData = {
    name: user.name.trim(),
    email: user.email.trim(),
    password: hashPassword,
  };
  if (user.address) {
    cleanedUserData.address = user.address;
  }
  try {
    const newUser = new UserModel(cleanedUserData);
    await newUser.save();
    response.data = { user: newUser };
    const smtpTransporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "9b5d1fd4eb0949",
        pass: "6237a14066a3fa",
      },
    });
    smtpTransporter.verify(async function (error, success) {
      if(error) {
        console.error(`Error connecting to mail provider`, error.message);
      } else {
        let info = await smtpTransporter.sendMail({
          from: '"Todo App" <contact@todoapp.com>', // sender address
          to: newUser.email, // list of receivers
          subject: "Welcome to Todo app ✔", // Subject line
          text: `Hello, ${user.name}, Welcome to Todo app. Let's get started and created some awesome todos.`, // plain text body
          html: `<!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta http-equiv="X-UA-Compatible" content="IE=edge">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Document</title>
                  <style>
                    body {
                      background-color: #ffffff;
                    }
                    .content {
                      width: 600px;
                      margin-left: auto;
                      margin-right: auto;
                      background-color: #f8f8f8;
                    }
                  </style>
              </head>
              <body>
                  <div class="content">
                      <div class="header">
                          <h1>Hello ${user.name},</h1>
                          <p>Welcome to Todo app</p>
                      </div>
                      <div class="body">
                          <button>Let's get started</button>
                      </div>
                      <div class="footer">
                          Thank you,
                          Team TodoApp
                      </div>
                  </div>
              </body>
              </html>`, // html body
        });
        console.log("Message sent: %s", info.messageId);
        return res.status(201).json(response);
      }
    })
  } catch (error) {
    response.error = error;
    response.message = error.message;
    response.code = error.code ? error.code : 500;
    return res.status(500).json(response);
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const userData = req.body;
  if (!isValid(userData) || !isValidObject(userData)) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "Empty request body, nothing to update.",
      error: null,
      data: null,
      resource: req.originalUrl,
    });
  }

  if (isValid(userData.email) && isValidEmail(userData.email)) {
    try {
      const isEmailExist = await UserModel.findOne({
        email: userData.email,
        _id: { $ne: userId },
      });
      if (isEmailExist)
        throw new Error(
          `This email ${userData.email} id is already registered.`
        );
    } catch (error) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: error.message,
        error: error,
        data: null,
        resource: req.originalUrl,
      });
    }
  }
  try {
    const isUserExist = await UserModel.findById(userId);
    if (!isUserExist)
      throw new Error("Invalid user id. User does not exist with this id.");

    if (userData.password) {
      const saltRounds = 16;
      const salt = await bcrypt.genSalt(saltRounds);
      userData.password = await bcrypt.hash(userData.password, SALT);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: userData },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      code: 200,
      message: "User updated successfully",
      error: null,
      data: { user: updatedUser },
      resource: req.originalUrl,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      code: 404,
      message: error.message,
      error: error,
      data: null,
      resource: req.originalUrl,
    });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const isUserExist = await UserModel.findById(userId);
    if (!isUserExist)
      throw new Error("Invalid user id. User does not exist with this id.");
    isUserExist.delete();
    return res.status(200).json({
      success: true,
      code: 200,
      message: "User deleted successfully",
      error: null,
      data: { user: isUserExist },
      resource: req.originalUrl,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      code: 404,
      message: error.message,
      error: error,
      data: null,
      resource: req.originalUrl,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
