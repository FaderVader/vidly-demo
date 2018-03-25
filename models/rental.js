const mongoose = require('mongoose');
const Joi = require('joi');


const {Genre, genreSchema} = require('./genre');
const {Customer, customerSchema} = require('./customer');
const {Movie, movieSchema} = require('./movie');


// validate the document
const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
            isGold: {
                type: Boolean,
                default: false
            }, 
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        }), 
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

const Rental = mongoose.model('Rental', rentalSchema);

// validate the request
function validateRental(rental) {
    const schema = {
        movieId: Joi.objectId().required(),
        customerId: Joi.objectId().required()        
    };
    return Joi.validate(rental, schema);
};

module.exports.rentalSchema = rentalSchema;
module.exports.Rental = Rental;
module.exports.validateRental = validateRental;