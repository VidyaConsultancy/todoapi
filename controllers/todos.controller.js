const TodoModel = require("../models/todos.model");

const getAllTodos = async (req, res) => {
  try {
    const todos = await TodoModel.find({}); // db.todos.find({}) or db.collection("todos").find()
    return res.status(200).json({todos});
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  getAllTodos: getAllTodos,
};
