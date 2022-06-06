const express = require("express");

const { usersController, todosController, authController } = require("../../controllers");
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

/* Auth routes */
router.post("/login", authController.login);

module.exports = router;