const fs = require("fs");

const { DB_PATH } = require("../utils");

const getAllTodos = (req, res) => {
  const { userId } = req.query;
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
};

module.exports = {
  getAllTodos,
};
