const express = require("express");
const router = express.Router();
const userController = require("./../controllers/userController"); //this format, instead of using path, helps intellisense
const authController = require("../controllers/authControllerUser");
const taskController = require("../controllers/taskController");

router.post('/getTasks', authController.protect, taskController.getTasks)
router.post('/updateTaskStatus', authController.protect, taskController.updateTaskStatus);

module.exports = router;