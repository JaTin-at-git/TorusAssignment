const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator"); //provides various schema validators
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "Email is must!"],
        validate: [validator.isEmail, "Please provide a valid email!"],
    }, name: {
        type: String,
        required: [true, "A user must have a name"],
        minLength: [5, "name too short(min=5)!"],
        maxLength: [15, "name too long(max=25)!"],
    }, password: {
        type: String, required: [true, "Please create a password!"], minlength: 8, select: false, //do not select this ever
    }, passwordConfirm: {
        type: String, required: [true, "Please confirm the password!"], validate: {
            // This work on SAVE!!
            validator: function (el) {
                return el === this.password;
            }, message: "Passwords are not the same!",
        },
    }, personalTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    assignedTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    assignedToOtherTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }]
});

//before saving, encrypt the password and remove confirm password
userSchema.pre("save", async function (next) {
    // no need to do this every time, do only when password in modified
    if (!this.isModified("password")) return next();
    //encrypt the password
    this.password = await bcryptjs.hash(this.password, 12);
    this.passwordConfirm = undefined; //don't save this in the database
    next();
});

//method to check the password
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcryptjs.compare(candidatePassword, userPassword);
};

//returns true if token was created BEFORE change in password
userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(`${this.passwordChangedAt.getTime() / 1000}`, 10);
        return JWTTimeStamp < changedTimestamp;
    }
    return false;
};

//modify passwordChangedAt when password is changed
userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 10000;
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
