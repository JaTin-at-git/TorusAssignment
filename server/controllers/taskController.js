const User = require("../model/UserModel");
const catchAsync = require("../util/catchAsync");
const axios = require("axios");
const AppError = require("../util/appError");
const Task = require("../model/TaskModel");
const mongoose = require("mongoose");

exports.getTasks = catchAsync(async (req, res, next) => {
    const user = {...req.user._doc};
    const {
        taskType = 'personal',
        page = 1,
        limit = 10,
        status,
        priority,
        assignedUserEmail} = req.query;

    const skip = (page - 1) * limit;

    let query = {};
    let tasks;

    if (taskType === 'personal') {
        query._id = {$in: user.personalTasks}; // Filter by user's personal tasks
    } else if (taskType === 'assigned') {
        query._id = {$in: user.assignedTasks}; // Filter by user's assigned tasks
    } else if (taskType === 'assignedToOthers') {
        if (!user.isAdmin) {
            return next(new AppError("You don't have permission to view assignedToOtherTasks.", 403));
        }
        query._id = {$in: user.assignedToOtherTasks}; // Admin viewing tasks assigned to others
    } else {
        return next(new AppError('Invalid task type!', 400));
    }

    // Additional filters based on query parameters
    if (status) query.status = status;
    if (priority) query.priority = priority;

    // Filter by assigned user email, only applicable for admin or assigned tasks
    if (assignedUserEmail) {
        const assignedUser = await User.findOne({email: assignedUserEmail});
        if (!assignedUser) {
            return next(new AppError(`User with email ${assignedUserEmail} not found.`, 404));
        }
        query.assignedUser = assignedUser._id;
    }

    console.log(query);

    // Fetch tasks based on query, with pagination and sorting
    tasks = await Task.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({dueDate: 1}) // Sorting by dueDate in ascending order
        .populate('assignedUser', 'name email') // Populate user info in the result
        .populate('createdBy', 'name email');

    if (!tasks || tasks.length === 0) {
        return next(new AppError('No tasks found with the specified filters!', 404));
    }

    // Send response with paginated tasks and filters
    res.status(200).json({
        status: 'success', results: tasks.length, data: {
            tasks
        }
    });

});