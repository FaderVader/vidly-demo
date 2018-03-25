const mongoose = require('mongoose');
const Joi = require('joi');

// validation for document
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255,
        trim: true

    },
    password: {
        type: String,
        required: true,
        minlength: 1,
        maxlength:1024
    }
});

const User = mongoose.model('User', userSchema);


// validation for request
function validateUser(user) {
    const schema = {   
        name: Joi.string().min(2).max(255).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(1).max(255).required()
    }
    return Joi.validate(user, schema);
};

module.exports.validateUser = validateUser;
module.exports.userSchema = userSchema;
module.exports.User = User;