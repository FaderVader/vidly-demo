const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema ({
    isGold: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required:true,
        minlength: 3,
        maxlength: 255
    },
    phone: {
        type: Number,
        required: true,
        minlength: 6,
        maxlength: 12
    }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(3).max(255).required(),
        phone: Joi.number().min(6).required(),
        isGold: Joi.boolean()
    }
    return Joi.validate(customer, schema);
};

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;