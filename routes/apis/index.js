const express = require("express");

const {
  usersController,
  todosController,
  authController,
} = require("../../controllers");
const { authMiddleware } = require("../../middlewares/auth.middleware");

const router = express.Router();

/* Users routes */
router.get("/users", usersController.getAllUsers);
router.get("/users/:userId", usersController.getUserById);
router.post("/users", usersController.createUser);
router.put("/users/:userId", usersController.updateUser);
router.delete("/users/:userId", usersController.deleteUser);

/* Todos routes */
router.get("/todos", authMiddleware, todosController.getAllTodos);
router.post("/todos", authMiddleware, todosController.createTodo);
router.put("/todos/:todoId", authMiddleware, todosController.updateTodo);
router.patch(
  "/todos/:todoId",
  authMiddleware,
  todosController.updateTodoStatus
);
router.delete("/todos/:todoId", authMiddleware, todosController.deleteTodo);

/* Auth routes */
router.post("/login", authController.login);

module.exports = router;
