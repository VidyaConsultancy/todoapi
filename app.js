const express = require("express");
const http = require("http");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const PORT = 3000;
const cacheMemory = {};

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  console.log(req.headers);
  return res.send("Welcome to express server");
});

app.get("/users", (req, res, next) => {
  console.log(req.params, req.query);
  const users = cacheMemory["users"];
  if (users) {
    return res.json({
      success: true,
      code: 200,
      message: "User list retrieved from the cache",
      error: null,
      data: { users },
      resource: req.url,
    });
  }
  fs.readFile("./db.json", (err, data) => {
    if (err) {
      // res.statusCode = 500;
      // res.statusMessage = err.message;
      return res.status(500).json({
        success: false,
        code: 500,
        message: err.message,
        error: err,
        data: null,
        resource: req.url,
      });
    }

    const dataString = data.toString();
    const dbObject = JSON.parse(dataString);
    const users = dbObject.users;
    cacheMemory["users"] = users;

    return res.json({
      success: true,
      code: 200,
      message: "User list retrieved",
      error: null,
      data: { users },
      resource: req.url,
    });
  });
});

app.get("/users/:userId", (req, res, next) => {
  const { userId } = req.params;
  fs.readFile("./db.json", (err, data) => {
    if (err) {
      // res.statusCode = 500;
      // res.statusMessage = err.message;
      return res.status(500).json({
        success: false,
        code: 500,
        message: err.message,
        error: err,
        data: null,
        resource: req.url,
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
        resource: req.url,
      });
    }

    return res.status(404).json({
      success: false,
      code: 404,
      message: "User details not found",
      error: null,
      data: null,
      resource: req.url,
    });
  });
});

app.post("/users", (req, res) => {
  const user = req.body;
  const response = {
    success: true,
    code: 201,
    message: "user created successfully",
    data: null,
    error: null,
    resource: req.url,
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
  fs.readFile("./db.json", (err, data) => {
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
    fs.writeFile("./db.json", JSON.stringify(dbData), (err) => {
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
});

app.get("/todos", (req, res, next) => {
  const { userId } = req.query;
  fs.readFile("./db.json", (err, data) => {
    if (err) {
      // res.statusCode = 500;
      // res.statusMessage = err.message;
      return res.status(500).json({
        success: false,
        code: 500,
        message: err.message,
        error: err,
        data: null,
        resource: req.url,
      });
    }

    const dataString = data.toString();
    const dbObject = JSON.parse(dataString);
    const todos = dbObject.todos;
    if (userId) {
      const userTodos = todos.filter((todo) => todo.userId === +userId);

      if (Array.isArray(userTodos) && userTodos.length) {
        return res.json({
          success: true,
          code: 200,
          message: "User todos list",
          error: null,
          data: { todos: userTodos },
          resource: req.url,
        });
      }

      return res.status(404).json({
        success: false,
        code: 404,
        message: "User todos not available",
        error: null,
        data: null,
        resource: req.url,
      });
    }

    return res.status(200).json({
      success: true,
      code: 200,
      message: "Todos list",
      error: null,
      data: { todos },
      resource: req.url,
    });
  });
});

const middleware = (req, res, next) => {
  console.log("I am in between");
  return res.send("I cut the req res in between");
};

const middlewareWithOptions = (options) => {
  return (req, res, next) => {
    console.log("I am in between");
    return res.send("I cut the req res in between");
  };
};

app.all(
  "/test",
  (req, res, next) => {
    console.log("I am in between");
    console.log(req.body);
    return res.send("I cut the req res in between");
  },
  middleware,
  middlewareWithOptions(),
  (req, res, next) => {
    return res.send("I am test route");
  }
);

server.listen(PORT, () => {
  console.log(`Express application is listening at http://localhost:${PORT}`);
});
