const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        minLength: [5, "Title too short"],
        required: true
    }, description: {
        type: String,
        minLength: [5, "Description too short!(min 5 characters)"],
        maxLength: [300, "Description too long!(max 300 characters)"],
        required: true
    }, dueDate: {
        type: Date,
        required: true
    }, status: {
        type: String,
        enum: ['ToDo', 'In Progress', 'Completed'],
        default: 'ToDo'
    }, assignedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'ToDo'
    }
}, {
    timestamps: true
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
