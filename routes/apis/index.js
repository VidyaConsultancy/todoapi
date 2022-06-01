const express = require("express");

const { usersController } = require("../../controllers");
const { todosController } = require("../../controllers");

const router = express.Router();

/* Users routes */
router.get("/users", usersController.getAllUsers);
router.get("/users/:userId", usersController.getUserById);
router.post("/users", usersController.createUser);
router.put("/users/:userId", usersController.updateUser);
router.delete("/users/:userId", usersController.deleteUser);

/* Todos routes */
router.get("/todos", todosController.getAllTodos);

module.exports = router;