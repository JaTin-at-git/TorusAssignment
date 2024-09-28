const express = require("express");
const userController = require("./../controllers/userController"); //this format, instead of using path, helps intellisense
const authController = require("../controllers/authControllerUser");
const rateLimit = require("express-rate-limit");
const router = express.Router();

// get basic details about a user
// router.get('/profile/:username', authController.addUserToRequest, userController.getUser);

//for signing up
router.post('/signup', rateLimit({
    windowMs: 30 * 60 * 1000, limit: 5, message: "Rate limit exceeded, please try again later."
}), authController.signup); //ok

//for logging in
// noinspection JSCheckFunctionSignatures
router.post('/login', rateLimit({
    windowMs: 30 * 60 * 1000, limit: 7, message: "Rate limit exceeded, please try again later."
}), authController.login);

router.post('/logout', authController.logout); //ok

router.post('/createTask', authController.protect, userController.createTask);

router.post('/test', (req, res, next) => {
    res.status(200).json({
        status: "success"
    })
});


module.exports = router;