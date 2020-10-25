const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: false,
        min: 3,
        max: 255
    },
    deviceId: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null
    }

});

module.exports = mongoose.model('User', userSchema);