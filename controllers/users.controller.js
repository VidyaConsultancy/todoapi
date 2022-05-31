const fs = require("fs");

const { DB_PATH, isValid, isValidString } = require("../utils");
const { dbService } = require("../db/db.service");

const getAllUsers = async (req, res) => {
  // const tests = await req.db.collection("tests").find({}).toArray();
  // const tests = await res.locals.db.collection("tests").find({}).toArray();
  const tests = await dbService.db.collection("tests").find({}).toArray();
  // res.locals.client.close().then(_ => console.log("connection closed"))
  return res.status(200).json(tests);
  // fs.readFile(DB_PATH, (err, data) => {
  //   if (err) {
  //     // res.statusCode = 500;
  //     // res.statusMessage = err.message;
  //     return res.status(500).json({
  //       success: false,
  //       code: 500,
  //       message: err.message,
  //       error: err,
  //       data: null,
  //       resource: req.originalUrl,
  //     });
  //   }

  //   const dataString = data.toString();
  //   const dbObject = JSON.parse(dataString);
  //   const users = dbObject.users;

  //   return res.json({
  //     success: true,
  //     code: 200,
  //     message: "User list retrieved",
  //     error: null,
  //     data: { users },
  //     resource: req.originalUrl,
  //   });
  // });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  fs.readFile(DB_PATH, (err, data) => {
    if (err) {
      // res.statusCode = 500;
      // res.statusMessage = err.message;
      return res.status(500).json({
        success: false,
        code: 500,
        message: err.message,
        error: err,
        data: null,
        resource: req.originalUrl,
      });
    }

    const dataString = data.toString();
    const dbObject = JSON.parse(dataString);
    const users = dbObject.users;
    const user = users.filter((user) => user.id === +userId);

    if (Array.isArray(user) && user.length) {
      return res.json({
        success: true,
        code: 200,
        message: "User details",
        error: null,
        data: { user: user[0] },
        resource: req.originalUrl,
      });
    }

    return res.status(404).json({
      success: false,
      code: 404,
      message: "User details not found",
      error: null,
      data: null,
      resource: req.originalUrl,
    });
  });
};

const createUser = (req, res) => {
  const user = req.body;
  const response = {
    success: true,
    code: 201,
    message: "user created successfully",
    data: null,
    error: null,
    resource: req.originalUrl,
  };
  if (!user || Object.keys(user).length === 0) {
    response.success = false;
    response.code = 400;
    response.message = "Invalid request data";
    response.error = "Invalid request data";
    return res.status(400).json(response);
  }
  if (!user.id || (user.id && isNaN(Number(user.id)))) {
    response.success = false;
    response.code = 400;
    response.message = "Invalid request data. Id is required";
    response.error = "Invalid request data. Id is required";
    return res.status(400).json(response);
  }
  if (!user.name || (user.name && user.name.trim().length === 0)) {
    response.success = false;
    response.code = 400;
    response.message = "Invalid request data. Name is required";
    response.error = "Invalid request data. Name is required";
    return res.status(400).json(response);
  }
  if (
    !user.department ||
    (user.department && user.department.trim().length === 0)
  ) {
    response.success = false;
    response.code = 400;
    response.message = "Invalid request data. Department is required";
    response.error = "Invalid request data. Department is required";
    return res.status(400).json(response);
  }
  fs.readFile(DB_PATH, (err, data) => {
    if (err) {
      response.success = false;
      response.code = 500;
      response.message = err.message;
      response.error = err;
      return res.status(500).json(response);
    }
    const dbData = JSON.parse(data.toString());
    const { users } = dbData;
    const isUserExist = users.find((userObj) => userObj.id === +user.id);
    if (isUserExist) {
      response.success = false;
      response.code = 400;
      response.message = "User id already exist.";
      response.error = "User id already exist.";
      return res.status(400).json(response);
    }
    const formattedUser = {
      id: +user.id,
      name: user.name.trim(),
      department: user.department.trim(),
    };
    users.push(formattedUser);
    dbData.users = users;
    fs.writeFile(DB_PATH, JSON.stringify(dbData), (err) => {
      if (err) {
        response.success = false;
        response.code = 500;
        response.message = err.message;
        response.error = err;
        return res.status(500).json(response);
      }
      response.data = { user: formattedUser };
      return res.status(201).send(response);
    });
  });
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
}