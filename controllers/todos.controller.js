const { isValidObjectId } = require("mongoose");

const TodoModel = require("../models/todos.model");
const {
  isValid,
  isValidString,
  isValidObject,
} = require("../utils");

const getAllTodos = async (req, res) => {
  try {
    const todos = await TodoModel.find({
      isDeleted: false,
      userId: res.locals.userId,
    }); // db.todos.find({}) or db.collection("todos").find()
    return res.status(200).json({
      success: true,
      code: 200,
      message: "User todo list",
      data: { todos },
      error: null,
      resource: req.originalUrl,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      code: 500,
      message: error.message,
      data: null,
      error: error,
      resource: req.originalUrl,
    });
  }
};

const createTodo = async (req, res) => {
  const reqData = req.body;
  if (!isValid(reqData) || (isValid(reqData) && !isValidObject(reqData))) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "Invalid request, missing request data.",
      data: null,
      error: null,
      resource: req.originalUrl,
    });
  }
  if (
    !isValid(reqData.todo) ||
    (isValid(reqData.todo) && !isValidString(reqData.todo))
  ) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "Invalid request, missing required todo name.",
      data: null,
      error: null,
      resource: req.originalUrl,
    });
  }

  try {
    const todo = await TodoModel.create({
      todo: reqData.todo,
      userId: res.locals.userId,
    });
    return res.status(201).json({
      success: true,
      code: 201,
      message: "Todo created successfully",
      data: { todo },
      error: null,
      resource: req.originalUrl,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      code: 500,
      message: error.message,
      data: null,
      error: error,
      resource: req.originalUrl,
    });
  }
};

const updateTodo = async (req, res) => {
  const todoId = req.params.todoId;
  const reqData = req.body;
  if (!isValid(reqData) || (isValid(reqData) && !isValidObject(reqData))) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "Invalid request, missing request data.",
      data: null,
      error: null,
      resource: req.originalUrl,
    });
  }
  if (
    !isValid(reqData.todo) ||
    (isValid(reqData.todo) && !isValidString(reqData.todo))
  ) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "Invalid request, missing required todo name.",
      data: null,
      error: null,
      resource: req.originalUrl,
    });
  }

  if (!isValidObjectId(todoId)) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "Invalid todo id",
      data: null,
      error: null,
      resource: req.originalUrl,
    });
  }

  try {
    const todo = await TodoModel.findOne({ _id: todoId, isDeleted: false });
    if (!todo) {
      return res.status(404).json({
        success: false,
        code: 404,
        message: "Invalid request, todo item does not exist",
        data: null,
        error: null,
        resource: req.originalUrl,
      });
    }
    if(todo.userId.toString() !== res.locals.userId) {
      return res.status(403).json({
        success: false,
        code: 403,
        message: "Invalid request, forbidden",
        data: null,
        error: null,
        resource: req.originalUrl,
      });
    }
    todo.todo = reqData.todo;
    await todo.save();
    return res.status(200).json({
      success: true,
      code: 200,
      message: "Todo updated successfully",
      data: { todo },
      error: null,
      resource: req.originalUrl,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      code: 500,
      message: error.message,
      data: null,
      error: error,
      resource: req.originalUrl,
    });
  }
};

const deleteTodo = async (req, res) => {
  const todoId = req.params.todoId;
  if (!isValidObjectId(todoId)) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "Invalid todo id",
      data: null,
      error: null,
      resource: req.originalUrl,
    });
  }
  try {
    const todo = await TodoModel.findOne({ _id: todoId, isDeleted: false });
    if (!todo) {
      return res.status(404).json({
        success: false,
        code: 404,
        message: "Invalid request, todo item does not exist",
        data: null,
        error: null,
        resource: req.originalUrl,
      });
    }
    if (todo.userId.toString() !== res.locals.userId) {
      return res.status(403).json({
        success: false,
        code: 403,
        message: "Invalid request, forbidden",
        data: null,
        error: null,
        resource: req.originalUrl,
      });
    }
    todo.isDeleted = true;
    todo.deletedAt = new Date().toISOString();
    await todo.save();
    return res.status(200).json({
      success: true,
      code: 200,
      message: "Todo deleted successfully",
      data: { todo },
      error: null,
      resource: req.originalUrl,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      code: 500,
      message: error.message,
      data: null,
      error: error,
      resource: req.originalUrl,
    });
  }
};

const updateTodoStatus = async (req, res) => {
  const todoId = req.params.todoId;
  if (!isValidObjectId(todoId)) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "Invalid todo id",
      data: null,
      error: null,
      resource: req.originalUrl,
    });
  }
  try {
    const todo = await TodoModel.findOne({ _id: todoId, isDeleted: false });
    if (!todo) {
      return res.status(404).json({
        success: false,
        code: 404,
        message: "Invalid request, todo item does not exist",
        data: null,
        error: null,
        resource: req.originalUrl,
      });
    }
    if (todo.userId.toString() !== res.locals.userId) {
      return res.status(403).json({
        success: false,
        code: 403,
        message: "Invalid request, forbidden",
        data: null,
        error: null,
        resource: req.originalUrl,
      });
    }
    todo.isCompleted = Boolean(req.body.isCompleted);
    await todo.save();
    return res.status(200).json({
      success: true,
      code: 200,
      message: "Todo status updated successfully",
      data: { todo },
      error: null,
      resource: req.originalUrl,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      code: 500,
      message: error.message,
      data: null,
      error: error,
      resource: req.originalUrl,
    });
  }
}

module.exports = {
  getAllTodos: getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  updateTodoStatus,
};
