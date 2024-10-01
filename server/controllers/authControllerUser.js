const catchAsync = require("../util/catchAsync");
const jwt = require("jsonwebtoken"); //token token token babe '>'
const AppError = require("../util/appError");
const {promisify} = require('util');
const User = require("../model/UserModel");

//returns a jwt token created using given id
const signToken = (id) => {
    return jwt.sign({id: id}, process.env.JWT_SECRET);
}

//creates a jwt token using user's _id, put it into a cookie and send it as response
const createSendToken = (user, status, res) => {
    const token = signToken(user._id);

    //hide password as we are not 'selecting' user == password is still in user object
    user.password = undefined;
    user.emailVerificationOtp = undefined

    //set cookies
    const options = process.env.NODE_ENV === "development" ? {
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), httpOnly: true, secure: false,
    } : {
        domain: ".onrender.com",  // Share the cookie across subdomains
        path: "/",                // Make cookie available on all paths
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),  // Set expiration (e.g., 1 day)
        httpOnly: true,           // Prevent JavaScript access to the cookie (secure)
        secure: true,             // Send only over HTTPS
        sameSite: "None",
    };
    res.cookie("jwt", token, options);


    res.status(status).json({
        status: 'success', token, data: {
            user
        }
    });
}

//to sing up the user
exports.signup = catchAsync(async (req, res, next) => {

    if (!req.body.email) return next(new AppError("Email id not provided", 400));

    // check if the user already exists
    const existingUser = await User.findOne({email: req.body.email});
    if (existingUser) {
        return res.status(401).json({
            status: "fail", message: "email id already registered",
        });
    }

    //not simply using req.body due to security reasons
    const newUser = await User.create({
        email: req.body.email.trim().toLowerCase(),
        name: req.body.name,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    createSendToken(newUser, 201, res);
});


exports.login = catchAsync(async (req, res, next) => {
    let {email, password} = req.body;

    //check if email and password exists => user entered these fields
    if (!email || !password) {
        return next(new AppError("Please provide email and password", 400));
    }

    //check if user exists and password is correct
    //we have restricted the default selection of password, so we explicitly select password
    let user = await User.findOne({email: email}).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) return next(new AppError("Incorrect email or password!", 401));

    user = {...user}._doc;

    createSendToken(user, 200, res);
});

exports.logout = catchAsync(async (req, res, next) => {
    const options = process.env.NODE_ENV === "development" ? {
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), httpOnly: true, secure: false,
    } : {
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), secure: true, domain: process.env.DOMAIN
    };
    res.cookie("jwt", "", options).json({
        status: "success", message: "cookie deleted"
    })

});

//makes sure that user is logged in == has a valid bearer token
//if all is good, that user is added to the req
exports.protect = catchAsync(async (req, res, next) => {
    let token = req.cookies.jwt;

    // check if there is a token
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError("You are not logged in! Please log in again.", 401));
    }

    // verify the token
    //verify also accepts a callback function, but we will make it return a promise
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // check if user still exists => to check the case if user has jwt token but the user was deleted!
    const freshUser = await User.findOne({_id: decoded.id});
    if (!freshUser) {
        return next(new AppError("The user belonging to this token does not exist.", 401));
    }

    // check if user changed password after jwt was issued
    if (freshUser.changePasswordAfter(decoded.iat)) {
        return next(new AppError("User recently changed their password! Please login again.", 401));
    }

    //grant access to the protected rout
    //also add this user to the request object
    req.user = freshUser;
    next();
});

//functionality to update/reset password is not implemented
