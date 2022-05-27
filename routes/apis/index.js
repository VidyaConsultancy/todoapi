const express = require("express");
const router = express.Router();

const usersRouter = require("./users.routes");
const todosRouter = require("./todos.routes");

router.use("/users", usersRouter);
router.use("/todos", todosRouter);

module.exports = router;