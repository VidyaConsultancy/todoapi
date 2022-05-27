const express = require("express");

const { usersController } = require("../../controllers");

const router = express.Router();

router.get("/", usersController.getAllUsers);
router.get("/:userId", usersController.getUserById);
router.post("/", usersController.createUser);

module.exports = router;
