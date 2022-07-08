const mongoose = require("mongoose");

/*
    User model
*/

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: false
    },
    lastname: {
        type: String,
        trim: true,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    level: {
        type: Number,
        min: 0,
        max: 2,
        default: 2,
        required: true,
    },
    avatar: {
        type: String,
        required: false,
    },
    status: {
        type: Number,
        min: 0,
        default: 0,
        required: true
    },
    app: {
        type: String,
        required: true,
        trim: true,
    },
    confirmationId: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);